export type Provider = "gemini" | "openai";

export interface LLMConfig {
  provider: Provider;
  apiKey: string;
  model: string;
}

export function extractCode(text: string): string {
  const codeBlockRegex = /```(?:python)?\s*([\s\S]*?)```/i;
  const match = text.match(codeBlockRegex);
  if (match && match[1]) {
    return match[1].trim();
  }

  // Fallback: search for from manimlib import * or from manim import *
  if (text.includes("from manimlib import *")) {
    const startIdx = text.indexOf("from manimlib import *");
    return text.substring(startIdx).trim();
  }
  if (text.includes("from manim import *")) {
    const startIdx = text.indexOf("from manim import *");
    return text.substring(startIdx).trim();
  }

  return text.trim();
}

/**
 * Core ManimGL cheat-sheet always injected to prevent common mistakes.
 * Compact (~200 lines) so it never overflows context.
 */
const MANIMGL_CHEATSHEET = `
## CRITICAL ManimGL (manimlib) API Rules – READ CAREFULLY

### Import
\`\`\`python
from manimlib import *  # ALWAYS use this. NEVER "from manim import *"
\`\`\`

### Scene structure
\`\`\`python
class MyScene(Scene):
    def construct(self):
        # All code goes here
\`\`\`

### Drawing / creation animations (VERY IMPORTANT)
- Use \`ShowCreation(mob)\`         ← draws the object onscreen
- NEVER use \`Create(mob)\`          ← does NOT exist in manimlib
- Use \`Write(text_mob)\`            ← for Text/Tex objects
- Use \`DrawBorderThenFill(mob)\`    ← for filled shapes with border

### Text and LaTeX
- \`Text("Hello world")\`            ← plain text (no LaTeX)
- \`Tex(r"e^{i\\pi}+1=0")\`           ← LaTeX math (renders $...$)
- \`TexText(r"Hello \\textbf{world}")\` ← LaTeX text block
- NEVER use \`MathTex\`               ← does NOT exist in manimlib
- NEVER use \`Tex("some text")\` for plain text (use Text instead)

### Transformations / animations
- \`self.play(mob.animate.shift(UP))\`
- \`self.play(mob.animate.scale(2))\`
- \`self.play(mob.animate.rotate(PI/4))\`
- \`self.play(mob.animate.set_color(RED))\`
- \`self.play(Transform(mob_a, mob_b))\`   ← morphs mob_a into mob_b
- \`self.play(ReplacementTransform(a, b))\`
- \`self.play(FadeIn(mob))\`, \`FadeOut(mob)\`
- \`self.play(GrowFromCenter(mob))\`
- \`self.play(ApplyMethod(mob.shift, UP))\`  ← alternative

### Positioning
- \`mob.to_edge(UP)\`, \`mob.to_edge(DOWN)\`, \`mob.to_edge(LEFT)\`, \`mob.to_edge(RIGHT)\`
- \`mob.to_corner(UL)\`, \`mob.to_corner(DR)\` etc.
- \`mob.next_to(other_mob, RIGHT, buff=0.3)\`
- \`mob.shift(RIGHT * 2 + UP * 1)\`
- \`mob.move_to(ORIGIN)\`
- \`mob.align_to(other_mob, LEFT)\`

### Shapes
- \`Circle(radius=1, color=BLUE, fill_opacity=0.5)\`
- \`Square(side_length=2, color=RED)\`
- \`Rectangle(width=3, height=2, color=GREEN)\`
- \`Line(start=LEFT, end=RIGHT, color=WHITE)\`
- \`Arrow(start=ORIGIN, end=UP*2)\`
- \`Dot(point=ORIGIN, color=YELLOW)\`
- \`Arc(radius=1, start_angle=0, angle=PI)\`
- \`Polygon(np.array([...]), np.array([...]), ...)\`
- \`Triangle()\`
- \`Annulus(inner_radius=0.5, outer_radius=1.5)\`

### Colors (constants)
RED, BLUE, GREEN, YELLOW, PURPLE, ORANGE, TEAL, GOLD, PINK, WHITE, BLACK,
GREY, GREY_A, GREY_B, GREY_C, GREY_D, GREY_E, MAROON, DARK_BLUE, DARK_BROWN,
LIGHT_GREY, LIGHT_BROWN, BLUE_A to BLUE_E, RED_A to RED_E, GREEN_A to GREEN_E

### Coordinate system constants
ORIGIN = [0,0,0], UP = [0,1,0], DOWN = [0,-1,0], LEFT = [-1,0,0], RIGHT = [1,0,0]
UL, UR, DL, DR (diagonal corners), IN = [0,0,1], OUT = [0,0,-1]

### Number plane / axes
\`\`\`python
axes = Axes(
    x_range=(-5, 5, 1),
    y_range=(-3, 3, 1),
)
# Plot a function:
graph = axes.get_graph(lambda x: np.sin(x), color=BLUE)
# NEVER use axes.plot() – use axes.get_graph() instead
self.play(ShowCreation(axes), ShowCreation(graph))
\`\`\`

### Updaters
\`\`\`python
def update_fn(mob, dt):
    mob.rotate(dt)
mob.add_updater(update_fn)
self.wait(2)
mob.remove_updater(update_fn)
\`\`\`

### ValueTracker
\`\`\`python
tracker = ValueTracker(0)
mob.add_updater(lambda m: m.set_value(tracker.get_value()))
self.play(tracker.animate.set_value(5))
\`\`\`

### Group
\`\`\`python
group = VGroup(circle, square, text)
group.arrange(RIGHT, buff=0.5)
self.play(ShowCreation(group))
\`\`\`

### Timing
- \`self.wait(1)\`      ← pause for 1 second
- \`self.wait()\`       ← default wait
- \`run_time=2\` kwarg on self.play()

### Camera / frame
\`\`\`python
self.camera.frame.move_to(mob)
self.camera.frame.set_height(8)
self.camera.frame.reorient(thetaDegrees, phiDegrees, gammaDegrees, centerVect3, height)
self.camera.frame.add_ambient_rotation()
self.play(self.camera.frame.animate.scale(1.5))
\`\`\`
`;

