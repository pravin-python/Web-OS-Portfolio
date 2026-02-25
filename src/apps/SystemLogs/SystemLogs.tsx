import React, { useState, useEffect, useRef, useCallback } from "react";
import { generateLogEntry } from "../../services/dataService";
import "./SystemLogs.css";

interface LogEntry {
  id: number;
  timestamp: string;
  level: string;
  message: string;
}

let logId = 1;

const LEVEL_FILTER_OPTIONS = ["ALL", "INFO", "SUCCESS", "WARN", "ERROR"];

export const SystemLogs: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [paused, setPaused] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate initial logs
  useEffect(() => {
    const initial: LogEntry[] = [];
    for (let i = 0; i < 12; i++) {
      const entry = generateLogEntry();
      initial.push({ ...entry, id: logId++ });
    }
    setLogs(initial);
  }, []);

  // Auto-append logs
  useEffect(() => {
    if (paused) return;
    const interval = setInterval(
      () => {
        const entry = generateLogEntry();
        setLogs((prev) => {
          const next = [...prev, { ...entry, id: logId++ }];
          return next.length > 200 ? next.slice(-200) : next;
        });
      },
      2000 + Math.random() * 2000,
    );
    return () => clearInterval(interval);
  }, [paused]);

  // Auto-scroll
  useEffect(() => {
    if (!paused) {
      logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, paused]);

  const handleHover = useCallback((enter: boolean) => setPaused(enter), []);

  const filtered =
    filter === "ALL" ? logs : logs.filter((l) => l.level === filter);

  return (
    <div className="slog-root">
      <div className="slog-header">
        <span style={{ fontSize: 18 }}>📊</span>
        <h2>System Logs</h2>
        <span className={`slog-status ${paused ? "paused" : "live"}`}>
          {paused ? "⏸ Paused" : "● Live"}
        </span>
      </div>

      <div className="slog-toolbar">
        {LEVEL_FILTER_OPTIONS.map((opt) => (
          <button
            key={opt}
            className={`slog-filter ${filter === opt ? "active" : ""} ${opt.toLowerCase()}`}
            onClick={() => setFilter(opt)}
          >
            {opt}
          </button>
        ))}
        <span className="slog-count">{filtered.length} entries</span>
      </div>

      <div
        className="slog-list"
        ref={containerRef}
        onMouseEnter={() => handleHover(true)}
        onMouseLeave={() => handleHover(false)}
      >
        {filtered.map((log) => (
          <div
            key={log.id}
            className={`slog-entry level-${log.level.toLowerCase()}`}
          >
            <span className="slog-time">[{log.timestamp}]</span>
            <span className={`slog-level`}>{log.level.padEnd(7)}</span>
            <span className="slog-msg">{log.message}</span>
          </div>
        ))}
        <div ref={logEndRef} />
      </div>
    </div>
  );
};
