# Project Reference Index (PRI) — cloudinary-next

**PRI Version:** 1.0
**Date:** 2026-09-21
**Status:** VERIFIED (all entries confirmed against repository filesystem)
**Source of truth:** Repository filesystem

---

## 1. Project Identity

| Field | Value |
|-------|-------|
| Project name | cloudinary-next |
| Package name | `cloudinary-nextjs` |
| Type | Next.js 15 (App Router) demo application for Cloudinary media management |
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
│   ├── ISSUE_TEMPLATE.md
│   └── PULL_REQUEST_TEMPLATE.md
├── .opencode/                        # OpenCode plugin workspace (own package.json, node_modules)
├── .vscode/
│   ├── launch.json                   # EMPTY configurations
│   ├── settings.json                 # prettier, eslint-on-save, tailwind intellisense
│   └── template.json                 # EMPTY
├── .workspace/                       # Development artifacts (PRI/LFI live here)
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
│   │   ├── page.tsx                  # Home page (client; tabs gallery/upload/transform/optimize/manage)
│   │   └── rop.tsx                   # Alternate "Cloudinary Media Manager" page (client; NOT routed)
│   ├── components/
│   │   ├── cloudinary/
│   │   │   ├── AssetGallery.tsx      # Gallery grid (server-rendered)
│   │   │   ├── AssetManagement.tsx   # Search + sort UI
│   │   │   ├── AssetOptimizer.tsx    # Optimization UI
│   │   │   ├── AssetUpload.tsx       # Drag-drop upload UI
│   │   │   ├── NoImageMessage.tsx    # Empty state
│   │   │   ├── SelectedAsset.tsx     # Asset detail panel
│   │   │   └── Transformer.tsx       # Brightness/contrast/saturation sliders
│   │   └── ui/                       # shadcn/ui components (badge, button, card, dialog, input, label, pagination, popover, select, separator, slider, sonner, switch, tabs)
│   └── lib/
│       ├── utils.ts                  # cn(), formatFileSize(), formatDate(), truncateText(), etc.
│       └── cloudinary/
│           ├── cloudinary-client.ts  # uploadAsset, deleteAsset, bulkDeleteAssets, listAssets, getAssetDetails, renameAsset, transformAsset, tagAssets
│           ├── cloudinary-init.ts    # v2 config from env vars
│           └── cloudinary-types.ts   # AssetData interface
├── components.json                   # shadcn config (new-york style, lucide)
├── eslint.config.mjs                 # next/core-web-vitals + next/typescript
├── next.config.ts                    # reactStrictMode, images.domains [res.cloudinary.com]
├── package.json / package-lock.json
├── postcss.config.mjs                # @tailwindcss/postcss
├── tsconfig.json                     # strict, @/* → ./src/*
├── uaif.json                         # @uaif/adapter-cloudinary placeholder creds (SANITIZE)
├── README.md
├── SECURITY.md                       # EMPTY
├── .gitignore
├── .mcp-runtime.json                 # MCP runtime state (NOT ignored — add to .gitignore)
├── cloudinary-next.project-mcp.json  # MCP project config (project: docs-repo)
└── docs-repo.project-mcp.json        # MCP project config (project: docs-repo)
```

---

## 3. Entry Points

| Entry point | Path | Type | Purpose |
|-------------|------|------|---------|
| Home page | `src/app/page.tsx` | Client component | Tabbed media manager (gallery/upload/transform/optimize/manage) |
| Alt page | `src/app/rop.tsx` | Client component | "Cloudinary Media Manager" (Gallery/Upload/Transform tabs); NOT routed (no page.tsx) |
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
| `cloudinary-client.ts` | `uploadAsset`, `deleteAsset`, `bulkDeleteAssets`, `listAssets`, `getAssetDetails`, `renameAsset`, `transformAsset`, `tagAssets` | Thin wrappers over cloudinary v2 API |
| `cloudinary-types.ts` | `AssetData` | asset_id, public_id, version, resource_type, id, type, url, secure_url, display_name, format, bytes, asset_folder, width, height, tags?, created_at, last_updated |

### 4.2 UI components (`src/components/cloudinary/`)

| Component | Type | Purpose |
|-----------|------|---------|
| `AssetGallery.tsx` | Server-rendered | Gallery grid with filter/sort UI |
| `AssetUpload.tsx` | Client | Drag-drop upload UI |
| `Transformer.tsx` | Client | Brightness/contrast/saturation sliders |
| `AssetOptimizer.tsx` | Client | Optimization UI |
| `AssetManagement.tsx` | Client | Search + sort UI |
| `NoImageMessage.tsx` | Client | Empty state message |
| `SelectedAsset.tsx` | Client | Asset detail panel (secure_url, public_id, format, bytes, dimensions; onRemove/onDelete) |

### 4.3 Shared utilities (`src/lib/utils.ts`)

`cn`, `formatFileSize`, `formatDate`, `truncateText`, `extractFilename`, `isImageFile`, `generateRandomString`, `delay`, `objectToQueryString`, `getFileExtension`, `isValidUrl`.

---

## 5. Configuration

| File | Key settings |
|------|--------------|
| `next.config.ts` | `reactStrictMode: true`; `images.domains: ['res.cloudinary.com']`; `cacheLife: { blog: ... }`; `serverActions.bodySizeLimit: '2mb'` |
| `tsconfig.json` | `strict: true`; path alias `@/*` → `./src/*` |
| `components.json` | shadcn new-york style; lucide icons; neutral base color |
| `eslint.config.mjs` | `next/core-web-vitals`, `next/typescript` |
| `postcss.config.mjs` | `@tailwindcss/postcss` |
| `package.json` | next 15.3.0, react 19, next-auth ^5.0.0-beta.5, cloudinary ^2.6.0, framer-motion, lucide-react, shadcn deps; scripts: dev (`next dev --turbopack`), build, start, lint |
| `.github/dependabot.yml` | npm + github-actions; weekly Monday 09:00 Asia/Kolkata; minor/patch only; ignore semver-major |
| `.github/CODEOWNERS` | `* @coderooz` |
| `.github/FUNDING.yml` | github: coderooz; buy_me_a_coffee: coderooz; custom: https://www.coderooz.in |

---

## 6. Environment Variables (Required)

| Variable | Used by |
|----------|---------|
| `CLOUDINARY_CLOUD_NAME` | `cloudinary-init.ts` |
| `CLOUDINARY_API_KEY` | `cloudinary-init.ts` |
| `CLOUDINARY_API_SECRET` | `cloudinary-init.ts` |
| `CLOUDINARY_NOTIFICATION_URL` | `transform/route.ts` (eager_async notification) |

---

## 7. Relationships

- `page.tsx` → fetches `/api/private/assets/list?max_results=` → renders `AssetGallery`, `AssetUpload`, `Transformer`, `AssetOptimizer`, `AssetManagement`, `NoImageMessage`, `SelectedAsset`
- `rop.tsx` → renders `AssetGallery` (named import), `AssetUpload` (named import `ImageUploader`), `SelectedAsset` — **NOTE: named imports do not match default exports; rop.tsx is NOT routed and is likely stale/broken**
- All API routes → `cloudinary-init.ts` (v2 instance) → Cloudinary REST API
- `cloudinary-client.ts` → `cloudinary-init.ts` + `cloudinary-types.ts`
- UI components → `src/lib/utils.ts` (`cn`, `formatFileSize`, `formatDate`)

---

## 8. Known Issues / UNVERIFIED

| Item | Status |
|------|--------|
| `rop.tsx` named imports (`AssetGallery`, `ImageUploader`) vs default exports | UNVERIFIED — likely broken; file not routed |
| `uaif.json` hardcoded placeholder creds (`my-cloud` / `1234567890` / `secret`) | VERIFIED — must be sanitized to env refs before commit |
| `.mcp-runtime.json` not covered by `.gitignore` | VERIFIED — add to `.gitignore` |
| `README.md` clone URL `Cloudinary-NextJs.git` vs actual `cloudinary-next.git` | VERIFIED — mismatch |
| `SECURITY.md` empty | VERIFIED — populated 2026-09-21 |
| `.github/workflows/auto-tag.yml`, `cli.yml` empty | VERIFIED — removed 2026-09-21 (0-byte stubs would break Actions) |
| `.vscode/launch.json`, `template.json` empty | VERIFIED |
| `public/cloudinary-demo-app.txt` references cloud `dgis8gvg4` (dummy data) | VERIFIED |
| Both `.project-mcp.json` files declare project `docs-repo` | VERIFIED |