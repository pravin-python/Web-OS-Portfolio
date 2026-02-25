import React, { useState, useMemo, useEffect } from "react";
import {
  parseCSV,
  searchData,
  paginateData,
  type CSVData,
} from "../../services/dataService";
import { readByPath } from "../../services/filesystem";
import "./DatasetViewer.css";

const LOCAL_DATASETS = [
  {
    type: "local",
    name: "Invoices",
    path: "/home/researcher/datasets/invoices_dataset.csv",
  },
  {
    type: "local",
    name: "Phishing URLs",
    path: "/home/researcher/datasets/phishing_urls.csv",
  },
];

const API_DATASETS = [
  {
    type: "api",
    name: "Posts",
    url: "https://jsonplaceholder.typicode.com/posts",
    key: "api_posts",
  },
  {
    type: "api",
    name: "Comments",
    url: "https://jsonplaceholder.typicode.com/comments",
    key: "api_comments",
  },
  {
    type: "api",
    name: "Albums",
    url: "https://jsonplaceholder.typicode.com/albums",
    key: "api_albums",
  },
  {
    type: "api",
    name: "Photos",
    url: "https://jsonplaceholder.typicode.com/photos",
    key: "api_photos",
  },
  {
    type: "api",
    name: "Users",
    url: "https://jsonplaceholder.typicode.com/users",
    key: "api_users",
  },
  {
    type: "api",
    name: "Todos",
    url: "https://jsonplaceholder.typicode.com/todos",
    key: "api_todos",
  },
];

const DATASETS = [...LOCAL_DATASETS, ...API_DATASETS];

const PER_PAGE = 8;

function parseJSONToCSVData(data: any[]): CSVData {
  if (!data || data.length === 0)
    return { headers: [], rows: [], totalRows: 0 };
  const headers = Object.keys(data[0]);
  const rows = data.map((item) =>
    headers.map((h) => {
      const val = item[h];
      if (val === null || val === undefined) return "";
      if (typeof val === "object") return JSON.stringify(val);
      return String(val);
    }),
  );
  return { headers, rows, totalRows: rows.length };
}

export const DatasetViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiDataMap, setApiDataMap] = useState<Record<string, CSVData>>({});

  useEffect(() => {
    let isMounted = true;

    const fetchAll = async () => {
      setApiLoading(true);
      try {
        const results: Record<string, CSVData> = {};
        await Promise.all(
          API_DATASETS.map(async (ds) => {
            const res = await fetch(ds.url);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const json = await res.json();
            const csvData = parseJSONToCSVData(json);
            localStorage.setItem(ds.key, JSON.stringify(csvData));
            results[ds.key] = csvData;
          }),
        );
        if (isMounted) {
          setApiDataMap(results);
        }
      } catch (err) {
        console.error(
          "Failed to load generic datasets from JSONPlaceholder",
          err,
        );
      } finally {
        if (isMounted) setApiLoading(false);
      }
    };

    fetchAll();

    return () => {
      isMounted = false;
      // Clear API data from localStorage on close
      API_DATASETS.forEach((ds) => localStorage.removeItem(ds.key));
    };
  }, []);

  const activeDataset = DATASETS[activeTab];

  const raw = useMemo(() => {
    if (activeDataset.type === "local") {
      const content = readByPath((activeDataset as any).path);
      return content ? parseCSV(content) : null;
    } else {
      const key = (activeDataset as any).key;
      if (apiDataMap[key]) return apiDataMap[key];
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          return JSON.parse(stored) as CSVData;
        } catch {
          return null;
        }
      }
      return null;
    }
  }, [activeTab, activeDataset, apiDataMap]);

  const filtered = useMemo(() => {
    if (!raw) return null;
    return searchData(raw, search);
  }, [raw, search]);

  const paginated = useMemo(() => {
    if (!filtered) return null;
    return paginateData(filtered, page, PER_PAGE);
  }, [filtered, page]);

  const handleTabChange = (i: number) => {
    setActiveTab(i);
    setSearch("");
    setPage(1);
  };

  const exportCSV = () => {
    if (!filtered || filtered.rows.length === 0) return;

    // Escape CSV values
    const escapeCSV = (val: string) => `"${val.replace(/"/g, '""')}"`;

    // Build CSV string
    const headers = filtered.headers.map(escapeCSV).join(",");
    const rows = filtered.rows
      .map((row) => row.map(escapeCSV).join(","))
      .join("\n");
    const csvContent = `${headers}\n${rows}`;

    // Create Blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.setAttribute(
      "download",
      `${activeDataset.name.toLowerCase().replace(/\s+/g, "_")}_export.csv`,
    );
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="dv-root">
      <div className="dv-header">
        <span style={{ fontSize: 20 }}>📊</span>
        <h2>Dataset Viewer</h2>
      </div>

      <div
        className="dv-tabs"
        style={{ overflowX: "auto", whiteSpace: "nowrap" }}
      >
        {DATASETS.map((ds, i) => (
          <button
            key={i}
            className={`dv-tab ${activeTab === i ? "active" : ""}`}
            onClick={() => handleTabChange(i)}
          >
            {ds.name}
          </button>
        ))}
      </div>

      <div className="dv-toolbar">
        <input
          className="dv-search"
          type="text"
          placeholder="Search across all columns..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <span className="dv-count">
          {filtered ? `${filtered.totalRows} rows` : "—"}
        </span>
        <button
          onClick={exportCSV}
          disabled={!filtered || filtered.rows.length === 0}
          className="flex items-center space-x-2 px-3 py-1.5 text-xs font-semibold rounded-md bg-white/10 hover:bg-white/20 text-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Export filtered data to CSV"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" x2="12" y1="15" y2="3" />
          </svg>
          <span>Export CSV</span>
        </button>
      </div>

      <div className="dv-table-container">
        {apiLoading && activeDataset.type === "api" && !raw ? (
          <div className="dv-empty">Fetching remote dataset...</div>
        ) : filtered && paginated && filtered.rows.length > 0 ? (
          <table className="dv-table">
            <thead>
              <tr>
                {filtered.headers.map((h, i) => (
                  <th key={i}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className={getCellClass(filtered.headers[ci], cell)}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : apiLoading ? null : (
          <div className="dv-empty">No matching rows found.</div>
        )}
      </div>

      {paginated && paginated.totalPages > 1 && (
        <div className="dv-pagination">
          <button
            className="dv-page-btn"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ←
          </button>
          <span className="dv-page-info">
            Page {paginated.currentPage} of {paginated.totalPages}
          </span>
          <button
            className="dv-page-btn"
            disabled={page >= paginated.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
};

function getCellClass(header: string, value: string): string {
  const h = header?.toLowerCase() || "";
  const v = value?.toLowerCase() || "";
  if (h === "risk_level" || h === "risk") {
    if (v === "high" || v === "critical") return "cell-danger";
    if (v === "medium") return "cell-warn";
    if (v === "low") return "cell-ok";
  }
  if (h === "status") {
    if (v === "processed") return "cell-ok";
    if (v === "pending") return "cell-warn";
    if (v === "failed") return "cell-danger";
  }
  if (h === "confidence") {
    const n = parseFloat(v);
    if (n >= 0.9) return "cell-ok";
    if (n >= 0.7) return "cell-warn";
    if (n > 0) return "cell-danger";
  }
  return "";
}
