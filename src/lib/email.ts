import { Resend } from 'resend'
import type { ContactFormData } from '@/lib/validations'

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

const TO = process.env.CONTACT_TO_EMAIL ?? 'info@trucksleon.com'
const FROM = process.env.CONTACT_FROM_EMAIL ?? 'no-reply@trucksleon.com'

type EmailData = Omit<ContactFormData, 'consent' | 'honeypot'>

export async function sendContactEmail(data: EmailData) {
  const subject = `Nuevo contacto desde TrucksLeón International${data.name ? ` — ${data.name}` : ''}`

  if (!resend) {
    console.log('[email] RESEND_API_KEY not set — printing instead:\n', JSON.stringify(data, null, 2))
    return { ok: true }
  }

  const { error } = await resend.emails.send({
    from: `TrucksLeón Web <${FROM}>`,
    to: TO,
    replyTo: data.email,
    subject,
    html: buildHtml(data),
    text: buildText(data),
  })

  if (error) {
    console.error('[email] Resend error:', error)
    return { ok: false }
  }

  return { ok: true }
}

const LOCALE_LABELS: Record<string, string> = {
  es: 'Español',
  en: 'English',
  nl: 'Nederlands',
  de: 'Deutsch',
  fr: 'Français',
}

function formatDate(): string {
  return new Date().toLocaleString('es-ES', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Europe/Madrid',
  })
}

function buildHtml(data: EmailData) {
  const rows = [
    ['Nombre', esc(data.name)],
    ['Email', `<a href="mailto:${esc(data.email)}">${esc(data.email)}</a>`],
    ['Teléfono', esc(data.phone)],
    ...(data.company ? [['Empresa', esc(data.company)]] : []),
    ['Idioma', LOCALE_LABELS[data.locale] ?? data.locale],
    ['Fecha', formatDate()],
    ['Origen', 'Formulario web TrucksLeón International'],
  ]

  const tableRows = rows.map(([label, value], i) =>
    `<tr${i % 2 === 1 ? ' style="background:#f5f5f5"' : ''}><td style="font-weight:bold;width:130px;padding:8px">${label}</td><td style="padding:8px">${value}</td></tr>`
  ).join('')

  return `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8" /><title>Contacto TrucksLeón</title></head>
<body style="font-family:sans-serif;color:#111;background:#fff;padding:24px">
  <h2 style="color:#D71920;margin-top:0">Nuevo contacto desde TrucksLeón International</h2>
  <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:580px">
    ${tableRows}
  </table>
  <h3 style="margin-top:24px">Mensaje</h3>
  <p style="white-space:pre-wrap;background:#f5f5f5;padding:16px;border-radius:4px;margin:0">${esc(data.message)}</p>
  <hr style="margin-top:32px;border:none;border-top:1px solid #eee" />
  <p style="font-size:12px;color:#888">Enviado desde el formulario de contacto de trucksleon.com</p>
</body>
</html>`
}

function buildText(data: EmailData) {
  return [
    'NUEVO CONTACTO DESDE TRUCKSLEÓN INTERNATIONAL',
    '─'.repeat(48),
    `Nombre:   ${data.name}`,
    `Email:    ${data.email}`,
    `Teléfono: ${data.phone}`,
    ...(data.company ? [`Empresa:  ${data.company}`] : []),
    `Idioma:   ${LOCALE_LABELS[data.locale] ?? data.locale}`,
    `Fecha:    ${formatDate()}`,
    `Origen:   Formulario web TrucksLeón International`,
    '',
    'Mensaje:',
    data.message,
  ].join('\n')
}

function esc(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
