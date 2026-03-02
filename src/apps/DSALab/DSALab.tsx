import React, { useState, useMemo, useCallback } from "react";
import { DSA_TOPICS, DSA_INTRO, type DSATopic, type Level } from "./dsa.data";
import "./DSALab.css";

type CodeLang = "python" | "java";

export const DSALab: React.FC = () => {
  const [level, setLevel] = useState<Level | "all">("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [codeLang, setCodeLang] = useState<CodeLang>("python");
  const [copied, setCopied] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [recent, setRecent] = useState<string[]>([]);

  /* ─── Filtered topics ─── */
  const filtered = useMemo(() => {
    let topics = DSA_TOPICS;
    if (level !== "all") topics = topics.filter((t) => t.level === level);
    if (search.trim()) {
      const q = search.toLowerCase();
      topics = topics.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q),
      );
    }
    return topics;
  }, [level, search]);

  /* ─── Grouped by category ─── */
  const grouped = useMemo(() => {
    const map: Record<string, DSATopic[]> = {};
    for (const t of filtered) {
      (map[t.category] ??= []).push(t);
    }
    return map;
  }, [filtered]);

  const selected = selectedId
    ? (DSA_TOPICS.find((t) => t.id === selectedId) ?? null)
    : null;

  const selectTopic = useCallback((id: string) => {
    setSelectedId(id);
    setCopied(false);
    setRecent((prev) => {
      const next = [id, ...prev.filter((r) => r !== id)];
      return next.slice(0, 4);
    });
  }, []);

  const copyCode = useCallback(() => {
    if (!selected) return;
    const code =
      codeLang === "python" ? selected.pythonCode : selected.javaCode;
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [selected, codeLang]);

  const recentTopics = recent
    .map((id) => DSA_TOPICS.find((t) => t.id === id))
    .filter(Boolean) as DSATopic[];

  return (
    <div className="dsa-root">
      {/* ── Top Bar ── */}
      <div className="dsa-topbar">
        <div className="dsa-levels">
          {(
            [
              ["all", "All"],
              ["beginner", "Beginner"],
              ["intermediate", "Intermediate"],
              ["advanced", "Advanced"],
            ] as [Level | "all", string][]
          ).map(([key, label]) => (
            <button
              key={key}
              data-level={key}
              className={`dsa-level-btn ${level === key ? "active" : ""}`}
              onClick={() => setLevel(key)}
            >
              {label}
            </button>
          ))}
        </div>
        <input
          className="dsa-search"
          type="text"
          placeholder="🔍 Search topics..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {recentTopics.length > 0 && (
          <div className="dsa-recent">
            {recentTopics.map((t) => (
              <button
                key={t.id}
                className="dsa-recent-chip"
                onClick={() => selectTopic(t.id)}
              >
                {t.title}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className="dsa-body" style={{ position: "relative" }}>
        {/* Sidebar */}
        <div className={`dsa-sidebar ${sidebarOpen ? "" : "collapsed"}`}>
          {Object.entries(grouped).map(([cat, topics]) => (
            <div key={cat}>
              <div className="dsa-cat-header">{cat}</div>
              {topics.map((t) => (
                <button
                  key={t.id}
                  className={`dsa-topic-btn ${selectedId === t.id ? "active" : ""}`}
                  onClick={() => selectTopic(t.id)}
                >
                  {t.title}
                </button>
              ))}
            </div>
          ))}
          {Object.keys(grouped).length === 0 && (
            <div
              style={{ padding: 16, color: "var(--text-muted)", fontSize: 12 }}
            >
              No topics match your search.
            </div>
          )}
        </div>

        {/* Toggle button */}
        <button
          className="dsa-sidebar-toggle"
          style={{ left: sidebarOpen ? 220 : 0 }}
          onClick={() => setSidebarOpen((v) => !v)}
        >
          {sidebarOpen ? "◀" : "▶"}
        </button>

        {/* Content */}
        <div className="dsa-content">
          {!selected ? (
            <IntroPanel />
          ) : (
            <TopicPanel
              topic={selected}
              codeLang={codeLang}
              setCodeLang={setCodeLang}
              copied={copied}
              onCopy={copyCode}
            />
          )}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   Intro Panel
   ═══════════════════════════════════════════════════ */
const IntroPanel: React.FC = () => (
  <div className="dsa-intro dsa-animate-in">
    <h1>📘 DSA Lab — Data Structures & Algorithms</h1>
    <div className="dsa-card">
      <h3>What is DSA?</h3>
      <p>{DSA_INTRO.whatIsDSA.replace(/\*\*(.*?)\*\*/g, "$1")}</p>
    </div>
    <h2>Why Learn DSA?</h2>
    <div className="dsa-card">
      <ul>
        {DSA_INTRO.whyLearnDSA.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
    <h2>How to Use This Lab</h2>
    <div className="dsa-card">
      <p>
        Select a difficulty level from the top bar, browse topics in the
        sidebar, and click any topic to see its explanation, visual diagram,
        Python & Java code, and time/space complexity analysis. Use the search
        bar to jump to any topic instantly.
      </p>
    </div>
    <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
      <span className="dsa-level-badge beginner">Beginner</span>
      <span className="dsa-level-badge intermediate">Intermediate</span>
      <span className="dsa-level-badge advanced">Advanced</span>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════
   Topic Panel
   ═══════════════════════════════════════════════════ */
interface TopicPanelProps {
  topic: DSATopic;
  codeLang: CodeLang;
  setCodeLang: (l: CodeLang) => void;
  copied: boolean;
  onCopy: () => void;
}

const TopicPanel: React.FC<TopicPanelProps> = ({
  topic,
  codeLang,
  setCodeLang,
  copied,
  onCopy,
}) => (
  <div className="dsa-animate-in" key={topic.id}>
    {/* Header */}
    <div className="dsa-topic-header">
      <h1>{topic.title}</h1>
      <span className={`dsa-level-badge ${topic.level}`}>{topic.level}</span>
    </div>

    {/* Explanation */}
    <div className="dsa-card">
      <h3>📖 Explanation</h3>
      <p>{topic.explanation}</p>
    </div>

    {/* Real-life Example */}
    <div className="dsa-card dsa-example">
      <h3>💡 Real-Life Example</h3>
      <p>{topic.realLifeExample}</p>
    </div>

    {/* Operations */}
    <div className="dsa-card">
      <h3>⚙️ Key Operations</h3>
      <div className="dsa-ops">
        {topic.operations.map((op, i) => (
          <span key={i} className="dsa-op-tag">
            {op}
          </span>
        ))}
      </div>
    </div>

    {/* Diagram */}
    <div className="dsa-card">
      <h3>🌳 Visual Diagram</h3>
      <div
        className="dsa-diagram-box"
        dangerouslySetInnerHTML={{ __html: topic.diagram }}
      />
    </div>

    {/* Code Viewer */}
    <div className="dsa-code-section">
      <div className="dsa-code-tabs">
        <button
          className={`dsa-code-tab python ${codeLang === "python" ? "active" : ""}`}
          onClick={() => setCodeLang("python")}
        >
          <img
            src="/svg/language/python.svg"
            alt="Python"
            style={{ width: 25, height: 25 }}
          />{" "}
          Python
        </button>
        <button
          className={`dsa-code-tab java ${codeLang === "java" ? "active" : ""}`}
          onClick={() => setCodeLang("java")}
        >
          <img
            src="/svg/language/java.svg"
            alt="Java"
            style={{ width: 25, height: 25 }}
          />{" "}
          Java
        </button>
      </div>
      <div className="dsa-code-box">
        <button
          className={`dsa-copy-btn ${copied ? "copied" : ""}`}
          onClick={onCopy}
        >
          {copied ? "✓ Copied" : "📋 Copy"}
        </button>
        <pre>{codeLang === "python" ? topic.pythonCode : topic.javaCode}</pre>
      </div>
    </div>

    {/* Complexity */}
    <div className="dsa-card">
      <h3>📊 Complexity Analysis</h3>
      <div className="dsa-complexity-grid">
        <div className="dsa-cx-item">
          <div className="dsa-cx-label">Time Complexity</div>
          <div className="dsa-cx-value">{topic.complexity.time}</div>
        </div>
        <div className="dsa-cx-item">
          <div className="dsa-cx-label">Space Complexity</div>
          <div className="dsa-cx-value">{topic.complexity.space}</div>
        </div>
        <div className="dsa-cx-item">
          <div className="dsa-cx-label">Best Case</div>
          <div className="dsa-cx-value" style={{ color: "#30d158" }}>
            {topic.complexity.bestCase}
          </div>
        </div>
        <div className="dsa-cx-item">
          <div className="dsa-cx-label">Worst Case</div>
          <div className="dsa-cx-value" style={{ color: "#ff453a" }}>
            {topic.complexity.worstCase}
          </div>
        </div>
      </div>
    </div>
  </div>
);
