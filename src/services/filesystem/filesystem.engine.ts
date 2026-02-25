/**
 * Writable Virtual Filesystem Engine
 *
 * A flat-map-based filesystem persisted to localStorage.
 * On first load, seeds from the static filesystem.json.
 * Supports full CRUD: mkdir, touch, write, rm, mv, cp.
 * System nodes (/etc, /usr) are protected from mutation.
 */

import type { FileNode, FilesystemSnapshot } from "./file.node";
import { generateNodeId } from "./file.node";
import { localStorageService } from "../storage/localStorage.service";
import staticFilesystemData from "../../data/filesystem.json";

const FS_STORAGE_KEY = "filesystem";
const FS_VERSION = 1;

// System-protected top-level directory names
const SYSTEM_DIRS = new Set(["etc", "usr"]);

// ─── In-memory state ─────────────────────────────────────────────

let nodeMap = new Map<string, FileNode>();
let childrenMap = new Map<string | null, Set<string>>(); // parentId → child ids

// ─── Initialization ──────────────────────────────────────────────

function initialize(): void {
  const saved = localStorageService.get<FilesystemSnapshot>(FS_STORAGE_KEY);
  if (saved && saved.version === FS_VERSION && saved.nodes.length > 0) {
    hydrateFromSnapshot(saved);
  } else {
    seedFromStaticJSON();
    persist();
  }
}

function hydrateFromSnapshot(snapshot: FilesystemSnapshot): void {
  nodeMap.clear();
  childrenMap.clear();
  for (const node of snapshot.nodes) {
    nodeMap.set(node.id, node);
    if (!childrenMap.has(node.parentId)) {
      childrenMap.set(node.parentId, new Set());
    }
    childrenMap.get(node.parentId)!.add(node.id);
  }
}

interface StaticNode {
  id: string;
  name: string;
  type: "file" | "folder";
  content?: string;
  children?: StaticNode[];
}

function seedFromStaticJSON(): void {
  nodeMap.clear();
  childrenMap.clear();
  const root = staticFilesystemData.root as StaticNode;
  flattenStaticTree(root, null, false);
}

function flattenStaticTree(
  node: StaticNode,
  parentId: string | null,
  isSystem: boolean,
): void {
  const now = Date.now();
  // Mark top-level dirs as system
  const nodeIsSystem =
    isSystem || (parentId === "root" && SYSTEM_DIRS.has(node.name));

  const fileNode: FileNode = {
    id: node.id,
    name: node.name,
    type: node.type,
    parentId,
    content: node.content,
    createdAt: now,
    updatedAt: now,
    size: node.content ? new Blob([node.content]).size : 0,
    isSystem: nodeIsSystem,
  };

  nodeMap.set(node.id, fileNode);
  if (!childrenMap.has(parentId)) {
    childrenMap.set(parentId, new Set());
  }
  childrenMap.get(parentId)!.add(node.id);

  if (node.children) {
    for (const child of node.children) {
      flattenStaticTree(child, node.id, nodeIsSystem);
    }
  }
}

// ─── Persistence ─────────────────────────────────────────────────

function persist(): void {
  const snapshot: FilesystemSnapshot = {
    version: FS_VERSION,
    nodes: Array.from(nodeMap.values()),
  };
  localStorageService.set(FS_STORAGE_KEY, snapshot);
}

// ─── Path Resolution ─────────────────────────────────────────────

export function findByPath(pathStr: string): FileNode | null {
  const parts = pathStr.split("/").filter(Boolean);
  let current = nodeMap.get("root");
  if (!current) return null;
  if (parts.length === 0) return current;

  for (const part of parts) {
    const childIds = childrenMap.get(current.id);
    if (!childIds) return null;
    let found: FileNode | null = null;
    for (const cid of childIds) {
      const child = nodeMap.get(cid);
      if (child && child.name === part) {
        found = child;
        break;
      }
    }
    if (!found) return null;
    current = found;
  }
  return current;
}

