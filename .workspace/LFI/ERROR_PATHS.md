# Error Paths & Edge Cases — cloudinary-next

**LFI Version:** 1.0
**Date:** 2026-09-21
**Status:** VERIFIED

---

## 1. API Error Matrix

All API routes follow the same error contract: `{ error: string }` with appropriate status code.

| Route | Missing param → 400 | Cloudinary failure → 500 |
|-------|---------------------|--------------------------|
| `list` | `folder`/`resource_type`/`max_results`/`next_cursor` optional — no 400 path | `Failed to list assets` |
| `upload` | `file` missing → 400 `File is required` | `Failed to upload asset` |
| `delete` | `publicId` missing → 400 `Public ID is required` | `Failed to delete asset` |
| `folders` | `folder` missing (POST/DELETE) → 400 | `Failed to manage folders` |
| `search` | `query` missing → 400 `Search query is required` | `Failed to search assets` |
| `tags` | `tag` missing (POST/DELETE) → 400 | `Failed to manage tags` |
| `transform` | `publicId`/`transformations` missing → 400 | `Failed to transform asset` |

---

## 2. Client-Side Edge Cases

| Edge case | Handling |
|-----------|----------|
| No images in gallery | `NoImageMessage` rendered |
| No image selected for transform/optimize | `NoImageMessage` rendered |
| Fetch in progress | `loading` state (spinner/skeleton) |
| Fetch failure | Error logged to console; `imagesData` stays empty |
| maxResults change | Re-fetch triggered via useEffect dependency |

---

## 3. Known Type/Compile Errors (VERIFIED via LSP)

| File:Line | Error | Severity |
|-----------|-------|----------|
| `src/app/rop.tsx:5` | `Module "@/components/cloudinary/AssetUpload" has no exported member 'ImageUploader'` | ERROR |
| `src/app/rop.tsx:6` | `Module "@/components/cloudinary/AssetGallery" has no exported member 'AssetGallery'` | ERROR |
| `src/app/rop.tsx:92` | `Parameter 'results' implicitly has an 'any' type` | ERROR |
| `src/components/cloudinary/AssetManagement.tsx:38` | `Argument of type 'ChangeEvent<HTMLInputElement, HTMLInputElement>' is not assignable to parameter of type 'SetStateAction<string>'` | ERROR |

**Impact:** `rop.tsx` is not routed (no `page.tsx`), so these errors do not block the running app, but they fail `npm run build` / `npm run lint` type checks. `AssetManagement.tsx:38` is in the routed `manage` tab and would fail a production build.

---

## 4. Security / Hygiene Edge Cases

| Item | Status |
|------|--------|
| `uaif.json` hardcoded placeholder credentials | Must be replaced with env-var references before commit |
| `.mcp-runtime.json` not gitignored | Add to `.gitignore` |
| `CLOUDINARY_API_SECRET` | Only referenced via env var — never hardcoded in source |
| `CLOUDINARY_NOTIFICATION_URL` | Read from env in transform route |