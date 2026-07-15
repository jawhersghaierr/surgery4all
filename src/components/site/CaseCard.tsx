'use client'

import { type CSSProperties } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/navigation'
import type { Case } from '@/lib/types'
import { ImageSlot } from './ImageSlot'
import { premText, showLock, showSensitive, typeText } from './caseCardLogic'

/** Port of `caseCard.dc.html`'s `badge()` helper (HANDOFF line 61). */
function badgeStyle(background: string, color: string): CSSProperties {
  return {
    padding: '4px 10px',
    borderRadius: '7px',
    fontSize: '11px',
    fontWeight: 600,
    background,
    color,
    backdropFilter: 'blur(4px)',
  }
}

export function CaseCard({ c }: { c: Case }) {
  const t = useTranslations('caseCard')
  const router = useRouter()

  const isVideo = c.type === 'video'
  const locked = showLock(c)
  // Card thumbnail always shows the sensitive blur (reveal happens on detail).
  const sensitive = showSensitive(c, false)

  // Photo count for the badge: stored list, or the cover alone. Guard against
  // a missing media_urls column (select('*') omits columns that don't exist).
  const mediaUrls = c.media_urls ?? []
  const gallery = mediaUrls.length > 0 ? mediaUrls : c.media_url ? [c.media_url] : []
  // Non-premium cards navigate to the detail page; premium cards route to
  // pricing via their lock overlay instead.
  const navigable = !locked

  const typeLabel = typeText(c, { video: t('video'), photo: t('photo') })
  const accessLabel = premText(c, { premium: t('premium'), free: t('free') })
  const accessBadge = c.premium
    ? badgeStyle('rgba(255,255,255,.85)', '#0A5049')
    : badgeStyle('rgba(15,168,147,.9)', '#fff')

  return (
    <div
      onClick={navigable ? () => router.push(`/cases/${c.id}`) : undefined}
      style={{
        background: '#fff',
        border: '1px solid rgba(12,21,18,.08)',
        borderRadius: '20px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        cursor: navigable ? 'pointer' : 'default',
      }}
    >
      <div
        style={{
          position: 'relative',
          aspectRatio: '4/3',
          background: 'linear-gradient(135deg,#D9EBE6,#B7DDD4)',
          overflow: 'hidden',
        }}
      >
        <ImageSlot src={c.media_url} placeholder={c.title} />

        {/* media type + access badges */}
        <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 3, display: 'flex', gap: 7 }}>
          <span style={badgeStyle('rgba(12,21,18,.7)', '#fff')}>{typeLabel}</span>
          <span style={accessBadge}>{accessLabel}</span>
        </div>

        {/* photo-count badge (multi-photo cases) */}
        {gallery.length > 1 && (
          <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 3 }}>
            <span style={{ ...badgeStyle('rgba(12,21,18,.7)', '#fff'), display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21" />
              </svg>
              {gallery.length}
            </span>
          </div>
        )}

        {/* play glyph for video */}
        {isVideo && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: '50%',
                background: 'rgba(12,21,18,.55)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                <polygon points="6 4 20 12 6 20 6 4" />
              </svg>
            </div>
          </div>
        )}

        {/* premium lock overlay (always wins over the sensitive blur) */}
        {locked && (
          <div
            onClick={(e) => { e.stopPropagation(); router.push('/pricing') }}
            role="button"
            tabIndex={0}
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 4,
              background: 'rgba(12,21,18,.62)',
              backdropFilter: 'blur(14px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              cursor: 'pointer',
              color: '#fff',
              padding: 20,
              textAlign: 'center',
            }}
          >
            <div style={{ width: 46, height: 46, borderRadius: 12, background: 'rgba(255,255,255,.14)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div style={{ fontWeight: 600, fontSize: '15px' }}>{t('lockedTitle')}</div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,.75)', textDecoration: 'underline' }}>{t('lockedCta')}</div>
          </div>
        )}

        {/* sensitive-content blur overlay (visual only; reveal happens on the
            detail page — clicking the card navigates there) */}
        {sensitive && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 4,
              background: 'rgba(245,247,245,.55)',
              backdropFilter: 'blur(16px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              padding: 20,
              textAlign: 'center',
            }}
          >
            <div style={{ width: 42, height: 42, borderRadius: 11, background: 'rgba(255,138,76,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B4531F" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
              </svg>
            </div>
            <div style={{ fontWeight: 600, fontSize: '14px', color: '#0C1512' }}>{t('sensitiveTitle')}</div>
            <div style={{ fontSize: '12px', color: '#B4531F' }}>{t('sensitiveHint')}</div>
          </div>
        )}
      </div>

      <div style={{ padding: '20px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: '12px', fontWeight: 600, color: '#0A5049', marginBottom: 8 }}>{c.specialty}</div>
        <h3 style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: '18px', lineHeight: 1.2, letterSpacing: '-.01em', marginBottom: 8 }}>
          {c.title}
        </h3>
        <p
          style={{
            fontSize: '13.5px',
            lineHeight: 1.5,
            color: '#566962',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {c.description}
        </p>
      </div>
    </div>
  )
}
