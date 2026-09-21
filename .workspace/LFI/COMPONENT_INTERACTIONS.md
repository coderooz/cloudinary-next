# Component Interactions — cloudinary-next

**LFI Version:** 2.0
**Date:** 2026-09-21
**Status:** VERIFIED

---

## 1. Page → Component Map

### 1.1 `src/app/page.tsx` (Home, routed)

| Component | Import style | Props passed | Interaction |
|-----------|--------------|--------------|-------------|
| `AssetGallery` | default | `imageData`, `isLoading`, `selectImage`, `maxResults`, `setMaxResult` | Renders grid; click → `selectImage(asset)`; maxResults select → `setMaxResult` |
| `AssetUpload` | default | — | Upload UI (drag-drop) |
| `Transformer` | default | `transformImage` | Sliders → CSS filter preview |
| `AssetOptimizer` | default | `optimizerImage` | Optimization UI |
| `AssetManagement` | default | `imageData` | Search + sort (client-side) |
| `NoImageMessage` | default | — | Shown when no image selected for transform/optimize |

---

## 2. Component → API Map

| Component | API call | Method |
|-----------|----------|--------|
| `page.tsx` | `/api/private/assets/list?max_results=N` | GET (useEffect, inline-async) |
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
  selectedImage: AssetData | null   ← set by AssetGallery selectImage
  imagesData: AssetData[]           ← set by list API response
  isLoading: boolean                ← toggled around fetch
  maxResults: number | string       ← drives re-fetch (useEffect deps)

handleMaxResultsChange(value):
  setLoading(true)
  setMaxResults(value)

SelectedAsset:
  onRemove → setSelectedImage(null)
  onDelete → DELETE /api/private/assets/delete → refresh list
```

---

## 5. Shared UI Components (`src/components/ui/`)

shadcn/ui primitives used across cloudinary components: `badge`, `button`, `card`, `dialog`, `input`, `label`, `pagination`, `popover`, `select`, `separator`, `slider`, `sonner`, `switch`, `tabs`. Icons via `lucide-react`; animation via `framer-motion`.