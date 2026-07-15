export type Billing = 'monthly' | 'annual'

export type CtaStyle = 'solid' | 'ghost'

export interface Plan {
  id: 'free' | 'pro' | 'inst'
  name: string
  tag: string
  price: number
  unit: string
  period: string
  highlight: boolean
  features: string[]
  cta: string
  ctaStyle: CtaStyle
}

export type Translator = (key: string) => string

/** Discounted annual monthly-equivalent price (−20%, rounded to nearest integer). */
export function annualPrice(monthly: number): number {
  return Math.round(monthly * 0.8)
}

/**
 * Build the 3 pricing plan objects (free / pro / inst) for the given billing
 * cycle, mirroring the prototype's plan definitions (HANDOFF lines 551-561).
 * Copy (names, tags, features, CTA labels) is resolved through the provided
 * `t` translator against the `pricing.plans.*` message namespace.
 */
export function buildPlans(billing: Billing, t: Translator): Plan[] {
  const annual = billing === 'annual'
  const price = (monthly: number) => (annual ? annualPrice(monthly) : monthly)
  const monthlyPeriod = t('pricing.plans.pro.periodMonthly')
  const annualPeriod = t('pricing.plans.pro.periodAnnual')
  const instMonthlyPeriod = t('pricing.plans.inst.periodMonthly')
  const instAnnualPeriod = t('pricing.plans.inst.periodAnnual')

  return [
    {
      id: 'free',
      name: t('pricing.plans.free.name'),
      tag: '',
      price: price(0),
      unit: '€',
      period: t('pricing.plans.free.period'),
      highlight: false,
      features: [
        t('pricing.plans.free.features.0'),
        t('pricing.plans.free.features.1'),
        t('pricing.plans.free.features.2'),
        t('pricing.plans.free.features.3'),
      ],
      cta: t('pricing.plans.free.cta'),
      ctaStyle: 'ghost',
    },
    {
      id: 'pro',
      name: t('pricing.plans.pro.name'),
      tag: t('pricing.plans.pro.tag'),
      price: price(29),
      unit: '€',
      period: annual ? annualPeriod : monthlyPeriod,
      highlight: true,
      features: [
        t('pricing.plans.pro.features.0'),
        t('pricing.plans.pro.features.1'),
        t('pricing.plans.pro.features.2'),
        t('pricing.plans.pro.features.3'),
        t('pricing.plans.pro.features.4'),
      ],
      cta: t('pricing.plans.pro.cta'),
      ctaStyle: 'solid',
    },
    {
      id: 'inst',
      name: t('pricing.plans.inst.name'),
      tag: '',
      price: price(99),
      unit: '€',
      period: annual ? instAnnualPeriod : instMonthlyPeriod,
      highlight: false,
      features: [
        t('pricing.plans.inst.features.0'),
        t('pricing.plans.inst.features.1'),
        t('pricing.plans.inst.features.2'),
        t('pricing.plans.inst.features.3'),
        t('pricing.plans.inst.features.4'),
      ],
      cta: t('pricing.plans.inst.cta'),
      ctaStyle: 'ghost',
    },
  ]
}
