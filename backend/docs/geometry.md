# Geometry & 3D Shapes

This section documents 2D shapes, 3D surfaces/shapes, boolean operations, frame frames, and shape matching tools.

## Module: `mobject/geometry.py`

### Constants

| Constant | Value |
| --- | --- |
| `DEFAULT_DOT_RADIUS` | `0.08` |
| `DEFAULT_SMALL_DOT_RADIUS` | `0.04` |
| `DEFAULT_DASH_LENGTH` | `0.05` |
| `DEFAULT_ARROW_TIP_LENGTH` | `0.35` |
| `DEFAULT_ARROW_TIP_WIDTH` | `0.35` |


### Classes

#### `class TipableVMobject(VMobject)`

Meant for shared functionality between Arc and Line.
Functionality can be classified broadly into these groups:

    * Adding, Creating, Modifying tips
        - add_tip calls create_tip, before pushing the new tip
            into the TipableVMobject's list of submobjects
        - stylistic and positional configuration

    * Checking for tips
        - Boolean checks for whether the TipableVMobject has a tip
            and a starting tip

    * Getters
        - Straightforward accessors, returning information pertaining
            to the TipableVMobject instance's tip(s), its length etc

**Methods:**

- `add_tip(self, at_start, **kwargs)`

  Adds a tip to the TipableVMobject instance, recognising
  that the endpoints might need to be switched if it's
  a 'starting tip' or not.

- `create_tip(self, at_start, **kwargs)`

  Stylises the tip, positions it spacially, and returns
  the newly instantiated tip to the caller.

- `get_unpositioned_tip(self, **kwargs)`

  Returns a tip that has been stylistically configured,
  but has not yet been given a position in space.

- `position_tip(self, tip, at_start)`


- `reset_endpoints_based_on_tip(self, tip, at_start)`


- `asign_tip_attr(self, tip, at_start)`


- `has_tip(self)`


- `has_start_tip(self)`


- `pop_tips(self)`


- `get_tips(self)`

  Returns a VGroup (collection of VMobjects) containing
  the TipableVMObject instance's tips.

- `get_tip(self)`

  Returns the TipableVMobject instance's (first) tip,
  otherwise throws an exception.

- `get_default_tip_length(self)`


- `get_first_handle(self)`


- `get_last_handle(self)`


- `get_end(self)`


- `get_start(self)`


- `get_length(self)`



---

#### `class Arc(TipableVMobject)`

Creates an arc.
Parameters
-----
start_angle : float
    Starting angle of the arc in radians. (Angles are measured counter-clockwise)
angle : float
    Angle subtended by the arc at its center in radians. (Angles are measured counter-clockwise)
radius : float
    Radius of the arc
arc_center : array_like
    Center of the arc
Examples :
        arc = Arc(start_angle=TAU/4, angle=TAU/2, radius=3, arc_center=ORIGIN)
        arc = Arc(angle=TAU/4, radius=4.5, arc_center=(1,2,0), color=BLUE)
Returns
-----
out : Arc object
    An Arc object satisfying the specified parameters

**Methods:**

- `__init__(self, start_angle, angle, radius, n_components, arc_center, **kwargs)`


- `get_arc_center(self)`

  Looks at the normals to the first two
  anchors, and finds their intersection points

- `get_start_angle(self)`


- `get_stop_angle(self)`


- `move_arc_center_to(self, point)`



---

#### `class ArcBetweenPoints(Arc)`

Creates an arc passing through the specified points with "angle" as the
angle subtended at its center.
Parameters
-----
start : array_like
    Starting point of the arc
end : array_like
    Ending point of the arc
angle : float
    Angle subtended by the arc at its center in radians. (Angles are measured counter-clockwise)
Examples :
        arc = ArcBetweenPoints(start=(0, 0, 0), end=(1, 2, 0), angle=TAU / 2)
        arc = ArcBetweenPoints(start=(-2, 3, 0), end=(1, 2, 0), angle=-TAU / 12, color=BLUE)
Returns
-----
out : ArcBetweenPoints object
    An ArcBetweenPoints object satisfying the specified parameters

**Methods:**

- `__init__(self, start, end, angle, **kwargs)`



---

#### `class CurvedArrow(ArcBetweenPoints)`

Creates a curved arrow passing through the specified points with "angle" as the
angle subtended at its center.
Parameters
-----
start_point : array_like
    Starting point of the curved arrow
