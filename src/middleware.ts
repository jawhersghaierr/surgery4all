import createMiddleware from 'next-intl/middleware'
import { routing } from './routing'

// next-intl locale routing only. `/admin` is intentionally NOT guarded here: the
// admin session (JWT via lib/auth.ts) is checked at the page level (getSession) and
// inside the server actions that mutate data, not via a hard middleware redirect.
// The matcher below already covers `/admin` through its locale-prefixed catch-all.
export default createMiddleware(routing)

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
