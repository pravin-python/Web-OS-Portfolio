import React, { useState, useEffect } from "react";
import { cookieService } from "../services/storage/cookie.service";
import "./CookieConsent.css";

const CONSENT_COOKIE_NAME = "cookie_consent_accepted";

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Check if consent cookie exists
    const hasConsented = cookieService.get(CONSENT_COOKIE_NAME);
    if (!hasConsented) {
      // Small delay for better UX on initial load
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    // Set consent cookie for 90 days
    cookieService.set(CONSENT_COOKIE_NAME, "true", 90);

    // Start closing animation
    setIsClosing(true);

    // Remove from DOM after animation completes
    setTimeout(() => {
      setIsVisible(false);
    }, 400); // Matches CSS transition duration
  };

  if (!isVisible) return null;

  return (
    <div className={`cookie-consent-overlay ${isClosing ? "closing" : ""}`}>
      <div className="cookie-consent-modal">
        <div className="cookie-consent-content">
          <div className="cookie-icon">🍪</div>
          <div className="cookie-text">
            <h3>We Value Your Privacy</h3>
            <p>
              This application uses cookies to ensure you get the best
              experience, such as saving your settings and preferences securely
              for up to 90 days.
            </p>
          </div>
        </div>
        <div className="cookie-consent-actions">
          <button className="cookie-accept-btn" onClick={handleAccept}>
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