/**
 * Pick the most relevant documentation file based on user prompt keywords.
 * Returns at most 1 full doc file to avoid context overflow.
 */
function selectRelevantDoc(
  prompt: string,
  docs: Record<string, string>,
): string {
  const lower = prompt.toLowerCase();

  // Map keyword groups to doc filenames
  const rules: Array<{ keywords: string[]; file: string }> = [
    {
      keywords: [
        "tex",
        "latex",
        "math",
        "formula",
        "equation",
        "text",
        "write",
        "label",
        "brace",
      ],
      file: "text_and_tex.md",
    },
    {
      keywords: [
        "axes",
        "graph",
        "plot",
        "coordinate",
        "number line",
        "function",
        "vector field",
        "curve",
      ],
      file: "coordinate_systems.md",
    },
    {
      keywords: [
        "circle",
        "square",
        "rectangle",
        "polygon",
        "triangle",
        "line",
        "arrow",
        "arc",
        "shape",
        "geometry",
        "3d",
        "sphere",
        "cylinder",
        "prism",
      ],
      file: "geometry.md",
    },
    {
      keywords: [
        "fade",
        "show creation",
        "showcreation",
        "transform",
        "grow",
        "indicate",
        "animate",
        "rotation",
        "scale",
        "morph",
      ],
      file: "animations.md",
    },
    {
      keywords: [
        "matrix",
        "number",
        "decimal",
        "integer",
        "value tracker",
        "probability",
        "bar chart",
      ],
      file: "math_and_display.md",
    },
    {
      keywords: [
        "scene",
        "camera",
        "frame",
        "render",
        "file",
        "window",
        "interactive",
      ],
      file: "scene.md",
    },
    {
      keywords: ["color", "rate function", "ease", "bezier", "space"],
      file: "utils.md",
    },
    {
      keywords: [
        "mobject",
        "group",
        "vgroup",
        "position",
        "anchor",
        "updater",
        "add_updater",
      ],
      file: "mobjects_core.md",
    },
  ];

  let bestFile: string | null = null;
  let bestScore = 0;

  for (const rule of rules) {
    const score = rule.keywords.filter((k) => lower.includes(k)).length;
    if (score > bestScore && docs[rule.file]) {
      bestScore = score;
      bestFile = rule.file;
    }
  }

  if (bestFile && bestScore > 0) {
    return `\n--- DETAILED DOCUMENTATION: ${bestFile} ---\n${docs[bestFile]}`;
  }
  return "";
}

/**
 * Builds the prompt for generating a new Manim animation from scratch.
 */
