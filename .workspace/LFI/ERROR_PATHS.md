# Error Paths & Edge Cases — cloudinary-next

**LFI Version:** 2.0
**Date:** 2026-09-21
**Status:** VERIFIED

---

## 1. API Error Matrix

All API routes follow the same error contract: `{ error: string }` with appropriate status code.

| Route | Missing param → 400 | Cloudinary failure → 500 |
|-------|---------------------|--------------------------|
| `list` | `folder`/`resource_type`/`max_results`/`next_cursor` optional — no 400 path | `Failed to list resources` |
| `upload` | `file` missing → 400 `No file provided` | `Failed to upload file` |
| `delete` | `publicId` missing → 400 `No public_id provided` | `Failed to delete resource` |
| `folders` | `folderPath` missing (POST/DELETE) → 400 `No folder path provided` | `Failed to list/create/delete folders` |
| `search` | `query` optional — no 400 path | `Failed to search resources` |
| `tags` | `publicIds`/`tags` missing (POST/DELETE) → 400 `Missing required parameters` | `Failed to add/remove tags` |
| `transform` | `publicId`/`transformations` missing → 400 `Missing required parameters` | `Failed to transform resource` |

---

## 2. Client-Side Edge Cases

| Edge case | Handling |
|-----------|----------|
| No images in gallery | `NoImageMessage` rendered |
| No image selected for transform/optimize | `NoImageMessage` rendered |
| Fetch in progress | `isLoading` state (spinner/skeleton) |
| Fetch failure | Error logged to console; `imagesData` stays empty; `isLoading` set false |
| maxResults change | Re-fetch triggered via useEffect dependency; `handleMaxResultsChange` sets loading first |
| Stale response after maxResults change | `ignore` cleanup flag prevents setState after unmount/re-run |

---

## 3. Known Type/Compile State (VERIFIED via lint + tsc)

| Item | Status |
|------|--------|
| `npm run lint` | 0 errors, 10 warnings (unused imports/params — non-blocking) |
| `npx tsc --noEmit` | Clean |
| `npm run build` | Passes (Next.js 16.3.5, Turbopack) |

Warnings (out of scope): `tags/route.ts:6` unused `request`; `AssetGallery.tsx` unused `useState`/`useEffect`/`selectedImage`; `AssetOptimizer.tsx` unused `CardFooter`; `AssetUpload.tsx` unused `useState`/`Image`; `NoImageMessage.tsx` unused `Button`; `Transformer.tsx` unused `CardFooter`; `src/lib/utils.ts:108` unused `e`.

---

## 4. Security / Hygiene Edge Cases

| Item | Status |
|------|--------|
| Cloudinary credentials | Env vars only (`CLOUDINARY_*`); `.env*` gitignored |
| `/api/private/` routes | Server-side Admin API calls — protect with auth/rate limiting before public deploy |
| `CLOUDINARY_NOTIFICATION_URL` | Read from env in transform route (optional) |
| `.mcp-runtime.json` | Gitignored |
| `.workspace/` (PRI/LFI/Reports) | Gitignored; committed explicitly with `git add -f` |