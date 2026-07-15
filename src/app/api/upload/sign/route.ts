import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { getSession } from '@/lib/auth'

/**
 * Issues short-lived signed params for a DIRECT browser -> Cloudinary upload.
 * The file itself never touches this server, so uploads are not bound by the
 * platform's request-body limit (e.g. Vercel's ~4.5 MB) and large videos work.
 *
 * The api_secret stays server-side: we only return the signature computed from
 * it. The client posts (folder, timestamp, signature, api_key) alongside the
 * file straight to Cloudinary. Admin-guarded so only the dashboard can sign.
 */
export async function POST() {
  const session = await getSession()
  if (!session?.admin) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({ error: 'media-not-configured' }, { status: 400 })
  }

  const folder = 'surgery4all'
  const timestamp = Math.round(Date.now() / 1000)

  // Sign exactly the params the client will send (besides file/api_key/
  // cloud_name/resource_type, which Cloudinary excludes from the signature).
  const signature = cloudinary.utils.api_sign_request({ folder, timestamp }, apiSecret)

  return NextResponse.json({ cloudName, apiKey, timestamp, signature, folder })
}
