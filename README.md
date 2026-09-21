# Cloudinary Next

A modern Next.js 16 demo application showcasing Cloudinary media management — gallery, upload, transform, optimize, and manage — built with React 19, TypeScript (strict), Tailwind CSS v4, shadcn/ui, and Framer Motion.

## Features

- 🖼️ Complete Cloudinary API integration (list, upload, delete, folders, search, tags, transform)
- 🚀 Next.js 16 App Router with Turbopack
- 💅 Beautiful UI with shadcn/ui components
- ✨ Smooth animations with Framer Motion
- 📱 Fully responsive design
- 🌗 Light/dark mode support
- 🧩 Modular and extensible architecture

## Getting Started

### Prerequisites

- Node.js 22 (see `.nvmrc`)
- npm
- A Cloudinary account

### Installation

1. Clone the repository:

```bash
git clone https://github.com/coderooz/cloudinary-next.git
cd cloudinary-next
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Copy `.env.example` to `.env.local` and fill in your Cloudinary credentials:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Commands

```bash
npm run dev        # start dev server (Turbopack)
npm run build      # production build
npm run start      # serve production build
npm run lint       # ESLint (flat config)
npx tsc --noEmit   # typecheck
```

## Project Structure

```
src/
├── app/
│   ├── api/private/assets/   # Cloudinary API route handlers
│   │   ├── delete/route.ts
│   │   ├── folders/route.ts
│   │   ├── list/route.ts
│   │   ├── search/route.ts
│   │   ├── tags/route.ts
│   │   ├── transform/route.ts
│   │   └── upload/route.ts
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page (client component)
├── components/
│   ├── cloudinary/           # Feature components
│   │   ├── AssetGallery.tsx
│   │   ├── AssetManagement.tsx
│   │   ├── AssetOptimizer.tsx
│   │   ├── AssetUpload.tsx
│   │   ├── NoImageMessage.tsx
│   │   ├── SelectedAsset.tsx
│   │   └── Transformer.tsx
│   └── ui/                   # shadcn/ui primitives
└── lib/
    ├── cloudinary/
    │   ├── cloudinary-client.ts
    │   ├── cloudinary-init.ts
    │   └── cloudinary-types.ts
    └── utils.ts
```

## API Documentation

The project implements a comprehensive API for interacting with Cloudinary:

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `POST` | `/api/private/assets/upload` | Upload a file (multipart form: `file`, optional `folder`, `publicId`, `tags`) |
| `DELETE` | `/api/private/assets/delete` | Delete an asset (`publicId`, optional `resourceType`) |
| `GET` | `/api/private/assets/list` | List assets (`folder`, `resource_type`, `max_results`, `next_cursor`) |
| `GET` | `/api/private/assets/search` | Search assets (`query`, `resource_type`, `max_results`, `next_cursor`) |
| `GET`/`POST`/`DELETE` | `/api/private/assets/folders` | List, create, or delete folders (`path` / `folderPath`) |
| `GET`/`POST`/`DELETE` | `/api/private/assets/tags` | List, add, or remove tags (`publicIds`, `tags`) |
| `POST` | `/api/private/assets/transform` | Apply transformations (`publicId`, `transformations`) |

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines, and review the [Code of Conduct](CODE_OF_CONDUCT.md).

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Cloudinary](https://cloudinary.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/)

---

Built with ❤️ by [Coderooz](https://github.com/coderooz)