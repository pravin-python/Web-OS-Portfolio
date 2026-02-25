import { useEffect } from "react";
import { useWindowStore } from "../core/state/useWindowStore";

const BASE_TITLE = "Pravin Prajapati — AI & Machine Learning Engineer";

/**
 * Updates the browser tab title to reflect the currently focused window.
 * Falls back to the base portfolio title when no window is focused.
 *
 * Format: "{App Title} — Pravin Prajapati Portfolio"
 */
export function useDocumentTitle(): void {
  const focusedWindowId = useWindowStore((s) => s.focusedWindowId);
  const windows = useWindowStore((s) => s.windows);

  useEffect(() => {
    if (!focusedWindowId) {
      document.title = BASE_TITLE;
      return;
    }

    const win = windows.find((w) => w.id === focusedWindowId);
    if (win && !win.isMinimized) {
      document.title = `${win.title} — Pravin Prajapati Portfolio`;
    } else {
      document.title = BASE_TITLE;
    }
  }, [focusedWindowId, windows]);
}
