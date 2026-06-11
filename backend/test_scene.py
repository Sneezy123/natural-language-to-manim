from manimlib import *

class TestScene(Scene):
    def construct(self):
        circle = Circle(color=BLUE)
        self.play(ShowCreation(circle))
        self.wait(1)
