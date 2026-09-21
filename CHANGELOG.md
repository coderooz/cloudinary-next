# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `LICENSE` (MIT), `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `.editorconfig`, `.gitattributes`, `.nvmrc`, root `AGENTS.md`
- GitHub issue templates (bug report + feature request) and CI workflow
- `CHANGELOG.md` (this file)

### Changed

- Upgraded to Next.js 16 (App Router) with React 19 and Cloudinary SDK v2
- Replaced `next lint` with flat-config ESLint (`eslint.config.mjs`)
- Removed NextAuth.js and the `rop.tsx` alternate page
- Rewrote `README.md` for the current stack and setup
- Updated `SECURITY.md` to remove stale NextAuth/`uaif.json` references

### Fixed

- 11 `no-explicit-any` lint errors across API routes, components, and lib
- `react-hooks/set-state-in-effect` lint error in `src/app/page.tsx` (data fetching moved to the documented inline-async pattern with an `ignore` cleanup flag)

## [0.1.0] - 2026-09-21

### Added

- Initial Cloudinary media management demo: gallery, upload, transform, optimize, and manage tabs
- Cloudinary API route handlers under `/api/private/assets/`
- Cloudinary client library (`cloudinary-client.ts`, `cloudinary-init.ts`, `cloudinary-types.ts`)
- shadcn/ui component set and Tailwind CSS styling
- Framer Motion animations and responsive layout

[Unreleased]: https://github.com/coderooz/cloudinary-next/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/coderooz/cloudinary-next/releases/tag/v0.1.0