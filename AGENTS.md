# AGENTS.md — Cloudinary Next

Guidance for AI agents and human contributors working in this repository.

## Project Overview

- **What:** A Next.js demo application showcasing Cloudinary media management (gallery, upload, transform, optimize, manage).
- **Stack:** Next.js 16 (App Router, Turbopack), React 19, TypeScript (strict), Tailwind CSS v4, shadcn/ui, Framer Motion, Cloudinary SDK v2.
- **Package manager:** npm. Node version pinned in `.nvmrc` (22).
- **Remote:** `https://github.com/coderooz/cloudinary-next` (branch `main`).

## Commands

```bash
npm run dev        # start dev server (Turbopack)
npm run build      # production build
npm run start      # serve production build
npm run lint       # ESLint (flat config, eslint.config.mjs)
npx tsc --noEmit   # typecheck
```

**Validation gate:** `npm run lint`, `npm run build`, and `npx tsc --noEmit` must all pass with zero errors before committing.

## Architecture

- `src/app/page.tsx` — client component; tabbed media manager. Data fetching uses the documented inline-async pattern inside `useEffect` with an `ignore` cleanup flag (do NOT reintroduce `useCallback`-wrapped fetchers — the `react-hooks/set-state-in-effect` rule flags them).
- `src/app/api/private/assets/*/route.ts` — Cloudinary API route handlers (list, upload, delete, folders, search, tags, transform).
- `src/lib/cloudinary/` — `cloudinary-init.ts` (v2 instance from env), `cloudinary-client.ts` (typed wrappers), `cloudinary-types.ts` (`AssetData`).
- `src/components/cloudinary/` — feature components; `src/components/ui/` — shadcn/ui primitives.
- `src/lib/utils.ts` — shared utilities (`cn`, `formatFileSize`, `formatDate`, etc.).

## Environment Variables

Only these are required (in `.env.local`):

```
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

Never commit real credentials. `.env*` is gitignored.

## Conventions

- TypeScript strict mode; no `any` (use `unknown` + narrowing, or precise types).
- Server Components by default; `'use client'` only when interactivity is needed.
- Prefer `interface` for object shapes; `const` over `let`; optional chaining and nullish coalescing.
- Conventional commits: `type(scope): message` (`feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `style`, `perf`).
- Do not push unless explicitly asked.

## Repository Hygiene

- `.workspace/` (PRI/LFI/Reports) is gitignored; commit it explicitly with `git add -f` when updating project indexes.
- `next-env.d.ts` and `*.tsbuildinfo` are gitignored.
- Keep `README.md`, `CHANGELOG.md`, and the PRI/LFI indexes in sync with the actual repo state.