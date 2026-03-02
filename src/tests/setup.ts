import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Mock fetch for SVG loading
globalThis.fetch = vi.fn().mockImplementation(() => {
  // Return a dummy SVG for all fetch requests in tests
  return Promise.resolve({
    ok: true,
    text: () => Promise.resolve("<svg></svg>"),
  } as Response);
});
