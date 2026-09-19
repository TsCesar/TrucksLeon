'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { contactSchema, type ContactFormData } from '@/lib/validations'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { siteConfig } from '@/config/site'

// Read inline (not via a re-exported const) so Next can fold the literal and the
// minifier drops the unused branch — the Pages bundle ships no /api/contact call.
const isGitHubPages = process.env.NEXT_PUBLIC_GITHUB_PAGES === 'true'

/**
 * Flattens the form into the plain-text body used by the WhatsApp and mailto
 * hand-offs. Only reached in the GitHub Pages build, which has no /api/contact.
 */
function composeMessage(d: ContactFormData): string {
  return [
    `${d.name}`,
    `Email: ${d.email}`,
    `Tel: ${d.phone}`,
    d.company ? `Empresa: ${d.company}` : null,
    '',
    d.message,
  ]
    .filter((line) => line !== null)
    .join('\n')
}

export function ContactForm() {
  const t = useTranslations()
  const locale = useLocale() as ContactFormData['locale']
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { honeypot: '', locale },
  })

  /** Static hosting has no backend: hand the validated message to WhatsApp or mail. */
  function handOff(data: ContactFormData, via: 'whatsapp' | 'email') {
    const body = composeMessage(data)
    const url =
      via === 'whatsapp'
        ? `https://wa.me/${siteConfig.contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(body)}`
        : `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(
            `${siteConfig.name} — ${data.name}`
          )}&body=${encodeURIComponent(body)}`
    window.open(url, '_blank', 'noopener,noreferrer')
    setStatus('success')
    reset()
  }

  async function onSubmit(data: ContactFormData) {
    setStatus('idle')

    if (isGitHubPages) {
      handOff(data, 'whatsapp')
      return
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setStatus('success')
        reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  function getError(key: keyof ContactFormData): string | undefined {
    const msg = errors[key]?.message
    if (!msg) return undefined
    try { return t(msg as Parameters<typeof t>[0]) } catch { return msg }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
        <CheckCircle size={48} className="text-[#15803D]" aria-hidden />
        <p className="text-ink font-heading font-semibold text-lg">{t('contact.form.success')}</p>
        <Button variant="ghost" onClick={() => setStatus('idle')} size="sm">
          {t('common.back')}
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* Honeypot — hidden from real users, bots fill it in */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }}>
        <label htmlFor="website">Website</label>
        <input id="website" type="text" autoComplete="off" tabIndex={-1} {...register('honeypot')} />
      </div>

      {/* Locale — sent in body, not exposed as visible UI */}
      <input type="hidden" {...register('locale')} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          label={t('contact.form.name')}
          placeholder={t('contact.form.namePlaceholder')}
          autoComplete="name"
          required
          error={getError('name')}
          {...register('name')}
        />
        <Input
          label={t('contact.form.email')}
          type="email"
          placeholder={t('contact.form.emailPlaceholder')}
          autoComplete="email"
          required
          error={getError('email')}
          {...register('email')}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          label={t('contact.form.phone')}
          type="tel"
          placeholder={t('contact.form.phonePlaceholder')}
          autoComplete="tel"
          required
          error={getError('phone')}
          {...register('phone')}
        />
        <Input
          label={t('contact.form.company')}
          placeholder={t('contact.form.companyPlaceholder')}
          autoComplete="organization"
          error={getError('company')}
          {...register('company')}
        />
      </div>
      <Textarea
        label={t('contact.form.message')}
        placeholder={t('contact.form.messagePlaceholder')}
        required
        rows={5}
        error={getError('message')}
        {...register('message')}
      />

      {/* Consent */}
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="consent"
          className="mt-0.5 w-[18px] h-[18px] rounded border border-line/25 bg-surface accent-red-accent cursor-pointer flex-shrink-0"
          {...register('consent')}
        />
        <label htmlFor="consent" className="text-xs text-steel cursor-pointer leading-relaxed">
          {t('contact.form.consent')}
        </label>
      </div>
      {errors.consent && (
        <p role="alert" className="text-xs text-red-text font-medium -mt-3">
          {getError('consent')}
        </p>
      )}

      {status === 'error' && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-red-accent/[0.06] border border-red-accent/25 text-red-text text-sm">
          <AlertCircle size={16} aria-hidden />
          {t('contact.form.error')}
        </div>
      )}

      {isGitHubPages ? (
        <div className="space-y-3">
          <p className="text-xs text-steel leading-relaxed">{t('contact.form.staticNotice')}</p>
          <Button type="submit" loading={isSubmitting} size="lg" className="w-full">
            {t('contact.form.submitWhatsapp')}
          </Button>
          <button
            type="button"
            onClick={handleSubmit((data) => handOff(data, 'email'))}
            className="w-full text-xs font-medium text-steel hover:text-red-text underline underline-offset-4 decoration-line/25 hover:decoration-red-accent/40 transition-colors"
          >
            {t('contact.form.submitEmail')}
          </button>
        </div>
      ) : (
        <Button type="submit" loading={isSubmitting} size="lg" className="w-full">
          {isSubmitting ? t('contact.form.sending') : t('contact.form.submit')}
        </Button>
      )}
    </form>
  )
}
