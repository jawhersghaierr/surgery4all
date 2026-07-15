'use client'

import { useState, type CSSProperties } from 'react'
import { useTranslations } from 'next-intl'
import { buildPlans, type Billing, type Translator } from '@/lib/pricing'
import { PlanCard } from '@/components/site/PlanCard'

const pillBase: CSSProperties = { padding: '9px 18px', borderRadius: 9, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit' }

/**
 * next-intl's `useTranslations()` result narrows `key` to the literal
 * namespaced-key union of the loaded messages, which TS won't let us pass
 * directly where `pricing.ts`'s deliberately-loose `Translator =
 * (key: string) => string` is expected (correct parameter contravariance).
 * Mirrors the widening cast in `pricing.integration.test.ts`.
 */
function toTranslator(t: (key: never) => string): Translator {
  return (key: string) => t(key as never)
}

/** Port of the PRICING `<main>` block (HANDOFF `Surgery for All.dc.html` lines 255-275). */
export default function PricingPage() {
  const [billing, setBilling] = useState<Billing>('annual')
  const t = useTranslations('pricing')
  const tRoot = useTranslations()
  const annual = billing === 'annual'
  const plans = buildPlans(billing, toTranslator(tRoot))

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '56px 32px 90px' }}>
      <div style={{ textAlign: 'center', marginBottom: 14, fontSize: 13, fontWeight: 600, color: '#0FA893', letterSpacing: '.04em', textTransform: 'uppercase' }}>
        {t('eyebrow')}
      </div>
      <h1 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 46, letterSpacing: '-.03em', textAlign: 'center', marginBottom: 16 }}>
        {t('title')}
      </h1>
      <p style={{ fontSize: 17, color: '#566962', textAlign: 'center', maxWidth: 540, margin: '0 auto 30px' }}>{t('subtitle')}</p>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 44 }}>
        <div style={{ display: 'inline-flex', background: '#fff', border: '1px solid rgba(12,21,18,.1)', borderRadius: 12, padding: 5 }}>
          <button
            type="button"
            onClick={() => setBilling('monthly')}
            style={{ ...pillBase, background: !annual ? '#0C1512' : 'transparent', color: !annual ? '#fff' : '#3A4642' }}
          >
            {t('monthly')}
          </button>
          <button
            type="button"
            onClick={() => setBilling('annual')}
            style={{ ...pillBase, background: annual ? '#0C1512' : 'transparent', color: annual ? '#fff' : '#3A4642' }}
          >
            {t('annual')} <span style={{ color: '#0FA893' }}>{t('annualDiscount')}</span>
          </button>
        </div>
      </div>

      <div className="sfa-g3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22, alignItems: 'start' }}>
        {plans.map((p) => (
          <PlanCard key={p.id} p={p} />
        ))}
      </div>
      <p style={{ textAlign: 'center', fontSize: 13, color: '#566962', marginTop: 26 }}>{t('footnote')}</p>
    </main>
  )
}
