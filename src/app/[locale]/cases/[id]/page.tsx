import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { getApprovedComments, getCaseById } from '@/lib/data'
import { showLock } from '@/components/site/caseCardLogic'
import { Link } from '@/navigation'
import { HoverLink } from '@/components/site/HoverLink'
import { CaseDetail } from './CaseDetail'
import { CommentSection } from './CommentSection'

// DB-backed lookup by id → dynamic, not statically generated.
export const dynamic = 'force-dynamic'

export default async function CaseDetailPage({ params }: { params: { locale: string; id: string } }) {
  setRequestLocale(params.locale)

  const c = await getCaseById(params.id)
  if (!c) notFound()

  const t = await getTranslations('caseDetail')
  const locked = showLock(c)

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '48px 32px 90px' }}>
      <Link
        href="/cases"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 14, fontWeight: 500, color: '#0A5049', textDecoration: 'none', marginBottom: 26 }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
        {t('back')}
      </Link>

      <div style={{ fontSize: 13, fontWeight: 600, color: '#0A5049', marginBottom: 8 }}>{c.specialty}</div>
      <h1 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 38, letterSpacing: '-.03em', marginBottom: 20 }}>{c.title}</h1>

      {locked ? (
        // Premium: teaser only. No photo URLs or description reach the DOM.
        <div style={{ background: '#0C1512', borderRadius: 24, padding: '56px 40px', textAlign: 'center', color: '#fff' }}>
          <div style={{ width: 54, height: 54, borderRadius: 14, background: 'rgba(255,255,255,.12)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 24, marginBottom: 12 }}>{t('premiumTitle')}</h2>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: 'rgba(255,255,255,.7)', maxWidth: 420, margin: '0 auto 26px' }}>{t('premiumBody')}</p>
          <HoverLink
            href="/pricing"
            style={{ padding: '0 26px', height: 50, borderRadius: 13, border: 'none', background: '#0FA893', color: '#fff', fontWeight: 600, fontSize: 15, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
            hoverStyle={{ background: '#4FD8C6', color: '#0C1512' }}
          >
            {t('premiumCta')}
          </HoverLink>
        </div>
      ) : (
        <>
          <CaseDetail
            images={c.type === 'video' ? [] : (c.media_urls ?? []).length > 0 ? c.media_urls : c.media_url ? [c.media_url] : []}
            videoUrl={c.type === 'video' ? c.media_url : null}
            description={c.description}
            sensitive={c.sensitive}
            labels={{
              sensitiveTitle: t('sensitiveTitle'),
              sensitiveHint: t('sensitiveHint'),
              lightboxClose: t('lightboxClose'),
              lightboxPrev: t('lightboxPrev'),
              lightboxNext: t('lightboxNext'),
              noMedia: t('noMedia'),
            }}
          />
          <CommentSection
            caseId={c.id}
            comments={await getApprovedComments(c.id)}
            labels={{
              title: t('commentsTitle'),
              empty: t('commentsEmpty'),
              author: t('formAuthor'),
              body: t('formBody'),
              submit: t('formSubmit'),
              pending: t('formPending'),
            }}
          />
        </>
      )}
    </main>
  )
}
