import { supabase } from './supabase'
import { seedCases, seedComments, seedDocs, seedPosts, seedSponsors, seedSubscribers } from './seed'
import type { Case, Comment, Doc, Post, Sponsor, Subscriber } from './types'

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
export const getSponsors = () => q<Sponsor>('sponsors', seedSponsors)
export const getSubscribers = () => q<Subscriber>('subscribers', seedSubscribers)

export async function getCaseById(id: string): Promise<Case | null> {
  if (!isBackendConfigured()) return seedCases.find((c) => c.id === id) ?? null
  try {
    const { data, error } = await supabase.from('cases').select('*').eq('id', id).maybeSingle()
    if (error || !data) return null
    return data as Case
  } catch {
    return null
  }
}

/** Approved comments for a case, oldest first. Public-facing. */
export async function getApprovedComments(caseId: string): Promise<Comment[]> {
  if (!isBackendConfigured()) {
    return seedComments.filter((c) => c.case_id === caseId && c.approved)
  }
  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('case_id', caseId)
      .eq('approved', true)
      .order('created_at', { ascending: true })
    if (error || !data) return []
    return data as Comment[]
  } catch {
    return []
  }
}

/** All comments (incl. pending), newest first. Admin moderation only. */
export async function getAllComments(): Promise<Comment[]> {
  if (!isBackendConfigured()) return seedComments
  try {
    const { data, error } = await supabase.from('comments').select('*').order('created_at', { ascending: false })
    if (error || !data) return []
    return data as Comment[]
  } catch {
    return []
  }
}
