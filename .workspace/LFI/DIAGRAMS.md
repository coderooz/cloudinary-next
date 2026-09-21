# Logic Flow Diagrams — cloudinary-next

**LFI Version:** 2.0
**Date:** 2026-09-21
**Status:** VERIFIED

Stable node IDs referenced from `LOGIC_FLOW_INDEX.md`. Node IDs are stable and traceable to source files.

---

## D-01 — Home Page Load & Asset Listing (F-01)

```mermaid
flowchart TD
    A[GET /] --> B[page.tsx mount]
    B --> C[useEffect deps maxResults]
    C --> C1[let ignore = false]
    C1 --> C2[async loadAssets]
    C2 --> D[fetch /api/private/assets/list?max_results=N]
    D --> E[list/route.ts]
    E --> F[listAssets from cloudinary-client.ts]
    F --> G[cloudinary.api.resources]
    G --> H{success?}
    H -->|yes| I[if !ignore setImageData resources]
    H -->|no| J[console.error + if !ignore setLoading false]
    I --> K[if !ignore setLoading false]
    K --> L[cleanup: ignore = true]
    L --> M[render active tab]
    M --> N[gallery: AssetGallery]
    M --> O[upload: AssetUpload]
    M --> P[transform: Transformer / NoImageMessage]
    M --> Q[optimize: AssetOptimizer / NoImageMessage]
    M --> R[manage: AssetManagement]
    N --> S[selectImage -> setSelectedImage]
    S --> T[SelectedAsset panel]
```

---

## D-02 — API Route Pattern (F-02 … F-07)

```mermaid
flowchart TD
    A[HTTP request] --> B[route handler]
    B --> C{params valid?}
    C -->|no| D[400 JSON error]
    C -->|yes| E[cloudinary v2 call]
    E --> F{success?}
    F -->|yes| G[200 JSON response]
    F -->|no| H[500 JSON error]

    subgraph F-02 Upload
        U1[POST /upload] --> U2[formData: file, folder, publicId, tags]
        U2 --> U3[file.arrayBuffer -> base64 data URI]
        U3 --> U4[uploader.upload]
    end

    subgraph F-03 Delete
        D1[DELETE /delete] --> D2[publicId, resourceType]
        D2 --> D3[uploader.destroy]
    end

    subgraph F-04 Folders
        F1[GET/POST/DELETE /folders] --> F2[sub_folders / create_folder / delete_folder]
    end

    subgraph F-05 Search
        S1[GET /search] --> S2[search expression]
        S2 --> S3[cloudinary.search]
    end

    subgraph F-06 Tags
        T1[GET/POST/DELETE /tags] --> T2[api.tags / add_tag / remove_tag]
    end

    subgraph F-07 Transform
        X1[POST /transform] --> X2[publicId, transformations, resourceType]
        X2 --> X3[uploader.explicit + eager + eager_async]
        X3 --> X4[notification_url: CLOUDINARY_NOTIFICATION_URL]
    end
```

---

## D-03 — Client-Side UI Flows (F-08, F-09, F-10)

```mermaid
flowchart TD
    A[Transformer.tsx] --> B[sliders: brightness/contrast/saturation]
    B --> C[CSS filter string]
    C --> D[preview image style]

    E[AssetOptimizer.tsx] --> F[static optimization controls]
    F --> G[no API call]

    H[AssetManagement.tsx] --> I[search input]
    I --> J[client-side filter of imageData]
    J --> K[sort select]
    K --> L[re-render filtered list]
```

---

## D-04 — Shared Library Layer

```mermaid
flowchart LR
    A[cloudinary-init.ts] --> B[cloudinary v2 instance]
    B --> C[cloudinary-client.ts]
    C --> D[uploadAsset]
    C --> E[deleteAsset]
    C --> F[bulkDeleteAssets]
    C --> G[listAssets]
    C --> H[getAssetDetails]
    C --> I[renameAsset]
    C --> J[transformAsset]
    C --> K[tagAssets]
    C --> L[generateArchive]
    C --> M[getFolders / createFolder]
    C --> N[getUsage]
    C --> O[getOptimizedUrl]
    D --> P[cloudinary-types.ts AssetData]
    G --> P
    J --> P
```