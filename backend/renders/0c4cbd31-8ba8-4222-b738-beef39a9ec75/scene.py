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

        # Add labels for each point
        label_p1 = TexText("P1").next_to(p1, UL, buff=0.1).set_color(BLUE)
        label_p2 = TexText("P2").next_to(p2, UR, buff=0.1).set_color(BLUE)
        label_p3 = TexText("P3").next_to(p3, DR, buff=0.1).set_color(BLUE)
        label_p4 = TexText("P4").next_to(p4, DL, buff=0.1).set_color(BLUE)
        point_labels = VGroup(label_p1, label_p2, label_p3, label_p4)

        # Animate the creation of the points and their labels
        self.play(
            ShowCreation(points),
            ShowCreation(point_labels),
            run_time=2
        )
        self.wait(1)

        # 2. Calculate the center of mass
        # For N points, CM = (sum of all point vectors) / N
        # Since the points are symmetric around the origin, the center of mass will be at the origin.
        cm_position = (p1.get_center() + p2.get_center() + p3.get_center() + p4.get_center()) / 4

        # Create a Dot for the center of mass
        cm_dot = Dot(point=cm_position, color=ORANGE, radius=0.15) # Make it slightly larger and a different color
        cm_label = TexText("CM").next_to(cm_dot, DOWN, buff=0.2).set_color(ORANGE)

        # Animate the appearance of the center of mass
        self.play(
            ShowCreation(cm_dot),
            ShowCreation(cm_label),
            run_time=1.5
        )
        self.wait(1)

        # Optional: Draw lines from each point to the center of mass to visualize
        line1 = Line(p1.get_center(), cm_dot.get_center(), color=GOLD, stroke_width=2)
        line2 = Line(p2.get_center(), cm_dot.get_center(), color=GOLD, stroke_width=2)
        line3 = Line(p3.get_center(), cm_dot.get_center(), color=GOLD, stroke_width=2)
        line4 = Line(p4.get_center(), cm_dot.get_center(), color=GOLD, stroke_width=2)
        lines_to_cm = VGroup(line1, line2, line3, line4)

        self.play(
            ShowCreation(lines_to_cm),
            run_time=2
        )
        self.wait(2)