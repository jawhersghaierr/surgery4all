import { describe, it, expect } from 'vitest'
import { createTranslator } from 'next-intl'
import { buildPlans, type Translator } from '@/lib/pricing'
import fr from '@/messages/fr.json'
import en from '@/messages/en.json'

// next-intl's createTranslator narrows `key` to the literal namespaced-key
// union of the messages object passed in, which TS won't let us pass where a
// plain `(key: string) => string` is expected (correct parameter
// contravariance — the narrow union isn't assignable from `string`).
// `buildPlans`'s `Translator` type is deliberately loose so it isn't coupled
// to next-intl's generated types; downstream call sites (useTranslations()/
// getTranslations() results) will need this same widening cast.
function toTranslator(t: (key: never) => string): Translator {
  return (key: string) => t(key as never)
}

describe('buildPlans against real messages', () => {
  it('resolves real French copy (monthly)', () => {
    const t = toTranslator(createTranslator({ locale: 'fr', messages: fr }))
    const plans = buildPlans('monthly', t)
    expect(plans[0].name).toBe('Découverte')
    expect(plans[1].name).toBe('Praticien')
    expect(plans[1].tag).toBe('Populaire')
    expect(plans[2].name).toBe('Institution')
    expect(plans.map((p) => p.price)).toEqual([0, 29, 99])
    expect(plans[1].period).toBe('/mois')
    expect(plans[1].features).toEqual([
      'Tout Découverte',
      'Toutes les vidéos commentées',
      'PDF complets téléchargeables',
      'Nouveaux cas chaque semaine',
      'Fiches protocolaires',
    ])
    expect(plans[0].cta).toBe('Commencer')
    // no leaked message keys
    for (const p of plans) {
      expect(p.name).not.toMatch(/\./)
      for (const f of p.features) expect(f).not.toMatch(/^pricing\./)
    }
  })

  it('resolves real French copy (annual) with discounted prices and annual period', () => {
    const t = toTranslator(createTranslator({ locale: 'fr', messages: fr }))
    const plans = buildPlans('annual', t)
    expect(plans.map((p) => p.price)).toEqual([0, 23, 79])
    expect(plans[1].period).toBe('/mois · facturé annuellement')
    expect(plans[2].period).toBe('/mois · facturé annuellement')
  })

  it('resolves real English copy', () => {
    const t = toTranslator(createTranslator({ locale: 'en', messages: en }))
    const plans = buildPlans('monthly', t)
    expect(plans[0].name).toBe('Discovery')
    expect(plans[1].name).toBe('Practitioner')
    expect(plans[1].tag).toBe('Most popular')
    expect(plans[2].name).toBe('Institution')
    expect(plans[1].cta).toBe('Subscribe')
  })
})
