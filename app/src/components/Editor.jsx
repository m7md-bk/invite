import React, { useEffect, useMemo, useState } from "react";
import Experience from "./Experience.jsx";
import { FONTS, THEMES, FLORALS, SWANS } from "../lib/defaults.js";
import { invitationUrl, saveInvitation, getRsvps } from "../lib/store.js";
import { music } from "../lib/music.js";

const TABS = [
  ["couple", "Couple"],
  ["event", "Event"],
  ["design", "Design"],
  ["media", "Photos & Music"],
  ["rsvp", "RSVP"],
  ["share", "Share"],
];

const Field = ({ label, children, hint }) => (
  <label className="fld">
    <span className="fld-l">{label}</span>
    {children}
    {hint && <em className="fld-h">{hint}</em>}
  </label>
);

const Text = ({ value, onChange, ...rest }) => (
  <input value={value ?? ""} onChange={(e) => onChange(e.target.value)} {...rest} />
);

const Area = ({ value, onChange, rows = 3 }) => (
  <textarea rows={rows} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
);

function fileToDataURL(file, maxW = 1200) {
  return new Promise((res) => {
    const fr = new FileReader();
    fr.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width);
        const cv = document.createElement("canvas");
        cv.width = Math.round(img.width * scale);
        cv.height = Math.round(img.height * scale);
        cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
        res(cv.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = () => res(fr.result);
      img.src = fr.result;
    };
    fr.readAsDataURL(file);
  });
}

