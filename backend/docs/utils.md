# Utilities, Windows & Shader Wrappers

This section documents auxiliary functions like Bezier curves, color tables, rates, space operations, sound, window display, and shader wrappers.

## Module: `utils/bezier.py`

### Constants

| Constant | Value |
| --- | --- |
| `CLOSED_THRESHOLD` | `0.001` |


### Functions

#### `bezier(points)`

*No docstring available.*

---
#### `partial_bezier_points(points, a, b)`

Given an list of points which define
a bezier curve, and two numbers 0<=a<b<=1,
return an list of the same size, which
describes the portion of the original bezier
curve on the interval [a, b].

This algorithm is pretty nifty, and pretty dense.

---
#### `partial_quadratic_bezier_points(points, a, b)`

*No docstring available.*

---
#### `interpolate(start, end, alpha)`

*No docstring available.*

---
#### `outer_interpolate(start, end, alpha)`

*No docstring available.*

---
#### `set_array_by_interpolation(arr, arr1, arr2, alpha, interp_func)`

*No docstring available.*

---
#### `integer_interpolate(start, end, alpha)`

alpha is a float between 0 and 1.  This returns
an integer between start and end (inclusive) representing
appropriate interpolation between them, along with a
"residue" representing a new proportion between the
returned integer and the next one of the
list.

For example, if start=0, end=10, alpha=0.46, This
would return (4, 0.6).

---
#### `mid(start, end)`

*No docstring available.*

---
#### `inverse_interpolate(start, end, value)`

*No docstring available.*

---
#### `match_interpolate(new_start, new_end, old_start, old_end, old_value)`

*No docstring available.*

---
#### `quadratic_bezier_points_for_arc(angle, n_components)`

*No docstring available.*

---
#### `approx_smooth_quadratic_bezier_handles(points)`

Figuring out which bezier curves most smoothly connect a sequence of points.

Given three successive points, P0, P1 and P2, you can compute that by defining
h = (1/4) P0 + P1 - (1/4)P2, the bezier curve defined by (P0, h, P1) will pass
through the point P2.

So for a given set of four successive points, P0, P1, P2, P3, if we want to add
a handle point h between P1 and P2 so that the quadratic bezier (P1, h, P2) is
part of a smooth curve passing through all four points, we calculate one solution
for h that would produce a parbola passing through P3, call it smooth_to_right, and
another that would produce a parabola passing through P0, call it smooth_to_left,
and use the midpoint between the two.

---
#### `smooth_quadratic_path(anchors)`

Returns a path defining a smooth quadratic bezier spline
through anchors.

---
#### `get_smooth_cubic_bezier_handle_points(points)`

*No docstring available.*

---
#### `diag_to_matrix(l_and_u, diag)`

Converts array whose rows represent diagonal
entries of a matrix into the matrix itself.
See scipy.linalg.solve_banded

---
#### `is_closed(points)`

*No docstring available.*

---
#### `get_quadratic_approximation_of_cubic(a0, h0, h1, a1)`

*No docstring available.*

---
#### `get_smooth_quadratic_bezier_path_through(points)`

*No docstring available.*

---


## Module: `utils/color.py`

### Functions

#### `color_to_rgb(color)`

*No docstring available.*

---
#### `color_to_rgba(color, alpha)`

*No docstring available.*

---
#### `rgb_to_color(rgb)`

*No docstring available.*

---
#### `rgba_to_color(rgba)`

*No docstring available.*

---
#### `rgb_to_hex(rgb)`

*No docstring available.*

---
#### `hex_to_rgb(hex_code)`

*No docstring available.*

---
#### `invert_color(color)`

*No docstring available.*

---
#### `color_to_int_rgb(color)`

*No docstring available.*

---
#### `color_to_int_rgba(color, opacity)`

*No docstring available.*

---
#### `color_to_hex(color)`

*No docstring available.*

---
#### `hex_to_int(rgb_hex)`

*No docstring available.*

---
#### `int_to_hex(rgb_int)`

*No docstring available.*

