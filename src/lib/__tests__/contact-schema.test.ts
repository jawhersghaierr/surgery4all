import { describe, it, expect } from 'vitest'
import { contactSchema } from '@/lib/validation'

describe('contactSchema', () => {
  it('rejects bad email', () => {
    expect(
      contactSchema.safeParse({ name: 'Jo', email: 'x', message: '0123456789' }).success
    ).toBe(false)
  })

  it('accepts valid input', () => {
    expect(
      contactSchema.safeParse({ name: 'Jo', email: 'a@b.fr', message: '0123456789' }).success
    ).toBe(true)
  })

  it('rejects short name', () => {
    expect(
      contactSchema.safeParse({ name: 'J', email: 'a@b.fr', message: '0123456789' }).success
    ).toBe(false)
  })

  it('rejects short message', () => {
    expect(
      contactSchema.safeParse({ name: 'Jo', email: 'a@b.fr', message: '012345' }).success
    ).toBe(false)
  })
})
