# Scene & Rendering Controller

This section documents the Scene lifecycle, construct methods, animations playback, interactive mode, and video files compilation.

## Module: `scene/scene.py`

### Classes

#### `class Scene(object)`

*No docstring available.*

**Methods:**

- `__init__(self, window, camera_config, file_writer_config, skip_animations, always_update_mobjects, start_at_animation_number, end_at_animation_number, show_animation_progress, leave_progress_bars, preview_while_skipping, presenter_mode, default_wait_time)`


- `get_window(self)`


- `run(self)`


- `setup(self)`

  This is meant to be implement by any scenes which
  are comonly subclassed, and have some common setup
  involved before the construct method is called.

- `construct(self)`


- `tear_down(self)`


- `interact(self)`

  If there is a window, enter a loop
  which updates the frame while under
  the hood calling the pyglet event loop

- `embed(self, close_scene_on_exit, show_animation_progress)`


- `get_image(self)`


- `show(self)`


- `update_frame(self, dt, force_draw)`


- `emit_frame(self)`


- `update_mobjects(self, dt)`


- `should_update_mobjects(self)`


- `get_time(self)`


- `increment_time(self, dt)`


- `get_top_level_mobjects(self)`


- `get_mobject_family_members(self)`


- `assemble_render_groups(self)`

  Rendering can be more efficient when mobjects of the
  same type are grouped together, so this function creates
  Groups of all clusters of adjacent Mobjects in the scene

- `@staticmethod
affects_mobject_list(func)`


- `@affects_mobject_list
add(self, *new_mobjects)`

  Mobjects will be displayed, from background to
  foreground in the order with which they are added.

- `add_mobjects_among(self, values)`

  This is meant mostly for quick prototyping,
  e.g. to add all mobjects defined up to a point,
  call self.add_mobjects_among(locals().values())

- `@affects_mobject_list
replace(self, mobject, *replacements)`


- `@affects_mobject_list
remove(self, *mobjects_to_remove)`

  Removes anything in mobjects from scenes mobject list, but in the event that one
  of the items to be removed is a member of the family of an item in mobject_list,
  the other family members are added back into the list.
  
  For example, if the scene includes Group(m1, m2, m3), and we call scene.remove(m1),
  the desired behavior is for the scene to then include m2 and m3 (ungrouped).

- `@affects_mobject_list
remove_all_except(self, *mobjects_to_keep)`


- `bring_to_front(self, *mobjects)`


- `@affects_mobject_list
bring_to_back(self, *mobjects)`


- `@affects_mobject_list
clear(self)`


- `get_mobjects(self)`


- `get_mobject_copies(self)`


- `point_to_mobject(self, point, search_set, buff)`

  E.g. if clicking on the scene, this returns the top layer mobject
  under a given point

- `get_group(self, *mobjects)`


- `id_to_mobject(self, id_value)`


- `ids_to_group(self, *id_values)`


- `i2g(self, *id_values)`


- `i2m(self, id_value)`


- `update_skipping_status(self)`


- `stop_skipping(self)`


- `get_time_progression(self, run_time, n_iterations, desc, override_skip_animations)`


- `get_run_time(self, animations)`


- `get_animation_time_progression(self, animations)`


- `get_wait_time_progression(self, duration, stop_condition)`


- `pre_play(self)`


- `post_play(self)`


- `begin_animations(self, animations)`


- `progress_through_animations(self, animations)`


- `finish_animations(self, animations)`


- `@affects_mobject_list
play(self, *proto_animations, run_time, rate_func, lag_ratio)`


- `wait(self, duration, stop_condition, note, ignore_presenter_mode)`


- `hold_loop(self)`


- `wait_until(self, stop_condition, max_time)`


- `force_skipping(self)`


- `revert_to_original_skipping_status(self)`


- `add_sound(self, sound_file, time_offset, gain, gain_to_background)`


- `get_state(self)`


- `@affects_mobject_list
restore_state(self, scene_state)`


- `save_state(self)`


- `undo(self)`


- `redo(self)`


- `@contextmanager
temp_skip(self)`


- `@contextmanager
temp_progress_bar(self)`


- `@contextmanager
temp_record(self)`


- `temp_config_change(self, skip, record, progress_bar)`


- `is_window_closing(self)`


- `set_floor_plane(self, plane)`


- `on_mouse_motion(self, point, d_point)`


- `on_mouse_drag(self, point, d_point, buttons, modifiers)`


- `on_mouse_press(self, point, button, mods)`


- `on_mouse_release(self, point, button, mods)`


- `on_mouse_scroll(self, point, offset, x_pixel_offset, y_pixel_offset)`


- `on_key_release(self, symbol, modifiers)`


- `on_key_press(self, symbol, modifiers)`


- `on_resize(self, width, height)`


- `on_show(self)`


- `on_hide(self)`


- `on_close(self)`


- `focus(self)`

  Puts focus on the ManimGL window.

- `set_background_color(self, background_color, background_opacity)`



---

#### `class SceneState`

*No docstring available.*

**Methods:**

- `__init__(self, scene, ignore)`


- `mobjects_match(self, state)`


- `n_changes(self, state)`


- `restore_scene(self, scene)`



---

#### `class EndScene(Exception)`

*No docstring available.*


---

#### `class ThreeDScene(Scene)`

*No docstring available.*

**Methods:**

- `add(self, *mobjects, set_depth_test, perp_stroke)`



---

## Module: `scene/interactive_scene.py`

### Constants

