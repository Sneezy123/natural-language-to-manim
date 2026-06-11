# Coordinate Systems & Vector Fields

This section documents axes, planes, number lines, coordinate transforms, function plotting, and vector fields.

## Module: `mobject/coordinate_systems.py`

### Constants

| Constant | Value |
| --- | --- |
| `EPSILON` | `1e-08` |
| `DEFAULT_X_RANGE` | `(-8.0, 8.0, 1.0)` |
| `DEFAULT_Y_RANGE` | `(-4.0, 4.0, 1.0)` |


### Functions

#### `full_range_specifier(range_args)`

*No docstring available.*

---


### Classes

#### `class CoordinateSystem(ABC)`

Abstract class for Axes and NumberPlane

**Methods:**

- `__init__(self, x_range, y_range, num_sampled_graph_points_per_tick)`


- `@abstractmethod
coords_to_point(self, *coords)`


- `@abstractmethod
point_to_coords(self, point)`


- `c2p(self, *coords)`

  Abbreviation for coords_to_point

- `p2c(self, point)`

  Abbreviation for point_to_coords

- `get_origin(self)`


- `@abstractmethod
get_axes(self)`


- `@abstractmethod
get_all_ranges(self)`


- `get_axis(self, index)`


- `get_x_axis(self)`


- `get_y_axis(self)`


- `get_z_axis(self)`


- `get_x_axis_label(self, label_tex, edge, direction, **kwargs)`


- `get_y_axis_label(self, label_tex, edge, direction, **kwargs)`


- `get_axis_label(self, label_tex, axis, edge, direction, buff, ensure_on_screen, **kwargs)`


- `get_axis_labels(self, x_label_tex, y_label_tex, **kwargs)`


- `get_line_from_axis_to_point(self, index, point, line_func, color, stroke_width)`


- `get_v_line(self, point, **kwargs)`


- `get_h_line(self, point, **kwargs)`


- `get_graph(self, function, x_range, bind, **kwargs)`


- `get_parametric_curve(self, function, **kwargs)`


- `input_to_graph_point(self, x, graph)`


- `i2gp(self, x, graph)`

  Alias for input_to_graph_point

- `bind_graph_to_func(self, graph, func, jagged, get_discontinuities)`

  Use for graphing functions which might change over time, or change with
  conditions

- `get_graph_label(self, graph, label, x, direction, buff, color)`


- `get_v_line_to_graph(self, x, graph, **kwargs)`


- `get_h_line_to_graph(self, x, graph, **kwargs)`


- `get_scatterplot(self, x_values, y_values, **dot_config)`


- `angle_of_tangent(self, x, graph, dx)`


- `slope_of_tangent(self, x, graph, **kwargs)`


- `get_tangent_line(self, x, graph, length, line_func)`


- `get_riemann_rectangles(self, graph, x_range, dx, input_sample_type, stroke_width, stroke_color, fill_opacity, colors, negative_color, stroke_background, show_signed_area)`


- `get_area_under_graph(self, graph, x_range, fill_color, fill_opacity)`



---

#### `class Axes(VGroup, CoordinateSystem)`

*No docstring available.*

**Methods:**

- `__init__(self, x_range, y_range, axis_config, x_axis_config, y_axis_config, height, width, unit_size, **kwargs)`


- `create_axis(self, range_terms, axis_config, length)`


- `coords_to_point(self, *coords)`


- `point_to_coords(self, point)`


- `get_axes(self)`


- `get_all_ranges(self)`


- `add_coordinate_labels(self, x_values, y_values, excluding, **kwargs)`



---

#### `class ThreeDAxes(Axes)`

*No docstring available.*

**Methods:**

- `__init__(self, x_range, y_range, z_range, z_axis_config, z_normal, depth, **kwargs)`


- `get_all_ranges(self)`


- `add_axis_labels(self, x_tex, y_tex, z_tex, font_size, buff)`


- `get_graph(self, func, color, opacity, u_range, v_range, **kwargs)`


- `get_parametric_surface(self, func, color, opacity, **kwargs)`



---

#### `class NumberPlane(Axes)`

*No docstring available.*

**Methods:**

- `__init__(self, x_range, y_range, background_line_style, faded_line_style, faded_line_ratio, make_smooth_after_applying_functions, **kwargs)`


- `init_background_lines(self)`


- `get_lines(self)`


- `get_lines_parallel_to_axis(self, axis1, axis2)`


- `get_x_unit_size(self)`


- `get_y_unit_size(self)`


- `get_axes(self)`


- `get_vector(self, coords, **kwargs)`


- `prepare_for_nonlinear_transform(self, num_inserted_curves)`



---

#### `class ComplexPlane(NumberPlane)`

*No docstring available.*

**Methods:**

- `number_to_point(self, number)`


- `n2p(self, number)`


- `point_to_number(self, point)`


- `p2n(self, point)`


- `get_unit_size(self)`


- `get_default_coordinate_values(self, skip_first)`


