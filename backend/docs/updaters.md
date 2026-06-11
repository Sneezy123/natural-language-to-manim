# Updaters and Value Trackers

Updaters allow you to define mathematical relationships between objects. Whenever an object moves or changes, all its registered updater functions run on every frame to recalculate its properties.

## Value Trackers

A `ValueTracker` is an invisible object that stores a single floating-point number. You can animate the value of the tracker using standard transitions, and use it to drive other Mobjects.

- **`tracker = ValueTracker(initial_value)`**: Creates a value tracker.
- **`tracker.get_value()`**: Returns the current value.
- **`tracker.animate.set_value(new_value)`**: Animates the change of the value.

## Frame-by-frame Updaters

You can attach a callback function to any Mobject using `add_updater()`. The function is called every frame with the object as its argument.

- **`mobject.add_updater(callback_function)`**: Registers an updater.
- **`mobject.remove_updater(callback_function)`**: Removes an updater.
- **`mobject.clear_updaters()`**: Clears all updaters.

### Example: Point following a line

```python
class UpdaterExample(Scene):
    def construct(self):
        # 1. Create a ValueTracker starting at 0
        x_tracker = ValueTracker(-2)
        
        # 2. Create axes and a plot
        axes = Axes(x_range=[-3, 3], y_range=[-2, 4])
        graph = axes.get_graph(lambda x: x**2, color=BLUE)
        
        # 3. Create a dot that automatically updates its position based on the tracker
        dot = Dot(color=RED)
        dot.add_updater(
            lambda m: m.move_to(
                axes.c2p(x_tracker.get_value(), x_tracker.get_value()**2)
            )
        )
        
        self.add(axes, graph, dot)
        
        # 4. Animate the tracker, which moves the dot along the parabola
        self.play(x_tracker.animate.set_value(2), run_time=4, rate_func=linear)
        self.wait()
```

### Linking Text to a Value Tracker

You can render numbers that change dynamically:

```python
tracker = ValueTracker(0)

# Create a decimal number that updates itself to match the tracker
number = DecimalNumber(num_decimal_places=2)
number.add_updater(lambda d: d.set_value(tracker.get_value()))
```
