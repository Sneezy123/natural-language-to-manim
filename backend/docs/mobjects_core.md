# Mobjects Core & Base Types

This section documents the base Mobject classes, vectorized/point-cloud types, surfaces, and image support.

## Module: `mobject/mobject.py`

### Functions

#### `override_animate(method)`

*No docstring available.*

---


### Classes

#### `class Mobject(object)`

Mathematical Object

**Methods:**

- `__init__(self, color, opacity, shading, texture_paths, is_fixed_in_frame, depth_test, z_index)`


- `init_data(self, length)`


- `init_uniforms(self)`


- `init_colors(self)`


- `init_points(self)`


- `set_uniforms(self, uniforms)`


- `@property
animate(self)`

  Methods called with Mobject.animate.method() can be passed
  into a Scene.play call, as if you were calling
  ApplyMethod(mobject.method)
  
  Borrowed from https://github.com/ManimCommunity/manim/

- `@property
always(self)`

  Methods called with mobject.always.method(*args, **kwargs)
  will result in the call mobject.method(*args, **kwargs)
  on every frame

- `@property
f_always(self)`

  Similar to Mobject.always, but with the intent that arguments
  are functions returning the corresponding type fit for the method
  Methods called with
  mobject.f_always.method(
      func1, func2, ...,
      kwarg1=kw_func1,
      kwarg2=kw_func2,
      ...
  )
  will result in the call
  mobject.method(
      func1(), func2(), ...,
      kwarg1=kw_func1(),
      kwarg2=kw_func2(),
      ...
  )
  on every frame

- `note_changed_data(self, recurse_up)`


- `@staticmethod
affects_data(func)`


- `@staticmethod
affects_family_data(func)`


- `@affects_data
set_data(self, data)`


- `@affects_data
resize_points(self, new_length, resize_func)`


- `@affects_data
set_points(self, points)`


- `@affects_data
append_points(self, new_points)`


- `@affects_family_data
reverse_points(self)`


- `@affects_family_data
apply_points_function(self, func, about_point, about_edge, works_on_bounding_box)`


- `@affects_data
match_points(self, mobject)`


- `get_points(self)`


- `clear_points(self)`


- `get_num_points(self)`


- `get_all_points(self)`


- `has_points(self)`


- `get_bounding_box(self)`


- `compute_bounding_box(self)`


- `refresh_bounding_box(self, recurse_down, recurse_up)`


- `are_points_touching(self, points, buff)`


- `is_point_touching(self, point, buff)`


- `is_touching(self, mobject, buff)`


- `split(self)`


- `@affects_data
note_changed_family(self, only_changed_order)`


- `get_family(self, recurse)`


- `family_members_with_points(self)`


- `get_ancestors(self, extended)`

  Returns parents, grandparents, etc.
  Order of result should be from higher members of the hierarchy down.
  
  If extended is set to true, it includes the ancestors of all family members,
  e.g. any other parents of a submobject

- `add(self, *mobjects)`


- `remove(self, *to_remove, reassemble, recurse)`


- `clear(self)`


- `add_to_back(self, *mobjects)`


- `replace_submobject(self, index, new_submob)`


- `insert_submobject(self, index, new_submob)`


- `set_submobjects(self, submobject_list)`


- `digest_mobject_attrs(self)`

  Ensures all attributes which are mobjects are included
  in the submobjects list.

- `arrange(self, direction, center, **kwargs)`


- `arrange_in_grid(self, n_rows, n_cols, buff, h_buff, v_buff, buff_ratio, h_buff_ratio, v_buff_ratio, aligned_edge, fill_rows_first)`


- `arrange_to_fit_dim(self, length, dim, about_edge)`


- `arrange_to_fit_width(self, width, about_edge)`


- `arrange_to_fit_height(self, height, about_edge)`


- `arrange_to_fit_depth(self, depth, about_edge)`


- `sort(self, point_to_num_func, submob_func)`


- `shuffle(self, recurse)`


- `reverse_submobjects(self)`


- `@staticmethod
stash_mobject_pointers(func)`


- `@stash_mobject_pointers
serialize(self)`


- `deserialize(self, data)`


- `@stash_mobject_pointers
deepcopy(self)`


