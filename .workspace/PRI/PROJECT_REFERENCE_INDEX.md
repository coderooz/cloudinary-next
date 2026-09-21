# Project Reference Index (PRI) — cloudinary-next

**PRI Version:** 2.1
**Date:** 2026-09-21
**Status:** VERIFIED (all entries confirmed against repository filesystem)
**Source of truth:** Repository filesystem

---

## 1. Project Identity

| Field | Value |
|-------|-------|
| Project name | cloudinary-next |
| Package name | `cloudinary-nextjs` |
| Type | Next.js 16 (App Router) demo application for Cloudinary media management |
| Language | TypeScript (strict) |
| Package manager | npm |
| Git remote | `https://github.com/coderooz/cloudinary-next.git` (branch `main`) |

---

## 2. Directory Structure (Verified)

```
cloudinary-next/
├── .github/                          # GitHub community + automation config
│   ├── CODEOWNERS                    # * @coderooz
│   ├── dependabot.yml                # npm + github-actions, weekly, minor/patch
│   ├── FUNDING.yml                   # github/buy_me_a_coffee: coderooz
│   ├── labels.yml                    # 22 labels (defaults + custom) synced by labels workflow
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── ISSUES_TEMPLATE/              # Issue forms (6)
│   │   ├── bug_report.yml
│   │   ├── config.yml                # blank issues disabled, contact links
│   │   ├── documentation.yml
│   │   ├── feature_request.yml
│   │   ├── question.yml
│   │   └── security_report.yml
│   └── workflows/                    # 5 workflows
│       ├── auto-tag.yml              # tag on push to main (creates v0.0.1; GITHUB_TOKEN cannot trigger release)
│       ├── ci.yml                    # lint + typecheck + build on push/PR
│       ├── labels.yml                # sync labels.yml → repo labels
│       ├── release.yml               # build + GitHub Release on tag (workflow_dispatch supported)
│       └── stale.yml                 # close stale issues/PRs after 60 days
├── .opencode/                        # OpenCode plugin workspace (LOCAL-ONLY, not tracked; own package.json, node_modules)
├── .vscode/
│   ├── launch.json                   # EMPTY configurations
│   ├── settings.json                 # prettier, eslint-on-save, tailwind intellisense
│   └── template.json                 # EMPTY
├── .workspace/                       # Development artifacts (PRI/LFI live here; gitignored)
│   ├── PRI/
│   │   └── PROJECT_REFERENCE_INDEX.md   # THIS FILE
│   ├── LFI/
│   │   ├── LOGIC_FLOW_INDEX.md
│   │   ├── DIAGRAMS.md
│   │   ├── COMPONENT_INTERACTIONS.md
│   │   └── ERROR_PATHS.md
│   └── Reports/
├── public/
│   ├── cloudinary-demo-app.txt       # Dummy asset data (cloud dgis8gvg4)
│   ├── file.svg, globe.svg, next.svg, vercel.svg, window.svg
├── src/
│   ├── app/
│   │   ├── api/private/assets/
│   │   │   ├── delete/route.ts       # DELETE asset
│   │   │   ├── folders/route.ts      # GET/POST/DELETE folders
│   │   │   ├── list/route.ts         # GET list assets
│   │   │   ├── search/route.ts       # GET search assets
│   │   │   ├── tags/route.ts         # GET/POST/DELETE tags
│   │   │   ├── transform/route.ts    # POST transform asset
│   │   │   └── upload/route.ts       # POST upload asset
│   │   ├── globals.css
│   │   ├── layout.tsx                # Root layout (metadata: "Cloudinary - NextJs App")
│   │   └── page.tsx                  # Home page (client; tabs gallery/upload/transform/optimize/manage)
│   ├── components/
│   │   ├── cloudinary/
│   │   │   ├── AssetGallery.tsx      # Gallery grid (client; select + maxResults controls)
│   │   │   ├── AssetManagement.tsx   # Search + sort UI
│   │   │   ├── AssetOptimizer.tsx    # Optimization UI
│   │   │   ├── AssetUpload.tsx       # Drag-drop upload UI
│   │   │   ├── NoImageMessage.tsx    # Empty state
│   │   │   ├── SelectedAsset.tsx     # Asset detail panel (named export)
│   │   │   └── Transformer.tsx       # Brightness/contrast/saturation sliders
│   │   └── ui/                       # shadcn/ui components (badge, button, card, dialog, input, label, pagination, popover, select, separator, slider, sonner, switch, tabs)
│   └── lib/
│       ├── utils.ts                  # cn(), formatFileSize(), formatDate(), truncateText(), etc.
│       └── cloudinary/
│           ├── cloudinary-client.ts  # uploadAsset, deleteAsset, bulkDeleteAssets, listAssets, getAssetDetails, renameAsset, transformAsset, tagAssets, generateArchive, getFolders, createFolder, getUsage, getOptimizedUrl
│           ├── cloudinary-init.ts    # v2 config from env vars
│           └── cloudinary-types.ts   # AssetData interface
├── components.json                   # shadcn config (new-york style, lucide)
├── eslint.config.mjs                 # flat config: next/core-web-vitals + next/typescript
├── next.config.ts                    # reactStrictMode, images.remotePatterns [res.cloudinary.com]
├── package.json / package-lock.json
├── postcss.config.mjs                # @tailwindcss/postcss
├── tsconfig.json                     # strict, @/* → ./src/*
├── AGENTS.md                         # Agent guidance (stack, commands, conventions)
├── CHANGELOG.md                      # Keep a Changelog format
├── CODE_OF_CONDUCT.md                # Contributor Covenant 2.1
├── CONTRIBUTING.md                   # Contribution guidelines
├── DEVELOPER_NOTES.md                # Developer notes (architecture, env, run, deploy, recovery)
├── LICENSE                           # MIT, © 2026 Coderooz (Ranit Saha)
├── README.md
├── SECURITY.md                       # Security notes (env-only creds, private routes)
├── .editorconfig                     # 2-space, LF, UTF-8
├── .env.example                      # Documented env var template (placeholders only)
├── .gitattributes                    # text=auto, LF for source, binary for images
├── .gitignore                        # node_modules, .next, .env*, .workspace/, .mcp-runtime.json, tsbuildinfo
├── .nvmrc                            # 22
├── .mcp-runtime.json                 # MCP runtime state (LOCAL-ONLY, gitignored)
├── cloudinary-next.project-mcp.json  # MCP project config (project: docs-repo)
└── docs-repo.project-mcp.json        # MCP project config (project: docs-repo)
```