| Constant | Value |
| --- | --- |
| `SELECT_KEY` | `manim_config.key_bindings.select` |
| `UNSELECT_KEY` | `manim_config.key_bindings.unselect` |
| `GRAB_KEY` | `manim_config.key_bindings.grab` |
| `X_GRAB_KEY` | `manim_config.key_bindings.x_grab` |
| `Y_GRAB_KEY` | `manim_config.key_bindings.y_grab` |
| `Z_GRAB_KEY` | `manim_config.key_bindings.z_grab` |
| `GRAB_KEYS` | `[GRAB_KEY, X_GRAB_KEY, Y_GRAB_KEY, Z_GRAB_KEY]` |
| `RESIZE_KEY` | `manim_config.key_bindings.resize` |
| `COLOR_KEY` | `manim_config.key_bindings.color` |
| `INFORMATION_KEY` | `manim_config.key_bindings.information` |
| `CURSOR_KEY` | `manim_config.key_bindings.cursor` |
| `ALL_MODIFIERS` | `PygletWindowKeys.MOD_CTRL \| PygletWindowKeys.MOD_COMMAND \| PygletWindowKeys.MOD_SHIFT` |


### Classes

#### `class InteractiveScene(Scene)`

To select mobjects on screen, hold ctrl and move the mouse to highlight a region,
or just tap ctrl to select the mobject under the cursor.

Pressing command + t will toggle between modes where you either select top level
mobjects part of the scene, or low level pieces.

Hold 'g' to grab the selection and move it around
Hold 'h' to drag it constrained in the horizontal direction
Hold 'v' to drag it constrained in the vertical direction
Hold 't' to resize selection, adding 'shift' to resize with respect to a corner

Command + 'c' copies the ids of selections to clipboard
Command + 'v' will paste either:
    - The copied mobject
    - A Tex mobject based on copied LaTeX
    - A Text mobject based on copied Text
Command + 'z' restores selection back to its original state
Command + 's' saves the selected mobjects to file

**Methods:**

- `setup(self)`


- `get_selection_rectangle(self)`


- `update_selection_rectangle(self, rect)`


- `get_selection_highlight(self)`


- `update_selection_highlight(self, highlight)`


- `get_crosshair(self)`


- `get_color_palette(self)`


- `get_information_label(self)`


- `get_state(self)`


- `restore_state(self, scene_state)`


- `add(self, *mobjects)`


- `remove(self, *mobjects)`


- `remove_all_except(self, *mobjects_to_keep)`


- `toggle_selection_mode(self)`


- `get_selection_search_set(self)`


- `regenerate_selection_search_set(self)`


- `refresh_selection_scope(self)`


- `get_corner_dots(self, mobject)`


- `get_highlight(self, mobject)`


- `add_to_selection(self, *mobjects)`


- `toggle_from_selection(self, *mobjects)`


- `clear_selection(self)`


- `disable_interaction(self, *mobjects)`


- `enable_interaction(self, *mobjects)`


- `copy_selection(self)`


- `paste_selection(self)`


- `delete_selection(self)`


- `enable_selection(self)`


- `gather_new_selection(self)`


- `prepare_grab(self)`


- `prepare_resizing(self, about_corner)`


- `toggle_color_palette(self)`


- `display_information(self, show)`


- `group_selection(self)`


- `ungroup_selection(self)`


- `nudge_selection(self, vect, large)`


- `on_key_press(self, symbol, modifiers)`


- `on_key_release(self, symbol, modifiers)`


- `handle_grabbing(self, point)`


- `handle_resizing(self, point)`


- `handle_sweeping_selection(self, point)`


- `choose_color(self, point)`


- `on_mouse_motion(self, point, d_point)`


- `on_mouse_drag(self, point, d_point, buttons, modifiers)`


- `on_mouse_release(self, point, button, mods)`


- `copy_frame_positioning(self)`


- `copy_cursor_position(self)`



---

## Module: `scene/scene_file_writer.py`

### Classes

#### `class SceneFileWriter(object)`

*No docstring available.*

**Methods:**

- `__init__(self, scene, write_to_movie, subdivide_output, png_mode, save_last_frame, movie_file_extension, output_directory, file_name, open_file_upon_completion, show_file_location_upon_completion, quiet, total_frames, progress_description_len, ffmpeg_bin, video_codec, pixel_format, saturation, gamma)`


- `init_output_directories(self)`


- `init_image_file_path(self)`


- `init_movie_file_path(self)`


- `init_partial_movie_directory(self)`


- `get_output_file_rootname(self)`


- `get_output_file_name(self)`


- `get_image_file_path(self)`


- `get_next_partial_movie_path(self)`


- `get_movie_file_path(self)`


- `init_audio(self)`


- `create_audio_segment(self)`


- `add_audio_segment(self, new_segment, time, gain_to_background)`


- `add_sound(self, sound_file, time, gain, gain_to_background)`


- `begin(self)`


- `begin_animation(self)`


- `end_animation(self)`


- `finish(self)`


- `open_movie_pipe(self, file_path)`


- `use_fast_encoding(self)`


- `get_insert_file_path(self, index)`


- `begin_insert(self)`


- `end_insert(self)`


- `has_progress_display(self)`


- `set_progress_display_description(self, file, sub_desc)`


- `write_frame(self, camera)`


- `close_movie_pipe(self)`


- `add_sound_to_video(self)`


- `save_final_image(self, image)`


- `print_file_ready_message(self, file_path)`


- `should_open_file(self)`


- `open_file(self)`



---
