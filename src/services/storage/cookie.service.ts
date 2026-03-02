/**
 * Cookie service — minimal helper for light preference flags.
 * NOT for large data. Use localStorage for that.
 */

const PREFIX = "webos_";

export const cookieService = {
  get(name: string): string | null {
    const prefixedName = `${PREFIX}${name}`;
    const match = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${prefixedName}=`));

    if (!match) return null;

    const value = decodeURIComponent(match.split("=")[1]);

    // Refresh cookie expiration to 90 days upon reading
    this.set(name, value, 90);

    return value;
  },

  set(name: string, value: string, days: number = 90): void {
    const prefixedName = `${PREFIX}${name}`;
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${prefixedName}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  },

  remove(name: string): void {
    const prefixedName = `${PREFIX}${name}`;
    document.cookie = `${prefixedName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  },
};

/**
 * cookieStorageService conforms to the same interface as localStorageService
 * but stores data in cookies with a rolling 90-day expiration.
 * Suitable for replacing localStorage when cookie-based persistence is required.
 */
export const cookieStorageService = {
  get<T = unknown>(key: string, fallback?: T): T | null {
    try {
      const item = cookieService.get(key);
      if (!item) return fallback !== undefined ? fallback : null;
      return JSON.parse(item) as T;
    } catch (e) {
      console.warn(`[CookieStorage] Error reading key "${key}":`, e);
      return fallback !== undefined ? fallback : null;
    }
  },

  set(key: string, value: unknown): void {
    try {
      const serializedValue = JSON.stringify(value);
      // Default expiration is configured in cookieService.set
      cookieService.set(key, serializedValue);
    } catch (e) {
      console.warn(`[CookieStorage] Error setting key "${key}":`, e);
    }
  },

  remove(key: string): void {
    cookieService.remove(key);
  },

  clear(): void {
    // Note: Clearing all cookies programmatically is difficult without knowing all keys.
    // This is a naive implementation that clears known webos_ prefixed cookies up to this path.
    const cookies = document.cookie.split("; ");
    for (let c = 0; c < cookies.length; c++) {
      const d = window.location.hostname.split(".");
      while (d.length > 0) {
        const cookieBase = encodeURIComponent(
          cookies[c].split(";")[0].split("=")[0],
        );
        if (cookieBase.startsWith(PREFIX)) {
          // Attempt to remove it across common paths/domains
          document.cookie = `${cookieBase}=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/`;
        }
        d.shift();
      }
    }
  },
};