end_point : array_like
    Ending point of the curved arrow
angle : float
    Angle subtended by the curved arrow at its center in radians. (Angles are measured counter-clockwise)
Examples :
        curvedArrow = CurvedArrow(start_point=(0, 0, 0), end_point=(1, 2, 0), angle=TAU/2)
        curvedArrow = CurvedArrow(start_point=(-2, 3, 0), end_point=(1, 2, 0), angle=-TAU/12, color=BLUE)
Returns
-----
out : CurvedArrow object
    A CurvedArrow object satisfying the specified parameters

**Methods:**

- `__init__(self, start_point, end_point, **kwargs)`



---

#### `class CurvedDoubleArrow(CurvedArrow)`

Creates a curved double arrow passing through the specified points with "angle" as the
angle subtended at its center.
Parameters
-----
start_point : array_like
    Starting point of the curved double arrow
end_point : array_like
    Ending point of the curved double arrow
angle : float
    Angle subtended by the curved double arrow at its center in radians. (Angles are measured counter-clockwise)
Examples :
        curvedDoubleArrow = CurvedDoubleArrow(start_point = (0, 0, 0), end_point = (1, 2, 0), angle = TAU/2)
        curvedDoubleArrow = CurvedDoubleArrow(start_point = (-2, 3, 0), end_point = (1, 2, 0), angle = -TAU/12, color = BLUE)
Returns
-----
out : CurvedDoubleArrow object
    A CurvedDoubleArrow object satisfying the specified parameters

**Methods:**

- `__init__(self, start_point, end_point, **kwargs)`



---

#### `class Circle(Arc)`

Creates a circle.
Parameters
-----
radius : float
    Radius of the circle
arc_center : array_like
    Center of the circle
Examples :
        circle = Circle(radius=2, arc_center=(1,2,0))
        circle = Circle(radius=3.14, arc_center=2 * LEFT + UP, color=DARK_BLUE)
Returns
-----
out : Circle object
    A Circle object satisfying the specified parameters

**Methods:**

- `__init__(self, start_angle, stroke_color, **kwargs)`


- `surround(self, mobject, dim_to_match, stretch, buff)`


- `point_at_angle(self, angle)`


- `get_radius(self)`



---

#### `class Dot(Circle)`

Creates a dot. Dot is a filled white circle with no bounary and DEFAULT_DOT_RADIUS.
Parameters
-----
point : array_like
    Coordinates of center of the dot.
Examples :
        dot = Dot(point=(1, 2, 0))

Returns
-----
out : Dot object
    A Dot object satisfying the specified parameters

**Methods:**

- `__init__(self, point, radius, stroke_color, stroke_width, fill_opacity, fill_color, **kwargs)`



---

#### `class SmallDot(Dot)`

Creates a small dot. Small dot is a filled white circle with no bounary and DEFAULT_SMALL_DOT_RADIUS.
Parameters
-----
point : array_like
    Coordinates of center of the small dot.
Examples :
        smallDot = SmallDot(point=(1, 2, 0))

Returns
-----
out : SmallDot object
    A SmallDot object satisfying the specified parameters

**Methods:**

- `__init__(self, point, radius, **kwargs)`



---

#### `class Ellipse(Circle)`

Creates an ellipse.
Parameters
-----
width : float
    Width of the ellipse
height : float
    Height of the ellipse
arc_center : array_like
    Coordinates of center of the ellipse
Examples :
        ellipse = Ellipse(width=4, height=1, arc_center=(3, 3, 0))
        ellipse = Ellipse(width=2, height=5, arc_center=ORIGIN, color=BLUE)
Returns
-----
out : Ellipse object
    An Ellipse object satisfying the specified parameters

**Methods:**

- `__init__(self, width, height, **kwargs)`



---

#### `class AnnularSector(VMobject)`

Creates an annular sector.
Parameters
-----
inner_radius : float
    Inner radius of the annular sector
outer_radius : float
    Outer radius of the annular sector
start_angle : float
    Starting angle of the annular sector (Angles are measured counter-clockwise)
angle : float
    Angle subtended at the center of the annular sector (Angles are measured counter-clockwise)
arc_center : array_like
    Coordinates of center of the annular sector
Examples :
        annularSector = AnnularSector(inner_radius=1, outer_radius=2, angle=TAU/2, start_angle=TAU*3/4, arc_center=(1,-2,0))
Returns
-----
out : AnnularSector object
    An AnnularSector object satisfying the specified parameters

