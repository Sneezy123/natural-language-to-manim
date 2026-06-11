# Mathematical Display & Utilities

This section documents matrices, number displays, probability distributions, trackers (ValueTracker), and updaters.

## Module: `mobject/numbers.py`

### Functions

#### `char_to_cahced_mob(char, **text_config)`

*No docstring available.*

---


### Classes

#### `class DecimalNumber(VMobject)`

*No docstring available.*

**Methods:**

- `__init__(self, number, color, stroke_width, fill_opacity, fill_border_width, num_decimal_places, min_total_width, include_sign, group_with_commas, digit_buff_per_font_unit, show_ellipsis, unit, include_background_rectangle, hide_zero_components_on_complex, edge_to_fix, font_size, text_config, **kwargs)`


- `set_submobjects_from_number(self, number)`


- `get_num_string(self, number)`


- `char_to_mob(self, char)`


- `interpolate(self, mobject1, mobject2, alpha, path_func)`


- `get_font_size(self)`


- `get_formatter(self, **kwargs)`

  Configuration is based first off instance attributes,
  but overwritten by any kew word argument.  Relevant
  key words:
  - include_sign
  - group_with_commas
  - num_decimal_places
  - field_name (e.g. 0 or 0.real)

- `get_complex_formatter(self, **kwargs)`


- `get_tex(self)`


- `set_value(self, number)`


- `get_value(self)`


- `increment_value(self, delta_t)`



---

#### `class Integer(DecimalNumber)`

*No docstring available.*

**Methods:**

- `__init__(self, number, num_decimal_places, **kwargs)`


- `get_value(self)`



---

## Module: `mobject/matrix.py`

### Classes

#### `class Matrix(VMobject)`

*No docstring available.*

**Methods:**

- `__init__(self, matrix, v_buff, h_buff, bracket_h_buff, bracket_v_buff, height, element_config, element_alignment_corner, ellipses_row, ellipses_col)`

  Matrix can either include numbers, tex_strings,
  or mobjects

- `copy(self, deep)`


- `create_mobject_matrix(self, matrix, v_buff, h_buff, aligned_corner, **element_config)`

  Creates and organizes the matrix of mobjects

- `element_to_mobject(self, element, **config)`


- `create_brackets(self, rows, v_buff, h_buff)`


- `get_column(self, index)`


- `get_row(self, index)`


- `get_columns(self)`


- `get_rows(self)`


- `set_column_colors(self, *colors)`


- `add_background_to_entries(self)`


- `swap_entry_for_dots(self, entry, dots)`


- `swap_entries_for_ellipses(self, row_index, col_index, height_ratio, width_ratio)`


- `get_mob_matrix(self)`


- `get_entries(self)`


- `get_brackets(self)`


- `get_ellipses(self)`



---

#### `class DecimalMatrix(Matrix)`

*No docstring available.*

**Methods:**

- `__init__(self, matrix, num_decimal_places, decimal_config, **config)`


- `element_to_mobject(self, element, **decimal_config)`



---

#### `class IntegerMatrix(DecimalMatrix)`

*No docstring available.*

**Methods:**

- `__init__(self, matrix, num_decimal_places, decimal_config, **config)`



---

#### `class TexMatrix(Matrix)`

*No docstring available.*

**Methods:**

- `__init__(self, matrix, tex_config, **config)`



---

#### `class MobjectMatrix(Matrix)`

*No docstring available.*

**Methods:**

- `__init__(self, group, n_rows, n_cols, height, element_alignment_corner, **config)`


- `element_to_mobject(self, element, **config)`



---

## Module: `mobject/probability.py`

### Constants

| Constant | Value |
| --- | --- |
| `EPSILON` | `0.0001` |


### Classes

#### `class SampleSpace(Rectangle)`

*No docstring available.*

**Methods:**

- `__init__(self, width, height, fill_color, fill_opacity, stroke_width, stroke_color, default_label_scale_val, **kwargs)`


