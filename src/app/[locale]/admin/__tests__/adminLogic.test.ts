import { describe, it, expect } from 'vitest'
import { tabButtonStyle, premiumSuffix, statusPillStyle } from '../adminLogic'

describe('tabButtonStyle', () => {
  it('active tab -> teal underline, white text, bold', () => {
    const s = tabButtonStyle(true)
    expect(s.borderBottom).toBe('2px solid #4FD8C6')
    expect(s.color).toBe('#fff')
    expect(s.fontWeight).toBe(600)
  })

  it('inactive tab -> transparent underline, dimmed text, regular weight', () => {
    const s = tabButtonStyle(false)
    expect(s.borderBottom).toBe('2px solid transparent')
    expect(s.color).toBe('rgba(255,255,255,.55)')
    expect(s.fontWeight).toBe(500)
  })
})

describe('premiumSuffix', () => {
  const labels = { premium: 'Premium', free: 'Gratuit' }

  it('premium -> " · Premium"', () => {
    expect(premiumSuffix(true, labels)).toBe(' · Premium')
  })

  it('free -> " · Gratuit"', () => {
    expect(premiumSuffix(false, labels)).toBe(' · Gratuit')
  })
})

describe('statusPillStyle', () => {
  it('active -> teal pill', () => {
    const s = statusPillStyle('active')
    expect(s.background).toBe('rgba(15,168,147,.18)')
    expect(s.color).toBe('#4FD8C6')
  })

  it('free -> gray pill', () => {
    const s = statusPillStyle('free')
    expect(s.background).toBe('rgba(255,255,255,.1)')
    expect(s.color).toBe('rgba(255,255,255,.7)')
  })

  it('paused -> orange pill', () => {
    const s = statusPillStyle('paused')
    expect(s.background).toBe('rgba(255,138,76,.18)')
    expect(s.color).toBe('#FFB07C')
  })
})
