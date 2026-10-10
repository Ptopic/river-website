# River WordPress + Astro Migration

This folder is the parallel headless rebuild for River. The existing React site remains untouched until cutover.

## Shape

- `src/` is the Astro static frontend.
- `src/components/BlockRenderer.astro` maps every River block type to an Astro module.
- `src/lib/content/wordpress.ts` fetches WordPress pages through `river_sections`.
- `src/lib/fixtures/` keeps fixture content derived from the current React website for local work.
- `wordpress/` contains the WordPress MU plugins, local Docker setup, and production deployment notes.

## Local Astro

```bash
cd new
npm install
USE_FIXTURE_CONTENT=true npm run dev
npm run build
```

Without `WP_API_URL`, Astro uses fixture content. Set `WP_API_URL=http://localhost:8080` to build from local WordPress.

## Local WordPress

```bash
cd new
npm run wp:up
```

Then open `http://localhost:8080/wp-admin`. The local container mounts `wordpress/wp-content/mu-plugins`, so the REST contract and ACF field loader are active as must-use plugins.

## Netlify

The cutover should set the Netlify base directory to `new/` and use this folder's `netlify.toml`. Do not replace the root Netlify configuration until the Astro build has passed route, content, and visual checks.

Required Netlify environment variables:

- `SITE_URL`
- `WP_API_URL`
- `PREVIEW_SECRET` only if a future preview route needs an app-level secret; the current WordPress preview URL uses a signed WordPress token.
- `PUBLIC_GOOGLE_MAPS_EMBED_URL` if the embedded map is used
- `PUBLIC_MENU_ENABLED=false` to hide food menu links and redirect `/menu` and `/hrana` home. The menu is enabled by default; `off` and `0` also disable it.

Exact WordPress block previews also require the WordPress environment variable
`RIVER_ASTRO_PREVIEW_URL` to point to the deployed Astro site, for example the
Netlify URL that serves this `new/` app. The editor iframe loads
`/block-preview/<layout>/<hash>` from that Astro deployment and Astro fetches the
signed preview row from WordPress.

## WordPress

River pages are authored as ordered sections. The frontend only renders the normalized block contract and does not parse arbitrary WordPress post HTML.

Production WordPress needs ACF PRO or an equivalent ACF-compatible setup for the committed field group in `wordpress/wp-content/mu-plugins/acf-json`.