- `copy(self, deep)`


- `generate_target(self, use_deepcopy)`


- `save_state(self, use_deepcopy)`


- `restore(self)`


- `become(self, mobject, match_updaters)`

  Edit all data and submobjects to be idential
  to another mobject

- `looks_identical(self, mobject)`


- `has_same_shape_as(self, mobject)`


- `replicate(self, n)`


- `get_grid(self, n_rows, n_cols, height, width, group_by_rows, group_by_cols, **kwargs)`

  Returns a new mobject containing multiple copies of this one
  arranged in a grid

- `init_updaters(self)`


- `update(self, dt, recurse)`


- `get_updaters(self)`


- `add_updater(self, update_func, call)`


- `insert_updater(self, update_func, index)`


- `remove_updater(self, update_func)`


- `clear_updaters(self, recurse)`


- `match_updaters(self, mobject)`


- `suspend_updating(self, recurse)`


- `resume_updating(self, recurse, call_updater)`


- `has_updaters(self)`


- `refresh_has_updater_status(self)`


- `is_changing(self)`


- `set_animating_status(self, is_animating, recurse)`


- `shift(self, vector)`


- `scale(self, scale_factor, min_scale_factor, about_point, about_edge)`

  Default behavior is to scale about the center of the mobject.
  The argument about_edge can be a vector, indicating which side of
  the mobject to scale about, e.g., mob.scale(about_edge = RIGHT)
  scales about mob.get_right().
  
  Otherwise, if about_point is given a value, scaling is done with
  respect to that point.

- `stretch(self, factor, dim, **kwargs)`


- `rotate_about_origin(self, angle, axis)`


- `rotate(self, angle, axis, about_point, **kwargs)`


- `flip(self, axis, **kwargs)`


- `apply_function(self, function, **kwargs)`


- `apply_function_to_position(self, function)`


- `apply_function_to_submobject_positions(self, function)`


- `apply_matrix(self, matrix, **kwargs)`


- `apply_complex_function(self, function, **kwargs)`


- `wag(self, direction, axis, wag_factor)`


- `center(self)`


- `align_on_border(self, direction, buff)`

  Direction just needs to be a vector pointing towards side or
  corner in the 2d plane.

- `to_corner(self, corner, buff)`


- `to_edge(self, edge, buff)`


- `next_to(self, mobject_or_point, direction, buff, aligned_edge, submobject_to_align, index_of_submobject_to_align, coor_mask)`


- `shift_onto_screen(self, **kwargs)`


- `is_off_screen(self)`


- `stretch_about_point(self, factor, dim, point)`


- `stretch_in_place(self, factor, dim)`


- `rescale_to_fit(self, length, dim, stretch, **kwargs)`


- `stretch_to_fit_width(self, width, **kwargs)`


- `stretch_to_fit_height(self, height, **kwargs)`


- `stretch_to_fit_depth(self, depth, **kwargs)`


- `set_width(self, width, stretch, **kwargs)`


- `set_height(self, height, stretch, **kwargs)`


- `set_depth(self, depth, stretch, **kwargs)`


- `set_max_width(self, max_width, **kwargs)`


- `set_max_height(self, max_height, **kwargs)`


- `set_max_depth(self, max_depth, **kwargs)`


- `set_min_width(self, min_width, **kwargs)`


- `set_min_height(self, min_height, **kwargs)`


- `set_min_depth(self, min_depth, **kwargs)`


- `set_shape(self, width, height, depth, **kwargs)`


- `set_coord(self, value, dim, direction)`


- `set_x(self, x, direction)`


- `set_y(self, y, direction)`


- `set_z(self, z, direction)`


- `set_z_index(self, z_index, recurse)`


- `space_out_submobjects(self, factor, **kwargs)`


- `move_to(self, point_or_mobject, aligned_edge, coor_mask)`


- `replace(self, mobject, dim_to_match, stretch)`


- `surround(self, mobject, dim_to_match, stretch, buff)`


- `put_start_on(self, point)`


- `put_end_on(self, point)`


- `put_start_and_end_on(self, start, end)`


- `@affects_family_data
set_rgba_array(self, rgba_array, name, recurse)`


