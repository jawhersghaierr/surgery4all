import { describe, it, expect } from 'vitest'
import { routing } from '@/routing'
describe('routing', () => {
  it('has fr + en only, fr default', () => {
    expect(routing.locales).toEqual(['fr', 'en'])
    expect(routing.defaultLocale).toBe('fr')
  })
})
