// ---------------------------------------------------------------------------
// Invitation data model — nothing in the UI is hard-coded; every value below
// is editable through the admin editor (/edit) and persisted per-invitation.
// ---------------------------------------------------------------------------

export const FONTS = {
  display: [
    { id: "Cormorant Garamond", label: "Cormorant Garamond" },
    { id: "Playfair Display", label: "Playfair Display" },
    { id: "Marcellus", label: "Marcellus" },
    { id: "Italiana", label: "Italiana" },
    { id: "EB Garamond", label: "EB Garamond" },
  ],
  script: [
    { id: "Pinyon Script", label: "Pinyon Script" },
    { id: "Great Vibes", label: "Great Vibes" },
    { id: "Alex Brush", label: "Alex Brush" },
    { id: "Tangerine", label: "Tangerine" },
  ],
  smallcaps: [
    { id: "Jost", label: "Jost" },
    { id: "Montserrat", label: "Montserrat" },
    { id: "Cormorant Garamond", label: "Cormorant (small caps)" },
  ],
  arabic: [
    { id: "Aref Ruqaa", label: "Aref Ruqaa" },
    { id: "Amiri", label: "Amiri" },
    { id: "Reem Kufi", label: "Reem Kufi" },
    { id: "Markazi Text", label: "Markazi Text" },
  ],
};

export const THEMES = {
  burgundy: {
    id: "burgundy",
    label: "Burgundy Noir",
    paper: "#f4ecdd",
    paperDeep: "#e9dcc3",
    ink: "#463729",
    soft: "#8b775c",
    seal: "#6d1f30",
    sealDeep: "#3f0f1c",
    envelope: "#f2e8d6",
    envelopeEdge: "#dcc9a6",
    accent: "#a8763e",
    bgTop: "#cdbfa6",
    bgMid: "#a6916f",
    bgBottom: "#6f5a40",
  },
  rose: {
    id: "rose",
    label: "Dusty Rose",
    paper: "#f8efe9",
    paperDeep: "#eedbd0",
    ink: "#54383a",
    soft: "#9b7373",
    seal: "#93414f",
    sealDeep: "#5d2029",
    envelope: "#f5e6df",
    envelopeEdge: "#e0bfaf",
    accent: "#b07d6b",
    bgTop: "#dbc6bc",
    bgMid: "#b79288",
    bgBottom: "#84625b",
  },
  sage: {
    id: "sage",
    label: "Sage Champagne",
    paper: "#f4f1e6",
    paperDeep: "#e4ddc7",
    ink: "#3d4436",
    soft: "#7c8266",
    seal: "#5c6b4f",
    sealDeep: "#333f28",
    envelope: "#f1edde",
    envelopeEdge: "#cfc8a9",
    accent: "#8f8a5d",
    bgTop: "#cdcbb2",
    bgMid: "#9ca07f",
    bgBottom: "#6a6f4f",
  },
  midnight: {
    id: "midnight",
    label: "Midnight Gold",
    paper: "#f2ead9",
    paperDeep: "#e3d6ba",
    ink: "#2c2a33",
    soft: "#6f6a7d",
    seal: "#2b2340",
    sealDeep: "#140f22",
    envelope: "#ece2cc",
    envelopeEdge: "#c9b78d",
    accent: "#b3873f",
    bgTop: "#bcb0c9",
    bgMid: "#8b7f9d",
    bgBottom: "#544a66",
  },
};

export const FLORALS = {
  none: "None",
  botanical: "Botanical sprigs",
  cornerwreath: "Corner wreaths",
  fullwreath: "Full wreath",
};

export const SWANS = {
  pair: "Swan pair & lotus",
  single: "Single swan",
  hearts: "Floating hearts",
  none: "None",
};

export const defaultInvitation = () => ({
  slug: "",
  lang: "en", // en | ar | both
  dir: "ltr",

  names: {
    one: "Zohan",
    two: "Rose",
    conj: "&",
    oneAr: "زهان",
    twoAr: "روز",
  },

  header: {
    kicker: "Wedding Day",
    dateLine: "27.09.2026",
    kickerAr: "يوم الزفاف",
  },

  message: {
    line1: "You are invited to celebrate our wedding",
    line2: "Together with our families, we joyfully invite you",
    verse:
      "“And We created you in pairs, and made your sleep for rest, and the night as a covering, and the day for living.”",
    line1Ar: "يسعدنا دعوتكم لمشاركتنا فرحة زفافنا",
  },

  event: {
    dateLong: "Sunday, September 27th, 2026",
    time: "7:00 PM until late",
    venue: "The Grand Atrium",
    address: "12 Palm Avenue, Lake District",
    ceremony: "Ceremony · 6:30 PM",
    reception: "Reception · 8:00 PM",
    mapUrl: "https://maps.google.com/?q=The+Grand+Atrium",
    dateLongAr: "الأحد ٢٧ سبتمبر ٢٠٢٦",
    venueAr: "القاعة الكبرى",
  },

  countdown: { enabled: true, target: "2026-09-27T19:00:00" },

  rsvp: {
    enabled: true,
    title: "Kindly reply by September 1st, 2026",
    guestsLabel: "Number of guests",
    deadline: "2026-09-01",
    thanks: "Thank you — we can't wait to celebrate with you.",
    options: ["Joyfully accepts", "Regretfully declines"],
  },

  gallery: {
    enabled: true,
    images: [], // array of dataURLs
    captions: false,
  },

  music: {
    enabled: true,
    autoplay: true,
    url: "", // custom track url; empty → generated ambient piano
    volume: 0.5,
  },

  design: {
    theme: "burgundy",
    colors: { ...THEMES.burgundy },
    fonts: {
      display: "Cormorant Garamond",
      script: "Pinyon Script",
      smallcaps: "Jost",
      arabic: "Aref Ruqaa",
    },
    sizes: { names: 1, body: 1 },
    floral: "botanical",
    swans: "pair",
    texture: 0.55,
    backgroundStyle: "warm", // warm | blush | sage | photo
    backgroundImage: "",
    envelopePattern: true,
    monogram: "ZR",
  },


  ui: {
    brand: "Lumen · Wedding Studio",
    loadingLabel: "Preparing your invitation",
    tapLabel: "Tap the seal to open",
    footNote: "With love, we await your presence.",
    credit: "Lumen · Digital Wedding Invitations",
  },

  hashtag: "ZohanAndRose",
  monogram: "", // optional override of the wax-seal monogram (kept in design)
  guest: "", // personalised addressee from URL ?to=
});
