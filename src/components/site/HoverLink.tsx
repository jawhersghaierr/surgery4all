'use client'

import { useState, type CSSProperties, type ReactNode } from 'react'
import { Link } from '@/navigation'

/**
 * Shared client wrapper for the HANDOFF's `style-hover` buttons that are
 * really navigation links (Home hero/CTA sections). Props are passed from a
 * Server Component, so `style`/`hoverStyle` must be plain serializable
 * objects rather than a function — `hoverStyle` always restates the *full*
 * value of every property it changes (e.g. the whole `border` shorthand,
 * never a lone `borderColor`) so the merge can never fight a longhand
 * against a shorthand from the base style.
 */
export function HoverLink({
  href,
  style,
  hoverStyle,
  className,
  children,
}: {
  href: string
  style: CSSProperties
  hoverStyle: CSSProperties
  className?: string
  children: ReactNode
}) {
  const [hover, setHover] = useState(false)

  return (
    <Link
      href={href}
      className={className}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={hover ? { ...style, ...hoverStyle } : style}
    >
      {children}
    </Link>
  )
}
