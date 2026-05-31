#!/usr/bin/env sh
set -u

FRONTEND_URL="${1:-http://localhost:8080}"
BACKEND_URL="${2:-http://localhost:3001}"

case "$BACKEND_URL" in
  */tasks) BACKEND_TASKS_URL="$BACKEND_URL" ;;
  */) BACKEND_TASKS_URL="${BACKEND_URL}tasks" ;;
  *) BACKEND_TASKS_URL="${BACKEND_URL}/tasks" ;;
esac

if ! command -v curl >/dev/null 2>&1; then
  echo "FAIL: curl is required for this health check."
  exit 1
fi

check_url() {
  name="$1"
  url="$2"

  if curl --fail --silent --show-error --location --max-time 10 "$url" >/dev/null; then
    echo "OK: $name is reachable at $url"
  else
    echo "FAIL: $name is not reachable at $url"
    exit 1
  fi
}

check_url "frontend" "$FRONTEND_URL"
check_url "backend tasks endpoint" "$BACKEND_TASKS_URL"

echo "Health check passed."
