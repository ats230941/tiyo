# Tiyo — Church Website (starter)

A modern, Lakota-centered Episcopal church website starter built with Next.js, TypeScript and Tailwind CSS.

## Features
- Home, Calendar, Prayer Requests, History sections
- Prayer Requests API with a moderation workflow (admin stub)
- Simple file-based storage for development (replace with Supabase / Postgres for production)
- Tailwind CSS utility styles

## Local development

1. Install dependencies:

```bash
npm install
```

2. Run dev server:

```bash
npm run dev
```

Open http://localhost:3000

## Notes & Next steps
- The `pages/api/prayers` endpoint writes to `data/prayers.json`. This is for demo/dev only. I recommend replacing this with Supabase or another DB and adding auth for the admin routes.
- The admin UI is a simple moderation interface without authentication — add a login/magic-link for pastor/staff before production.
- Calendar uses a sample events list. Integrate with a proper events table or ICS/Google Calendar if desired.

## Deployment (Cloudflare Pages)
- This site works well on Cloudflare Pages. I added GitHub workflows for CI and (optional) automated deployment.

### Enabling automatic deploys & PR previews
1. In your GitHub repository, add the following **repository secrets** (Settings → Secrets & variables → Actions):
   - `CF_API_TOKEN` — a Cloudflare API token with Pages deploy permissions (see note below).
   - `CF_ACCOUNT_ID` — your Cloudflare account id.
   - `CF_PAGES_PROJECT_NAME` — the Pages project name (used by the action).

2. The workflow `/.github/workflows/deploy-pages.yml` runs on pushes to `main` and can also be triggered manually from the Actions tab.

3. The workflow `/.github/workflows/pr-preview.yml` runs on pull requests and will:
   - build the site,
   - upload the built `.next` and `public` directories as a **preview artifact** (downloadable from the Actions run), and
   - **optionally** deploy to Cloudflare Pages if the repository Cloudflare secrets are present.

4. If Cloudflare deploy is not configured, PRs will still have a downloadable preview artifact. If you enable the Cloudflare secrets, PRs will attempt an automatic preview deployment and the workflow will comment on the PR with guidance (check the Actions logs for the deployed URL).

**Cloudflare API token permissions:** create a token limited to the account with these granular scopes: `Pages:Edit` (or `pages_projects:edit` and `pages_deployments:write`) and `Account:Read`. For details see Cloudflare docs.

**Cloudflare API token permissions:** create a token limited to the account with these granular scopes: `Pages:Edit` (or `pages_projects:edit` and `pages_deployments:write`) and `Account:Read`. For details see Cloudflare docs.

> Note: Cloudflare Pages supports Next.js. For SSR/Edge function support (API routes / server-side rendering), you may need to configure the Pages project framework settings in the Cloudflare dashboard or use an appropriate adapter; I'm happy to help wire that up when you connect the site.

## Supabase & Sanity (added)
- Supabase is supported for prayer request storage and admin auth (magic links). Configure the following environment variables (see `.env.example`): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.

  SQL to create the `prayers` table (run in the Supabase SQL editor):

  ```sql
  create table public.prayers (
    id bigint generated always as identity primary key,
    name text,
    text text not null,
    approved boolean default false,
    created_at timestamptz default now()
  );
  ```

- Sanity studio schema files were added under `sanity/schemas`. To setup Sanity:
  1. Install Sanity CLI: `npm install -g @sanity/cli`.
  2. Run `sanity init` in a new folder, or `sanity start` if you create a studio. Copy the schema files into `schemas/` and update `sanity.config.js`.

## Cultural guidance
- Consult tribal elders and get written permission before publishing oral histories, names, photos, or sacred content.

---

If you'd like, I can continue and add:
- Auto-deploy to Cloudflare Pages with GitHub Actions and environment setup
- Supabase role-based checks and admin email whitelist
- Sanity studio deployment and content modeling for Lakȟóta translations and audio fields

Tell me which next step you prefer and I will implement it. 
