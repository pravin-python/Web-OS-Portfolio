import React, { useState, useMemo, useCallback } from "react";
import {
  ML_ALGORITHMS,
  ML_CATEGORIES,
  ML_INTRO,
  type MLAlgorithm,
  type CategoryKey,
} from "./ml.data";
import "./styles.css";

/* ═══════════════════════════════════════════════════
   ML Lab — Machine Learning Algorithms Explorer
   ═══════════════════════════════════════════════════ */
export const MLLab: React.FC = () => {
  const [category, setCategory] = useState<CategoryKey>("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<"concept" | "code" | "examples">(
    "concept",
  );

  /* ─── Filtered algorithms ─── */
  const filtered = useMemo(() => {
    let algos = ML_ALGORITHMS;
    if (category !== "all")
      algos = algos.filter((a) => a.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      algos = algos.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.subcategory.toLowerCase().includes(q) ||
          a.id.toLowerCase().includes(q) ||
          a.concept.toLowerCase().includes(q),
      );
    }
    return algos;
  }, [category, search]);

  /* ─── Grouped by subcategory ─── */
  const grouped = useMemo(() => {
    const map: Record<string, MLAlgorithm[]> = {};
    for (const a of filtered) {
      (map[a.subcategory] ??= []).push(a);
    }
    return map;
  }, [filtered]);

  const selected = selectedId
    ? (ML_ALGORITHMS.find((a) => a.id === selectedId) ?? null)
    : null;

  const selectAlgo = useCallback((id: string) => {
    setSelectedId(id);
    setCopied(false);
    setActiveTab("concept");
  }, []);

  const copyCode = useCallback(() => {
    if (!selected) return;
    navigator.clipboard.writeText(selected.pythonCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [selected]);

  return (
    <div className="ml-root">
      {/* ── Top Bar ── */}
      <div className="ml-topbar">
        <div className="ml-cats">
          {ML_CATEGORIES.map(({ key, label }) => (
            <button
              key={key}
              data-cat={key}
              className={`ml-cat-btn ${category === key ? "active" : ""}`}
              onClick={() => setCategory(key)}
            >
              {label}
            </button>
          ))}
        </div>
        <input
          className="ml-search"
          type="text"
          placeholder="🔍 Search algorithms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ── Body ── */}
      <div className="ml-body" style={{ position: "relative" }}>
        {/* Sidebar */}
        <div className={`ml-sidebar ${sidebarOpen ? "" : "collapsed"}`}>
          {Object.entries(grouped).map(([sub, algos]) => (
            <div key={sub}>
              <div className="ml-sub-header">{sub}</div>
              {algos.map((a) => (
                <button
                  key={a.id}
                  className={`ml-algo-btn ${selectedId === a.id ? "active" : ""}`}
                  onClick={() => selectAlgo(a.id)}
                >
                  {a.title}
                </button>
              ))}
            </div>
          ))}
          {Object.keys(grouped).length === 0 && (
            <div
              style={{ padding: 16, color: "var(--text-muted)", fontSize: 12 }}
            >
              No algorithms match your search.
            </div>
          )}
        </div>

        {/* Toggle button */}
        <button
          className="ml-sidebar-toggle"
          style={{ left: sidebarOpen ? 230 : 0 }}
          onClick={() => setSidebarOpen((v) => !v)}
        >
          {sidebarOpen ? "◀" : "▶"}
        </button>

        {/* Content */}
        <div className="ml-content">
          {!selected ? (
            <IntroPanel />
          ) : (
            <AlgorithmPanel
              algo={selected}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
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
  <div className="ml-intro ml-animate-in">
    <h1>🧠 ML Lab — Machine Learning Explorer</h1>

    <div className="ml-card">
      <h3>What is Machine Learning?</h3>
      <p>{ML_INTRO.whatIsML}</p>
    </div>

    <h2>Types of Machine Learning</h2>
    <div className="ml-card">
      <ul>
        {ML_INTRO.typesOfML.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>

    <h2>Real-World Applications</h2>
    <div className="ml-card ml-usecase">
      <ul>
        {ML_INTRO.useCases.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>

    <h2>How to Use This Lab</h2>
    <div className="ml-card">
      <p>
        Select a category from the top bar, browse algorithms in the sidebar,
        and click any algorithm to see its concept explanation, workflow, Python
        code, and real-world examples. Use the search bar to jump to any
        algorithm instantly.
      </p>
    </div>

    <div className="ml-badge-row">
      <span className="ml-badge supervised">Supervised</span>
      <span className="ml-badge unsupervised">Unsupervised</span>
      <span className="ml-badge semi">Semi-Supervised</span>
      <span className="ml-badge self">Self-Supervised</span>
      <span className="ml-badge rl">Reinforcement</span>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════
   Algorithm Panel
   ═══════════════════════════════════════════════════ */
interface AlgorithmPanelProps {
  algo: MLAlgorithm;
  activeTab: "concept" | "code" | "examples";
  setActiveTab: (t: "concept" | "code" | "examples") => void;
  copied: boolean;
  onCopy: () => void;
}

const categoryBadge = (cat: string) => {
  const map: Record<string, string> = {
    supervised: "supervised",
    unsupervised: "unsupervised",
    "semi-supervised": "semi",
    "self-supervised": "self",
    reinforcement: "rl",
  };
  return map[cat] || "supervised";
};

const AlgorithmPanel: React.FC<AlgorithmPanelProps> = ({
  algo,
  activeTab,
  setActiveTab,
  copied,
  onCopy,
}) => (
  <div className="ml-animate-in" key={algo.id}>
    {/* Header */}
    <div className="ml-algo-header">
      <h1>{algo.title}</h1>
      <span className={`ml-badge ${categoryBadge(algo.category)}`}>
        {algo.subcategory}
      </span>
    </div>

    {/* Section Tabs */}
    <div className="ml-section-tabs">
      {(
        [
          ["concept", "📖 Concept"],
          ["code", "💻 Python Code"],
          ["examples", "🧪 Examples"],
        ] as const
      ).map(([key, label]) => (
        <button
          key={key}
          className={`ml-section-tab ${activeTab === key ? "active" : ""}`}
          onClick={() => setActiveTab(key)}
        >
          {label}
        </button>
      ))}
    </div>

    {/* Concept Tab */}
    {activeTab === "concept" && (
      <div className="ml-animate-in">
        <div className="ml-card">
          <h3>📖 Concept</h3>
          <p>{algo.concept}</p>
        </div>

        <div className="ml-card ml-usecase">
          <h3>🎯 When To Use</h3>
          <p>{algo.whenToUse}</p>
        </div>

        <div className="ml-card">
          <h3>⚙️ How It Works</h3>
          <ol className="ml-steps">
            {algo.howItWorks.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>

        {/* Diagram */}
        <div className="ml-card">
          <h3>📊 Visual Diagram</h3>
          <div
            className="ml-diagram-box"
            dangerouslySetInnerHTML={{ __html: algo.diagram }}
          />
        </div>
      </div>
    )}

    {/* Code Tab */}
    {activeTab === "code" && (
      <div className="ml-animate-in">
        <div className="ml-code-section">
          <div className="ml-code-header">
            <div className="ml-code-lang">
              <img
                src={`${import.meta.env.BASE_URL}svg/language/python.svg`}
                alt="Python"
                style={{ width: 20, height: 20 }}
              />
              Python Implementation
            </div>
            <button
              className={`ml-copy-btn ${copied ? "copied" : ""}`}
              onClick={onCopy}
            >
              {copied ? "✓ Copied" : "📋 Copy"}
            </button>
          </div>
          <div className="ml-code-box">
            <pre>{algo.pythonCode}</pre>
          </div>
        </div>
      </div>
    )}

    {/* Examples Tab */}
    {activeTab === "examples" && (
      <div className="ml-animate-in">
        <div className="ml-card">
          <h3>🧪 Real-World Use Cases</h3>
          <div className="ml-example-grid">
            {algo.examples.map((ex, i) => (
              <div key={i} className="ml-example-item">
                <span className="ml-example-num">{i + 1}</span>
                <span>{ex}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="ml-card">
          <h3>📊 Algorithm Diagram</h3>
          <div
            className="ml-diagram-box"
            dangerouslySetInnerHTML={{ __html: algo.diagram }}
          />
        </div>

        <div className="ml-card ml-usecase">
          <h3>💡 Quick Tip</h3>
          <p>{algo.whenToUse}</p>
        </div>
      </div>
    )}
  </div>
);
