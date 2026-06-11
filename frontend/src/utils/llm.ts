export type Provider = 'gemini' | 'openai';

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
 * Builds the prompt for generating a new Manim animation from scratch.
 */
export function buildGeneratePrompt(prompt: string): string {
  return `You are a world-class Manim animation developer. Generate clean, syntactically correct Python code using 3b1b's ManimGL / manimlib library to satisfy the user's description.

Rules:
1. Implement a single class inheriting from Scene (e.g. class MyScene(Scene): or similar).
2. All animation commands must be inside the construct(self) method.
3. Use 3b1b's ManimGL / manimlib syntax:
   - Import like this: from manimlib import * (Do NOT use from manim import *)
   - Use ShowCreation to draw/create objects (e.g. self.play(ShowCreation(circle))). Do NOT use Create (it is not supported).
   - Use the .animate syntax for shifts, scales, color changes: e.g. self.play(square.animate.shift(UP * 2)) or self.play(circle.animate.set_color(RED))
   - Use Tex for mathematical formulas (e.g. Tex(r"e^{i\\pi} + 1 = 0")). Use TexText for text in LaTeX (e.g. TexText(r"Hello \textbf{world}")). Do NOT use MathTex (it is not supported).
   - Use axes.get_graph(func) to plot functions on a coordinate system. Do NOT use axes.plot (it is not supported).
4. Keep the scene visually clean and aesthetically pleasing. Use nice colors like TEAL, ORANGE, PURPLE, BLUE, GOLD, and set fill opacities where appropriate.
5. Make sure the animation is centered, and positions are relative (e.g. next_to, shift) rather than hardcoded coordinates unless necessary.
6. Return ONLY the executable python code block, enclosed in \`\`\`python ... \`\`\`. Do not write conversational explanations before or after the code block.

User request:
"${prompt}"`;
}

/**
 * Builds the prompt for refining/editing an existing Manim script.
 */
export function buildRefinePrompt(currentCode: string, editInstruction: string): string {
  return `You are an expert Manim developer. Refine the existing Manim python code based on the user's request. 

Here is the current code:
\`\`\`python
${currentCode}
\`\`\`

User request for refinement:
"${editInstruction}"

Rules:
1. Modify the existing code to implement the user's edit.
2. Maintain all parts of the code that were not requested to change.
3. You must rewrite and return the ENTIRE updated python script, not just the modified parts.
4. Ensure all syntax rules from 3b1b's ManimGL / manimlib library are followed (use from manimlib import *, use ShowCreation instead of Create, use Tex/TexText instead of MathTex, use axes.get_graph, use .animate, etc.).
5. Make sure the code is syntactically valid python.
6. Return ONLY the executable python code block, enclosed in \`\`\`python ... \`\`\`. Do not write conversational explanations before or after the code block.`;
}

/**
 * Builds the prompt for the documentation helper agent.
 */
export function buildHelperPrompt(
  docs: Record<string, string>,
  chatHistory: { role: 'user' | 'assistant'; content: string }[],
  userMessage: string
): string {
  // Combine all docs files as context
  const docsContext = Object.entries(docs)
    .map(([filename, content]) => `--- DOCUMENTATION FILE: ${filename} ---\n${content}`)
    .join('\n\n');

  return `You are "Manim Helper", a specialized AI assistant designed to help developers write and debug mathematical animations using 3b1b's ManimGL / manimlib library.

Below is the official documentation for Manim concepts (Basics, Shapes, Positioning, Animations, Graphs, Updaters):

${docsContext}

--- USER INTERACTION RULES ---
1. Use the provided documentation to answer questions.
2. Be helpful, clear, and direct.
3. When writing code snippets, always explain how they work.
4. Follow 3b1b's ManimGL / manimlib conventions (e.g., from manimlib import *, use ShowCreation, use Tex/TexText, use .animate).
5. If the user asks you to explain an error, analyze the error trace and pinpoint the line or function that failed, then offer the corrected code.

Here is the conversation history:
${chatHistory.map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`).join('\n')}

User: ${userMessage}
Assistant:`;
}

/**
 * Call the selected LLM provider.
 */
export async function callLLM(config: LLMConfig, systemPrompt: string, userMessage: string): Promise<string> {
  const { provider, apiKey, model } = config;

  if (!apiKey) {
    throw new Error(`API key is required. Please set your API key in settings.`);
  }

  if (provider === 'gemini') {
    // Standard Google Gemini API
    const targetModel = model || 'gemini-2.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${apiKey}`;
    
    // Combine system instructions and user message
    const prompt = `${systemPrompt}\n\nUser Prompt:\n${userMessage}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1,
        }
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const errMsg = errData?.error?.message || response.statusText;
      throw new Error(`Gemini API Error: ${errMsg}`);
    }

    const data = await response.json();
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error("No response content from Gemini. Check model settings or prompt size.");
    }

    return data.candidates[0].content.parts[0].text;
  } else {
    // OpenAI API
    const targetModel = model || 'gpt-4o-mini';
    const url = 'https://api.openai.com/v1/chat/completions';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: targetModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.1
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const errMsg = errData?.error?.message || response.statusText;
      throw new Error(`OpenAI API Error: ${errMsg}`);
    }

    const data = await response.json();
    if (!data.choices?.[0]?.message?.content) {
      throw new Error("No response content from OpenAI. Check your account settings or model API permissions.");
    }

    return data.choices[0].message.content;
  }
}
