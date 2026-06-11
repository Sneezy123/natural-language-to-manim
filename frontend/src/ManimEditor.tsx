import { useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import type { OnMount, BeforeMount } from "@monaco-editor/react";
import type * as Monaco from "monaco-editor";

interface ManimEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
}

// ─── Manim 3b1b Autocomplete Definitions ──────────────────────────────────────

const MANIM_CLASSES = [
  // Scene types
  {
    label: "Scene",
    detail: "Base scene class",
    docs: "The foundational scene class. All manim animations start by subclassing Scene.\n\nUsage:\n```python\nclass MyScene(Scene):\n    def construct(self):\n        ...\n```",
  },
  {
    label: "ThreeDScene",
    detail: "3D scene class",
    docs: "Scene with 3D camera capabilities.",
  },
  {
    label: "InteractiveScene",
    detail: "Interactive scene",
    docs: "Enables interactive mode with keyboard/mouse control.",
  },

  // Geometry Mobjects
  {
    label: "Circle",
    detail: "Circle(radius=1, color=WHITE, **kwargs)",
    docs: "Creates a circle.\n\n**Parameters**\n- `radius` (float): radius of circle\n- `color`: stroke color\n- `fill_opacity` (float): fill transparency\n- `fill_color`: fill color\n\n**Example**\n```python\ncircle = Circle(radius=2, color=BLUE, fill_opacity=0.5)\n```",
  },
  {
    label: "Dot",
    detail: "Dot(point=ORIGIN, radius=0.08, **kwargs)",
    docs: "A small filled circle used as a point.\n\n**Parameters**\n- `point` (np.ndarray): position in 3D space\n- `radius` (float): radius of the dot\n- `color`: color of the dot",
  },
  {
    label: "Square",
    detail: "Square(side_length=2, **kwargs)",
    docs: "Creates a square.\n\n**Parameters**\n- `side_length` (float): side length\n\n**Example**\n```python\nsquare = Square(side_length=3, color=RED)\n```",
  },
  {
    label: "Rectangle",
    detail: "Rectangle(width=4, height=2, **kwargs)",
    docs: "Creates a rectangle.\n\n**Parameters**\n- `width` (float): width\n- `height` (float): height",
  },
  {
    label: "Triangle",
    detail: "Triangle(**kwargs)",
    docs: "An equilateral triangle.",
  },
  {
    label: "RegularPolygon",
    detail: "RegularPolygon(n=6, **kwargs)",
    docs: "A regular n-sided polygon.\n\n**Parameters**\n- `n` (int): number of sides",
  },
  {
    label: "Polygon",
    detail: "Polygon(*vertices, **kwargs)",
    docs: "A polygon from vertex coordinates.\n\n**Example**\n```python\npoly = Polygon(LEFT, RIGHT, UP)\n```",
  },
  {
    label: "Line",
    detail: "Line(start=LEFT, end=RIGHT, **kwargs)",
    docs: "A straight line between two points.\n\n**Parameters**\n- `start` (np.ndarray): starting point\n- `end` (np.ndarray): ending point\n- `stroke_width` (float): line thickness",
  },
  {
    label: "Arrow",
    detail: "Arrow(start=LEFT, end=RIGHT, **kwargs)",
    docs: "An arrow with an arrowhead.\n\n**Parameters**\n- `start` (np.ndarray): tail\n- `end` (np.ndarray): tip (arrowhead here)\n- `buff` (float): buffer between endpoints",
  },
  {
    label: "DoubleArrow",
    detail: "DoubleArrow(start=LEFT, end=RIGHT, **kwargs)",
    docs: "Arrow with arrowheads on both ends.",
  },
  {
    label: "Vector",
    detail: "Vector(direction=RIGHT, **kwargs)",
    docs: "An arrow from the origin.\n\n**Parameters**\n- `direction` (np.ndarray): direction and magnitude",
  },
  {
    label: "Arc",
    detail: "Arc(start_angle=0, angle=TAU/4, radius=1, **kwargs)",
    docs: "A circular arc.\n\n**Parameters**\n- `start_angle` (float): starting angle in radians\n- `angle` (float): arc span in radians\n- `radius` (float): arc radius",
  },
  {
    label: "ArcBetweenPoints",
    detail: "ArcBetweenPoints(start, end, angle=TAU/4, **kwargs)",
    docs: "Arc between two specific points.",
  },
  {
    label: "CurvedArrow",
    detail: "CurvedArrow(start_point, end_point, **kwargs)",
    docs: "A curved arrow between two points.",
  },
  {
    label: "Ellipse",
    detail: "Ellipse(width=2, height=1, **kwargs)",
    docs: "An ellipse shape.",
  },
  {
    label: "Annulus",
    detail: "Annulus(inner_radius=1, outer_radius=2, **kwargs)",
    docs: "A ring/annulus shape.",
  },
  {
    label: "DashedLine",
    detail: "DashedLine(start, end, **kwargs)",
    docs: "A dashed version of Line.",
  },
  {
    label: "TangentLine",
    detail: "TangentLine(vmob, alpha, **kwargs)",
    docs: "A tangent line to a VMobject at a given alpha.",
  },
  {
    label: "RoundedRectangle",
    detail: "RoundedRectangle(corner_radius=0.5, **kwargs)",
    docs: "A rectangle with rounded corners.",
  },
  {
    label: "Sector",
    detail: "Sector(outer_radius=1, inner_radius=0, **kwargs)",
    docs: "A sector/pie-slice shape.",
  },

  // 3D Geometry
  {
    label: "Sphere",
    detail: "Sphere(radius=1, resolution=(24, 24), **kwargs)",
    docs: "A 3D sphere surface.\n\n**Parameters**\n- `radius` (float): radius\n- `resolution` (tuple): mesh resolution",
  },
  {
    label: "Cube",
    detail: "Cube(side_length=2, **kwargs)",
    docs: "A 3D cube.",
  },
  {
    label: "Prism",
    detail: "Prism(dimensions=[3, 2, 1], **kwargs)",
    docs: "A 3D rectangular prism.",
  },
  {
    label: "Cylinder",
    detail: "Cylinder(radius=1, height=2, **kwargs)",
    docs: "A 3D cylinder.",
  },
  {
    label: "Cone",
    detail: "Cone(base_radius=1, height=2, **kwargs)",
    docs: "A 3D cone.",
  },
  {
    label: "Torus",
    detail: "Torus(r1=1, r2=0.25, **kwargs)",
    docs: "A 3D torus (donut shape).",
  },
  {
    label: "ParametricSurface",
    detail: "ParametricSurface(uv_func, **kwargs)",
    docs: "A surface defined parametrically.\n\n**Example**\n```python\nsurf = ParametricSurface(\n    lambda u, v: np.array([np.cos(u)*np.cos(v), np.cos(u)*np.sin(v), np.sin(u)])\n)\n```",
  },

  // Text & Tex
  {
    label: "Text",
    detail: "Text(text, font_size=48, color=WHITE, **kwargs)",
    docs: "Renders plain text using a font.\n\n**Parameters**\n- `text` (str): the text string\n- `font_size` (float): font size in points\n- `color`: text color\n- `font` (str): font family name\n- `weight` (str): 'BOLD', 'NORMAL', etc.\n- `t2c` (dict): text-to-color mapping\n\n**Example**\n```python\ntitle = Text(\"Hello World\", font_size=60, color=BLUE)\n```",
  },
  {
    label: "Tex",
    detail: "Tex(tex_string, **kwargs)",
    docs: 'Renders LaTeX math using TeX.\n\n**Example**\n```python\nformula = Tex(r"e^{i\\pi} + 1 = 0")\n```',
  },
  {
    label: "MathTex",
    detail: "MathTex(*tex_strings, **kwargs)",
    docs: 'Renders LaTeX in math mode. Multiple strings are joined.\n\n**Example**\n```python\neq = MathTex(r"\\int_0^1 x^2 dx", "=", r"\\frac{1}{3}")\n```',
  },
  {
    label: "TexText",
    detail: "TexText(*strings, **kwargs)",
    docs: "Renders text-mode LaTeX (uses \\\\text{} internally).",
  },
  {
    label: "Integer",
    detail: "Integer(number, **kwargs)",
    docs: "A Tex mobject representing an integer.",
  },
  {
    label: "DecimalNumber",
    detail: "DecimalNumber(number=0, num_decimal_places=2, **kwargs)",
    docs: "A number display that can update dynamically.",
  },
  {
    label: "Variable",
    detail: "Variable(var, label, **kwargs)",
    docs: "Displays a variable with a label and dynamic value.",
  },

  // Coordinate Systems
  {
    label: "Axes",
    detail: "Axes(x_range, y_range, **kwargs)",
    docs: 'A 2D axis system.\n\n**Parameters**\n- `x_range` ([min, max, step]): x axis range\n- `y_range` ([min, max, step]): y axis range\n- `axis_config` (dict): axis styling\n\n**Example**\n```python\naxes = Axes(\n    x_range=[-3, 3, 1],\n    y_range=[-2, 2, 1],\n    axis_config={"color": BLUE}\n)\ngraph = axes.get_graph(lambda x: x**2, color=RED)\n```',
  },
  {
    label: "ThreeDAxes",
    detail: "ThreeDAxes(**kwargs)",
    docs: "3D coordinate axes.",
  },
  {
    label: "NumberPlane",
    detail: "NumberPlane(x_range, y_range, **kwargs)",
    docs: "A coordinate plane with grid lines.\n\n**Example**\n```python\nplane = NumberPlane()\nplane.add_coordinates()\n```",
  },
  {
    label: "ComplexPlane",
    detail: "ComplexPlane(**kwargs)",
    docs: "A number plane for displaying complex numbers.",
  },
  {
    label: "NumberLine",
    detail: "NumberLine(x_range=[-5, 5, 1], **kwargs)",
    docs: "A number line.\n\n**Parameters**\n- `x_range` ([min, max, step]): range and tick spacing\n- `include_numbers` (bool): show tick labels\n- `include_tip` (bool): show arrow tip",
  },

  // Grouping
  {
    label: "VGroup",
    detail: "VGroup(*vmobjects)",
    docs: "Group vectorized mobjects together.\n\n**Example**\n```python\ngroup = VGroup(circle, square, triangle)\ngroup.arrange(RIGHT, buff=0.5)\n```",
  },
  {
    label: "Group",
    detail: "Group(*mobjects)",
    docs: "Group any mobjects (not just VMobjects).",
  },

  // Brace
  {
    label: "Brace",
    detail: "Brace(mobject, direction=DOWN, **kwargs)",
    docs: 'A curly brace under/over/beside a mobject.\n\n**Parameters**\n- `mobject`: the object to brace\n- `direction`: UP, DOWN, LEFT, or RIGHT\n\n**Example**\n```python\nbrace = Brace(formula, DOWN)\nlabel = brace.get_text("Area")\n```',
  },

  // ValueTracker
  {
    label: "ValueTracker",
    detail: "ValueTracker(value=0)",
    docs: "Tracks a numeric value for use with updaters.\n\n**Example**\n```python\ntracker = ValueTracker(0)\ncircle.add_updater(lambda m: m.move_to(tracker.get_value() * RIGHT))\n```",
  },

  // Matrix
  {
    label: "Matrix",
    detail: "Matrix(matrix, **kwargs)",
    docs: "Displays a matrix.\n\n**Example**\n```python\nm = Matrix([[1, 2], [3, 4]])\n```",
  },
  {
    label: "IntegerMatrix",
    detail: "IntegerMatrix(matrix, **kwargs)",
    docs: "Matrix with integer entries.",
  },
  {
    label: "DecimalMatrix",
    detail: "DecimalMatrix(matrix, **kwargs)",
    docs: "Matrix with decimal entries.",
  },

  // Probability
  {
    label: "SampleSpace",
    detail: "SampleSpace(**kwargs)",
    docs: "Represents a probability sample space.",
  },

  // Vector Field
  {
    label: "VectorField",
    detail: "VectorField(func, **kwargs)",
    docs: "Displays a 2D vector field.\n\n**Example**\n```python\nfield = VectorField(lambda p: np.array([-p[1], p[0], 0]))\n```",
  },
  {
    label: "StreamLines",
    detail: "StreamLines(func, **kwargs)",
    docs: "Animated stream lines for a vector field.",
  },

  // SVG/Image
  {
    label: "SVGMobject",
    detail: "SVGMobject(file_name, **kwargs)",
    docs: "Import an SVG file as a mobject.",
  },
  {
    label: "ImageMobject",
    detail: "ImageMobject(filename_or_array, **kwargs)",
    docs: 'Display an image.\n\n**Example**\n```python\nimg = ImageMobject("photo.png")\nimg.set_height(3)\n```',
  },

  // Shape Matchers
  {
    label: "SurroundingRectangle",
    detail: "SurroundingRectangle(mobject, **kwargs)",
    docs: "A rectangle that surrounds a mobject.\n\n**Example**\n```python\nbox = SurroundingRectangle(formula, color=YELLOW)\n```",
  },
  {
    label: "BackgroundRectangle",
    detail: "BackgroundRectangle(mobject, **kwargs)",
    docs: "A filled rectangle behind a mobject.",
  },
  {
    label: "Cross",
    detail: "Cross(mobject, **kwargs)",
    docs: "An X cross over a mobject.",
  },
  {
    label: "Underline",
    detail: "Underline(mobject, **kwargs)",
    docs: "Underline beneath a mobject.",
  },
];

