'use client'

import { useCallback, useEffect, useState } from 'react'

/**
 * Full-screen image gallery. Controlled via `open`; renders nothing when
 * closed. Arrow keys + on-screen chevrons navigate; Escape or backdrop click
 * closes. Locks body scroll while open.
 */
export function Lightbox({
  images,
  open,
  startIndex = 0,
  onClose,
  labels,
}: {
  images: string[]
  open: boolean
  startIndex?: number
  onClose: () => void
  labels: { close: string; prev: string; next: string }
}) {
  const [index, setIndex] = useState(startIndex)

  useEffect(() => {
    if (open) setIndex(startIndex)
  }, [open, startIndex])

  const go = useCallback(
    (delta: number) => setIndex((i) => (i + delta + images.length) % images.length),
    [images.length]
  )

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, go, onClose])

  if (!open || images.length === 0) return null

  const multi = images.length > 1

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(6,12,10,.92)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={labels.close}
        style={{ ...iconBtn, position: 'absolute', top: 18, right: 18 }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>

      {multi && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); go(-1) }}
          aria-label={labels.prev}
          style={{ ...iconBtn, position: 'absolute', left: 18 }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
      )}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={images[index]}
        alt=""
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '90vw', maxHeight: '86vh', objectFit: 'contain', borderRadius: 10, boxShadow: '0 30px 80px -20px rgba(0,0,0,.6)' }}
      />

      {multi && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); go(1) }}
          aria-label={labels.next}
          style={{ ...iconBtn, position: 'absolute', right: 18 }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      )}

      {multi && (
        <div
          style={{
            position: 'absolute',
            bottom: 22,
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'rgba(255,255,255,.85)',
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: '.03em',
          }}
        >
          {index + 1} / {images.length}
        </div>
      )}
    </div>
  )
}

const iconBtn: React.CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: '50%',
  border: 'none',
  background: 'rgba(255,255,255,.12)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
}
