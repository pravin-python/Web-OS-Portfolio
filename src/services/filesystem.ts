/**
 * Virtual filesystem service — backward-compatible barrel.
 *
 * Re-exports all public APIs from the new writable filesystem engine.
 * Existing consumers (FileExplorer, terminal) continue to work without
 * changing their import paths.
 */

export type { FileNode } from './filesystem/file.node';

export {
    findByPath,
    listByPath,
    readByPath,
    getNode,
    listChildren,
    getFileContent,
    getParentId,
    getNodePath,
    mkdir,
    touch,
    writeFile,
    removeNode,
    moveNode,
    copyNode,
    exportJSON,
    importJSON,
} from './filesystem/filesystem.engine';
