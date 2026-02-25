/**
 * localStorage/sessionStorage wrapper — barrel re-export from new storage services.
 * Preserves backward compatibility for all existing consumers.
 */

import { storageManager } from "./storage/storage.manager";
import { sessionStorageService } from "./storage/sessionStorage.service";

/**
 * Primary storage interface (localStorage).
 * Existing consumers: Notepad, terminal, desktopStore, windowStore, etc.
 */
export const storage = storageManager;

/**
 * Session storage interface (sessionStorage).
 */
export const sessionStore = sessionStorageService;
