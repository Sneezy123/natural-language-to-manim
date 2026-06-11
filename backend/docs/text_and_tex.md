# Text, LaTeX & SVGs

This section documents plain text rendering, mathematical formulas via LaTeX (Tex, MathTex), SVGs, drawings, and curly braces.

## Module: `mobject/svg/tex_mobject.py`

### Functions

#### `get_tex_mob_scale_factor()`

*No docstring available.*

---


### Classes

#### `class Tex(StringMobject)`

*No docstring available.*

**Methods:**

- `__init__(self, *tex_strings, font_size, alignment, template, additional_preamble, tex_to_color_map, t2c, isolate, use_labelled_svg, **kwargs)`


- `get_svg_string_by_content(self, content)`


- `@staticmethod
get_command_matches(string)`


- `@staticmethod
get_command_flag(match_obj)`


- `@staticmethod
replace_for_content(match_obj)`


- `@staticmethod
replace_for_matching(match_obj)`


- `@staticmethod
get_attr_dict_from_command_pair(open_command, close_command)`


- `get_configured_items(self)`


- `@staticmethod
get_color_command(rgb_hex)`


- `@staticmethod
get_command_string(attr_dict, is_end, label_hex)`


- `get_content_prefix_and_suffix(self, is_labelled)`


- `get_parts_by_tex(self, selector)`


- `get_part_by_tex(self, selector, index)`


- `set_color_by_tex(self, selector, color)`


- `set_color_by_tex_to_color_map(self, color_map)`


- `get_tex(self)`


- `substr_to_path_count(self, substr)`


- `get_symbol_substrings(self)`


- `make_number_changeable(self, value, index, replace_all, **config)`



---

#### `class TexText(Tex)`

*No docstring available.*


---

## Module: `mobject/svg/text_mobject.py`

### Constants

| Constant | Value |
| --- | --- |
| `DEFAULT_LINE_SPACING_SCALE` | `0.6` |
| `DEFAULT_CANVAS_WIDTH` | `16384` |
| `DEFAULT_CANVAS_HEIGHT` | `16384` |


### Functions

#### `markup_to_svg(markup_str, justify, indent, alignment, line_width)`

*No docstring available.*

---
#### `get_text_mob_scale_factor()`

*No docstring available.*

---
#### `register_font(font_file)`

Temporarily add a font file to Pango's search path.
This searches for the font_file at various places. The order it searches it described below.
1. Absolute path.
2. Downloads dir.

Parameters
----------
font_file :
    The font file to add.
Examples
--------
Use ``with register_font(...)`` to add a font file to search
path.
.. code-block:: python
    with register_font("path/to/font_file.ttf"):
       a = Text("Hello", font="Custom Font Name")
Raises
------
FileNotFoundError:
    If the font doesn't exists.
AttributeError:
    If this method is used on macOS.
Notes
-----
This method of adding font files also works with :class:`CairoText`.
.. important ::
    This method is available for macOS for ``ManimPango>=v0.2.3``. Using this
    method with previous releases will raise an :class:`AttributeError` on macOS.

---


### Classes

#### `class MarkupText(StringMobject)`

*No docstring available.*

**Methods:**

- `__init__(self, text, font_size, height, justify, indent, alignment, line_width, font, slant, weight, gradient, line_spacing_height, text2color, text2font, text2gradient, text2slant, text2weight, lsh, t2c, t2f, t2g, t2s, t2w, global_config, local_configs, disable_ligatures, isolate, **kwargs)`


- `get_svg_string_by_content(self, content)`


- `@staticmethod
escape_markup_char(substr)`


- `@staticmethod
unescape_markup_char(substr)`


- `@staticmethod
get_command_matches(string)`


- `@staticmethod
get_command_flag(match_obj)`


- `@staticmethod
replace_for_content(match_obj)`


- `@staticmethod
replace_for_matching(match_obj)`


- `@staticmethod
get_attr_dict_from_command_pair(open_command, close_command)`


- `get_configured_items(self)`


- `@staticmethod
get_command_string(attr_dict, is_end, label_hex)`


- `get_content_prefix_and_suffix(self, is_labelled)`


- `get_parts_by_text(self, selector)`


- `get_part_by_text(self, selector, **kwargs)`


- `set_color_by_text(self, selector, color)`


- `set_color_by_text_to_color_map(self, color_map)`


- `get_text(self)`



---

#### `class Text(MarkupText)`

*No docstring available.*

**Methods:**

- `__init__(self, text, isolate, use_labelled_svg, path_string_config, **kwargs)`


- `@staticmethod
get_command_matches(string)`


- `@staticmethod
get_command_flag(match_obj)`


- `@staticmethod
replace_for_content(match_obj)`


- `@staticmethod
replace_for_matching(match_obj)`



---

#### `class Code(MarkupText)`

*No docstring available.*

**Methods:**

- `__init__(self, code, font, font_size, lsh, fill_color, stroke_color, language, code_style, **kwargs)`



---

## Module: `mobject/svg/svg_mobject.py`

### Functions

#### `get_svg_content_height(svg_string)`

