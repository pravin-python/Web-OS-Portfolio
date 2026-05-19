import { describe, it, expect, beforeEach } from 'vitest';
import { listByPath, mkdir, touch } from '../services/filesystem/filesystem.engine';

describe('filesystem.engine: listByPath', () => {
  beforeEach(() => {
    // We can rely on the static seeded filesystem or create our own structure
  });

  it('should return an empty array for an invalid path', () => {
    const result = listByPath('/nonexistent/path');
    expect(result).toEqual([]);
  });

  it('should return an empty array for a file path', () => {
    // Ensure we have a file to test with
    touch('/', 'testfile.txt');
    const result = listByPath('/testfile.txt');
    expect(result).toEqual([]);
  });

  it('should return the correct children for a valid folder path', () => {
    // Create a known structure
    mkdir('/', 'test_folder');
    touch('/test_folder', 'file1.txt');
    touch('/test_folder', 'file2.txt');
    mkdir('/test_folder', 'subfolder1');

    const result = listByPath('/test_folder');
    expect(result).toHaveLength(3);
  });

  it('should sort children: folders first, then alphabetical', () => {
    // Create a known structure to test sorting
    mkdir('/', 'sort_test');
    touch('/sort_test', 'z_file.txt');
    touch('/sort_test', 'a_file.txt');
    mkdir('/sort_test', 'x_folder');
    mkdir('/sort_test', 'b_folder');

    const result = listByPath('/sort_test');
    expect(result).toHaveLength(4);

    // Check sorting
    expect(result[0].name).toBe('b_folder');
    expect(result[0].type).toBe('folder');

    expect(result[1].name).toBe('x_folder');
    expect(result[1].type).toBe('folder');

    expect(result[2].name).toBe('a_file.txt');
    expect(result[2].type).toBe('file');

    expect(result[3].name).toBe('z_file.txt');
    expect(result[3].type).toBe('file');
  });
});