- `set_color_by_rgba_func(self, func, recurse)`

  Func should accept an (N, 3) array and return an (N, 4) array of RGB values in [0,1]

- `set_color_by_rgb_func(self, func, opacity, recurse)`

  Func should accept an (N, 3) array and return an (N, 3) array of RGB values in [0,1]

- `@affects_family_data
set_rgba_array_by_color(self, color, opacity, name, recurse)`


- `set_color(self, color, opacity, recurse)`


- `set_opacity(self, opacity, recurse)`


- `get_color(self)`


- `get_opacity(self)`


- `get_opacities(self)`


- `set_color_by_gradient(self, *colors)`


- `set_submobject_colors_by_gradient(self, *colors, interp_by_hsl)`


- `fade(self, darkness, recurse)`


- `get_shading(self)`


- `set_shading(self, reflectiveness, gloss, shadow, recurse)`

  Larger reflectiveness makes things brighter when facing the light
  Larger shadow makes faces opposite the light darker
  Makes parts bright where light gets reflected toward the camera

- `get_reflectiveness(self)`


- `get_gloss(self)`


- `get_shadow(self)`


- `set_reflectiveness(self, reflectiveness, recurse)`


- `set_gloss(self, gloss, recurse)`


- `set_shadow(self, shadow, recurse)`


- `add_background_rectangle(self, color, opacity, **kwargs)`


- `add_background_rectangle_to_submobjects(self, **kwargs)`


- `add_background_rectangle_to_family_members_with_points(self, **kwargs)`


- `get_bounding_box_point(self, direction)`


- `get_edge_center(self, direction)`


- `get_corner(self, direction)`


- `get_all_corners(self)`


- `get_center(self)`


- `get_center_of_mass(self)`


- `get_boundary_point(self, direction)`


- `get_continuous_bounding_box_point(self, direction)`


- `get_top(self)`


- `get_bottom(self)`


- `get_right(self)`


- `get_left(self)`


- `get_zenith(self)`


- `get_nadir(self)`


- `length_over_dim(self, dim)`


- `get_width(self)`


- `get_height(self)`


- `get_depth(self)`


- `get_shape(self)`


- `get_coord(self, dim, direction)`

  Meant to generalize get_x, get_y, get_z

- `get_x(self, direction)`


- `get_y(self, direction)`


- `get_z(self, direction)`


- `get_start(self)`


- `get_end(self)`


- `get_start_and_end(self)`


- `point_from_proportion(self, alpha)`


- `pfp(self, alpha)`

  Abbreviation for point_from_proportion

- `get_pieces(self, n_pieces)`


- `get_z_index_reference_point(self)`


- `match_color(self, mobject)`


- `match_style(self, mobject)`


- `match_dim_size(self, mobject, dim, **kwargs)`


- `match_width(self, mobject, **kwargs)`


- `match_height(self, mobject, **kwargs)`


- `match_depth(self, mobject, **kwargs)`


- `match_coord(self, mobject_or_point, dim, direction)`


- `match_x(self, mobject_or_point, direction)`


- `match_y(self, mobject_or_point, direction)`


- `match_z(self, mobject_or_point, direction)`


- `align_to(self, mobject_or_point, direction)`

  Examples:
  mob1.align_to(mob2, UP) moves mob1 vertically so that its
  top edge lines ups with mob2's top edge.
  
  mob1.align_to(mob2, alignment_vect = RIGHT) moves mob1
  horizontally so that it's center is directly above/below
  the center of mob2

- `get_group_class(self)`


- `is_aligned_with(self, mobject)`


- `align_data_and_family(self, mobject)`


- `align_data(self, mobject)`


- `align_points(self, mobject)`


- `align_family(self, mobject)`


- `push_self_into_submobjects(self)`


- `add_n_more_submobjects(self, n)`


- `invisible_copy(self)`


- `interpolate(self, mobject1, mobject2, alpha, path_func)`


- `pointwise_become_partial(self, mobject, a, b)`

  Set points in such a way as to become only
  part of mobject.
  Inputs 0 <= a < b <= 1 determine what portion
  of mobject to become.

