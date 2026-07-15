import { SignJWT, jwtVerify } from 'jose'
import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export const COOKIE_NAME = 'admin-token'

// Fail closed: a committed fallback secret would let anyone forge an admin
// token in production. Require JWT_SECRET there; allow a dev-only fallback locally.
const rawSecret = process.env.JWT_SECRET
if (!rawSecret && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET must be set in production')
}
const secret = new TextEncoder().encode(rawSecret ?? 'dev-only-fallback-not-for-production')

export async function signToken(payload: Record<string, unknown>): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret)
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, secret)
  return payload
}

export async function getAuthFromRequest(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value
  if (!token) return null
  try {
    return await verifyToken(token)
  } catch {
    return null
  }
}

export function checkCredentials(user: string, pass: string): boolean {
  const U = process.env.ADMIN_USER ?? 'admin'
  const P = process.env.ADMIN_PASSWORD
  if (!P) return false
  return user === U && pass === P
}

export async function getSession(): Promise<{ admin: boolean } | null> {
  const token = cookies().get(COOKIE_NAME)?.value
  if (!token) return null
  try {
    const p = await verifyToken(token)
    return { admin: !!p.admin }
  } catch {
    return null
  }
}
