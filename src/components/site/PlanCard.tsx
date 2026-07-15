'use client'

import type { CSSProperties } from 'react'
import { useRouter } from '@/navigation'
import type { Plan } from '@/lib/pricing'

/**
 * Port of `planCard.dc.html`. Highlighted plan (Pro) gets the dark
 * scale(1.03) treatment with teal accents; other plans stay white with a
 * solid or ghost CTA per `ctaStyle`. All CTAs route to `/pricing` except the
 * Institution plan ("Nous contacter" / "Contact us"), which routes to `/about`.
 */
export function PlanCard({ p }: { p: Plan }) {
  const router = useRouter()
  const hi = p.highlight
  const solid = p.ctaStyle === 'solid'

  const cardStyle: CSSProperties = {
    position: 'relative',
    borderRadius: '22px',
    padding: '32px',
    background: hi ? '#0C1512' : '#fff',
    border: hi ? '1px solid #0C1512' : '1px solid rgba(12,21,18,.1)',
    boxShadow: hi ? '0 30px 70px -24px rgba(12,21,18,.5)' : 'none',
    transform: hi ? 'scale(1.03)' : 'none',
  }
  const ctaBtnStyle: CSSProperties = {
    width: '100%',
    height: 48,
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '15px',
    fontFamily: 'inherit',
    border: hi ? 'none' : '1px solid rgba(12,21,18,.16)',
    background: hi ? '#0FA893' : solid ? '#0C1512' : '#fff',
    color: hi ? '#fff' : solid ? '#fff' : '#0C1512',
  }
  const nameColor = hi ? '#4FD8C6' : '#0A5049'
  const priceColor = hi ? '#fff' : '#0C1512'
  const periodColor = hi ? 'rgba(255,255,255,.6)' : '#566962'
  const divider = hi ? 'rgba(255,255,255,.14)' : 'rgba(12,21,18,.08)'
  const featColor = hi ? 'rgba(255,255,255,.85)' : '#3A4642'
  const checkColor = hi ? '#4FD8C6' : '#0FA893'

  return (
    <div style={cardStyle}>
      {p.tag && (
        <div
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            background: '#0FA893',
            color: '#fff',
            fontSize: '12px',
            fontWeight: 600,
            padding: '5px 12px',
            borderRadius: '100px',
          }}
        >
          {p.tag}
        </div>
      )}

      <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: '15px', letterSpacing: '.02em', marginBottom: 16, color: nameColor }}>
        {p.name}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6 }}>
        <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: '46px', letterSpacing: '-.03em', color: priceColor }}>
          {p.price}
          {p.unit}
        </span>
      </div>

      <div style={{ fontSize: '13px', color: periodColor, marginBottom: 26, minHeight: 18 }}>{p.period}</div>

      <button type="button" onClick={() => router.push(p.id === 'inst' ? '/about' : '/pricing')} style={ctaBtnStyle}>
        {p.cta}
      </button>

      <div style={{ height: 1, background: divider, margin: '26px 0' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
        {p.features.map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 11, fontSize: '14px', lineHeight: 1.4, color: featColor }}>
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke={checkColor}
              strokeWidth={2.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ flexShrink: 0, marginTop: 1 }}
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
            <span>{f}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
