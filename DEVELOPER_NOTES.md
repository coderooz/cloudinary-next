# Developer Notes — cloudinary-next

Companion to `README.md` and `AGENTS.md`. This file captures the durable engineering context needed to rebuild, run, extend, or recover this project from scratch. It is the primary reference for anyone (human or agent) resuming work after a gap.

---

## 1. Overview

A Next.js 16 (App Router, Turbopack) demo application that showcases Cloudinary media management: gallery, upload, transform, optimize, and manage. Built with React 19, TypeScript (strict), Tailwind CSS v4, shadcn/ui, and Framer Motion. The Cloudinary SDK v2 runs server-side only; all credentials stay in environment variables and are never exposed to the client.

- **Package name:** `cloudinary-nextjs`
- **Version:** `0.1.0`
- **Node:** 22 (`.nvmrc`)
- **Package manager:** npm
- **Remote:** `https://github.com/coderooz/cloudinary-next.git` (branch `main`)

---

## 2. Architecture

```
Browser (client components)
   │  fetch() to /api/private/assets/*
   ▼
Next.js route handlers (server)
   │  cloudinary-client.ts (typed wrappers)
   ▼
cloudinary-init.ts (v2 instance from env)
   │
   ▼
Cloudinary REST API
```

- **Data fetching pattern:** `src/app/page.tsx` uses the documented inline-async pattern inside `useEffect` with an `ignore` cleanup flag. Do NOT reintroduce `useCallback`-wrapped fetchers — the `react-hooks/set-state-in-effect` rule flags them.
- **Server-only credentials:** the Cloudinary v2 instance is created in `src/lib/cloudinary/cloudinary-init.ts` and only imported by route handlers. Never import it into a client component.
- **API surface:** all routes live under `/api/private/assets/` (list, upload, delete, folders, search, tags, transform). See `README.md` for the endpoint table.
- **UI:** `src/components/cloudinary/` are feature components; `src/components/ui/` are shadcn/ui primitives. `SelectedAsset.tsx` is a named export (`export const SelectedAsset`).

---

## 3. Repository Structure

See `.workspace/PRI/PROJECT_REFERENCE_INDEX.md` (v2.1, VERIFIED) for the full structural map, and `.workspace/LFI/` for behavioral flows (10 flows F-01..F-10, component interactions, error paths).

Key directories:

| Path | Purpose |
|------|---------|
| `src/app/api/private/assets/` | Cloudinary API route handlers (7 endpoints) |
| `src/lib/cloudinary/` | `cloudinary-init.ts`, `cloudinary-client.ts`, `cloudinary-types.ts` |
| `src/components/cloudinary/` | Feature components (gallery, upload, transform, optimize, manage) |
| `src/components/ui/` | shadcn/ui primitives |
| `.github/` | 6 issue templates, PR template, CODEOWNERS, FUNDING, dependabot, labels, 5 workflows |
| `.workspace/` | PRI/LFI reference indexes (gitignored; committed explicitly via `git add -f`) |

---

## 4. Development Environment

### Required environment variables (`.env.local`)

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Optional:

```
CLOUDINARY_NOTIFICATION_URL=...   # used by transform/route.ts for eager_async notifications
```

A template with placeholders is committed as `.env.example`. Copy it to `.env.local` and fill in real values. Never commit real credentials — `.env*` is gitignored.

### Setup

```bash
nvm use            # Node 22 (see .nvmrc)
npm install
cp .env.example .env.local   # then fill in real Cloudinary values
npm run dev        # http://localhost:3000
```

---

## 5. Commands

```bash
npm run dev        # start dev server (Turbopack)
npm run build      # production build
npm run start      # serve production build
npm run lint       # ESLint (flat config, eslint.config.mjs)
npx tsc --noEmit   # typecheck
```

**Validation gate:** `npm run lint`, `npx tsc --noEmit`, and `npm run build` must all pass with zero errors before committing. Lint currently reports 0 errors and 10 non-blocking warnings (unused imports/params) — these are intentionally left unfixed.

---

## 6. Testing Status

There are no automated tests in this repository. Validation relies on the lint/typecheck/build gate above. If adding tests, prefer Vitest (matching the project's TypeScript-first, minimal-dependency style) and colocate test files with components.

---

## 7. Deployment

- **CI:** `.github/workflows/ci.yml` runs `npm ci` + lint + typecheck + build on push/PR (Node 22). Cloudinary secrets are read from GitHub repo secrets.
- **Release:** `.github/workflows/release.yml` builds and creates a GitHub Release on tag push; it also supports `workflow_dispatch`.
- **Auto-tag:** `.github/workflows/auto-tag.yml` tags `v{package.json version}` on push to main. Known limitation: it pushes with the default `GITHUB_TOKEN`, which GitHub blocks from triggering the Release workflow. To release, either run the Release workflow manually (`workflow_dispatch`) or configure a PAT secret.
- **Hosting:** Vercel is the intended host (project is Vercel-ready; no platform-specific config committed).

---

## 8. Maintenance

- **Dependencies:** Dependabot runs weekly (Monday 09:00 Asia/Kolkata), minor/patch only, semver-major ignored. Review and merge its PRs after passing the validation gate.
- **Stale issues/PRs:** `.github/workflows/stale.yml` marks items stale after 60 days of inactivity and closes them 7 days later.
- **Labels:** `.github/labels.yml` defines 22 labels; the labels workflow syncs them on push. Edit the file, not the GitHub UI.
- **Indexes:** after any structural change, update `.workspace/PRI/PROJECT_REFERENCE_INDEX.md` and commit it explicitly (`git add -f .workspace/`).

---

## 9. Known Issues / Limitations

| Item | Status |
|------|--------|
| 10 lint warnings (unused imports/params) | Non-blocking; intentionally unfixed |
| Auto-tag cannot trigger the Release workflow (GITHUB_TOKEN) | Use `workflow_dispatch` or a PAT secret |
| Tag `v0.0.1` exists on origin; `package.json` version is `0.1.0` | Auto-tag reads package version at tag time |
| No automated tests | Validation = lint + typecheck + build |
| `public/cloudinary-demo-app.txt` references cloud `dgis8gvg4` | Dummy data only |

---

## 10. Preservation & Recovery

This project is preserved on GitHub at `https://github.com/coderooz/cloudinary-next` (branch `main`). To recover from a clean machine:

```bash
git clone https://github.com/coderooz/cloudinary-next.git
cd cloudinary-next
nvm use
npm install
cp .env.example .env.local   # fill in real Cloudinary values
npm run lint && npx tsc --noEmit && npm run build
npm run dev
```

The PRI/LFI reference indexes are committed under `.workspace/` (force-added) and are part of the recovery artifact set. Local-only files that are NOT preserved in git: `.env.local`, `.mcp-runtime.json`, `.opencode/` (plugin workspace), `.next/`, `node_modules/`, `tsconfig.tsbuildinfo`.

---

## 11. Governance

- Global governance: `~/.config/opencode/GOVERNANCE.md` (v1.3) and `~/.config/opencode/governance/` (PROJECT_WORKFLOW, WORKSPACE_DEVELOPMENT_ARTIFACT_MANAGEMENT, PROJECT_REFERENCE_INDEX, LOGIC_FLOW_INDEX).
- Project rules: `AGENTS.md` at the repository root.
- MCP memory (local-mcp-memory): project descriptor and durable context are stored under project `docs-repo` (metadata project `cloudinary-next`).