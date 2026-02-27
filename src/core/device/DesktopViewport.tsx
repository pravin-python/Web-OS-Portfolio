/* eslint-disable react-refresh/only-export-components */
import React, { useLayoutEffect, useRef } from "react";
import { initTouchAdapter } from "./TouchAdapter";
import { useWindowStore } from "../state/useWindowStore";
import { isTouchDevice, isMobilePerformance } from "./deviceDetector";

export const VIRTUAL_WIDTH = 1366;
export const VIRTUAL_HEIGHT = 768;

export function getScale() {
  if (typeof window === "undefined") return 1;
  return Math.min(
    window.innerWidth / VIRTUAL_WIDTH,
    window.innerHeight / VIRTUAL_HEIGHT,
  );
}

interface DesktopViewportProps {
  children: React.ReactNode;
}

/**
 * Renders the OS inside a fixed 1366x768 virtual canvas, and CSS-scales
 * it to fit symmetrically on any screen size.
 */
export const DesktopViewport: React.FC<DesktopViewportProps> = ({
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const repositionAllWindows = useWindowStore(
    (state) => state.repositionAllWindows,
  );

  useLayoutEffect(() => {
    if (containerRef.current) {
      initTouchAdapter(containerRef.current);
    }

    function applyScale() {
      if (!containerRef.current) return;
      const scale = getScale();
      containerRef.current.style.setProperty("--os-scale", scale.toString());

      const scaledW = VIRTUAL_WIDTH * scale;
      const scaledH = VIRTUAL_HEIGHT * scale;
      const offsetX = Math.max(0, (window.innerWidth - scaledW) / 2);
      const offsetY = Math.max(0, (window.innerHeight - scaledH) / 2);

      containerRef.current.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;

      // Reposition windows to ensure they are inside canvas bounds
      repositionAllWindows();
    }

    applyScale();
    const handleOrientation = () => setTimeout(applyScale, 150);

    window.addEventListener("orientationchange", handleOrientation);

    // Provide robust scale recalculation when containing box changes size
    const resizeObserver = new ResizeObserver(() => {
      applyScale();
    });
    resizeObserver.observe(document.body);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("orientationchange", handleOrientation);
    };
  }, [repositionAllWindows]);

  const containerClasses = [
    isTouchDevice() ? "touch-mode" : "",
    isMobilePerformance() ? "perf-mode" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      id="os-root"
      ref={containerRef}
      className={containerClasses}
      style={{
        width: VIRTUAL_WIDTH,
        height: VIRTUAL_HEIGHT,
        transformOrigin: "top left",
        position: "fixed",
        top: 0,
        left: 0,
        overflow: "hidden",
        /* Enforce theme defaults here so inner elements inherit correctly */
        background: "#0d0d1a",
        color: "var(--text-primary)",
      }}
    >
      {children}
    </div>
  );
};
