import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ImageSlot } from '@/components/site/ImageSlot'
import { ContactForm } from '@/components/site/ContactForm'

/** Port of the ABOUT `<main>` block (HANDOFF `Surgery for All.dc.html` lines 278-316). */
export default async function AboutPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)

  const t = await getTranslations('about')

  return (
    <main style={{ maxWidth: 1000, margin: '0 auto', padding: '56px 32px 90px' }}>
      <div
        className="sfa-about"
        style={{ display: 'grid', gridTemplateColumns: '.8fr 1.2fr', gap: 48, alignItems: 'start', marginBottom: 64 }}
      >
        <div style={{ position: 'relative', aspectRatio: '3/4', borderRadius: 22, overflow: 'hidden', boxShadow: '0 24px 60px -22px rgba(12,21,18,.35)' }}>
          <ImageSlot src="/practitioner.jpg" placeholder={t('portraitPlaceholder')} />
        </div>
        <div>
          <div style={{ marginBottom: 12, fontSize: 13, fontWeight: 600, color: '#0FA893', letterSpacing: '.04em', textTransform: 'uppercase' }}>
            {t('eyebrow')}
          </div>
          <h1 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 40, letterSpacing: '-.03em', marginBottom: 8 }}>{t('name')}</h1>
          <div style={{ fontSize: 16, color: '#0A5049', fontWeight: 500, marginBottom: 24 }}>{t('role')}</div>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: '#3A4642', marginBottom: 18 }}>{t('bio1')}</p>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: '#3A4642', marginBottom: 30 }}>{t('bio2')}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
            <div style={{ background: '#fff', border: '1px solid rgba(12,21,18,.08)', borderRadius: 14, padding: 18 }}>
              <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 24, color: '#0FA893' }}>{t('stats.yearsValue')}</div>
              <div style={{ fontSize: 13, color: '#566962' }}>{t('stats.yearsLabel')}</div>
            </div>
            <div style={{ background: '#fff', border: '1px solid rgba(12,21,18,.08)', borderRadius: 14, padding: 18 }}>
              <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 24, color: '#0FA893' }}>{t('stats.implantsValue')}</div>
              <div style={{ fontSize: 13, color: '#566962' }}>{t('stats.implantsLabel')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact / RDV */}
      <div
        className="sfa-g2dark"
        style={{ background: '#0C1512', borderRadius: 28, padding: 52, color: '#fff', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}
      >
        <div>
          <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 32, letterSpacing: '-.02em', marginBottom: 14 }}>
            {t('contact.title')}
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: 'rgba(255,255,255,.7)', marginBottom: 28 }}>{t('contact.body')}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontSize: 15 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4FD8C6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
              </svg>
              {t('contact.phone')}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4FD8C6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
                <path d="m22 6-10 7L2 6" />
              </svg>
              {t('contact.email')}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4FD8C6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {t('contact.location')}
            </div>
          </div>
        </div>
        <ContactForm />
      </div>
    </main>
  )
}
