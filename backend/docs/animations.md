# Animations

This section covers all built-in animations, creation sequences, fades, rotation, scaling, and custom transitions.

## Module: `animation/animation.py`

### Constants

| Constant | Value |
| --- | --- |
| `DEFAULT_ANIMATION_RUN_TIME` | `1.0` |
| `DEFAULT_ANIMATION_LAG_RATIO` | `0` |


### Functions

#### `prepare_animation(anim)`

*No docstring available.*

---


### Classes

#### `class Animation(object)`

*No docstring available.*

**Methods:**

- `__init__(self, mobject, run_time, time_span, lag_ratio, rate_func, name, remover, final_alpha_value, suspend_mobject_updating)`


- `begin(self)`


- `finish(self)`


- `clean_up_from_scene(self, scene)`


- `create_starting_mobject(self)`


- `get_all_mobjects(self)`

  Ordering must match the ording of arguments to interpolate_submobject

- `get_all_families_zipped(self)`


- `update_mobjects(self, dt)`

  Updates things like starting_mobject, and (for
  Transforms) target_mobject.

- `get_all_mobjects_to_update(self)`


- `copy(self)`


- `update_rate_info(self, run_time, rate_func, lag_ratio)`


- `interpolate(self, alpha)`


- `update(self, alpha)`

  This method shouldn't exist, but it's here to
  keep many old scenes from breaking

- `time_spanned_alpha(self, alpha)`


- `interpolate_mobject(self, alpha)`


- `interpolate_submobject(self, submobject, starting_submobject, alpha)`


- `get_sub_alpha(self, alpha, index, num_submobjects)`


- `set_run_time(self, run_time)`


- `get_run_time(self)`


- `set_rate_func(self, rate_func)`


- `get_rate_func(self)`


- `set_name(self, name)`


- `is_remover(self)`



---

## Module: `animation/composition.py`

### Constants

| Constant | Value |
| --- | --- |
| `DEFAULT_LAGGED_START_LAG_RATIO` | `0.05` |


### Classes

#### `class AnimationGroup(Animation)`

*No docstring available.*

**Methods:**

- `__init__(self, *args, run_time, lag_ratio, group, group_type, **kwargs)`


- `get_all_mobjects(self)`


- `begin(self)`


- `finish(self)`


- `clean_up_from_scene(self, scene)`


- `update_mobjects(self, dt)`


- `calculate_max_end_time(self)`


- `build_animations_with_timings(self, lag_ratio)`

  Creates a list of triplets of the form
  (anim, start_time, end_time)

- `interpolate(self, alpha)`



---

#### `class Succession(AnimationGroup)`

*No docstring available.*

**Methods:**

- `__init__(self, *animations, lag_ratio, **kwargs)`


- `begin(self)`


- `finish(self)`


- `update_mobjects(self, dt)`


- `interpolate(self, alpha)`



---

#### `class LaggedStart(AnimationGroup)`

*No docstring available.*

**Methods:**

- `__init__(self, *animations, lag_ratio, **kwargs)`



---

#### `class LaggedStartMap(LaggedStart)`

*No docstring available.*

**Methods:**

- `__init__(self, anim_func, group, run_time, lag_ratio, **kwargs)`



---

## Module: `animation/creation.py`

### Classes

#### `class ShowPartial(Animation, ABC)`

Abstract class for ShowCreation and ShowPassingFlash

**Methods:**

- `__init__(self, mobject, should_match_start, **kwargs)`


- `interpolate_submobject(self, submob, start_submob, alpha)`


- `@abstractmethod
get_bounds(self, alpha)`



---

#### `class ShowCreation(ShowPartial)`

*No docstring available.*

**Methods:**

- `__init__(self, mobject, lag_ratio, **kwargs)`


- `get_bounds(self, alpha)`



---

#### `class Uncreate(ShowCreation)`

*No docstring available.*

**Methods:**

- `__init__(self, mobject, rate_func, remover, should_match_start, **kwargs)`



---

