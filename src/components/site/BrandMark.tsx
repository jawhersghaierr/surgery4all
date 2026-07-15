/**
 * BrandMark — the Surgery4all logo tile.
 * A rounded teal-gradient tile with a crisp filled tooth glyph, a soft top
 * gloss and a bright implant accent. Self-contained inline SVG (offline, sharp
 * at any size). Reused by the header and footer.
 */
export function BrandMark({ size = 34 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      role="img"
      aria-label="Surgery4all"
      style={{ display: 'block', borderRadius: size * 0.3, boxShadow: '0 6px 16px -4px rgba(15,168,147,.55)' }}
    >
      <defs>
        <linearGradient id="bmTile" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#17C1AB" />
          <stop offset="0.55" stopColor="#0FA893" />
          <stop offset="1" stopColor="#0A5049" />
        </linearGradient>
        <linearGradient id="bmTooth" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#DFF4EF" />
        </linearGradient>
      </defs>

      {/* tile */}
      <rect width="40" height="40" rx="12" fill="url(#bmTile)" />
      {/* top gloss */}
      <path d="M0 12 Q0 0 12 0 H40 V8 Q22 4 0 16 Z" fill="#FFFFFF" opacity="0.16" />

      {/* filled tooth glyph */}
      <path
        fill="url(#bmTooth)"
        d="M20 8.5
           c-4.6 0 -7.6 2.6 -9.2 2.6
           c-1.8 0 -3 -0.8 -4.3 0.5
           c-2 2 -1.5 6 -0.3 10
           c0.8 2.9 1.4 6.4 2.9 6.4
           c1.7 0 1.7 -4.2 3.1 -4.2
           c1.1 0 1.4 2.7 2.7 2.7
           c1.3 0 1.6 -2.7 2.7 -2.7
           c1.4 0 1.4 4.2 3.1 4.2
           c1.5 0 2.1 -3.5 2.9 -6.4
           c1.2 -4 1.7 -8 -0.3 -10
           c-1.3 -1.3 -2.5 -0.5 -4.3 -0.5
           c-1.6 0 -4.6 -2.6 -9.2 -2.6 Z"
      />
      {/* crown highlight */}
      <path d="M13.6 12.2 c2 -1.3 4.4 -1.9 6 -1.8 c-2.7 0.5 -4.7 1.9 -5.8 3.9 c-0.7 -0.9 -0.6 -1.5 -0.2 -2.1 Z" fill="#FFFFFF" opacity="0.6" />
      {/* implant accent */}
      <circle cx="28.5" cy="12" r="2.4" fill="#7FF0DE" />
    </svg>
  )
}
