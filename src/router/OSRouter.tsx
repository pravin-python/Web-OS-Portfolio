import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { resolveRouteToAppKey, APP_REGISTRY } from "../core/appRegistry";
import { launchApp } from "../core/appLauncher";

/**
 * RouteToWindowAdapter — listens to URL changes and opens the corresponding
 * app window inside the OS. This is NOT a page renderer. It bridges
 * React Router with the WindowManager.
 *
 * Flow: URL change → useLocation → resolveRoute → launchApp → WindowManager
 */
export const OSRouter: React.FC = () => {
  const location = useLocation();
  const lastProcessedPath = useRef<string>("");

  useEffect(() => {
    const pathname = location.pathname;

    // Skip desktop route and already-processed paths
    if (
      pathname === "/os/desktop" ||
      pathname === "/os" ||
      pathname === "/os/"
    ) {
      lastProcessedPath.current = pathname;
      return;
    }

    // Don't re-process the same path
    if (pathname === lastProcessedPath.current) {
      return;
    }

    lastProcessedPath.current = pathname;

    const appKey = resolveRouteToAppKey(pathname);
    if (!appKey) {
      return;
    }

    // Extract deep link data from URL
    const appData: Record<string, string> = {};

    // Parse query params (e.g. ?path=/home/pravin)
    const searchParams = new URLSearchParams(location.search);
    searchParams.forEach((value, key) => {
      appData[key] = value;
    });

    // Parse path params (e.g. /os/notes/123 → deepLinkId: 123)
    const routeApp = Object.values(APP_REGISTRY).find((app) =>
      pathname.startsWith(app.route),
    );

    if (routeApp) {
      const remaining = pathname.slice(routeApp.route.length);
      if (remaining.startsWith("/") && remaining.length > 1) {
        appData.deepLinkId = remaining.slice(1);
      }
    }

    // Launch the app (creates or focuses window)
    launchApp(appKey, Object.keys(appData).length > 0 ? appData : undefined);
  }, [location.pathname, location.search]);

  // This component renders nothing — it's a side-effect bridge
  return null;
};
