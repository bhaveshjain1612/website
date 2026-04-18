# Deployment Guide

## 1) Preflight

Run these locally first:

```bash
npm install
npm run build
npm run smoke
```

If these pass, deployment should be stable.

## 2) Initialize git and first commit

From project root:

```bash
git init
git add .
git commit -m "Initial commit: Next.js + Sanity production website"
git branch -M main
```

## 3) Create GitHub repo and push

### Option A: GitHub web UI (works without CLI)

1. Go to `https://github.com/new`.
2. Create a new empty repo (no README, no .gitignore).
3. Copy repo URL, then run:

```bash
git remote add origin <your-repo-url>
git push -u origin main
```

### Option B: GitHub CLI

If `gh` is installed and authenticated:

```bash
gh repo create <repo-name> --private --source=. --remote=origin --push
```

## 4) Import to Vercel

1. Go to Vercel Dashboard.
2. `Add New` -> `Project`.
3. Import your GitHub repo.
4. Framework preset: Next.js.
5. Add environment variables:

Required:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION`
- `NEXT_PUBLIC_SITE_URL`

Optional:

- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- `NEXT_PUBLIC_CLARITY_PROJECT_ID`
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`

Server-only (only if used by scripts/server endpoints):

- `SANITY_READ_TOKEN`
- `SANITY_WRITE_TOKEN`

6. Deploy.

## 5) Connect custom domain

1. In Vercel Project -> `Settings` -> `Domains`.
2. Add apex + `www` domain (for example `bhaveshjain.in`, `www.bhaveshjain.in`).
3. Copy DNS records Vercel provides.
4. Add them in your DNS provider (GoDaddy/Cloudflare/etc).
5. Wait for DNS propagation and verify in Vercel.

## 6) Sanity production settings

In Sanity project dashboard:

1. Confirm dataset is `production`.
2. Add CORS origins:
   - `http://localhost:3000`
   - your Vercel domain
   - custom domain
3. Use Studio from:
   - local: `http://localhost:3000/studio`
   - prod: `https://<your-domain>/studio`

## 7) Publishing workflow after deploy

1. Open `/studio`.
2. Create/update docs (`siteSettings`, `blogPost`, `gallery`, etc.).
3. Click `Publish`.
4. Site updates automatically.

## 8) Optional instant update webhook

Default behavior revalidates automatically. If you want faster cache refresh:

1. Create a Vercel Deploy Hook.
2. Add Sanity webhook to that URL.
3. Trigger on publish/update for your content document types.

## 9) Troubleshooting

- `Sanity is not configured yet`: verify env vars in Vercel and local `.env.local`.
- Studio chunk errors after dependency updates: stop dev server, delete `.next`, run `npm install`, restart.
- Content publishes but not visible: verify doc is `Published` (not `Draft`), slug is set, and route matches.
