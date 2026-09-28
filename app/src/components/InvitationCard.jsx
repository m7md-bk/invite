import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Branch, CornerFlourish, Divider, Sprig, SwanScene, SingleSwan, FloatingHearts,
} from "./Botanicals.jsx";

function Countdown({ target }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, new Date(target).getTime() - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const cells = [[d, "Days"], [h, "Hours"], [m, "Min"], [s, "Sec"]];
  return (
    <div className="countdown" aria-label="countdown to the wedding">
      {cells.map(([v, l], i) => (
        <div className="cd-cell" key={l}>
          <span className="cd-num">{String(v).padStart(2, "0")}</span>
          <span className="cd-lbl">{l}</span>
          {i < 3 && <span className="cd-dot">·</span>}
        </div>
      ))}
    </div>
  );
}

export default function InvitationCard({ inv, revealed, onOpenRsvp }) {
  const c = inv.design.colors;
  const fs = inv.design.fonts;
  const sz = inv.design.sizes || { names: 1, body: 1 };
  const bilingual = inv.lang === "both";
  const arabic = inv.lang === "ar";
  const ref = useRef(null);

  // staged reveal of content once the card settles
  const [lit, setLit] = useState(0);
  useEffect(() => {
    if (!revealed) { setLit(0); return; }
    let n = 0;
    const timers = [140, 340, 540, 740, 940, 1140].map((t) =>
      setTimeout(() => setLit((v) => Math.max(v, n++ + 1)), t)
    );
    return () => timers.forEach(clearTimeout);
  }, [revealed]);

  const floral = inv.design.floral;
  const swans = inv.design.swans;

  const styleVars = useMemo(
    () => ({
      "--display": `'${fs.display}', serif`,
      "--script": `'${fs.script}', cursive`,
      "--caps": `'${fs.smallcaps}', sans-serif`,
      "--arabic": `'${fs.arabic}', serif`,
      "--ink": c.ink,
      "--soft": c.soft,
      "--paper": c.paper,
      "--paper-deep": c.paperDeep,
      "--accent": c.accent,
      "--seal": c.seal,
      "--names-scale": sz.names,
      "--body-scale": sz.body,
      "--tex": inv.design.texture ?? 0.55,
    }),
    [c, fs, sz]
  );

  const addToCalendar = () => {
    const t = inv.countdown.target;
    const start = new Date(t);
    const end = new Date(start.getTime() + 5 * 3600000);
    const fmt = (x) => x.toISOString().replace(/[-:]|\.\d{3}/g, "").toUpperCase();
    const url =
      `https://calendar.google.com/calendar/render?action=TEMPLATE` +
      `&text=${encodeURIComponent(inv.names.one + " & " + inv.names.two + " — Wedding")}` +
      `&dates=${fmt(start)}/${fmt(end)}` +
      `&location=${encodeURIComponent(inv.event.venue + ", " + inv.event.address)}` +
      `&details=${encodeURIComponent(inv.message.line1)}`;
    window.open(url, "_blank", "noopener");
  };

  const openMaps = () => window.open(inv.event.mapUrl, "_blank", "noopener");

  return (
    <article
      className={"card" + (revealed ? " revealed" : "")}
      style={styleVars}
      dir={arabic ? "rtl" : "ltr"}
      lang={arabic ? "ar" : "en"}
      ref={ref}
    >
      {/* printed paper surface */}
      <div className="card-paper" />
      <div className="card-grain" />
      <div className="card-vignette" />

      {/* thin gold rule frame */}
      <div className="card-rule" />

      {/* botanical border ---------------------------------------------- */}
      {floral !== "none" && (
        <div className="floral-layer" aria-hidden="true">
          {floral === "botanical" && (
            <>
              <Branch className="fb fb-top" />
              <Branch className="fb fb-bottom" flip />
              <Sprig className="fs-side fs-left" />
              <Sprig className="fs-side fs-right" />
            </>
          )}
          {floral === "cornerwreath" && (
            <>
              <CornerFlourish className="fc fc-tl" />
              <CornerFlourish className="fc fc-tr" />
              <CornerFlourish className="fc fc-bl" />
              <CornerFlourish className="fc fc-br" />
            </>
          )}
          {floral === "fullwreath" && (
            <>
              <Branch className="fb fb-top" />
              <Branch className="fb fb-bottom" flip />
              <CornerFlourish className="fc fc-tl" />
              <CornerFlourish className="fc fc-tr" />
              <CornerFlourish className="fc fc-bl" />
              <CornerFlourish className="fc fc-br" />
              <Sprig className="fs-side fs-left" />
              <Sprig className="fs-side fs-right" />
            </>
          )}
        </div>
      )}

      <div className="card-inner">
        {/* ---------------------------------------------------------- top */}
        <header className={"sec sec-1 step-" + (lit >= 1 ? "on" : "off")}>
          <p className="overline">{inv.header.kicker}</p>
          <p className="dateline">{inv.header.dateLine}</p>
          {bilingual && <p className="ar overline-ar">{inv.header.kickerAr}</p>}
        </header>

        <div className={"sec sec-orner step-" + (lit >= 2 ? "on" : "off")}>
          <Divider className="orn-divider" />
        </div>

        {/* --------------------------------------------------------- names */}
        <section className={"names-block step-" + (lit >= 3 ? "on" : "off")}>
          {!arabic && (
            <>
              <h1 className="name name-1">{inv.names.one}</h1>
              <p className="conj">{inv.names.conj}</p>
              <h1 className="name name-2">{inv.names.two}</h1>
            </>
          )}
          {(arabic || bilingual) && (
            <div className={"ar-names" + (bilingual ? " bi" : "")}>
              <h1 className="name ar-name">{inv.names.oneAr}</h1>
              {!bilingual && <p className="conj ar-conj">{inv.names.conj === "&" ? "و" : inv.names.conj}</p>}
              {bilingual && <span className="amp-ar">و</span>}
              <h1 className="name ar-name">{inv.names.twoAr}</h1>
            </div>
          )}
          {inv.guest && (
            <p className={"guest-line step-" + (lit >= 4 ? "on" : "off")}>
              <span className="caps">For</span> {inv.guest}
            </p>
          )}
        </section>

        {/* ------------------------------------------------------- message */}
        <section className={"sec sec-msg step-" + (lit >= 4 ? "on" : "off")}>
          <p className="lead">{arabic ? inv.message.line1Ar : inv.message.line1}</p>
          {inv.message.line2 && <p className="sub-lead">{inv.message.line2}</p>}
          {bilingual && <p className="ar lead-ar">{inv.message.line1Ar}</p>}
          {inv.message.verse && <p className="verse">{inv.message.verse}</p>}
        </section>

        {/* -------------------------------------------------------- details */}
        <section className={"sec sec-details step-" + (lit >= 5 ? "on" : "off")}>
          <Divider className="orn-divider sm" />
          <p className="detail-big">{arabic ? inv.event.dateLongAr : inv.event.dateLong}</p>
          <p className="detail">{inv.event.time}</p>
          <div className="venue">
            <svg viewBox="0 0 24 24" className="pin" aria-hidden="true">
              <path d="M12 2c-3.9 0-7 3.1-7 7 0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7z" fill="none" stroke="currentColor" strokeWidth="1.1" />
              <circle cx="12" cy="9" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.1" />
            </svg>
            <div>
              <p className="venue-name">{arabic ? inv.event.venueAr : inv.event.venue}</p>
              <p className="venue-addr">{inv.event.address}</p>
            </div>
          </div>
          <div className="timings">
            <div><span className="caps">{inv.event.ceremony.split("·")[0]}</span><em>{inv.event.ceremony.split("·")[1]}</em></div>
            <span className="tsep" />
            <div><span className="caps">{inv.event.reception.split("·")[0]}</span><em>{inv.event.reception.split("·")[1]}</em></div>
          </div>
          {inv.countdown.enabled && !arabic && <Countdown target={inv.countdown.target} />}
          <div className="actions">
            <button className="btn btn-solid" onClick={addToCalendar}>Add to calendar</button>
            <button className="btn btn-line" onClick={openMaps}>Directions</button>
          </div>
        </section>

        {/* --------------------------------------------------------- gallery */}
        {inv.gallery.enabled && inv.gallery.images.length > 0 && (
          <section className={"sec sec-gallery step-" + (lit >= 5 ? "on" : "off")}>
            <Divider className="orn-divider sm" />
            <div className={"gallery g" + Math.min(3, inv.gallery.images.length)}>
              {inv.gallery.images.slice(0, 6).map((src, i) => (
                <figure key={i} style={{ "--i": i }}>
                  <img src={src} alt={inv.gallery.captions ? `Memory ${i + 1}` : ""} loading="lazy" />
                  {inv.gallery.captions && <figcaption>{`${inv.names.one} & ${inv.names.two} · ${i + 1}`}</figcaption>}
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* ----------------------------------------------------- illustration */}
        <section className={"sec sec-art step-" + (lit >= 6 ? "on" : "off")}>
          {swans === "pair" && <SwanScene className="swan-scene" />}
          {swans === "single" && <SingleSwan className="swan-single" />}
          {swans === "hearts" && <FloatingHearts className="swan-hearts" />}
        </section>

        {/* ------------------------------------------------------------ RSVP */}
        {inv.rsvp.enabled && (
          <section className={"sec sec-rsvp step-" + (lit >= 6 ? "on" : "off")}>
            <p className="rsvp-title">{inv.rsvp.title}</p>
            <button className="btn btn-seal" onClick={onOpenRsvp}>
              <span className="btn-mark" />
              RSVP
            </button>
          </section>
        )}

        {/* ----------------------------------------------------------- footer */}
        <footer className={"sec sec-foot step-" + (lit >= 6 ? "on" : "off")}>
          <Divider className="orn-divider xs" />
          <p className="foot-caps">#{(inv.hashtag || (inv.names.one + inv.names.two))
            .toLowerCase()
            .replace(/[^a-z0-9\u0600-\u06FF]+/g, "")}</p>
          <p className="foot-note">{inv.ui?.footNote || "With love, we await your presence."}</p>
        </footer>
      </div>
    </article>
  );
}
