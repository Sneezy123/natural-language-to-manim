#!/usr/bin/env bash
set -euo pipefail

# ─── Colors ───────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

log()  { echo -e "${CYAN}[install]${NC} $*"; }
ok()   { echo -e "${GREEN}[  OK  ]${NC} $*"; }
warn() { echo -e "${YELLOW}[ WARN ]${NC} $*"; }
fail() { echo -e "${RED}[ FAIL ]${NC} $*"; exit 1; }

echo -e "${BOLD}"
echo "╔═══════════════════════════════════════════╗"
echo "║      NL-to-Manim  –  local installer      ║"
echo "╚═══════════════════════════════════════════╝"
echo -e "${NC}"

# ─── 1. Node.js / npm ─────────────────────────────────────────────────────────
log "Checking for Node.js / npm …"
if ! command -v npm &>/dev/null; then
    warn "npm not found – installing Node.js via nvm …"
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.5/install.sh | bash
    # Source nvm without restarting the shell
    export NVM_DIR="$HOME/.nvm"
    # shellcheck disable=SC1091
    \. "$NVM_DIR/nvm.sh"
    nvm install --lts
    nvm use --lts
else
    ok "npm $(npm --version) found"
fi

# ─── 2. Python 3 ──────────────────────────────────────────────────────────────
log "Checking for Python 3 …"
PYTHON=$(command -v python3 || command -v python || true)
if [[ -z "$PYTHON" ]]; then
    fail "Python 3 not found. Please install Python 3.10+ and re-run this script."
fi
PY_VER=$("$PYTHON" --version 2>&1 | awk '{print $2}')
ok "Python $PY_VER found at $PYTHON"

# ─── 3. System dependencies ───────────────────────────────────────────────────
# Detect which package manager is available and map our logical deps to its names.
log "Detecting package manager …"

# Logical deps → [apt]  [dnf]  [pacman]  [zypper]  [brew]
#   ffmpeg           ffmpeg        ffmpeg       ffmpeg        ffmpeg         ffmpeg
#   cairo-dev        libcairo2-dev cairo-devel  cairo         cairo-devel    cairo
#   pango-dev        libpango1.0-dev pango-devel pango        pango-devel    pango
#   pkg-config       pkg-config    pkgconf      pkgconf       pkg-config     pkg-config

install_system_pkgs() {
    local pm="$1"; shift
    local pkgs=("$@")
    case "$pm" in
        apt)
            sudo apt-get update -qq
            sudo apt-get install -y "${pkgs[@]}"
            ;;
        dnf)
            sudo dnf install -y "${pkgs[@]}"
            ;;
        pacman)
            sudo pacman -Sy --noconfirm "${pkgs[@]}"
            ;;
        zypper)
            sudo zypper install -y "${pkgs[@]}"
            ;;
        brew)
            brew install "${pkgs[@]}"
            ;;
    esac
}

# Detect PM
PM=""
if command -v apt-get &>/dev/null;  then PM="apt"
elif command -v dnf &>/dev/null;    then PM="dnf"
elif command -v pacman &>/dev/null; then PM="pacman"
elif command -v zypper &>/dev/null; then PM="zypper"
elif command -v brew &>/dev/null;   then PM="brew"
fi

# Map logical package names to PM-specific names
declare -A PKG_FFMPEG=([apt]="ffmpeg"         [dnf]="ffmpeg"       [pacman]="ffmpeg"   [zypper]="ffmpeg"      [brew]="ffmpeg")
declare -A PKG_CAIRO=( [apt]="libcairo2-dev"  [dnf]="cairo-devel"  [pacman]="cairo"    [zypper]="cairo-devel" [brew]="cairo")
declare -A PKG_PANGO=( [apt]="libpango1.0-dev"[dnf]="pango-devel"  [pacman]="pango"    [zypper]="pango-devel" [brew]="pango")
declare -A PKG_PKG=(   [apt]="pkg-config"     [dnf]="pkgconf"      [pacman]="pkgconf"  [zypper]="pkg-config"  [brew]="pkg-config")

# Check which are actually missing (command-based, works cross-distro)
MISSING_PM_PKGS=()
if ! command -v ffmpeg &>/dev/null; then
    [[ -n "$PM" ]] && MISSING_PM_PKGS+=("${PKG_FFMPEG[$PM]}")
fi
if ! pkg-config --exists cairo 2>/dev/null; then
    [[ -n "$PM" ]] && MISSING_PM_PKGS+=("${PKG_CAIRO[$PM]}")
fi
if ! pkg-config --exists pango 2>/dev/null; then
    [[ -n "$PM" ]] && MISSING_PM_PKGS+=("${PKG_PANGO[$PM]}")
