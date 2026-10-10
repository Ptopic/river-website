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
