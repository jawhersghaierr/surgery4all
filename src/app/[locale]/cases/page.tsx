import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getCases } from '@/lib/data'
import { CasesClient } from './CasesClient'

/** Port of the CASES `<main>` block (HANDOFF `Surgery for All.dc.html` lines 199-218). */
export default async function CasesPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)

  const t = await getTranslations('cases')
  const cases = await getCases()

  return (
    <main style={{ maxWidth: 1220, margin: '0 auto', padding: '56px 32px 90px' }}>
      <div style={{ marginBottom: 12, fontSize: 13, fontWeight: 600, color: '#0FA893', letterSpacing: '.04em', textTransform: 'uppercase' }}>
        {t('eyebrow')}
      </div>
      <h1 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 44, letterSpacing: '-.03em', marginBottom: 14 }}>
        {t('title')}
      </h1>
      <p style={{ fontSize: 17, color: '#566962', maxWidth: 600, marginBottom: 14 }}>{t('subtitle')}</p>

      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: 'rgba(255,138,76,.12)',
          color: '#B4531F',
          padding: '8px 14px',
          borderRadius: 10,
          fontSize: 13,
          fontWeight: 500,
          marginBottom: 30,
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
          <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
        </svg>
        {t('warning')}
      </div>

      <CasesClient cases={cases} />
    </main>
  )
}
