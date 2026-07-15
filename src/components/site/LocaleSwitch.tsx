'use client'

import { useLocale } from 'next-intl'
import { Link, usePathname } from '@/navigation'
import type { Locale } from '@/routing'

const LOCALES: { code: Locale; label: string }[] = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
]

export function LocaleSwitch() {
  const pathname = usePathname()
  const locale = useLocale()

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        padding: 3,
        borderRadius: 9,
        background: 'rgba(12,21,18,.05)',
        flexShrink: 0,
      }}
    >
      {LOCALES.map((l) => {
        const active = locale === l.code
        return (
          <Link
            key={l.code}
            href={pathname}
            locale={l.code}
            aria-current={active ? 'true' : undefined}
            style={{
              padding: '5px 9px',
              borderRadius: 7,
              fontSize: '12px',
              fontWeight: active ? 600 : 500,
              color: active ? '#0A5049' : '#566962',
              background: active ? '#fff' : 'transparent',
              textDecoration: 'none',
            }}
          >
            {l.label}
          </Link>
        )
      })}
    </div>
  )
}
