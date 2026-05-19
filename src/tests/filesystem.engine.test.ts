import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { listChildren, mkdir, touch, findByPath, exportJSON, importJSON } from '../services/filesystem/filesystem.engine';

describe('filesystem.engine - listChildren', () => {
  let initialSnapshot: string;

  beforeEach(() => {
    initialSnapshot = exportJSON();
  });

  afterEach(() => {
    importJSON(initialSnapshot);
  });

  it('should list children of the root directory when parentId is null', () => {
    const children = listChildren(null);
    expect(Array.isArray(children)).toBe(true);
    const names = children.map(c => c.name);
    expect(names).toContain('home');
    expect(names).toContain('etc');
    expect(names).toContain('usr');
  });

  it('should return empty array for non-existent parentId', () => {
    const children = listChildren('non-existent-id');
    expect(children).toEqual([]);
  });

  it('should list children sorted with folders first, then alphabetically', () => {
    mkdir('/', 'test-sort');
    const testFolderNode = findByPath('/test-sort');
    expect(testFolderNode).not.toBeNull();

    // Create mixed children inside /test-sort
    mkdir('/test-sort', 'z-folder');
    mkdir('/test-sort', 'a-folder');
    touch('/test-sort', 'z-file.txt');
    touch('/test-sort', 'a-file.txt');

    const children = listChildren(testFolderNode!.id);

    expect(children.length).toBe(4);

    // Folders first, alphabetical
    expect(children[0].name).toBe('a-folder');
    expect(children[0].type).toBe('folder');

    expect(children[1].name).toBe('z-folder');
    expect(children[1].type).toBe('folder');

    // Files second, alphabetical
    expect(children[2].name).toBe('a-file.txt');
    expect(children[2].type).toBe('file');

    expect(children[3].name).toBe('z-file.txt');
    expect(children[3].type).toBe('file');
  });
});