const MANIM_ANIMATIONS = [
  {
    label: "Write",
    detail: "Write(mobject, run_time=None, **kwargs)",
    docs: "Animate the writing/drawing of a mobject.\n\n**Example**\n```python\nself.play(Write(text))\n```",
  },
  {
    label: "DrawBorderThenFill",
    detail: "DrawBorderThenFill(vmobject, **kwargs)",
    docs: "Draw the outline then fill the shape.",
  },
  {
    label: "ShowCreation",
    detail: "ShowCreation(mobject, **kwargs)",
    docs: "Animate creating a mobject by tracing its path.",
  },
  {
    label: "Uncreate",
    detail: "Uncreate(mobject, **kwargs)",
    docs: "Reverse of ShowCreation - erases the mobject.",
  },
  {
    label: "ShowPassingFlash",
    detail: "ShowPassingFlash(mobject, time_width=0.1, **kwargs)",
    docs: "Flash of color traveling along a path.",
  },
  {
    label: "FadeIn",
    detail: "FadeIn(mobject, shift=ORIGIN, scale=1, **kwargs)",
    docs: "Fade a mobject in.\n\n**Example**\n```python\nself.play(FadeIn(circle, shift=UP))\n```",
  },
  {
    label: "FadeOut",
    detail: "FadeOut(mobject, shift=ORIGIN, **kwargs)",
    docs: "Fade a mobject out.",
  },
  {
    label: "FadeInFromPoint",
    detail: "FadeInFromPoint(mobject, point, **kwargs)",
    docs: "Fade in from a specific point.",
  },
  {
    label: "FadeOutToPoint",
    detail: "FadeOutToPoint(mobject, point, **kwargs)",
    docs: "Fade out to a specific point.",
  },
  {
    label: "GrowFromPoint",
    detail: "GrowFromPoint(mobject, point, **kwargs)",
    docs: "Grow a mobject from a single point.",
  },
  {
    label: "GrowFromCenter",
    detail: "GrowFromCenter(mobject, **kwargs)",
    docs: "Grow a mobject from its center.",
  },
  {
    label: "GrowFromEdge",
    detail: "GrowFromEdge(mobject, edge, **kwargs)",
    docs: "Grow from a specific edge direction.",
  },
  {
    label: "GrowArrow",
    detail: "GrowArrow(arrow, **kwargs)",
    docs: "Grow an arrow from its tail to tip.",
  },
  {
    label: "SpinInFromNothing",
    detail: "SpinInFromNothing(mobject, **kwargs)",
    docs: "Spin the mobject in as it fades in.",
  },
  {
    label: "Transform",
    detail: "Transform(mobject, target_mobject, **kwargs)",
    docs: "Morph one mobject into another.\n\n**Example**\n```python\nself.play(Transform(circle, square))\n```",
  },
  {
    label: "ReplacementTransform",
    detail: "ReplacementTransform(mobject, target_mobject, **kwargs)",
    docs: "Transform and replace the source mobject in the scene.",
  },
  {
    label: "TransformFromCopy",
    detail: "TransformFromCopy(mobject, target_mobject, **kwargs)",
    docs: "Transform a copy of the source mobject.",
  },
  {
    label: "ClockwiseTransform",
    detail: "ClockwiseTransform(mobject, target, **kwargs)",
    docs: "Transform with clockwise path.",
  },
  {
    label: "CounterclockwiseTransform",
    detail: "CounterclockwiseTransform(mobject, target, **kwargs)",
    docs: "Transform with counterclockwise path.",
  },
  {
    label: "MoveToTarget",
    detail: "MoveToTarget(mobject, **kwargs)",
    docs: "Animate moving a mobject to its `.target` copy.\n\n**Example**\n```python\nmob.generate_target()\nmob.target.shift(RIGHT * 2)\nself.play(MoveToTarget(mob))\n```",
  },
  {
    label: "ApplyMethod",
    detail: "ApplyMethod(method, *args, **kwargs)",
    docs: "Apply a method call as an animation.",
  },
  {
    label: "ApplyFunction",
    detail: "ApplyFunction(function, mobject, **kwargs)",
    docs: "Apply a point-mapping function as an animation.",
  },
  {
    label: "ApplyMatrix",
    detail: "ApplyMatrix(matrix, mobject, **kwargs)",
    docs: "Apply a linear transformation matrix.",
  },
  {
    label: "Rotate",
    detail: "Rotate(mobject, angle=PI, axis=OUT, **kwargs)",
    docs: "Rotate a mobject.\n\n**Parameters**\n- `angle` (float): rotation angle in radians\n- `axis` (np.ndarray): rotation axis (3D)\n- `about_point`: center of rotation\n\n**Example**\n```python\nself.play(Rotate(square, PI/2))\n```",
  },
  {
    label: "Homotopy",
    detail: "Homotopy(homotopy, mobject, **kwargs)",
    docs: "Apply a homotopy (continuous deformation) to a mobject.",
  },
  {
    label: "ComplexHomotopy",
    detail: "ComplexHomotopy(complex_homotopy, mobject, **kwargs)",
    docs: "Homotopy defined on the complex plane.",
  },
  {
    label: "PhaseFlow",
    detail: "PhaseFlow(func, mobject, **kwargs)",
    docs: "Animate flow along a vector field.",
  },
  {
    label: "MoveAlongPath",
    detail: "MoveAlongPath(mobject, path, **kwargs)",
    docs: "Move a mobject along a path.\n\n**Example**\n```python\nself.play(MoveAlongPath(dot, arc))\n```",
  },
  {
    label: "Indicate",
    detail: "Indicate(mobject, **kwargs)",
    docs: "Flash-highlight a mobject to draw attention.",
  },
  {
    label: "Flash",
    detail: "Flash(point, line_length=0.2, **kwargs)",
    docs: "Radial flash of lines from a point.",
  },
  {
    label: "ShowCreationThenFadeOut",
    detail: "ShowCreationThenFadeOut(mobject, **kwargs)",
    docs: "Create then immediately fade out.",
  },
  {
    label: "ShowCreationThenDestructionAround",
    detail: "ShowCreationThenDestructionAround(mobject, **kwargs)",
    docs: "Flash outline around a mobject.",
  },
  {
    label: "Wiggle",
    detail: "Wiggle(mobject, **kwargs)",
    docs: "Wiggle a mobject back and forth.",
  },
  {
    label: "Circumscribe",
    detail: "Circumscribe(mobject, shape=Rectangle, **kwargs)",
    docs: "Draw a shape around a mobject then fade it.",
  },
  {
    label: "AnimationGroup",
    detail: "AnimationGroup(*animations, lag_ratio=0, **kwargs)",
    docs: "Group multiple animations.\n\n**Parameters**\n- `lag_ratio` (float): 0=simultaneous, 1=sequential\n\n**Example**\n```python\nself.play(AnimationGroup(\n    FadeIn(title),\n    Write(subtitle),\n    lag_ratio=0.5\n))\n```",
  },
  {
    label: "Succession",
    detail: "Succession(*animations, **kwargs)",
    docs: "Run animations one after another.",
  },
  {
    label: "LaggedStart",
    detail: "LaggedStart(*animations, lag_ratio=0.2, **kwargs)",
    docs: "Run animations with a staggered delay.",
  },
  {
    label: "LaggedStartMap",
    detail: "LaggedStartMap(anim_func, mobject, **kwargs)",
    docs: "Apply an animation to each submobject with lag.",
  },
  {
    label: "ChangeDecimalToValue",
    detail: "ChangeDecimalToValue(decimal_number, target_value, **kwargs)",
    docs: "Animate a DecimalNumber changing value.",
  },
  {
    label: "ChangingDecimal",
    detail: "ChangingDecimal(decimal_number, number_update_func, **kwargs)",
    docs: "Animate decimal number with a custom update function.",
  },
  {
    label: "CountInFrom",
    detail: "CountInFrom(decimal_number, source_number=0, **kwargs)",
    docs: "Count in from a starting number.",
  },
  {
    label: "UpdateFromFunc",
    detail: "UpdateFromFunc(mobject, update_function, **kwargs)",
    docs: "Continuously update a mobject with a function.",
  },
  {
    label: "UpdateFromAlphaFunc",
    detail: "UpdateFromAlphaFunc(mobject, update_function, **kwargs)",
    docs: "Update using an alpha (0→1) parameter.",
  },
];

