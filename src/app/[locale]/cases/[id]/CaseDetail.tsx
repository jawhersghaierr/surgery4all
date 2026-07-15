'use client'

import { useState } from 'react'
import { Lightbox } from '@/components/site/Lightbox'

interface Labels {
  sensitiveTitle: string
  sensitiveHint: string
  lightboxClose: string
  lightboxPrev: string
  lightboxNext: string
  noMedia: string
}

/**
 * Non-premium case body: a photo grid (opens the shared Lightbox), an optional
 * sensitive-content blur the user clicks to reveal, and the description.
 */
export function CaseDetail({
  images,
  videoUrl,
  description,
  sensitive,
  labels,
}: {
  images: string[]
  videoUrl?: string | null
  description: string
  sensitive: boolean
  labels: Labels
}) {
  const [revealed, setRevealed] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [startIndex, setStartIndex] = useState(0)

  const blurred = sensitive && !revealed

  return (
    <div>
      {videoUrl ? (
        <div style={{ position: 'relative', marginBottom: 30, borderRadius: 16, overflow: 'hidden' }}>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            src={videoUrl}
            controls
            style={{ width: '100%', display: 'block', background: '#000', filter: blurred ? 'blur(16px)' : 'none' }}
          />
          {blurred && (
            <div
              onClick={() => setRevealed(true)}
              role="button"
              tabIndex={0}
              style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer', textAlign: 'center' }}
            >
              <div style={{ width: 46, height: 46, borderRadius: 12, background: 'rgba(255,138,76,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#B4531F" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
                </svg>
              </div>
              <div style={{ fontWeight: 600, fontSize: 15, color: '#0C1512' }}>{labels.sensitiveTitle}</div>
              <div style={{ fontSize: 13, color: '#B4531F' }}>{labels.sensitiveHint}</div>
            </div>
          )}
        </div>
      ) : images.length > 0 ? (
        <div style={{ position: 'relative', marginBottom: 30 }}>
          <div
            className="sfa-g3"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3,1fr)',
              gap: 12,
              filter: blurred ? 'blur(16px)' : 'none',
              pointerEvents: blurred ? 'none' : 'auto',
            }}
          >
            {images.map((src, i) => (
              <button
                key={src + i}
                type="button"
                onClick={() => {
                  setStartIndex(i)
                  setLightboxOpen(true)
                }}
                style={{
                  position: 'relative',
                  aspectRatio: '4/3',
                  border: 'none',
                  padding: 0,
                  borderRadius: 14,
                  overflow: 'hidden',
                  cursor: 'zoom-in',
                  background: 'linear-gradient(135deg,#D9EBE6,#B7DDD4)',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </button>
            ))}
          </div>

          {blurred && (
            <div
              onClick={() => setRevealed(true)}
              role="button"
              tabIndex={0}
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              <div style={{ width: 46, height: 46, borderRadius: 12, background: 'rgba(255,138,76,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#B4531F" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
                </svg>
              </div>
              <div style={{ fontWeight: 600, fontSize: 15, color: '#0C1512' }}>{labels.sensitiveTitle}</div>
              <div style={{ fontSize: 13, color: '#B4531F' }}>{labels.sensitiveHint}</div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ fontSize: 14, color: '#566962', marginBottom: 30 }}>{labels.noMedia}</div>
      )}

      {description && <p style={{ fontSize: 16, lineHeight: 1.7, color: '#3A4642', marginBottom: 8 }}>{description}</p>}

      <Lightbox
        images={images}
        open={lightboxOpen}
        startIndex={startIndex}
        onClose={() => setLightboxOpen(false)}
        labels={{ close: labels.lightboxClose, prev: labels.lightboxPrev, next: labels.lightboxNext }}
      />
    </div>
  )
}
