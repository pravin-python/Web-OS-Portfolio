/* ═══════════════════════════════════════════════════
   Orientation Guard — Portrait & Unsupported overlays
   ═══════════════════════════════════════════════════ */

import React, { useState, useEffect } from 'react';
import { isTouchDevice, isUnsupportedDevice, needsRotation } from './deviceDetector';

interface OrientationGuardProps {
    children: React.ReactNode;
}

export const OrientationGuard: React.FC<OrientationGuardProps> = ({ children }) => {
    const [state, setState] = useState<'ok' | 'portrait' | 'unsupported'>('ok');

    useEffect(() => {
        function check() {
            if (!isTouchDevice()) {
                setState('ok');
                return;
            }
            if (isUnsupportedDevice()) {
                setState('unsupported');
                return;
            }
            setState(needsRotation() ? 'portrait' : 'ok');
        }

        check();

        window.addEventListener('resize', check);
        window.addEventListener('orientationchange', check);

        // Also listen via matchMedia for more reliable portrait detection
        const mql = window.matchMedia('(orientation: portrait)');
        mql.addEventListener('change', check);

        return () => {
            window.removeEventListener('resize', check);
            window.removeEventListener('orientationchange', check);
            mql.removeEventListener('change', check);
        };
    }, []);

    if (state === 'unsupported') {
        return <UnsupportedOverlay />;
    }

    if (state === 'portrait') {
        return <PortraitOverlay />;
    }

    return <>{children}</>;
};

/* ── Unsupported Device Overlay ── */
const UnsupportedOverlay: React.FC = () => (
    <div style={overlayBase}>
        <div style={cardStyle}>
            {/* Monitor icon */}
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            <h1 style={titleStyle}>Screen Too Small</h1>
            <p style={descStyle}>
                This interactive OS portfolio requires a larger screen.
                <br />
                Please open on a tablet, laptop, or desktop.
            </p>
            <a
                href="https://github.com/pravin-python"
                style={btnStyle}
                target="_blank"
                rel="noopener noreferrer"
            >
                View Simple Profile →
            </a>
        </div>
    </div>
);

/* ── Portrait Mode Overlay ── */
const PortraitOverlay: React.FC = () => (
    <div style={overlayBase}>
        <div style={cardStyle}>
            {/* Animated rotate icon */}
            <div style={{ animation: 'rotateHint 2s ease-in-out infinite' }}>
                <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="2" width="16" height="20" rx="2" />
                    <line x1="12" y1="18" x2="12" y2="18.01" />
                </svg>
            </div>
            <h1 style={titleStyle}>Rotate Your Device</h1>
            <p style={descStyle}>
                This portfolio OS works best in landscape mode,
                <br />
                just like a real computer screen.
            </p>
        </div>

        {/* CSS keyframes injected inline */}
        <style>{`
            @keyframes rotateHint {
                0%, 100% { transform: rotate(0deg); }
                25% { transform: rotate(-90deg); }
                50% { transform: rotate(-90deg); }
                75% { transform: rotate(0deg); }
            }
        `}</style>
    </div>
);

/* ── Shared Styles ── */
const overlayBase: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 99999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const cardStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '40px 32px',
    maxWidth: 380,
};

const titleStyle: React.CSSProperties = {
    color: '#f1f5f9',
    fontSize: 22,
    fontWeight: 700,
    margin: '20px 0 8px',
};

const descStyle: React.CSSProperties = {
    color: '#94a3b8',
    fontSize: 14,
    lineHeight: 1.6,
    margin: '0 0 24px',
};

const btnStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '10px 24px',
    borderRadius: 8,
    background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    textDecoration: 'none',
    transition: 'opacity 0.2s',
};
