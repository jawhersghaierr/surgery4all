import { describe, it, expect } from 'vitest'
import { signToken, verifyToken, checkCredentials } from '@/lib/auth'

describe('auth', () => {
  it('signs and verifies', async () => {
    const t = await signToken({ admin: true })
    const p = await verifyToken(t)
    expect(p.admin).toBe(true)
  })

  it('checks credentials from env', () => {
    process.env.ADMIN_USER = 'a'
    process.env.ADMIN_PASSWORD = 'b'
    expect(checkCredentials('a', 'b')).toBe(true)
    expect(checkCredentials('a', 'x')).toBe(false)
  })

  it('rejects when ADMIN_PASSWORD is unset', () => {
    delete process.env.ADMIN_USER
    delete process.env.ADMIN_PASSWORD
    expect(checkCredentials('admin', 'anything')).toBe(false)
  })
})
