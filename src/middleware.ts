import createMiddleware from 'next-intl/middleware'
import { routing } from './routing'

// next-intl locale routing. Admin JWT auth (lib/auth.ts) can be wired here later.
export default createMiddleware(routing)

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
