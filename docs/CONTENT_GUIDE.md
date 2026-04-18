# Content Operations Guide

This guide is for day-to-day content editing after setup.

## Open Studio

- Local: `http://localhost:3000/studio`
- Production: `https://<your-domain>/studio`

Use `Published` perspective while validating final output.

## What to edit where

## `Site Settings`

Use this for global site content:

- Site name, tagline, bio
- Hero images
- Quotes
- Social links
- Contact email
- Contact form endpoint
- Newsletter endpoint
- Texture overlays for light/dark mode

If `heroImages` is empty, hero renders without a background image.

## `Blog Post`

Fields:

- `title`, `slug`, `category`, `date`
- `coverImage` (optional)
- `excerpt`
- `body` (rich text + inline images)
- `tags`

Notes:

- If `coverImage` is empty, no cover image is shown.
- Inline body images support `alt` + `caption`.
- Search indexes title + subtitle + tags.

## `Gallery`

Fields:

- `title`, `slug`, `location`, `date`
- `description`
- `coverImage` (optional)
- `images` (optional)
- `tags`
- `lightroomShareUrl` (optional)

Notes:

- If `coverImage` is empty, gallery cards render text only.
- If `images` is empty, detail page shows a "No gallery images added yet" message.
- If `lightroomShareUrl` is provided, detail page shows Lightroom embed + external open button.

## `Project`

- Keep one `project` doc for the featured project block.
- Current app expects slug `stockspektra`.

## `Now Item`, `Experience`, `Education`

- Use these for home/about timeline sections.
- Ordering is controlled by schema/order fields where applicable.

## Content publishing checklist

For each new blog/gallery:

1. Fill `title`.
2. Generate/confirm unique `slug`.
3. Add `date`.
4. Add `tags` (important for search quality).
5. Add image fields if needed.
6. Publish.
7. Verify route:
   - blog: `/blog/<slug>`
   - gallery: `/gallery/<slug>`

## Search behavior

Search matches against:

- title
- subtitle (category/location/date label)
- keyword index (tags, category/type/location)

So tag quality directly improves search results.

## Image behavior

- No default filler images are injected when CMS image fields are empty.
- Large images are optimized by Next.js image pipeline on frontend render.
- Sanity stores originals; frontend requests sized variants.

## Optional travel import script

Command:

```bash
npm run import:travel
```

Required env:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_WRITE_TOKEN`

This script imports travel posts from old WordPress source into Sanity `blogPost` docs.
