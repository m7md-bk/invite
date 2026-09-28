import { defaultInvitation, THEMES } from "./defaults.js";

const LS = (slug) => `lumen:invite:${slug}`;
const RSVP = (slug) => `lumen:rsvp:${slug}`;

// "server" store — an in-memory map that simulates the backend database so
// newly created invitations resolve instantly inside the session.
const serverDB = new Map();

export function slugify(s) {
  return (s || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

function deepMerge(base, patch) {
  const out = Array.isArray(base) ? [...base] : { ...base };
  if (!patch) return out;
  for (const k of Object.keys(patch)) {
    const bv = base ? base[k] : undefined;
    const pv = patch[k];
    if (pv && typeof pv === "object" && !Array.isArray(pv) && typeof bv === "object" && bv !== null) {
      out[k] = deepMerge(bv, pv);
    } else if (pv !== undefined) {
      out[k] = pv;
    }
  }
  return out;
}

export function migrate(inv) {
  const merged = deepMerge(defaultInvitation(), inv || {});
  // keep colours complete if a newer theme added keys
  const t = THEMES[merged.design.theme] || THEMES.burgundy;
  merged.design.colors = { ...t, ...merged.design.colors };
  return merged;
}

export function makeSlug(seed) {
  const base = slugify(seed) || "wedding";
  let s = base, i = 1;
  while (serverDB.has(s) || localStorage.getItem(LS(s))) {
    s = `${base}-${++i}`;
  }
  return s;
}

export function getInvitation(slug) {
  if (!slug) return null;
  if (serverDB.has(slug)) return migrate(serverDB.get(slug));
  const raw = localStorage.getItem(LS(slug));
  if (!raw) return null;
  try {
    return migrate(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function saveInvitation(inv) {
  const copy = migrate(inv);
  localStorage.setItem(LS(copy.slug), JSON.stringify(copy));
  serverDB.set(copy.slug, copy);
  return copy;
}

export function createInvitation(seedName) {
  const inv = defaultInvitation();
  inv.slug = makeSlug(seedName || (inv.names.one + "-and-" + inv.names.two));
  return saveInvitation(inv);
}

export function listInvitations() {
  const set = new Set([...serverDB.keys()]);
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith("lumen:invite:")) set.add(k.slice("lumen:invite:".length));
  }
  return [...set].filter(Boolean).sort();
}

// ------------------------------ RSVP ---------------------------------------
export function getRsvps(slug) {
  try {
    return JSON.parse(localStorage.getItem(RSVP(slug)) || "[]");
  } catch {
    return [];
  }
}

export function addRsvp(slug, entry) {
  const all = getRsvps(slug);
  all.unshift({ ...entry, at: new Date().toISOString() });
  localStorage.setItem(RSVP(slug), JSON.stringify(all));
  return all;
}

// ------------------------------ URL ----------------------------------------
export function invitationUrl(slug, guest) {
  const loc = window.location;
  const base = `${loc.origin}${loc.pathname.replace(/\/(edit|admin)\/?$/, "/")}`;
  const clean = base.endsWith("/") ? base : base + "/";
  const q = guest ? `?to=${encodeURIComponent(guest)}` : "";
  return `${clean}i/${slug}${q}`;
}

export function routerPath() {
  const p = window.location.pathname.replace(/\/+$/, "") || "/";
  return p;
}
