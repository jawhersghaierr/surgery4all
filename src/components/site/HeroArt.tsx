/**
 * HeroArt — self-contained, on-brand illustration for the home hero.
 * Oral-surgery / implantology motif (documented case + operative video),
 * drawn in the Surgery4all teal palette. No network / no external asset:
 * inline SVG so it renders offline and scales crisply.
 */
export function HeroArt() {
  return (
    <svg
      viewBox="0 0 800 1000"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Illustration : chirurgie orale et implantologie documentée"
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <defs>
        <linearGradient id="sfaBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0A5049" />
          <stop offset="0.55" stopColor="#0E8C7E" />
          <stop offset="1" stopColor="#0FA893" />
        </linearGradient>
        <radialGradient id="sfaGlow" cx="0.72" cy="0.22" r="0.9">
          <stop offset="0" stopColor="#4FD8C6" stopOpacity="0.55" />
          <stop offset="0.45" stopColor="#4FD8C6" stopOpacity="0.12" />
          <stop offset="1" stopColor="#4FD8C6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="sfaTooth" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#D9F0EB" />
        </linearGradient>
        <linearGradient id="sfaImplant" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#EAF6F3" />
          <stop offset="1" stopColor="#A9D9CF" />
        </linearGradient>
        <filter id="sfaShadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="22" stdDeviation="26" floodColor="#04241F" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* backdrop */}
      <rect width="800" height="1000" fill="url(#sfaBg)" />
      <rect width="800" height="1000" fill="url(#sfaGlow)" />

      {/* concentric scan rings (clinical documentation motif) */}
      <g fill="none" stroke="#FFFFFF" strokeOpacity="0.10">
        <circle cx="400" cy="470" r="300" />
        <circle cx="400" cy="470" r="230" />
        <circle cx="400" cy="470" r="160" />
      </g>
      <g fill="#4FD8C6" opacity="0.5">
        <circle cx="120" cy="140" r="4" />
        <circle cx="680" cy="120" r="5" />
        <circle cx="700" cy="620" r="4" />
        <circle cx="130" cy="660" r="5" />
      </g>
      {/* small plus marks */}
      <g stroke="#FFFFFF" strokeOpacity="0.35" strokeWidth="3" strokeLinecap="round">
        <path d="M150 300 h22 M161 289 v22" />
        <path d="M648 400 h22 M659 389 v22" />
      </g>

      {/* central tooth + implant, floating on a soft disc */}
      <circle cx="400" cy="470" r="215" fill="#063A34" opacity="0.35" />
      <g filter="url(#sfaShadow)">
        {/* molar crown */}
        <path
          fill="url(#sfaTooth)"
          d="M400 300
             c-52 0 -84 26 -104 26
             c-30 0 -52 -12 -74 6
             c-30 24 -24 84 -6 150
             c12 44 22 92 40 92
             c22 0 24 -54 40 -54
             c14 0 18 34 34 34
             c16 0 20 -34 34 -34
             c16 0 18 54 40 54
             c18 0 28 -48 40 -92
             c18 -66 24 -126 -6 -150
             c-22 -18 -44 -6 -74 -6
             c-20 0 -52 -26 -104 -26 Z"
        />
        {/* crown highlight */}
        <path
          fill="#FFFFFF"
          opacity="0.55"
          d="M338 350 c22 -14 48 -20 62 -20 c-30 6 -52 22 -66 44 c-6 -10 -4 -18 4 -24 Z"
        />

        {/* gum line */}
        <rect x="286" y="560" width="228" height="34" rx="17" fill="#0C1512" opacity="0.16" />

        {/* implant abutment */}
        <path fill="url(#sfaImplant)" d="M372 578 h56 l-8 60 h-40 Z" />
        {/* implant post with threads */}
        <path fill="url(#sfaImplant)" d="M382 636 h36 c8 0 12 8 10 16 l-24 108 c-2 8 -14 8 -16 0 l-16 -108 c-2 -8 2 -16 10 -16 Z" />
        <g stroke="#7FC3B7" strokeWidth="5" strokeLinecap="round" opacity="0.9">
          <path d="M384 664 h32" />
          <path d="M386 686 h28" />
          <path d="M388 708 h24" />
          <path d="M391 730 h18" />
        </g>
      </g>

      {/* operative-video: glassy play button */}
      <g transform="translate(596 300)">
        <circle r="58" fill="#0C1512" opacity="0.28" />
        <circle r="58" fill="none" stroke="#FFFFFF" strokeOpacity="0.5" strokeWidth="2" />
        <path d="M-16 -24 L28 0 L-16 24 Z" fill="#FFFFFF" />
      </g>

      {/* ECG / vitals line */}
      <path
        d="M70 830 H250 l30 -46 30 92 34 -140 30 140 26 -46 H730"
        fill="none"
        stroke="#4FD8C6"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
      <text
        x="70"
        y="905"
        fill="#EAFBF7"
        opacity="0.85"
        fontFamily="'Space Grotesk', sans-serif"
        fontSize="26"
        fontWeight="600"
        letterSpacing="0.04em"
      >
        CAS DOCUMENTÉ · PROTOCOLE
      </text>
    </svg>
  )
}
