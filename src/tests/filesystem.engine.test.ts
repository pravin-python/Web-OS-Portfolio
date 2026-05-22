import { describe, it, expect } from 'vitest';
import { getParentId, findByPath, mkdir, touch } from '../services/filesystem/filesystem.engine';

describe('filesystem.engine - getParentId', () => {
  it('should return null for non-existent node', () => {
    expect(getParentId('non-existent-id-123')).toBeNull();
  });

  it('should return null for the root node', () => {
    expect(getParentId('root')).toBeNull();
  });

  it('should return the correct parent id for a nested node', () => {
    const homeNode = findByPath('/home');
    expect(homeNode).not.toBeNull();
    expect(getParentId(homeNode!.id)).toBe('root');
  });

  it('should return the correct parent id for a deeply nested node', () => {
    // create the path first since it might not exist in the default seeded state
    mkdir('/home', 'researcher');
    touch('/home/researcher', 'notes.txt');

    const fileNode = findByPath('/home/researcher/notes.txt');
    const dirNode = findByPath('/home/researcher');

    expect(fileNode).not.toBeNull();
    expect(dirNode).not.toBeNull();

    expect(getParentId(fileNode!.id)).toBe(dirNode!.id);
  });
});