*No docstring available.*

---


### Classes

#### `class SVGMobject(VMobject)`

*No docstring available.*

**Methods:**

- `__init__(self, file_name, svg_string, should_center, height, width, color, fill_color, fill_opacity, stroke_width, stroke_color, stroke_opacity, svg_default, path_string_config, **kwargs)`


- `init_svg_mobject(self)`


- `@property
hash_seed(self)`


- `mobjects_from_svg_string(self, svg_string)`


- `file_name_to_svg_string(self, file_name)`


- `modify_xml_tree(self, element_tree)`


- `generate_config_style_dict(self)`


- `mobjects_from_svg(self, svg)`


- `@staticmethod
handle_transform(mob, matrix)`


- `@staticmethod
apply_style_to_mobject(mob, shape)`


- `path_to_mobject(self, path, svg)`


- `line_to_mobject(self, line)`


- `rect_to_mobject(self, rect)`


- `ellipse_to_mobject(self, ellipse)`


- `polygon_to_mobject(self, polygon)`


- `polyline_to_mobject(self, polyline)`


- `text_to_mobject(self, text)`



---

#### `class VMobjectFromSVGPath(VMobject)`

*No docstring available.*

**Methods:**

- `__init__(self, path_obj, **kwargs)`


- `init_points(self)`


- `handle_commands(self)`


- `handle_arc(self, arc)`



---

## Module: `mobject/svg/string_mobject.py`

### Classes

#### `class StringMobject(SVGMobject, ABC)`

An abstract base class for `Tex` and `MarkupText`

This class aims to optimize the logic of "slicing submobjects
via substrings". This could be much clearer and more user-friendly
than slicing through numerical indices explicitly.

Users are expected to specify substrings in `isolate` parameter
if they want to do anything with their corresponding submobjects.
`isolate` parameter can be either a string, a `re.Pattern` object,
or a 2-tuple containing integers or None, or a collection of the above.
Note, substrings specified cannot *partly* overlap with each other.

Each instance of `StringMobject` may generate 2 svg files.
The additional one is generated with some color commands inserted,
so that each submobject of the original `SVGMobject` will be labelled
by the color of its paired submobject from the additional `SVGMobject`.

**Methods:**

- `__init__(self, string, fill_color, fill_border_width, stroke_color, stroke_width, base_color, isolate, protect, use_labelled_svg, **kwargs)`


- `get_svg_string(self, is_labelled)`


- `@abstractmethod
get_svg_string_by_content(self, content)`


- `assign_labels_by_color(self, mobjects)`

  Assuming each mobject in the list `mobjects` has a fill color
  meant to represent a numerical label, this assigns those
  those numerical labels to each mobject as an attribute

- `mobjects_from_svg_string(self, svg_string)`


- `rearrange_submobjects_by_positions(self, labelled_submobs, unlabelled_submobs)`

  Rearrange `labeleled_submobjects` so that each submobject
  is labelled by the nearest one of `unlabelled_submobs`.
  The correctness cannot be ensured, since the svg may
  change significantly after inserting color commands.

- `find_spans_by_selector(self, selector)`


- `@staticmethod
span_contains(span_0, span_1)`


- `parse(self)`


- `get_content(self, is_labelled)`


- `@staticmethod
@abstractmethod
get_command_matches(string)`


- `@staticmethod
@abstractmethod
get_command_flag(match_obj)`


- `@staticmethod
@abstractmethod
replace_for_content(match_obj)`


- `@staticmethod
@abstractmethod
replace_for_matching(match_obj)`


- `@staticmethod
@abstractmethod
get_attr_dict_from_command_pair(open_command, close_command)`


- `@abstractmethod
get_configured_items(self)`


- `@staticmethod
@abstractmethod
get_command_string(attr_dict, is_end, label_hex)`


- `@abstractmethod
get_content_prefix_and_suffix(self, is_labelled)`


- `get_submob_indices_list_by_span(self, arbitrary_span)`


- `get_specified_part_items(self)`


- `get_specified_substrings(self)`


- `get_group_part_items(self)`


- `get_submob_indices_lists_by_selector(self, selector)`


- `build_parts_from_indices_lists(self, indices_lists)`


- `build_groups(self)`


- `select_parts(self, selector)`


- `select_part(self, selector, index)`


- `substr_to_path_count(self, substr)`


- `get_symbol_substrings(self)`


- `select_unisolated_substring(self, pattern)`


- `set_parts_color(self, selector, color)`


- `set_parts_color_by_dict(self, color_map)`


- `get_string(self)`



---

## Module: `mobject/svg/brace.py`

### Classes

#### `class Brace(Tex)`

*No docstring available.*

**Methods:**

- `__init__(self, mobject, direction, buff, tex_string, **kwargs)`


- `set_initial_width(self, width)`


- `put_at_tip(self, mob, use_next_to, **kwargs)`


- `get_text(self, text, **kwargs)`


- `get_tex(self, *tex, **kwargs)`


- `get_tip(self)`


- `get_direction(self)`



---

#### `class BraceLabel(VMobject)`

*No docstring available.*