#### `class DrawBorderThenFill(Animation)`

*No docstring available.*

**Methods:**

- `__init__(self, vmobject, run_time, rate_func, stroke_width, stroke_color, draw_border_animation_config, fill_animation_config, **kwargs)`


- `begin(self)`


- `finish(self)`


- `get_outline(self)`


- `get_all_mobjects(self)`


- `interpolate_submobject(self, submob, start, outline, alpha)`



---

#### `class Write(DrawBorderThenFill)`

*No docstring available.*

**Methods:**

- `__init__(self, vmobject, run_time, lag_ratio, rate_func, stroke_color, **kwargs)`


- `compute_run_time(self, family_size, run_time)`


- `compute_lag_ratio(self, family_size, lag_ratio)`



---

#### `class ShowIncreasingSubsets(Animation)`

*No docstring available.*

**Methods:**

- `__init__(self, group, int_func, suspend_mobject_updating, **kwargs)`


- `interpolate_mobject(self, alpha)`


- `update_submobject_list(self, index)`



---

#### `class ShowSubmobjectsOneByOne(ShowIncreasingSubsets)`

*No docstring available.*

**Methods:**

- `__init__(self, group, int_func, **kwargs)`


- `update_submobject_list(self, index)`



---

#### `class AddTextWordByWord(ShowIncreasingSubsets)`

*No docstring available.*

**Methods:**

- `__init__(self, string_mobject, time_per_word, run_time, rate_func, **kwargs)`


- `clean_up_from_scene(self, scene)`



---

## Module: `animation/fading.py`

### Classes

#### `class Fade(Transform)`

*No docstring available.*

**Methods:**

- `__init__(self, mobject, shift, scale, **kwargs)`



---

#### `class FadeIn(Fade)`

*No docstring available.*

**Methods:**

- `create_target(self)`


- `create_starting_mobject(self)`



---

#### `class FadeOut(Fade)`

*No docstring available.*

**Methods:**

- `__init__(self, mobject, shift, remover, final_alpha_value, **kwargs)`


- `create_target(self)`



---

#### `class FadeInFromPoint(FadeIn)`

*No docstring available.*

**Methods:**

- `__init__(self, mobject, point, **kwargs)`



---

#### `class FadeOutToPoint(FadeOut)`

*No docstring available.*

**Methods:**

- `__init__(self, mobject, point, **kwargs)`



---

#### `class FadeTransform(Transform)`

*No docstring available.*

**Methods:**

- `__init__(self, mobject, target_mobject, stretch, dim_to_match, **kwargs)`


- `begin(self)`


- `ghost_to(self, source, target)`


- `get_all_mobjects(self)`


- `get_all_families_zipped(self)`


- `clean_up_from_scene(self, scene)`



---

#### `class FadeTransformPieces(FadeTransform)`

*No docstring available.*

**Methods:**

- `begin(self)`


- `ghost_to(self, source, target)`



---

#### `class VFadeIn(Animation)`

VFadeIn and VFadeOut only work for VMobjects,

**Methods:**

- `__init__(self, vmobject, suspend_mobject_updating, **kwargs)`


- `interpolate_submobject(self, submob, start, alpha)`



---

#### `class VFadeOut(VFadeIn)`

*No docstring available.*

**Methods:**

- `__init__(self, vmobject, remover, final_alpha_value, **kwargs)`


- `interpolate_submobject(self, submob, start, alpha)`



---

#### `class VFadeInThenOut(VFadeIn)`

*No docstring available.*

**Methods:**

- `__init__(self, vmobject, rate_func, remover, final_alpha_value, **kwargs)`



---

## Module: `animation/growing.py`

### Classes

#### `class GrowFromPoint(Transform)`

*No docstring available.*

**Methods:**

- `__init__(self, mobject, point, point_color, **kwargs)`


- `create_target(self)`


- `create_starting_mobject(self)`



---

#### `class GrowFromCenter(GrowFromPoint)`

*No docstring available.*

**Methods:**

