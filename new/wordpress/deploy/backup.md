# Backups

Back up both persistent stores:

- MariaDB: `docker compose exec db mariadb-dump -u root -p"$MARIADB_ROOT_PASSWORD" "$WORDPRESS_DB_NAME" > backups/river-$(date +%F).sql`
- Uploads: archive `wp-content/uploads`
- MU plugins and deploy files are source-controlled under `new/wordpress`

Recommended cadence before cutover: manual backup before every content import.

Recommended cadence after cutover: daily database dump and daily uploads archive with at least 14 days retention.
