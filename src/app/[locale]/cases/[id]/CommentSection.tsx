'use client'

import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import type { Comment } from '@/lib/types'
import { addComment } from '@/app/[locale]/admin/actions'

interface Labels {
  title: string
  empty: string
  author: string
  body: string
  submit: string
  pending: string
}

/**
 * Public comment thread: approved comments (server-provided) plus a form that
 * submits via the public addComment action. New comments land pending
 * moderation, so they don't appear until an admin approves — we tell the user.
 */
export function CommentSection({ caseId, comments, labels }: { caseId: string; comments: Comment[]; labels: Labels }) {
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    setBusy(true)
    const data = new FormData(form)
    data.set('case_id', caseId)
    const result = await addComment(data)
    setBusy(false)
    if (result?.error) {
      toast.error(result.error)
      return
    }
    form.reset()
    toast.success(labels.pending)
  }

  return (
    <section style={{ marginTop: 48, borderTop: '1px solid rgba(12,21,18,.1)', paddingTop: 36 }}>
      <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 24, letterSpacing: '-.02em', marginBottom: 22 }}>
        {labels.title} {comments.length > 0 && <span style={{ color: '#0FA893' }}>({comments.length})</span>}
      </h2>

      {comments.length === 0 ? (
        <p style={{ fontSize: 14, color: '#566962', marginBottom: 28 }}>{labels.empty}</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
          {comments.map((c) => (
            <div key={c.id} style={{ background: '#fff', border: '1px solid rgba(12,21,18,.08)', borderRadius: 14, padding: '16px 18px' }}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{c.author}</div>
              <div style={{ fontSize: 14, lineHeight: 1.6, color: '#3A4642', whiteSpace: 'pre-wrap' }}>{c.body}</div>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 520 }}>
        <input
          name="author"
          maxLength={80}
          required
          placeholder={labels.author}
          style={{ height: 44, borderRadius: 10, border: '1px solid rgba(12,21,18,.16)', padding: '0 14px', fontSize: 14, fontFamily: 'inherit' }}
        />
        <textarea
          name="body"
          maxLength={2000}
          required
          rows={4}
          placeholder={labels.body}
          style={{ borderRadius: 10, border: '1px solid rgba(12,21,18,.16)', padding: '12px 14px', fontSize: 14, fontFamily: 'inherit', resize: 'vertical' }}
        />
        <button
          type="submit"
          disabled={busy}
          style={{ height: 46, borderRadius: 11, border: 'none', background: '#0C1512', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', opacity: busy ? 0.7 : 1, alignSelf: 'flex-start', padding: '0 22px' }}
        >
          {labels.submit}
        </button>
      </form>
    </section>
  )
}
