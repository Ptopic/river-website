#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_FILE="$ROOT/docker-compose.local.yml"

case "${1:-}" in
  up)
    docker compose -f "$COMPOSE_FILE" up -d
    ;;
  down)
    docker compose -f "$COMPOSE_FILE" down
    ;;
  logs)
    docker compose -f "$COMPOSE_FILE" logs -f wordpress
    ;;
  wp)
    shift
    docker compose -f "$COMPOSE_FILE" exec wordpress wp "$@"
    ;;
  *)
    echo "Usage: $0 {up|down|logs|wp ...}" >&2
    exit 2
    ;;
esac