fi
if ! command -v pkg-config &>/dev/null; then
    [[ -n "$PM" ]] && MISSING_PM_PKGS+=("${PKG_PKG[$PM]}")
fi

if [[ ${#MISSING_PM_PKGS[@]} -gt 0 ]]; then
    if [[ -n "$PM" ]]; then
        warn "Missing system packages: ${MISSING_PM_PKGS[*]}"
        log "Installing via $PM …"
        install_system_pkgs "$PM" "${MISSING_PM_PKGS[@]}"
        ok "System packages installed"
    else
        warn "Could not detect a supported package manager (apt/dnf/pacman/zypper/brew)."
        warn "Please install the following dependencies manually, then re-run this script:"
        warn ""
        warn "  • ffmpeg"
        warn "  • Cairo dev headers    (e.g. libcairo2-dev / cairo-devel / cairo)"
        warn "  • Pango dev headers    (e.g. libpango1.0-dev / pango-devel / pango)"
        warn "  • pkg-config           (e.g. pkg-config / pkgconf)"
        warn ""
        warn "Continuing anyway – ManimGL will fail at render time if these are absent."
    fi
else
    ok "All required system packages present"
fi

# ─── 4. Backend Python virtual-environment ────────────────────────────────────
log "Setting up backend Python virtual environment …"
VENV_DIR="$REPO_ROOT/backend/venv"

if [[ ! -d "$VENV_DIR" ]]; then
    "$PYTHON" -m venv "$VENV_DIR"
    ok "Virtual environment created at $VENV_DIR"
else
    ok "Virtual environment already exists at $VENV_DIR"
fi

VENV_PIP="$VENV_DIR/bin/pip"
VENV_PYTHON="$VENV_DIR/bin/python"

log "Upgrading pip …"
"$VENV_PIP" install --upgrade pip --quiet

# ─── 5. Install ManimGL (3b1b fork) inside the venv ──────────────────────────
log "Ensuring manim_3b1b submodule is populated …"
# Works regardless of whether the user cloned with --recurse-submodules or not
if [[ ! -f "$REPO_ROOT/manim_3b1b/setup.cfg" ]]; then
    log "manim_3b1b appears empty – running: git submodule update --init manim_3b1b"
    git -C "$REPO_ROOT" submodule update --init manim_3b1b || \
        fail "Could not initialise the manim_3b1b submodule. Check your internet connection and try again."
fi

log "Installing ManimGL …"

"$VENV_PIP" install -e "$REPO_ROOT/manim_3b1b" --quiet
"$VENV_PIP" install -r "$REPO_ROOT/manim_3b1b/requirements.txt" --quiet
ok "ManimGL installed"

# ─── 6. Install backend Python dependencies ───────────────────────────────────
log "Installing backend Python dependencies …"
BACKEND_DEPS=(fastapi uvicorn[standard] pydantic python-multipart)
"$VENV_PIP" install "${BACKEND_DEPS[@]}" --quiet
ok "Backend dependencies installed"

# ─── 7. Smoke-test ManimGL ───────────────────────────────────────────────────
log "Running ManimGL smoke test …"
MANIMGL_BIN="$VENV_DIR/bin/manimgl"
if [[ ! -x "$MANIMGL_BIN" ]]; then
    fail "manimgl binary not found at $MANIMGL_BIN – installation may have failed."
fi

# Render one frame in low-quality skip mode (-s = last frame only)
SMOKE_OUT=$("$MANIMGL_BIN" "$REPO_ROOT/backend/test_scene.py" TestScene \
    -w -l -s -c BLACK \
    --video_dir /tmp/nl-manim-smoke-test 2>&1) || {
    warn "ManimGL smoke test produced errors. Output:"
    echo "$SMOKE_OUT"
    warn "Installation continues, but Manim may not work correctly."
}
ok "ManimGL smoke test passed"

# ─── 8. Frontend Node dependencies ────────────────────────────────────────────
log "Installing frontend Node.js dependencies …"
cd "$REPO_ROOT/frontend"
npm install --silent
ok "Node.js dependencies installed"

# ─── 9. Build frontend for production ─────────────────────────────────────────
log "Building frontend …"
npm run build --silent
ok "Frontend built → frontend/dist/"

cd "$REPO_ROOT"

# ─── Done ─────────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}${BOLD}Installation complete!${NC}"
echo ""
echo -e "Start the server with:"
echo -e "  ${CYAN}./backend/venv/bin/python -m uvicorn main:app --host 0.0.0.0 --port 8000${NC}"
echo ""
echo -e "Or use the convenience wrapper:"
echo -e "  ${CYAN}./start.sh${NC}"
echo ""
