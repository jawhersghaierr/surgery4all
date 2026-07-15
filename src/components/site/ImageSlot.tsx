import Image from 'next/image'
import { ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageSlotProps {
  /** Remote/uploaded media URL. Falsy → render the teal placeholder instead. */
  src?: string | null
  /** Accessible label used as the `<Image>` alt text and shown under the placeholder icon. */
  placeholder: string
  className?: string
}

/**
 * Fills its parent (which must be `position:relative` with its own aspect
 * ratio — e.g. `CaseCard`'s 4/3 media wrapper). Renders the real image when
 * `src` is provided, otherwise the handoff's teal gradient placeholder.
 */
export function ImageSlot({ src, placeholder, className }: ImageSlotProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt={placeholder}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className={cn('object-cover', className)}
      />
    )
  }

  return (
    <div
      className={cn('absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center', className)}
      style={{ background: 'linear-gradient(135deg,#D9EBE6,#B7DDD4)' }}
    >
      <ImageIcon width={46} height={46} color="#0A5049" strokeWidth={1.5} style={{ opacity: 0.5 }} />
      <span style={{ fontSize: '12px', fontWeight: 500, color: '#0A5049', opacity: 0.6 }}>{placeholder}</span>
    </div>
  )
}
