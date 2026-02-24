/**
 * SessionStorage service — typed wrapper for session-scoped browser storage.
 * Data resets when the browser tab closes.
 */

const PREFIX = 'webos_v1_';

function prefixKey(key: string): string {
    return `${PREFIX}${key}`;
}

export const sessionStorageService = {
    get<T = unknown>(key: string, fallback?: T): T | null {
        try {
            const raw = sessionStorage.getItem(prefixKey(key));
            if (raw === null) return fallback ?? null;
            return JSON.parse(raw) as T;
        } catch {
            return fallback ?? null;
        }
    },

    set(key: string, value: unknown): void {
        try {
            sessionStorage.setItem(prefixKey(key), JSON.stringify(value));
        } catch (e) {
            console.warn('[SessionStorage] set failed:', e);
        }
    },

    remove(key: string): void {
        sessionStorage.removeItem(prefixKey(key));
    },
};
