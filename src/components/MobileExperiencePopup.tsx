import React, { useState, useEffect } from "react";
import { MonitorSmartphone, X } from "lucide-react";
import { isMobile } from "../core/device/isMobile";

export const MobileExperiencePopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(() => {
    // Only show if it's a mobile device and hasn't been dismissed before
    if (typeof window === "undefined") return false;
    const hasDismissed = localStorage.getItem("mobile-warning-dismissed");
    return isMobile() && !hasDismissed;
  });

  // Apply pointer-events-none to the body while the popup is visible to prevent
  // any underlying touch events from firing when the popup is dismissed
  useEffect(() => {
    if (isVisible) {
      document.body.style.pointerEvents = "none";
    } else {
      document.body.style.pointerEvents = "";
    }
    return () => {
      document.body.style.pointerEvents = "";
    };
  }, [isVisible]);

  const handleDismiss = (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.TouchEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    // Use a slight timeout to let any ghost clicks resolve before re-enabling pointer events
    setIsVisible(false);
    localStorage.setItem("mobile-warning-dismissed", "true");

    setTimeout(() => {
      document.body.style.pointerEvents = "";
    }, 100);
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[100000] flex items-start justify-center pt-4 px-4 bg-transparent"
      style={{ pointerEvents: "auto" }} // Re-enable pointer events for the overlay wrapper itself
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      <div className="bg-[#0A0A1A]/80 backdrop-blur-lg border border-white/10 p-4 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex items-start gap-3 transition-all duration-300 w-full max-w-sm">
        <div className="p-2 bg-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.3)] rounded-lg text-blue-400 shrink-0 mt-0.5">
          <MonitorSmartphone size={22} />
        </div>
        <div className="flex-1">
          <h3 className="text-white/90 font-medium mb-1 text-[15px]">
            Better Experience
          </h3>
          <p className="text-white/60 text-[13px] leading-relaxed">
            For a better experience, please is site ko{" "}
            <strong>Tablet, PC, or Desktop</strong> par open karein.
          </p>
        </div>
        <button
          onClick={handleDismiss}
          onTouchEnd={handleDismiss} // Use onTouchEnd for faster response on mobile
          className="p-1.5 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors shrink-0"
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};
