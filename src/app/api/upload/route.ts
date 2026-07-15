import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { getSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
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

  let file: File | null = null
  try {
    const formData = await req.formData()
    const entry = formData.get('file')
    if (entry instanceof File) file = entry
  } catch {
    return NextResponse.json({ error: 'invalid-form-data' }, { status: 400 })
  }

  if (!file) {
    return NextResponse.json({ error: 'no-file' }, { status: 400 })
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  })

  try {
    const buffer = Buffer.from(await file.arrayBuffer())

    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'surgery4all' },
        (error, uploadResult) => {
          if (error || !uploadResult) {
            reject(error ?? new Error('upload-failed'))
            return
          }
          resolve(uploadResult as { secure_url: string })
        }
      )
      stream.end(buffer)
    })

    return NextResponse.json({ url: result.secure_url })
  } catch {
    return NextResponse.json({ error: 'upload-failed' }, { status: 500 })
  }
}