**Methods:**

- `__init__(self, angle, start_angle, inner_radius, outer_radius, arc_center, fill_color, fill_opacity, stroke_width, **kwargs)`



---

#### `class Sector(AnnularSector)`

Creates a sector.
Parameters
-----
outer_radius : float
    Radius of the sector
start_angle : float
    Starting angle of the sector in radians. (Angles are measured counter-clockwise)
angle : float
    Angle subtended by the sector at its center in radians. (Angles are measured counter-clockwise)
arc_center : array_like
    Coordinates of center of the sector
Examples :
        sector = Sector(outer_radius=1, start_angle=TAU/3, angle=TAU/2, arc_center=[0,3,0])
        sector = Sector(outer_radius=3, start_angle=TAU/4, angle=TAU/4, arc_center=ORIGIN, color=PINK)
Returns
-----
out : Sector object
    An Sector object satisfying the specified parameters

**Methods:**

- `__init__(self, angle, radius, **kwargs)`



---

#### `class Annulus(VMobject)`

Creates an annulus.
Parameters
-----
inner_radius : float
    Inner radius of the annulus
outer_radius : float
    Outer radius of the annulus
arc_center : array_like
    Coordinates of center of the annulus
Examples :
        annulus = Annulus(inner_radius=2, outer_radius=3, arc_center=(1, -1, 0))
        annulus = Annulus(inner_radius=2, outer_radius=3, stroke_width=20, stroke_color=RED, fill_color=BLUE, arc_center=ORIGIN)
Returns
-----
out : Annulus object
    An Annulus object satisfying the specified parameters

**Methods:**

- `__init__(self, inner_radius, outer_radius, fill_opacity, stroke_width, fill_color, center, **kwargs)`



---

#### `class Line(TipableVMobject)`

Creates a line joining the points "start" and "end".
Parameters
-----
start : array_like
    Starting point of the line
end : array_like
    Ending point of the line
Examples :
        line = Line((0, 0, 0), (3, 0, 0))
        line = Line((1, 2, 0), (-2, -3, 0), color=BLUE)
Returns
-----
out : Line object
    A Line object satisfying the specified parameters

**Methods:**

- `__init__(self, start, end, buff, path_arc, **kwargs)`


- `set_points_by_ends(self, start, end, buff, path_arc)`


- `reset_points_around_ends(self)`


- `set_path_arc(self, path_arc)`


- `set_start_and_end_attrs(self, start, end)`


- `pointify(self, mob_or_point, direction)`

  Take an argument passed into Line (or subclass) and turn
  it into a 3d point.

- `put_start_and_end_on(self, start, end)`


- `get_vector(self)`


- `get_unit_vector(self)`


- `get_angle(self)`


- `get_projection(self, point)`

  Return projection of a point onto the line

- `get_slope(self)`


- `set_angle(self, angle, about_point)`


- `set_length(self, length, **kwargs)`


- `get_arc_length(self)`


- `set_perpendicular_to_camera(self, camera_frame)`



---

#### `class DashedLine(Line)`

Creates a dashed line joining the points "start" and "end".
Parameters
-----
start : array_like
    Starting point of the dashed line
end : array_like
    Ending point of the dashed line
dash_length : float
    length of each dash
Examples :
        line = DashedLine((0, 0, 0), (3, 0, 0))
        line = DashedLine((1, 2, 3), (4, 5, 6), dash_length=0.01)
Returns
-----
out : DashedLine object
    A DashedLine object satisfying the specified parameters

**Methods:**

- `__init__(self, start, end, dash_length, positive_space_ratio, **kwargs)`


- `calculate_num_dashes(self, dash_length, positive_space_ratio)`


- `get_start(self)`


- `get_end(self)`


- `get_start_and_end(self)`


- `get_first_handle(self)`


- `get_last_handle(self)`



---

#### `class TangentLine(Line)`

Creates a tangent line to the specified vectorized math object.
Parameters
-----
vmob : VMobject object
    Vectorized math object which the line will be tangent to
alpha : float
    Point on the perimeter of the vectorized math object. It takes value between 0 and 1
    both inclusive.
length : float
    Length of the tangent line
Examples :
        circle = Circle(arc_center=ORIGIN, radius=3, color=GREEN)
        tangentLine = TangentLine(vmob=circle, alpha=1/3, length=6, color=BLUE)
