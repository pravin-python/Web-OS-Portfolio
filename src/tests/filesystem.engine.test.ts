import { describe, it, expect } from "vitest";
import { getNode, mkdir, findByPath } from "../services/filesystem/filesystem.engine";

describe("filesystem.engine - getNode", () => {
  it("should return a valid node for an existing ID", () => {
    // The filesystem is initialized with static data, "root" should exist
    const node = getNode("root");
    expect(node).not.toBeNull();
    expect(node?.id).toBe("root");
    expect(node?.type).toBe("folder");
  });

  it("should return null for a non-existent ID", () => {
    const node = getNode("this-id-does-not-exist");
    expect(node).toBeNull();
  });

  it("should successfully retrieve a newly created node", () => {
    // Create a new directory
    const dirName = `test-dir-${Date.now()}`;
    const result = mkdir("/", dirName);
    expect(result.ok).toBe(true);

    // Find the newly created node by path
    const createdNode = findByPath(`/${dirName}`);
    expect(createdNode).not.toBeNull();

    if (createdNode) {
      // Retrieve the node using its ID
      const retrievedNode = getNode(createdNode.id);
      expect(retrievedNode).not.toBeNull();
      expect(retrievedNode?.id).toBe(createdNode.id);
      expect(retrievedNode?.name).toBe(dirName);
      expect(retrievedNode?.type).toBe("folder");
    }
  });
});
