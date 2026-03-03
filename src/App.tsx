import { Routes, Route, Navigate } from "react-router-dom";
import { DesktopLayout } from "./layouts/DesktopLayout";
import { MobileOrientationGuard } from "./core/device/MobileOrientationGuard";
import { CookieConsent } from "./components/CookieConsent";
import { MobileExperiencePopup } from "./components/MobileExperiencePopup";

function App() {
  return (
    <>
      <MobileOrientationGuard>
        <Routes>
          {/* All /os/* routes render the OS desktop shell */}
          <Route path="/os/*" element={<DesktopLayout />} />
          {/* Everything else redirects to the desktop */}
          <Route path="*" element={<Navigate to="/os/desktop" replace />} />
        </Routes>
        <CookieConsent />
      </MobileOrientationGuard>
      <MobileExperiencePopup />
    </>
  );
}

export default App;
