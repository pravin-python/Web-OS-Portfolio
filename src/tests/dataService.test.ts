import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { generateLogEntry } from "../services/dataService";

describe("dataService - generateLogEntry", () => {
  beforeEach(() => {
    vi.spyOn(Math, "random");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return a valid log entry structure with timestamp in HH:MM:SS format", () => {
    const entry = generateLogEntry();

    expect(entry).toHaveProperty("timestamp");
    expect(entry).toHaveProperty("level");
    expect(entry).toHaveProperty("message");

    // Check HH:MM:SS format
    expect(entry.timestamp).toMatch(/^\d{2}:\d{2}:\d{2}$/);

    // Check level is one of the valid ones
    expect(["INFO", "SUCCESS", "WARN", "ERROR"]).toContain(entry.level);
    expect(typeof entry.message).toBe("string");
  });

  it("should generate an INFO log when Math.random falls in the first weight tier (0-50)", () => {
    // 0.2 * 100 = 20 (<= 50) -> INFO
    // 0.0 for message selection
    vi.mocked(Math.random).mockReturnValueOnce(0.2).mockReturnValueOnce(0.0);
    const entry = generateLogEntry();
    expect(entry.level).toBe("INFO");
    expect(entry.message).toBeTruthy();
  });

  it("should generate a SUCCESS log when Math.random falls in the second weight tier (50-75)", () => {
    // 0.6 * 100 = 60 (> 50, <= 75) -> SUCCESS
    vi.mocked(Math.random).mockReturnValueOnce(0.6).mockReturnValueOnce(0.0);
    const entry = generateLogEntry();
    expect(entry.level).toBe("SUCCESS");
  });

  it("should generate a WARN log when Math.random falls in the third weight tier (75-90)", () => {
    // 0.8 * 100 = 80 (> 75, <= 90) -> WARN
    vi.mocked(Math.random).mockReturnValueOnce(0.8).mockReturnValueOnce(0.0);
    const entry = generateLogEntry();
    expect(entry.level).toBe("WARN");
  });

  it("should generate an ERROR log when Math.random falls in the fourth weight tier (90-100)", () => {
    // 0.95 * 100 = 95 (> 90, <= 100) -> ERROR
    vi.mocked(Math.random).mockReturnValueOnce(0.95).mockReturnValueOnce(0.0);
    const entry = generateLogEntry();
    expect(entry.level).toBe("ERROR");
  });
});
