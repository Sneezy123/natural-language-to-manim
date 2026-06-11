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

        # 2. Calculate the center of mass
        # For N points, CM = (sum of all point vectors) / N
        # Since the points are symmetric around the origin, the center of mass will be at the origin.
        cm_position = (p1.get_center() + p2.get_center() + p3.get_center() + p4.get_center()) / 4

        # Create a Circle for the center of mass (small dot with only stroke)
        cm_dot = Circle(radius=0.08, color=ORANGE, stroke_width=3, fill_opacity=0).move_to(cm_position)

        # Animate the appearance of the center of mass
        self.play(
            ShowCreation(cm_dot),
            run_time=1.5
        )
        self.wait(1)