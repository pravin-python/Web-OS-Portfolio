/**
 * Storage Manager — central facade for all browser storage operations.
 * Acts as the OS "disk controller". Components should use this instead
 * of accessing localStorage/sessionStorage/cookies directly.
 */

import { sessionStorageService } from "./sessionStorage.service";
import { cookieService, cookieStorageService } from "./cookie.service";

export const storageManager = {
  /** Permanent storage (survives refresh + tab close), using 90-day cookies */
  local: cookieStorageService,

  /** Session storage (survives refresh, resets on tab close) */
  session: sessionStorageService,

  /** Cookie storage (light preferences only) */
  cookie: cookieService,

  // ─── Convenience aliases matching old storage.ts API ───

  get<T = unknown>(key: string, fallback?: T): T | null {
    return cookieStorageService.get<T>(key, fallback);
  },

  set(key: string, value: unknown): void {
    cookieStorageService.set(key, value);
  },

  remove(key: string): void {
    cookieStorageService.remove(key);
  },

  clear(): void {
    cookieStorageService.clear();
  },
};

// Re-export sub-services for direct imports when needed
// localStorageService is kept around but unused by the central manager
export { localStorageService } from "./localStorage.service";
export { sessionStorageService } from "./sessionStorage.service";
export { cookieService, cookieStorageService } from "./cookie.service";
