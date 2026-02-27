import { isTouchDevice } from "./deviceDetector";

/**
 * Returns true if the device is a mobile phone.
 * Mobile is defined strictly as: touch capability AND width < 700px.
 * This ensures tablets and desktops are not treated as mobile.
 */
export function isMobile(): boolean {
  if (typeof window === "undefined") return false;
  // Use the screen width, or innerWidth as a fallback
  const width = Math.min(window.screen.width, window.innerWidth);
  const height = Math.min(window.screen.height, window.innerHeight);

  // Consider the smallest dimension as the "width" of the device
  // regardless of its current orientation.
  const actualWidth = Math.min(width, height);

  return isTouchDevice() && actualWidth < 700;
}
