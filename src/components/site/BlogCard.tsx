'use client'

import { useState } from 'react'
import type { Post } from '@/lib/types'

/**
 * Port of the blog article card (HANDOFF `Surgery for All.dc.html` lines
 * 241-247). The card itself has no navigation target in the prototype —
 * only a `style-hover` border-color change — so it's a local hover-state
 * client component rather than a `HoverLink`.
 */
export function BlogCard({ p }: { p: Post }) {
  const [hover, setHover] = useState(false)

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: '#fff',
        border: hover ? '1px solid #0FA893' : '1px solid rgba(12,21,18,.08)',
        borderRadius: 20,
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >
      <div style={{ height: 170, background: 'linear-gradient(135deg,#E4EFEC,#CFE6E0)', display: 'flex', alignItems: 'flex-end', padding: 16 }}>
        <span style={{ background: '#fff', color: '#0A5049', fontSize: 12, fontWeight: 600, padding: '5px 11px', borderRadius: 8 }}>
          {p.category}
        </span>
      </div>
      <div style={{ padding: '22px 24px' }}>
        <div style={{ fontSize: 12, color: '#566962', marginBottom: 8 }}>{p.date}</div>
        <h3 style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 20, lineHeight: 1.2, marginBottom: 10, letterSpacing: '-.01em' }}>
          {p.title}
        </h3>
        <p style={{ fontSize: 14, lineHeight: 1.55, color: '#566962' }}>{p.excerpt}</p>
      </div>
    </div>
  )
}
