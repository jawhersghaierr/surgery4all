'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { checkCredentials, signToken, getSession, COOKIE_NAME } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { isBackendConfigured } from '@/lib/data'
import { assertAdmin } from '@/lib/adminGuard'
import type { CaseType } from '@/lib/types'

export type ActionResult = { ok?: true; error?: string }

// Checkbox inputs arrive as 'on' when checked, or are absent (null) when not.
function checkbox(formData: FormData, key: string): boolean {
  return formData.get(key) === 'on'
}

function str(formData: FormData, key: string): string {
  const v = formData.get(key)
  return typeof v === 'string' ? v.trim() : ''
}

// Passwords must be compared verbatim — trimming would silently shrink the
// valid credential space at whitespace edges.
function rawStr(formData: FormData, key: string): string {
  const v = formData.get(key)
  return typeof v === 'string' ? v : ''
}

function nullableStr(formData: FormData, key: string): string | null {
  const v = str(formData, key)
  return v.length > 0 ? v : null
}

// Matches the seed data style (e.g. "8 juil. 2026") — posts.date is a
// required text column with no DB default, so we synthesize it on insert.
function frenchShortDate(d: Date): string {
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }).format(d)
}

async function requireAdmin(): Promise<ActionResult | null> {
  const session = await getSession()
  if (!assertAdmin(session)) return { error: 'unauthorized' }
  if (!isBackendConfigured()) return { error: 'backend-not-configured' }
  return null
}

export async function login(
  _prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const user = str(formData, 'user')
  const password = rawStr(formData, 'password')

  if (!checkCredentials(user, password)) {
    return { error: 'invalid' }
  }

  const token = await signToken({ admin: true })
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })

  return { ok: true }
}

export async function logout(): Promise<ActionResult> {
  cookies().delete(COOKIE_NAME)
  return { ok: true }
}

export async function addCase(formData: FormData): Promise<ActionResult> {
  const guard = await requireAdmin()
  if (guard) return guard

  const type: CaseType = formData.get('type') === 'video' ? 'video' : 'photo'
  const duration = str(formData, 'duration') || (type === 'video' ? '10 min' : '')

  const { error } = await supabase.from('cases').insert({
    title: str(formData, 'title'),
    specialty: str(formData, 'specialty'),
    type,
    duration,
    description: str(formData, 'description'),
    media_url: nullableStr(formData, 'media_url'),
    premium: checkbox(formData, 'premium'),
    sensitive: checkbox(formData, 'sensitive'),
  })
  if (error) return { error: error.message }

  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function deleteCase(id: string): Promise<ActionResult> {
  const guard = await requireAdmin()
  if (guard) return guard

  const { error } = await supabase.from('cases').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function addDocument(formData: FormData): Promise<ActionResult> {
  const guard = await requireAdmin()
  if (guard) return guard

  const { error } = await supabase.from('documents').insert({
    title: str(formData, 'title'),
    journal: str(formData, 'journal'),
    year: str(formData, 'year'),
    pdf_url: nullableStr(formData, 'pdf_url'),
    premium: checkbox(formData, 'premium'),
  })
  if (error) return { error: error.message }

  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function deleteDocument(id: string): Promise<ActionResult> {
  const guard = await requireAdmin()
  if (guard) return guard

  const { error } = await supabase.from('documents').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function addPost(formData: FormData): Promise<ActionResult> {
  const guard = await requireAdmin()
  if (guard) return guard

  const { error } = await supabase.from('posts').insert({
    title: str(formData, 'title'),
    category: str(formData, 'category'),
    excerpt: str(formData, 'excerpt'),
    cover_url: nullableStr(formData, 'cover_url'),
    date: frenchShortDate(new Date()),
  })
  if (error) return { error: error.message }

  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function deletePost(id: string): Promise<ActionResult> {
  const guard = await requireAdmin()
  if (guard) return guard

  const { error } = await supabase.from('posts').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function addSponsor(formData: FormData): Promise<ActionResult> {
  const guard = await requireAdmin()
  if (guard) return guard

  const { error } = await supabase.from('sponsors').insert({
    name: str(formData, 'name'),
    logo_url: nullableStr(formData, 'logo_url'),
    url: nullableStr(formData, 'url'),
  })
  if (error) return { error: error.message }

  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function deleteSponsor(id: string): Promise<ActionResult> {
  const guard = await requireAdmin()
  if (guard) return guard

  const { error } = await supabase.from('sponsors').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/', 'layout')
  return { ok: true }
}
