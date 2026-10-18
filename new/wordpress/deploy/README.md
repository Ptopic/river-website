# WordPress on petarvps

This deployment scaffold expects Docker Compose on `petarvps`.

1. Copy `new/wordpress/deploy/env.example` to `.env` on the server and set real secrets.
2. Copy `new/wordpress/wp-content/mu-plugins` to `./wp-content/mu-plugins`.
3. For direct VPS port deployment, run `docker compose -f docker-compose.vps-port.yml up -d`.
4. For a standalone Caddy-owned host deployment, run `docker compose -f docker-compose.prod.yml up -d`.
5. Install WordPress, install/activate ACF PRO, and sync the local JSON field group.
6. Create pages with slugs `home`, `vine`, `drinks`, and `pizza`.
7. Confirm `https://$WORDPRESS_DOMAIN/wp-json/wp/v2/pages?slug=home&_fields=slug,river_sections` returns blocks.

Keep database and uploads backups outside the container lifecycle.

## Croatian CSV price list

Deploy both `river-menu.php` and `river-price-list.php` from `wp-content/mu-plugins`. Keep the WordPress uploads volume persistent and backed up: `uploads/river-cjenik` holds immutable CSV versions and their atomic index. On the first request after installation, the plugin validates the published menu and creates the first version if settings and data are complete. It does not backfill earlier historical price lists.

In WordPress, open **Menu > Digitalni cjenik**. Confirm the business type and address, then enter the real premises ID; River's known address defaults to `Ul. kralja Zvonimira 46, 21210 Solin`, while the ID intentionally has no default. Save the settings and check the status banner. Each menu item has a **Posebni oblik prodaje** checkbox and a Croatian promotion name. The default is `NE` with an empty name; a checked promotion exports `DA` and its name for both pizza variants.

The exporter includes published food, drinks, pizza, and wine items. It requires a Croatian name, sale price, and anchor price for every priced variant; invalid data leaves previous files in the archive and makes the current endpoint unavailable until corrected. It never substitutes English text or a different price for missing data. The five CSV columns are `naziv_usluge,maloprodajna_cijena,posebni_oblik_prodaje,naziv_posebnog_oblika,sidrena_cijena`, with UTF-8 text, comma separators and period decimals. Anchor dates remain editorial data and are not CSV columns.

WordPress publishes once after a complete save, including REST, term, and import edits. Every changed valid CSV gets a numbered, Zagreb-time filename with type, address and premises ID. Previous versions remain downloadable for at least 30 days; the latest version is retained regardless of age. The public API is `/wp-json/river/v1/price-list` for the live manifest, `/wp-json/river/v1/price-list/current.csv` for the current download, and `/wp-json/river/v1/price-list/files/<filename>` for dated files. Plain-permalink local WordPress exposes the same routes through `?rest_route=`. Astro's `/cjenik` reads the manifest at request time and `/cjenik/preuzmi` proxies the current CSV. Both require the server-side `WP_API_URL` deployment variable.

Complete price edits and verify the current CSV before 08:00 Europe/Zagreb on the applicable day. Publication is immediate after a successful save; the plugin does not schedule future price changes. Review the WordPress status after edits, especially if a required value was cleared.
