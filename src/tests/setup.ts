import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock fetch for SVG loading
global.fetch = vi.fn().mockImplementation(() => {
  // Return a dummy SVG for all fetch requests in tests
  return Promise.resolve({
    ok: true,
    text: () => Promise.resolve("<svg></svg>"),
  } as Response);
});