const MANIM_SCENE_METHODS = [
  {
    label: "play",
    detail: "self.play(*animations, run_time=1, rate_func=smooth, **kwargs)",
    docs: "Play one or more animations.\n\n**Parameters**\n- `*animations`: Animation objects\n- `run_time` (float): duration in seconds\n- `rate_func`: easing function\n\n**Example**\n```python\nself.play(ShowCreation(circle), run_time=2)\n```",
  },
  {
    label: "wait",
    detail: "self.wait(duration=1)",
    docs: "Pause the animation.\n\n**Parameters**\n- `duration` (float): seconds to wait",
  },
  {
    label: "add",
    detail: "self.add(*mobjects)",
    docs: "Add mobjects to the scene without animation.",
  },
  {
    label: "remove",
    detail: "self.remove(*mobjects)",
    docs: "Remove mobjects from the scene.",
  },
  {
    label: "clear",
    detail: "self.clear()",
    docs: "Remove all mobjects from the scene.",
  },
  {
    label: "bring_to_front",
    detail: "self.bring_to_front(*mobjects)",
    docs: "Move mobjects to the front (rendered last).",
  },
  {
    label: "bring_to_back",
    detail: "self.bring_to_back(*mobjects)",
    docs: "Move mobjects to the back.",
  },
];

