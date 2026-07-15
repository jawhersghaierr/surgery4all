import type { Sponsor } from '@/lib/types'

/** Sponsor logos with the sponsor name below each. Falls back to a monogram tile when no logo. */
export function SponsorGrid({ items }: { items: Sponsor[] }) {
  return (
    <div
      className="sfa-sponsors"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6,1fr)',
        gap: 20,
      }}
    >
      {items.map((s) => {
        const inner = (
          <>
            <div
              style={{
                height: 76,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 14,
                border: '1px solid rgba(12,21,18,.08)',
                background: '#fff',
                padding: '0 14px',
              }}
            >
              {s.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={s.logo_url}
                  alt={s.name}
                  style={{ maxWidth: '100%', maxHeight: 44, objectFit: 'contain', filter: 'grayscale(1)', opacity: 0.75 }}
                />
              ) : (
                <span
                  style={{
                    fontFamily: "'Space Grotesk'",
                    fontWeight: 700,
                    fontSize: 22,
                    color: '#0A5049',
                    letterSpacing: '-.02em',
                  }}
                >
                  {s.name
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((w) => w[0])
                    .join('')
                    .toUpperCase()}
                </span>
              )}
            </div>
            <div style={{ marginTop: 10, textAlign: 'center', fontSize: 13, fontWeight: 500, color: '#566962' }}>{s.name}</div>
          </>
        )

        return s.url ? (
          <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            {inner}
          </a>
        ) : (
          <div key={s.id}>{inner}</div>
        )
      })}
    </div>
  )
}