Returns
-----
out : TangentLine object
    A TangentLine object satisfying the specified parameters

**Methods:**

- `__init__(self, vmob, alpha, length, d_alpha, **kwargs)`



---

#### `class Elbow(VMobject)`

Creates an elbow. Elbow is an L-shaped shaped object.
Parameters
-----
width : float
    Width of the elbow
angle : float
    Angle of the elbow in radians with the horizontal. (Angles are measured counter-clockwise)
Examples :
        line = Elbow(width=2, angle=TAU/16)
Returns
-----
out : Elbow object
    A Elbow object satisfying the specified parameters

**Methods:**

- `__init__(self, width, angle, **kwargs)`



---

#### `class StrokeArrow(Line)`

*No docstring available.*

**Methods:**

- `__init__(self, start, end, stroke_color, stroke_width, buff, tip_width_ratio, tip_len_to_width, max_tip_length_to_length_ratio, max_width_to_length_ratio, **kwargs)`


- `set_points_by_ends(self, start, end, buff, path_arc)`


- `insert_tip_anchor(self)`


- `create_tip_with_stroke_width(self)`


- `reset_tip(self)`


- `set_stroke(self, color, width, *args, **kwargs)`



---

#### `class Arrow(Line)`

Creates an arrow.

Parameters
----------
start : array_like
    Starting point of the arrow
end : array_like
    Ending point of the arrow
buff : float, optional
    Buffer distance from the start and end points. Default is MED_SMALL_BUFF.
path_arc : float, optional
    If set to a non-zero value, the arrow will be curved to subtend a circle by this angle.
    Default is 0 (straight arrow).
thickness : float, optional
    How wide should the base of the arrow be. This affects the shaft width. Default is 3.0.
tip_width_ratio : float, optional
    Ratio of the tip width to the shaft width. Default is 5.
tip_angle : float, optional
    Angle of the arrow tip in radians. Default is PI/3 (60 degrees).
max_tip_length_to_length_ratio : float, optional
    Maximum ratio of tip length to total arrow length. Prevents tips from being too large
    relative to the arrow. Default is 0.5.
max_width_to_length_ratio : float, optional
    Maximum ratio of arrow width to total arrow length. Prevents arrows from being too wide
    relative to their length. Default is 0.1.
**kwargs
    Additional keyword arguments passed to the parent Line class.

Examples
--------
>>> arrow = Arrow((0, 0, 0), (3, 0, 0))
>>> curved_arrow = Arrow(LEFT, RIGHT, path_arc=PI/4)
>>> thick_arrow = Arrow(UP, DOWN, thickness=5.0, tip_width_ratio=3)

Returns
-------
Arrow
    An Arrow object satisfying the specified parameters.

**Methods:**

- `__init__(self, start, end, buff, path_arc, fill_color, fill_opacity, stroke_width, thickness, tip_width_ratio, tip_angle, max_tip_length_to_length_ratio, max_width_to_length_ratio, **kwargs)`


- `get_key_dimensions(self, length)`


- `set_points_by_ends(self, start, end, buff, path_arc)`


- `get_start(self)`


- `get_end(self)`


- `get_start_and_end(self)`


- `put_start_and_end_on(self, start, end)`


- `scale(self, *args, **kwargs)`


- `set_thickness(self, thickness)`



---

#### `class Vector(Arrow)`

Creates a vector. Vector is an arrow with start point as ORIGIN
Parameters
-----
direction : array_like
    Coordinates of direction of the arrow
Examples :
        arrow = Vector(direction=LEFT)
Returns
-----
out : Vector object
    A Vector object satisfying the specified parameters

**Methods:**

- `__init__(self, direction, buff, **kwargs)`



---

#### `class CubicBezier(VMobject)`

Creates a cubic Bézier curve.

A cubic Bézier curve is defined by four control points: two anchor points (start and end)
and two handle points that control the curvature. The curve starts at the first anchor
point, is "pulled" toward the handle points, and ends at the second anchor point.

Parameters
----------
a0 : array_like
    First anchor point (starting point of the curve).
h0 : array_like
    First handle point (controls the initial direction and curvature from a0).
h1 : array_like
    Second handle point (controls the final direction and curvature toward a1).
a1 : array_like
    Second anchor point (ending point of the curve).
**kwargs
    Additional keyword arguments passed to the parent VMobject class, such as
    stroke_color, stroke_width, fill_color, fill_opacity, etc.