---

## 3. Entry Points

| Entry point | Path | Type | Purpose |
|-------------|------|------|---------|
| Home page | `src/app/page.tsx` | Client component | Tabbed media manager (gallery/upload/transform/optimize/manage) |
| Root layout | `src/app/layout.tsx` | Server component | Metadata + Geist fonts |
| API: list | `src/app/api/private/assets/list/route.ts` | Route handler | GET assets (folder, resource_type, max_results, next_cursor) |
| API: upload | `src/app/api/private/assets/upload/route.ts` | Route handler | POST file upload (base64 data URI) |
| API: delete | `src/app/api/private/assets/delete/route.ts` | Route handler | DELETE asset by publicId |
| API: folders | `src/app/api/private/assets/folders/route.ts` | Route handler | GET/POST/DELETE folders |
| API: search | `src/app/api/private/assets/search/route.ts` | Route handler | GET search expression |
| API: tags | `src/app/api/private/assets/tags/route.ts` | Route handler | GET/POST/DELETE tags |
| API: transform | `src/app/api/private/assets/transform/route.ts` | Route handler | POST eager transformation |

---

## 4. Modules & Services

### 4.1 Cloudinary library layer (`src/lib/cloudinary/`)

| Module | Exports | Notes |
|--------|---------|-------|
| `cloudinary-init.ts` | `cloudinary` (v2 instance) | Configured from `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` env vars |
| `cloudinary-client.ts` | `uploadAsset`, `deleteAsset`, `bulkDeleteAssets`, `listAssets`, `getAssetDetails`, `renameAsset`, `transformAsset`, `tagAssets`, `generateArchive`, `getFolders`, `createFolder`, `getUsage`, `getOptimizedUrl` | Thin wrappers over cloudinary v2 API |
| `cloudinary-types.ts` | `AssetData` | asset_id, public_id, version, resource_type, id, type, url, secure_url, display_name, format, bytes, asset_folder, width, height, tags?, created_at, last_updated |

### 4.2 UI components (`src/components/cloudinary/`)

| Component | Type | Purpose |
|-----------|------|---------|
| `AssetGallery.tsx` | Client | Gallery grid with select + maxResults controls |
| `AssetUpload.tsx` | Client | Drag-drop upload UI |
| `Transformer.tsx` | Client | Brightness/contrast/saturation sliders |
| `AssetOptimizer.tsx` | Client | Optimization UI |
| `AssetManagement.tsx` | Client | Search + sort UI |
| `NoImageMessage.tsx` | Client | Empty state message |
| `SelectedAsset.tsx` | Client (named export) | Asset detail panel (secure_url, public_id, format, bytes, dimensions; onRemove/onDelete) |

### 4.3 Shared utilities (`src/lib/utils.ts`)

`cn`, `formatFileSize`, `formatDate`, `truncateText`, `extractFilename`, `isImageFile`, `generateRandomString`, `delay`, `objectToQueryString`, `getFileExtension`, `isValidUrl`.

---

