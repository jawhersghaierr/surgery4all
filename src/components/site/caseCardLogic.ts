import type { Case } from '@/lib/types'

/**
 * Pure display logic mirroring `caseCard.dc.html`'s `renderVals()` (HANDOFF
 * lines 57-71), extracted so it can be unit-tested without a DOM/React
 * renderer. `CaseCard.tsx` wires these to `useTranslations('caseCard')`.
 */

export interface TypeLabels {
  video: string
  photo: string
}

export const DEFAULT_TYPE_LABELS: TypeLabels = { video: 'Vidéo', photo: 'Photo' }

/** "Vidéo · {duration}" (or just "Vidéo" if no duration) for videos, else "Photo". */
export function typeText(
  c: Pick<Case, 'type' | 'duration'>,
  labels: TypeLabels = DEFAULT_TYPE_LABELS
): string {
  if (c.type === 'video') {
    return c.duration ? `${labels.video} · ${c.duration}` : labels.video
  }
  return labels.photo
}

export interface AccessLabels {
  premium: string
  free: string
}

export const DEFAULT_ACCESS_LABELS: AccessLabels = { premium: 'Premium', free: 'Gratuit' }

/** "Premium" access badge text when the case is premium, else "Gratuit". */
export function premText(
  c: Pick<Case, 'premium'>,
  labels: AccessLabels = DEFAULT_ACCESS_LABELS
): string {
  return c.premium ? labels.premium : labels.free
}

/** Premium lock overlay shows whenever the case is premium (no auth in this build). */
export function showLock(c: Pick<Case, 'premium'>): boolean {
  return !!c.premium
}

/**
 * Sensitive-content blur overlay shows only when the case is flagged
 * sensitive, hasn't been revealed yet, AND is not already covered by the
 * premium lock overlay (lock always takes priority over the sensitive blur).
 */
export function showSensitive(c: Pick<Case, 'premium' | 'sensitive'>, revealed: boolean): boolean {
  return !showLock(c) && !!c.sensitive && !revealed
}
