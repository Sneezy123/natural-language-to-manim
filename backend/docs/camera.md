# Camera & Frame

This section documents the Camera settings, 3D viewport angles, focal length, pixel dimensions, and background color settings.

## Module: `camera/camera.py`

### Classes

#### `class Camera(object)`

*No docstring available.*

**Methods:**

- `__init__(self, window, background_image, frame_config, resolution, fps, background_color, background_opacity, max_allowable_norm, image_mode, n_channels, pixel_array_dtype, light_source_position, samples)`


- `init_frame(self, **config)`


- `init_context(self)`


- `init_fbo(self)`


- `init_light_source(self)`


- `use_window_fbo(self, use)`


- `get_fbo(self, samples)`


- `clear(self)`


- `blit(self, src_fbo, dst_fbo)`

  Copy blocks between fbo's using Blit

- `get_raw_fbo_data(self, dtype)`


- `get_image(self)`


- `get_pixel_array(self)`


- `get_texture(self)`


- `get_pixel_size(self)`


- `get_pixel_shape(self)`


- `get_pixel_width(self)`


- `get_pixel_height(self)`


- `get_aspect_ratio(self)`


- `get_frame_height(self)`


- `get_frame_width(self)`


- `get_frame_shape(self)`


- `get_frame_center(self)`


- `get_location(self)`


- `resize_frame_shape(self, fixed_dimension)`

  Changes frame_shape to match the aspect ratio
  of the pixels, where fixed_dimension determines
  whether frame_height or frame_width
  remains fixed while the other changes accordingly.

- `capture(self, *mobjects)`


- `refresh_uniforms(self)`



---

#### `class ThreeDCamera(Camera)`

*No docstring available.*

**Methods:**

- `__init__(self, samples, **kwargs)`



---

## Module: `camera/camera_frame.py`

### Classes

#### `class CameraFrame(Mobject)`

*No docstring available.*

**Methods:**

- `__init__(self, frame_shape, center_point, fovy, euler_axes, z_index, **kwargs)`


- `set_orientation(self, rotation)`


- `get_orientation(self)`


- `make_orientation_default(self)`


- `to_default_state(self)`


- `get_euler_angles(self)`


- `get_theta(self)`


- `get_phi(self)`


- `get_gamma(self)`


- `get_scale(self)`


- `get_inverse_camera_rotation_matrix(self)`


- `get_view_matrix(self, refresh)`

  Returns a 4x4 for the affine transformation mapping a point
  into the camera's internal coordinate system

- `get_inv_view_matrix(self)`


- `interpolate(self, *args, **kwargs)`


- `rotate(self, angle, axis, **kwargs)`


- `set_euler_angles(self, theta, phi, gamma, units)`


- `increment_euler_angles(self, dtheta, dphi, dgamma, units)`


- `set_euler_axes(self, seq)`


- `reorient(self, theta_degrees, phi_degrees, gamma_degrees, center, height)`

  Shortcut for set_euler_angles, defaulting to taking
  in angles in degrees

- `set_theta(self, theta)`


- `set_phi(self, phi)`


- `set_gamma(self, gamma)`


- `increment_theta(self, dtheta, units)`


- `increment_phi(self, dphi, units)`


- `increment_gamma(self, dgamma, units)`


- `add_ambient_rotation(self, angular_speed)`


- `set_focal_distance(self, focal_distance)`


- `set_field_of_view(self, field_of_view)`


- `get_shape(self)`


- `get_aspect_ratio(self)`


- `get_center(self)`


- `get_width(self)`


- `get_height(self)`


- `get_focal_distance(self)`


- `get_field_of_view(self)`


- `get_implied_camera_location(self)`


- `to_fixed_frame_point(self, point, relative)`


- `from_fixed_frame_point(self, point, relative)`



---
