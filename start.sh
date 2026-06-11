#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV_UVICORN="$REPO_ROOT/backend/venv/bin/uvicorn"

if [[ ! -x "$VENV_UVICORN" ]]; then
    echo "ERROR: venv not found. Run ./install.sh first." >&2
    exit 1
fi

echo "Starting NL-to-Manim server on http://localhost:8000 …"
cd "$REPO_ROOT/backend"
exec "$VENV_UVICORN" main:app --host 0.0.0.0 --port 8000
