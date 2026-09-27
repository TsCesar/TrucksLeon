import { notFound } from 'next/navigation'

/**
 * Catch-all inside the locale tree, purely so an unknown path renders the
 * LOCALIZED 404.
 *
 * Without it, `/de/nope` matches no route segment at all, so Next never enters
 * `[locale]` and falls back to the global not-found — which sits outside both
 * root layouts and answers in one fixed language. Static segments take
 * precedence over a catch-all, so no real page is shadowed.
 *
 * `generateStaticParams` returns nothing on purpose: there is no such page to
 * prerender. In the static export GitHub Pages serves the generated 404.html
 * instead, since a static host cannot know the locale of a URL that matches
 * nothing.
 */
export function generateStaticParams() {
  return []
}

export default function LocaleCatchAll() {
  notFound()
}
