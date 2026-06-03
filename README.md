# GuraPaws 🐾

A digital-native dog adoption platform for **Hyderabad** — built to scale across India.

GuraPaws is a two-sided platform: shelters, NGOs, and independent rescuers list adoptable dogs (supply); adopters browse and apply (demand). The goal is to make listing and adopting radically faster than today's WhatsApp-and-Instagram status quo.

> **Status:** R0.1 — Foundation. Repo scaffold + CI + first public deploy. ([GURA-2](/GURA/issues/GURA-2))

## Stack

| Layer         | Choice                           | Why                                                                |
| ------------- | -------------------------------- | ------------------------------------------------------------------ |
| Framework     | **Next.js 15** (App Router, TS)  | Boring, proven full-stack React. UI + API routes in one codebase.  |
| Styling       | **Tailwind CSS v4**              | Fast, consistent UI without bespoke CSS; low maintenance.          |
| Language      | **TypeScript**                   | Type safety across the data model as the platform grows.           |
| Persistence   | **Postgres** (planned, R0.2)     | Relational fit for Dog / Shelter / Adopter / Application; scales.  |
| Hosting (now) | **GitHub Pages** (static export) | A real public URL with zero extra infra for the hello-world phase. |
| CI/CD         | **GitHub Actions**               | Build + lint on every push; auto-deploy from `main`.               |

**Rationale (1 line):** Next.js + TypeScript + Tailwind is the leanest proven full-stack combo — fast to ship, low ops, and the same codebase carries us from a static landing page to a server-rendered marketplace with API routes and Postgres, no rewrite.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run lint          # ESLint (next/core-web-vitals + next/typescript)
npm run format        # Prettier write
npm run format:check  # Prettier check (runs in CI)
npm run build         # Production build / static export
```

## Project structure

```
gurapaws/
├── .github/workflows/ci.yml   # CI (build + lint) + deploy to Pages
├── src/app/                   # Next.js App Router
│   ├── layout.tsx             # Root layout + metadata
│   ├── page.tsx               # Placeholder landing page
│   └── globals.css            # Tailwind + base styles
├── public/                    # Static assets
├── next.config.mjs            # Static export + Pages basePath config
├── eslint.config.mjs          # Lint config
└── .prettierrc.json           # Format config
```

## Deploy

Every push runs **build + lint**. Pushes to `main` additionally build a static export (`output: 'export'`) and publish to GitHub Pages.

**Live URL:** https://siddharthgs.github.io/gurapaws/

### Note on hosting evolution

GitHub Pages is static-only — perfect for this landing-page phase with zero infra cost. When R1.2 (adoption application flow) and the shelter portal need server-side rendering, API routes, and a database, we move hosting to **Vercel** (or Fly.io). That is a **host swap, not a stack rewrite** — the Next.js codebase is unchanged. A deploy token for the server host will be requested from the CEO when that phase begins.

## Roadmap

See the founding plan: [GURA-1](/GURA/issues/GURA-1#document-plan).

- **R0.1** ✅ Stack + scaffold + CI + deploy _(this repo)_
- **R0.2** Data model + persistence (`Dog`, `Shelter`, `Adopter`, `Application`)
- **R1.x** Browse + filter, adoption application flow, shelter portal
- **R2.x** Shareable profiles, adoption stories, foster/volunteer/donate intent

---

_Co-authored with Paperclip._
