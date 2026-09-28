import React, { useEffect, useState } from "react";
import Experience from "./components/Experience.jsx";
import Editor from "./components/Editor.jsx";
import { createInvitation, getInvitation, listInvitations, saveInvitation, invitationUrl } from "./lib/store.js";
import { defaultInvitation, THEMES } from "./lib/defaults.js";

/* ------------------------------------------------------------------ landing */
function Landing({ navigate }) {
  const [seed, setSeed] = useState("");
  const existing = listInvitations();
  return (
    <div className="landing">
      <div className="ld-bg" />
      <div className="ld-inner">
        <p className="ld-kicker">Lumen · Digital Wedding Invitations</p>
        <h1 className="ld-title">
          The invitation<br /><em>opens like paper.</em>
        </h1>
        <p className="ld-sub">
          A wax-sealed envelope that breaks, unfolds and releases a letterpress-quality
          wedding card — built for the phone in your guest's hand.
        </p>
        <div className="ld-cta">
          <input placeholder="Couple names, e.g. Zohan & Rose" value={seed} onChange={(e) => setSeed(e.target.value)} />
          <button className="btn btn-solid" onClick={() => {
            const inv = createInvitation(seed);
            navigate("/edit/" + inv.slug);
          }}>Create my invitation</button>
        </div>
        <button className="btn btn-line ld-demo" onClick={() => navigate("/i/demo")}>
          ✦ Watch the opening sequence
        </button>
        {existing.length > 0 && (
          <ul className="ld-list">
            {existing.slice(0, 6).map((s) => (
              <li key={s}>
                <a href={"#/i/" + s} onClick={(e) => { e.preventDefault(); navigate("/i/" + s); }}>
                  {s}
                </a>
                <button onClick={() => navigate("/edit/" + s)}>Edit</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- app */
export default function App() {
  const [route, setRoute] = useState(parse());

  function parse() {
    const h = window.location.hash.replace(/^#/, "") || "/";
    const qIdx = h.indexOf("?");
    const path = (qIdx >= 0 ? h.slice(0, qIdx) : h).replace(/\/+$/, "") || "/";
    const params = new URLSearchParams(qIdx >= 0 ? h.slice(qIdx + 1) : window.location.search);
    return { path, params };
  }

  useEffect(() => {
    const onHash = () => { setRoute(parse()); window.scrollTo(0, 0); };
    window.addEventListener("hashchange", onHash);
    // ensure the flagship demo invitation always exists
    if (!getInvitation("demo")) {
      const d = defaultInvitation();
      d.slug = "demo";
      saveInvitation(d);
    }
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const navigate = (p) => { window.location.hash = p; };

  const mInvite = route.path.match(/^\/i\/([\w\-.]+)$/);
  const mEdit = route.path.match(/^\/edit\/([\w\-.]+)$/);

  let content = null;
  if (mInvite) {
    const inv = getInvitation(mInvite[1]);
    if (inv) {
      const to = route.params.get("to");
      const final = to ? { ...inv, guest: to } : inv;
      document.title = `${final.names.one} & ${final.names.two} — ${final.header.kicker}`;
      content = (
        <Experience
          key={mInvite[1] + (to || "")}
          inv={final}
          editable
          onEdit={() => navigate("/edit/" + inv.slug)}
        />
      );
    } else {
      content = (
        <div className="notfound">
          <h2>This invitation has not been sealed yet.</h2>
          <p>The link may be mistyped or the invitation was removed.</p>
          <button className="btn btn-solid" onClick={() => navigate("/")}>Back to studio</button>
        </div>
      );
    }
  } else if (mEdit) {
    const inv = getInvitation(mEdit[1]);
    if (inv) {
      content = <Editor key={inv.slug} inv={inv} onNavigate={navigate} />;
    } else {
      content = (
        <div className="notfound">
          <h2>No invitation at this address.</h2>
          <button className="btn btn-solid" onClick={() => navigate("/")}>Create one</button>
        </div>
      );
    }
  } else {
    content = <Landing navigate={navigate} />;
  }

  return <>{content}</>;
}
