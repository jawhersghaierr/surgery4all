'use client'

import { useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { useRouter } from '@/navigation'
import type { Case, Doc, Post, Subscriber } from '@/lib/types'
import { SPECIALTIES } from '@/lib/types'
import { typeText } from '@/components/site/caseCardLogic'
import { tabButtonStyle, premiumSuffix, statusPillStyle, type AdminTab } from './adminLogic'
import { logout, addCase, deleteCase, addDocument, deleteDocument, addPost, deletePost } from './actions'

const adminInput: CSSProperties = {
  height: 44,
  borderRadius: 10,
  border: '1px solid rgba(255,255,255,.16)',
  background: 'rgba(255,255,255,.06)',
  color: '#fff',
  padding: '0 14px',
  fontSize: 14,
  outline: 'none',
  width: '100%',
  fontFamily: 'inherit',
}

const adminTextarea: CSSProperties = { ...adminInput, height: 'auto', padding: '12px 14px', resize: 'vertical' }

const adminAddBtn: CSSProperties = {
  height: 46,
  borderRadius: 11,
  border: 'none',
  background: '#0FA893',
  color: '#fff',
  fontWeight: 600,
  fontSize: 14,
  cursor: 'pointer',
  marginTop: 4,
  fontFamily: 'inherit',
}

const panelStyle: CSSProperties = {
  background: 'rgba(255,255,255,.05)',
  border: '1px solid rgba(255,255,255,.1)',
  borderRadius: 18,
  padding: 24,
}

const statCardStyle: CSSProperties = {
  background: 'rgba(255,255,255,.05)',
  border: '1px solid rgba(255,255,255,.1)',
  borderRadius: 16,
  padding: 22,
}

const rowStyle: CSSProperties = {
  background: 'rgba(255,255,255,.05)',
  border: '1px solid rgba(255,255,255,.1)',
  borderRadius: 14,
  padding: '15px 18px',
  display: 'flex',
  alignItems: 'center',
  gap: 14,
}

const rowTitleStyle: CSSProperties = {
  fontWeight: 600,
  fontSize: 14,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}

const rowSubtitleStyle: CSSProperties = { fontSize: 12, color: 'rgba(255,255,255,.55)' }

const checkboxLabelStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 9,
  fontSize: 14,
  color: 'rgba(255,255,255,.8)',
  cursor: 'pointer',
}

