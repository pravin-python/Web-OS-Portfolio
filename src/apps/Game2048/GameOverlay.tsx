import React from 'react';
import type { GameStatus } from './useGame2048';

interface GameOverlayProps {
    status: GameStatus;
    continuedPastWin: boolean;
    onNewGame: () => void;
    onContinue: () => void;
}

export const GameOverlay: React.FC<GameOverlayProps> = React.memo(({
    status, continuedPastWin, onNewGame, onContinue
}) => {
    // Show nothing if playing or already continued past win
    if (status === 'playing') return null;
    if (status === 'won' && continuedPastWin) return null;

    const isWin = status === 'won';

    return (
        <div className={`game2048-overlay ${isWin ? 'win' : ''}`}>
            <div className="game2048-overlay-title">
                {isWin ? '🎉 You Win!' : 'Game Over'}
            </div>
            <div className="game2048-overlay-sub">
                {isWin ? 'You reached 2048!' : 'No more moves available'}
            </div>
            <div className="game2048-overlay-buttons">
                {isWin && (
                    <button className="game2048-overlay-btn secondary" onClick={onContinue}>
                        Continue
                    </button>
                )}
                <button className="game2048-overlay-btn primary" onClick={onNewGame}>
                    {isWin ? 'New Game' : 'Try Again'}
                </button>
            </div>
        </div>
    );
});

GameOverlay.displayName = 'GameOverlay';
