// Generative ambient wedding music (WebAudio) — used when no custom track URL
// is supplied, so the experience never depends on external audio assets.

const SCALE = [0, 2, 4, 7, 9]; // major pentatonic
const VOICES = [
  { root: 55, pattern: [0, null, 4, null, 7, null, 4, null] },
  { root: 62, pattern: [null, 9, null, 7, null, 4, null, 2] },
  { root: 60, pattern: [7, null, 11, null, 9, null, 4, null] },
];

class AmbientEngine {
  constructor() {
    this.ctx = null;
    this.playing = false;
    this.step = 0;
    this.timer = null;
    this.volume = 0.5;
  }

  ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.0;
      this.wet = this.ctx.createGain();
      this.wet.gain.value = 0.35;
      this.conv = this.ctx.createConvolver();
      this.conv.buffer = this._impulse(2.6, 2.5);
      this.wet.connect(this.conv);
      this.conv.connect(this.master);
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") this.ctx.resume();
    return this.ctx;
  }

  _impulse(dur, decay) {
    const ctx = this.ctx;
    const len = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
      }
    }
    return buf;
  }

  _note(freq, t, dur, gainVal, type = "sine", pan = 0) {
    const ctx = this.ctx;
    const o = ctx.createOscillator();
    const o2 = ctx.createOscillator();
    const g = ctx.createGain();
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 2400;
    o.type = type;
    o2.type = "triangle";
    o.frequency.value = freq;
    o2.frequency.value = freq * 2.001;
    const g2 = ctx.createGain();
    g2.gain.value = 0.18;
    o2.connect(g2).connect(g);
    o.connect(g);
    const p = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    if (p) { p.pan.value = pan; g.connect(lp).connect(p); p.connect(this.master); p.connect(this.wet); }
    else { g.connect(lp).connect(this.master); g.connect(this.wet); }
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gainVal, t + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.start(t); o2.start(t);
    o.stop(t + dur + 0.05); o2.stop(t + dur + 0.05);
  }

  _tick() {
    const ctx = this.ctx;
    if (!ctx || !this.playing) return;
    const t = ctx.currentTime + 0.08;
    const v = VOICES[this.step % VOICES.length];
    const semi = v.pattern[(this.step * 3) % v.pattern.length];
    if (semi !== null && semi !== undefined) {
      const oct = Math.random() < 0.25 ? 12 : 0;
      const f = 440 * Math.pow(2, (v.root - 69 + semi + oct) / 12);
      this._note(f, t, 2.4 + Math.random() * 1.6, 0.10, "sine", (Math.random() - 0.5) * 0.6);
    }
    if (this.step % 8 === 0) {
      const bass = 440 * Math.pow(2, (45 + SCALE[0]) / 12 - 0);
      this._note(bass / 2, t, 3.6, 0.07, "triangle", 0);
    }
    if (this.step % 16 === 6) {
      const padRoot = 440 * Math.pow(2, (52 + SCALE[2]) / 12);
      [0, 4, 7, 11].forEach((iv, i) =>
        this._note(padRoot * Math.pow(2, iv / 12), t + i * 0.02, 5.2, 0.028, "sine", (i - 1.5) * 0.35)
      );
    }
    this.step++;
  }

  start() {
    const ctx = this.ensure();
    if (this.playing) return;
    this.playing = true;
    this.master.gain.cancelScheduledValues(ctx.currentTime);
    this.master.gain.setValueAtTime(this.master.gain.value, ctx.currentTime);
    this.master.gain.linearRampToValueAtTime(this.volume * 0.9, ctx.currentTime + 2.2);
    this.timer = setInterval(() => this._tick(), 620);
    this._tick();
  }

  stop() {
    if (!this.ctx) return;
    this.playing = false;
    clearInterval(this.timer);
    this.master.gain.cancelScheduledValues(this.ctx.currentTime);
    this.master.gain.setTargetAtTime(0.0, this.ctx.currentTime, 0.6);
  }

  setVolume(v) {
    this.volume = v;
    if (this.ctx && this.playing) {
      this.master.gain.setTargetAtTime(v * 0.9, this.ctx.currentTime, 0.2);
    }
  }
}

class TrackEngine {
  constructor() {
    this.el = new Audio();
    this.el.loop = true;
    this.playing = false;
  }
  ensure(url) {
    if (this.el.src !== url) this.el.src = url;
    return this.el;
  }
  start(url) {
    const el = this.ensure(url);
    el.volume = this._v ?? 0.5;
    const p = el.play();
    this.playing = true;
    if (p && p.catch) p.catch(() => { this.playing = false; });
  }
  stop() { this.el.pause(); this.playing = false; }
  setVolume(v) { this._v = v; this.el.volume = v; }
}

class MusicManager {
  constructor() {
    this.ambient = new AmbientEngine();
    this.track = new TrackEngine();
    this.on = false;
    this.url = "";
    this.volume = 0.5;
    this.listeners = new Set();
  }
  configure({ url, volume }) {
    this.url = url || "";
    if (volume != null) this.volume = volume;
    this.ambient.setVolume(this.volume);
    this.track.setVolume(this.volume);
    if (this.on) this._apply();
  }
  _apply() { if (this.url) this.track.start(this.url); else this.ambient.start(); }
  toggle() { this.on ? this.pause() : this.play(); }
  play() {
    this.on = true;
    this._apply();
    this._emit();
  }
  pause() {
    this.on = false;
    this.ambient.stop();
    this.track.stop();
    this._emit();
  }
  subscribe(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn); }
  _emit() { this.listeners.forEach((f) => f(this.on)); }
}

export const music = new MusicManager();