const MANIM_MOBJECT_METHODS = [
  {
    label: "shift",
    detail: ".shift(*vectors)",
    docs: "Move by a displacement vector.\n\n**Example**\n```python\nmob.shift(RIGHT * 2 + UP)\n```",
  },
  {
    label: "move_to",
    detail: ".move_to(point_or_mobject, aligned_edge=ORIGIN)",
    docs: "Move center to a point or mobject's position.",
  },
  {
    label: "to_edge",
    detail: ".to_edge(edge, buff=MED_SMALL_BUFF)",
    docs: "Snap to an edge of the frame.\n\n**Example**\n```python\nmob.to_edge(UP)\n```",
  },
  {
    label: "to_corner",
    detail: ".to_corner(corner, buff=MED_SMALL_BUFF)",
    docs: "Snap to a corner of the frame.",
  },
  {
    label: "next_to",
    detail: ".next_to(mobject_or_point, direction=RIGHT, buff=MED_SMALL_BUFF)",
    docs: "Position adjacent to another mobject.\n\n**Example**\n```python\nlabel.next_to(circle, DOWN, buff=0.3)\n```",
  },
  {
    label: "align_to",
    detail: ".align_to(mobject_or_point, direction=ORIGIN)",
    docs: "Align edge to another mobject's edge.",
  },
  {
    label: "set_color",
    detail: ".set_color(color)",
    docs: "Set stroke and fill color.\n\n**Example**\n```python\nmob.set_color(RED)\n```",
  },
  {
    label: "set_fill",
    detail: ".set_fill(color=None, opacity=None)",
    docs: "Set fill color and/or opacity.",
  },
  {
    label: "set_stroke",
    detail: ".set_stroke(color=None, width=None, opacity=None)",
    docs: "Set stroke color, width, and/or opacity.",
  },
  {
    label: "scale",
    detail: ".scale(scale_factor, **kwargs)",
    docs: "Scale by a factor around center.\n\n**Example**\n```python\nmob.scale(2.0)\n```",
  },
  {
    label: "rotate",
    detail: ".rotate(angle, axis=OUT, **kwargs)",
    docs: "Rotate in place.\n\n**Example**\n```python\nmob.rotate(PI/4)\n```",
  },
  {
    label: "flip",
    detail: ".flip(axis=RIGHT, **kwargs)",
    docs: "Flip/mirror over an axis.",
  },
  {
    label: "stretch",
    detail: ".stretch(factor, dim)",
    docs: "Stretch along a dimension (0=x, 1=y, 2=z).",
  },
  {
    label: "set_width",
    detail: ".set_width(width, **kwargs)",
    docs: "Scale to a specific width.",
  },
  {
    label: "set_height",
    detail: ".set_height(height, **kwargs)",
    docs: "Scale to a specific height.",
  },
  {
    label: "set_depth",
    detail: ".set_depth(depth, **kwargs)",
    docs: "Scale to a specific depth (3D).",
  },
  {
    label: "get_center",
    detail: ".get_center()",
    docs: "Return the center point as np.ndarray.",
  },
  {
    label: "get_left",
    detail: ".get_left()",
    docs: "Return the leftmost point.",
  },
  {
    label: "get_right",
    detail: ".get_right()",
    docs: "Return the rightmost point.",
  },
  { label: "get_top", detail: ".get_top()", docs: "Return the topmost point." },
  {
    label: "get_bottom",
    detail: ".get_bottom()",
    docs: "Return the bottommost point.",
  },
  {
    label: "get_width",
    detail: ".get_width()",
    docs: "Return width of bounding box.",
  },
  {
    label: "get_height",
    detail: ".get_height()",
    docs: "Return height of bounding box.",
  },
  {
    label: "copy",
    detail: ".copy()",
    docs: "Return a deep copy of the mobject.",
  },
  {
    label: "become",
    detail: ".become(mobject)",
    docs: "Transform this mobject into another instantly.",
  },
  {
    label: "generate_target",
    detail: ".generate_target()",
    docs: "Create a `.target` copy for use with MoveToTarget.",
  },
  {
    label: "add_updater",
    detail: ".add_updater(func, index=None, call_updater=False)",
    docs: "Add an updater function called every frame.\n\n**Example**\n```python\ncircle.add_updater(lambda m, dt: m.rotate(dt))\n```",
  },
  {
    label: "remove_updater",
    detail: ".remove_updater(func)",
    docs: "Remove a previously added updater.",
  },
  {
    label: "clear_updaters",
    detail: ".clear_updaters()",
    docs: "Remove all updaters from this mobject.",
  },
  {
    label: "arrange",
    detail: ".arrange(direction=RIGHT, buff=MED_SMALL_BUFF, **kwargs)",
    docs: "Arrange submobjects in a row/column.\n\n**Example**\n```python\ngroup = VGroup(c1, c2, c3)\ngroup.arrange(RIGHT, buff=0.5)\n```",
  },
  {
    label: "arrange_in_grid",
    detail: ".arrange_in_grid(n_rows=None, n_cols=None, **kwargs)",
    docs: "Arrange submobjects in a grid.",
  },
  { label: "add", detail: ".add(*mobjects)", docs: "Add submobjects." },
  {
    label: "fade",
    detail: ".fade(darkness=0.5)",
    docs: "Reduce opacity by darkness amount.",
  },
  {
    label: "set_opacity",
    detail: ".set_opacity(opacity)",
    docs: "Set total opacity (0=invisible, 1=full).",
  },
  {
    label: "surround",
    detail:
      ".surround(mobject, dim_to_match=0, stretch=False, buff=MED_SMALL_BUFF)",
    docs: "Make this mobject surround another.",
  },
  {
    label: "get_color",
    detail: ".get_color()",
    docs: "Return the primary color.",
  },
  {
    label: "match_color",
    detail: ".match_color(mobject)",
    docs: "Copy the color from another mobject.",
  },
  {
    label: "match_width",
    detail: ".match_width(mobject, **kwargs)",
    docs: "Scale to match another mobject's width.",
  },
  {
    label: "match_height",
    detail: ".match_height(mobject, **kwargs)",
    docs: "Scale to match another mobject's height.",
  },
];