---
#### `color_gradient(reference_colors, length_of_output, interp_by_hsl)`

*No docstring available.*

---
#### `interpolate_color(color1, color2, alpha, interp_by_hsl)`

*No docstring available.*

---
#### `interpolate_color_by_hsl(color1, color2, alpha)`

*No docstring available.*

---
#### `average_color(*colors)`

*No docstring available.*

---
#### `random_color()`

*No docstring available.*

---
#### `random_bright_color(hue_range, saturation_range, luminance_range)`

*No docstring available.*

---
#### `get_colormap_from_colors(colors)`

Returns a funciton which takes in values between 0 and 1, and returns
a corresponding list of rgba values

---
#### `get_color_map(map_name)`

*No docstring available.*

---
#### `get_colormap_list(map_name, n_colors)`

Options for map_name:
3b1b_colormap
magma
inferno
plasma
viridis
cividis
twilight
twilight_shifted
turbo

---


## Module: `utils/rate_functions.py`

### Functions

#### `linear(t)`

*No docstring available.*

---
#### `smooth(t)`

*No docstring available.*

---
#### `rush_into(t)`

*No docstring available.*

---
#### `rush_from(t)`

*No docstring available.*

---
#### `slow_into(t)`

*No docstring available.*

---
#### `double_smooth(t)`

*No docstring available.*

---
#### `there_and_back(t)`

*No docstring available.*

---
#### `there_and_back_with_pause(t, pause_ratio)`

*No docstring available.*

---
#### `running_start(t, pull_factor)`

*No docstring available.*

---
#### `overshoot(t, pull_factor)`

*No docstring available.*

---
#### `not_quite_there(func, proportion)`

*No docstring available.*

---
#### `wiggle(t, wiggles)`

*No docstring available.*

---
#### `squish_rate_func(func, a, b)`

*No docstring available.*

---
#### `lingering(t)`

*No docstring available.*

---
#### `exponential_decay(t, half_life)`

*No docstring available.*

---


## Module: `utils/space_ops.py`

### Functions

#### `cross(v1, v2, out)`

*No docstring available.*

---
#### `get_norm(vect)`

*No docstring available.*

---
#### `get_dist(vect1, vect2)`

*No docstring available.*

---
#### `normalize(vect, fall_back)`

*No docstring available.*

---
#### `poly_line_length(points)`

Return the sum of the lengths between adjacent points

---
#### `quaternion_mult(*quats)`

Inputs are treated as quaternions, where the real part is the
last entry, so as to follow the scipy Rotation conventions.

---
#### `quaternion_from_angle_axis(angle, axis)`

*No docstring available.*

---
#### `angle_axis_from_quaternion(quat)`

*No docstring available.*

---
#### `quaternion_conjugate(quaternion)`

*No docstring available.*

---
#### `rotate_vector(vector, angle, axis)`

*No docstring available.*

---
#### `rotate_vector_2d(vector, angle)`

*No docstring available.*

---
#### `rotation_matrix_transpose_from_quaternion(quat)`

*No docstring available.*

---
#### `rotation_matrix_from_quaternion(quat)`

*No docstring available.*

---
#### `rotation_matrix(angle, axis)`

Rotation in R^3 about a specified axis of rotation.

---
#### `rotation_matrix_transpose(angle, axis)`

*No docstring available.*

---
#### `rotation_about_z(angle)`

*No docstring available.*

---
#### `rotation_between_vectors(v1, v2)`

*No docstring available.*

---
#### `z_to_vector(vector)`

*No docstring available.*

---
#### `angle_of_vector(vector)`

Returns polar coordinate theta when vector is project on xy plane

---
#### `angle_between_vectors(v1, v2)`

Returns the angle between two 3D vectors.
This angle will always be btw 0 and pi

---
#### `project_along_vector(point, vector)`

*No docstring available.*

---
#### `normalize_along_axis(array, axis)`

*No docstring available.*

---
#### `get_unit_normal(v1, v2, tol)`

*No docstring available.*

---
#### `thick_diagonal(dim, thickness)`

*No docstring available.*

