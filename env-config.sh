#!/bin/sh
export $(grep -v '^#' .env | xargs)

cat <<EOF> ./public/env-config.js
window._env_ = {
  "NEXT_PUBLIC_API_URL": "${NEXT_PUBLIC_API_URL}",
  "NEXT_PUBLIC_BASE_URL": "${NEXT_PUBLIC_BASE_URL}",
  "NODE_ENV": "${NODE_ENV}",
  "NEXT_PUBLIC_PPP": "${NEXT_PUBLIC_PPP}",
}
EOF

echo "Environment configuration"
echo "========================="
cat ./public/env-config.js

exec "$@"
