/**
 * GitHub Pages build.
 *
 *   node scripts/build-pages.mjs
 *
 * Builds the static GitHub Pages version without destroying the normal
 * production build stored in .next.
 *
 * During the Pages build:
 *
 *   - the normal .next build is temporarily moved aside
 *   - src/app/api is temporarily moved aside
 *   - src/middleware.ts is temporarily moved aside
 *   - GitHub Pages is built with GITHUB_PAGES=true
 *   - the static export is produced in .next-pages
 *   - .next-pages is moved to out/
 *   - the original .next build is restored
 *   - API routes and middleware are restored
 *
 * Everything is restored from a finally block even if the build fails.
 */

import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, renameSync, rmSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const stash = join(root, '.build-pages-stash')

const buildDir = join(root, '.next-pages')
const outDir = join(root, 'out')

// Normal Next.js production build.
const normalBuildDir = join(root, '.next')
const normalBuildBackup = join(root, '.next-normal-backup')

let normalBuildBackedUp = false

/**
 * Files/routes that cannot be part of a static export.
 */
const SERVER_ONLY = [
  {
    from: join(root, 'src', 'app', 'api'),
    to: join(stash, 'api'),
  },
  {
    // This project keeps its source under src/, so Next resolves middleware
    // from src/middleware.ts — NOT from the repository root. Stashing the root
    // path (as this list used to) moved nothing, which happened to be harmless
    // only because the root file was never loaded in the first place.
    from: join(root, 'src', 'middleware.ts'),
    to: join(stash, 'middleware.ts'),
  },
  {
    // The localized 404 catch-all. `output: 'export'` refuses a dynamic route
    // that prerenders nothing, and there is nothing for it to prerender: a
    // static host cannot know the locale of a URL that matches no page, so
    // GitHub Pages answers with the generated 404.html instead.
    from: join(root, 'src', 'app', '[locale]', '[...rest]'),
    to: join(stash, 'locale-catch-all'),
  },
]

const moved = []

/** Path relative to the repository root, for readable log lines. */
function rel(p) {
  return p.slice(root.length + 1)
}

/**
 * Protect the existing normal Next.js build.
 *
 * Even though the Pages configuration uses .next-pages as distDir,
 * some Next.js build operations/plugins may still touch .next.
 * We therefore protect it explicitly.
 */
function stashNormalBuild() {
  if (!existsSync(normalBuildDir)) {
    return
  }

  if (existsSync(normalBuildBackup)) {
    throw new Error(
      '[build:pages] .next-normal-backup already exists. ' +
        'Refusing to overwrite a previous backup.'
    )
  }

  renameSync(normalBuildDir, normalBuildBackup)
  normalBuildBackedUp = true

  console.log('[build:pages] stashed normal .next build')
}

/**
 * Restore the normal production build after the Pages build.
 */
function restoreNormalBuild() {
  // Remove anything the Pages build may have created in .next.
  rmSync(normalBuildDir, {
    recursive: true,
    force: true,
  })

  if (normalBuildBackedUp && existsSync(normalBuildBackup)) {
    renameSync(normalBuildBackup, normalBuildDir)
    normalBuildBackedUp = false

    console.log('[build:pages] restored normal .next build')
  }
}

/**
 * Temporarily remove server-only files.
 */
function stashServerOnly() {
  mkdirSync(stash, { recursive: true })

  for (const entry of SERVER_ONLY) {
    if (!existsSync(entry.from)) {
      // A path that is expected to exist but does not means this list has
      // drifted from the source tree, and the export would silently ship
      // server-only code. That is exactly how the root middleware.ts entry
      // went unnoticed for so long.
      console.warn(`[build:pages] WARNING: nothing to stash at ${rel(entry.from)}`)
      continue
    }

    renameSync(entry.from, entry.to)
    moved.push(entry)

    console.log(`[build:pages] stashed ${rel(entry.from)}`)
  }
}

/**
 * Restore API routes and middleware.
 */
function restoreServerOnly() {
  while (moved.length) {
    const entry = moved.pop()

    try {
      if (existsSync(entry.to)) {
        renameSync(entry.to, entry.from)
      }
    } catch (err) {
      console.error(
        `[build:pages] COULD NOT RESTORE ${entry.from} — it is still at ${entry.to}`,
        err
      )
    }
  }

  try {
    rmSync(stash, {
      recursive: true,
      force: true,
    })
  } catch {
    // An empty leftover directory is harmless.
  }
}

/**
 * Restore everything if the user interrupts the build.
 */
for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, () => {
    restoreNormalBuild()
    restoreServerOnly()
    process.exit(1)
  })
}

let code = 1

try {
  /*
   * Protect the normal build BEFORE starting the Pages build.
   */
  stashNormalBuild()
  stashServerOnly()

  /*
   * Remove stale Pages artifacts so an old build can never be mistaken
   * for a successful new build.
   */
  rmSync(buildDir, {
    recursive: true,
    force: true,
  })

  const result = spawnSync('npx', ['next', 'build'], {
    cwd: root,
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: {
      ...process.env,

      // Used by next.config.ts and server/build-time code.
      GITHUB_PAGES: 'true',

      // Inlined into client-side bundles.
      NEXT_PUBLIC_GITHUB_PAGES: 'true',
      NEXT_PUBLIC_BASE_PATH: '/TrucksLeon',

      // Canonical/hreflang/OG/sitemap origin for THIS environment. It already
      // contains the base path, so nothing downstream may prepend it again —
      // that is how you end up with /TrucksLeon/TrucksLeon/. An override from
      // the surrounding environment wins, so CI can point staging elsewhere.
      NEXT_PUBLIC_SITE_URL:
        process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tscesar.github.io/TrucksLeon',
    },
  })

  code = result.status ?? 1

  /*
   * Only publish if the Next build succeeded.
   */
  if (code === 0) {
    if (!existsSync(buildDir)) {
      console.error(
        `[build:pages] expected export in ${buildDir} — nothing to publish`
      )

      code = 1
    } else {
      /*
       * Replace the previous static export atomically enough for our local
       * build/workflow use.
       */
      rmSync(outDir, {
        recursive: true,
        force: true,
      })

      renameSync(buildDir, outDir)

      console.log('[build:pages] export moved to out/')
    }
  }
} finally {
  /*
   * Order matters:
   *
   * 1. remove/restore .next
   * 2. restore server-only source files
   */
  restoreNormalBuild()
  restoreServerOnly()
}

process.exit(code)