- `lock_data(self, keys)`

  To speed up some animations, particularly transformations,
  it can be handy to acknowledge which pieces of data
  won't change during the animation so that calls to
  interpolate can skip this, and so that it's not
  read into the shader_wrapper objects needlessly

- `lock_uniforms(self, keys)`


- `lock_matching_data(self, mobject1, mobject2)`


- `unlock_data(self)`


- `@staticmethod
affects_shader_info_id(func)`


- `@affects_shader_info_id
set_uniform(self, recurse, **new_uniforms)`


- `@affects_shader_info_id
fix_in_frame(self, recurse)`


- `@affects_shader_info_id
unfix_from_frame(self, recurse)`


- `is_fixed_in_frame(self)`


- `@affects_shader_info_id
apply_depth_test(self, recurse)`


- `@affects_shader_info_id
deactivate_depth_test(self, recurse)`


- `set_clip_plane(self, vect, threshold, recurse)`


- `set_clip_planes(self, *vect_threshold_pairs, recurse)`


- `deactivate_clip_plane(self, recurse)`


- `clip_to_box(self, box, recurse)`


- `@affects_data
replace_shader_code(self, old, new)`


- `set_color_by_code(self, glsl_code)`

  Takes a snippet of code and inserts it into a
  context which has the following variables:
  vec4 color, vec3 point, vec3 unit_normal.
  The code should change the color variable

- `set_color_by_xyz_func(self, glsl_snippet, min_value, max_value, colormap)`

  Pass in a glsl expression in terms of x, y and z which returns
  a float.

- `init_shader_wrapper(self, ctx)`


- `refresh_shader_wrapper_id(self)`


- `get_shader_wrapper(self, ctx)`


- `get_shader_wrapper_list(self, ctx)`


- `get_shader_data(self)`


- `get_uniforms(self)`


- `get_shader_vert_indices(self)`


- `render(self, ctx, camera_uniforms)`


- `init_event_listners(self)`


- `add_event_listner(self, event_type, event_callback)`


- `remove_event_listner(self, event_type, event_callback)`


- `clear_event_listners(self, recurse)`


- `get_event_listners(self)`


- `get_family_event_listners(self)`


- `get_has_event_listner(self)`


- `add_mouse_motion_listner(self, callback)`


- `remove_mouse_motion_listner(self, callback)`


- `add_mouse_press_listner(self, callback)`


- `remove_mouse_press_listner(self, callback)`


- `add_mouse_release_listner(self, callback)`


- `remove_mouse_release_listner(self, callback)`


- `add_mouse_drag_listner(self, callback)`


- `remove_mouse_drag_listner(self, callback)`


- `add_mouse_scroll_listner(self, callback)`


- `remove_mouse_scroll_listner(self, callback)`


- `add_key_press_listner(self, callback)`


- `remove_key_press_listner(self, callback)`


- `add_key_release_listner(self, callback)`


- `remove_key_release_listner(self, callback)`


- `throw_error_if_no_points(self)`



---

#### `class Group(Mobject)`

*No docstring available.*

**Methods:**

- `__init__(self, *mobjects, **kwargs)`



---

#### `class Point(Mobject)`

*No docstring available.*

**Methods:**

- `__init__(self, location, artificial_width, artificial_height, **kwargs)`


- `get_width(self)`


- `get_height(self)`


- `get_location(self)`


- `get_bounding_box_point(self, *args, **kwargs)`


- `set_location(self, new_loc)`



---

## Module: `mobject/types/vectorized_mobject.py`

### Classes

#### `class VMobject(Mobject)`

*No docstring available.*

**Methods:**

- `__init__(self, color, fill_color, fill_opacity, stroke_color, stroke_opacity, stroke_width, stroke_behind, background_image_file, long_lines, joint_type, flat_stroke, scale_stroke_with_zoom, use_simple_quadratic_approx, anti_alias_width, fill_border_width, **kwargs)`


- `get_group_class(self)`


- `init_uniforms(self)`


- `add(self, *vmobjects)`


- `init_colors(self)`


- `set_fill(self, color, opacity, border_width, recurse)`


- `set_stroke(self, color, width, opacity, behind, flat, recurse)`


- `set_backstroke(self, color, width)`


