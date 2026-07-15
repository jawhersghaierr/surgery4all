import { supabase } from './supabase'
import { seedCases, seedDocs, seedPosts, seedSubscribers } from './seed'
import type { Case, Doc, Post, Subscriber } from './types'

export function isBackendConfigured() {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY
}

async function q<T>(table: string, seed: T[], order = 'created_at'): Promise<T[]> {
  if (!isBackendConfigured()) return seed
  try {
    const { data, error } = await supabase.from(table).select('*').order(order, { ascending: false })
    if (error || !data) return seed
    return data as T[]
  } catch {
    return seed
  }
}

export const getCases = () => q<Case>('cases', seedCases)
export const getDocuments = () => q<Doc>('documents', seedDocs)
export const getPosts = () => q<Post>('posts', seedPosts, 'published_at')
export const getSubscribers = () => q<Subscriber>('subscribers', seedSubscribers)
