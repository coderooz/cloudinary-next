# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `LICENSE` (MIT), `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `SECURITY.md`, `.editorconfig`, `.gitattributes`, `.nvmrc`, root `AGENTS.md`
- GitHub community config: 6 issue templates (bug report, feature request, documentation, question, security report, config), `PULL_REQUEST_TEMPLATE.md`, `CODEOWNERS`, `FUNDING.yml`, `dependabot.yml`
- GitHub automation: `labels.yml` (22 labels) + Sync Labels workflow, CI workflow (lint + typecheck + build), Auto Tag workflow, Release workflow (with `workflow_dispatch`), Close Stale workflow
- `CHANGELOG.md` (this file), `DEVELOPER_NOTES.md`, `.env.example`
- Tag `v0.0.1` on origin (created by the Auto Tag workflow)

### Changed

- Upgraded to Next.js 16 (App Router) with React 19 and Cloudinary SDK v2
- Replaced `next lint` with flat-config ESLint (`eslint.config.mjs`)
- Removed NextAuth.js, the `rop.tsx` alternate page, and the placeholder `uaif.json`
- Rewrote `README.md` for the current stack and setup
- Updated `SECURITY.md` to remove stale NextAuth/`uaif.json` references
- Refreshed PRI/LFI reference indexes (`.workspace/`, committed explicitly)

### Fixed

- 11 `no-explicit-any` lint errors across API routes, components, and lib
- `react-hooks/set-state-in-effect` lint error in `src/app/page.tsx` (data fetching moved to the documented inline-async pattern with an `ignore` cleanup flag)

### Known limitations

- The Auto Tag workflow pushes tags with the default `GITHUB_TOKEN`, which GitHub blocks from triggering the Release workflow. Use `workflow_dispatch` or a PAT secret (see issue #8).

## [0.1.0] - 2026-09-21

### Added

- Initial Cloudinary media management demo: gallery, upload, transform, optimize, and manage tabs
- Cloudinary API route handlers under `/api/private/assets/`
- Cloudinary client library (`cloudinary-client.ts`, `cloudinary-init.ts`, `cloudinary-types.ts`)
- shadcn/ui component set and Tailwind CSS styling
- Framer Motion animations and responsive layout

[Unreleased]: https://github.com/coderooz/cloudinary-next/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/coderooz/cloudinary-next/releases/tag/v0.1.0