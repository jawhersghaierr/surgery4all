'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import type { Case } from '@/lib/types'
import { SPECIALTIES } from '@/lib/types'
import { CaseCard } from '@/components/site/CaseCard'

/** Sentinel chip value meaning "no filter" (label is localized, value is not). */
const ALL = 'Tous'

/**
 * Chip *values* used for filtering are the canonical (always-French)
 * `Case.specialty` strings from `SPECIALTIES` — the seed data's `specialty`
 * field is never translated, so matching on the localized chip *label*
 * would silently break filtering on `/en/cases`. Labels come from
 * `cases.chips` (HANDOFF lines 206-210, 623-632); values are zipped in by
 * index (chip 0 = "Tous"/"All", chips 1-5 = `SPECIALTIES[0..4]`).
 */
const CHIP_VALUES = [ALL, ...SPECIALTIES]

export function CasesClient({ cases }: { cases: Case[] }) {
  const t = useTranslations('cases')
  const labels = t.raw('chips') as string[]
  const [filter, setFilter] = useState<string>(ALL)

  const visibleCases = filter === ALL ? cases : cases.filter((c) => c.specialty === filter)

  return (
    <>
      <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap', marginBottom: 32 }}>
        {CHIP_VALUES.map((value, i) => {
          const active = filter === value
          return (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              style={{
                padding: '9px 16px',
                borderRadius: 100,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 500,
                fontFamily: 'inherit',
                border: active ? '1px solid #0C1512' : '1px solid rgba(12,21,18,.14)',
                background: active ? '#0C1512' : '#fff',
                color: active ? '#fff' : '#3A4642',
              }}
            >
              {labels[i]}
            </button>
          )
        })}
      </div>

      <div className="sfa-g3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22 }}>
        {visibleCases.map((c) => (
          <CaseCard key={c.id} c={c} />
        ))}
      </div>
    </>
  )
}
