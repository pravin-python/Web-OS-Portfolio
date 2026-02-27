/* ═══════════════════════════════════════════════════
   Device Detector — Screen size, orientation, touch
   ═══════════════════════════════════════════════════ */

/** Minimum supported screen resolution */
export const MIN_WIDTH = 720;
export const MIN_HEIGHT = 480;

/** Virtual desktop canvas dimensions */
export const VIRTUAL_WIDTH = 1366;
export const VIRTUAL_HEIGHT = 768;

/**
 * Returns true if the device has touch capability.
 */
export function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

/**
 * Returns true if the device is likely mobile/tablet needing performance mode.
 */
export function isMobilePerformance(): boolean {
  if (typeof window === "undefined") return false;
  return (
    isTouchDevice() && Math.max(window.innerWidth, window.innerHeight) < 1366
  );
}

export type Orientation = "portrait" | "landscape";

export interface ScreenInfo {
  width: number;
  height: number;
  orientation: Orientation;
  isTouch: boolean;
}

/**
 * Returns current screen information.
 */
export function getScreenInfo(): ScreenInfo {
  const width = window.innerWidth;
  const height = window.innerHeight;
  return {
    width,
    height,
    orientation: height > width ? "portrait" : "landscape",
    isTouch: isTouchDevice(),
  };
}

/**
 * Returns true if the device screen is too small in BOTH orientations
 * (i.e. even rotating won't help).
 */
export function isUnsupportedDevice(): boolean {
  const w = window.screen.width;
  const h = window.screen.height;
  const maxDim = Math.max(w, h);
  const minDim = Math.min(w, h);
  return maxDim < MIN_WIDTH || minDim < MIN_HEIGHT;
}

/**
 * Returns true if the device is currently in portrait mode
 * AND is a touch device (i.e. needs rotation prompt).
 */
export function needsRotation(): boolean {
  if (!isTouchDevice()) return false;
  return window.innerHeight > window.innerWidth;
}
