import numpy as np
from manimlib import *

class SquarePointsCenterOfMass(Scene):
    def construct(self):
        # Define the side length of the square for point placement
        side_length = 4
        half_side = side_length / 2

        # 1. Create 4 original points arranged in a square shape.
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
        current_p1 = Dot(point=original_p1.get_center(), color=BLUE, radius=0.08)
        current_p2 = Dot(point=original_p2.get_center(), color=BLUE, radius=0.08)
        current_p3 = Dot(point=original_p3.get_center(), color=BLUE, radius=0.08)
        current_p4 = Dot(point=original_p4.get_center(), color=BLUE, radius=0.08)

        current_points = VGroup(current_p1, current_p2, current_p3, current_p4)

        # Animate the creation of the current (moving) points.
        self.play(
            ShowCreation(current_points),
            run_time=1
        )
        self.wait(0.5)

        # 3. Calculate the initial center of mass
        initial_cm_position = (current_p1.get_center() + current_p2.get_center() + current_p3.get_center() + current_p4.get_center()) / 4

        # Create a Circle for the center of mass
        cm_dot = Circle(radius=0.08, color=ORANGE, stroke_width=3, fill_opacity=0).move_to(initial_cm_position)
        
        # Create a copy of the center of mass
        cm_dot_copy = cm_dot.copy()

        # Animate the appearance of the center of mass and its copy
        self.play(
            ShowCreation(cm_dot),
            ShowCreation(cm_dot_copy),
            run_time=1
        )
        self.wait(1)

        # 4. Prepare for transformation
        new_positions = []
        max_offset_radius = 1.0 
        
        rng = np.random.default_rng()
        for point in original_points:
            original_pos = point.get_center()
            r = max_offset_radius * np.sqrt(rng.random())
            theta = 2 * np.pi * rng.random()
            offset_x = r * np.cos(theta)
            offset_y = r * np.sin(theta)
            random_offset = np.array([offset_x, offset_y, 0])
            new_pos = original_pos + random_offset
            new_positions.append(new_pos)

        # 5. Add an updater to the center of mass dot.
        def update_cm_position(mobject):
            current_cm = (current_p1.get_center() + current_p2.get_center() + current_p3.get_center() + current_p4.get_center()) / 4
            mobject.move_to(current_cm)

        cm_dot_copy.add_updater(update_cm_position)

        # 6. Animate the 'current_points' and 'cm_dot' changing color and moving
        point_animations = [point_m.animate.move_to(new_positions[i]).set_color(YELLOW) for i, point_m in enumerate(current_points)]

        self.play(
            *point_animations,
            cm_dot.animate.set_color(RED),
            cm_dot_copy.animate.set_color(PURPLE),
            run_time=3
        )
        self.wait(1)

        # 7. Remove the updater
        cm_dot.remove_updater(update_cm_position)
        cm_dot_copy.remove_updater(update_cm_position)

        self.wait(2)