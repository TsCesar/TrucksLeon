/**
 * GitHub Pages build.
 *
 *   node scripts/build-pages.mjs     (npm run build:pages)
 *
 * Sets the env vars inline so the command works identically in PowerShell,
 * cmd and bash — no `VAR=x next build` shell syntax, no cross-env dependency.
 *
 * `output: 'export'` cannot build two things this project needs in its normal
 * mode, so both are moved aside for the duration of the build and restored in a
 * finally block (and on SIGINT), even if the build throws:
 *
 *   src/app/api      — route handlers have no static output
 *   middleware.ts    — middleware requires a server
 *
 * Nothing is deleted: the files move to a sibling .build-pages-stash/ that is
 * removed once they are back in place.
 */

import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, renameSync, rmSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const stash = join(root, '.build-pages-stash')

/** Paths that must not exist while `next build` runs. */
const SERVER_ONLY = [
  { from: join(root, 'src', 'app', 'api'), to: join(stash, 'api') },
  { from: join(root, 'middleware.ts'), to: join(stash, 'middleware.ts') },
]

const moved = []

function stashServerOnly() {
  mkdirSync(stash, { recursive: true })
  for (const entry of SERVER_ONLY) {
    if (!existsSync(entry.from)) continue
    renameSync(entry.from, entry.to)
    moved.push(entry)
    console.log(`[build:pages] stashed ${entry.from.replace(root + '\\', '').replace(root + '/', '')}`)
  }
}

function restoreServerOnly() {
  while (moved.length) {
    const entry = moved.pop()
    try {
      if (existsSync(entry.to)) renameSync(entry.to, entry.from)
    } catch (err) {
      console.error(`[build:pages] COULD NOT RESTORE ${entry.from} — it is still at ${entry.to}`, err)
    }
  }
  try {
    rmSync(stash, { recursive: true, force: true })
  } catch {
    /* a leftover empty dir is harmless */
  }
}

// Restore even if the user interrupts the build.
for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, () => {
    restoreServerOnly()
    process.exit(1)
  })
}

let code = 1
try {
  stashServerOnly()

  const result = spawnSync('npx', ['next', 'build'], {
    cwd: root,
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: {
      ...process.env,
      // Read by next.config.ts and src/app/page.tsx (build time, server side).
      GITHUB_PAGES: 'true',
      // NEXT_PUBLIC_* are inlined into the client bundle too.
      NEXT_PUBLIC_GITHUB_PAGES: 'true',
      NEXT_PUBLIC_BASE_PATH: '/TrucksLeon',
    },
  })
  code = result.status ?? 1
} finally {
  restoreServerOnly()
}

process.exit(code)
