// Fine botanical line-art, drawn as SVG paths so it scales like engraved
// stationery artwork. All strokes inherit currentColor.

const leaf = (x, y, r, s = 1) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <path d="M0 0 C 7 -4 16 -3 22 0 C 16 3 7 4 0 0 Z" />
    <path d="M2 0 L 19 0" strokeWidth=".5" opacity=".65" />
  </g>
);

const sprigPath = (
  <g fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
    <path d="M2 98 C 10 74 12 50 8 26 C 7 18 9 10 14 3" />
    {[
      [8, 82, -32], [10, 68, 148], [10, 54, -28], [9, 40, 152],
      [11, 28, -24], [13, 16, 156],
    ].map(([x, y, r], i) => (
      <g key={i}>{leaf(x, y, r, i % 2 ? 0.8 : 1)}</g>
    ))}
    <circle cx="14.5" cy="2" r="1.6" fill="currentColor" stroke="none" />
  </g>
);

export function Sprig({ className = "", style }) {
  return (
    <svg viewBox="0 0 24 100" className={className} style={style} aria-hidden="true">
      {sprigPath}
    </svg>
  );
}

/* A trailing branch with leaves + tiny berries, used for card borders */
export function Branch({ className = "", style, flip = false }) {
  return (
    <svg viewBox="0 0 220 90" className={className} style={style}
      aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round"
        transform={flip ? "translate(220 0) scale(-1 1)" : undefined}>
        <path d="M4 84 C 46 70 96 52 150 30 C 176 20 198 12 216 8" />
        {[[22, 78, -18], [44, 70, 158], [66, 61, -14], [90, 51, 162],
          [114, 42, -12], [138, 33, 166], [162, 24, -10], [186, 16, 170],
          [206, 10, -8]].map(([x, y, r], i) => (
          <g key={i}>{leaf(x, y, r, i % 2 ? 0.72 : 0.95)}</g>
        ))}
        {[[34, 66], [80, 48], [128, 32], [174, 18]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y - 7} r="1.9" fill="currentColor" stroke="none" />
        ))}
      </g>
    </svg>
  );
}

/* Small ornament divider: line — diamond — line */
export function Divider({ className = "", style }) {
  return (
    <svg viewBox="0 0 200 18" className={className} style={style} aria-hidden="true">
      <g stroke="currentColor" fill="none" strokeWidth="1" strokeLinecap="round">
        <path d="M6 9 H 78" />
        <path d="M122 9 H 194" />
        <path d="M100 2.5 L 106.5 9 L 100 15.5 L 93.5 9 Z" />
        <path d="M86 9 l 3 -3 M86 9 l 3 3 M114 9 l -3 -3 M114 9 l -3 3" />
      </g>
      <circle cx="100" cy="9" r="1.4" fill="currentColor" />
    </svg>
  );
}

/* Corner flourish for the wreath frames */
export function CornerFlourish({ className = "", style }) {
  return (
    <svg viewBox="0 0 130 130" className={className} style={style} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
        <path d="M6 124 C 20 92 24 66 22 40 C 21 26 26 14 40 8 C 58 1 76 6 84 18" />
        <path d="M10 118 C 30 100 44 78 52 54" opacity=".7" />
        {[[20, 104, -52], [22, 84, 214], [24, 64, -48], [30, 44, 220],
          [42, 26, -20], [60, 14, 250], [76, 12, -6]].map(([x, y, r], i) => (
          <g key={i}>{leaf(x, y, r, i % 2 ? .7 : .9)}</g>
        ))}
        <circle cx="88" cy="16" r="2.2" fill="currentColor" stroke="none" />
        <circle cx="96" cy="22" r="1.4" fill="currentColor" stroke="none" />
        <circle cx="14" cy="112" r="1.6" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}

/* Open rose blossom used in the swan scene */
function Rose({ x, y, s = 1, c1, c2 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" strokeLinecap="round">
      <circle r="13" fill={c1} opacity=".9" />
      <path d="M-8 -3 C -6 -10 4 -11 8 -5 C 11 1 5 8 -2 7 C -8 6 -10 1 -7 -2" stroke={c2} strokeWidth="1.1" />
      <path d="M-4 -1 C -3 -5 3 -5 4 -1 C 4 3 -1 4 -3 1" stroke={c2} strokeWidth="1" />
      <path d="M-13 2 C -18 -2 -18 -9 -13 -12" stroke={c2} strokeWidth="1" />
      <path d="M13 4 C 18 2 20 -4 17 -9" stroke={c2} strokeWidth="1" />
    </g>
  );
}

function Bud({ x, y, s = 1, c1, c2, rot = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} fill="none" strokeLinecap="round">
      <path d="M0 0 C -5 -3 -6 -11 0 -15 C 6 -11 5 -3 0 0 Z" fill={c1} opacity=".9" />
      <path d="M0 1 C -6 -1 -8 -9 -5 -13" stroke={c2} strokeWidth="1" />
      <path d="M0 1 C 6 -1 8 -9 5 -13" stroke={c2} strokeWidth="1" />
    </g>
  );
}

