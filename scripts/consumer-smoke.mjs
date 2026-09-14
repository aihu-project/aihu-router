import { execFileSync } from 'node:child_process'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const archive = process.argv[2]
if (!archive) {
  throw new Error('usage: node scripts/consumer-smoke.mjs /absolute/path/package.tgz')
}

const consumer = mkdtempSync(join(tmpdir(), 'aihu-router-consumer-'))
execFileSync('npm', ['init', '-y'], { cwd: consumer, stdio: 'ignore' })
execFileSync(
  'npm',
  ['install', '--ignore-scripts', '--no-package-lock', '--no-audit', '--no-fund', resolve(archive)],
  { cwd: consumer, stdio: 'inherit' },
)

const contextTree = JSON.parse(
  execFileSync('npm', ['ls', '@aihu/context', '--all', '--json'], {
    cwd: consumer,
    encoding: 'utf8',
  }),
)

const contextVersions = new Set()
const collectContextVersions = (node) => {
  if (!node?.dependencies) return
  for (const [name, dependency] of Object.entries(node.dependencies)) {
    if (name === '@aihu/context' && dependency.version) contextVersions.add(dependency.version)
    collectContextVersions(dependency)
  }
}
collectContextVersions(contextTree)

if (contextVersions.size !== 1 || !contextVersions.has('0.2.1')) {
  throw new Error(
    `router consumer must resolve one @aihu/context@0.2.1 instance; found ${[
      ...contextVersions,
    ].join(', ')}`,
  )
}

execFileSync(
  process.execPath,
  [
    '--input-type=module',
    '-e',
    `
      import assert from 'node:assert/strict'
      import { runWithContext } from '@aihu/context/ssr'
      import { provideRouteContext, useRoute, useRouter } from '@aihu/router'

      const route = { pathname: '/consumer', params: {}, module: {} }
      const router = { match: () => route }
      runWithContext(new Map(), () => {
        provideRouteContext({ router, current: () => route })
        assert.equal(useRoute(), route)
        assert.equal(useRouter(), router)
      })
    `,
  ],
  { cwd: consumer, stdio: 'inherit' },
)

console.log(`isolated consumer passed against ${archive}`)
