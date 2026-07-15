import { describe, it, expect, vi, beforeEach } from 'vitest'

beforeEach(() => {
  vi.resetModules()
  delete process.env.NEXT_PUBLIC_SUPABASE_URL
})

describe('data fallback', () => {
  it('returns seed when unconfigured', async () => {
    const { getCases, isBackendConfigured } = await import('@/lib/data')
    expect(isBackendConfigured()).toBe(false)
    expect(await getCases()).toHaveLength(8)
  })

  it('returns seed documents, posts and subscribers when unconfigured', async () => {
    const { getDocuments, getPosts, getSubscribers } = await import('@/lib/data')
    expect(await getDocuments()).toHaveLength(5)
    expect(await getPosts()).toHaveLength(4)
    expect(await getSubscribers()).toHaveLength(5)
  })
})