---
#### `compass_directions(n, start_vect)`

*No docstring available.*

---
#### `complex_to_R3(complex_num)`

*No docstring available.*

---
#### `R3_to_complex(point)`

*No docstring available.*

---
#### `complex_func_to_R3_func(complex_func)`

*No docstring available.*

---
#### `center_of_mass(points)`

*No docstring available.*

---
#### `midpoint(point1, point2)`

*No docstring available.*

---
#### `line_intersection(line1, line2)`

return intersection point of two lines,
each defined with a pair of vectors determining
the end points

---
#### `find_intersection(p0, v0, p1, v1, threshold)`

Return the intersection of a line passing through p0 in direction v0
with one passing through p1 in direction v1.  (Or array of intersections
from arrays of such points/directions).

For 3d values, it returns the point on the ray p0 + v0 * t closest to the
ray p1 + v1 * t

---
#### `line_intersects_path(start, end, path)`

Tests whether the line (start, end) intersects
a polygonal path defined by its vertices

---
#### `get_closest_point_on_line(a, b, p)`

It returns point x such that
x is on line ab and xp is perpendicular to ab.
If x lies beyond ab line, then it returns nearest edge(a or b).

---
#### `get_winding_number(points)`

*No docstring available.*

---
#### `cross2d(a, b)`

*No docstring available.*

---
#### `tri_area(a, b, c)`

*No docstring available.*

---
#### `is_inside_triangle(p, a, b, c)`

Test if point p is inside triangle abc

---
#### `norm_squared(v)`

*No docstring available.*

---
#### `earclip_triangulation(verts, ring_ends)`

Returns a list of indices giving a triangulation
of a polygon, potentially with holes

- verts is a numpy array of points

- ring_ends is a list of indices indicating where
the ends of new paths are

---


## Module: `utils/iterables.py`

### Functions

#### `remove_list_redundancies(lst)`

Remove duplicate elements while preserving order.
Keeps the last occurrence of each element

---
#### `list_update(l1, l2)`

Used instead of list(set(l1).update(l2)) to maintain order,
making sure duplicates are removed from l1, not l2.

---
#### `list_difference_update(l1, l2)`

*No docstring available.*

---
#### `adjacent_n_tuples(objects, n)`

*No docstring available.*

---
#### `adjacent_pairs(objects)`

*No docstring available.*

---
#### `batch_by_property(items, property_func)`

Takes in a list, and returns a list of tuples, (batch, prop)
such that all items in a batch have the same output when
put into property_func, and such that chaining all these
batches together would give the original list (i.e. order is
preserved)

---
#### `listify(obj)`

*No docstring available.*

---
#### `shuffled(iterable)`

*No docstring available.*

---
#### `resize_array(nparray, length)`

*No docstring available.*

---
#### `resize_preserving_order(nparray, length)`

*No docstring available.*

---
#### `resize_with_interpolation(nparray, length)`

*No docstring available.*

---
#### `make_even(iterable_1, iterable_2)`

*No docstring available.*

---
#### `arrays_match(arr1, arr2)`

*No docstring available.*

---
#### `array_is_constant(arr)`

*No docstring available.*

---
#### `cartesian_product(*arrays)`

Copied from https://stackoverflow.com/a/11146645

---
#### `hash_obj(obj)`

*No docstring available.*

---


## Module: `utils/simple_functions.py`

### Functions

#### `sigmoid(x)`

*No docstring available.*

---
#### `choose(n, k)`

*No docstring available.*

---
#### `gen_choose(n, r)`

*No docstring available.*

---
#### `get_num_args(function)`

*No docstring available.*

---
#### `get_parameters(function)`

*No docstring available.*

---
#### `clip(a, min_a, max_a)`

*No docstring available.*

---
#### `arr_clip(arr, min_a, max_a)`

*No docstring available.*

---
#### `fdiv(a, b, zero_over_zero_value)`

Less heavyweight name for np.true_divide, enabling
default behavior for 0/0

---
#### `binary_search(function, target, lower_bound, upper_bound, tolerance)`

