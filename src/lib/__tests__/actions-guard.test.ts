import { describe, it, expect } from 'vitest'
import { assertAdmin } from '@/lib/adminGuard'

describe('assertAdmin', () => {
  it('rejects a null session', () => {
    expect(assertAdmin(null)).toBe(false)
  })

  it('rejects an undefined session', () => {
    expect(assertAdmin(undefined)).toBe(false)
  })

  it('rejects a non-admin session', () => {
    expect(assertAdmin({ admin: false })).toBe(false)
  })

  it('accepts an admin session', () => {
    expect(assertAdmin({ admin: true })).toBe(true)
  })
})
