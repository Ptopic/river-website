#!/usr/bin/env bash
set -euo pipefail

SERVER="${SERVER:-petarvps}"
REMOTE_DIR="${REMOTE_DIR:-/opt/river-wordpress}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

ssh "$SERVER" "mkdir -p '$REMOTE_DIR/wp-content'"
rsync -az --delete "$ROOT/deploy/" "$SERVER:$REMOTE_DIR/"
rsync -az --delete "$ROOT/wp-content/mu-plugins/" "$SERVER:$REMOTE_DIR/wp-content/mu-plugins/"
rsync -az "$ROOT/bin/" "$SERVER:$REMOTE_DIR/bin/"
rsync -az "$ROOT/data/" "$SERVER:$REMOTE_DIR/data/"

cat <<MSG
Synced WordPress deployment files to $SERVER:$REMOTE_DIR

Next on the server:
  cd $REMOTE_DIR
  cp env.example .env
  edit .env
  docker compose -f docker-compose.prod.yml up -d
MSG
