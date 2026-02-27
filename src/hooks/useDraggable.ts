import { useRef } from "react";

import { useWindowStore } from "../core/state/useWindowStore";
import { VIRTUAL_WIDTH, VIRTUAL_HEIGHT } from "../core/device/deviceDetector";

export function useDraggable(windowId: string) {
  const isDragging = useRef(false);
  const dragStart = useRef({ mouseX: 0, mouseY: 0, winX: 0, winY: 0 });

  function getScale() {
    const root = document.getElementById("os-root");
    if (!root) return 1;
    const rect = root.getBoundingClientRect();
    return rect.width / VIRTUAL_WIDTH;
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only allow left-click or touch interactions
    if (e.pointerType === "mouse" && e.button !== 0) return;

    // Capture starting parameters
    isDragging.current = true;
    const store = useWindowStore.getState();
    const win = store.windows.find((w) => w.id === windowId);
    if (!win) return;

    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      winX: win.position.x,
      winY: win.position.y,
    };

    // Enable global grabbing CSS
    document.body.classList.add("is-dragging");
    store.focusWindow(windowId);

    // Define movement handler
    const onPointerMove = (moveEvent: PointerEvent) => {
      if (!isDragging.current) return;
      moveEvent.preventDefault(); // Stop text selection / scrolling while moving

      const scale = getScale();
      const dx = (moveEvent.clientX - dragStart.current.mouseX) / scale;
      const dy = (moveEvent.clientY - dragStart.current.mouseY) / scale;

      let newX = dragStart.current.winX + dx;
      let newY = dragStart.current.winY + dy;

      const TASKBAR_HEIGHT = 28;
      const DOCK_HEIGHT = 76;

      newX = Math.max(0, Math.min(newX, VIRTUAL_WIDTH - win.size.width));
      newY = Math.max(
        TASKBAR_HEIGHT,
        Math.min(newY, VIRTUAL_HEIGHT - DOCK_HEIGHT - win.size.height),
      );

      store.updateWindowPosition(windowId, { x: newX, y: newY });
    };

    // Define release handler
    const onPointerUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        document.body.classList.remove("is-dragging");
      }
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("pointercancel", onPointerUp);
    };

    // Bind document-level global drag events
    document.addEventListener("pointermove", onPointerMove, { passive: false });
    document.addEventListener("pointerup", onPointerUp);
    document.addEventListener("pointercancel", onPointerUp);
  };

  return { handlePointerDown };
}
