/* ═══════════════════════════════════════════════════
   Input Controller — Keyboard + Mouse + Touch Swipe
   ═══════════════════════════════════════════════════ */

import type { Direction } from "./gameEngine";

export type DirectionHandler = (direction: Direction) => void;

interface InputControllerOptions {
  /** Element to attach pointer/touch listeners to */
  element: HTMLElement;
  /** Called when a valid direction input is detected */
  onDirection: DirectionHandler;
  /** Minimum swipe distance in pixels */
  swipeThreshold?: number;
}

/**
 * Attaches keyboard, mouse swipe, and touch swipe listeners.
 * Returns a cleanup function that removes all listeners.
 */
export function attachInputController(
  options: InputControllerOptions,
): () => void {
  const { element, onDirection, swipeThreshold = 30 } = options;

  let locked = false;
  let lockTimer: ReturnType<typeof setTimeout> | null = null;

  const LOCK_MS = 150; // prevent double-moves during animation

  function emitDirection(dir: Direction) {
    if (locked) return;
    locked = true;
    lockTimer = setTimeout(() => {
      locked = false;
    }, LOCK_MS);
    onDirection(dir);
  }

  /* ─── Keyboard ─── */
  function handleKeyDown(e: KeyboardEvent) {
    let dir: Direction | null = null;
    switch (e.key) {
      case "ArrowUp":
      case "w":
      case "W":
        dir = "up";
        break;
      case "ArrowDown":
      case "s":
      case "S":
        dir = "down";
        break;
      case "ArrowLeft":
      case "a":
      case "A":
        dir = "left";
        break;
      case "ArrowRight":
      case "d":
      case "D":
        dir = "right";
        break;
    }
    if (dir) {
      e.preventDefault();
      emitDirection(dir);
    }
  }

  document.addEventListener("keydown", handleKeyDown);

  /* ─── Pointer / Touch Swipe ─── */
  let startX = 0;
  let startY = 0;
  let tracking = false;

  function handlePointerDown(e: PointerEvent) {
    tracking = true;
    startX = e.clientX;
    startY = e.clientY;
    element.setPointerCapture(e.pointerId);
  }

  function handlePointerUp(e: PointerEvent) {
    if (!tracking) return;
    tracking = false;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (Math.max(absDx, absDy) < swipeThreshold) return; // too small

    let dir: Direction;
    if (absDx > absDy) {
      dir = dx > 0 ? "right" : "left";
    } else {
      dir = dy > 0 ? "down" : "up";
    }
    emitDirection(dir);
  }

  function handlePointerCancel() {
    tracking = false;
  }

  element.addEventListener("pointerdown", handlePointerDown);
  element.addEventListener("pointerup", handlePointerUp);
  element.addEventListener("pointercancel", handlePointerCancel);

  // Prevent scroll on touch devices
  function preventTouchScroll(e: TouchEvent) {
    if (e.cancelable) e.preventDefault();
  }
  element.addEventListener("touchmove", preventTouchScroll, { passive: false });

  let touchStartX = 0;
  let touchStartY = 0;
  function handleTouchStart(e: TouchEvent) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }
  function handleTouchEnd(e: TouchEvent) {
    const dx = e.changedTouches[0].screenX - touchStartX;
    const dy = e.changedTouches[0].screenY - touchStartY;
    if (Math.max(Math.abs(dx), Math.abs(dy)) > swipeThreshold) {
      if (Math.abs(dx) > Math.abs(dy)) {
        emitDirection(dx > 0 ? "right" : "left");
      } else {
        emitDirection(dy > 0 ? "down" : "up");
      }
    }
  }

  element.addEventListener("touchstart", handleTouchStart, { passive: true });
  element.addEventListener("touchend", handleTouchEnd, { passive: true });

  /* ─── Cleanup ─── */
  return () => {
    document.removeEventListener("keydown", handleKeyDown);
    element.removeEventListener("pointerdown", handlePointerDown);
    element.removeEventListener("pointerup", handlePointerUp);
    element.removeEventListener("pointercancel", handlePointerCancel);
    element.removeEventListener("touchmove", preventTouchScroll);
    element.removeEventListener("touchstart", handleTouchStart);
    element.removeEventListener("touchend", handleTouchEnd);
    if (lockTimer) clearTimeout(lockTimer);
  };
}