/* Romantic lower illustration: two swans forming a heart, lotus & water */
export function SwanScene({ className = "", style }) {
  const cream = "#fbf6ec", wine = "#6d1f30", wineSoft = "#9a4b58", gold = "#b3873f";
  const green = "#8a977e", blush = "#d9a7a0";
  const swan = (sx, mirror) => (
    <g transform={`translate(${sx} 0) scale(${mirror ? -1 : 1} 1)`}>
      <path d="M-4 66 C -34 62 -46 44 -34 30 C -22 16 4 18 16 26" fill={cream} />
      <path d="M14 28 C 26 22 26 8 20 -2 C 16 -10 18 -20 26 -24 C 34 -28 42 -24 43 -16 C 44 -9 39 -5 33 -5"
        fill={cream} />
      <path d="M43 -16 C 49 -15 54 -12 56 -8 C 51 -7 46 -8 42 -10" fill={gold} />
      <circle cx="35" cy="-15" r="1.5" fill="#4a3b2c" />
      <path d="M-20 34 C -8 30 6 32 14 38" stroke="#e6d7bd" strokeWidth="1.2" fill="none" />
      <path d="M-26 42 C -14 38 0 40 8 46" stroke="#e6d7bd" strokeWidth="1.2" fill="none" />
    </g>
  );
  return (
    <svg viewBox="0 0 320 150" className={className} style={style} aria-hidden="true">
      <defs>
        <radialGradient id="sw-glow" cx="50%" cy="60%" r="60%">
          <stop offset="0%" stopColor="#fff6e6" stopOpacity=".9" />
          <stop offset="100%" stopColor="#fff6e6" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="160" cy="92" rx="150" ry="58" fill="url(#sw-glow)" />
      {/* hanging botanical arcs */}
      <g fill="none" stroke={green} strokeWidth="1" strokeLinecap="round" opacity=".85">
        <path d="M18 6 C 40 34 70 48 104 52" />
        <path d="M302 6 C 280 34 250 48 216 52" />
        {[[30, 16], [46, 28], [64, 38], [84, 46]].map(([x, y], i) => (
          <g key={"l" + i}>{leaf(x - 4, y, 60 + i * 8, .8)}</g>
        ))}
        {[[290, 16], [274, 28], [256, 38], [236, 46]].map(([x, y], i) => (
          <g key={"r" + i}>{leaf(x, y, 120 - i * 8, .8)}</g>
        ))}
      </g>
      <Rose x={104} y={52} s={.9} c1={blush} c2={wineSoft} />
      <Bud x={86} y={56} s={.8} rot={-30} c1={wineSoft} c2={wine} />
      <Rose x={216} y={52} s={.9} c1="#efe0d4" c2={wineSoft} />
      <Bud x={234} y={56} s={.8} rot={30} c1={blush} c2={wine} />

      {/* hearts formed by necks */}
      <path d="M160 2 C 150 -8 132 -6 130 8 C 128 22 146 34 160 44 C 174 34 192 22 190 8 C 188 -6 170 -8 160 2 Z"
        fill={wine} opacity=".13" />
      {swan(122, false)}
      {swan(198, true)}

      {/* water */}
      <g stroke={gold} fill="none" strokeLinecap="round" opacity=".55">
        <path d="M30 104 C 60 98 92 110 124 104 C 156 98 190 110 222 104 C 254 98 282 108 292 104" strokeWidth="1.1" />
        <path d="M48 118 C 78 112 110 124 142 118 C 174 112 208 124 240 118 C 262 114 274 118 278 118" strokeWidth=".9" opacity=".7" />
        <path d="M70 132 C 100 126 132 138 164 132 C 196 126 226 136 246 132" strokeWidth=".8" opacity=".45" />
      </g>
      {/* lotus */}
      <g transform="translate(160 128)">
        {[-58, -30, 0, 30, 58].map((r, i) => (
          <path key={i} d="M0 4 C -8 -6 -6 -20 0 -26 C 6 -20 8 -6 0 4 Z"
            fill={i % 2 ? blush : "#e9c9c2"} opacity=".95"
            transform={`rotate(${r * 0.5}) translate(${r * 0.42} 0) scale(${1 - Math.abs(r) / 220})`} />
        ))}
        <path d="M-22 6 C -10 12 10 12 22 6" stroke={green} strokeWidth="1.2" fill="none" />
      </g>
      <g fill={wine} opacity=".5">
        <circle cx="52" cy="70" r="1.6" /><circle cx="268" cy="70" r="1.6" />
        <circle cx="40" cy="86" r="1.1" /><circle cx="280" cy="86" r="1.1" />
      </g>
    </svg>
  );
}

