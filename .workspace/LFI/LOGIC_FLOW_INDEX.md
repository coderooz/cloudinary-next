# Logic Flow Index (LFI) — cloudinary-next

**LFI Version:** 1.0
**Date:** 2026-09-21
**Status:** VERIFIED (all flows confirmed against source)
**Companion:** PRI at `.workspace/PRI/PROJECT_REFERENCE_INDEX.md` (structural map — never combined)

---

## 1. Purpose

This LFI is the behavioral map of the `cloudinary-next` application. It documents what happens at runtime: entry points, data flow, execution paths, component interactions, and error handling. Node IDs used here are stable and referenced in `DIAGRAMS.md`.

---

## 2. Flow Index

| Flow ID | Flow Name | Entry Point | Diagram | Detail |
|---------|-----------|-------------|---------|--------|
| F-01 | Home page load & asset listing | `src/app/page.tsx` | D-01 | Fetch `/api/private/assets/list` → render gallery |
| F-02 | Asset upload | `src/app/api/private/assets/upload/route.ts` | D-02 | formData → base64 → `uploader.upload` |
| F-03 | Asset delete | `src/app/api/private/assets/delete/route.ts` | D-02 | `uploader.destroy` by publicId |
| F-04 | Folder management | `src/app/api/private/assets/folders/route.ts` | D-02 | sub_folders / create_folder / delete_folder |
| F-05 | Asset search | `src/app/api/private/assets/search/route.ts` | D-02 | Cloudinary search expression |
| F-06 | Tag management | `src/app/api/private/assets/tags/route.ts` | D-02 | api.tags / add_tag / remove_tag |
| F-07 | Asset transformation | `src/app/api/private/assets/transform/route.ts` | D-02 | `uploader.explicit` + eager transformations |
| F-08 | Client-side transform preview | `src/components/cloudinary/Transformer.tsx` | D-03 | CSS filter sliders (no API call) |
| F-09 | Client-side optimization UI | `src/components/cloudinary/AssetOptimizer.tsx` | D-03 | Static UI (no API call) |
| F-10 | Client-side management UI | `src/components/cloudinary/AssetManagement.tsx` | D-03 | Search + sort (client-side filter) |
| F-11 | Alternate page (unrouted) | `src/app/rop.tsx` | D-04 | "Cloudinary Media Manager" — NOT routed, broken imports |

---

## 3. Execution Paths

### 3.1 Server-side API paths (all share the same shape)

```
HTTP request
  → route handler (src/app/api/private/assets/*/route.ts)
  → validate params (400 on missing)
  → cloudinary v2 call (cloudinary-init.ts)
  → JSON response (200) | catch → 500 JSON
```

### 3.2 Client-side page path

```
GET / (src/app/page.tsx)
  → useEffect: fetch('/api/private/assets/list?max_results=' + maxResults)
  → setImagesData / setLoading
  → render active tab:
      gallery → AssetGallery (selectImage → setSelectedImage)
      upload  → AssetUpload
      transform → Transformer (needs selectedImage else NoImageMessage)
      optimize  → AssetOptimizer (needs selectedImage else NoImageMessage)
      manage    → AssetManagement (imageData prop)
  → SelectedAsset panel (onRemove clears selection; onDelete calls delete API)
```

---

## 4. Data Flow

### 4.1 AssetData shape (from `cloudinary-types.ts`)

```
AssetData {
  asset_id, public_id, version, resource_type, id, type,
  url, secure_url, display_name, format, bytes, asset_folder,
  width, height, tags?, created_at, last_updated
}
```

### 4.2 List flow

```
page.tsx → GET /api/private/assets/list?max_results=N
  → listAssets({ folder?, resource_type?, max_results, next_cursor? })
  → cloudinary.api.resources(...)
  → { resources: AssetData[], next_cursor? }
```

### 4.3 Upload flow

```
AssetUpload (client) → POST /api/private/assets/upload (FormData: file, folder?, publicId?, tags?)
  → route reads formData → file.arrayBuffer() → base64 data URI
  → uploadAsset({ file: dataUri, folder: 'nextjs-demo' | provided, publicId?, tags? })
  → cloudinary.uploader.upload(...)
  → { asset: AssetData }
```

### 4.4 Transform flow

```
Transformer (client) → POST /api/private/assets/transform
  → { publicId, transformations, resourceType? }
  → transformAsset → cloudinary.uploader.explicit(publicId, { resource_type, eager: transformations, eager_async, notification_url: CLOUDINARY_NOTIFICATION_URL })
  → { result }
```

---

## 5. Entry Points & Triggers

| Trigger | Flow | Notes |
|---------|------|-------|
| Page load `/` | F-01 | useEffect fetch |
| maxResults change | F-01 | re-fetch |
| Tab switch | F-01 | client-side state only |
| Upload form submit | F-02 | via AssetUpload |
| Delete button | F-03 | via SelectedAsset onDelete |
| Folder create/delete | F-04 | API only |
| Search query | F-05 | API only |
| Tag add/remove | F-06 | API only |
| Transform submit | F-07 | via Transformer |
| Slider drag | F-08 | CSS filter, no network |

---

## 6. Error Handling & Edge Cases

See `ERROR_PATHS.md` for the full matrix. Summary:

- All API routes: missing params → 400; Cloudinary failure → 500 `{ error: 'Failed to ...' }`.
- Client: fetch failures logged to console; loading state via `loading` boolean.
- No selected image → `NoImageMessage` shown for transform/optimize tabs.
- Empty gallery → `NoImageMessage` shown.

---

## 7. Known Behavioral Issues (VERIFIED)

| Issue | Location | Impact |
|-------|----------|--------|
| `rop.tsx` imports `ImageUploader` (named) from AssetUpload (default export) | `src/app/rop.tsx:5` | Compile error — file unrouted |
| `rop.tsx` imports `AssetGallery` (named) from AssetGallery (default export) | `src/app/rop.tsx:6` | Compile error |
| `rop.tsx` `results` param implicitly `any` | `src/app/rop.tsx:92` | TS strict error |
| `AssetManagement.tsx` passes `ChangeEvent` to `SetStateAction<string>` | `src/components/cloudinary/AssetManagement.tsx:38` | TS error |