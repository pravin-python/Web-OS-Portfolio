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
    return decodeURIComponent(match.split("=")[1]);
  },

  set(name: string, value: string, days: number = 365): void {
    const prefixedName = `${PREFIX}${name}`;
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${prefixedName}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  },

  remove(name: string): void {
    const prefixedName = `${PREFIX}${name}`;
    document.cookie = `${prefixedName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  },
};
