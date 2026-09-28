import React, { useEffect, useRef, useState } from "react";
import { music } from "../lib/music.js";
import { invitationUrl } from "../lib/store.js";

/* ---------------------------------------------------------------------------
   Atmospheric backdrop: warm out-of-focus environment rendered with layered
   gradients + grain — supports the envelope instead of competing with it.
--------------------------------------------------------------------------- */
export function Atmosphere({ inv }) {
  const c = inv.design.colors;
  const style = inv.design.backgroundStyle;
  return (
    <div className={"atmos style-" + style} aria-hidden="true"
      style={{
        "--bg-top": c.bgTop,
        "--bg-mid": c.bgMid,
        "--bg-bottom": c.bgBottom,
        "--bg-photo": inv.design.backgroundImage ? `url(${inv.design.backgroundImage})` : "none",
      }}>
      <div className="atmos-photo" />
      <div className="atmos-warm" />
      <div className="atmos-bokeh b1" /><div className="atmos-bokeh b2" />
      <div className="atmos-bokeh b3" /><div className="atmos-bokeh b4" />
      <div className="atmos-table" />
      <div className="atmos-grain" />
      <div className="atmos-vignette" />
    </div>
  );
}

/* Sparse drifting petals — atmosphere only */
function Petals({ color }) {
  const items = React.useMemo(
    () => [...Array(8)].map((_, i) => ({
      left: (i * 12.7 + 6) % 100,
      delay: -(i * 2.4),
      dur: 17 + ((i * 3.7) % 9),
      size: 6 + ((i * 5) % 6),
      op: 0.14 + ((i * 7) % 4) / 24,
    })),
    []
  );
  return (
    <div className="petals" aria-hidden="true">
      {items.map((p, i) => (
        <span key={i} className="petal"
          style={{
            left: p.left + "%", width: p.size, height: p.size * 1.4, opacity: p.op,
            background: `linear-gradient(150deg, ${color}, rgba(255,255,255,.6))`,
            animationDelay: p.delay + "s", animationDuration: p.dur + "s",
          }} />
      ))}
    </div>
  );
}

export default function Experience({ inv, editable, onEdit }) {
  // stage: 1 closed · 2 seal breaking · 3 flap open + card rising · 4 settled
  const [stage, setStage] = useState(1);
  const [scrolled, setScrolled] = useState(false);
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [toast, setToast] = useState("");
  const [booted, setBooted] = useState(false);
  const timers = useRef([]);
  
  useEffect(() => {
    const t = setTimeout(() => setBooted(true), 1000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    music.configure({ url: inv.music.url, volume: inv.music.volume });
    if (!inv.music.enabled) { music.pause(); return; }
    if (inv.music.autoplay && !editable) {
      const arm = () => music.play();
      window.addEventListener("pointerdown", arm, { once: true });
      return () => window.removeEventListener("pointerdown", arm);
    }
  }, [inv.music.url, inv.music.volume, inv.music.enabled, inv.music.autoplay, editable]);

  useEffect(() => music.subscribe(setMusicOn), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openEnvelope = () => {
    if (stage !== 1) return;
    if (inv.music.enabled && inv.music.autoplay && !music.on) music.play();
    setStage(2);
    timers.current.push(setTimeout(() => setStage(3), 640));
    timers.current.push(setTimeout(() => setStage(4), 1820));
  };

  const share = async () => {
    const url = invitationUrl(inv.slug, inv.guest);
    const payload = {
      title: `${inv.names.one} & ${inv.names.two} — ${inv.header.kicker}`,
      text: inv.message.line1,
      url,
    };
    try {
      if (navigator.share) { await navigator.share(payload); return; }
    } catch { /* dismissed by guest */ }
    try {
      await navigator.clipboard.writeText(url);
      setToast("Invitation link copied");
    } catch {
      setToast(url);
    }
    setTimeout(() => setToast(""), 2600);
  };

  const toggleMusic = () => {
    if (music.on) music.pause();
    else music.play();
  };

  return (
    <div className={"exp stage-" + stage + " lang-" + inv.lang + (scrolled ? " scrolled" : "")}>
      <Atmosphere inv={inv} />
      <Petals color={inv.design.colors.seal} />

      {/* loading state */}
      <div className={"loader" + (booted ? " hide" : "")}>
        <svg viewBox="0 0 64 64" className="loader-mark" aria-hidden="true">
          <circle cx="32" cy="32" r="27" />
          <path d="M32 15c8 8 8 16 0 22-8-6-8-14 0-22z" />
          <path d="M20 40c8 4 16 4 24 0" />
        </svg>
        <p>{inv.ui.loadingLabel}</p>
        <span className="loader-bar"><i /></span>
      </div>

      {/* floating controls */}
      <header className="topbar">
        <button className={"icon-btn music" + (musicOn ? " on" : "")} onClick={toggleMusic}
          aria-label={musicOn ? "Pause music" : "Play music"} title="Background music">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 18V6l10-2v12" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
            <circle cx="6.6" cy="18" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.35" />
            <circle cx="16.6" cy="16" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.35" />
          </svg>
          <span className="eq"><i /><i /><i /></span>
        </button>
        <div className="brand">{inv.ui.brand}</div>
        <button className="icon-btn" onClick={share} aria-label="Share invitation" title="Share">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3.5v11M12 3.5 8.4 7.1M12 3.5l3.6 3.6" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
            <path d="M5 12.5V19a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 19v-6.5" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      {/* HERO — the envelope ------------------------------------------------ */}
      <section className="hero">
        <HeroStage inv={inv} stage={stage} onOpen={openEnvelope} />
        <button className={"scroll-cue" + (stage === 4 ? " show" : "")}
          onClick={() => window.scrollTo({ top: window.innerHeight * 0.72, behavior: "smooth" })}>
          <span>Read the invitation</span>
          <i />
        </button>
      </section>

      {/* THE INVITATION ----------------------------------------------------- */}
      <main className={"reveal" + (stage === 4 ? " open" : "")}>
        <div className="card-holder">
          <LazyCard inv={inv} revealed={stage === 4} onOpenRsvp={() => setRsvpOpen(true)} />
        </div>
        <footer className="exp-foot">
          <span>{inv.ui.credit}</span>
          {editable && onEdit && <button className="linklike" onClick={onEdit}>Open the editor →</button>}
        </footer>
      </main>

      {toast && <div className="toast">{toast}</div>}
      {rsvpOpen && <RsvpMount inv={inv} onClose={() => setRsvpOpen(false)} />}
    </div>
  );
}

/* Lazy mounts so the opening sequence stays at 60fps on phones */
function LazyCard(props) {
  const [C, setC] = useState(null);
  useEffect(() => { import("./InvitationCard.jsx").then((m) => setC(() => m.default)); }, []);
  if (!C) return <div className="card skeleton" />;
  return <C {...props} />;
}

function RsvpMount(props) {
  const [R, setR] = useState(null);
  useEffect(() => { import("./Rsvp.jsx").then((m) => setR(() => m.default)); }, []);
  if (!R) return null;
  return <R {...props} />;
}

/* Wrapper that keeps the envelope mounted through the whole transition */
import Envelope from "./Envelope.jsx";
function HeroStage({ inv, stage, onOpen }) {
  return (
    <div className="hero-inner">
      <Envelope inv={inv} stage={stage} onOpen={onOpen} />
    </div>
  );
}
