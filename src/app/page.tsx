import { redirect } from 'next/navigation'
import { defaultLocale } from '@/config/locales'
import { RootRedirect } from './RootRedirect'

// Resolved at build time: the static export cannot emit a server redirect.
const isGitHubPages = process.env.GITHUB_PAGES === 'true'

export default function RootPage() {
  if (isGitHubPages) return <RootRedirect />
  redirect(`/${defaultLocale}`)
}
