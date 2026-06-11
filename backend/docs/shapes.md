# Geometric & Text Mobjects

All visible objects in Manim inherit from `Mobject` (Mathematical Object). Objects that represent curves, paths, or areas are subclasses of `VMobject` (Vectorized Mobject).

## 2D Geometric Shapes

- **`Circle(radius=1.0, color=RED, fill_opacity=0.5)`**: Creates a circle.
- **`Square(side_length=2.0)`**: Creates a square.
- **`Rectangle(width=3.0, height=2.0)`**: Creates a rectangle.
- **`RoundedRectangle(corner_radius=0.5)`**: Creates a rounded rectangle.
- **`Triangle()`**: Creates an equilateral triangle.
- **`Polygon(*vertices)`**: Creates a polygon from a list of coordinates. E.g., `Polygon([-1,0,0], [1,0,0], [0,1,0])`.
- **`RegularPolygon(n=5)`**: Creates a regular n-sided polygon.
- **`Ellipse(width=2, height=1)`**: Creates an ellipse.
- **`Annulus(inner_radius=1, outer_radius=2)`**: Creates a ring.

## Points, Lines, and Arrows

- **`Dot(point=ORIGIN, radius=0.08, color=WHITE)`**: A point at a coordinate.
- **`Line(start=LEFT, end=RIGHT, color=GOLD)`**: A straight line between two points.
- **`Arrow(start=LEFT, end=RIGHT, buff=0.1)`**: A line with an arrowhead pointing to the end.
- **`DoubleArrow(start, end)`**: Arrowheads at both ends.
- **`Vector(direction)`**: An arrow starting from the origin pointing in the given direction.

## Text and Math Formulas

- **`Text("Hello World", font_size=24, color=BLUE)`**: Renders standard text.
  - Custom fonts can be specified with `font="Font Name"`.
- **`MarkupText("<b>Bold</b> and <i>Italic</i>")`: Renders HTML-like markup text.
- **`Tex(r"\int_a^b f(x) dx = F(b) - F(a)")`**: Renders LaTeX mathematical equations.
  - **Note**: Use raw strings (`r"..."`) to avoid escaping backslashes.
  - Can split strings into substrings to animate parts: `Tex("a^2", "+", "b^2", "=", "c^2")`.
- **`TexText(r"Hello \textbf{World}")`**: Renders LaTeX text.

## Code Example

```python
class ShapesExample(Scene):
    def construct(self):
        circle = Circle(color=TEAL, fill_opacity=0.3)
        square = Square(side_length=1.5, color=ORANGE).shift(RIGHT * 3)
        text = Text("Circle & Square", font_size=32).to_edge(UP)
        
        self.play(FadeIn(text))
        self.play(ShowCreation(circle), Write(square))
        self.wait()
```
