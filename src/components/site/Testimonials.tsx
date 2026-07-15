export interface Testimonial {
  name: string
  role: string
  initial: string
  text: string
}

/** Port of the HOME testimonials grid (HANDOFF lines 170-185). Static — no interactivity, so it stays a server component and simply takes the localized array as a prop. */
export function Testimonials({ items }: { items: Testimonial[] }) {
  return (
    <div className="sfa-g3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22 }}>
      {items.map((item, i) => (
        <div key={i} style={{ background: '#fff', border: '1px solid rgba(12,21,18,.08)', borderRadius: 20, padding: 28 }}>
          <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>★★★★★</div>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: '#0C1512', marginBottom: 22 }}>&quot;{item.text}&quot;</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                background: 'linear-gradient(135deg,#0FA893,#0A5049)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 600,
                fontSize: 15,
                fontFamily: "'Space Grotesk'",
              }}
            >
              {item.initial}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</div>
              <div style={{ fontSize: 12, color: '#566962' }}>{item.role}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