export default function Editor({ inv: initial, onNavigate }) {
  const [inv, setInv] = useState(initial);
  const [tab, setTab] = useState("couple");
  const [saved, setSaved] = useState(false);
  const [preview, setPreview] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  // live persistence — every change is instantly reflected in the preview + URL
  useEffect(() => {
    saveInvitation(inv);
    setSaved(true);
    const t = setTimeout(() => setSaved(false), 900);
    return () => clearTimeout(t);
  }, [inv]);

  const set = (path, value) => {
    setInv((prev) => {
      const keys = path.split(".");
      const next = structuredClone(prev);
      let o = next;
      for (let i = 0; i < keys.length - 1; i++) o = o[keys[i]];
      o[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const url = invitationUrl(inv.slug);
  const rsvps = useMemo(() => getRsvps(inv.slug), [inv.slug, saved]);

  const applyTheme = (id) => {
    setInv((p) => ({ ...p, design: { ...p.design, theme: id, colors: { ...THEMES[id] } } }));
  };

  const addPhotos = async (files) => {
    const list = [...files].slice(0, 6);
    const data = await Promise.all(list.map((f) => fileToDataURL(f)));
    setInv((p) => ({ ...p, gallery: { ...p.gallery, images: [...p.gallery.images, ...data].slice(0, 6) } }));
  };

  const setBgImage = async (file) => {
    const data = await fileToDataURL(file, 1400);
    setInv((p) => ({ ...p, design: { ...p.design, backgroundImage: data, backgroundStyle: "photo" } }));
  };

  return (
    <div className="editor">
      <header className="ed-bar">
        <button className="ed-logo" onClick={() => onNavigate("/")}>
          <span className="lg-mark" /> Lumen <em>Studio</em>
        </button>
        <div className="ed-tabs">
          {TABS.map(([id, label]) => (
            <button key={id} className={"ed-tab" + (tab === id ? " active" : "")} onClick={() => setTab(id)}>
              {label}
            </button>
          ))}
        </div>
        <div className="ed-actions">
          <span className={"save-dot" + (saved ? " on" : "")}>{saved ? "Saved" : "Editing"}</span>
          <button className="btn btn-line sm" onClick={() => setPreview((v) => !v)}>
            {preview ? "Hide preview" : "Show preview"}
          </button>
          <button className="btn btn-solid sm" onClick={() => { saveInvitation(inv); onNavigate("/i/" + inv.slug); }}>
            View invitation
          </button>
        </div>
      </header>

      <div className={"ed-body" + (preview ? "" : " full")}>
        <aside className="ed-panel">
          {tab === "couple" && (
            <Section title="The couple" desc="Names are the focal point of the card.">
              <div className="grid2">
                <Field label="First name"><Text value={inv.names.one} onChange={(v) => set("names.one", v)} /></Field>
                <Field label="Second name"><Text value={inv.names.two} onChange={(v) => set("names.two", v)} /></Field>
              </div>
              <Field label="Connector (& / and / و)"><Text value={inv.names.conj} onChange={(v) => set("names.conj", v)} /></Field>
              <div className="grid2">
                <Field label="First name (Arabic)"><Text dir="rtl" value={inv.names.oneAr} onChange={(v) => set("names.oneAr", v)} /></Field>
                <Field label="Second name (Arabic)"><Text dir="rtl" value={inv.names.twoAr} onChange={(v) => set("names.twoAr", v)} /></Field>
              </div>
              <Field label="Language">
                <div className="seg">
                  {[["en", "English"], ["ar", "العربية"], ["both", "Bilingual"]].map(([v, l]) => (
                    <button key={v} className={"seg-b" + (inv.lang === v ? " on" : "")} onClick={() => set("lang", v)}>{l}</button>
                  ))}
                </div>
              </Field>
              <Field label="Hashtag"><Text value={inv.hashtag} onChange={(v) => set("hashtag", v)} /></Field>
              <Field label="Personalised addressee" hint="Shown under the names, e.g. “For Amina & family”. Leave empty to hide.">
                <Text value={inv.guest} onChange={(v) => set("guest", v)} placeholder="Guest name" />
              </Field>
            </Section>
          )}

          {tab === "event" && (
            <>
              <Section title="Header lines">
                <Field label="Kicker"><Text value={inv.header.kicker} onChange={(v) => set("header.kicker", v)} /></Field>
                <Field label="Date line"><Text value={inv.header.dateLine} onChange={(v) => set("header.dateLine", v)} /></Field>
                <Field label="Kicker (Arabic)"><Text dir="rtl" value={inv.header.kickerAr} onChange={(v) => set("header.kickerAr", v)} /></Field>
              </Section>
              <Section title="Wedding details">
                <Field label="Long date"><Text value={inv.event.dateLong} onChange={(v) => set("event.dateLong", v)} /></Field>
                <Field label="Time"><Text value={inv.event.time} onChange={(v) => set("event.time", v)} /></Field>
                <div className="grid2">
                  <Field label="Ceremony"><Text value={inv.event.ceremony} onChange={(v) => set("event.ceremony", v)} /></Field>
                  <Field label="Reception"><Text value={inv.event.reception} onChange={(v) => set("event.reception", v)} /></Field>
                </div>
                <Field label="Venue"><Text value={inv.event.venue} onChange={(v) => set("event.venue", v)} /></Field>
                <Field label="Address"><Text value={inv.event.address} onChange={(v) => set("event.address", v)} /></Field>
                <Field label="Maps link"><Text value={inv.event.mapUrl} onChange={(v) => set("event.mapUrl", v)} /></Field>
                <Field label="Countdown target (date & time)">
                  <input type="datetime-local" value={inv.countdown.target} onChange={(e) => set("countdown.target", e.target.value)} />
                </Field>
                <label className="check">
                  <input type="checkbox" checked={inv.countdown.enabled} onChange={(e) => set("countdown.enabled", e.target.checked)} />
                  <span>Show countdown</span>
                </label>
              </Section>
              <Section title="Words on the card">
                <Field label="Invitation line"><Area rows={2} value={inv.message.line1} onChange={(v) => set("message.line1", v)} /></Field>
                <Field label="Supporting line"><Area rows={2} value={inv.message.line2} onChange={(v) => set("message.line2", v)} /></Field>
                <Field label="Verse / quote"><Area rows={3} value={inv.message.verse} onChange={(v) => set("message.verse", v)} /></Field>
                <Field label="Invitation line (Arabic)"><Area rows={2} dir="rtl" value={inv.message.line1Ar} onChange={(v) => set("message.line1Ar", v)} /></Field>
                <Field label="Footer note"><Text value={inv.ui.footNote} onChange={(v) => set("ui.footNote", v)} /></Field>
              </Section>
            </>
          )}

          {tab === "design" && (
            <>
              <Section title="Palette" desc="Pick a starting palette, then fine-tune each colour.">
                <div className="themes">
                  {Object.values(THEMES).map((t) => (
                    <button key={t.id} className={"theme" + (inv.design.theme === t.id ? " on" : "")} onClick={() => applyTheme(t.id)}>
                      <span style={{ background: t.paper }}><i style={{ background: t.seal }} /></span>
                      <em>{t.label}</em>
                    </button>
                  ))}
                </div>
                <div className="colors">
                  {[
                    ["paper", "Paper"], ["ink", "Ink"], ["soft", "Secondary ink"],
                    ["seal", "Wax seal"], ["sealDeep", "Seal shadow"], ["envelope", "Envelope paper"],
                    ["envelopeEdge", "Fold edge"], ["accent", "Accent / gold"],
                    ["bgMid", "Backdrop"], ["bgBottom", "Backdrop deep"],
                  ].map(([k, label]) => (
                    <label className="color-i" key={k}>
                      <input type="color" value={inv.design.colors[k]}
                        onChange={(e) => set("design.colors." + k, e.target.value)} />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </Section>

              <Section title="Typography">
                <div className="grid2">
                  <Field label="Display serif">
                    <select value={inv.design.fonts.display} onChange={(e) => set("design.fonts.display", e.target.value)}>
                      {FONTS.display.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
                    </select>
                  </Field>
                  <Field label="Script (names)">
                    <select value={inv.design.fonts.script} onChange={(e) => set("design.fonts.script", e.target.value)}>
                      {FONTS.script.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
                    </select>
                  </Field>
                  <Field label="Small caps">
                    <select value={inv.design.fonts.smallcaps} onChange={(e) => set("design.fonts.smallcaps", e.target.value)}>
                      {FONTS.smallcaps.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
                    </select>
                  </Field>
                  <Field label="Arabic">
                    <select value={inv.design.fonts.arabic} onChange={(e) => set("design.fonts.arabic", e.target.value)}>
                      {FONTS.arabic.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
                    </select>
                  </Field>
                </div>
                <Field label={`Names size — ${Math.round(inv.design.sizes.names * 100)}%`}>
                  <input type="range" min=".7" max="1.5" step=".02" value={inv.design.sizes.names}
                    onChange={(e) => set("design.sizes.names", +e.target.value)} />
                </Field>
                <Field label={`Body size — ${Math.round(inv.design.sizes.body * 100)}%`}>
                  <input type="range" min=".85" max="1.25" step=".02" value={inv.design.sizes.body}
                    onChange={(e) => set("design.sizes.body", +e.target.value)} />
                </Field>
              </Section>

              <Section title="Envelope & seal">
                <Field label="Wax seal monogram"><Text maxLength={3} value={inv.design.monogram} onChange={(v) => set("design.monogram", v)} /></Field>
                <label className="check">
                  <input type="checkbox" checked={inv.design.envelopePattern} onChange={(e) => set("design.envelopePattern", e.target.checked)} />
                  <span>Embossed damask pattern on envelope</span>
                </label>
              </Section>

              <Section title="Decoration">
                <Field label="Botanical border">
                  <div className="seg wrap">
                    {Object.entries(FLORALS).map(([v, l]) => (
                      <button key={v} className={"seg-b" + (inv.design.floral === v ? " on" : "")} onClick={() => set("design.floral", v)}>{l}</button>
                    ))}
                  </div>
                </Field>
                <Field label="Lower illustration">
                  <div className="seg wrap">
                    {Object.entries(SWANS).map(([v, l]) => (
                      <button key={v} className={"seg-b" + (inv.design.swans === v ? " on" : "")} onClick={() => set("design.swans", v)}>{l}</button>
                    ))}
                  </div>
                </Field>
                <Field label="Backdrop">
                  <div className="seg wrap">
                    {[["warm", "Warm linen"], ["blush", "Dusty rose"], ["sage", "Sage"], ["photo", "Your photo"]].map(([v, l]) => (
                      <button key={v} className={"seg-b" + (inv.design.backgroundStyle === v ? " on" : "")}
                        onClick={() => set("design.backgroundStyle", v)}>{l}</button>
                    ))}
                  </div>
                </Field>
                <Field label="Background photo">
                  <input type="file" accept="image/*" onChange={(e) => e.target.files[0] && setBgImage(e.target.files[0])} />
                </Field>
                <Field label={`Paper grain — ${Math.round(inv.design.texture * 100)}%`}>
                  <input type="range" min="0" max="1" step=".05" value={inv.design.texture}
                    onChange={(e) => set("design.texture", +e.target.value)} />
                </Field>
              </Section>
            </>
          )}

          {tab === "media" && (
            <>
              <Section title="Photography" desc="Up to six images, arranged as printed snapshots.">
                <div className="drops">
                  {inv.gallery.images.map((src, i) => (
                    <div className="drop-thumb" key={i}>
                      <img src={src} alt="" />
                      <button onClick={() => set("gallery.images", inv.gallery.images.filter((_, j) => j !== i))}>×</button>
                    </div>
                  ))}
                  {inv.gallery.images.length < 6 && (
                    <label className="drop-add">
                      <input type="file" accept="image/*" multiple hidden
                        onChange={(e) => e.target.files.length && addPhotos(e.target.files)} />
                      <span>＋</span><em>Add photos</em>
                    </label>
                  )}
                </div>
                <label className="check">
                  <input type="checkbox" checked={inv.gallery.enabled} onChange={(e) => set("gallery.enabled", e.target.checked)} />
                  <span>Show gallery section</span>
                </label>
                <label className="check">
                  <input type="checkbox" checked={inv.gallery.captions} onChange={(e) => set("gallery.captions", e.target.checked)} />
                  <span>Show captions</span>
                </label>
              </Section>
              <Section title="Music">
                <label className="check">
                  <input type="checkbox" checked={inv.music.enabled} onChange={(e) => set("music.enabled", e.target.checked)} />
                  <span>Background music</span>
                </label>
                <label className="check">
                  <input type="checkbox" checked={inv.music.autoplay} onChange={(e) => set("music.autoplay", e.target.checked)} />
                  <span>Start with the first tap on the seal</span>
                </label>
                <Field label="Track URL (mp3) — leave empty for the studio's ambient piano score">
                  <Text value={inv.music.url} onChange={(v) => set("music.url", v)} placeholder="https://…/song.mp3" />
                </Field>
                <Field label={`Volume — ${Math.round(inv.music.volume * 100)}%`}>
                  <input type="range" min="0" max="1" step=".05" value={inv.music.volume}
                    onChange={(e) => { set("music.volume", +e.target.value); music.configure({ url: inv.music.url, volume: +e.target.value }); }} />
                </Field>
                <button className="btn btn-line sm" onClick={() => music.toggle()}>
                  {music.on ? "Pause preview" : "Play preview"}
                </button>
              </Section>
              <Section title="Interface copy">
                <Field label="Loading label"><Text value={inv.ui.loadingLabel} onChange={(v) => set("ui.loadingLabel", v)} /></Field>
                <Field label="Tap hint"><Text value={inv.ui.tapLabel} onChange={(v) => set("ui.tapLabel", v)} /></Field>
                <Field label="Brand line"><Text value={inv.ui.brand} onChange={(v) => set("ui.brand", v)} /></Field>
                <Field label="Credit"><Text value={inv.ui.credit} onChange={(v) => set("ui.credit", v)} /></Field>
              </Section>
            </>
          )}

          {tab === "rsvp" && (
            <>
              <Section title="RSVP form">
                <label className="check">
                  <input type="checkbox" checked={inv.rsvp.enabled} onChange={(e) => set("rsvp.enabled", e.target.checked)} />
                  <span>Enable RSVP</span>
                </label>
                <Field label="Title"><Text value={inv.rsvp.title} onChange={(v) => set("rsvp.title", v)} /></Field>
                <Field label="Guests field label"><Text value={inv.rsvp.guestsLabel} onChange={(v) => set("rsvp.guestsLabel", v)} /></Field>
                <Field label="Thank-you message"><Area rows={2} value={inv.rsvp.thanks} onChange={(v) => set("rsvp.thanks", v)} /></Field>
                <Field label="Reply deadline">
                  <input type="date" value={inv.rsvp.deadline} onChange={(e) => set("rsvp.deadline", e.target.value)} />
                </Field>
                <Field label="Options">
                  {inv.rsvp.options.map((o, i) => (
                    <div className="opt-row" key={i}>
                      <Text value={o} onChange={(v) => set("rsvp.options", inv.rsvp.options.map((x, j) => (j === i ? v : x)))} />
                      <button className="mini-x" onClick={() => set("rsvp.options", inv.rsvp.options.filter((_, j) => j !== i))}>×</button>
                    </div>
                  ))}
                  <button className="linklike" onClick={() => set("rsvp.options", [...inv.rsvp.options, "New option"])}>+ Add option</button>
                </Field>
              </Section>
              <Section title={`Replies received (${rsvps.length})`}>
                {rsvps.length === 0 && <p className="empty">No replies yet. They appear here as guests respond.</p>}
                <ul className="reply-list">
                  {rsvps.map((r, i) => (
                    <li key={i}>
                      <b>{r.name}</b>
                      <span className={"pill" + (r.attending === inv.rsvp.options[0] ? " yes" : " no")}>{r.attending}</span>
                      <em>{r.guests} guest{r.guests > 1 ? "s" : ""}{r.note ? " · " + r.note : ""}</em>
                    </li>
                  ))}
                </ul>
              </Section>
            </>
          )}

          {tab === "share" && (
            <Section title="Your unique invitation link" desc="Every guest gets their own link — add ?to=Name to personalise the card.">
              <div className="url-box">
                <code>{url}</code>
                <button className="btn btn-solid sm" onClick={() => navigator.clipboard?.writeText(url)}>Copy</button>
              </div>
              <Field label="Personalised link for one guest">
                <Text readOnly value={invitationUrl(inv.slug, "Amina")} />
              </Field>
              <div className="share-grid">
                <a className="btn btn-line" target="_blank" rel="noreferrer" href={`https://wa.me/?text=${encodeURIComponent(url)}`}>WhatsApp</a>
                <a className="btn btn-line" target="_blank" rel="noreferrer" href={`mailto:?subject=${encodeURIComponent(inv.names.one + " & " + inv.names.two)}&body=${encodeURIComponent(url)}`}>Email</a>
                <a className="btn btn-line" target="_blank" rel="noreferrer" href={`https://t.me/share/url?url=${encodeURIComponent(url)}`}>Telegram</a>
              </div>
              <Field label="Invitation slug"><Text value={inv.slug} onChange={(v) => set("slug", v)} /></Field>
            </Section>
          )}
        </aside>

        {preview && (
          <section className="ed-preview">
            <div className="phone">
              <div className="phone-notch" />
              <div className="phone-screen" key={reloadKey}>
                <Experience inv={inv} editable onEdit={() => setTab("design")} />
              </div>
              <div className="phone-gloss" />
            </div>
            <div className="preview-tools">
              <button className="btn btn-line sm" onClick={() => setReloadKey((k) => k + 1)}>↻ Replay opening</button>
              <span className="pv-note">Live preview — every edit applies instantly</span>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function Section({ title, desc, children }) {
  return (
    <div className="sec-block">
      <h2>{title}</h2>
      {desc && <p className="sec-desc">{desc}</p>}
      <div className="sec-fields">{children}</div>
    </div>
  );
}
