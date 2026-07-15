import { SignJWT, jwtVerify } from 'jose'
import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export const COOKIE_NAME = 'admin-token'

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'fallback-secret-change-in-production'
)

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
