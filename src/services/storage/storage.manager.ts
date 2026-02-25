/**
 * Storage Manager — central facade for all browser storage operations.
 * Acts as the OS "disk controller". Components should use this instead
 * of accessing localStorage/sessionStorage/cookies directly.
 */

import { localStorageService } from "./localStorage.service";
import { sessionStorageService } from "./sessionStorage.service";
import { cookieService } from "./cookie.service";

export const storageManager = {
  /** Permanent storage (survives refresh + tab close) */
  local: localStorageService,

  /** Session storage (survives refresh, resets on tab close) */
  session: sessionStorageService,

  /** Cookie storage (light preferences only) */
  cookie: cookieService,

  // ─── Convenience aliases matching old storage.ts API ───

  get<T = unknown>(key: string, fallback?: T): T | null {
    return localStorageService.get<T>(key, fallback);
  },

  set(key: string, value: unknown): void {
    localStorageService.set(key, value);
  },

  remove(key: string): void {
    localStorageService.remove(key);
  },

  clear(): void {
    localStorageService.clear();
  },
};

// Re-export sub-services for direct imports when needed
export { localStorageService } from "./localStorage.service";
export { sessionStorageService } from "./sessionStorage.service";
export { cookieService } from "./cookie.service";