- `set_style(self, fill_color, fill_opacity, fill_rgba, fill_border_width, stroke_color, stroke_opacity, stroke_rgba, stroke_width, stroke_behind, flat_stroke, shading, recurse)`


- `get_style(self)`


- `match_style(self, vmobject, recurse)`


- `set_color(self, color, opacity, recurse)`


- `set_opacity(self, opacity, recurse)`


- `set_color_by_proportion(self, prop_to_color)`


- `set_color_by_code(self, glsl_code, program_type)`


- `replace_shader_code(self, old, new, program_type)`


- `set_anti_alias_width(self, anti_alias_width, recurse)`


- `fade(self, darkness, recurse)`


- `get_fill_colors(self)`


- `get_fill_opacities(self)`


- `get_stroke_colors(self)`


- `get_stroke_opacities(self)`


- `get_stroke_widths(self)`


- `get_fill_color(self)`

  If there are multiple colors (for gradient)
  this returns the first one

- `get_fill_opacity(self)`

  If there are multiple opacities, this returns the
  first

- `get_stroke_color(self)`


- `get_stroke_width(self)`


- `get_stroke_opacity(self)`


- `get_color(self)`


- `get_anti_alias_width(self)`


- `has_stroke(self)`


- `has_fill(self)`


- `get_opacity(self)`


- `set_flat_stroke(self, flat_stroke, recurse)`


- `get_flat_stroke(self)`


- `set_scale_stroke_with_zoom(self, scale_stroke_with_zoom, recurse)`


- `get_scale_stroke_with_zoom(self)`


- `set_joint_type(self, joint_type, recurse)`


- `get_joint_type(self)`


- `apply_depth_test(self, anti_alias_width, recurse)`


- `deactivate_depth_test(self, anti_alias_width, recurse)`


- `use_winding_fill(self, value, recurse)`


- `set_anchors_and_handles(self, anchors, handles)`


- `start_new_path(self, point)`


- `add_cubic_bezier_curve(self, anchor1, handle1, handle2, anchor2)`


- `add_cubic_bezier_curve_to(self, handle1, handle2, anchor)`

  Add cubic bezier curve to the path.

- `add_quadratic_bezier_curve_to(self, handle, anchor, allow_null_curve)`


- `add_line_to(self, point, allow_null_line)`


- `add_smooth_curve_to(self, point)`


- `add_smooth_cubic_curve_to(self, handle, point)`


- `add_arc_to(self, point, angle, n_components, threshold)`


- `has_new_path_started(self)`


- `get_last_point(self)`


- `get_reflection_of_last_handle(self)`


- `close_path(self, smooth)`


- `is_closed(self)`


- `subdivide_curves_by_condition(self, tuple_to_subdivisions, recurse)`


- `subdivide_sharp_curves(self, angle_threshold, recurse)`


- `subdivide_intersections(self, recurse, n_subdivisions)`


- `add_points_as_corners(self, points)`


- `set_points_as_corners(self, points)`


- `set_points_smoothly(self, points, approx)`


- `is_smooth(self, angle_tol)`


- `change_anchor_mode(self, mode)`


- `make_smooth(self, approx, recurse)`

  Edits the path so as to pass smoothly through all
  the current anchor points.
  
  If approx is False, this may increase the total
  number of points.

- `make_approximately_smooth(self, recurse)`


- `make_jagged(self, recurse)`


- `add_subpath(self, points)`


- `append_vectorized_mobject(self, vmobject)`


- `consider_points_equal(self, p0, p1)`


- `get_bezier_tuples_from_points(self, points)`


- `get_bezier_tuples(self)`


- `get_subpath_end_indices_from_points(self, points)`


- `get_subpath_end_indices(self)`


- `get_subpaths_from_points(self, points)`


- `get_subpaths(self)`


- `get_nth_curve_points(self, n)`


- `get_nth_curve_function(self, n)`


- `get_num_curves(self)`


- `quick_point_from_proportion(self, alpha)`


- `curve_and_prop_of_partial_point(self, alpha)`

  If you want a point a proportion alpha along the curve, this
  gives you the index of the appropriate bezier curve, together
  with the proportion along that curve you'd need to travel

- `point_from_proportion(self, alpha)`


