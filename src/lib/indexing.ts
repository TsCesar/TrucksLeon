import { isStaging } from '@/config/site'

/**
 * Whether this deployment may be indexed by search engines.
 *
 * Indexing is OPT-IN and nothing else grants it. `ALLOW_INDEXING=true` must be
 * set explicitly, on the one deployment that serves the real domain.
 *
 * The rule is deliberately not "NODE_ENV === 'production'". Preview builds,
 * staging copies and any second deployment of this repo all run production
 * builds, and every one of them would then compete with trucksleon.com for the
 * same content in five languages. Forgetting the variable produces `noindex`,
 * which is recoverable; the opposite default is not.
 *
 * GitHub Pages is excluded unconditionally as well, so staging cannot be opened
 * up by setting the variable in the wrong place.
 *
 * SERVER-side on purpose: it must not be inlined into client bundles, and it is
 * only ever read while rendering metadata, robots.txt or response headers.
 */
export const allowIndexing = !isStaging && process.env.ALLOW_INDEXING === 'true'
