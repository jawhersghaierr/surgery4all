// Client-side image downscaling. Cloudinary caps image assets by plan (10 MB
// on free), and multi-megapixel phone photos routinely exceed that — and are
// far larger than any web display needs. We downscale the longest side and
// re-encode as JPEG, retrying at lower quality until the result fits the byte
// budget. Non-image files (video) pass through untouched.

interface CompressOptions {
  maxDim?: number
  maxBytes?: number
  /** Only compress images larger than this; smaller ones pass through as-is. */
  skipUnderBytes?: number
}

const DEFAULTS: Required<CompressOptions> = {
  maxDim: 2560,
  maxBytes: 9_500_000, // stay safely under Cloudinary's 10 MB image limit
  skipUnderBytes: 3_000_000,
}

export async function compressImage(file: File, opts: CompressOptions = {}): Promise<File> {
  const { maxDim, maxBytes, skipUnderBytes } = { ...DEFAULTS, ...opts }

  if (!file.type.startsWith('image/')) return file
  // Vector/animated formats don't survive canvas re-encode well; leave them.
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') return file
  if (file.size <= skipUnderBytes) return file

  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    return file // undecodable here — let the server reject if truly invalid
  }

  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height))
  const w = Math.max(1, Math.round(bitmap.width * scale))
  const h = Math.max(1, Math.round(bitmap.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    bitmap.close?.()
    return file
  }
  ctx.drawImage(bitmap, 0, 0, w, h)
  bitmap.close?.()

  // Step quality down until it fits the byte budget (or we hit the floor).
  for (const quality of [0.85, 0.72, 0.6, 0.5]) {
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality))
    if (!blob) break
    if (blob.size <= maxBytes || quality === 0.5) {
      const name = file.name.replace(/\.[^.]+$/, '') + '.jpg'
      return new File([blob], name, { type: 'image/jpeg' })
    }
  }
  return file
}
