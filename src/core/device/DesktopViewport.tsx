/* ═══════════════════════════════════════════════════
   Desktop Viewport — CSS transform scaling for mobile
   ═══════════════════════════════════════════════════ */

import React, { useState, useLayoutEffect, useRef } from "react";
import { isTouchDevice, VIRTUAL_WIDTH, VIRTUAL_HEIGHT } from "./deviceDetector";

interface DesktopViewportProps {
  children: React.ReactNode;
}

/**
 * On touch devices, renders children inside a fixed-size virtual canvas
 * (1366×768) and CSS-scales it to fit the screen. On desktop, renders
 * children normally with no scaling.
 */
export const DesktopViewport: React.FC<DesktopViewportProps> = ({
  children,
}) => {
  const [scale, setScale] = useState(1);
  const isTouch = isTouchDevice();
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!isTouch) return;

    function recalc() {
      const s = Math.min(
        window.innerWidth / VIRTUAL_WIDTH,
        window.innerHeight / VIRTUAL_HEIGHT,
      );
      setScale(s);
    }

    recalc();

    // Throttled resize handler
    let rafId = 0;
    function onResize() {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(recalc);
    }

    const onOrientationChange = () => {
      // Delay slightly for orientation change to settle
      setTimeout(recalc, 150);
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onOrientationChange);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onOrientationChange);
      cancelAnimationFrame(rafId);
    };
  }, [isTouch]);

  // Desktop — no scaling wrapper
  if (!isTouch) {
    return <>{children}</>;
  }

  // Mobile — scaled virtual canvas
  return (
    <div
      ref={containerRef}
      style={{
        width: window.innerWidth,
        height: window.innerHeight,
        overflow: "hidden",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      <div
        style={{
          width: VIRTUAL_WIDTH,
          height: VIRTUAL_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          overflow: "hidden",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        {children}
      </div>
    </div>
  );
};
