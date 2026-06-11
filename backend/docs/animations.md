# Animations and Transitions

In Manim, animations are executed by calling `self.play(animation_instance)`. You can run multiple animations simultaneously by separating them with commas, or control their pacing and run time.

## Creation Animations

- **`ShowCreation(mobject)`**: Animates the drawing of a VMobject (draws its outline).
- **`Write(text_mobject)`**: Renders text or LaTeX formulas letter-by-letter, simulating writing.
- **`FadeIn(mobject)`**: Fades an object in from transparent.
- **`FadeOut(mobject)`**: Fades an object out to transparent.
- **`GrowFromCenter(mobject)`**: Makes an object grow from its center point.
- **`SpinInFromNothing(mobject)`**: Spins and scales an object up from nothing.

## Transformation Animations

- **`Transform(start_mobject, target_mobject)`**: Smoothly interpolates the shape and position of `start_mobject` into `target_mobject`.
  - **Note**: The original `start_mobject` stays in the scene but takes the shape/color of `target_mobject`.
- **`ReplacementTransform(start_mobject, target_mobject)`**: Similar to `Transform`, but it actually removes `start_mobject` from the scene and replaces it with `target_mobject`.
- **`Rotate(mobject, angle=PI/2)`**: Animates the rotation of an object.
- **`ScaleInPlace(mobject, scale_factor)`**: Resizes an object smoothly.

## Special and Custom Animations

- **`Indicate(mobject, color=YELLOW)`**: Briefly highlights and flashes an object to draw attention.
- **`Circumscribe(mobject)`**: Draws a temporary boundary shape (circle or rectangle) around the object.
- **`FocusOn(mobject_or_point)`**: Draws a shrinking dot animation focusing on a specific spot.
- **`ApplyMethod(mobject.method_name, *args)`**: Animates any standard modification method on the object. E.g., `self.play(circle.animate.set_color(BLUE).shift(UP))` uses the modern `.animate` syntax, which is preferred:
  - **`mobject.animate.method()`**: You can prefix any change with `.animate` to turn it into an animation. E.g., `self.play(circle.animate.scale(2).shift(LEFT))`

## Animation Configuration

You can customize animations using optional parameters:
- **`run_time`**: Controls the length of the animation in seconds.
  - `self.play(ShowCreation(circle), run_time=3.0)`
- **`rate_func`**: Controls the interpolation speed profile (easing). Common rate functions:
  - `linear`: Steady speed.
  - `smooth`: Slow start, fast middle, slow end (default).
  - `there_and_back`: Plays the animation forward then reverses it.
  - `exponential_decay`: Rapid progress that slows down exponentially.
  - E.g., `self.play(FadeIn(circle), rate_func=linear)`