- `add_title(self, title, buff)`


- `add_label(self, label)`


- `complete_p_list(self, p_list)`


- `get_division_along_dimension(self, p_list, dim, colors, vect)`


- `get_horizontal_division(self, p_list, colors, vect)`


- `get_vertical_division(self, p_list, colors, vect)`


- `divide_horizontally(self, *args, **kwargs)`


- `divide_vertically(self, *args, **kwargs)`


- `get_subdivision_braces_and_labels(self, parts, labels, direction, buff)`


- `get_side_braces_and_labels(self, labels, direction, **kwargs)`


- `get_top_braces_and_labels(self, labels, **kwargs)`


- `get_bottom_braces_and_labels(self, labels, **kwargs)`


- `add_braces_and_labels(self)`



---

#### `class BarChart(VGroup)`

*No docstring available.*

**Methods:**

- `__init__(self, values, height, width, n_ticks, include_x_ticks, tick_width, tick_height, label_y_axis, y_axis_label_height, max_value, bar_colors, bar_fill_opacity, bar_stroke_width, bar_names, bar_label_scale_val, **kwargs)`


- `add_axes(self)`


- `add_bars(self, values)`


- `change_bar_values(self, values)`



---

## Module: `mobject/changing.py`

### Classes

#### `class AnimatedBoundary(VGroup)`

*No docstring available.*

**Methods:**

- `__init__(self, vmobject, colors, max_stroke_width, cycle_rate, back_and_forth, draw_rate_func, fade_rate_func, **kwargs)`


- `update_boundary_copies(self, dt)`


- `full_family_become_partial(self, mob1, mob2, a, b)`



---

#### `class TracedPath(VMobject)`

*No docstring available.*

**Methods:**

- `__init__(self, traced_point_func, time_traced, time_per_anchor, stroke_color, stroke_width, stroke_opacity, **kwargs)`


- `update_path(self, dt)`



---

#### `class TracingTail(TracedPath)`

*No docstring available.*

**Methods:**

- `__init__(self, mobject_or_func, time_traced, stroke_color, stroke_width, stroke_opacity, **kwargs)`



---

## Module: `mobject/value_tracker.py`

### Classes

#### `class ValueTracker(Mobject)`

Not meant to be displayed.  Instead the position encodes some
number, often one which another animation or continual_animation
uses for its update function, and by treating it as a mobject it can
still be animated and manipulated just like anything else.

**Methods:**

- `__init__(self, value, **kwargs)`


- `init_uniforms(self)`


- `get_value(self)`


- `set_value(self, value)`


- `increment_value(self, d_value)`



---

#### `class ExponentialValueTracker(ValueTracker)`

Operates just like ValueTracker, except it encodes the value as the
exponential of a position coordinate, which changes how interpolation
behaves

**Methods:**

- `get_value(self)`


- `set_value(self, value)`



---

#### `class ComplexValueTracker(ValueTracker)`

*No docstring available.*


---

## Module: `mobject/mobject_update_utils.py`

### Functions

#### `assert_is_mobject_method(method)`

*No docstring available.*

---
#### `always(method, *args, **kwargs)`

*No docstring available.*

---
#### `f_always(method, *arg_generators, **kwargs)`

More functional version of always, where instead
of taking in args, it takes in functions which output
the relevant arguments.

---
#### `always_redraw(func, *args, **kwargs)`

*No docstring available.*

---
#### `always_shift(mobject, direction, rate)`

*No docstring available.*

---
#### `always_rotate(mobject, rate, **kwargs)`

*No docstring available.*

---
#### `turn_animation_into_updater(animation, cycle, **kwargs)`

Add an updater to the animation's mobject which applies
the interpolation and update functions of the animation

If cycle is True, this repeats over and over.  Otherwise,
the updater will be popped uplon completion

---
#### `cycle_animation(animation, **kwargs)`

*No docstring available.*

---