- `add_coordinate_labels(self, numbers, skip_first, font_size, **kwargs)`



---

## Module: `mobject/number_line.py`

### Classes

#### `class NumberLine(Line)`

*No docstring available.*

**Methods:**

- `__init__(self, x_range, color, stroke_width, unit_size, width, include_ticks, tick_size, longer_tick_multiple, tick_offset, big_tick_spacing, big_tick_numbers, include_numbers, line_to_number_direction, line_to_number_buff, include_tip, tip_config, decimal_number_config, numbers_to_exclude, **kwargs)`


- `get_tick_range(self)`


- `add_ticks(self)`


- `get_tick(self, x, size)`


- `get_tick_marks(self)`


- `number_to_point(self, number)`


- `point_to_number(self, point)`


- `n2p(self, number)`

  Abbreviation for number_to_point

- `p2n(self, point)`

  Abbreviation for point_to_number

- `get_unit_size(self)`


- `get_number_mobject(self, x, direction, buff, unit, unit_tex, **number_config)`


- `add_numbers(self, x_values, excluding, font_size, **kwargs)`



---

#### `class UnitInterval(NumberLine)`

*No docstring available.*

**Methods:**

- `__init__(self, x_range, unit_size, big_tick_numbers, decimal_number_config, **kwargs)`



---

#### `class Slider(VGroup)`

*No docstring available.*

**Methods:**

- `__init__(self, value_tracker, x_range, var_name, width, unit_size, arrow_width, arrow_length, arrow_color, font_size, label_buff, num_decimal_places, tick_size, number_line_config, arrow_tip_config, decimal_config, angle, label_direction, add_tick_labels, tick_label_font_size)`



---

## Module: `mobject/functions.py`

### Classes

#### `class ParametricCurve(VMobject)`

*No docstring available.*

**Methods:**

- `__init__(self, t_func, t_range, epsilon, discontinuities, use_smoothing, **kwargs)`


- `get_point_from_function(self, t)`


- `init_points(self)`


- `get_t_func(self)`


- `get_function(self)`


- `get_x_range(self)`



---

#### `class FunctionGraph(ParametricCurve)`

*No docstring available.*

**Methods:**

- `__init__(self, function, x_range, color, **kwargs)`



---

#### `class ImplicitFunction(VMobject)`

*No docstring available.*

**Methods:**

- `__init__(self, func, x_range, y_range, min_depth, max_quads, use_smoothing, joint_type, **kwargs)`



---

## Module: `mobject/vector_field.py`

### Functions

#### `get_vectorized_rgb_gradient_function(min_value, max_value, color_map)`

*No docstring available.*

---
#### `get_rgb_gradient_function(min_value, max_value, color_map)`

*No docstring available.*

---
#### `ode_solution_points(function, state0, time, dt)`

*No docstring available.*

---
#### `move_along_vector_field(mobject, func)`

*No docstring available.*

---
#### `move_submobjects_along_vector_field(mobject, func)`

*No docstring available.*

---
#### `move_points_along_vector_field(mobject, func, coordinate_system)`

*No docstring available.*

---
#### `get_sample_coords(coordinate_system, density)`

*No docstring available.*

---
#### `vectorize(pointwise_function)`

*No docstring available.*

---


### Classes

#### `class VectorField(VMobject)`

*No docstring available.*

**Methods:**

- `__init__(self, func, coordinate_system, sample_coords, density, magnitude_range, color, color_map_name, color_map, stroke_opacity, stroke_width, tip_width_ratio, tip_len_to_width, max_vect_len, max_vect_len_to_step_size, flat_stroke, norm_to_opacity_func, **kwargs)`


- `init_points(self)`


- `get_sample_points(self, center, width, height, depth, x_density, y_density, z_density)`


- `init_base_stroke_width_array(self, n_sample_points)`


- `set_sample_coords(self, sample_coords)`


- `set_stroke(self, color, width, opacity, behind, flat, recurse)`


- `set_stroke_width(self, width)`


- `update_sample_points(self)`


- `update_vectors(self)`



---

#### `class TimeVaryingVectorField(VectorField)`

*No docstring available.*

**Methods:**

- `__init__(self, time_func, coordinate_system, **kwargs)`


- `increment_time(self, dt)`



---

#### `class StreamLines(VGroup)`

*No docstring available.*

**Methods:**

- `__init__(self, func, coordinate_system, density, n_repeats, noise_factor, solution_time, dt, arc_len, max_time_steps, n_samples_per_line, cutoff_norm, stroke_width, stroke_color, stroke_opacity, color_by_magnitude, magnitude_range, taper_stroke_width, color_map, **kwargs)`


- `point_func(self, points)`


- `draw_lines(self)`


- `get_sample_coords(self)`


- `init_style(self)`



---

#### `class AnimatedStreamLines(VGroup)`

*No docstring available.*

**Methods:**

- `__init__(self, stream_lines, lag_range, rate_multiple, line_anim_config, **kwargs)`


- `update(self, dt)`



---
