# Bhavesh Jain Website

Production-ready portfolio and writing site built with Next.js + Sanity CMS.

## What this project includes

- Next.js App Router frontend
- Embedded Sanity Studio at `/studio`
- Dynamic blog + gallery pages from CMS
- Search overlay (matches title, subtitle, and tags)
- Gallery lightbox and optional Lightroom embed
- Light/dark theme system and typography combos
- SEO basics (`robots.txt`, `sitemap.xml`, metadata)
- Contact + newsletter endpoint hooks

## Tech stack

- Next.js 15
- React 19
- TypeScript
- Sanity v4 + `next-sanity`
- MUI icons/material

## Project structure

- `app/`: routes and page-level composition
- `components/`: UI sections and page components
- `lib/content.ts`: CMS fetch/normalize layer
- `lib/site-data.ts`: shared content types + fallback seed content
- `lib/sanity/`: Sanity client/env/image helpers + GROQ queries
- `sanity/schemaTypes/`: Studio schema definitions
- `scripts/`: smoke and migration/import scripts

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` from `.env.example`.

3. Start dev server:

```bash
npm run dev
```

4. Open:
- Site: `http://localhost:3000`
- Studio: `http://localhost:3000/studio`

## Environment variables

Required:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Optional integrations:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_CLARITY_PROJECT_ID=
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
```

Server-only tokens (never expose publicly):

```bash
SANITY_READ_TOKEN=
SANITY_WRITE_TOKEN=
```

## CMS content model

Defined in `sanity/schemaTypes/documents`:

- `siteSettings`: branding, hero images, quotes, socials, contact/newsletter endpoints, texture overlays
- `blogPost`: title, slug, category, date, cover, excerpt, rich body, tags
- `gallery`: title, slug, location, date, description, cover, images, tags, optional Lightroom URL
- `project`: featured project block (expects `stockspektra` slug in current app)
- `nowItem`: short now/updates entries
- `experience`: timeline items
- `education`: schools/courses

Detailed editor workflow: [docs/CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md)

## Commands

- `npm run dev`: start local dev server
- `npm run build`: production build
- `npm run start`: run production build
- `npm run smoke`: route smoke test against local server
- `npm run sanity`: run Sanity CLI
- `npm run import:travel`: import travel posts from old WordPress source into Sanity

## Quality checks

Before deployment:

```bash
npm run build
npm run smoke
```

## Deployment

Full GitHub + Vercel walkthrough:

- [DEPLOYMENT.md](DEPLOYMENT.md)

## Notes

- If an image field is empty in CMS, UI leaves image space blank (no default filler image).
- Published CMS updates appear automatically (ISR revalidation window).