Returns
-------
CubicBezier
    A CubicBezier object representing the specified cubic Bézier curve.

**Methods:**

- `__init__(self, a0, h0, h1, a1, **kwargs)`



---

#### `class Polygon(VMobject)`

Creates a polygon by joining the specified vertices.
Parameters
-----
*vertices : array_like
    Vertex of the polygon
Examples :
        triangle = Polygon((-3,0,0), (3,0,0), (0,3,0))
Returns
-----
out : Polygon object
    A Polygon object satisfying the specified parameters

**Methods:**

- `__init__(self, *vertices, **kwargs)`


- `get_vertices(self)`


- `round_corners(self, radius)`



---

#### `class Polyline(VMobject)`

*No docstring available.*

**Methods:**

- `__init__(self, *vertices, **kwargs)`



---

#### `class RegularPolygon(Polygon)`

Creates a regular polygon of edge length 1 at the center of the screen.
Parameters
-----
n : int
    Number of vertices of the regular polygon
start_angle : float
    Starting angle of the regular polygon in radians. (Angles are measured counter-clockwise)
Examples :
        pentagon = RegularPolygon(n=5, start_angle=30 * DEGREES)
Returns
-----
out : RegularPolygon object
    A RegularPolygon object satisfying the specified parameters

**Methods:**

- `__init__(self, n, radius, start_angle, **kwargs)`



---

#### `class Triangle(RegularPolygon)`

Creates a triangle of edge length 1 at the center of the screen.
Parameters
-----
start_angle : float
    Starting angle of the triangle in radians. (Angles are measured counter-clockwise)
Examples :
        triangle = Triangle(start_angle=45 * DEGREES)
Returns
-----
out : Triangle object
    A Triangle object satisfying the specified parameters

**Methods:**

- `__init__(self, **kwargs)`



---

#### `class ArrowTip(Triangle)`

*No docstring available.*

**Methods:**

- `__init__(self, angle, width, length, fill_opacity, fill_color, stroke_width, tip_style, **kwargs)`


- `get_base(self)`


- `get_tip_point(self)`


- `get_vector(self)`


- `get_angle(self)`


- `get_length(self)`



---

#### `class Rectangle(Polygon)`

Creates a rectangle at the center of the screen.
Parameters
-----
width : float
    Width of the rectangle
height : float
    Height of the rectangle
Examples :
        rectangle = Rectangle(width=3, height=4, color=BLUE)
Returns
-----
out : Rectangle object
    A Rectangle object satisfying the specified parameters

**Methods:**

- `__init__(self, width, height, **kwargs)`


- `surround(self, mobject, buff)`



---

#### `class Square(Rectangle)`

Creates a square at the center of the screen.
Parameters
-----
side_length : float
    Edge length of the square
Examples :
        square = Square(side_length=5, color=PINK)
Returns
-----
out : Square object
    A Square object satisfying the specified parameters

**Methods:**

- `__init__(self, side_length, **kwargs)`



---

#### `class RoundedRectangle(Rectangle)`

Creates a rectangle with round edges at the center of the screen.
Parameters
-----
width : float
    Width of the rounded rectangle
height : float
    Height of the rounded rectangle
corner_radius : float
    Corner radius of the rectangle
Examples :
        rRectangle = RoundedRectangle(width=3, height=4, corner_radius=1, color=BLUE)
Returns
-----
out : RoundedRectangle object
    A RoundedRectangle object satisfying the specified parameters

**Methods:**

- `__init__(self, width, height, corner_radius, **kwargs)`



---

## Module: `mobject/boolean_ops.py`

### Classes

#### `class Union(VMobject)`

*No docstring available.*

**Methods:**

- `__init__(self, *vmobjects, **kwargs)`



---

#### `class Difference(VMobject)`

*No docstring available.*

**Methods:**

- `__init__(self, subject, clip, **kwargs)`



---

#### `class Intersection(VMobject)`

*No docstring available.*

**Methods:**

- `__init__(self, *vmobjects, **kwargs)`



---

#### `class Exclusion(VMobject)`

*No docstring available.*

**Methods:**

- `__init__(self, *vmobjects, **kwargs)`



---

## Module: `mobject/three_dimensions.py`

### Functions

#### `square_to_cube_faces(square)`

*No docstring available.*

---


### Classes

#### `class SurfaceMesh(VGroup)`

*No docstring available.*

**Methods:**

