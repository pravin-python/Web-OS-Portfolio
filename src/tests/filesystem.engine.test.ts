import { describe, it, expect } from "vitest";
import { readByPath, writeFile, touch } from "../services/filesystem/filesystem.engine";

describe("filesystem.engine - readByPath", () => {
  it("should return the content of an existing file", () => {
    const content = readByPath("/etc/hostname");
    expect(content).toBe("research-station");
  });

  it("should return null for non-existent path", () => {
    expect(readByPath("/non/existent/file.txt")).toBeNull();
  });

  it("should return null if path is a folder", () => {
    expect(readByPath("/etc")).toBeNull();
  });

  it("should return correct content for newly created files", () => {
    const writeResult = writeFile("/home", "test.txt", "Hello World");
    expect(writeResult.ok).toBe(true);

    expect(readByPath("/home/test.txt")).toBe("Hello World");
  });

  it("should return empty string for file with no content", () => {
    const touchResult = touch("/home", "empty.txt");
    expect(touchResult.ok).toBe(true);

    expect(readByPath("/home/empty.txt")).toBe("");
  });
});
