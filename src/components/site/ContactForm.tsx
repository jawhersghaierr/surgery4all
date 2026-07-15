'use client'

import { useState, type CSSProperties } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
})

type FormValues = z.infer<typeof schema>

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
 * Port of the ABOUT contact form (HANDOFF `Surgery for All.dc.html` lines
 * 308-313). Submits to `/api/contact` (built in a later task — a 404/network
 * failure surfaces as the `about.contact.error` toast, which is expected
 * until that route exists).
 */
export function ContactForm() {
  const t = useTranslations('about.contact')
  const [hover, setHover] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (!res.ok) throw new Error('request failed')
      toast.success(t('success'))
      reset()
    } catch {
      toast.error(t('error'))
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
    >
      <input {...register('name')} placeholder={t('namePlaceholder')} style={fieldStyle} />
      <input {...register('email')} type="email" placeholder={t('emailPlaceholder')} style={fieldStyle} />
      <textarea
        {...register('message')}
        placeholder={t('messagePlaceholder')}
        rows={4}
        style={{ ...fieldStyle, height: 'auto', padding: '14px 16px', resize: 'vertical' }}
      />
      <button
        type="submit"
        disabled={isSubmitting}
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
          cursor: isSubmitting ? 'default' : 'pointer',
          fontFamily: 'inherit',
          opacity: isSubmitting ? 0.7 : 1,
        }}
      >
        {t('submit')}
      </button>
    </form>
  )
}
