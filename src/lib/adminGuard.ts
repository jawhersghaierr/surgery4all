// Pure guard logic, kept out of actions.ts so it can be unit-tested without
// pulling in next/headers (which 'use server' files load at module scope).
export function assertAdmin(session: { admin: boolean } | null | undefined): boolean {
  return !!session?.admin
}
