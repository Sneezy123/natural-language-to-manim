# Manim Basics

Manim (Mathematical Animation Engine) is used to create precise mathematical animations using Python.

## Scene Lifecycle

Every animation in Manim is defined within a subclass of `Scene`. The main method you must implement is `construct()`, which contains the logic of the animation.

```python
from manimlib import *

class MyFirstScene(Scene):
    def construct(self):
        # 1. Create objects (Mobjects)
        circle = Circle()
        
        # 2. Add or animate objects
        self.play(ShowCreation(circle))
        
        # 3. Wait or pause
        self.wait(2)
```

## Coordinate System

Manim uses a 3D coordinate system, but most animations are 2D.
- The center of the screen is `(0, 0, 0)`.
- The width of the screen spans from `-7.1` to `+7.1` (total width is 14.2).
  - Left edge: `LEFT` or `-7 * RIGHT`
  - Right edge: `RIGHT` or `7 * RIGHT`
- The height of the screen spans from `-4.0` to `+4.0` (total height is 8.0).
  - Bottom edge: `DOWN` or `-4 * UP`
  - Top edge: `UP` or `4 * UP`

### Position Constants

Manim defines standard direction vectors:
- `ORIGIN` = `[0, 0, 0]`
- `UP` = `[0, 1, 0]`, `DOWN` = `[0, -1, 0]`
- `LEFT` = `[-1, 0, 0]`, `RIGHT` = `[1, 0, 0]`
- `UL` (Up-Left), `UR` (Up-Right), `DL` (Down-Left), `DR` (Down-Right)

## Colors

Manim has predefined color constants. Common colors include:
- `RED`, `BLUE`, `GREEN`, `YELLOW`, `ORANGE`, `PURPLE`, `PINK`, `TEAL`
- `WHITE`, `BLACK`, `GRAY`, `DARK_GRAY`, `LIGHT_GRAY`
- Colors can be modified with opacity or hex values, e.g., `Circle(color="#3498db")`.
