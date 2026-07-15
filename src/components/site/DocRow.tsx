'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/navigation'
import type { Doc } from '@/lib/types'

/** Port of `docRow.dc.html`. Free docs open `pdf_url`; premium docs route to `/pricing`. */
export function DocRow({ d }: { d: Doc }) {
  const t = useTranslations('docs')
  const router = useRouter()
  const locked = !!d.premium
  // Inline `style` always wins over stylesheet rules, so the `style-hover`
  // ports (docRow.dc.html) are done as local hover state rather than CSS
  // classes to guarantee the hover actually takes effect.
  const [freeHover, setFreeHover] = useState(false)
  const [premiumHover, setPremiumHover] = useState(false)

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid rgba(12,21,18,.08)',
        borderRadius: '16px',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 20,
      }}
    >
      <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(15,168,147,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0A5049" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
        </svg>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: '17px', lineHeight: 1.25, letterSpacing: '-.01em', marginBottom: 5 }}>
          {d.title}
        </h3>
        <div style={{ fontSize: '13px', color: '#566962' }}>
          {d.journal} · {d.year}
        </div>
      </div>

      {locked ? (
        <button
          type="button"
          onClick={() => router.push('/pricing')}
          onMouseEnter={() => setPremiumHover(true)}
          onMouseLeave={() => setPremiumHover(false)}
          style={{
            padding: '0 18px',
            height: 42,
            borderRadius: 11,
            border: premiumHover ? '1px solid #0FA893' : '1px solid rgba(12,21,18,.14)',
            background: '#fff',
            color: premiumHover ? '#0A5049' : '#0C1512',
            fontWeight: 600,
            fontSize: '13.5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexShrink: 0,
            whiteSpace: 'nowrap',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          {t('premiumPdf')}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => {
            if (d.pdf_url) window.open(d.pdf_url, '_blank', 'noopener,noreferrer')
          }}
          onMouseEnter={() => setFreeHover(true)}
          onMouseLeave={() => setFreeHover(false)}
          style={{
            padding: '0 18px',
            height: 42,
            borderRadius: 11,
            border: 'none',
            background: freeHover ? '#0FA893' : '#0C1512',
            color: '#fff',
            fontWeight: 600,
            fontSize: '13.5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexShrink: 0,
            whiteSpace: 'nowrap',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          {t('download')}
        </button>
      )}
    </div>
  )
}