**Methods:**

- `__init__(self, obj, text, brace_direction, label_scale, label_buff, **kwargs)`


- `creation_anim(self, label_anim, brace_anim)`


- `shift_brace(self, obj, **kwargs)`


- `change_label(self, *text, **kwargs)`


- `change_brace_label(self, obj, *text)`


- `copy(self)`



---

#### `class BraceText(BraceLabel)`

*No docstring available.*


---

#### `class LineBrace(Brace)`

*No docstring available.*

**Methods:**

- `__init__(self, line, direction, **kwargs)`



---

## Module: `mobject/svg/drawings.py`

### Classes

#### `class Checkmark(TexTextFromPresetString)`

*No docstring available.*


---

#### `class Exmark(TexTextFromPresetString)`

*No docstring available.*


---

#### `class Lightbulb(SVGMobject)`

*No docstring available.*

**Methods:**

- `__init__(self, height, color, stroke_width, fill_opacity, **kwargs)`



---

#### `class Speedometer(VMobject)`

*No docstring available.*

**Methods:**

- `__init__(self, arc_angle, num_ticks, tick_length, needle_width, needle_height, needle_color, **kwargs)`


- `get_center(self)`


- `get_needle_tip(self)`


- `get_needle_angle(self)`


- `rotate_needle(self, angle)`


- `move_needle_to_velocity(self, velocity)`



---

#### `class Laptop(VGroup)`

*No docstring available.*

**Methods:**

- `__init__(self, width, body_dimensions, screen_thickness, keyboard_width_to_body_width, keyboard_height_to_body_height, screen_width_to_screen_plate_width, key_color_kwargs, fill_opacity, stroke_width, body_color, shaded_body_color, open_angle, **kwargs)`



---

#### `class VideoIcon(SVGMobject)`

*No docstring available.*

**Methods:**

- `__init__(self, width, color, **kwargs)`



---

#### `class VideoSeries(VGroup)`

*No docstring available.*

**Methods:**

- `__init__(self, num_videos, gradient_colors, width, **kwargs)`



---

#### `class Clock(VGroup)`

*No docstring available.*

**Methods:**

- `__init__(self, stroke_color, stroke_width, hour_hand_height, minute_hand_height, tick_length, **kwargs)`



---

#### `class ClockPassesTime(AnimationGroup)`

*No docstring available.*

**Methods:**

- `__init__(self, clock, run_time, hours_passed, rate_func, **kwargs)`



---

#### `class Bubble(VGroup)`

*No docstring available.*

**Methods:**

- `__init__(self, content, buff, filler_shape, pin_point, direction, add_content, fill_color, fill_opacity, stroke_color, stroke_width, **kwargs)`


- `get_body(self, content, direction, buff)`


- `get_tip(self)`


- `get_bubble_center(self)`


- `move_tip_to(self, point)`


- `flip(self, axis, only_body, **kwargs)`


- `pin_to(self, mobject, auto_flip)`


- `position_mobject_inside(self, mobject, buff)`


- `add_content(self, mobject)`


- `write(self, text)`


- `resize_to_content(self, buff)`


- `clear(self)`



---

#### `class SpeechBubble(Bubble)`

*No docstring available.*

**Methods:**

- `__init__(self, content, buff, filler_shape, stem_height_to_bubble_height, stem_top_x_props, **kwargs)`


- `get_body(self, content, direction, buff)`



---

#### `class ThoughtBubble(Bubble)`

*No docstring available.*

**Methods:**

- `__init__(self, content, buff, filler_shape, bulge_radius, bulge_overlap, noise_factor, circle_radii, **kwargs)`


- `get_body(self, content, direction, buff)`



---

#### `class OldSpeechBubble(Bubble)`

*No docstring available.*


---

#### `class DoubleSpeechBubble(Bubble)`

*No docstring available.*


---

#### `class OldThoughtBubble(Bubble)`

*No docstring available.*

**Methods:**

- `get_body(self, content, direction, buff)`


- `make_green_screen(self)`



---

#### `class VectorizedEarth(SVGMobject)`

*No docstring available.*

**Methods:**

- `__init__(self, height, **kwargs)`



---

#### `class Piano(VGroup)`

*No docstring available.*

**Methods:**

- `__init__(self, n_white_keys, black_pattern, white_keys_per_octave, white_key_dims, black_key_dims, key_buff, white_key_color, black_key_color, total_width, **kwargs)`


- `add_white_keys(self)`


- `add_black_keys(self)`


- `sort_keys(self)`



---

#### `class Piano3D(VGroup)`

*No docstring available.*

**Methods:**

- `__init__(self, shading, stroke_width, stroke_color, key_depth, black_key_shift, piano_2d_config, **kwargs)`



---

#### `class DieFace(VGroup)`

*No docstring available.*

**Methods:**

- `__init__(self, value, side_length, corner_radius, stroke_color, stroke_width, fill_color, dot_radius, dot_color, dot_coalesce_factor)`



---

#### `class Dartboard(VGroup)`

*No docstring available.*

**Methods:**

- `__init__(self, **kwargs)`



---
