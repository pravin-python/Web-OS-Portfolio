import React, { useState, useEffect } from "react";

function getDeviceState() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const portrait = h > w;

  if (portrait && w < 700) return "portrait-mobile";
  if (w < 700 || h < 450) return "too-small";
  return "supported";
}

interface OrientationGuardProps {
  children: React.ReactNode;
}

export const OrientationGuard: React.FC<OrientationGuardProps> = ({
  children,
}) => {
  const [state, setState] = useState(getDeviceState());

  useEffect(() => {
    const check = () => setState(getDeviceState());

    window.addEventListener("resize", check);
    window.addEventListener("orientationchange", check);

    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("orientationchange", check);
    };
  }, []);

  if (state === "portrait-mobile") return <PortraitGuard />;
  if (state === "too-small") return <SmallScreenGuard />;

  return <>{children}</>;
};

const PortraitGuard = () => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 99999,
      background: "#0d0d1a",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "24px",
      color: "#f0f0f5",
      fontFamily: "-apple-system, sans-serif",
      textAlign: "center",
      padding: "32px",
    }}
  >
    <div
      style={{
        fontSize: "64px",
        animation: "rotateHint 2s ease-in-out infinite",
      }}
    >
      📱
    </div>
    <div style={{ fontSize: "20px", fontWeight: 600 }}>Rotate your device</div>
    <div style={{ fontSize: "14px", color: "#9999b0", maxWidth: "280px" }}>
      DevOS is a desktop experience. Please rotate to landscape mode to
      continue.
    </div>
  </div>
);

const SmallScreenGuard = () => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 99999,
      background: "#0d0d1a",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "16px",
      color: "#f0f0f5",
      fontFamily: "-apple-system, sans-serif",
      textAlign: "center",
      padding: "24px",
    }}
  >
    <div style={{ fontSize: "48px" }}>🖥️</div>
    <div style={{ fontSize: "18px", fontWeight: 600 }}>Screen too small</div>
    <div style={{ fontSize: "13px", color: "#9999b0", maxWidth: "260px" }}>
      DevOS requires a minimum viewport of 700×450px. Please open on a tablet,
      laptop, or desktop.
    </div>
  </div>
);