/** Port of the small trash-can delete button (HANDOFF lines 387, 412, 435), hover ported as local state per the codebase's `style-hover` convention (see `DocRow.tsx`). */
function DeleteButton({ onClick, label }: { onClick: () => void; label: string }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={label}
      title={label}
      style={{
        width: 32,
        height: 32,
        borderRadius: 8,
        border: hover ? '1px solid #FF6B4A' : '1px solid rgba(255,255,255,.14)',
        background: 'transparent',
        color: hover ? '#FF6B4A' : 'rgba(255,255,255,.6)',
        cursor: 'pointer',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    </button>
  )
}

/** Icon box shared by case/document rows (HANDOFF lines 383-385, 410). */
function RowIcon({ background, children }: { background: string; children: ReactNode }) {
  return (
    <div style={{ width: 44, height: 44, borderRadius: 10, background, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {children}
    </div>
  )
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div style={statCardStyle}>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,.6)', marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 30, color: accent ? '#4FD8C6' : undefined }}>{value}</div>
    </div>
  )
}

interface DashboardProps {
  cases: Case[]
  docs: Doc[]
  posts: Post[]
  subscribers: Subscriber[]
}

/**
 * Port of the admin dashboard (HANDOFF `Surgery for All.dc.html` lines
 * 335-458). Mutations call the imported `'use server'` actions directly from
 * event handlers (rather than `<form action={fn}>`) so they don't depend on
 * `useActionState`/`useFormState` — the brief allows either; this keeps the
 * flow identical to the already-proven `ContactForm.tsx` pattern. Every
 * mutation ends in `router.refresh()` so the freshly revalidated server data
 * flows back down through `page.tsx`.
 */
export function Dashboard({ cases, docs, posts, subscribers }: DashboardProps) {
  const t = useTranslations('admin')
  const tCase = useTranslations('caseCard')
  const tDocs = useTranslations('docs')
  const router = useRouter()

  const [tab, setTab] = useState<AdminTab>('cases')
  const [logoutHover, setLogoutHover] = useState(false)
  const [caseBusy, setCaseBusy] = useState(false)
  const [docBusy, setDocBusy] = useState(false)
  const [postBusy, setPostBusy] = useState(false)

  const mediaFileRef = useRef<HTMLInputElement>(null)
  const mediaUrlRef = useRef<HTMLInputElement>(null)

  async function handleLogout() {
    await logout()
    router.refresh()
  }

  async function handleAddCase(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    setCaseBusy(true)

    const file = mediaFileRef.current?.files?.[0]
    if (file) {
      try {
        const body = new FormData()
        body.append('file', file)
        const res = await fetch('/api/upload', { method: 'POST', body })
        const json = await res.json().catch(() => null)
        if (res.ok && json?.url && mediaUrlRef.current) {
          mediaUrlRef.current.value = json.url
        }
        // Upload not configured / failed: continue publishing without media.
      } catch {
        // Network failure uploading media: continue publishing without media.
      }
    }

    const result = await addCase(new FormData(form))
    setCaseBusy(false)
    if (result?.error) {
      toast.error(result.error)
      return
    }
    form.reset()
    if (mediaFileRef.current) mediaFileRef.current.value = ''
    router.refresh()
  }

  async function handleDeleteCase(id: string) {
    const result = await deleteCase(id)
    if (result?.error) {
      toast.error(result.error)
      return
    }
    router.refresh()
  }

  async function handleAddDocument(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    setDocBusy(true)
    const result = await addDocument(new FormData(form))
    setDocBusy(false)
    if (result?.error) {
      toast.error(result.error)
      return
    }
    form.reset()
    router.refresh()
  }

  async function handleDeleteDocument(id: string) {
    const result = await deleteDocument(id)
    if (result?.error) {
      toast.error(result.error)
      return
    }
    router.refresh()
  }

  async function handleAddPost(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    setPostBusy(true)
    const result = await addPost(new FormData(form))
    setPostBusy(false)
    if (result?.error) {
      toast.error(result.error)
      return
    }
    form.reset()
    router.refresh()
  }

  async function handleDeletePost(id: string) {
    const result = await deletePost(id)
    if (result?.error) {
      toast.error(result.error)
      return
    }
    router.refresh()
  }

  const deleteLabel = t('delete')

  return (
    <div style={{ maxWidth: 1220, margin: '0 auto', padding: '44px 32px 90px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, gap: 20, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#4FD8C6', letterSpacing: '.04em', textTransform: 'uppercase', marginBottom: 6 }}>
            {t('dashboardEyebrow')}
          </div>
          <h1 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 34, letterSpacing: '-.02em' }}>{t('dashboardTitle')}</h1>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          onMouseEnter={() => setLogoutHover(true)}
          onMouseLeave={() => setLogoutHover(false)}
          style={{
            padding: '0 18px',
            height: 42,
            borderRadius: 11,
            border: `1px solid ${logoutHover ? '#4FD8C6' : 'rgba(255,255,255,.18)'}`,
            background: 'transparent',
            color: logoutHover ? '#4FD8C6' : '#fff',
            fontWeight: 500,
            fontSize: 14,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          {t('logout')}
        </button>
      </div>

      {/* Stat cards */}
      <div className="sfa-stat4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 34 }}>
        <StatCard label={t('stats.casesPublished')} value={String(cases.length)} />
        <StatCard label={t('stats.publications')} value={String(docs.length)} />
        <StatCard label={t('stats.activeSubscribers')} value={t('stats.activeSubscribersValue')} accent />
        <StatCard label={t('stats.revenue')} value={t('stats.revenueValue')} accent />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, borderBottom: '1px solid rgba(255,255,255,.12)', marginBottom: 28, flexWrap: 'wrap' }}>
        <button type="button" onClick={() => setTab('cases')} style={tabButtonStyle(tab === 'cases')}>
          {t('tabs.cases')}
        </button>
        <button type="button" onClick={() => setTab('docs')} style={tabButtonStyle(tab === 'docs')}>
          {t('tabs.docs')}
        </button>
        <button type="button" onClick={() => setTab('posts')} style={tabButtonStyle(tab === 'posts')}>
          {t('tabs.posts')}
        </button>
        <button type="button" onClick={() => setTab('subs')} style={tabButtonStyle(tab === 'subs')}>
          {t('tabs.subs')}
        </button>
      </div>

      {/* Tab: Cases */}
      {tab === 'cases' && (
        <div className="sfa-admin2" style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 26, alignItems: 'start' }}>
          <div style={panelStyle}>
            <h3 style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 17, marginBottom: 18 }}>{t('addCase.heading')}</h3>
            <form onSubmit={handleAddCase} style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              <input name="title" placeholder={t('addCase.titlePlaceholder')} required style={adminInput} />
              <select name="specialty" defaultValue={SPECIALTIES[0]} style={adminInput}>
                {SPECIALTIES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <select name="type" defaultValue="photo" style={adminInput}>
                <option value="photo">{t('addCase.typePhoto')}</option>
                <option value="video">{t('addCase.typeVideo')}</option>
              </select>
              <textarea name="description" placeholder={t('addCase.descPlaceholder')} rows={3} style={adminTextarea} />
              <input ref={mediaFileRef} type="file" accept="image/*,video/*" style={adminInput} />
              <input ref={mediaUrlRef} type="hidden" name="media_url" defaultValue="" />
              <label style={checkboxLabelStyle}>
                <input type="checkbox" name="premium" defaultChecked style={{ width: 16, height: 16, accentColor: '#0FA893' }} />
                {t('addCase.premiumLabel')}
              </label>
              <label style={checkboxLabelStyle}>
                <input type="checkbox" name="sensitive" defaultChecked style={{ width: 16, height: 16, accentColor: '#FF8A4C' }} />
                {t('addCase.sensitiveLabel')}
              </label>
              <button type="submit" disabled={caseBusy} style={{ ...adminAddBtn, opacity: caseBusy ? 0.7 : 1 }}>
                {t('addCase.publish')}
              </button>
            </form>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {cases.map((c) => (
              <div key={c.id} style={rowStyle}>
                <RowIcon background="linear-gradient(135deg,#0FA893,#0A5049)">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21" />
                  </svg>
                </RowIcon>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={rowTitleStyle}>{c.title}</div>
                  <div style={rowSubtitleStyle}>
                    {c.specialty} · {typeText(c, { video: tCase('video'), photo: tCase('photo') })}
                    {premiumSuffix(c.premium, { premium: tCase('premium'), free: tCase('free') })}
                  </div>
                </div>
                <DeleteButton label={deleteLabel} onClick={() => handleDeleteCase(c.id)} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Docs */}
      {tab === 'docs' && (
        <div className="sfa-admin2" style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 26, alignItems: 'start' }}>
          <div style={panelStyle}>
            <h3 style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 17, marginBottom: 18 }}>{t('addDoc.heading')}</h3>
            <form onSubmit={handleAddDocument} style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              <input name="title" placeholder={t('addDoc.titlePlaceholder')} required style={adminInput} />
              <input name="journal" placeholder={t('addDoc.journalPlaceholder')} style={adminInput} />
              <input name="year" placeholder={t('addDoc.yearPlaceholder')} defaultValue="2026" style={adminInput} />
              <input type="hidden" name="pdf_url" defaultValue="" />
              <label style={checkboxLabelStyle}>
                <input type="checkbox" name="premium" defaultChecked style={{ width: 16, height: 16, accentColor: '#0FA893' }} />
                {t('addDoc.premiumLabel')}
              </label>
              <button type="submit" disabled={docBusy} style={{ ...adminAddBtn, opacity: docBusy ? 0.7 : 1 }}>
                {t('addDoc.publish')}
              </button>
            </form>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {docs.map((d) => (
              <div key={d.id} style={rowStyle}>
                <RowIcon background="rgba(15,168,147,.2)">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4FD8C6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6" />
                  </svg>
                </RowIcon>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={rowTitleStyle}>{d.title}</div>
                  <div style={rowSubtitleStyle}>
                    {d.journal} · {d.year}
                    {premiumSuffix(d.premium, { premium: tDocs('premiumPdf'), free: tCase('free') })}
                  </div>
                </div>
                <DeleteButton label={deleteLabel} onClick={() => handleDeleteDocument(d.id)} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Posts */}
      {tab === 'posts' && (
        <div className="sfa-admin2" style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 26, alignItems: 'start' }}>
          <div style={panelStyle}>
            <h3 style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 17, marginBottom: 18 }}>{t('addPost.heading')}</h3>
            <form onSubmit={handleAddPost} style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              <input name="title" placeholder={t('addPost.titlePlaceholder')} required style={adminInput} />
              <input name="category" placeholder={t('addPost.categoryPlaceholder')} style={adminInput} />
              <textarea name="excerpt" placeholder={t('addPost.excerptPlaceholder')} rows={3} style={adminTextarea} />
              <input type="hidden" name="cover_url" defaultValue="" />
              <button type="submit" disabled={postBusy} style={{ ...adminAddBtn, opacity: postBusy ? 0.7 : 1 }}>
                {t('addPost.publish')}
              </button>
            </form>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {posts.map((p) => (
              <div key={p.id} style={rowStyle}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={rowTitleStyle}>{p.title}</div>
                  <div style={rowSubtitleStyle}>
                    {p.category} · {p.date}
                  </div>
                </div>
                <DeleteButton label={deleteLabel} onClick={() => handleDeletePost(p.id)} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Subscribers */}
      {tab === 'subs' && (
        <div style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 18, overflow: 'hidden' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1.4fr 1fr 1fr',
              padding: '14px 22px',
              fontSize: 12,
              fontWeight: 600,
              color: 'rgba(255,255,255,.5)',
              textTransform: 'uppercase',
              letterSpacing: '.03em',
              borderBottom: '1px solid rgba(255,255,255,.1)',
            }}
          >
            <div>{t('subsTable.subscriber')}</div>
            <div>{t('subsTable.plan')}</div>
            <div>{t('subsTable.since')}</div>
            <div>{t('subsTable.status')}</div>
          </div>
          {subscribers.map((s) => (
            <div
              key={s.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1.4fr 1fr 1fr',
                padding: '16px 22px',
                fontSize: 14,
                borderBottom: '1px solid rgba(255,255,255,.06)',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg,#0FA893,#0A5049)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: "'Space Grotesk'",
                    flexShrink: 0,
                  }}
                >
                  {s.initial}
                </div>
                {s.name}
              </div>
              <div style={{ color: 'rgba(255,255,255,.7)' }}>{s.plan}</div>
              <div style={{ color: 'rgba(255,255,255,.7)' }}>{s.since}</div>
              <div>
                <span style={statusPillStyle(s.status)}>{t(`statuses.${s.status}`)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
