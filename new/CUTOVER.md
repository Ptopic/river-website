# River Cutover Notes

Cutover is intentionally separate from this implementation scaffold.

1. Deploy WordPress on `petarvps` and confirm `/wp-json/wp/v2/pages?slug=home&_fields=slug,river_sections` returns the expected section rows.
2. Set Netlify environment variables for the Astro build.
3. Configure Netlify to build from `new/`.
4. Run `npm run build` locally with `WP_API_URL` pointed at production WordPress.
5. Run `npm run routes:check` against the built `dist/`.
6. Compare `/`, `/vine`, `/drinks`, `/pizza`, and `/menu` against the current site.
7. Only after approval, update production DNS or the active Netlify site settings.

Rollback is the current React app at the repository root. Keep the root app deployable until River staff have validated the WordPress editing flow.
