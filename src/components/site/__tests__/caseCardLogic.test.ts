import { describe, it, expect } from 'vitest'
import { typeText, premText, showLock, showSensitive } from '@/components/site/caseCardLogic'

describe('typeText', () => {
  it('video with duration -> "Vidéo · 12 min"', () => {
    expect(typeText({ type: 'video', duration: '12 min' })).toBe('Vidéo · 12 min')
  })

  it('video without duration -> "Vidéo" only', () => {
    expect(typeText({ type: 'video', duration: '' })).toBe('Vidéo')
  })

  it('photo -> "Photo"', () => {
    expect(typeText({ type: 'photo', duration: '' })).toBe('Photo')
  })

  it('accepts custom labels (i18n)', () => {
    expect(
      typeText({ type: 'video', duration: '5 min' }, { video: 'Video', photo: 'Photo' })
    ).toBe('Video · 5 min')
  })
})

describe('premText', () => {
  it('premium -> "Premium"', () => {
    expect(premText({ premium: true })).toBe('Premium')
  })

  it('free -> "Gratuit"', () => {
    expect(premText({ premium: false })).toBe('Gratuit')
  })
})

describe('showLock', () => {
  it('premium -> true', () => {
    expect(showLock({ premium: true })).toBe(true)
  })

  it('not premium -> false', () => {
    expect(showLock({ premium: false })).toBe(false)
  })
})

describe('showSensitive', () => {
  it('sensitive & !premium & !revealed -> true', () => {
    expect(showSensitive({ premium: false, sensitive: true }, false)).toBe(true)
  })

  it('premium + sensitive -> showLock true & showSensitive false (lock wins)', () => {
    const c = { premium: true, sensitive: true }
    expect(showLock(c)).toBe(true)
    expect(showSensitive(c, false)).toBe(false)
  })

  it('revealed suppresses the sensitive overlay', () => {
    expect(showSensitive({ premium: false, sensitive: true }, true)).toBe(false)
  })

  it('not sensitive -> false', () => {
    expect(showSensitive({ premium: false, sensitive: false }, false)).toBe(false)
  })
})
