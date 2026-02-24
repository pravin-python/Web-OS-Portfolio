/* ═══════════════════════════════════════════════════
   2048 — Root Component (Web-OS Window Integration)
   ═══════════════════════════════════════════════════ */

import React, { useEffect, useRef, useCallback } from 'react';
import { useWindowStore, type WindowInstance } from '../../core/state/useWindowStore';
import { useGame2048 } from './useGame2048';
import { Board } from './Board';
import { ScoreBoard } from './ScoreBoard';
import { GameOverlay } from './GameOverlay';
import { attachInputController } from './inputController';
import './styles.css';

export const TwentyFortyEight: React.FC<{ window: WindowInstance }> = ({ window: win }) => {
    const focusedWindowId = useWindowStore(s => s.focusedWindowId);
    const [state, actions, lastScoreAddRef] = useGame2048();
    const boardAreaRef = useRef<HTMLDivElement>(null);

    // Stable reference for the direction handler
    const handleDirRef = useRef(actions.handleDirection);
    handleDirRef.current = actions.handleDirection;

    const stableHandleDir = useCallback(
        (...args: Parameters<typeof actions.handleDirection>) => handleDirRef.current(...args),
        []
    );

    // Attach input controller — only when window is focused
    useEffect(() => {
        if (focusedWindowId !== win.id) return;
        if (!boardAreaRef.current) return;

        const cleanup = attachInputController({
            element: boardAreaRef.current,
            onDirection: stableHandleDir,
        });

        return cleanup;
    }, [focusedWindowId, win.id, stableHandleDir]);

    return (
        <div className="game2048-root" ref={boardAreaRef}>
            <ScoreBoard
                score={state.score}
                bestScore={state.bestScore}
                lastScoreAdd={lastScoreAddRef.current}
                onNewGame={actions.newGame}
            />

            <div className="game2048-board-wrapper" style={{ position: 'relative' }}>
                <Board tiles={state.tiles} />
                <GameOverlay
                    status={state.status}
                    continuedPastWin={state.continuedPastWin}
                    onNewGame={actions.newGame}
                    onContinue={actions.continueAfterWin}
                />
            </div>

            <div className="game2048-hints">
                <kbd>↑</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd> or <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> to move &middot; Swipe to play on mobile
            </div>
        </div>
    );
};
