# AGENTS.md

Weather Widget Editor — an npm-workspaces monorepo. See `README.md` for the product overview, API reference, and standard commands.

## Cursor Cloud specific instructions

### Services

| Workspace | Role | Dev command | Dev URL |
|-----------|------|-------------|---------|
| `packages/shared` | Shared types + validation (built to `dist/`, consumed by every other workspace) | n/a (build only, see below) | — |
| `packages/api` | Express 5 REST API (`tsx watch`) | `npm run dev -w @weather-widget/api` | http://localhost:9090 |
| `apps/editor` | Vite + React 19 editor UI (proxies `/api` and `/embed` to `:9090`) | `npm run dev -w @weather-widget/editor` | http://localhost:5173 |
| `apps/embed` | Standalone embeddable widget bundle (`vite build --watch`) | `npm run dev -w @weather-widget/embed` | served at `/embed/widget.js` |

Run everything at once with `npm run dev` (starts `api` + `editor` only — not `embed`). Lint/test/build commands are in the root and workspace `package.json` files.

### Non-obvious gotchas

- **Build `@weather-widget/shared` before running dev servers or tests.** All workspaces import it via its package `exports`, which point only at `packages/shared/dist/`. `dist/` is git-ignored, so on a fresh checkout you must run `npm run build -w @weather-widget/shared` once, or `npm run dev`/`npm test` will fail to resolve `@weather-widget/shared`. The full `npm run build` also builds it first.
- **Lint = typecheck.** There is no ESLint config; the "lint" gate is TypeScript. `npm run build -w @weather-widget/editor` runs `tsc --noEmit`, and each package's `build` runs `tsc`.
- **`OPENWEATHER_API_KEY` is required for live weather only.** Copy `.env.example` to `.env`. The `/api/weather` route (and the editor's "Get widget" preview and the embed widget) call OpenWeatherMap and return a 502 `"OPENWEATHER_API_KEY is not configured"` without a valid key. Health check and embed-snippet generation (`/api/widgets/snippet`) work without a key.
- **Editor "Get widget" needs both a key and browser geolocation.** `App.tsx` runs `createSnippet` and `fetchWeather` together via `Promise.all`, so a failed weather fetch (missing key) prevents the snippet from rendering in the UI even though snippet generation itself succeeds. The form stays disabled until the browser grants geolocation.
- **`legacy/` is archived** (2016 Gulp/Bower/jQuery). Do not build or run it.