const MANIM_CONSTANTS = [
  // Directions
  "UP",
  "DOWN",
  "LEFT",
  "RIGHT",
  "ORIGIN",
  "UL",
  "UR",
  "DL",
  "DR",
  "IN",
  "OUT",
  // Colors
  "WHITE",
  "BLACK",
  "RED",
  "GREEN",
  "BLUE",
  "YELLOW",
  "ORANGE",
  "PURPLE",
  "PINK",
  "GOLD",
  "TEAL",
  "GREY",
  "GRAY",
  "GREY_A",
  "GREY_B",
  "GREY_C",
  "GREY_D",
  "GREY_E",
  "MAROON",
  "LIGHT_BROWN",
  "DARK_BROWN",
  "RED_A",
  "RED_B",
  "RED_C",
  "RED_D",
  "RED_E",
  "GREEN_A",
  "GREEN_B",
  "GREEN_C",
  "GREEN_D",
  "GREEN_E",
  "BLUE_A",
  "BLUE_B",
  "BLUE_C",
  "BLUE_D",
  "BLUE_E",
  "YELLOW_A",
  "YELLOW_B",
  "YELLOW_C",
  "YELLOW_D",
  "YELLOW_E",
  "GOLD_A",
  "GOLD_B",
  "GOLD_C",
  "GOLD_D",
  "GOLD_E",
  "TEAL_A",
  "TEAL_B",
  "TEAL_C",
  "TEAL_D",
  "TEAL_E",
  "PURPLE_A",
  "PURPLE_B",
  "PURPLE_C",
  "PURPLE_D",
  "PURPLE_E",
  // Math constants
  "PI",
  "TAU",
  "DEGREES",
  // Buffer sizes
  "SMALL_BUFF",
  "MED_SMALL_BUFF",
  "MED_LARGE_BUFF",
  "LARGE_BUFF",
  // Frame sizes
  "FRAME_HEIGHT",
  "FRAME_WIDTH",
];

