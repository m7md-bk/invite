import React, { useEffect, useState } from "react";
import { addRsvp } from "../lib/store.js";
import { Divider } from "./Botanicals.jsx";

export default function Rsvp({ inv, onClose }) {
  const [name, setName] = useState(inv.guest || "");
  const [attending, setAttending] = useState(inv.rsvp.options[0]);
  const [guests, setGuests] = useState(1);
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 20);
    document.body.classList.add("locked");
    return () => { clearTimeout(t); document.body.classList.remove("locked"); };
  }, []);

  const close = () => {
    setShow(false);
    setTimeout(onClose, 380);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    addRsvp(inv.slug, { name: name.trim(), attending, guests, note: note.trim() });
    setSent(true);
  };

  return (
    <div className={"modal" + (show ? " show" : "")} role="dialog" aria-modal="true">
      <button className="modal-scrim" onClick={close} aria-label="Close" />
      <div className="modal-card" style={{ "--seal": inv.design.colors.seal }}>
        <div className="mc-paper" />
        <button className="modal-x" onClick={close} aria-label="Close">×</button>
        {!sent ? (
          <form onSubmit={submit}>
            <p className="mc-overline">{inv.names.one} &amp; {inv.names.two}</p>
            <Divider className="orn-divider xs" />
            <h3 className="mc-title">{inv.rsvp.title}</h3>
            <label className="field">
              <span>Your name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" required />
            </label>
            <div className="field">
              <span>Will you attend?</span>
              <div className="choices">
                {inv.rsvp.options.map((o) => (
                  <button type="button" key={o}
                    className={"choice" + (attending === o ? " active" : "")}
                    onClick={() => setAttending(o)}>{o}</button>
                ))}
              </div>
            </div>
            {attending === inv.rsvp.options[0] && (
              <label className="field">
                <span>{inv.rsvp.guestsLabel}</span>
                <input type="number" min="1" max="12" value={guests}
                  onChange={(e) => setGuests(Math.max(1, +e.target.value || 1))} />
              </label>
            )}
            <label className="field">
              <span>A message for the couple</span>
              <textarea rows="3" value={note} onChange={(e) => setNote(e.target.value)}
                placeholder="Optional — wishes, dietary notes…" />
            </label>
            <button className="btn btn-seal full" type="submit">Send reply</button>
          </form>
        ) : (
          <div className="mc-done">
            <svg viewBox="0 0 60 60" className="done-mark"><circle cx="30" cy="30" r="27" /><path d="M18 31l8 8 16-18" /></svg>
            <h3 className="mc-title">{inv.rsvp.thanks}</h3>
            <p className="mc-sub">{attending === inv.rsvp.options[0] ? `See you on ${inv.event.dateLong}.` : "We will miss you — thank you for letting us know."}</p>
            <button className="btn btn-line" onClick={close}>Back to invitation</button>
          </div>
        )}
      </div>
    </div>
  );
}
