/**
 * LocalStorage service — typed wrapper for persistent browser storage.
 * All keys are prefixed with a version string for future-safe migrations.
 */

const PREFIX = 'webos_v1_';

function prefixKey(key: string): string {
    return `${PREFIX}${key}`;
}

export const localStorageService = {
    get<T = unknown>(key: string, fallback?: T): T | null {
        try {
            const raw = localStorage.getItem(prefixKey(key));
            if (raw === null) return fallback ?? null;
            return JSON.parse(raw) as T;
        } catch {
            return fallback ?? null;
        }
    },

    set(key: string, value: unknown): void {
        try {
            localStorage.setItem(prefixKey(key), JSON.stringify(value));
        } catch (e) {
            console.warn('[LocalStorage] set failed:', e);
        }
    },

    remove(key: string): void {
        localStorage.removeItem(prefixKey(key));
    },

    clear(): void {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && k.startsWith(PREFIX)) {
                keysToRemove.push(k);
            }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));
    },

    keys(): string[] {
        const result: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && k.startsWith(PREFIX)) {
                result.push(k.slice(PREFIX.length));
            }
        }
        return result;
    },
};
