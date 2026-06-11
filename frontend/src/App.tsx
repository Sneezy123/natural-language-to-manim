import { useState, useEffect, useRef } from "react";
import {
  Play,
  Sparkles,
  Settings,
  HelpCircle,
  BookOpen,
  Terminal,
  AlertCircle,
  ChevronRight,
  X,
  Send,
  Copy,
  FileText,
  RefreshCw,
  Search,
  ChevronLeft,
} from "lucide-react";
import {
  callLLM,
  extractCode,
  buildGeneratePrompt,
  buildRefinePrompt,
  buildHelperPrompt,
} from "./utils/llm";
import type { Provider, LLMConfig } from "./utils/llm";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface CompileResult {
  success: boolean;
  video_url?: string;
  image_url?: string;
  scene_class?: string;
  stdout: string;
  stderr: string;
  compile_time: number;
}

const DEFAULT_CODE = `from manimlib import *

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
`;

export default function App() {
  // Config & Settings
  const [provider, setProvider] = useState<Provider>(() => {
    return (localStorage.getItem("manim_llm_provider") as Provider) || "gemini";
  });
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem("manim_llm_api_key") || "";
  });
  const [model, setModel] = useState<string>(() => {
    const saved = localStorage.getItem("manim_llm_model");
    if (saved) return saved;
    return provider === "gemini" ? "gemini-2.5-flash" : "gpt-4o-mini";
  });
  const [quality, setQuality] = useState<string>("low"); // low, medium, high
  const [skipAnimations, setSkipAnimations] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Editor and Input
  const [code, setCode] = useState<string>(DEFAULT_CODE);
  const [nlPrompt, setNlPrompt] = useState<string>("");

  // Compilation & Running
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [compileResult, setCompileResult] = useState<CompileResult | null>(
    null,
  );
  const [compileError, setCompileError] = useState<string | null>(null);
  const [activeConsoleTab, setActiveConsoleTab] = useState<"output" | "errors">(
    "output",
  );

  // Sidebar (Docs / Chat)
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [sidebarTab, setSidebarTab] = useState<"chat" | "docs">("chat");
  const [docs, setDocs] = useState<Record<string, string>>({});
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [docsSearch, setDocsSearch] = useState<string>("");

  // Chat Assistant
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState<string>("");
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Load documentation on mount
  useEffect(() => {
    fetch("/api/docs")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load documentation files.");
        return res.json();
      })
      .then((data) => {
        setDocs(data);
      })
      .catch((err) => {
        console.error("Documentation load error:", err);
      });
  }, []);

  // Sync model defaults when provider changes
  const handleProviderChange = (newProvider: Provider) => {
    setProvider(newProvider);
    localStorage.setItem("manim_llm_provider", newProvider);
    const defaultModel =
      newProvider === "gemini" ? "gemini-2.5-flash" : "gpt-4o-mini";
    setModel(defaultModel);
    localStorage.setItem("manim_llm_model", defaultModel);
  };

  const handleSaveSettings = () => {
    localStorage.setItem("manim_llm_api_key", apiKey);
    localStorage.setItem("manim_llm_model", model);
    setIsSettingsOpen(false);
  };

  // Compile Code Endpoint Call
  const handleRender = async (customCode?: string) => {
    const codeToRender = customCode || code;
    setIsCompiling(true);
    setCompileResult(null);
    setCompileError(null);
    setActiveConsoleTab("output");

    try {
      const response = await fetch("/api/render", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: codeToRender,
          quality: quality,
          skip_animations: skipAnimations,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Server compilation error.");
      }

      const data = await response.json();
      setCompileResult(data);
      if (!data.success) {
        setActiveConsoleTab("errors");
        setCompileError(data.stderr || "Manim execution failed.");
      } else {
        // Force reload video element
        if (videoRef.current) {
          videoRef.current.load();
        }
      }
    } catch (err: any) {
      setCompileError(err.message || "Failed to contact compilation server.");
      setActiveConsoleTab("errors");
    } finally {
      setIsCompiling(false);
    }
  };

  // LLM: Generate Code from Scratch
  const handleGenerateCode = async () => {
    if (!apiKey) {
      setIsSettingsOpen(true);
      return;
    }
    if (!nlPrompt.trim()) return;

    setIsCompiling(true);
    setCompileError(null);
    setCompileResult(null);

    const systemPrompt = buildGeneratePrompt(nlPrompt);
    const llmConfig: LLMConfig = { provider, apiKey, model };

    try {
      const resultText = await callLLM(llmConfig, systemPrompt, nlPrompt);
      const extractedCode = extractCode(resultText);
      setCode(extractedCode);
      // Run compiler automatically
      await handleRender(extractedCode);
    } catch (err: any) {
      setCompileError(`Generation Error: ${err.message}`);
      setActiveConsoleTab("errors");
      setIsCompiling(false);
    }
  };

  // LLM: Refine Existing Code
  const handleRefineCode = async () => {
    if (!apiKey) {
      setIsSettingsOpen(true);
      return;
    }
    if (!nlPrompt.trim()) return;

    setIsCompiling(true);
    setCompileError(null);
    setCompileResult(null);

    const systemPrompt = buildRefinePrompt(code, nlPrompt);
    const llmConfig: LLMConfig = { provider, apiKey, model };

    try {
      const resultText = await callLLM(llmConfig, systemPrompt, nlPrompt);
      const extractedCode = extractCode(resultText);
      setCode(extractedCode);
      // Run compiler automatically
      await handleRender(extractedCode);
    } catch (err: any) {
      setCompileError(`Refinement Error: ${err.message}`);
      setActiveConsoleTab("errors");
      setIsCompiling(false);
    }
  };

  // Helper Agent Chat Message Send
  const handleSendChatMessage = async () => {
    if (!chatInput.trim()) return;
    if (!apiKey) {
      setIsSettingsOpen(true);
      return;
    }

    const userMsg = chatInput;
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsChatLoading(true);

    const apiHistory = chatMessages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    const systemPrompt = buildHelperPrompt(docs, apiHistory, userMsg);
    const llmConfig: LLMConfig = { provider, apiKey, model };

    try {
      const response = await callLLM(llmConfig, systemPrompt, userMsg);
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: response },
      ]);
    } catch (err: any) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Sorry, I encountered an error while contacting the model:\n\n\`\`\`\n${err.message}\n\`\`\``,
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Quick action: insert snippet from chat/docs
  const handleInsertCode = (snippet: string) => {
    setCode(snippet);
  };

  // Render markdown text in chat
  const renderFormattedText = (text: string) => {
    const parts = text.split(/(```[\s\S]*?```)/g);
    return parts.map((part, index) => {
      if (part.startsWith("```")) {
        const match = part.match(/```(\w*)\n([\s\S]*?)```/);
        const codeText = match ? match[2] : part.slice(3, -3);
        return (
          <div key={index} style={{ position: "relative", margin: "12px 0" }}>
            <pre
              style={{
                backgroundColor: "#0b0c10",
                padding: "12px",
                borderRadius: "8px",
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                overflowX: "auto",
                border: "1px solid var(--border-color)",
                color: "#f8fafc",
              }}
            >
              <code>{codeText.trim()}</code>
            </pre>
            <div
              style={{
                display: "flex",
                gap: "8px",
                position: "absolute",
                right: "8px",
                top: "8px",
              }}
            >
              <button
                title="Copy to clipboard"
                onClick={() => navigator.clipboard.writeText(codeText.trim())}
                style={{
                  padding: "4px",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "4px",
                  cursor: "pointer",
                  color: "var(--text-secondary)",
                }}
              >
                <Copy size={14} />
              </button>
              <button
                title="Load into Editor"
                onClick={() => handleInsertCode(codeText.trim())}
                style={{
                  padding: "4px 8px",
                  backgroundColor: "var(--primary-glow)",
                  border: "1px solid var(--border-focus)",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "10px",
                  fontWeight: "600",
                  color: "white",
                }}
              >
                Use Code
              </button>
            </div>
          </div>
        );
      } else {
        const inlineParts = part.split(/(`[^`\n]+`)/g);
        return (
          <p key={index} style={{ margin: "8px 0", whiteSpace: "pre-wrap" }}>
            {inlineParts.map((subPart, subIndex) => {
              if (subPart.startsWith("`") && subPart.endsWith("`")) {
                return (
                  <code
                    key={subIndex}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "12px",
                      backgroundColor: "rgba(255,255,255,0.08)",
                      padding: "2px 4px",
                      borderRadius: "4px",
                      color: "#c084fc",
                    }}
                  >
                    {subPart.slice(1, -1)}
                  </code>
                );
              }
              return subPart;
            })}
          </p>
        );
      }
    });
  };

  // Filter docs
  const filteredDocs = Object.keys(docs).filter((filename) => {
    const title = filename.replace(".md", "").replace("_", " ");
    return title.toLowerCase().includes(docsSearch.toLowerCase());
  });

  return (
    <div className="app-container">
      {/* HEADER */}
      <header className="app-header">
        <div className="brand">
          <div className="logo-icon">M</div>
          <span className="brand-name">NL-to-Manim Studio</span>
        </div>

        <div className="header-actions">
          <div className="flex-row align-center gap-12">
            <span className="text-xs text-secondary">Quality:</span>
            <select
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              className="form-select"
              style={{ padding: "6px 10px", fontSize: "12px", width: "auto" }}
            >
              <option value="low">Low (480p)</option>
              <option value="medium">Medium (720p)</option>
              <option value="high">High (1080p)</option>
              <option value="ultra">Ultra (1440p)</option>
            </select>
          </div>

          <div
            className="flex-row align-center gap-12"
            style={{ marginLeft: "8px" }}
          >
            <label
              className="flex-row align-center gap-8 text-xs text-secondary cursor-pointer"
              style={{ userSelect: "none" }}
            >
              <input
                type="checkbox"
                checked={skipAnimations}
                onChange={(e) => setSkipAnimations(e.target.checked)}
                style={{ cursor: "pointer" }}
              />
              <span>Skip Animations (-s)</span>
            </label>
          </div>

          <button
            className="btn btn-secondary"
            onClick={() => setIsSettingsOpen(true)}
            title="Settings"
          >
            <Settings size={16} />
            <span>Settings</span>
          </button>

          <button
            className="btn btn-ghost"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            title={isSidebarOpen ? "Close Sidebar" : "Open Help & Docs"}
          >
            {isSidebarOpen ? (
              <ChevronRight size={20} />
            ) : (
              <BookOpen size={20} />
            )}
          </button>
        </div>
      </header>

      {/* MAIN WORKSPACE */}
      <main className="workspace">
        {/* LEFT PANEL: Editor & Prompting */}
        <section className="editor-pane">
          <div className="pane-header">
            <div className="pane-title">
              <FileText size={16} className="text-muted" />
              <span>Python Editor</span>
            </div>
            <button
              className="btn btn-ghost"
              onClick={() => setCode(DEFAULT_CODE)}
              title="Reset to Template"
            >
              <RefreshCw size={14} />
            </button>
          </div>

          <div className="editor-container">
            <div className="code-editor-wrapper">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="code-textarea"
                placeholder="Write your Manim Python code here..."
                spellCheck="false"
              />
            </div>

            <div className="prompt-bar">
              <div className="flex-row justify-between align-center">
                <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
                  AI Assistant Director
                </span>
                {!apiKey && (
                  <span className="text-xs text-error flex-row align-center gap-8">
                    <AlertCircle size={12} /> API Key required for AI
                    generation.
                  </span>
                )}
              </div>
              <div className="prompt-input-wrapper">
                <input
                  type="text"
                  value={nlPrompt}
                  onChange={(e) => setNlPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleGenerateCode();
                  }}
                  className="prompt-input"
                  placeholder="e.g. Draw a blue circle, morph it into a yellow square, and write 'Transform'..."
                />
              </div>

              <div className="flex-row gap-8">
                <button
                  onClick={handleGenerateCode}
                  disabled={isCompiling || !nlPrompt.trim()}
                  className="btn btn-primary flex-1"
                >
                  <Sparkles size={16} />
                  <span>Generate Code</span>
                </button>
                <button
                  onClick={handleRefineCode}
                  disabled={isCompiling || !nlPrompt.trim()}
                  className="btn btn-secondary flex-1"
                >
                  <RefreshCw size={16} />
                  <span>Refine Existing Code</span>
                </button>
                <button
                  onClick={() => handleRender()}
                  disabled={isCompiling}
                  className="btn btn-secondary"
                  style={{
                    minWidth: "120px",
                    border: "1px solid var(--border-focus)",
                    color: "#a78bfa",
                  }}
                >
                  <Play size={16} fill="currentColor" />
                  <span>Render Code</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* MIDDLE PANEL: Live Preview & Compilation Logs */}
        <section className="preview-pane">
          <div className="pane-header">
            <div className="pane-title">
              <Play size={16} className="text-muted" />
              <span>Live Video Preview</span>
            </div>
            {compileResult?.compile_time && (
              <span className="text-xs text-muted">
                Compiled in {compileResult.compile_time.toFixed(2)}s
              </span>
            )}
          </div>

          <div className="preview-container">
            {isCompiling ? (
              <div className="loader-container">
                <div className="spinner"></div>
                <div className="loader-text">Compiling Animation...</div>
                <div className="loader-subtext">
                  Executing 3b1b's ManimGL script in background. This might take
                  5-15 seconds.
                </div>
              </div>
            ) : compileResult?.success && compileResult.video_url ? (
              <div className="video-wrapper">
                <video
                  ref={videoRef}
                  controls
                  autoPlay
                  loop
                  className="video-element"
                  src={compileResult.video_url}
                >
                  Your browser does not support HTML5 video.
                </video>
              </div>
            ) : compileResult?.success && compileResult.image_url ? (
              <div className="video-wrapper">
                <img
                  src={compileResult.image_url}
                  className="video-element"
                  alt="Static Render"
                />
              </div>
            ) : (
              <div className="placeholder-preview">
                <HelpCircle className="placeholder-icon" />
                <div>
                  <p className="text-sm font-semibold">
                    No animation rendered yet
                  </p>
                  <p
                    className="text-xs text-muted"
                    style={{ marginTop: "4px" }}
                  >
                    Type an AI description and click 'Generate', or write your
                    own code and click 'Render'.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Console / Terminal Panel */}
          <div className="console-panel">
            <div className="console-tabs">
              <div
                className={`console-tab ${activeConsoleTab === "output" ? "active" : ""}`}
                onClick={() => setActiveConsoleTab("output")}
              >
                <Terminal size={14} />
                <span>Compiler Stdout</span>
              </div>
              <div
                className={`console-tab ${activeConsoleTab === "errors" ? "active" : ""}`}
                onClick={() => setActiveConsoleTab("errors")}
              >
                <AlertCircle
                  size={14}
                  className={compileError ? "text-error" : ""}
                />
                <span>Errors {compileError ? "(!)" : ""}</span>
              </div>
            </div>

            {activeConsoleTab === "output" ? (
              <div className="console-output">
                {compileResult
                  ? compileResult.stdout ||
                    "Execution finished with no stdout output."
                  : "Terminal logs will display here during compile execution..."}
              </div>
            ) : (
              <div className="console-output error-style">
                {compileError ||
                  compileResult?.stderr ||
                  "No compilation errors detected."}
              </div>
            )}
          </div>
        </section>

        {/* RIGHT PANEL: Docs Sidebar & Chat Assistant */}
        <section className={`sidebar-pane ${isSidebarOpen ? "" : "collapsed"}`}>
          <div className="pane-header" style={{ padding: "0 8px" }}>
            <div style={{ display: "flex", width: "100%" }}>
              <button
                className={`btn btn-ghost flex-1 ${sidebarTab === "chat" ? "active" : ""}`}
                onClick={() => {
                  setSidebarTab("chat");
                  setSelectedDoc(null);
                }}
                style={{ borderRadius: "6px 0 0 6px", fontSize: "12px" }}
              >
                <HelpCircle size={14} />
                <span>Chat Helper</span>
              </button>
              <button
                className={`btn btn-ghost flex-1 ${sidebarTab === "docs" ? "active" : ""}`}
                onClick={() => setSidebarTab("docs")}
                style={{ borderRadius: "0 6px 6px 0", fontSize: "12px" }}
              >
                <BookOpen size={14} />
                <span>Docs</span>
              </button>
            </div>
          </div>

          {/* TAB 1: Chat Helper Agent */}
          {sidebarTab === "chat" && (
            <div className="chat-container">
              <div className="chat-history">
                {chatMessages.length === 0 ? (
                  <div
                    className="text-center text-muted"
                    style={{ padding: "40px 16px", fontSize: "13px" }}
                  >
                    <HelpCircle
                      size={32}
                      style={{ margin: "0 auto 12px", opacity: 0.3 }}
                    />
                    <p className="font-semibold">Manim Agent Assistant</p>
                    <p style={{ marginTop: "4px" }}>
                      I am loaded with the latest Manim documentation. Ask me
                      about syntax, positioning, updaters, or copy over code
                      snippets!
                    </p>
                  </div>
                ) : (
                  chatMessages.map((msg, i) => (
                    <div key={i} className={`chat-message ${msg.role}`}>
                      <span className="chat-message-meta">
                        {msg.role === "user" ? "You" : "Helper Agent"}
                      </span>
                      <div className="chat-message-body">
                        {renderFormattedText(msg.content)}
                      </div>
                    </div>
                  ))
                )}
                {isChatLoading && (
                  <div className="chat-message assistant">
                    <span className="chat-message-meta">Helper Agent</span>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "4px 0",
                      }}
                    >
                      <div
                        className="spinner"
                        style={{
                          width: "16px",
                          height: "16px",
                          borderWidth: "2px",
                        }}
                      ></div>
                      <span className="text-xs text-secondary">
                        Consulting documentation...
                      </span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="chat-input-bar">
                <div className="chat-input-wrapper">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSendChatMessage();
                    }}
                    className="chat-input"
                    placeholder="Ask about Mobjects, Position, Animate..."
                  />
                </div>
                <button
                  onClick={handleSendChatMessage}
                  disabled={isChatLoading || !chatInput.trim()}
                  className="btn btn-primary"
                  style={{ padding: "8px" }}
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Documentation Library */}
          {sidebarTab === "docs" && (
            <div className="docs-container">
              {selectedDoc ? (
                // Single Doc Reader
                <div className="doc-viewer">
                  <div className="doc-viewer-header">
                    <button
                      onClick={() => setSelectedDoc(null)}
                      className="btn btn-ghost"
                      style={{
                        padding: "4px 8px",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        fontSize: "12px",
                      }}
                    >
                      <ChevronLeft size={16} />
                      Back to Docs
                    </button>
                  </div>
                  <div className="doc-viewer-content">
                    {renderFormattedText(docs[selectedDoc])}
                  </div>
                </div>
              ) : (
                // Docs Directory
                <>
                  <div className="docs-search-wrapper">
                    <div
                      className="prompt-input-wrapper"
                      style={{ padding: "6px 10px", borderRadius: "6px" }}
                    >
                      <Search size={14} className="text-muted" />
                      <input
                        type="text"
                        value={docsSearch}
                        onChange={(e) => setDocsSearch(e.target.value)}
                        className="chat-input"
                        placeholder="Search documentation topics..."
                        style={{ fontSize: "12px" }}
                      />
                    </div>
                  </div>

                  <div className="docs-list">
                    {filteredDocs.length === 0 ? (
                      <div
                        className="text-center text-muted"
                        style={{ padding: "24px" }}
                      >
                        No topics match search filter.
                      </div>
                    ) : (
                      filteredDocs.map((filename) => {
                        const title = filename
                          .replace(".md", "")
                          .replace("_", " ");
                        return (
                          <div
                            key={filename}
                            onClick={() => setSelectedDoc(filename)}
                            className="doc-item"
                          >
                            <div
                              className="doc-item-title"
                              style={{ textTransform: "capitalize" }}
                            >
                              {title}
                            </div>
                            <div className="doc-item-preview">
                              {docs[filename]?.slice(0, 100).trim()}...
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </section>
      </main>

      {/* OVERLAY MODAL: Settings panel */}
      {isSettingsOpen && (
        <div className="overlay-modal">
          <div className="settings-card">
            <div className="settings-header">
              <span className="settings-title">AI Engine Settings</span>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="btn btn-ghost"
              >
                <X size={18} />
              </button>
            </div>

            <div className="settings-body">
              <div className="form-group">
                <label className="form-label">API Provider</label>
                <select
                  value={provider}
                  onChange={(e) =>
                    handleProviderChange(e.target.value as Provider)
                  }
                  className="form-select"
                >
                  <option value="gemini">Google Gemini (Recommended)</option>
                  <option value="openai">OpenAI API</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">API Key</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="form-input"
                  placeholder={
                    provider === "gemini" ? "AIzaSy..." : "sk-proj-..."
                  }
                />
                <span className="text-xs text-muted">
                  Your API Key is saved locally in your browser cache and is
                  never sent to any backend except the provider directly.
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Model Name</label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="form-input"
                  placeholder={
                    provider === "gemini" ? "gemini-2.5-flash" : "gpt-4o-mini"
                  }
                />
              </div>
            </div>

            <div className="settings-footer">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button onClick={handleSaveSettings} className="btn btn-primary">
                Save Settings
              </button>
            </div>
            <div
              className=""
              style={{
                padding: "20px",
                paddingBottom: "12px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "20px",
              }}
            >
              <span className="form-label">
                Made using Google Antigravity <br /> MIT License{" "}
                {new Date().getFullYear()}{" "}
                <a href="https://github.com/Sneezy123/natural-language-to-manim">
                  (See on GitHub)
                </a>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
