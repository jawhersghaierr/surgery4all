import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { contactSchema } from '@/lib/validation'
import { sendContactEmail } from '@/lib/mail'

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid-json' }, { status: 400 })
  }

  let data
  try {
    data = contactSchema.parse(body)
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ error: err.flatten() }, { status: 400 })
    }
    return NextResponse.json({ error: 'invalid-input' }, { status: 400 })
  }

  try {
    await sendContactEmail(data)
    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof Error && err.message === 'email-not-configured') {
      return NextResponse.json({ error: 'email-not-configured' }, { status: 503 })
    }
    return NextResponse.json({ error: 'send-failed' }, { status: 500 })
  }
}