const MANIM_RATE_FUNCTIONS = [
  "smooth",
  "linear",
  "rush_into",
  "rush_from",
  "slow_slow",
  "double_smooth",
  "there_and_back",
  "there_and_back_with_pause",
  "running_start",
  "not_quite_there",
  "wiggle",
  "squish_rate_func",
  "ease_in_sine",
  "ease_out_sine",
  "ease_in_out_sine",
  "ease_in_quad",
  "ease_out_quad",
  "ease_in_cubic",
  "ease_out_cubic",
];

// ─── Register Manim Language Support ─────────────────────────────────────────

function setupManimLanguageFeatures(monaco: typeof Monaco) {
  // Register Python completion provider with Manim extras
  monaco.languages.registerCompletionItemProvider("python", {
    triggerCharacters: [".", " ", "("],
    provideCompletionItems(model, position) {
      const word = model.getWordUntilPosition(position);
      const range: Monaco.IRange = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const items: Monaco.languages.CompletionItem[] = [];

      // Check if we're after a dot (method completion)
      const lineContent = model.getLineContent(position.lineNumber);
      const beforeCursor = lineContent.substring(0, position.column - 1);
      const isDotAccess = beforeCursor.endsWith(".");
      const isSelfDot = /self\.$/.test(beforeCursor);

      if (isDotAccess) {
        // Offer mobject methods
        MANIM_MOBJECT_METHODS.forEach((m) => {
          items.push({
            label: m.label,
            kind: monaco.languages.CompletionItemKind.Method,
            detail: m.detail,
            documentation: { value: m.docs, isTrusted: true },
            insertText: m.label + (m.label.includes("(") ? "" : "(${0})"),
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range,
          });
        });

        if (isSelfDot) {
          MANIM_SCENE_METHODS.forEach((m) => {
            items.push({
              label: m.label,
              kind: monaco.languages.CompletionItemKind.Method,
              detail: m.detail,
              documentation: { value: m.docs, isTrusted: true },
              insertText: m.label + "(${0})",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              range,
            });
          });
        }
      } else {
        // Top-level completions
        MANIM_CLASSES.forEach((cls) => {
          items.push({
            label: cls.label,
            kind: monaco.languages.CompletionItemKind.Class,
            detail: cls.detail,
            documentation: { value: cls.docs, isTrusted: true },
            insertText: cls.label,
            range,
          });
        });

        MANIM_ANIMATIONS.forEach((anim) => {
          items.push({
            label: anim.label,
            kind: monaco.languages.CompletionItemKind.Function,
            detail: anim.detail,
            documentation: { value: anim.docs, isTrusted: true },
            insertText: anim.label + "(${0})",
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range,
          });
        });

        MANIM_CONSTANTS.forEach((c) => {
          items.push({
            label: c,
            kind: monaco.languages.CompletionItemKind.Constant,
            detail: "Manim constant",
            insertText: c,
            range,
          });
        });

        MANIM_RATE_FUNCTIONS.forEach((fn) => {
          items.push({
            label: fn,
            kind: monaco.languages.CompletionItemKind.Function,
            detail: "rate_func - easing function",
            insertText: fn,
            range,
          });
        });

        // Scene class snippet
        items.push({
          label: "class ManimScene",
          kind: monaco.languages.CompletionItemKind.Snippet,
          detail: "New Manim Scene skeleton",
          documentation: {
            value: "Creates a complete Manim scene class skeleton.",
            isTrusted: true,
          },
          insertText: [
            "class ${1:MyScene}(Scene):",
            "    def construct(self):",
            "        ${0:pass}",
          ].join("\n"),
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range,
        });

        // Common snippet: self.play
        items.push({
          label: "self.play",
          kind: monaco.languages.CompletionItemKind.Snippet,
          detail: "Play an animation",
          insertText: "self.play(${0})",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range,
        });
      }

      return { suggestions: items };
    },
  });

  // Hover provider for Manim symbols
  monaco.languages.registerHoverProvider("python", {
    provideHover(model, position) {
      const word = model.getWordAtPosition(position);
      if (!word) return null;

      const token = word.word;

      // Check in classes
      const cls = MANIM_CLASSES.find((c) => c.label === token);
      if (cls) {
        return {
          contents: [
            { value: `**${cls.label}** — ${cls.detail}` },
            { value: cls.docs },
          ],
        };
      }

      // Check in animations
      const anim = MANIM_ANIMATIONS.find((a) => a.label === token);
      if (anim) {
        return {
          contents: [
            { value: `**${anim.label}** — ${anim.detail}` },
            { value: anim.docs },
          ],
        };
      }

      // Check in constants
      if (MANIM_CONSTANTS.includes(token)) {
        return {
          contents: [{ value: `\`${token}\` — Manim constant` }],
        };
      }

      return null;
    },
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ManimEditor({
  value,
  onChange,
  height = "100%",
}: ManimEditorProps) {
  const monacoRef = useRef<typeof Monaco | null>(null);

  const handleBeforeMount: BeforeMount = (monaco) => {
    monacoRef.current = monaco;
    setupManimLanguageFeatures(monaco);
  };

  const handleMount: OnMount = (editor, monaco) => {
    // Set editor theme customizations
    monaco.editor.defineTheme("manim-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "64748b", fontStyle: "italic" },
        { token: "keyword", foreground: "c084fc" }, // purple - Python keywords
        { token: "string", foreground: "86efac" }, // green - strings
        { token: "number", foreground: "fb923c" }, // orange - numbers
        { token: "type", foreground: "38bdf8" }, // sky - class names
        { token: "variable", foreground: "e2e8f0" },
        { token: "identifier", foreground: "e2e8f0" },
        { token: "delimiter.parenthesis", foreground: "94a3b8" },
        { token: "delimiter.square", foreground: "94a3b8" },
        { token: "delimiter.curly", foreground: "94a3b8" },
      ],
      colors: {
        "editor.background": "#0b0c10",
        "editor.foreground": "#e2e8f0",
        "editorLineNumber.foreground": "#334155",
        "editorLineNumber.activeForeground": "#7c3aed",
        "editor.lineHighlightBackground": "#131520",
        "editor.selectionBackground": "#7c3aed40",
        "editor.inactiveSelectionBackground": "#7c3aed20",
        "editorCursor.foreground": "#7c3aed",
        "editorIndentGuide.background": "#1e2233",
        "editorIndentGuide.activeBackground": "#7c3aed40",
        "editorWidget.background": "#131520",
        "editorWidget.border": "#1e293b",
        "editorSuggestWidget.background": "#131520",
        "editorSuggestWidget.border": "#1e293b",
        "editorSuggestWidget.selectedBackground": "#7c3aed30",
        "editorSuggestWidget.highlightForeground": "#c084fc",
        "editorHoverWidget.background": "#131520",
        "editorHoverWidget.border": "#1e293b",
        "list.hoverBackground": "#1b1e2e",
        "list.activeSelectionBackground": "#7c3aed40",
        "scrollbarSlider.background": "#1e293b80",
        "scrollbarSlider.hoverBackground": "#1e293bcc",
        "minimap.background": "#0b0c10",
      },
    });
    monaco.editor.setTheme("manim-dark");

    // Add Manim-specific keybindings
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyR, () => {
      // Trigger render via custom event
      window.dispatchEvent(new CustomEvent("manim-render"));
    });

    // Focus editor
    editor.focus();
  };

  useEffect(() => {
    return () => {
      // Cleanup monaco models on unmount to prevent memory leaks
      monacoRef.current?.editor.getModels().forEach((model) => {
        if (model.uri.path === "/manim-scene.py") {
          model.dispose();
        }
      });
    };
  }, []);

  return (
    <Editor
      height={height}
      defaultLanguage="python"
      value={value}
      onChange={(val) => onChange(val ?? "")}
      beforeMount={handleBeforeMount}
      onMount={handleMount}
      path="/manim-scene.py"
      options={{
        fontSize: 13,
        fontFamily:
          "'Fira Code', 'Cascadia Code', 'JetBrains Mono', Consolas, monospace",
        fontLigatures: true,
        lineHeight: 1.7,
        minimap: { enabled: true, scale: 1 },
        scrollBeyondLastLine: false,
        wordWrap: "on",
        automaticLayout: true,
        tabSize: 4,
        insertSpaces: true,
        renderWhitespace: "selection",
        lineNumbers: "on",
        glyphMargin: false,
        folding: true,
        foldingHighlight: true,
        showFoldingControls: "mouseover",
        cursorBlinking: "smooth",
        cursorSmoothCaretAnimation: "on",
        smoothScrolling: true,
        renderLineHighlight: "line",
        bracketPairColorization: { enabled: true },
        guides: { bracketPairs: true, indentation: true },
        suggest: {
          showClasses: true,
          showFunctions: true,
          showConstants: true,
          showSnippets: true,
          showKeywords: true,
          showMethods: true,
          showVariables: true,
          insertMode: "replace",
          preview: true,
          previewMode: "prefix",
        },
        quickSuggestions: {
          other: true,
          comments: false,
          strings: false,
        },
        quickSuggestionsDelay: 50,
        suggestOnTriggerCharacters: true,
        acceptSuggestionOnEnter: "on",
        parameterHints: { enabled: true, cycle: true },
        hover: { enabled: true, delay: 300 },
        inlayHints: { enabled: "on" },
        padding: { top: 12, bottom: 12 },
        scrollbar: {
          verticalScrollbarSize: 8,
          horizontalScrollbarSize: 8,
          useShadows: false,
        },
        overviewRulerLanes: 0,
      }}
    />
  );
}