export function listByPath(pathStr: string): FileNode[] {
  const node = findByPath(pathStr);
  if (!node || node.type !== "folder") return [];
  const childIds = childrenMap.get(node.id);
  if (!childIds) return [];
  const result: FileNode[] = [];
  for (const cid of childIds) {
    const child = nodeMap.get(cid);
    if (child) result.push(child);
  }
  // Sort: folders first, then alphabetical
  result.sort((a, b) => {
    if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
  return result;
}

export function readByPath(pathStr: string): string | null {
  const node = findByPath(pathStr);
  if (!node || node.type !== "file") return null;
  return node.content ?? "";
}

// ─── Node lookups (used by FileExplorer) ─────────────────────────

export function getNode(id: string): FileNode | null {
  return nodeMap.get(id) ?? null;
}

export function listChildren(parentId: string | null): FileNode[] {
  const pId = parentId ?? "root";
  const childIds = childrenMap.get(pId);
  if (!childIds) return [];
  const result: FileNode[] = [];
  for (const cid of childIds) {
    const child = nodeMap.get(cid);
    if (child) result.push(child);
  }
  result.sort((a, b) => {
    if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
  return result;
}

export function getFileContent(id: string): string | null {
  const node = nodeMap.get(id);
  if (!node || node.type !== "file") return null;
  return node.content ?? "";
}

export function getParentId(id: string): string | null {
  const node = nodeMap.get(id);
  return node?.parentId ?? null;
}

export function getNodePath(id: string): FileNode[] {
  const path: FileNode[] = [];
  let currentId: string | null = id;
  while (currentId) {
    const node = nodeMap.get(currentId);
    if (node) path.unshift(node);
    currentId = node?.parentId ?? null;
  }
  return path;
}

// ─── Helper: get full path string from a node ────────────────────

function getPathString(nodeId: string): string {
  const parts: string[] = [];
  let current = nodeMap.get(nodeId);
  while (current && current.id !== "root") {
    parts.unshift(current.name);
    current = current.parentId ? nodeMap.get(current.parentId) : undefined;
  }
  return "/" + parts.join("/");
}

// ─── Mutation helpers ────────────────────────────────────────────

function isSystemPath(pathStr: string): boolean {
  const node = findByPath(pathStr);
  return node?.isSystem ?? false;
}

function getParentAndName(
  pathStr: string,
): { parentPath: string; name: string } | null {
  const parts = pathStr.split("/").filter(Boolean);
  if (parts.length === 0) return null;
  const name = parts.pop()!;
  const parentPath = "/" + parts.join("/");
  return { parentPath, name };
}

// ─── Write Operations ────────────────────────────────────────────

export type FsResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

/**
 * Create a new directory.
 */
export function mkdir(currentPath: string, name: string): FsResult {
  const fullPath = resolvePath(currentPath, name);

  if (isSystemPath(currentPath)) {
    return {
      ok: false,
      error: "Permission denied: cannot modify system directories",
    };
  }

  const parsed = getParentAndName(fullPath);
  if (!parsed) return { ok: false, error: "Invalid path" };

  const parent = findByPath(parsed.parentPath);
  if (!parent)
    return { ok: false, error: `Directory not found: ${parsed.parentPath}` };
  if (parent.type !== "folder")
    return { ok: false, error: `Not a directory: ${parsed.parentPath}` };

  // Check for duplicate
  const existing = findByPath(fullPath);
  if (existing)
    return {
      ok: false,
      error: `File or directory already exists: ${parsed.name}`,
    };

  const now = Date.now();
  const node: FileNode = {
    id: generateNodeId(),
    name: parsed.name,
    type: "folder",
    parentId: parent.id,
    createdAt: now,
    updatedAt: now,
    size: 0,
    isSystem: false,
  };

  nodeMap.set(node.id, node);
  if (!childrenMap.has(parent.id)) {
    childrenMap.set(parent.id, new Set());
  }
  childrenMap.get(parent.id)!.add(node.id);
  childrenMap.set(node.id, new Set());
  persist();

  return { ok: true, message: `Created directory: ${parsed.name}` };
}

/**
 * Create an empty file.
 */
export function touch(currentPath: string, name: string): FsResult {
  const fullPath = resolvePath(currentPath, name);

  if (isSystemPath(currentPath)) {
    return {
      ok: false,
      error: "Permission denied: cannot modify system directories",
    };
  }

  const parsed = getParentAndName(fullPath);
  if (!parsed) return { ok: false, error: "Invalid path" };

  const parent = findByPath(parsed.parentPath);
  if (!parent)
    return { ok: false, error: `Directory not found: ${parsed.parentPath}` };
  if (parent.type !== "folder")
    return { ok: false, error: `Not a directory: ${parsed.parentPath}` };

  // Check for duplicate
  const existing = findByPath(fullPath);
  if (existing)
    return { ok: false, error: `File already exists: ${parsed.name}` };

  const now = Date.now();
  const node: FileNode = {
    id: generateNodeId(),
    name: parsed.name,
    type: "file",
    parentId: parent.id,
    content: "",
    createdAt: now,
    updatedAt: now,
    size: 0,
    isSystem: false,
  };

  nodeMap.set(node.id, node);
  if (!childrenMap.has(parent.id)) {
    childrenMap.set(parent.id, new Set());
  }
  childrenMap.get(parent.id)!.add(node.id);
  persist();

  return { ok: true, message: `Created file: ${parsed.name}` };
}

/**
 * Write content to an existing file (or create if it doesn't exist).
 */
export function writeFile(
  currentPath: string,
  fileName: string,
  content: string,
): FsResult {
  const fullPath = resolvePath(currentPath, fileName);

  if (isSystemPath(fullPath)) {
    return {
      ok: false,
      error: "Permission denied: cannot modify system files",
    };
  }

  let node = findByPath(fullPath);

  if (!node) {
    // Auto-create file
    const createResult = touch(currentPath, fileName);
    if (!createResult.ok) return createResult;
    node = findByPath(fullPath);
    if (!node) return { ok: false, error: "Failed to create file" };
  }

  if (node.type !== "file") {
    return { ok: false, error: `Not a file: ${fileName}` };
  }

  if (node.isSystem) {
    return {
      ok: false,
      error: "Permission denied: cannot modify system files",
    };
  }

  node.content = content;
  node.updatedAt = Date.now();
  node.size = new Blob([content]).size;
  persist();

  return { ok: true, message: `Written ${node.size} bytes to ${fileName}` };
}

/**
 * Remove a file or empty folder.
 */
export function removeNode(currentPath: string, name: string): FsResult {
  const fullPath = resolvePath(currentPath, name);

  if (fullPath === "/") {
    return {
      ok: false,
      error: "Permission denied: cannot delete root directory",
    };
  }

  const node = findByPath(fullPath);
  if (!node) return { ok: false, error: `No such file or directory: ${name}` };

  if (node.isSystem) {
    return {
      ok: false,
      error: "Permission denied: cannot delete system files",
    };
  }

  // Check if folder is non-empty
  if (node.type === "folder") {
    const children = childrenMap.get(node.id);
    if (children && children.size > 0) {
      return { ok: false, error: `Directory not empty: ${name}` };
    }
  }

  // Remove from parent's children
  if (node.parentId) {
    childrenMap.get(node.parentId)?.delete(node.id);
  }

  // Remove own children map entry
  childrenMap.delete(node.id);

  // Remove from node map
  nodeMap.delete(node.id);
  persist();

  return { ok: true, message: `Removed: ${name}` };
}

/**
 * Move/rename a file or folder.
 */
export function moveNode(
  currentPath: string,
  srcName: string,
  destName: string,
): FsResult {
  const srcPath = resolvePath(currentPath, srcName);
  const destPath = resolvePath(currentPath, destName);

  const srcNode = findByPath(srcPath);
  if (!srcNode)
    return { ok: false, error: `No such file or directory: ${srcName}` };
  if (srcNode.isSystem)
    return { ok: false, error: "Permission denied: cannot move system files" };

  // If dest is an existing folder, move into it
  const destNode = findByPath(destPath);
  if (destNode && destNode.type === "folder") {
    // Check for name collision inside dest
    const childIds = childrenMap.get(destNode.id);
    if (childIds) {
      for (const cid of childIds) {
        const child = nodeMap.get(cid);
        if (child && child.name === srcNode.name) {
          return {
            ok: false,
            error: `File already exists in destination: ${srcNode.name}`,
          };
        }
      }
    }
    // Move to new parent
    if (srcNode.parentId) {
      childrenMap.get(srcNode.parentId)?.delete(srcNode.id);
    }
    srcNode.parentId = destNode.id;
    if (!childrenMap.has(destNode.id)) {
      childrenMap.set(destNode.id, new Set());
    }
    childrenMap.get(destNode.id)!.add(srcNode.id);
    srcNode.updatedAt = Date.now();
    persist();
    return {
      ok: true,
      message: `Moved ${srcName} → ${getPathString(destNode.id)}/${srcNode.name}`,
    };
  }

  // Otherwise treat as rename
  const parsed = getParentAndName(destPath);
  if (!parsed) return { ok: false, error: "Invalid destination path" };

  const destParent = findByPath(parsed.parentPath);
  if (!destParent)
    return {
      ok: false,
      error: `Destination directory not found: ${parsed.parentPath}`,
    };

  // Check collision
  const collision = findByPath(destPath);
  if (collision)
    return { ok: false, error: `File already exists: ${parsed.name}` };

  // Remove from old parent
  if (srcNode.parentId) {
    childrenMap.get(srcNode.parentId)?.delete(srcNode.id);
  }

  // Update node
  srcNode.name = parsed.name;
  srcNode.parentId = destParent.id;
  srcNode.updatedAt = Date.now();

  // Add to new parent
  if (!childrenMap.has(destParent.id)) {
    childrenMap.set(destParent.id, new Set());
  }
  childrenMap.get(destParent.id)!.add(srcNode.id);
  persist();

  return { ok: true, message: `Moved ${srcName} → ${destName}` };
}

/**
 * Copy a file (folders not supported for simplicity).
 */
export function copyNode(
  currentPath: string,
  srcName: string,
  destName: string,
): FsResult {
  const srcPath = resolvePath(currentPath, srcName);
  const destPath = resolvePath(currentPath, destName);

  const srcNode = findByPath(srcPath);
  if (!srcNode) return { ok: false, error: `No such file: ${srcName}` };
  if (srcNode.type !== "file")
    return { ok: false, error: "cp: copying directories is not supported" };

  const parsed = getParentAndName(destPath);
  if (!parsed) return { ok: false, error: "Invalid destination path" };

  const destParent = findByPath(parsed.parentPath);
  if (!destParent)
    return {
      ok: false,
      error: `Destination directory not found: ${parsed.parentPath}`,
    };
  if (destParent.isSystem)
    return {
      ok: false,
      error: "Permission denied: cannot copy into system directories",
    };

  // Check collision
  const collision = findByPath(destPath);
  if (collision)
    return { ok: false, error: `File already exists: ${parsed.name}` };

  const now = Date.now();
  const newNode: FileNode = {
    id: generateNodeId(),
    name: parsed.name,
    type: "file",
    parentId: destParent.id,
    content: srcNode.content,
    createdAt: now,
    updatedAt: now,
    size: srcNode.size,
    isSystem: false,
  };

  nodeMap.set(newNode.id, newNode);
  if (!childrenMap.has(destParent.id)) {
    childrenMap.set(destParent.id, new Set());
  }
  childrenMap.get(destParent.id)!.add(newNode.id);
  persist();

  return { ok: true, message: `Copied ${srcName} → ${destName}` };
}

// ─── Export / Import ─────────────────────────────────────────────

export function exportJSON(): string {
  const snapshot: FilesystemSnapshot = {
    version: FS_VERSION,
    nodes: Array.from(nodeMap.values()),
  };
  return JSON.stringify(snapshot, null, 2);
}

export function importJSON(json: string): FsResult {
  try {
    const snapshot = JSON.parse(json) as FilesystemSnapshot;
    if (!snapshot.nodes || !Array.isArray(snapshot.nodes)) {
      return { ok: false, error: "Invalid filesystem backup format" };
    }
    hydrateFromSnapshot({ ...snapshot, version: FS_VERSION });
    persist();
    return { ok: true, message: `Imported ${snapshot.nodes.length} nodes` };
  } catch {
    return { ok: false, error: "Failed to parse filesystem backup" };
  }
}

// ─── Path utilities ──────────────────────────────────────────────

function resolvePath(currentPath: string, target: string): string {
  if (target.startsWith("/")) return normalizePath(target);
  const parts = currentPath.split("/").filter(Boolean);
  for (const segment of target.split("/")) {
    if (segment === "..") {
      parts.pop();
    } else if (segment !== "." && segment !== "") {
      parts.push(segment);
    }
  }
  return "/" + parts.join("/");
}

function normalizePath(path: string): string {
  const parts = path.split("/").filter(Boolean);
  const result: string[] = [];
  for (const part of parts) {
    if (part === "..") result.pop();
    else if (part !== ".") result.push(part);
  }
  return "/" + result.join("/");
}

// ─── Boot the filesystem ─────────────────────────────────────────

initialize();
