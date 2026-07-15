'use client'

import { useState, type CSSProperties } from 'react'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/navigation'
import { LocaleSwitch } from './LocaleSwitch'
import { BrandMark } from './BrandMark'

type NavKey = 'accueil' | 'cases' | 'publications' | 'blog' | 'pricing' | 'about'

const NAV_ITEMS: { href: string; key: NavKey }[] = [
  { href: '/', key: 'accueil' },
  { href: '/cases', key: 'cases' },
  { href: '/publications', key: 'publications' },
  { href: '/blog', key: 'blog' },
  { href: '/pricing', key: 'pricing' },
  { href: '/about', key: 'about' },
]

/** Port of the `nav()` style helper (HANDOFF line 524). */
function navLinkStyle(active: boolean): CSSProperties {
  return {
    padding: '9px 15px',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: active ? 600 : 500,
    fontFamily: 'inherit',
    background: active ? 'rgba(15,168,147,.12)' : 'transparent',
    color: active ? '#0A5049' : '#3A4642',
    textDecoration: 'none',
    display: 'inline-block',
  }
}

/** Port of the mobile-panel button style (HANDOFF lines 83-88). */
function mobileLinkStyle(): CSSProperties {
  return {
    padding: '13px 14px',
    borderRadius: '10px',
    border: 'none',
    background: 'transparent',
    textAlign: 'left',
    fontSize: '15px',
    fontWeight: 500,
    color: '#0C1512',
    cursor: 'pointer',
    fontFamily: 'inherit',
    textDecoration: 'none',
    display: 'block',
  }
}

/** Active-link detection: exact match, except home which only matches `/`. */
function isActive(pathname: string, href: string): boolean {
  return href === '/' ? pathname === '/' : pathname === href
}

export function Header() {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [gearHover, setGearHover] = useState(false)
  const [subHover, setSubHover] = useState(false)

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(245,247,245,.82)',
        backdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(12,21,18,.08)',
      }}
    >
      <div style={{ maxWidth: 1220, margin: '0 auto', padding: '0 32px', height: 72, display: 'flex', alignItems: 'center', gap: 32 }}>
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          style={{ display: 'flex', alignItems: 'center', gap: 11, cursor: 'pointer', flexShrink: 0, textDecoration: 'none' }}
        >
          <BrandMark size={36} />
          <div style={{ lineHeight: 1.05 }}>
            <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: '18px', letterSpacing: '-.02em', color: '#0C1512' }}>
              Surgery<span style={{ color: '#0FA893' }}>4</span>all
            </div>
            <div style={{ fontSize: '9.5px', color: '#566962', fontWeight: 500, letterSpacing: '.03em', marginTop: 3, textTransform: 'uppercase' }}>
              by Dr Sghaier Jihed
            </div>
          </div>
        </Link>

        <nav className="sfa-navlinks" style={{ display: 'flex', gap: 4, marginLeft: 8 }}>
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} style={navLinkStyle(isActive(pathname, item.href))}>
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <LocaleSwitch />

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="sfa-burger"
            aria-label="Menu"
            aria-expanded={menuOpen}
            style={{
              width: 38,
              height: 38,
              borderRadius: 11,
              border: '1px solid rgba(12,21,18,.14)',
              background: '#fff',
              cursor: 'pointer',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0C1512',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>

          <Link
            href="/admin"
            title={t('adminTitle')}
            onMouseEnter={() => setGearHover(true)}
            onMouseLeave={() => setGearHover(false)}
            style={{
              width: 38,
              height: 38,
              borderRadius: 11,
              border: `1px solid ${gearHover ? '#0FA893' : 'rgba(12,21,18,.14)'}`,
              background: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: gearHover ? '#0FA893' : '#566962',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
            </svg>
          </Link>

          <Link
            href="/pricing"
            className="sfa-hidemob"
            onMouseEnter={() => setSubHover(true)}
            onMouseLeave={() => setSubHover(false)}
            style={{
              padding: '0 20px',
              height: 40,
              borderRadius: 11,
              border: 'none',
              background: subHover ? '#0FA893' : '#0C1512',
              color: '#fff',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {t('subscribe')}
          </Link>
        </div>
      </div>

      {menuOpen && (
        <div
          style={{
            borderTop: '1px solid rgba(12,21,18,.08)',
            background: 'rgba(245,247,245,.99)',
            padding: '10px 20px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} style={mobileLinkStyle()}>
              {t(item.key)}
            </Link>
          ))}
          <Link
            href="/pricing"
            onClick={() => setMenuOpen(false)}
            style={{
              marginTop: 8,
              height: 48,
              borderRadius: 11,
              border: 'none',
              background: '#0C1512',
              color: '#fff',
              fontWeight: 600,
              fontSize: '15px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {t('subscribe')}
          </Link>
        </div>
      )}
    </header>
  )
}
