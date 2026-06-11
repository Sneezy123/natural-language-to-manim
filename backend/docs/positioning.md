# Positioning and Transforms

Layout and relative positioning are crucial in Manim to build neat visuals without guessing raw coordinates.

## Relative Positioning

All Mobjects can be positioned relative to other objects or screen boundaries.

- **`mobject.next_to(other, direction=RIGHT, buff=0.2)`**: Places `mobject` next to `other` in a specified direction.
  - `direction` can be `UP`, `DOWN`, `LEFT`, `RIGHT`, `UR`, etc.
  - `buff` is the spacing between the two objects.
- **`mobject.shift(vector)`**: Shifts the object by a displacement vector. E.g., `circle.shift(UP * 2 + RIGHT)`.
- **`mobject.move_to(target)`**: Moves the center of the object directly to a target coordinate or another object's center. E.g., `circle.move_to(UP * 3)` or `circle.move_to(square)`.
- **`mobject.align_to(other, direction=UP)`**: Aligns the boundary of `mobject` to `other` along the specified direction. E.g., `text.align_to(square, LEFT)` aligns the left sides.
- **`mobject.to_edge(direction=UP, buff=0.5)`**: Moves the object to the edge of the screen. `direction` can be `UP`, `DOWN`, `LEFT`, `RIGHT`, `UL`, etc.
- **`mobject.to_corner(direction=UL, buff=0.5)`**: Moves the object to a corner of the screen.

## Transformations (Size & Rotation)

- **`mobject.scale(factor)`**: Resizes the object. `circle.scale(2)` doubles its size; `circle.scale(0.5)` halves it.
- **`mobject.rotate(angle)`**: Rotates the object. E.g., `square.rotate(PI/4)` rotates the square by 45 degrees. Angles are in radians. You can use standard constants like `PI`, `TAU` (2*PI), or math ratios.
- **`mobject.flip(axis=UP)`**: Flips the object symmetrically along an axis.

## Grouping Objects

To manipulate multiple objects as a single entity (e.g., scale them together, shift them, or align them), group them using `VGroup`.

```python
circle = Circle()
square = Square().next_to(circle, RIGHT)

# Group them
group = VGroup(circle, square)

# Now you can shift, scale, or animate the whole group
group.shift(UP * 2)
group.scale(0.8)

self.play(ShowCreation(group))
```

## Layers (Z-ordering)

Mobjects are drawn in the order they are added to the scene. You can adjust their drawing order manually using:
- **`mobject.set_z_index(value)`**: Higher z-index values are drawn on top of lower ones.