export function buildGeneratePrompt(
  prompt: string,
  docs: Record<string, string>,
): string {
  const relevantDoc = selectRelevantDoc(prompt, docs);

  return `You are a world-class Manim animation developer. Generate clean, syntactically correct Python code using 3b1b's ManimGL / manimlib library to satisfy the user's description.

${MANIMGL_CHEATSHEET}
${relevantDoc}

Rules:
1. Implement a single class inheriting from Scene.
2. All animation commands must be inside the construct(self) method.
3. ALWAYS start with: from manimlib import *
4. NEVER use: Create, MathTex, axes.plot, from manim import *
5. Use ShowCreation (not Create) to draw objects.
6. Use Tex or TexText for LaTeX; Text for plain text. NEVER MathTex.
7. Use axes.get_graph(func) to plot functions. NEVER axes.plot().
8. Keep the scene visually clean and aesthetically pleasing.
9. Return ONLY the executable python code block, enclosed in \`\`\`python ... \`\`\`.

User request:
"${prompt}"`;
}

/**
 * Builds the prompt for refining/editing an existing Manim script.
 */
export function buildRefinePrompt(
  currentCode: string,
  editInstruction: string,
  docs: Record<string, string>,
): string {
  const relevantDoc = selectRelevantDoc(editInstruction, docs);

  return `You are an expert Manim developer. Refine the existing Manim python code based on the user's request.

${MANIMGL_CHEATSHEET}
${relevantDoc}

Here is the current code:
\`\`\`python
${currentCode}
\`\`\`

User request for refinement:
"${editInstruction}"

Rules:
1. Modify the existing code to implement the user's edit.
2. Maintain all parts of the code that were not requested to change.
3. Rewrite and return the ENTIRE updated python script.
4. Follow all ManimGL rules: from manimlib import *, ShowCreation, Tex/TexText/Text, axes.get_graph, .animate.
5. Return ONLY the executable python code block, enclosed in \`\`\`python ... \`\`\`.`;
}

/**
 * Builds the prompt for the documentation helper agent.
 */
export function buildHelperPrompt(
  docs: Record<string, string>,
  chatHistory: { role: "user" | "assistant"; content: string }[],
  userMessage: string,
): string {
  // For the chat helper, inject the most relevant doc based on the user's question
  const relevantDoc = selectRelevantDoc(userMessage, docs);

  return `You are "Manim Helper", a specialized AI assistant designed to help developers write and debug mathematical animations using 3b1b's ManimGL / manimlib library.

${MANIMGL_CHEATSHEET}
${relevantDoc}

--- INTERACTION RULES ---
1. Use the cheat-sheet and documentation above to answer questions accurately.
2. Be helpful, clear, and direct.
3. When writing code snippets, always explain how they work.
4. Follow 3b1b's ManimGL / manimlib conventions (from manimlib import *, ShowCreation, Tex/TexText, axes.get_graph, .animate).
5. NEVER suggest Create, MathTex, or axes.plot – they do NOT exist in manimlib.
6. If the user asks about an error, analyze the trace and offer corrected code.

Here is the conversation history:
${chatHistory.map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`).join("\n")}

User: ${userMessage}
Assistant:`;
}

/**
 * Call the selected LLM provider.
 */
export async function callLLM(
  config: LLMConfig,
  systemPrompt: string,
  userMessage: string,
): Promise<string> {
  const { provider, apiKey, model } = config;

  if (!apiKey) {
    throw new Error(
      `API key is required. Please set your API key in settings.`,
    );
  }

  if (provider === "gemini") {
    // Standard Google Gemini API
    const targetModel = model || "gemini-2.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${apiKey}`;

    // Use proper system instruction + user message structure for Gemini
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: userMessage }],
          },
        ],
        generationConfig: {
          temperature: 0.1,
        },
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const errMsg = errData?.error?.message || response.statusText;
      throw new Error(`Gemini API Error: ${errMsg}`);
    }

    const data = await response.json();
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error(
        "No response content from Gemini. Check model settings or prompt size.",
      );
    }

    return data.candidates[0].content.parts[0].text;
  } else {
    // OpenAI API
    const targetModel = model || "gpt-4o-mini";
    const url = "https://api.openai.com/v1/chat/completions";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: targetModel,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const errMsg = errData?.error?.message || response.statusText;
      throw new Error(`OpenAI API Error: ${errMsg}`);
    }

    const data = await response.json();
    if (!data.choices?.[0]?.message?.content) {
      throw new Error(
        "No response content from OpenAI. Check your account settings or model API permissions.",
      );
    }

    return data.choices[0].message.content;
  }
}
