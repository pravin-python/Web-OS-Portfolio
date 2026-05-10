import { useWindowStore } from "./state/useWindowStore";
import { APP_REGISTRY } from "./appRegistry";
import type { NavigateFunction } from "react-router-dom";

/**
 * Launch an app by its registry key.
 * Opens the corresponding window and optionally updates the browser URL.
 *
 * This is a plain function (not a hook) so it can be called from anywhere:
 * Desktop, Taskbar, Terminal, OSRouter, etc.
 */
export function launchApp(
  appKey: string,
  appData?: Record<string, unknown>,
  navigate?: NavigateFunction,
): void {
  const app = APP_REGISTRY[appKey];
  if (!app) {
    console.warn(`launchApp: unknown app key "${appKey}"`);
    return;
  }

  const store = useWindowStore.getState();

  // Always open a new instance of the app securely
  store.openWindow(app.title, appKey, undefined, app.defaultSize, appData);

  // Update browser URL if navigate function is available
  if (navigate && app.route) {
    navigate(app.route, { replace: true, state: { os_handled: Date.now() } });
  }
}

/**
 * Resolve common app name aliases to registry keys.
 * Used by terminal commands like "open files" or "run snake".
 */
const APP_ALIASES: Record<string, string> = {
  files: "fileExplorer",
  explorer: "fileExplorer",
  file: "fileExplorer",
  term: "terminal",
  terminal: "terminal",
  notes: "notepad",
  note: "notepad",
  notepad: "notepad",
  snake: "snake",
  tictactoe: "tictactoe",
  ttt: "tictactoe",
  "2048": "game2048",
  settings: "settings",
  contact: "contactCenter",
  "contact-center": "contactCenter",
  dsa: "dsaLab",
  "dsa-lab": "dsaLab",
  dsalab: "dsaLab",
  "ml-calculator": "mlCalculator",
  mlcalculator: "mlCalculator",
  mlcalc: "mlCalculator",
};

export function resolveAppAlias(name: string): string | null {
  const lower = name.toLowerCase();
  return APP_ALIASES[lower] || APP_REGISTRY[lower]?.key || null;
}
