import React, { useState, useEffect } from "react";
import { isMobile } from "./isMobile";
import { AboutProfile } from "../../apps/AboutProfile/AboutProfile";

interface Props {
  children: React.ReactNode;
}

export const MobileOrientationGuard: React.FC<Props> = ({ children }) => {
  const [isPortrait, setIsPortrait] = useState(
    window.innerHeight > window.innerWidth,
  );
  const [isMobileDevice, setIsMobileDevice] = useState(isMobile());
  const [isTooSmall, setIsTooSmall] = useState(
    Math.min(window.innerWidth, window.innerHeight) < 320 ||
      Math.max(window.innerWidth, window.innerHeight) < 560,
  );

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
      setIsMobileDevice(isMobile());
      setIsTooSmall(
        Math.min(window.innerWidth, window.innerHeight) < 320 ||
          Math.max(window.innerWidth, window.innerHeight) < 560,
      );
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  // Show the About Profile as a fallback for ANY unsupported mobile state
  // (either stuck in portrait, or screen too small even in landscape)
  if (isMobileDevice && (isPortrait || isTooSmall)) {
    return (
      <div className="fixed inset-0 z-[99999] bg-[#0A0A10] overflow-hidden">
        <AboutProfile />
      </div>
    );
  }

  return <>{children}</>;
};
