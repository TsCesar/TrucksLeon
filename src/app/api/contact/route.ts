import { NextRequest, NextResponse } from 'next/server'
import { contactSchema } from '@/lib/validations'
import { sendContactEmail } from '@/lib/email'
import { rateLimit } from '@/lib/rate-limit'

function getIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

export async function POST(req: NextRequest) {
  const ip = getIp(req)
  const { allowed } = rateLimit(ip)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a minute and try again.' },
      { status: 429 }
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const result = contactSchema.safeParse(body)
  if (!result.success) {
    const firstIssue = result.error.issues[0]
    if (firstIssue.path.includes('honeypot')) {
      return NextResponse.json({ ok: true })
    }
    return NextResponse.json(
      { error: 'Validation failed.', issues: result.error.flatten().fieldErrors },
      { status: 422 }
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { consent: _, honeypot: __, ...emailData } = result.data

  const { ok } = await sendContactEmail(emailData)
  if (!ok) {
    return NextResponse.json(
      { error: 'Failed to send email. Please try again later.' },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true })
}
