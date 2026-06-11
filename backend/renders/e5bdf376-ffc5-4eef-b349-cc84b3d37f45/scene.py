import numpy as np
from manimlib import *

class SquarePointsCenterOfMass(Scene):
    def construct(self):
        # Define the side length of the square for point placement
        side_length = 4
        half_side = side_length / 2

        # 1. Create 4 original points arranged in a square shape.
        # These points will remain static and serve as a visual reference for the initial positions.
        # Using a lighter blue to distinguish them from the moving points.
        original_p1 = Dot(point=LEFT * half_side + UP * half_side, color=BLUE_C, radius=0.08)
        original_p2 = Dot(point=RIGHT * half_side + UP * half_side, color=BLUE_C, radius=0.08)
        original_p3 = Dot(point=RIGHT * half_side + DOWN * half_side, color=BLUE_C, radius=0.08)
        original_p4 = Dot(point=LEFT * half_side + DOWN * half_side, color=BLUE_C, radius=0.08)

        original_points = VGroup(original_p1, original_p2, original_p3, original_p4)

        # Animate the creation of the original (static) points
        self.play(
            ShowCreation(original_points),
            run_time=1.5
        )
        self.wait(0.5)

        # 2. Create 4 "current" points, initially at the same positions as the original points.
        # These are the points that will be animated to move to new random locations.
        current_p1 = Dot(point=original_p1.get_center(), color=BLUE, radius=0.08)
        current_p2 = Dot(point=original_p2.get_center(), color=BLUE, radius=0.08)
        current_p3 = Dot(point=original_p3.get_center(), color=BLUE, radius=0.08)
        current_p4 = Dot(point=original_p4.get_center(), color=BLUE, radius=0.08)

        current_points = VGroup(current_p1, current_p2, current_p3, current_p4)

        # Animate the creation of the current (moving) points. They appear on top of the originals.
        self.play(
            ShowCreation(current_points),
            run_time=1
        )
        self.wait(0.5)

        # 3. Calculate the initial center of mass (using the current_points, which are at initial positions)
        initial_cm_position = (current_p1.get_center() + current_p2.get_center() + current_p3.get_center() + current_p4.get_center()) / 4

        # Create a Circle for the center of mass (small dot with only stroke)
        cm_dot = Circle(radius=0.08, color=ORANGE, stroke_width=3, fill_opacity=0).move_to(initial_cm_position)

        # Animate the appearance of the center of mass
        self.play(
            ShowCreation(cm_dot),
            run_time=1
        )
        self.wait(1)

        # 4. Prepare for transformation of 'current_points' to new random locations
        new_positions = []
        max_offset_radius = 1.0 # "within 1 unit" of the original position

        # Calculate new positions relative to the original (static) points' initial positions
        for point in original_points:
            original_pos = point.get_center()

            # Generate a random offset within a circle of max_offset_radius
            # Using np.sqrt(np.random.rand()) ensures a uniform distribution of points within the circle
            r = max_offset_radius * np.sqrt(np.random.rand())
            theta = 2 * np.pi * np.random.rand()

            offset_x = r * np.cos(theta)
            offset_y = r * np.sin(theta)
            random_offset = np.array([offset_x, offset_y, 0])

            new_pos = original_pos + random_offset
            new_positions.append(new_pos)

        # 5. Add an updater to the center of mass dot.
        # This updater will continuously calculate and update the CM position
        # based on the current positions of 'current_points' during their animation.
        def update_cm_position(mobject):
            current_cm = (current_p1.get_center() + current_p2.get_center() + current_p3.get_center() + current_p4.get_center()) / 4
            mobject.move_to(current_cm)

        cm_dot.add_updater(update_cm_position)

        # 6. Animate the 'current_points' transforming to their new random locations.
        # The cm_dot will automatically track their center of mass due to the updater.
        point_animations = []
        for i, point_m in enumerate(current_points):
            point_animations.append(point_m.animate.move_to(new_positions[i]))

        self.play(
            *point_animations, # Unpack the list of animations
            run_time=3 # Increased run_time for smoother CM tracking
        )
        self.wait(1)

        # 7. Remove the updater from the center of mass dot once the animation is complete.
        cm_dot.remove_updater(update_cm_position)

        self.wait(2)