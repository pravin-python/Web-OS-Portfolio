import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { findByPath, mkdir, touch, removeNode } from "../services/filesystem/filesystem.engine";

describe("filesystem.engine - findByPath", () => {
  // Use unique names for testing to avoid conflicts with global state
  const testDir = "test_findByPath_dir";
  const testFile = "test_findByPath_file.txt";

  beforeEach(() => {
    // Setup some test directories and files
    mkdir("/", testDir);
    touch("/" + testDir, testFile);
  });

  afterEach(() => {
    // Cleanup the test directories and files
    removeNode("/" + testDir, testFile);
    removeNode("/", testDir);
  });

  it("should return the root node for '/'", () => {
    const node = findByPath("/");
    expect(node).not.toBeNull();
    expect(node?.id).toBe("root");
    expect(node?.name).toBe("/");
    expect(node?.type).toBe("folder");
  });

  it("should return the correct node for an existing directory", () => {
    const node = findByPath(`/${testDir}`);
    expect(node).not.toBeNull();
    expect(node?.name).toBe(testDir);
    expect(node?.type).toBe("folder");
    expect(node?.parentId).toBe("root");
  });

  it("should return the correct node for an existing file", () => {
    const node = findByPath(`/${testDir}/${testFile}`);
    expect(node).not.toBeNull();
    expect(node?.name).toBe(testFile);
    expect(node?.type).toBe("file");
  });

  it("should return null for non-existent paths", () => {
    const node = findByPath("/does/not/exist");
    expect(node).toBeNull();
  });

  it("should return null for paths where a parent directory does not exist", () => {
    const node = findByPath(`/${testDir}/nonexistent_folder/file.txt`);
    expect(node).toBeNull();
  });

  it("should handle empty paths or multiple slashes gracefully by ignoring them", () => {
    // Due to the implementation using .split("/").filter(Boolean), extra slashes are ignored
    const node1 = findByPath(`/${testDir}///${testFile}`);
    expect(node1).not.toBeNull();
    expect(node1?.name).toBe(testFile);

    const node2 = findByPath("///");
    expect(node2).not.toBeNull();
    expect(node2?.id).toBe("root");
  });
});
