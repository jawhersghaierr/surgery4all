import { describe, it, expect } from 'vitest'
import { seedCases, seedDocs, seedPosts, seedSubscribers } from '@/lib/seed'

describe('seed', () => {
  it('matches prototype counts', () => {
    expect(seedCases).toHaveLength(8)
    expect(seedDocs).toHaveLength(5)
    expect(seedPosts).toHaveLength(4)
    expect(seedSubscribers).toHaveLength(5)
  })
  it('cases have required flags', () => {
    for (const c of seedCases) {
      expect(['photo', 'video']).toContain(c.type)
      expect(typeof c.premium).toBe('boolean')
    }
  })
})
