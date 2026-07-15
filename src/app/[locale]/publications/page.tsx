import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getDocuments } from '@/lib/data'
import { DocRow } from '@/components/site/DocRow'

/** Port of the DOCS `<main>` block (HANDOFF `Surgery for All.dc.html` lines 221-232). */
export default async function PublicationsPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)

  const t = await getTranslations('docs')
  const docs = await getDocuments()

  return (
    <main style={{ maxWidth: 1000, margin: '0 auto', padding: '56px 32px 90px' }}>
      <div style={{ marginBottom: 12, fontSize: 13, fontWeight: 600, color: '#0FA893', letterSpacing: '.04em', textTransform: 'uppercase' }}>
        {t('eyebrow')}
      </div>
      <h1 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 44, letterSpacing: '-.03em', marginBottom: 14 }}>
        {t('title')}
      </h1>
      <p style={{ fontSize: 17, color: '#566962', maxWidth: 600, marginBottom: 38 }}>{t('subtitle')}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {docs.map((d) => (
          <DocRow key={d.id} d={d} />
        ))}
      </div>
    </main>
  )
}
