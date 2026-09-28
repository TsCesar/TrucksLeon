import { NextRequest, NextResponse } from 'next/server'
import { contactSchema } from '@/lib/validations'
import { sendContactEmail } from '@/lib/email'
import { rateLimit } from '@/lib/rate-limit'

/**
 * A throttling key for this caller.
 *
 * Used only to count requests inside the current minute and never stored,
 * logged or attached to the email. `rateLimit` holds it in memory until the
 * window expires and then drops it.
 */
function throttleKey(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

export async function POST(req: NextRequest) {
  // Only accept what the form actually sends. A cross-origin form post arrives
  // as form-encoded or text/plain; requiring JSON rejects those outright.
  const contentType = req.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    return NextResponse.json({ error: 'Unsupported content type.' }, { status: 415 })
  }

  const { allowed } = rateLimit(throttleKey(req))
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

  const { name, email, phone, company, message, locale } = result.data

  const { ok } = await sendContactEmail({ name, email, phone, company, message, locale })
  if (!ok) {
    return NextResponse.json(
      { error: 'Failed to send email. Please try again later.' },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true })
}
