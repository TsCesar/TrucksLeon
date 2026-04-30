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
  // Rate limiting
  const ip = getIp(req)
  const { allowed } = rateLimit(ip)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a minute and try again.' },
      { status: 429 }
    )
  }

  // Parse body
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  // Validate with Zod (includes honeypot)
  const result = contactSchema.safeParse(body)
  if (!result.success) {
    // Honeypot triggered — return 200 to not reveal bot detection
    const firstIssue = result.error.issues[0]
    if (firstIssue.path.includes('honeypot')) {
      return NextResponse.json({ ok: true })
    }
    return NextResponse.json(
      { error: 'Validation failed.', issues: result.error.flatten().fieldErrors },
      { status: 422 }
    )
  }

  const { consent: _consent, honeypot: _honeypot, ...emailData } = result.data

  const { ok } = await sendContactEmail(emailData)
  if (!ok) {
    return NextResponse.json(
      { error: 'Failed to send email. Please try again later.' },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true })
}