- `get_anchors_and_handles(self)`

  returns anchors1, handles, anchors2,
  where (anchors1[i], handles[i], anchors2[i])
  will be three points defining a quadratic bezier curve
  for any i in range(0, len(anchors1))

- `get_start_anchors(self)`


- `get_end_anchors(self)`


- `get_anchors(self)`


- `get_points_without_null_curves(self, atol)`


- `get_arc_length(self, n_sample_points)`


- `get_area_vector(self)`


- `get_unit_normal(self, refresh)`


- `refresh_unit_normal(self)`


- `rotate(self, angle, axis, about_point, **kwargs)`


- `ensure_positive_orientation(self, recurse)`


- `align_points(self, vmobject)`


- `insert_n_curves(self, n, recurse)`


- `insert_n_curves_to_point_list(self, n, points)`


- `pointwise_become_partial(self, vmobject, a, b)`


- `get_subcurve(self, a, b)`


- `get_outer_vert_indices(self)`

  Returns the pattern (0, 1, 2, 2, 3, 4, 4, 5, 6, ...)

- `get_triangulation(self)`


- `refresh_joint_angles(self)`


- `get_joint_angles(self, refresh)`

  The 'joint product' is a 4-vector holding the cross and dot
  product between tangent vectors at a joint

- `lock_matching_data(self, vmobject1, vmobject2)`


- `triggers_refresh(func)`


- `@triggers_refresh
set_points(self, points)`


- `@triggers_refresh
append_points(self, points)`


- `reverse_points(self, recurse)`


- `@triggers_refresh
set_data(self, data)`


- `@triggers_refresh
apply_function(self, function, make_smooth, **kwargs)`


- `@triggers_refresh
stretch(self, *args, **kwargs)`


- `@triggers_refresh
apply_matrix(self, *args, **kwargs)`


- `rotate(self, angle, axis, about_point, **kwargs)`


- `set_animating_status(self, is_animating, recurse)`


- `init_shader_wrapper(self, ctx)`


- `refresh_shader_wrapper_id(self)`


- `get_shader_data(self)`


- `get_shader_vert_indices(self)`



---

#### `class VGroup(Group, VMobject)`

*No docstring available.*

**Methods:**

- `__init__(self, *vmobjects, **kwargs)`



---

#### `class VectorizedPoint(Point, VMobject)`

*No docstring available.*

**Methods:**

- `__init__(self, location, color, fill_opacity, stroke_width, **kwargs)`



---

#### `class CurvesAsSubmobjects(VGroup)`

*No docstring available.*

**Methods:**

- `__init__(self, vmobject, **kwargs)`



---

#### `class DashedVMobject(VMobject)`

*No docstring available.*

**Methods:**

- `__init__(self, vmobject, num_dashes, positive_space_ratio, **kwargs)`



---

#### `class VHighlight(VGroup)`

*No docstring available.*

**Methods:**

- `__init__(self, vmobject, n_layers, color_bounds, max_stroke_addition)`



---

## Module: `mobject/types/point_cloud_mobject.py`

### Classes

#### `class PMobject(Mobject)`

*No docstring available.*

**Methods:**

- `set_points(self, points)`


- `add_points(self, points, rgbas, color, opacity)`

  points must be a Nx3 numpy array, as must rgbas if it is not None

- `add_point(self, point, rgba, color, opacity)`


- `set_color_by_gradient(self, *colors)`


- `match_colors(self, pmobject)`


- `filter_out(self, condition)`


- `sort_points(self, function)`

  function is any map from R^3 to R

- `ingest_submobjects(self)`


- `point_from_proportion(self, alpha)`


- `pointwise_become_partial(self, pmobject, a, b)`



---

#### `class PGroup(PMobject)`

*No docstring available.*

**Methods:**

- `__init__(self, *pmobs, **kwargs)`



---

## Module: `mobject/types/dot_cloud.py`

### Constants

| Constant | Value |
| --- | --- |
| `DEFAULT_DOT_RADIUS` | `0.05` |
| `DEFAULT_GLOW_DOT_RADIUS` | `0.2` |
| `DEFAULT_GRID_HEIGHT` | `6` |
| `DEFAULT_BUFF_RATIO` | `0.5` |


