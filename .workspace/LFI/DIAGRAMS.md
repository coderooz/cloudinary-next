# Logic Flow Diagrams — cloudinary-next

**LFI Version:** 1.0
**Date:** 2026-09-21
**Status:** VERIFIED

Stable node IDs referenced from `LOGIC_FLOW_INDEX.md`. Node IDs are stable and traceable to source files.

---

## D-01 — Home Page Load & Asset Listing (F-01)

```mermaid
flowchart TD
    A[GET /] --> B[page.tsx mount]
    B --> C[useEffect: fetch /api/private/assets/list?max_results=N]
    C --> D[list/route.ts]
    D --> E[listAssets from cloudinary-client.ts]
    E --> F[cloudinary.api.resources]
    F --> G{success?}
    G -->|yes| H[setImagesData resources]
    G -->|no| I[500 JSON error]
    H --> J[render active tab]
    J --> K[gallery: AssetGallery]
    J --> L[upload: AssetUpload]
    J --> M[transform: Transformer / NoImageMessage]
    J --> N[optimize: AssetOptimizer / NoImageMessage]
    J --> O[manage: AssetManagement]
    K --> P[selectImage -> setSelectedImage]
    P --> Q[SelectedAsset panel]
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

## D-04 — Alternate Page (F-11, UNROUTED)

```mermaid
flowchart TD
    A[rop.tsx - Cloudinary Media Manager] --> B[Gallery tab]
    A --> C[Upload tab]
    A --> D[Transform tab]
    B --> E[AssetGallery - BROKEN named import]
    C --> F[ImageUploader - BROKEN named import]
    D --> G[SelectedAsset]
    E -.->|compile error| H[not routed - no page.tsx]
```

---

## D-05 — Shared Library Layer

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
    D --> L[cloudinary-types.ts AssetData]
    G --> L
    J --> L
```