# NL-to-Manim

Convert natural language descriptions into animated [Manim](https://github.com/3b1b/manim) scenes using an LLM of your choice (Gemini, OpenAI, …).

---

## Prerequisites

Before running the installer, make sure the following are available on your system:

| Requirement | Notes |
|---|---|
| **Python 3.10+** | `python3 --version` |
| **Git** | Needed to clone the repo |
| **Node.js 18+ / npm** | Installed automatically by `install.sh` if missing |
| **ffmpeg** | Installed automatically on Debian/Ubuntu; otherwise install manually |
| **Cairo & Pango dev libs** | `libcairo2-dev`, `libpango1.0-dev` – required by ManimGL |

The installer auto-detects your package manager and installs missing system packages. If you'd like to do it yourself first:

| Distro | Command |
|---|---|
| Debian / Ubuntu | `sudo apt-get install -y ffmpeg libcairo2-dev libpango1.0-dev pkg-config` |
| Fedora / RHEL | `sudo dnf install -y ffmpeg cairo-devel pango-devel pkgconf` |
| Arch Linux | `sudo pacman -Sy ffmpeg cairo pango pkgconf` |
| openSUSE | `sudo zypper install -y ffmpeg cairo-devel pango-devel pkg-config` |
| macOS (Homebrew) | `brew install ffmpeg cairo pango pkg-config` |

---

## Installation

```bash
# 1. Clone the repository (including the bundled ManimGL submodule)
git clone --recurse-submodules https://github.com/Sneezy123/natural-language-to-manim.git
cd natural-language-to-manim

# 2. Run the installer  (takes 2–5 minutes on a fresh machine)
chmod +x install.sh
./install.sh
```

`install.sh` will:

1. Install **Node.js** via nvm if `npm` is not found
2. Create a Python **virtual environment** in `backend/venv/`
3. Install **ManimGL** (3b1b fork) from the bundled `manim_3b1b/` directory
4. Install the **FastAPI / Uvicorn** backend dependencies
5. Run a quick **ManimGL smoke test** to verify rendering works
6. Install frontend npm packages and produce a **production build** in `frontend/dist/`

---

## Running locally

```bash
./start.sh
```

Then open **[http://localhost:8000](http://localhost:8000)** in your browser.

Alternatively, start the backend manually:

```bash
cd backend
../backend/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
```

For **frontend hot-reload** during development, start the Vite dev server separately:

```bash
cd frontend
npm run dev          # http://localhost:5173  (proxied to :8000)
```

---

## First-time setup (in the app)

1. Click the **settings icon** (top-right corner)
2. Choose your AI provider (Gemini or OpenAI)
3. Paste your **API key**
   - Free Gemini key: [Google AI Studio](https://aistudio.google.com/apikey)
4. Recommended model: `gemini-3.1-flash-lite`

---

## Project structure

```
nl-to-manim/
├── backend/           # FastAPI server + ManimGL renderer
│   ├── main.py        # API routes & render logic
│   ├── test_scene.py  # Smoke-test scene
│   └── venv/          # Python venv (created by install.sh)
├── frontend/          # React + Vite UI
│   └── dist/          # Production build (created by install.sh)
├── manim_3b1b/        # Bundled 3b1b/manim fork (git submodule)
├── install.sh         # One-shot installer
└── start.sh           # Start the production server
```

---

## Troubleshooting

**ManimGL smoke test fails**  
Make sure `libcairo2-dev`, `libpango1.0-dev` and `ffmpeg` are installed, then re-run `./install.sh`.

**`ModuleNotFoundError: manimlib`**  
Run `./install.sh` from the repository root – it installs ManimGL into the venv.

**Port 8000 already in use**  
Pass a different port: `./backend/venv/bin/uvicorn main:app --port 8080`
