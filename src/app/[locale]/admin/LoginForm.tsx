'use client'

import { useState, type CSSProperties, type FormEvent } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { useRouter } from '@/navigation'
import { login } from './actions'

const fieldStyle: CSSProperties = {
  height: 48,
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,.16)',
  background: 'rgba(255,255,255,.06)',
  color: '#fff',
  padding: '0 16px',
  fontSize: 15,
  outline: 'none',
  fontFamily: 'inherit',
  width: '100%',
}

/**
 * Port of the admin login screen (HANDOFF `Surgery for All.dc.html` lines
 * 321-333). `login` is a `'use server'` action imported and called directly
 * from this client handler — the installed React/react-dom in this project
 * doesn't have `useActionState`/`useFormState` wired up for this build, so a
 * plain `onSubmit` calling the action and awaiting its result is used
 * instead (the brief explicitly allows either a `<form action>` or a client
 * handler). On success, `router.refresh()` re-runs `getSession()` server-side
 * so `page.tsx` swaps the login screen for the dashboard.
 */
export function LoginForm() {
  const t = useTranslations('admin')
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [hover, setHover] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    const formData = new FormData(e.currentTarget)
    const result = await login(undefined, formData)
    setPending(false)

    if (result?.error) {
      toast.error(t('loginError'))
      return
    }
    router.refresh()
  }

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: '90px 32px', textAlign: 'center' }}>
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: 'rgba(15,168,147,.16)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
        }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#4FD8C6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>
      <h1 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 30, marginBottom: 8 }}>{t('loginTitle')}</h1>
      <p style={{ fontSize: 14, color: 'rgba(255,255,255,.6)', marginBottom: 28 }}>{t('loginSubtitle')}</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left' }}>
        <input name="user" placeholder={t('userPlaceholder')} autoComplete="username" style={fieldStyle} />
        <input name="password" type="password" placeholder={t('passwordPlaceholder')} autoComplete="current-password" style={fieldStyle} />
        <button
          type="submit"
          disabled={pending}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{
            height: 50,
            borderRadius: 12,
            border: 'none',
            background: hover ? '#4FD8C6' : '#0FA893',
            color: hover ? '#0C1512' : '#fff',
            fontWeight: 600,
            fontSize: 15,
            cursor: pending ? 'default' : 'pointer',
            fontFamily: 'inherit',
            opacity: pending ? 0.7 : 1,
          }}
        >
          {t('loginButton')}
        </button>
      </form>
    </div>
  )
}
