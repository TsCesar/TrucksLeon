import { Resend } from 'resend'
import type { ContactFormData } from '@/lib/validations'

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

const TO = process.env.CONTACT_TO_EMAIL ?? 'info@trucksleon.com'
const FROM = process.env.CONTACT_FROM_EMAIL ?? 'no-reply@trucksleon.com'

export async function sendContactEmail(data: Omit<ContactFormData, 'consent' | 'honeypot'>) {
  if (!resend) {
    // Dev fallback: log without leaking to a third-party service
    console.log('[email] RESEND_API_KEY not set — printing instead:\n', JSON.stringify(data, null, 2))
    return { ok: true }
  }

  const { error } = await resend.emails.send({
    from: `TrucksLeón Web <${FROM}>`,
    to: TO,
    replyTo: data.email,
    subject: `Nuevo contacto web — ${data.name}${data.company ? ` (${data.company})` : ''}`,
    html: buildHtml(data),
    text: buildText(data),
  })

  if (error) {
    console.error('[email] Resend error:', error)
    return { ok: false }
  }

  return { ok: true }
}

function buildHtml(data: Omit<ContactFormData, 'consent' | 'honeypot'>) {
  return `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8" /><title>Contacto TrucksLeón</title></head>
<body style="font-family:sans-serif;color:#111;background:#fff;padding:24px">
  <h2 style="color:#D71920;margin-top:0">Nuevo mensaje de contacto</h2>
  <table cellpadding="8" style="border-collapse:collapse;width:100%;max-width:560px">
    <tr><td style="font-weight:bold;width:120px">Nombre</td><td>${esc(data.name)}</td></tr>
    <tr style="background:#f5f5f5"><td style="font-weight:bold">Email</td><td><a href="mailto:${esc(data.email)}">${esc(data.email)}</a></td></tr>
    <tr><td style="font-weight:bold">Teléfono</td><td>${esc(data.phone)}</td></tr>
    ${data.company ? `<tr style="background:#f5f5f5"><td style="font-weight:bold">Empresa</td><td>${esc(data.company)}</td></tr>` : ''}
  </table>
  <h3 style="margin-top:24px">Mensaje</h3>
  <p style="white-space:pre-wrap;background:#f5f5f5;padding:16px;border-radius:4px">${esc(data.message)}</p>
  <hr style="margin-top:32px;border:none;border-top:1px solid #eee" />
  <p style="font-size:12px;color:#888">Enviado desde el formulario de contacto de trucksleon.com</p>
</body>
</html>`
}

function buildText(data: Omit<ContactFormData, 'consent' | 'honeypot'>) {
  return [
    'NUEVO MENSAJE DE CONTACTO — TrucksLeón',
    '',
    `Nombre:   ${data.name}`,
    `Email:    ${data.email}`,
    `Teléfono: ${data.phone}`,
    data.company ? `Empresa:  ${data.company}` : '',
    '',
    'Mensaje:',
    data.message,
  ].filter(Boolean).join('\n')
}

function esc(str: string) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
