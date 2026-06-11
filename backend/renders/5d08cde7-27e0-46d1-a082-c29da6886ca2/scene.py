from manimlib import *

class ManimStudioScene(Scene):
    def construct(self):
        # Create a title
        title = Text("NL to Manim Studio", font_size=36, color=BLUE)
        title.to_edge(UP, buff=0.5)

        # Create shapes
        circle = Circle(radius=1.2, color=TEAL, fill_opacity=0.4)
        square = Square(side_length=2.0, color=ORANGE, fill_opacity=0.3)

        # Position shapes
        circle.shift(LEFT * 1.5)
        square.shift(RIGHT * 1.5)

        # Play animations
        self.play(Write(title))
        self.play(ShowCreation(circle), run_time=1.5)
        self.play(FadeIn(square, shift=UP), run_time=1.5)

        self.wait(0.5)

        # Animate transformations
        self.play(
            circle.animate.set_color(PURPLE).scale(1.2),
            square.animate.rotate(PI/4).set_color(GOLD),
            run_time=2.0
        )
        self.wait(1.5)
