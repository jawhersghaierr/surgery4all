import { Fragment } from 'react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getCases, getDocuments } from '@/lib/data'
import { Link } from '@/navigation'
import { CaseCard } from '@/components/site/CaseCard'
import { ImageSlot } from '@/components/site/ImageSlot'
import { HoverLink } from '@/components/site/HoverLink'
import { Testimonials, type Testimonial } from '@/components/site/Testimonials'

/** Port of the HOME `<main>` block (HANDOFF `Surgery for All.dc.html` lines 96-195). */
export default async function HomePage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)

  const t = await getTranslations('home')
  const [cases, docs] = await Promise.all([getCases(), getDocuments()])
  const specialties = t.raw('specialties') as string[]
  const testimonials = t.raw('testimonials') as Testimonial[]

  return (
    <main>
      {/* Hero */}
      <section
        className="sfa-hero"
        style={{
          maxWidth: 1220,
          margin: '0 auto',
          padding: '76px 32px 60px',
          display: 'grid',
          gridTemplateColumns: '1.05fr .95fr',
          gap: 56,
          alignItems: 'center',
        }}
      >
        <div style={{ animation: 'sfaRise .6s ease both' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '7px 14px',
              borderRadius: 100,
              background: 'rgba(15,168,147,.1)',
              color: '#0A5049',
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 26,
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#0FA893' }} />
            {t('hero.badge')}
          </div>

          <h1
            className="sfa-h1"
            style={{
              fontFamily: "'Space Grotesk'",
              fontWeight: 700,
              fontSize: 56,
              lineHeight: 1.04,
              letterSpacing: '-.03em',
              marginBottom: 22,
            }}
          >
            {t('hero.titleLine1')}
            <br />
            <span style={{ color: '#0FA893' }}>{t('hero.titleLine2')}</span>
          </h1>

          <p style={{ fontSize: 18, lineHeight: 1.6, color: '#566962', maxWidth: 490, marginBottom: 34 }}>
            {t('hero.subtitle')}
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <HoverLink
              href="/cases"
              style={{
                padding: '0 26px',
                height: 52,
                borderRadius: 13,
                border: 'none',
                background: '#0C1512',
                color: '#fff',
                fontWeight: 600,
                fontSize: 15,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 9,
                textDecoration: 'none',
              }}
              hoverStyle={{ background: '#0FA893' }}
            >
              {t('hero.ctaCases')}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </HoverLink>

            <HoverLink
              href="/pricing"
              style={{
                padding: '0 26px',
                height: 52,
                borderRadius: 13,
                border: '1px solid rgba(12,21,18,.16)',
                background: '#fff',
                color: '#0C1512',
                fontWeight: 600,
                fontSize: 15,
                cursor: 'pointer',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
              }}
              hoverStyle={{ border: '1px solid #0FA893', color: '#0A5049' }}
            >
              {t('hero.ctaPricing')}
            </HoverLink>
          </div>

          <div style={{ display: 'flex', gap: 34, marginTop: 44 }}>
            <div>
              <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 28 }}>{t('stats.casesCount')}</div>
              <div style={{ fontSize: 13, color: '#566962' }}>{t('stats.casesLabel')}</div>
            </div>
            <div>
              <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 28 }}>{t('stats.publicationsCount')}</div>
              <div style={{ fontSize: 13, color: '#566962' }}>{t('stats.publicationsLabel')}</div>
            </div>
            <div>
              <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 28 }}>{t('stats.practitionersCount')}</div>
              <div style={{ fontSize: 13, color: '#566962' }}>{t('stats.practitionersLabel')}</div>
            </div>
          </div>
        </div>

        <div style={{ position: 'relative', animation: 'sfaRise .7s .1s ease both' }}>
          <div
            style={{
              position: 'relative',
              aspectRatio: '4/5',
              borderRadius: 24,
              overflow: 'hidden',
              boxShadow: '0 30px 70px -24px rgba(12,21,18,.4)',
            }}
          >
            <ImageSlot placeholder={t('hero.imageSlot')} />
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: -22,
              left: -22,
              background: '#fff',
              borderRadius: 16,
              padding: '16px 18px',
              boxShadow: '0 18px 44px -14px rgba(12,21,18,.3)',
              display: 'flex',
              alignItems: 'center',
              gap: 13,
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 11,
                background: 'rgba(15,168,147,.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0A5049" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{t('hero.badgeTitle')}</div>
              <div style={{ fontSize: 12, color: '#566962' }}>{t('hero.badgeMeta')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Specialties marquee */}
      <section style={{ borderTop: '1px solid rgba(12,21,18,.08)', borderBottom: '1px solid rgba(12,21,18,.08)', background: '#fff' }}>
        <div
          style={{
            maxWidth: 1220,
            margin: '0 auto',
            padding: '22px 32px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px 26px',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            fontWeight: 500,
            color: '#566962',
          }}
        >
          {specialties.map((s, i) => (
            <Fragment key={s}>
              {i > 0 && <span style={{ color: '#0FA893' }}>•</span>}
              <span>{s}</span>
            </Fragment>
          ))}
        </div>
      </section>

      {/* Featured cases */}
      <section style={{ maxWidth: 1220, margin: '0 auto', padding: '74px 32px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 34, gap: 20 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#0FA893', letterSpacing: '.04em', textTransform: 'uppercase', marginBottom: 10 }}>
              {t('recent.eyebrow')}
            </div>
            <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 36, letterSpacing: '-.02em' }}>{t('recent.title')}</h2>
          </div>
          <Link
            href="/cases"
            style={{ background: 'none', border: 'none', color: '#0A5049', fontWeight: 600, fontSize: 15, cursor: 'pointer', whiteSpace: 'nowrap', textDecoration: 'none' }}
          >
            {t('recent.seeAll')}
          </Link>
        </div>
        <div className="sfa-g3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22 }}>
          {cases.slice(0, 3).map((c) => (
            <CaseCard key={c.id} c={c} />
          ))}
        </div>
      </section>

      {/* Docs teaser */}
      <section style={{ maxWidth: 1220, margin: '0 auto', padding: '70px 32px' }}>
        <div
          className="sfa-g2dark"
          style={{
            background: '#0C1512',
            borderRadius: 28,
            padding: 52,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 48,
            alignItems: 'center',
            color: '#fff',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -80,
              right: -60,
              width: 280,
              height: 280,
              borderRadius: '50%',
              background: 'radial-gradient(circle,rgba(15,168,147,.32),transparent 70%)',
            }}
          />
          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#4FD8C6', letterSpacing: '.04em', textTransform: 'uppercase', marginBottom: 14 }}>
              {t('docsTeaser.eyebrow')}
            </div>
            <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 34, lineHeight: 1.1, letterSpacing: '-.02em', marginBottom: 16 }}>
              {t('docsTeaser.title')}
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: 'rgba(255,255,255,.7)', marginBottom: 28 }}>{t('docsTeaser.body')}</p>
            <HoverLink
              href="/publications"
              style={{
                padding: '0 24px',
                height: 48,
                borderRadius: 12,
                border: 'none',
                background: '#0FA893',
                color: '#fff',
                fontWeight: 600,
                fontSize: 15,
                cursor: 'pointer',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              hoverStyle={{ background: '#4FD8C6', color: '#0C1512' }}
            >
              {t('docsTeaser.cta')}
            </HoverLink>
          </div>
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {docs.slice(0, 3).map((d) => (
              <div
                key={d.id}
                style={{
                  background: 'rgba(255,255,255,.06)',
                  border: '1px solid rgba(255,255,255,.1)',
                  borderRadius: 14,
                  padding: '16px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: 'rgba(15,168,147,.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4FD8C6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6" />
                  </svg>
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.title}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,.55)' }}>
                    {d.journal} · {d.year}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ maxWidth: 1220, margin: '0 auto', padding: '20px 32px 74px' }}>
        <h2
          style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 36, letterSpacing: '-.02em', textAlign: 'center', marginBottom: 38 }}
        >
          {t('testimonialsTitle')}
        </h2>
        <Testimonials items={testimonials} />
      </section>

      {/* Final CTA */}
      <section style={{ maxWidth: 1220, margin: '0 auto', padding: '0 32px 90px' }}>
        <div style={{ background: 'linear-gradient(135deg,#0FA893,#0A5049)', borderRadius: 28, padding: '64px 52px', textAlign: 'center', color: '#fff' }}>
          <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 40, letterSpacing: '-.025em', marginBottom: 16 }}>
            {t('finalCta.title')}
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,.85)', maxWidth: 520, margin: '0 auto 30px' }}>{t('finalCta.body')}</p>
          <HoverLink
            href="/pricing"
            style={{
              padding: '0 32px',
              height: 54,
              borderRadius: 14,
              border: 'none',
              background: '#fff',
              color: '#0A5049',
              fontWeight: 700,
              fontSize: 16,
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            hoverStyle={{ background: '#0C1512', color: '#fff' }}
          >
            {t('finalCta.button')}
          </HoverLink>
        </div>
      </section>
    </main>
  )
}
