import { describe, it, expect } from 'vitest'
import { annualPrice, buildPlans } from '@/lib/pricing'

describe('annualPrice', () => {
  it('annual = round(monthly*0.8)', () => {
    expect(annualPrice(29)).toBe(23)
    expect(annualPrice(99)).toBe(79)
    expect(annualPrice(0)).toBe(0)
  })
})

describe('buildPlans', () => {
  const t = (key: string) => key

  it('returns 3 plans with expected ids and monthly prices', () => {
    const plans = buildPlans('monthly', t)
    expect(plans.map((p) => p.id)).toEqual(['free', 'pro', 'inst'])
    expect(plans.map((p) => p.price)).toEqual([0, 29, 99])
    expect(plans[1].highlight).toBe(true)
    expect(plans[0].highlight).toBe(false)
    expect(plans[2].highlight).toBe(false)
  })

  it('returns discounted annual prices', () => {
    const plans = buildPlans('annual', t)
    expect(plans.map((p) => p.price)).toEqual([0, 23, 79])
  })

  it('sets ctaStyle solid for pro, ghost for free/inst', () => {
    const plans = buildPlans('monthly', t)
    expect(plans[0].ctaStyle).toBe('ghost')
    expect(plans[1].ctaStyle).toBe('solid')
    expect(plans[2].ctaStyle).toBe('ghost')
  })

  it('uses translator for names and features', () => {
    const plans = buildPlans('monthly', t)
    expect(plans[1].name).toBe('pricing.plans.pro.name')
    expect(plans[1].features.length).toBe(5)
    expect(plans[1].tag).toBe('pricing.plans.pro.tag')
  })
})
