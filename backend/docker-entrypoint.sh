#!/usr/bin/env sh
set -eu

mkdir -p /data

if [ ! -f /data/db.json ]; then
  cp /app/db.seed.json /data/db.json
fi

exec "$@"
