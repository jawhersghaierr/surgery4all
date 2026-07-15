// Client-side direct upload to Cloudinary. No secrets here — it fetches
// short-lived signed params from /api/upload/sign, then streams the file to
// Cloudinary in chunks. Chunking (via Content-Range + a stable
// X-Unique-Upload-Id) lets arbitrarily large videos through; Cloudinary's
// synchronous single-request upload caps at 100 MB, so anything bigger MUST be
// chunked. All chunks except the last must be >= 5 MB per Cloudinary's rules.

const CHUNK_SIZE = 6 * 1024 * 1024 // 6 MB

interface SignResponse {
  cloudName: string
  apiKey: string
  timestamp: number
  signature: string
  folder: string
}

interface CloudinaryUploadResult {
  secure_url: string
}

/**
 * Uploads `file` to Cloudinary and resolves to its secure URL.
 * @param onProgress optional 0–100 callback, fired after each chunk.
 * @throws Error('sign-failed' | 'media-not-configured' | 'unauthorized' | 'upload-failed')
 */
export async function uploadToCloudinary(file: File, onProgress?: (pct: number) => void): Promise<string> {
  const signRes = await fetch('/api/upload/sign', { method: 'POST' })
  if (!signRes.ok) {
    const body = (await signRes.json().catch(() => null)) as { error?: string } | null
    throw new Error(body?.error || 'sign-failed')
  }
  const { cloudName, apiKey, timestamp, signature, folder } = (await signRes.json()) as SignResponse

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`
  const total = file.size
  // Stable id ties all chunks to one asset. crypto.randomUUID is available in
  // all browsers the app targets; time-suffixed to avoid any collision.
  const uploadId = `${crypto.randomUUID()}-${timestamp}`

  let start = 0
  let last: CloudinaryUploadResult | null = null

  while (start < total) {
    const end = Math.min(start + CHUNK_SIZE, total)
    const chunk = file.slice(start, end)

    const form = new FormData()
    form.append('file', chunk)
    form.append('api_key', apiKey)
    form.append('timestamp', String(timestamp))
    form.append('signature', signature)
    form.append('folder', folder)

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'X-Unique-Upload-Id': uploadId,
        'Content-Range': `bytes ${start}-${end - 1}/${total}`,
      },
      body: form,
    })

    if (!res.ok) throw new Error('upload-failed')
    last = (await res.json()) as CloudinaryUploadResult

    start = end
    onProgress?.(Math.round((end / total) * 100))
  }

  if (!last?.secure_url) throw new Error('upload-failed')
  return last.secure_url
}
