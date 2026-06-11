import os
import re
import shutil
import subprocess
import time
import uuid
from typing import List, Optional

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

app = FastAPI(title="NL to Manim Backend")

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Constants
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RENDERS_DIR = os.path.join(BASE_DIR, "renders")
DOCS_DIR = os.path.join(BASE_DIR, "docs")
VENV_MANIMGL = os.path.join(BASE_DIR, "venv", "bin", "manimgl")

# Ensure directories exist
os.makedirs(RENDERS_DIR, exist_ok=True)
os.makedirs(DOCS_DIR, exist_ok=True)


class RenderRequest(BaseModel):
    code: str
    quality: str = "low"  # low, medium, high
    scene_class: Optional[str] = None
    skip_animations: bool = False


class RenderResponse(BaseModel):
    success: bool
    video_url: Optional[str] = None
    image_url: Optional[str] = None
    scene_class: Optional[str] = None
    stdout: str
    stderr: str
    compile_time: float


def cleanup_old_renders():
    """Delete render folders older than 1 hour."""
    now = time.time()
    try:
        for folder_name in os.listdir(RENDERS_DIR):
            folder_path = os.path.join(RENDERS_DIR, folder_name)
            if os.path.isdir(folder_path):
                stat = os.stat(folder_path)
                # 3600 seconds = 1 hour
                if now - stat.st_mtime > 3600:
                    shutil.rmtree(folder_path)
    except Exception as e:
        print(f"Error during cleanup: {e}")


def detect_scene_classes(code: str) -> List[str]:
    """Find all class names that inherit from some kind of Scene."""
    # Matches patterns like class MyScene(Scene): or class MyScene(MovingCameraScene):
    pattern = (
        r"class\s+(\w+)\s*\(\s*(?:[a-zA-Z0-9_.,\s]*Scene[a-zA-Z0-9_.,\s]*)\s*\)\s*:"
    )
    return re.findall(pattern, code)


@app.post("/api/render", response_model=RenderResponse)
async def render_scene(req: RenderRequest):
    cleanup_old_renders()

    start_time = time.time()

    # 1. Detect scene class
    classes = detect_scene_classes(req.code)
    if not classes:
        # If no explicit Scene class found, look for any class
        fallback_pattern = r"class\s+(\w+)\s*(?:\(.*?\))?\s*:"
        classes = re.findall(fallback_pattern, req.code)

    if not classes:
        raise HTTPException(
            status_code=400,
            detail="No classes found in your python code. Make sure you define a class inheriting from Scene (e.g., class MyScene(Scene):).",
        )

    # If the user specified a class, verify it exists, otherwise use the last one in the file
    target_class = req.scene_class
    if not target_class or target_class not in classes:
        target_class = classes[-1]  # Default to last scene class

    # 2. Setup run directory
    run_id = str(uuid.uuid4())
    run_dir = os.path.join(RENDERS_DIR, run_id)
    os.makedirs(run_dir, exist_ok=True)

    code_path = os.path.join(run_dir, "scene.py")
    with open(code_path, "w", encoding="utf-8") as f:
        f.write(req.code)

    # Determine quality flag
    # low: -l (480p), medium: -m (720p), high: --hd (1080p)
    q_flag = "-l"
    if req.quality == "medium":
        q_flag = "-m"
    elif req.quality == "high":
        q_flag = "--hd"
    elif req.quality == "ultra":
        q_flag = "--uhd"

    # 3. Execute ManimGL
    cmd = [
        VENV_MANIMGL,
        code_path,
        target_class,
        "-w",
        q_flag,
        "-c",
        "BLACK",
        "--video_dir",
        run_dir,
    ]

    if req.skip_animations:
        cmd.append("-s")
    else:
        # Use libopenh264 video codec because libx264 is not compiled into the system ffmpeg
        cmd.extend(["--vcodec", "libopenh264"])

    # Run compiler
    try:
        result = subprocess.run(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=45,  # Stop if it hangs
            cwd=run_dir,
        )
    except subprocess.TimeoutExpired as e:
        return RenderResponse(
            success=False,
            stdout=e.stdout or "",
            stderr=e.stderr or "Compilation timed out after 45 seconds.",
            compile_time=time.time() - start_time,
        )

    compile_duration = time.time() - start_time
    success = result.returncode == 0

    video_url = None
    image_url = None

    if success:
        # Check direct path first
        direct_png = os.path.join(run_dir, f"{target_class}.png")
        direct_mp4 = os.path.join(run_dir, f"{target_class}.mp4")

        if os.path.exists(direct_png):
            rel_path = os.path.relpath(direct_png, RENDERS_DIR)
            image_url = f"/renders/{rel_path}"
        elif os.path.exists(direct_mp4):
            rel_path = os.path.relpath(direct_mp4, RENDERS_DIR)
            video_url = f"/renders/{rel_path}"
        else:
            # Fallback to walk if names differed
            for root, dirs, files in os.walk(run_dir):
                for file in files:
                    if file.endswith(".mp4"):
                        rel_path = os.path.relpath(
                            os.path.join(root, file), RENDERS_DIR
                        )
                        video_url = f"/renders/{rel_path}"
                        break
                    elif file.endswith(".png"):
                        rel_path = os.path.relpath(
                            os.path.join(root, file), RENDERS_DIR
                        )
                        image_url = f"/renders/{rel_path}"
                        break
                if video_url or image_url:
                    break

    # Clean stdout/stderr for display (remove terminal coloring ANSI codes)
    ansi_escape = re.compile(r"\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])")
    clean_stdout = ansi_escape.sub("", result.stdout)
    clean_stderr = ansi_escape.sub("", result.stderr)

    return RenderResponse(
        success=success,
        video_url=video_url,
        image_url=image_url,
        scene_class=target_class,
        stdout=clean_stdout,
        stderr=clean_stderr,
        compile_time=compile_duration,
    )


@app.get("/api/docs")
async def get_docs():
    """Load and return all markdown documentation files."""
    docs_data = {}
    try:
        for file_name in os.listdir(DOCS_DIR):
            if file_name.endswith(".md"):
                file_path = os.path.join(DOCS_DIR, file_name)
                with open(file_path, "r", encoding="utf-8") as f:
                    docs_data[file_name] = f.read()
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to load documentation: {str(e)}"
        )
    return docs_data


# Mount static files for renders
app.mount("/renders", StaticFiles(directory=RENDERS_DIR), name="renders")

# Serve frontend build in production if it exists
frontend_dist = os.path.join(os.path.dirname(BASE_DIR), "frontend", "dist")
if os.path.exists(frontend_dist):
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="frontend")
else:

    @app.get("/")
    async def root():
        return {
            "message": "NL-to-Manim API backend is running. Start the frontend development server to use the UI."
        }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