## 5. Configuration

| File | Key settings |
|------|--------------|
| `next.config.ts` | `reactStrictMode: true`; `images.remotePatterns: [{ hostname: 'res.cloudinary.com' }]`; `cacheLife: { blog: ... }`; `experimental.serverActions.bodySizeLimit: '2mb'` |
| `tsconfig.json` | `strict: true`; path alias `@/*` → `./src/*` |
| `components.json` | shadcn new-york style; lucide icons; neutral base color |
| `eslint.config.mjs` | flat config: `next/core-web-vitals`, `next/typescript` |
| `postcss.config.mjs` | `@tailwindcss/postcss` |
| `package.json` | next ^16.3.5, react ^19.3.0, cloudinary ^2.11.0, framer-motion ^13.4.0, lucide-react ^1.47.0, sonner ^2.0.8, typescript ^5.9.3, eslint ^9.39.5, eslint-config-next ^16.3.5; scripts: dev (`next dev --turbopack`), build, start, lint (`eslint`) |
| `.github/dependabot.yml` | npm + github-actions; weekly Monday 09:00 Asia/Kolkata; minor/patch only; ignore semver-major |
| `.github/CODEOWNERS` | `* @coderooz`; config files owned by @coderooz |
| `.github/FUNDING.yml` | github: coderooz; buy_me_a_coffee: coderooz; custom: https://www.coderooz.in |
| `.github/labels.yml` | 22 labels: 9 GitHub defaults + dependencies, automated, ci, security, performance, refactor, chore, breaking change, needs triage, stale, priority: high/medium/low |
| `.github/workflows/ci.yml` | Node 22; `npm ci`; lint + typecheck + build; Cloudinary secrets from repo secrets |
| `.github/workflows/auto-tag.yml` | Tags `v{package.json version}` on push to main; uses default GITHUB_TOKEN (cannot trigger release workflow) |
| `.github/workflows/release.yml` | On tag: `npm ci` + build; creates GitHub Release; supports `workflow_dispatch` |
| `.github/workflows/stale.yml` | Marks issues/PRs stale after 60 days inactivity; closes after 7 more days |
| `.github/workflows/labels.yml` | Syncs `.github/labels.yml` to repo labels on push/PR |
| `.nvmrc` | `22` |

---

## 6. Environment Variables (Required)

| Variable | Used by |
|----------|---------|
| `CLOUDINARY_CLOUD_NAME` | `cloudinary-init.ts` |
| `CLOUDINARY_API_KEY` | `cloudinary-init.ts` |
| `CLOUDINARY_API_SECRET` | `cloudinary-init.ts` |
| `CLOUDINARY_NOTIFICATION_URL` | `transform/route.ts` (eager_async notification; optional) |

---

## 7. Relationships

- `page.tsx` → fetches `/api/private/assets/list?max_results=` (inline-async pattern inside `useEffect` with `ignore` cleanup flag) → renders `AssetGallery`, `AssetUpload`, `Transformer`, `AssetOptimizer`, `AssetManagement`, `NoImageMessage`
- All API routes → `cloudinary-init.ts` (v2 instance) → Cloudinary REST API
- `cloudinary-client.ts` → `cloudinary-init.ts` + `cloudinary-types.ts`
- UI components → `src/lib/utils.ts` (`cn`, `formatFileSize`, `formatDate`)

---

## 8. Known Issues / Notes

| Item | Status |
|------|--------|
| `page.tsx` data fetching uses inline-async pattern (NOT `useCallback`-wrapped) | VERIFIED — required by `react-hooks/set-state-in-effect` rule |
| `SelectedAsset.tsx` is a named export (`export const SelectedAsset`) | VERIFIED — import as `{ SelectedAsset }` |
| `public/cloudinary-demo-app.txt` references cloud `dgis8gvg4` (dummy data) | VERIFIED |
| Both `.project-mcp.json` files declare project `docs-repo` | VERIFIED |
| `.vscode/launch.json`, `template.json` empty | VERIFIED |
| `.mcp-runtime.json` gitignored; `.opencode/` untracked (both LOCAL-ONLY) | VERIFIED |
| 10 lint warnings (unused imports/params) remain | VERIFIED — out of scope, non-blocking |
| Tag `v0.0.1` exists on origin (auto-tag workflow); `package.json` version is `0.1.0` | VERIFIED — auto-tag reads package version at tag time; changelog `[0.1.0]` section describes initial release |
| Auto-tag pushes with default `GITHUB_TOKEN`, which GitHub blocks from triggering the Release workflow | VERIFIED — use `workflow_dispatch` or a PAT secret (see issue #8) |
| No automated tests; validation = `npm run lint` + `npx tsc --noEmit` + `npm run build` | VERIFIED — documented in DEVELOPER_NOTES.md |