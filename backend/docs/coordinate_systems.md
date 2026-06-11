# Coordinate Systems and Graphs

Manim provides tools to draw number lines, 2D coordinate planes (axes), and plot mathematical functions.

## Number Lines

- **`NumberLine(x_range=[-5, 5, 1], length=10, include_numbers=True)`**: Creates a horizontal number line.
  - `x_range`: `[min, max, step]`.

## 2D Axes (Coordinate Planes)

- **`Axes(x_range=[-5, 5, 1], y_range=[-3, 3, 1], x_length=9, y_length=6, axis_config={"color": BLUE})`**: Creates a coordinate plane with an X and Y axis.
- **`NumberPlane()`**: Creates a coordinate grid covering the entire screen.

### Plotting Graphs on Axes

You can plot functions using coordinate systems. The function must return a y-value for a given x-value.

- **`axes.get_graph(function, x_range=[min, max], color=YELLOW)`**: Plots a mathematical function on the given axes.

```python
class GraphExample(Scene):
    def construct(self):
        # 1. Create axes
        axes = Axes(
            x_range=[-3, 3, 1],
            y_range=[-2, 8, 2],
            x_length=6,
            y_length=4,
            axis_config={"color": BLUE},
            tips=False
        ).to_edge(DOWN)
        
        # 2. Add labels
        labels = axes.get_axis_labels(x_label="x", y_label="f(x)")
        
        # 3. Create graph for f(x) = x^2
        graph = axes.get_graph(lambda x: x**2, x_range=[-2.5, 2.5], color=YELLOW)
        
        # 4. Add a point on the graph
        dot = Dot(color=RED)
        dot.move_to(axes.c2p(1, 1)) # c2p converts graph coordinates to absolute screen pixels
        
        self.play(ShowCreation(axes), Write(labels))
        self.play(ShowCreation(graph))
        self.play(FadeIn(dot))
        self.wait()
```

## Useful Coordinates Utility Methods

- **`axes.coords_to_point(x, y)`** (or shorthand **`axes.c2p(x, y)`**): Converts a mathematical coordinate `(x, y)` on the graph into a 3D pixel coordinate vector `[px, py, pz]` in screen space. Used to place dots, labels, or lines.
- **`axes.point_to_coords(point)`** (or shorthand **`axes.p2c(point)`**): Converts screen pixel coordinates back into graph coordinates.
