# Cloudinary NextJs

A modern Next.js 15 application showcasing seamless integration with Cloudinary for powerful media management, featuring a beautiful UI built with Shadcn components and fluid animations.

![Cloudinary NextJs Demo](./public/demo-screenshot.png)

## Features

- 🖼️ Complete Cloudinary API integration
- 🚀 Next.js 15 App Router
- 🔒 Protected API routes with NextAuth.js
- 💅 Beautiful UI with Shadcn UI components
- ✨ Smooth animations with Framer Motion
- 📱 Fully responsive design
- 🌗 Light/dark mode support
- 🧩 Modular and extensible architecture

## Cloudinary Features

- Image/video uploads with drag & drop
- Asset gallery with filtering and sorting
- Image transformations and editing
- Asset tagging and organization
- Bulk operations (delete, tag, download)
- Image optimization and responsive delivery

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn
- Cloudinary account

### Installation

1. Clone the repository:

```bash
git clone https://github.com/coderooz/Cloudinary-NextJs.git
cd Cloudinary-NextJs
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory with the following variables:

```
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Auth Provider (GitHub example)
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
cloudinary-nextjs/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── gallery/
│   │   └── settings/
│   ├── api/
│   │   ├── auth/
│   │   └── private/
│   │       └── assets/
│   │           └── [actionName]/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── cloudinary/
│   │   ├── AssetGallery.tsx
│   │   ├── ImageUploader.tsx
│   │   └── ...
│   ├── layout/
│   ├── ui/
│   └── animations/
├── lib/
│   ├── cloudinary/
│   ├── auth/
│   └── utils/
├── public/
├── styles/
├── types/
├── .env.example
├── .gitignore
├── next.config.js
├── package.json
├── README.md
└── tsconfig.json
```

## Usage Examples

### Basic Image Upload

```tsx
import { ImageUploader } from "@/components/cloudinary/ImageUploader";

export default function UploadPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Upload Images</h1>
      <ImageUploader folder="my-uploads" />
    </div>
  );
}
```

### Display Image Gallery

```tsx
import { AssetGallery } from "@/components/cloudinary/AssetGallery";

export default function GalleryPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Image Gallery</h1>
      <AssetGallery folder="my-uploads" />
    </div>
  );
}
```

## API Documentation

The project implements a comprehensive API for interacting with Cloudinary:

- `POST /api/private/assets/upload` - Upload images to Cloudinary
- `POST /api/private/assets/delete` - Delete images from Cloudinary
- `GET /api/private/assets/list` - List images from a folder
- `GET /api/private/assets/details` - Get details of a specific image
- `POST /api/private/assets/rename` - Rename an image
- `POST /api/private/assets/transform` - Apply transformations to an image
- `POST /api/private/assets/tag` - Tag images
- `POST /api/private/assets/generateArchive` - Generate a ZIP archive of images

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Cloudinary](https://cloudinary.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [NextAuth.js](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)

---

Built with ❤️ by [Coderooz](https://github.com/coderooz)