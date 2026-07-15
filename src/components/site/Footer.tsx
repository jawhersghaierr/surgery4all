'use client'

import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/navigation'

const linkStyle = { cursor: 'pointer', color: '#566962', textDecoration: 'none' } as const

export function Footer() {
  const t = useTranslations('footer')
  const pathname = usePathname()

  if (pathname === '/admin') return null

  return (
    <footer style={{ background: '#fff', borderTop: '1px solid rgba(12,21,18,.08)' }}>
      <div
        className="sfa-footer"
        style={{ maxWidth: 1220, margin: '0 auto', padding: '52px 32px 40px', display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', gap: 40 }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: '#0FA893', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v6M12 22a5 5 0 0 0 5-5c0-2-1-3-1-6H8c0 3-1 4-1 6a5 5 0 0 0 5 5Z" />
              </svg>
            </div>
            <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: '16px' }}>Surgery4all</span>
          </div>
          <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#566962', maxWidth: 280 }}>{t('tagline')}</p>
        </div>

        <div>
          <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: 14 }}>{t('contentTitle')}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9, fontSize: '14px', color: '#566962' }}>
            <Link href="/cases" style={linkStyle}>{t('links.cases')}</Link>
            <Link href="/publications" style={linkStyle}>{t('links.publications')}</Link>
            <Link href="/blog" style={linkStyle}>{t('links.blog')}</Link>
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: 14 }}>{t('offerTitle')}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9, fontSize: '14px', color: '#566962' }}>
            <Link href="/pricing" style={linkStyle}>{t('links.subscriptions')}</Link>
            <Link href="/about" style={linkStyle}>{t('links.about')}</Link>
            <Link href="/admin" style={linkStyle}>{t('links.admin')}</Link>
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: 14 }}>{t('legalTitle')}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9, fontSize: '14px', color: '#566962' }}>
            <span>{t('links.legalNotice')}</span>
            <span>{t('links.privacy')}</span>
            <span>{t('links.terms')}</span>
          </div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(12,21,18,.08)', padding: '20px 32px', textAlign: 'center', fontSize: '13px', color: '#566962' }}>
        {t('copyright')}
      </div>
    </footer>
  )
}
