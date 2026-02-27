import { getScale } from "../device/DesktopViewport";

export function toVirtualCoords(clientX: number, clientY: number) {
  const scale = getScale();
  const root = document.getElementById("os-root");
  if (!root) return { x: clientX, y: clientY };

  const rect = root.getBoundingClientRect();
  return {
    x: (clientX - rect.left) / scale,
    y: (clientY - rect.top) / scale,
  };
}

export function initTouchAdapter(element: HTMLElement) {
  let longPressTimer: ReturnType<typeof setTimeout> | null = null;
  let touchStartX = 0,
    touchStartY = 0;
  let touchStartTime = 0;
  let lastTap = 0;

  element.addEventListener(
    "touchstart",
    (e) => {
      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      touchStartTime = Date.now();

      // Long press → right click
      longPressTimer = setTimeout(() => {
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        if (target) {
          const evt = new MouseEvent("contextmenu", {
            bubbles: true,
            clientX: touch.clientX,
            clientY: touch.clientY,
          });
          target.dispatchEvent(evt);
        }
      }, 500);
    },
    { passive: true },
  );

  element.addEventListener(
    "touchend",
    (e) => {
      if (longPressTimer) clearTimeout(longPressTimer);

      const touch = e.changedTouches[0];
      const dx = Math.abs(touch.clientX - touchStartX);
      const dy = Math.abs(touch.clientY - touchStartY);
      const dt = Date.now() - touchStartTime;

      // If not a drag (moved < 10px) and quick tap
      if (dx < 10 && dy < 10 && dt < 300) {
        const now = Date.now();
        const timeSinceLastTap = now - lastTap;

        if (timeSinceLastTap < 350) {
          // Double tap
          const target = document.elementFromPoint(
            touch.clientX,
            touch.clientY,
          );
          if (target) {
            const evt = new MouseEvent("dblclick", {
              bubbles: true,
              clientX: touch.clientX,
              clientY: touch.clientY,
            });
            target.dispatchEvent(evt);
          }
        } else {
          // Single tap → also fire click
          const target = document.elementFromPoint(
            touch.clientX,
            touch.clientY,
          );
          if (target) {
            const iconEl = target.closest(".desktop-icon");
            if (iconEl) {
              // Add tap animation
              iconEl.classList.add("tapped");
              setTimeout(() => {
                iconEl.classList.remove("tapped");
              }, 200);

              // On touch: single tap opens app (no double-click required)
              iconEl.dispatchEvent(
                new MouseEvent("dblclick", { bubbles: true }),
              );
            } else {
              target.dispatchEvent(
                new MouseEvent("click", {
                  bubbles: true,
                  clientX: touch.clientX,
                  clientY: touch.clientY,
                }),
              );
            }
          }
        }
        lastTap = now;
      }
    },
    { passive: true },
  );

  // Touch drag → mouse drag
  element.addEventListener(
    "touchmove",
    (e) => {
      if (longPressTimer) clearTimeout(longPressTimer);
      const touch = e.touches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);

      // Synthesize mousemove for drag handlers
      if (target) {
        target.dispatchEvent(
          new MouseEvent("mousemove", {
            bubbles: true,
            clientX: touch.clientX,
            clientY: touch.clientY,
            buttons: 1,
          }),
        );
      }
    },
    { passive: true },
  );
}
