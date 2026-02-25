/* ═══════════════════════════════════════════════════
   Touch Adapter — Long press hook & helpers
   ═══════════════════════════════════════════════════ */

import { useRef, useCallback } from 'react';
export { isTouchDevice } from '../device/deviceDetector';

/**
 * Custom hook for long-press detection.
 *
 * Returns onPointerDown / onPointerUp / onPointerLeave handlers.
 * Calls `callback` after `ms` milliseconds of continuous press.
 */
export function useLongPress(callback: (e: React.PointerEvent) => void, ms = 500) {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const firedRef = useRef(false);

    const start = useCallback((e: React.PointerEvent) => {
        firedRef.current = false;
        timerRef.current = setTimeout(() => {
            firedRef.current = true;
            callback(e);
        }, ms);
    }, [callback, ms]);

    const cancel = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    return {
        onPointerDown: start,
        onPointerUp: cancel,
        onPointerLeave: cancel,
        /** True if the long press already fired (use to suppress click) */
        didFire: () => firedRef.current,
    };
}
