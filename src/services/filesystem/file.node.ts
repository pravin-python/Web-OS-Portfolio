/**
 * FileNode — the data model for virtual filesystem nodes.
 */

export interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  parentId: string | null;
  content?: string;
  createdAt: number;
  updatedAt: number;
  size: number;
  isSystem: boolean;
}

/**
 * Serialized form of the whole filesystem (stored in localStorage).
 */
export interface FilesystemSnapshot {
  version: number;
  nodes: FileNode[];
}

let _idCounter = 0;

/**
 * Generate a unique ID for newly created nodes.
 */
export function generateNodeId(): string {
  return `node-${Date.now()}-${++_idCounter}`;
}
