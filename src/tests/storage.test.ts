import { describe, it, expect, beforeEach, vi } from 'vitest';
import { storage, sessionStore } from '../services/storage';

describe('storage.ts exports', () => {
  beforeEach(() => {
    storage.clear();
    sessionStorage.clear();
  });

  describe('storage (storageManager)', () => {
    it('should set and get values correctly', () => {
      storage.set('test_key', { foo: 'bar' });
      expect(storage.get('test_key')).toEqual({ foo: 'bar' });
    });

    it('should remove values correctly', () => {
      storage.set('test_key', 'value');
      storage.remove('test_key');
      expect(storage.get('test_key')).toBeNull();
    });

    it('should return fallback if key does not exist', () => {
      expect(storage.get('non_existent', 'fallback')).toBe('fallback');
    });

    it('should clear all values correctly', () => {
      storage.set('test_key_1', 1);
      storage.set('test_key_2', 2);
      storage.clear();
      expect(storage.get('test_key_1')).toBeNull();
      expect(storage.get('test_key_2')).toBeNull();
    });
  });

  describe('sessionStore (sessionStorageService)', () => {
    it('should set and get values correctly', () => {
      sessionStore.set('session_key', 123);
      expect(sessionStore.get('session_key')).toBe(123);
    });

    it('should remove values correctly', () => {
      sessionStore.set('session_key', 123);
      sessionStore.remove('session_key');
      expect(sessionStore.get('session_key')).toBeNull();
    });

    it('should return fallback if key does not exist', () => {
      expect(sessionStore.get('non_existent', 'fallback')).toBe('fallback');
    });

    it('should handle JSON parse errors gracefully and return fallback', () => {
      sessionStorage.setItem('webos_v1_bad_json', '{bad-json');
      expect(sessionStore.get('bad_json', 'fallback')).toBe('fallback');
    });

    it('should handle set errors gracefully', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Storage full');
      });

      sessionStore.set('error_key', 'value');

      expect(consoleWarnSpy).toHaveBeenCalledWith('[SessionStorage] set failed:', expect.any(Error));

      consoleWarnSpy.mockRestore();
      setItemSpy.mockRestore();
    });
  });
});