export function SingleSwan({ className = "", style }) {
  return (
    <svg viewBox="0 0 200 120" className={className} style={style} aria-hidden="true">
      <g transform="translate(100 60)">
        <path d="M-4 30 C -30 26 -40 10 -28 -2 C -16 -14 6 -12 16 -4" fill="#fbf6ec" />
        <path d="M14 -2 C 24 -8 24 -20 18 -28 C 14 -34 16 -42 24 -45 C 32 -48 38 -43 38 -36 C 38 -30 33 -27 28 -27"
          fill="#fbf6ec" />
        <path d="M38 -36 C 44 -35 48 -32 50 -28 C 45 -27 40 -28 37 -30" fill="#b3873f" />
        <circle cx="31" cy="-36" r="1.4" fill="#4a3b2c" />
        <g stroke="#b3873f" fill="none" strokeLinecap="round" opacity=".6">
          <path d="M-70 40 C -40 34 -10 46 20 40 C 50 34 70 42 78 40" />
          <path d="M-50 54 C -20 48 10 58 40 54 C 60 51 68 54 70 54" opacity=".6" />
        </g>
      </g>
    </svg>
  );
}

export function FloatingHearts({ className = "", style }) {
  const pts = [[40, 70, 10], [80, 40, 14], [120, 66, 9], [160, 34, 12], [200, 62, 10], [240, 42, 13], [280, 70, 9]];
  return (
    <svg viewBox="0 0 320 100" className={className} style={style} aria-hidden="true">
      {pts.map(([x, y, s], i) => (
        <path key={i} transform={`translate(${x} ${y}) scale(${s / 12})`}
          d="M0 6 C -8 -2 -6 -12 0 -8 C 6 -12 8 -2 0 6 Z"
          fill="none" stroke="#9a4b58" strokeWidth="1.4" opacity={0.35 + (i % 3) * 0.2} />
      ))}
    </svg>
  );
}

/* Decorative monogram ring inside the wax seal */
export function SealArt({ monogram, font }) {
  return (
    <svg viewBox="0 0 100 100" className="seal-svg" aria-hidden="true">
      <defs>
        <radialGradient id="seal-body" cx="38%" cy="30%" r="78%">
          <stop offset="0%" stopColor="var(--seal-hi)" />
          <stop offset="52%" stopColor="var(--seal)" />
          <stop offset="100%" stopColor="var(--seal-deep)" />
        </radialGradient>
        <filter id="seal-rough" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <g filter="url(#seal-rough)">
        <path d="M50 4 C 63 4 68 10 78 13 C 88 16 96 22 96 33 C 96 44 90 47 91 57 C 92 68 88 79 78 84 C 68 89 62 87 52 92 C 42 97 30 95 22 88 C 14 81 16 71 11 62 C 6 52 4 40 10 30 C 16 20 26 22 33 15 C 40 8 42 4 50 4 Z"
          fill="url(#seal-body)" />
      </g>
      <path d="M50 4 C 63 4 68 10 78 13 C 88 16 96 22 96 33 C 96 44 90 47 91 57 C 92 68 88 79 78 84 C 68 89 62 87 52 92 C 42 97 30 95 22 88 C 14 81 16 71 11 62 C 6 52 4 40 10 30 C 16 20 26 22 33 15 C 40 8 42 4 50 4 Z"
        fill="none" stroke="rgba(0,0,0,.28)" strokeWidth="1" />
      <g opacity=".55" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth=".8">
        <circle cx="50" cy="48" r="33" />
        <circle cx="50" cy="48" r="28.5" strokeDasharray="1.5 3" />
      </g>
      <text x="50" y="49" textAnchor="middle" dominantBaseline="central"
        className="seal-mono" style={{ fontFamily: `'${font}', serif` }}
        fill="rgba(255,240,232,.82)" stroke="rgba(0,0,0,.22)" strokeWidth=".4">{monogram}</text>
      <g opacity=".35" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth=".7">
        <path d="M28 62 C 34 66 42 68 50 68 C 58 68 66 66 72 62" />
        <path d="M34 30 C 40 26 60 26 66 30" />
      </g>
    </svg>
  );
}
