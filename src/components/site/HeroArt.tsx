/**
 * HeroArt — self-contained, modern illustration for the home hero.
 * Oral surgery / implantology: a refined tooth + titanium implant on a
 * mesh-gradient clinical backdrop with soft glass depth. Brand teal palette.
 * Inline SVG — renders offline, scales crisply, no external asset.
 */
export function HeroArt() {
  return (
    <svg
      viewBox="0 0 800 1000"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Illustration : chirurgie buccale et implantologie"
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <defs>
        <linearGradient id="hgBase" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#0A5049" />
          <stop offset="0.5" stopColor="#0E8477" />
          <stop offset="1" stopColor="#12A18F" />
        </linearGradient>
        <radialGradient id="hgGlowA" cx="0.78" cy="0.16" r="0.75">
          <stop offset="0" stopColor="#7FF0DE" stopOpacity="0.55" />
          <stop offset="1" stopColor="#7FF0DE" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hgGlowB" cx="0.18" cy="0.92" r="0.7">
          <stop offset="0" stopColor="#063A34" stopOpacity="0.55" />
          <stop offset="1" stopColor="#063A34" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hgSweep" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.10" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="hgTooth" x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.6" stopColor="#F2FBF8" />
          <stop offset="1" stopColor="#CFEAE3" />
        </linearGradient>
        <linearGradient id="hgMetal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#9FC7BF" />
          <stop offset="0.28" stopColor="#EFF8F5" />
          <stop offset="0.5" stopColor="#C7E4DC" />
          <stop offset="0.72" stopColor="#F3FAF8" />
          <stop offset="1" stopColor="#93BEB5" />
        </linearGradient>
        <radialGradient id="hgDisc" cx="0.5" cy="0.42" r="0.62">
          <stop offset="0" stopColor="#1AB79F" stopOpacity="0.9" />
          <stop offset="0.7" stopColor="#0B4C45" stopOpacity="0.55" />
          <stop offset="1" stopColor="#0B4C45" stopOpacity="0" />
        </radialGradient>
        <filter id="hgSoft" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="26" stdDeviation="30" floodColor="#04241F" floodOpacity="0.40" />
        </filter>
        <filter id="hgBlur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
        <pattern id="hgDots" width="34" height="34" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="2" fill="#FFFFFF" fillOpacity="0.07" />
        </pattern>
      </defs>

      {/* layered mesh backdrop */}
      <rect width="800" height="1000" fill="url(#hgBase)" />
      <rect width="800" height="1000" fill="url(#hgGlowA)" />
      <rect width="800" height="1000" fill="url(#hgGlowB)" />
      <rect width="800" height="1000" fill="url(#hgDots)" />
      <polygon points="0,220 800,-40 800,240 0,520" fill="url(#hgSweep)" />

      {/* frosted glass depth shapes */}
      <g filter="url(#hgBlur)" opacity="0.5">
        <rect x="70" y="150" width="150" height="150" rx="40" fill="#FFFFFF" fillOpacity="0.10" />
        <circle cx="690" cy="760" r="90" fill="#FFFFFF" fillOpacity="0.08" />
      </g>

      {/* accent ring + soft disc behind the tooth */}
      <circle cx="400" cy="452" r="250" fill="url(#hgDisc)" />
      <circle cx="400" cy="452" r="252" fill="none" stroke="#7FF0DE" strokeOpacity="0.45" strokeWidth="2" />
      <path d="M400 200 a252 252 0 0 1 210 112" fill="none" stroke="#EAFFFB" strokeOpacity="0.85" strokeWidth="4" strokeLinecap="round" />

      {/* fine scan rings */}
      <g fill="none" stroke="#FFFFFF" strokeOpacity="0.08">
        <circle cx="400" cy="452" r="188" />
        <circle cx="400" cy="452" r="132" />
      </g>

      {/* tooth + implant */}
      <g filter="url(#hgSoft)">
        {/* molar crown */}
        <path
          fill="url(#hgTooth)"
          d="M400 288
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
        {/* specular highlight */}
        <path fill="#FFFFFF" opacity="0.6" d="M330 342 c24 -18 54 -26 74 -24 c-34 4 -60 22 -74 50 c-8 -12 -6 -18 0 -26 Z" />
        <path fill="#0C1512" opacity="0.06" d="M470 330 c26 26 30 92 10 168 c-6 22 -14 40 -22 40 c16 -70 20 -140 12 -208 Z" />

        {/* gum shadow */}
        <ellipse cx="400" cy="586" rx="120" ry="20" fill="#0C1512" opacity="0.18" />

        {/* abutment */}
        <path fill="url(#hgMetal)" d="M374 566 h52 l-7 56 h-38 Z" />
        {/* titanium post */}
        <path fill="url(#hgMetal)" d="M384 620 h32 c8 0 12 8 10 16 l-22 104 c-2 9 -14 9 -16 0 l-14 -104 c-2 -8 2 -16 10 -16 Z" />
        <g stroke="#6FB3A7" strokeWidth="4.5" strokeLinecap="round" opacity="0.85">
          <path d="M386 648 h28" />
          <path d="M388 670 h24" />
          <path d="M390 692 h20" />
          <path d="M393 714 h14" />
        </g>
        {/* post shine */}
        <path d="M398 626 l-6 108" stroke="#FFFFFF" strokeOpacity="0.7" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* subtle accent dots */}
      <g fill="#7FF0DE" opacity="0.6">
        <circle cx="150" cy="470" r="5" />
        <circle cx="655" cy="520" r="4" />
        <circle cx="600" cy="235" r="5" />
      </g>
      <g stroke="#FFFFFF" strokeOpacity="0.35" strokeWidth="3" strokeLinecap="round">
        <path d="M170 360 h20 M180 350 v20" />
        <path d="M636 640 h20 M646 630 v20" />
      </g>
    </svg>
  )
}
