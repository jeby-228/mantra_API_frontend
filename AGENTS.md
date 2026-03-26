# AGENTS.md

## Cursor Cloud specific instructions

This is a **SvelteKit frontend** application ("Jeby Website" / Mantra API Frontend) written in TypeScript with Svelte 5, Tailwind CSS v4, and Skeleton UI. It communicates with an external Go backend API via REST and GraphQL.

### Quick reference

| Task         | Command                    |
| ------------ | -------------------------- |
| Install deps | `pnpm install`             |
| Dev server   | `pnpm run dev` (port 5173) |
| Lint         | `pnpm run lint`            |
| Type check   | `pnpm run check`           |
| Tests        | `pnpm run test`            |
| Build        | `pnpm run build`           |
| Format       | `pnpm run format`          |

See `justfile` for equivalent `just` shortcuts.

### Environment variables

Copy `.env.example` to `.env`. Key variable: `PUBLIC_API_BASE_URL` (defaults to `https://localhost:8080`). The remote Render instance at `https://member-api-0-0-4.onrender.com` can be used if no local backend is available. Data-fetching pages (homepage quotes, etc.) will show network errors without a reachable backend — this is expected.

### Non-obvious caveats

- **esbuild build scripts**: `package.json` includes `pnpm.onlyBuiltDependencies: ["esbuild"]` to allow esbuild's postinstall script non-interactively. Without this, `pnpm install` warns about ignored build scripts and esbuild won't work.
- **Tests use Playwright browser mode**: `vitest` runs browser-based tests via `@vitest/browser-playwright`. Chromium must be installed: `pnpm exec playwright install --with-deps chromium`. The SSR "transport was disconnected" errors after test completion are benign noise from Vite shutdown.
- **No local database needed**: This is a pure frontend; the database lives in the separate Go backend (`mantra_API`).
- **Build adapter warning**: `pnpm run build` shows "Could not detect a supported production environment" because `@sveltejs/adapter-auto` targets Vercel in production. This is harmless for local development.
