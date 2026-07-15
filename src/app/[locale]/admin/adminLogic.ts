import type { CSSProperties } from 'react'
import type { SubStatus } from '@/lib/types'

/**
 * Pure display logic mirroring `Surgery for All.dc.html`'s admin helpers
 * (HANDOFF lines 566-606), extracted so it can be unit-tested without a
 * DOM/React renderer. `Dashboard.tsx` wires these to `useTranslations('admin')`.
 */

export type AdminTab = 'cases' | 'docs' | 'posts' | 'subs' | 'sponsors'

/** Port of `atab()` (HANDOFF lines 566-571): active vs inactive tab-strip button style. */
export function tabButtonStyle(active: boolean): CSSProperties {
  return {
    padding: '12px 18px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: active ? 600 : 500,
    fontFamily: 'inherit',
    color: active ? '#fff' : 'rgba(255,255,255,.55)',
    borderBottom: active ? '2px solid #4FD8C6' : '2px solid transparent',
    marginBottom: -1,
  }
}

export interface PremiumLabels {
  premium: string
  free: string
}

/**
 * " · Premium" / " · Gratuit" suffix appended to a case/doc list row's
 * subtitle (HANDOFF lines 386, 411, 539, 593 — `c.premLabel` / `d.premLabel`).
 */
export function premiumSuffix(premium: boolean, labels: PremiumLabels): string {
  return ` · ${premium ? labels.premium : labels.free}`
}

/** Port of the subscriber status-pill style map (HANDOFF lines 602-606). */
export function statusPillStyle(status: SubStatus): CSSProperties {
  const background =
    status === 'active' ? 'rgba(15,168,147,.18)' : status === 'free' ? 'rgba(255,255,255,.1)' : 'rgba(255,138,76,.18)'
  const color = status === 'active' ? '#4FD8C6' : status === 'free' ? 'rgba(255,255,255,.7)' : '#FFB07C'
  return { padding: '4px 10px', borderRadius: 7, fontSize: 12, fontWeight: 600, background, color }
}
