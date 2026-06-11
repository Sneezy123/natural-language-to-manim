import numpy as np
from manimlib import *

class SquarePointsCenterOfMass(Scene):
    def construct(self):
        # Define the side length of the square for point placement
        side_length = 4
        half_side = side_length / 2

        # 1. Create 4 points arranged in a square shape
        # Points are placed symmetrically around the origin
        p1 = Dot(point=LEFT * half_side + UP * half_side, color=BLUE, radius=0.08)
        p2 = Dot(point=RIGHT * half_side + UP * half_side, color=BLUE, radius=0.08)
        p3 = Dot(point=RIGHT * half_side + DOWN * half_side, color=BLUE, radius=0.08)
        p4 = Dot(point=LEFT * half_side + DOWN * half_side, color=BLUE, radius=0.08)

        points = VGroup(p1, p2, p3, p4)

        # Animate the creation of the points
        self.play(
            ShowCreation(points),
            run_time=2
        )
        self.wait(1)

        # 2. Calculate the initial center of mass
        # For N points, CM = (sum of all point vectors) / N
        # Since the points are symmetric around the origin, the center of mass will be at the origin.
        initial_cm_position = (p1.get_center() + p2.get_center() + p3.get_center() + p4.get_center()) / 4

        # Create a Circle for the center of mass (small dot with only stroke)
        cm_dot = Circle(radius=0.08, color=ORANGE, stroke_width=3, fill_opacity=0).move_to(initial_cm_position)

        # Animate the appearance of the center of mass
        self.play(
            ShowCreation(cm_dot),
            run_time=1.5
        )
        self.wait(1)

        # 3. Prepare for transformation to new random locations
        new_positions = []
        max_offset_radius = 1.0 # "within 1 unit" of the original position

        for point in points:
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

        # 4. Animate the points transforming to new locations
        # We create a list of animations, one for each point moving to its new_pos
        point_animations = []
        for i, point in enumerate(points):
            point_animations.append(point.animate.move_to(new_positions[i]))

        self.play(
            *point_animations, # Unpack the list of animations
            run_time=2
        )
        self.wait(1)

        # 5. Calculate the new center of mass for the transformed points
        # The 'points' VGroup now holds the points at their new positions
        new_cm_position = (p1.get_center() + p2.get_center() + p3.get_center() + p4.get_center()) / 4

        # 6. Animate the center of mass moving to its new position
        self.play(
            cm_dot.animate.move_to(new_cm_position),
            run_time=1.5
        )
        self.wait(2)