- `__init__(self, mobject, **kwargs)`



---

#### `class GrowFromEdge(GrowFromPoint)`

*No docstring available.*

**Methods:**

- `__init__(self, mobject, edge, **kwargs)`



---

#### `class GrowArrow(GrowFromPoint)`

*No docstring available.*

**Methods:**

- `__init__(self, arrow, **kwargs)`



---

## Module: `animation/indication.py`

### Classes

#### `class FocusOn(Transform)`

*No docstring available.*

**Methods:**

- `__init__(self, focus_point, opacity, color, run_time, remover, **kwargs)`


- `create_target(self)`


- `create_starting_mobject(self)`



---

#### `class Indicate(Transform)`

*No docstring available.*

**Methods:**

- `__init__(self, mobject, scale_factor, color, rate_func, **kwargs)`


- `create_target(self)`



---

#### `class Flash(AnimationGroup)`

*No docstring available.*

**Methods:**

- `__init__(self, point, color, line_length, num_lines, flash_radius, line_stroke_width, run_time, **kwargs)`


- `create_lines(self)`


- `create_line_anims(self)`



---

#### `class CircleIndicate(Transform)`

*No docstring available.*

**Methods:**

- `__init__(self, mobject, scale_factor, rate_func, stroke_color, stroke_width, remover, **kwargs)`



---

#### `class ShowPassingFlash(ShowPartial)`

*No docstring available.*

**Methods:**

- `__init__(self, mobject, time_width, remover, **kwargs)`


- `get_bounds(self, alpha)`


- `finish(self)`



---

#### `class VShowPassingFlash(Animation)`

*No docstring available.*

**Methods:**

- `__init__(self, vmobject, time_width, taper_width, remover, **kwargs)`


- `taper_kernel(self, x)`


- `begin(self)`


- `interpolate_submobject(self, submobject, starting_sumobject, alpha)`


- `finish(self)`



---

#### `class FlashAround(VShowPassingFlash)`

*No docstring available.*

**Methods:**

- `__init__(self, mobject, time_width, taper_width, stroke_width, color, buff, n_inserted_curves, **kwargs)`


- `get_path(self, mobject, buff)`



---

#### `class FlashUnder(FlashAround)`

*No docstring available.*

**Methods:**

- `get_path(self, mobject, buff)`



---

#### `class ShowCreationThenDestruction(ShowPassingFlash)`

*No docstring available.*

**Methods:**

- `__init__(self, vmobject, time_width, **kwargs)`



---

#### `class ShowCreationThenFadeOut(Succession)`

*No docstring available.*

**Methods:**

- `__init__(self, mobject, remover, **kwargs)`



---

#### `class AnimationOnSurroundingRectangle(AnimationGroup)`

*No docstring available.*

**Methods:**

- `__init__(self, mobject, stroke_width, stroke_color, buff, **kwargs)`



---

#### `class ShowPassingFlashAround(AnimationOnSurroundingRectangle)`

*No docstring available.*


---

#### `class ShowCreationThenDestructionAround(AnimationOnSurroundingRectangle)`

*No docstring available.*


---

#### `class ShowCreationThenFadeAround(AnimationOnSurroundingRectangle)`

*No docstring available.*


---

#### `class ApplyWave(Homotopy)`

*No docstring available.*

**Methods:**

- `__init__(self, mobject, direction, amplitude, run_time, **kwargs)`



---

#### `class WiggleOutThenIn(Animation)`

*No docstring available.*

**Methods:**

- `__init__(self, mobject, scale_value, rotation_angle, n_wiggles, scale_about_point, rotate_about_point, run_time, **kwargs)`


- `get_scale_about_point(self)`


- `get_rotate_about_point(self)`


- `interpolate_submobject(self, submobject, starting_sumobject, alpha)`



---

#### `class TurnInsideOut(Transform)`

*No docstring available.*

**Methods:**

- `__init__(self, mobject, path_arc, **kwargs)`


- `create_target(self)`



---

#### `class FlashyFadeIn(AnimationGroup)`

