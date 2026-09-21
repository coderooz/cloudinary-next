# Component Interactions — cloudinary-next

**LFI Version:** 1.0
**Date:** 2026-09-21
**Status:** VERIFIED

---

## 1. Page → Component Map

### 1.1 `src/app/page.tsx` (Home, routed)

| Component | Import style | Props passed | Interaction |
|-----------|--------------|--------------|-------------|
| `AssetGallery` | default | `imagesData`, `selectedImage`, `onSelectImage` | Renders grid; click → `onSelectImage(asset)` |
| `AssetUpload` | default | — | Upload UI (drag-drop) |
| `Transformer` | default | `image`, `onTransform` | Sliders → CSS filter preview; submit → `onTransform` |
| `AssetOptimizer` | default | `image`, `onOptimize` | Optimization UI |
| `AssetManagement` | default | `imageData` | Search + sort (client-side) |
| `NoImageMessage` | default | — | Shown when no image selected for transform/optimize |
| `SelectedAsset` | default | `asset`, `onRemove`, `onDelete` | Detail panel; remove clears selection; delete calls API |

### 1.2 `src/app/rop.tsx` (Alternate, NOT routed)

| Component | Import style | Status |
|-----------|--------------|--------|
| `AssetGallery` | **named** | BROKEN — component is default export |
| `ImageUploader` (from AssetUpload) | **named** | BROKEN — component is default export |
| `SelectedAsset` | default | OK |

---

## 2. Component → API Map

| Component | API call | Method |
|-----------|----------|--------|
| `page.tsx` | `/api/private/assets/list?max_results=N` | GET (useEffect) |
| `AssetUpload` | `/api/private/assets/upload` | POST (FormData) |
| `SelectedAsset` (onDelete) | `/api/private/assets/delete` | DELETE |
| `Transformer` (onTransform) | `/api/private/assets/transform` | POST |
| `AssetManagement` | none (client-side filter) | — |
| `AssetOptimizer` | none (static UI) | — |

---

## 3. Component → Library Map

| Component | Library import | Purpose |
|-----------|----------------|---------|
| All UI components | `@/lib/utils` (`cn`) | Class merging |
| `SelectedAsset` | `@/lib/utils` (`formatFileSize`, `formatDate`) | Display formatting |
| `AssetGallery` | `@/lib/utils` (`formatFileSize`, `formatDate`) | Display formatting |
| `AssetManagement` | `@/lib/utils` (`formatFileSize`, `formatDate`) | Display formatting |

---

## 4. State Flow

```
page.tsx state:
  selectedImage: AssetData | null   ← set by AssetGallery onSelectImage
  imagesData: AssetData[]           ← set by list API response
  loading: boolean                  ← toggled around fetch
  maxResults: number                ← drives re-fetch

SelectedAsset:
  onRemove → setSelectedImage(null)
  onDelete → DELETE /api/private/assets/delete → refresh list
```

---

## 5. Shared UI Components (`src/components/ui/`)

shadcn/ui primitives used across cloudinary components: `badge`, `button`, `card`, `dialog`, `input`, `label`, `pagination`, `popover`, `select`, `separator`, `slider`, `sonner`, `switch`, `tabs`. Icons via `lucide-react`; animation via `framer-motion`.