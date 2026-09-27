import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'

/**
 * 404 inside a localized route.
 *
 * With the locale middleware active, an unknown path is redirected into the
 * locale tree (`/nope` → `/es/nope`), so this is the 404 almost every visitor
 * reaches. It renders inside `[locale]/layout.tsx`, which means it carries the
 * correct `lang`, the site chrome and the visitor's language — the previous
 * single 404 was Spanish-only and, after the root layouts were split, emitted
 * `<html>` with no `lang` at all.
 */
export default function LocaleNotFound() {
  const t = useTranslations('notFound')
  const locale = useLocale()

  return (
    <div className="min-h-[70vh] bg-canvas flex items-center justify-center px-4 py-24">
      <div className="text-center">
        <p className="font-mono text-red-text text-sm tracking-widest uppercase mb-4">404</p>
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-ink mb-4 tracking-tight">
          {t('title')}
        </h1>
        <p className="text-steel mb-8">{t('description')}</p>
        <Link
          href={`/${locale}`}
          className="inline-flex items-center px-6 py-3 min-h-[46px] rounded-lg bg-red-accent text-white font-semibold shadow-red hover:bg-red-dark hover:-translate-y-px transition-all duration-200"
        >
          {t('cta')}
        </Link>
      </div>
    </div>
  )
}