*No docstring available.*

---
#### `hash_string(string, n_bytes)`

*No docstring available.*

---


## Module: `shader_wrapper.py`

### Classes

#### `class ShaderWrapper(object)`

*No docstring available.*

**Methods:**

- `__init__(self, ctx, vert_data, shader_folder, mobject_uniforms, texture_paths, depth_test, render_primitive, code_replacements)`


- `init_program_code(self)`


- `init_program(self)`


- `init_textures(self)`


- `init_vertex_objects(self)`


- `add_texture(self, name, texture)`


- `bind_to_mobject_uniforms(self, mobject_uniforms)`


- `get_id(self)`


- `refresh_id(self)`


- `replace_code(self, old, new)`


- `num_clip_planes(self)`


- `set_ctx_depth_test(self, enable)`


- `set_ctx_clip_plane(self, num_planes)`


- `read_in(self, data_list)`


- `generate_vaos(self)`


- `pre_render(self)`


- `render(self)`


- `update_program_uniforms(self, camera_uniforms)`


- `release(self)`


- `release_textures(self)`



---

#### `class VShaderWrapper(ShaderWrapper)`

*No docstring available.*

**Methods:**

- `__init__(self, ctx, vert_data, shader_folder, mobject_uniforms, texture_paths, depth_test, render_primitive, code_replacements, program_type, stroke_behind)`


- `init_program_code(self)`


- `init_program(self)`


- `init_vertex_objects(self)`


- `generate_vaos(self)`


- `set_backstroke(self, value)`


- `refresh_id(self)`


- `replace_code_program(self, old, new, program_type)`


- `render_stroke(self)`


- `render_fill(self)`


- `@lru_cache
@staticmethod
get_fill_canvas(ctx)`

  Because VMobjects with fill are rendered in a funny way, using
  alpha blending to effectively compute the winding number around
  each pixel, they need to be rendered to a separate texture, which
  is then composited onto the ordinary frame buffer.
  
  This returns a texture, loaded into a frame buffer, and a vao
  which can display that texture as a simple quad onto a screen,
  along with the rgb value which is meant to be discarded.

- `render(self)`



---

## Module: `window.py`

### Classes

#### `class Window(PygletWindow)`

*No docstring available.*

**Methods:**

- `__init__(self, scene, position_string, monitor_index, full_screen, size, position, samples)`


- `init_for_scene(self, scene)`

  Resets the state and updates the scene associated to this window.
  
  This is necessary when we want to reuse an *existing* window after a
  `scene.reload()` was requested, which will create new scene instances.

- `get_monitor(self, index)`


- `get_default_size(self, full_screen)`


- `position_from_string(self, position_string)`


- `focus(self)`

  Puts focus on this window by hiding and showing it again.
  
  Note that the pyglet `activate()` method didn't work as expected here,
  so that's why we have to use this workaround. This will produce a small
  flicker on the window but at least reliably focuses it. It may also
  offset the window position slightly.

- `to_default_position(self)`


- `pixel_coords_to_space_coords(self, px, py, relative)`


- `has_undrawn_event(self)`


- `swap_buffers(self)`


- `@staticmethod
note_undrawn_event(func)`


- `@note_undrawn_event
on_mouse_motion(self, x, y, dx, dy)`


- `@note_undrawn_event
on_mouse_drag(self, x, y, dx, dy, buttons, modifiers)`


- `@note_undrawn_event
on_mouse_press(self, x, y, button, mods)`


- `@note_undrawn_event
on_mouse_release(self, x, y, button, mods)`


- `@note_undrawn_event
on_mouse_scroll(self, x, y, x_offset, y_offset)`


- `@note_undrawn_event
on_key_press(self, symbol, modifiers)`


- `@note_undrawn_event
on_key_release(self, symbol, modifiers)`


- `@note_undrawn_event
on_resize(self, width, height)`


- `@note_undrawn_event
on_show(self)`


- `@note_undrawn_event
on_hide(self)`


- `@note_undrawn_event
on_close(self)`


- `is_key_pressed(self, symbol)`



---