*No docstring available.*

**Methods:**

- `__init__(self, vmobject, stroke_width, fade_lag, time_width, **kwargs)`



---

## Module: `animation/movement.py`

### Classes

#### `class Homotopy(Animation)`

*No docstring available.*

**Methods:**

- `__init__(self, homotopy, mobject, run_time, **kwargs)`

  Homotopy is a function from
  (x, y, z, t) to (x', y', z')

- `function_at_time_t(self, t)`


- `interpolate_submobject(self, submob, start, alpha)`



---

#### `class SmoothedVectorizedHomotopy(Homotopy)`

*No docstring available.*


---

#### `class ComplexHomotopy(Homotopy)`

*No docstring available.*

**Methods:**

- `__init__(self, complex_homotopy, mobject, **kwargs)`

  Given a function form (z, t) -> w, where z and w
  are complex numbers and t is time, this animates
  the state over time


---

#### `class PhaseFlow(Animation)`

*No docstring available.*

**Methods:**

- `__init__(self, function, mobject, virtual_time, suspend_mobject_updating, rate_func, run_time, **kwargs)`


- `interpolate_mobject(self, alpha)`



---

#### `class MoveAlongPath(Animation)`

*No docstring available.*

**Methods:**

- `__init__(self, mobject, path, suspend_mobject_updating, **kwargs)`


- `interpolate_mobject(self, alpha)`



---

## Module: `animation/numbers.py`

### Classes

#### `class ChangingDecimal(Animation)`

*No docstring available.*

**Methods:**

- `__init__(self, decimal_mob, number_update_func, suspend_mobject_updating, **kwargs)`


- `interpolate_mobject(self, alpha)`



---

#### `class ChangeDecimalToValue(ChangingDecimal)`

*No docstring available.*

**Methods:**

- `__init__(self, decimal_mob, target_number, **kwargs)`



---

#### `class CountInFrom(ChangingDecimal)`

*No docstring available.*

**Methods:**

- `__init__(self, decimal_mob, source_number, **kwargs)`



---

## Module: `animation/rotation.py`

### Classes

#### `class Rotating(Animation)`

*No docstring available.*

**Methods:**

- `__init__(self, mobject, angle, axis, about_point, about_edge, run_time, rate_func, suspend_mobject_updating, **kwargs)`


- `interpolate_mobject(self, alpha)`



---

#### `class Rotate(Rotating)`

*No docstring available.*

**Methods:**

- `__init__(self, mobject, angle, axis, run_time, rate_func, about_edge, **kwargs)`



---

## Module: `animation/specialized.py`

### Classes

#### `class Broadcast(LaggedStart)`

*No docstring available.*

**Methods:**

- `__init__(self, focal_point, small_radius, big_radius, n_circles, start_stroke_width, color, run_time, lag_ratio, remover, **kwargs)`



---

## Module: `animation/transform.py`

### Classes

#### `class Transform(Animation)`

*No docstring available.*

**Methods:**

- `__init__(self, mobject, target_mobject, path_arc, path_arc_axis, path_func, **kwargs)`


- `init_path_func(self)`


- `begin(self)`


- `finish(self)`


- `create_target(self)`


- `check_target_mobject_validity(self)`


- `clean_up_from_scene(self, scene)`


- `update_config(self, **kwargs)`


- `get_all_mobjects(self)`


- `get_all_families_zipped(self)`


- `interpolate_submobject(self, submob, start, target_copy, alpha)`



---

#### `class ReplacementTransform(Transform)`

*No docstring available.*


---

#### `class TransformFromCopy(Transform)`

*No docstring available.*

**Methods:**

- `__init__(self, mobject, target_mobject, **kwargs)`



---

#### `class MoveToTarget(Transform)`

*No docstring available.*

**Methods:**

- `__init__(self, mobject, **kwargs)`


- `check_validity_of_input(self, mobject)`



---

#### `class ApplyMethod(Transform)`

*No docstring available.*

**Methods:**

- `__init__(self, method, *args, **kwargs)`

  method is a method of Mobject, *args are arguments for
  that method.  Key word arguments should be passed in
  as the last arg, as a dict, since **kwargs is for
  configuration of the transform itself
  
  Relies on the fact that mobject methods return the mobject

- `check_validity_of_input(self, method)`


- `create_target(self)`



---

#### `class ApplyPointwiseFunction(ApplyMethod)`

*No docstring available.*

**Methods:**

- `__init__(self, function, mobject, run_time, **kwargs)`



---

#### `class ApplyPointwiseFunctionToCenter(Transform)`

*No docstring available.*

**Methods:**

- `__init__(self, function, mobject, **kwargs)`


- `create_target(self)`



---

#### `class FadeToColor(ApplyMethod)`

*No docstring available.*

**Methods:**

- `__init__(self, mobject, color, **kwargs)`



---

#### `class ScaleInPlace(ApplyMethod)`

*No docstring available.*

**Methods:**

- `__init__(self, mobject, scale_factor, **kwargs)`



---

#### `class ShrinkToCenter(ScaleInPlace)`

*No docstring available.*

**Methods:**

- `__init__(self, mobject, **kwargs)`



---

#### `class Restore(Transform)`

*No docstring available.*

**Methods:**

- `__init__(self, mobject, **kwargs)`



---

#### `class ApplyFunction(Transform)`

*No docstring available.*

**Methods:**

- `__init__(self, function, mobject, **kwargs)`


- `create_target(self)`



---

#### `class ApplyMatrix(ApplyPointwiseFunction)`

*No docstring available.*

**Methods:**

- `__init__(self, matrix, mobject, **kwargs)`


- `initialize_matrix(self, matrix)`



---

#### `class ApplyComplexFunction(ApplyMethod)`

*No docstring available.*

**Methods:**

- `__init__(self, function, mobject, **kwargs)`


- `init_path_func(self)`



---

#### `class CyclicReplace(Transform)`

*No docstring available.*

**Methods:**

- `__init__(self, *mobjects, path_arc, **kwargs)`


- `create_target(self)`



---

#### `class Swap(CyclicReplace)`

Alternate name for CyclicReplace


---

## Module: `animation/transform_matching_parts.py`

### Classes

#### `class TransformMatchingParts(AnimationGroup)`

*No docstring available.*

**Methods:**

- `__init__(self, source, target, matched_pairs, match_animation, mismatch_animation, run_time, lag_ratio, **kwargs)`


- `add_transform(self, source, target)`


- `find_pairs_with_matching_shapes(self, chars1, chars2)`


- `clean_up_from_scene(self, scene)`



---

#### `class TransformMatchingShapes(TransformMatchingParts)`

Alias for TransformMatchingParts


---

#### `class TransformMatchingStrings(TransformMatchingParts)`

*No docstring available.*

**Methods:**

- `__init__(self, source, target, matched_keys, key_map, matched_pairs, **kwargs)`


- `matching_blocks(self, source, target, matched_keys, key_map)`



---

#### `class TransformMatchingTex(TransformMatchingStrings)`

Alias for TransformMatchingStrings


---

## Module: `animation/update.py`

### Classes

#### `class UpdateFromFunc(Animation)`

update_function of the form func(mobject), presumably
to be used when the state of one mobject is dependent
on another simultaneously animated mobject

**Methods:**

- `__init__(self, mobject, update_function, suspend_mobject_updating, **kwargs)`


- `interpolate_mobject(self, alpha)`



---

#### `class UpdateFromAlphaFunc(Animation)`

*No docstring available.*

**Methods:**

- `__init__(self, mobject, update_function, suspend_mobject_updating, **kwargs)`


- `interpolate_mobject(self, alpha)`



---

#### `class MaintainPositionRelativeTo(Animation)`

*No docstring available.*

**Methods:**

- `__init__(self, mobject, tracked_mobject, **kwargs)`


- `interpolate_mobject(self, alpha)`



---
