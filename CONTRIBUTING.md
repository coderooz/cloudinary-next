# Contributing to Cloudinary Next

First off, thanks for taking the time to contribute! 🎉

The following is a set of guidelines for contributing to **Cloudinary Next**. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Project Structure](#project-structure)
- [Code Style](#code-style)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Feature Requests](#feature-requests)

## Code of Conduct

This project and everyone participating in it is governed by the [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [contact@coderooz.in](mailto:contact@coderooz.in).

## Getting Started

1. Fork the repository.
2. Clone your fork:

   ```bash
   git clone https://github.com/<your-username>/cloudinary-next.git
   cd cloudinary-next
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env.local` file with your Cloudinary credentials:

   ```bash
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

5. Run the development server:

   ```bash
   npm run dev
   ```

## Development Workflow

1. Create a branch from `main`:

   ```bash
   git checkout -b feat/your-feature-name
   ```

2. Make your changes.
3. Run the validation commands before committing:

   ```bash
   npm run lint
   npm run build
   npx tsc --noEmit
   ```

   All three must pass with **zero errors** (warnings are acceptable but should be minimized).

4. Commit your changes following the [commit guidelines](#commit-guidelines).
5. Push and open a pull request.

## Project Structure

```
src/
├── app/
│   ├── api/private/assets/   # Cloudinary API route handlers
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page (client component)
├── components/
│   ├── cloudinary/           # Feature components (gallery, upload, transform, etc.)
│   └── ui/                   # shadcn/ui components
└── lib/
    ├── cloudinary/           # Cloudinary client, init, and types
    └── utils.ts              # Shared utilities
```

## Code Style

- **TypeScript strict mode** is enabled — no `any` unless absolutely necessary.
- **Server Components by default** in Next.js App Router; use `'use client'` only when interactivity is needed.
- Prefer `interface` over `type` for object shapes.
- Use `const` over `let`; never use `var`.
- Use optional chaining (`?.`) and nullish coalescing (`??`).
- Follow the existing patterns in neighboring files.

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description
```

Types: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `style`, `perf`.

Examples:

- `feat(upload): add drag-and-drop support`
- `fix(gallery): handle empty asset list`
- `docs(readme): update setup instructions`

Keep messages short (under 72 characters) and in the imperative mood.

## Pull Request Process

1. Ensure your PR description clearly describes the problem and solution.
2. Reference any related issues (e.g., `Fixes #12`).
3. Update the README or documentation if your change affects usage.
4. Ensure all validation commands pass (lint, build, typecheck).
5. You may be asked to make changes — please respond promptly.

## Reporting Bugs

Open an issue using the [Bug Report template](.github/ISSUES_TEMPLATE/bug_report.yml). Include:

- A clear, descriptive title.
- Steps to reproduce.
- Expected vs. actual behavior.
- Environment details (OS, browser, Node version).
- Screenshots if applicable.

## Feature Requests

Open an issue using the [Feature Request template](.github/ISSUES_TEMPLATE/feature_request.yml). Describe:

- The problem your feature solves.
- The solution you'd like.
- Any alternatives you've considered.

---

Built with ❤️ by [Coderooz](https://github.com/coderooz)