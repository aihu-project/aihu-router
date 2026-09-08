# @aihu/router

An opt-in file based router and Vite integration for aihu applications. It
provides browser navigation primitives, route discovery, route metadata
sidecars, layouts, middleware, and an isolated server rendering entry point.

The router is provider neutral. It does not bundle a DOM engine, CSS engine,
compiler, server host, or framework specific adapter. Applications choose
those pieces independently and pass compiler hooks into the Vite integration
when they need `.aihu` route metadata or server component pruning.

## Install

```bash
bun add @aihu/router
# or
npm install @aihu/router
```

`@aihu/router` is intentionally opt in. Import the browser surface only when
the application wants client routing:

```ts
import { createRouter, useRoute } from '@aihu/router'
```

Use the build-time and server surfaces explicitly so they do not enter a
browser bundle:

```ts
import { viteRouterIntegration } from '@aihu/router/plugin'
import { createServerRouter } from '@aihu/router/server'
```

## Package boundary

The package consumes published `@aihu/context`, `@aihu/server`, and
`@aihu/signals` packages. Those are external dependencies and remain
replaceable at the application boundary. The router does not copy their
source, depend on the aihu compiler, or require a particular DOM or shadow
rendering mode.

The Vite integration accepts optional compiler callbacks for route metadata and
server child-tag derivation. Without those callbacks it remains usable for
plain TypeScript route modules and falls back to the route metadata it can
read itself.

## Exports

- `@aihu/router` — browser-safe router and reactive route context
- `@aihu/router/plugin` — Vite route, layout, component, and middleware discovery
- `@aihu/router/server` — server-only request handling and SSR integration

## Development

```bash
bun install
bun run check
bun run test
bun run build
bun run pack:check
```

`bun run check` runs Biome and TypeScript. The test suite uses published aihu
dependencies and keeps the native server loader in its documented skip mode so
the standalone package can be validated on a clean machine.

## License

MIT. See [LICENSE](LICENSE).
