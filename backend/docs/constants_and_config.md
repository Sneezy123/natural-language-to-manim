# Constants & Config

This section documents the foundational configuration settings, global constants, logger setup, and type hints of Manim.

## Module: `constants.py`

### Constants

| Constant | Value |
| --- | --- |
| `NULL_POINTS` | `np.array([[0.0, 0.0, 0.0]])` |
| `DEGREES` | `DEG` |


## Module: `config.py`

### Functions

#### `initialize_manim_config()`

Return default configuration for various classes in manim, such as
Scene, Window, Camera, and SceneFileWriter, as well as configuration
determining how the scene is run (e.g. written to file or previewed in window).

The result is initially on the contents of default_config.yml in the manimlib directory,
which can be further updated by a custom configuration file custom_config.yml.
It is further updated based on command line argument.

---
#### `parse_cli()`

*No docstring available.*

---
#### `update_directory_config(config)`

*No docstring available.*

---
#### `update_window_config(config, args)`

*No docstring available.*

---
#### `update_camera_config(config, args)`

*No docstring available.*

---
#### `update_file_writer_config(config, args)`

*No docstring available.*

---
#### `update_scene_config(config, args)`

*No docstring available.*

---
#### `update_run_config(config, args)`

*No docstring available.*

---
#### `update_embed_config(config, args)`

*No docstring available.*

---
#### `load_yaml(file_path)`

*No docstring available.*

---
#### `get_manim_dir()`

*No docstring available.*

---
#### `get_resolution_from_args(args, resolution_options)`

*No docstring available.*

---
#### `get_file_ext(args)`

*No docstring available.*

---
#### `get_animations_numbers(args)`

*No docstring available.*

---
#### `get_output_directory(args, config)`

*No docstring available.*

---


## Module: `typing.py`

## Module: `logger.py`

### Constants

| Constant | Value |
| --- | --- |
| `FORMAT` | `'%(message)s'` |

