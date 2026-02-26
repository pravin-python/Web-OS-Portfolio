/**
 * Data Service — CSV parsing, dataset loading, statistics.
 */

export interface CSVData {
  headers: string[];
  rows: string[][];
  totalRows: number;
}

/**
 * Parse a CSV string into headers and rows.
 */
export function parseCSV(content: string): CSVData {
  const lines = content.split("\n").filter((l) => l.trim());
  if (lines.length === 0) return { headers: [], rows: [], totalRows: 0 };

  const headers = lines[0].split(",").map((h) => h.trim());
  const rows = lines
    .slice(1)
    .map((line) => line.split(",").map((cell) => cell.trim()));

  return { headers, rows, totalRows: rows.length };
}

/**
 * Get a paginated slice of CSV data.
 */
export function paginateData(
  data: CSVData,
  page: number,
  perPage: number,
): { rows: string[][]; totalPages: number; currentPage: number } {
  const start = (page - 1) * perPage;
  const end = start + perPage;
  return {
    rows: data.rows.slice(start, end),
    totalPages: Math.ceil(data.rows.length / perPage),
    currentPage: page,
  };
}

/**
 * Filter rows by a search query across all columns.
 */
export function searchData(data: CSVData, query: string): CSVData {
  if (!query.trim()) return data;
  const q = query.toLowerCase();
  const filtered = data.rows.filter((row) =>
    row.some((cell) => cell.toLowerCase().includes(q)),
  );
  return { headers: data.headers, rows: filtered, totalRows: filtered.length };
}

/**
 * Generate dataset statistics summary.
 */
export function getDatasetStats(data: CSVData): string {
  const lines = [
    `Columns: ${data.headers.length}`,
    `Rows: ${data.totalRows}`,
    `Headers: ${data.headers.join(", ")}`,
  ];
  return lines.join("\n");
}

/* ─── System Log Generator (for live log viewer) ─── */

const LOG_TEMPLATES = [
  {
    level: "INFO",
    messages: [
      "Process started: OCR Engine",
      "Model inference completed (45ms)",
      "Dataset cache refreshed",
      "Scheduled backup completed",
      "Health check passed: all services OK",
      "API request processed: /predict (200)",
      "WebSocket connection established",
      "Session authenticated: researcher",
      "Model checkpoint saved",
      "Memory usage: 4.2GB / 16GB",
    ],
  },
  {
    level: "SUCCESS",
    messages: [
      "Training epoch completed successfully",
      "Invoice extraction: 12 fields extracted",
      "Security scan: no threats detected",
      "Database migration applied",
      "Model deployed to production",
      "Batch prediction: 50/50 completed",
    ],
  },
  {
    level: "WARN",
    messages: [
      "GPU memory usage above 80%",
      "Slow query detected (> 500ms)",
      "Rate limit approaching for API endpoint",
      "Disk usage at 75% — consider cleanup",
      "Model confidence below threshold: 0.72",
      "Connection pool nearing capacity",
    ],
  },
  {
    level: "ERROR",
    messages: [
      "Failed to connect to Redis (retry 1/3)",
      "OOM error during batch processing",
      "Invalid input format: expected JPEG",
      "Timeout: prediction service (30s)",
      "Authentication failed: invalid token",
    ],
  },
];

export function generateLogEntry(): {
  timestamp: string;
  level: string;
  message: string;
} {
  const now = new Date();
  const timestamp = now.toTimeString().split(" ")[0]; // HH:MM:SS

  // Weighted random: INFO most frequent, ERROR least
  const weights = [50, 25, 15, 10]; // INFO, SUCCESS, WARN, ERROR
  const total = weights.reduce((a, b) => a + b, 0);
  let rand = Math.random() * total;
  let idx = 0;
  for (let i = 0; i < weights.length; i++) {
    rand -= weights[i];
    if (rand <= 0) {
      idx = i;
      break;
    }
  }

  const category = LOG_TEMPLATES[idx];
  const message =
    category.messages[Math.floor(Math.random() * category.messages.length)];

  return { timestamp, level: category.level, message };
}
