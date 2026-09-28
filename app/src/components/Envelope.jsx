import React, { useEffect, useRef, useState } from "react";
import { SealArt, Sprig } from "./Botanicals.jsx";

/* ---------------------------------------------------------------------------
   The hero object: a physically-modelled luxury envelope.

   Geometry (percent of the envelope box):
     back panel  : full rect
     inner lining: inset rect (visible once the flap lifts)
     left / right: triangular side folds (clip-path)
     bottom      : upward triangle apex at y = 58%
     card        : invitation sheet that rises out of the pocket
     flap        : triangle with apex pointing DOWN at y = 60%, hinged at top
     seal        : wax disc centred on the flap apex
--------------------------------------------------------------------------- */
export default function Envelope({ inv, stage, onOpen }) {
  const [pressed, setPressed] = useState(false);
  const ref = useRef(null);

  const c = inv.design.colors;
  const mono = (inv.design.monogram || inv.monogram ||
    `${(inv.names.one || "?").charAt(0)}${(inv.names.two || "?").charAt(0)}`).toUpperCase().slice(0, 3);

  const opening = stage >= 2;
  const cardOut = stage >= 3;
  const done = stage >= 4;

  // subtle parallax tilt while closed
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const move = (e) => {
      if (stage !== 1) return;
      const p = e.touches ? e.touches[0] : e;
      const r = el.getBoundingClientRect();
      const dx = (p.clientX - (r.left + r.width / 2)) / r.width;
      const dy = (p.clientY - (r.top + r.height / 2)) / r.height;
      el.style.setProperty("--tiltX", (-dy * 4).toFixed(2) + "deg");
      el.style.setProperty("--tiltY", (dx * 5).toFixed(2) + "deg");
      el.style.setProperty("--mx", (50 + dx * 26).toFixed(1) + "%");
      el.style.setProperty("--my", (42 + dy * 26).toFixed(1) + "%");
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [stage]);

  const tapSeal = (e) => {
    e.preventDefault();
    if (stage !== 1) return;
    setPressed(true);
    setTimeout(() => setPressed(false), 260);
    onOpen();
  };

  return (
    <div
      className={"env-scene" + (opening ? " is-opening" : "") + (done ? " is-done" : "")}
      style={{ "--env": c.envelope, "--env-edge": c.envelopeEdge, "--mx": "50%", "--my": "42%" }}
      ref={ref}
    >
      <div className="env-tilt">
        <div className={"envelope" + (pressed ? " pressed" : "")}>
          {/* paper body ---------------------------------------------------- */}
          <div className="env-back">
            <div className="env-paper" />
            {inv.design.envelopePattern && (
              <svg className="env-damask" viewBox="0 0 200 200" aria-hidden="true">
                <defs>
                  <pattern id="damask" width="50" height="50" patternUnits="userSpaceOnUse">
                    <g fill="none" stroke="currentColor" strokeWidth=".7" opacity=".5">
                      <path d="M25 6 C 33 14 33 22 25 28 C 17 22 17 14 25 6 Z" />
                      <path d="M25 28 C 25 34 21 38 15 40 M25 28 C 25 34 29 38 35 40" />
                      <circle cx="25" cy="17" r="2.2" />
                      <path d="M4 44 C 10 40 12 34 11 27 M46 6 C 40 10 38 16 39 23" />
                    </g>
                  </pattern>
                </defs>
                <rect width="200" height="200" fill="url(#damask)" />
              </svg>
            )}
            <div className="env-deckle" />
          </div>

          {/* inner lining seen when opened ---------------------------------- */}
          <div className="env-lining">
            <div className="lining-watermark">
              <span className="wm-mono">{mono}</span>
              <span className="wm-line">{inv.header.kicker}</span>
            </div>
          </div>

          {/* the invitation card inside ------------------------------------- */}
          <div className={"card-pocket" + (cardOut ? " out" : "")}>
            <div className="inner-card">
              <div className="ic-frame">
                <Sprig className="ic-sprig ic-sprig-l" />
                <div className="ic-body">
                  <p className="ic-kicker">{inv.header.kicker}</p>
                  <p className="ic-date">{inv.header.dateLine}</p>
                  <p className="ic-names">
                    <span>{inv.names.one}</span>
                    <em>{inv.names.conj}</em>
                    <span>{inv.names.two}</span>
                  </p>
                  <p className="ic-note">{inv.message.line1}</p>
                </div>
                <Sprig className="ic-sprig ic-sprig-r" />
              </div>
            </div>
          </div>

          {/* front folds ---------------------------------------------------- */}
          <div className="fold fold-left" />
          <div className="fold fold-right" />
          <div className="fold fold-bottom">
            <div className="fold-shadowline" />
          </div>

          {/* lighting sweep across the paper */}
          <div className="env-light" />

          {/* top flap (hinged at the top edge, rotates away from viewer) */}
          <div className="flap-wrap">
            <div className="flap">
              <div className="flap-face flap-front">
                <div className="flap-crease" />
                <div className="flap-edge" />
              </div>
              <div className="flap-face flap-back" />
            </div>
          </div>

          {/* wax seal ------------------------------------------------------- */}
          <button
            type="button"
            className={"seal" + (stage === 2 ? " cracking" : "") + (stage >= 3 ? " gone" : "")}
            onPointerDown={tapSeal}
            onClick={tapSeal}
            aria-label="Open the invitation"
            style={{ "--seal-hi": shade(c.seal, 0.42), "--seal": c.seal, "--seal-deep": c.sealDeep }}
          >
            <span className="seal-glow" />
            <SealArt monogram={mono} font={inv.design.fonts.script} />
            <span className="seal-wax-drip" />
          </button>

          {/* wax shards thrown when the seal breaks */}
          <div className="shards" aria-hidden="true">
            {[...Array(9)].map((_, i) => (
              <i
                key={i}
                style={{
                  "--a": `${(i * 40 + 15) % 360}deg`,
                  "--d": `${28 + (i % 4) * 9}px`,
                  "--w": `${5 + (i % 3) * 3}px`,
                  "--h": `${4 + (i % 4) * 2.5}px`,
                  background: `linear-gradient(140deg, ${shade(c.seal, 0.3)}, ${c.sealDeep})`,
                }}
              />
            ))}
          </div>

          <div className="env-dropshadow" />
        </div>
      </div>

      {/* hint under the envelope */}
      <div className={"hint" + (stage > 1 ? " hide" : "")}>
        <span className="hint-ring" />
        <span className="hint-text">{inv.ui?.tapLabel || "Tap the seal to open"}</span>
      </div>
    </div>
  );
}

/* lighten/darken a hex colour */
export function shade(hex, amt) {
  const h = (hex || "#000").replace("#", "");
  const n = h.length === 3 ? h.split("").map((x) => x + x).join("") : h;
  const num = parseInt(n.slice(0, 6), 16);
  let r = (num >> 16) & 255, g = (num >> 8) & 255, b = num & 255;
  const f = (v) => Math.max(0, Math.min(255, Math.round(v + (amt > 0 ? (255 - v) * amt : v * amt))));
  r = f(r); g = f(g); b = f(b);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