### Classes

#### `class DotCloud(PMobject)`

*No docstring available.*

**Methods:**

- `__init__(self, points, color, opacity, radius, glow_factor, anti_alias_width, **kwargs)`


- `init_uniforms(self)`


- `to_grid(self, n_rows, n_cols, n_layers, buff_ratio, h_buff_ratio, v_buff_ratio, d_buff_ratio, height)`


- `set_radii(self, radii)`


- `get_radii(self)`


- `set_radius(self, radius)`


- `get_radius(self)`


- `scale_radii(self, scale_factor)`


- `set_glow_factor(self, glow_factor)`


- `get_glow_factor(self)`


- `compute_bounding_box(self)`


- `scale(self, scale_factor, scale_radii, **kwargs)`


- `make_3d(self, reflectiveness, gloss, shadow)`



---

#### `class TrueDot(DotCloud)`

*No docstring available.*

**Methods:**

- `__init__(self, center, **kwargs)`



---

#### `class GlowDots(DotCloud)`

*No docstring available.*

**Methods:**

- `__init__(self, points, color, radius, glow_factor, **kwargs)`



---

#### `class GlowDot(GlowDots)`

*No docstring available.*

**Methods:**

- `__init__(self, center, **kwargs)`



---

## Module: `mobject/types/surface.py`

### Classes

#### `class Surface(Mobject)`

*No docstring available.*

**Methods:**

- `__init__(self, color, shading, depth_test, u_range, v_range, resolution, preferred_creation_axis, epsilon, normal_nudge, **kwargs)`


- `uv_func(self, u, v)`


- `init_points(self)`


- `get_uv_grid(self)`

  Returns an (nu, nv, 2) array of all pairs of u, v values, where
  (nu, nv) is the resolution

- `uv_to_point(self, u, v)`


- `apply_points_function(self, *args, **kwargs)`


- `compute_triangle_indices(self)`


- `get_triangle_indices(self)`


- `get_unit_normals(self)`


- `pointwise_become_partial(self, smobject, a, b, axis)`


- `get_partial_points_array(self, points, a, b, resolution, axis)`


- `sort_faces_back_to_front(self, vect)`


- `always_sort_to_camera(self, camera)`


- `color_by_uv_function(self, uv_to_color)`


- `get_shader_vert_indices(self)`



---

#### `class ParametricSurface(Surface)`

*No docstring available.*

**Methods:**

- `__init__(self, uv_func, u_range, v_range, **kwargs)`


- `uv_func(self, u, v)`



---

#### `class SGroup(Surface)`

*No docstring available.*

**Methods:**

- `__init__(self, *parametric_surfaces, **kwargs)`


- `init_points(self)`



---

#### `class TexturedSurface(Surface)`

*No docstring available.*

**Methods:**

- `__init__(self, uv_surface, image_file, dark_image_file, **kwargs)`


- `init_points(self)`


- `set_image_coords_by_uv_func(self, uv_func)`

  uv_func takes in a pair (u, v), and returns a new pair (u', v') used
  for coordinates when reading from the texture

- `init_uniforms(self)`


- `set_opacity(self, opacity, recurse)`


- `set_color(self, color, opacity, recurse)`


- `pointwise_become_partial(self, tsmobject, a, b, axis)`



---

#### `class TexturedGeometry(TexturedSurface)`

*No docstring available.*

**Methods:**

- `__init__(self, geometry, texture_file, **kwargs)`


- `init_points(self)`



---

#### `class ThreeDModel(Group)`

*No docstring available.*

**Methods:**

- `__init__(self, obj_file, height)`


- `get_textures_from_mtl(self, obj_filepath, suppress_warnings)`

  Load an OBJ file and extract all texture filenames from its MTL file.
  
  Returns:
      dict: {material_name: texture_filepath}


---

## Module: `mobject/types/image_mobject.py`

### Classes

#### `class ImageMobject(Mobject)`

*No docstring available.*

**Methods:**

- `__init__(self, filename, height, **kwargs)`


- `init_data(self)`


- `init_points(self)`


- `set_opacity(self, opacity, recurse)`


- `set_color(self, color, opacity, recurse)`


- `point_to_rgb(self, point)`



---
