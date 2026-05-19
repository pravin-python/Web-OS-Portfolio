import { describe, it, expect } from "vitest";
import {
  getFileContent,
  touch,
  writeFile,
  findByPath,
  mkdir
} from "../services/filesystem/filesystem.engine";

describe("filesystem.engine", () => {
  describe("getFileContent", () => {
    it("returns null for non-existent node ID", () => {
      expect(getFileContent("non-existent-id")).toBeNull();
    });

    it("returns null for a folder ID", () => {
      mkdir("/", "test_folder_get");
      const folderNode = findByPath("/test_folder_get");
      expect(folderNode).not.toBeNull();
      expect(getFileContent(folderNode!.id)).toBeNull();
    });

    it("returns empty string for an empty file", () => {
      touch("/", "empty_file.txt");
      const fileNode = findByPath("/empty_file.txt");
      expect(fileNode).not.toBeNull();
      expect(getFileContent(fileNode!.id)).toBe("");
    });

    it("returns file content for a file with content", () => {
      touch("/", "content_file.txt");
      writeFile("/", "content_file.txt", "Hello World");
      const fileNode = findByPath("/content_file.txt");
      expect(fileNode).not.toBeNull();
      expect(getFileContent(fileNode!.id)).toBe("Hello World");
    });
  });
});