- `__init__(self, uv_surface, resolution, stroke_width, stroke_color, normal_nudge, depth_test, joint_type, **kwargs)`


- `init_points(self)`



---

#### `class Sphere(Surface)`

*No docstring available.*

**Methods:**

- `__init__(self, u_range, v_range, resolution, radius, true_normals, clockwise, **kwargs)`


- `uv_func(self, u, v)`



---

#### `class Torus(Surface)`

*No docstring available.*

**Methods:**

- `__init__(self, u_range, v_range, r1, r2, **kwargs)`


- `uv_func(self, u, v)`



---

#### `class Cylinder(Surface)`

*No docstring available.*

**Methods:**

- `__init__(self, u_range, v_range, resolution, height, radius, axis, **kwargs)`


- `init_points(self)`


- `uv_func(self, u, v)`



---

#### `class Cone(Cylinder)`

*No docstring available.*

**Methods:**

- `__init__(self, u_range, v_range, *args, **kwargs)`


- `uv_func(self, u, v)`



---

#### `class Line3D(Cylinder)`

*No docstring available.*

**Methods:**

- `__init__(self, start, end, width, resolution, **kwargs)`



---

#### `class Disk3D(Surface)`

*No docstring available.*

**Methods:**

- `__init__(self, radius, u_range, v_range, resolution, **kwargs)`


- `uv_func(self, u, v)`



---

#### `class Square3D(Surface)`

*No docstring available.*

**Methods:**

- `__init__(self, side_length, u_range, v_range, resolution, **kwargs)`


- `uv_func(self, u, v)`



---

#### `class Cube(SGroup)`

*No docstring available.*

**Methods:**

- `__init__(self, color, opacity, shading, square_resolution, side_length, **kwargs)`



---

#### `class Prism(Cube)`

*No docstring available.*

**Methods:**

- `__init__(self, width, height, depth, **kwargs)`



---

#### `class VGroup3D(VGroup)`

*No docstring available.*

**Methods:**

- `__init__(self, *vmobjects, depth_test, shading, joint_type, **kwargs)`



---

#### `class VCube(VGroup3D)`

*No docstring available.*

**Methods:**

- `__init__(self, side_length, fill_color, fill_opacity, stroke_width, **kwargs)`



---

#### `class VPrism(VCube)`

*No docstring available.*

**Methods:**

- `__init__(self, width, height, depth, **kwargs)`



---

#### `class Dodecahedron(VGroup3D)`

*No docstring available.*

**Methods:**

- `__init__(self, fill_color, fill_opacity, stroke_color, stroke_width, shading, **kwargs)`



---

#### `class Prismify(VGroup3D)`

*No docstring available.*

**Methods:**

- `__init__(self, vmobject, depth, direction, **kwargs)`



---

## Module: `mobject/frame.py`

### Classes

#### `class ScreenRectangle(Rectangle)`

*No docstring available.*

**Methods:**

- `__init__(self, aspect_ratio, height, **kwargs)`



---

#### `class FullScreenRectangle(ScreenRectangle)`

*No docstring available.*

**Methods:**

- `__init__(self, height, fill_color, fill_opacity, stroke_width, **kwargs)`



---

#### `class FullScreenFadeRectangle(FullScreenRectangle)`

*No docstring available.*

**Methods:**

- `__init__(self, stroke_width, fill_color, fill_opacity, **kwargs)`



---

## Module: `mobject/shape_matchers.py`

### Classes

#### `class SurroundingRectangle(Rectangle)`

*No docstring available.*

**Methods:**

- `__init__(self, mobject, buff, color, **kwargs)`


- `surround(self, mobject, buff)`


- `set_buff(self, buff)`



---

#### `class BackgroundRectangle(SurroundingRectangle)`

*No docstring available.*

**Methods:**

- `__init__(self, mobject, color, stroke_width, stroke_opacity, fill_opacity, buff, **kwargs)`


- `pointwise_become_partial(self, mobject, a, b)`


- `set_style(self, stroke_color, stroke_width, fill_color, fill_opacity, family, **kwargs)`


- `get_fill_color(self)`



---

#### `class Cross(VGroup)`

*No docstring available.*

**Methods:**

- `__init__(self, mobject, stroke_color, stroke_width, **kwargs)`



---

#### `class Underline(Line)`

*No docstring available.*

**Methods:**

- `__init__(self, mobject, buff, stroke_color, stroke_width, stretch_factor, **kwargs)`



---
