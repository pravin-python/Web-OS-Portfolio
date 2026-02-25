import React, { useState, useEffect, useRef } from 'react';

interface ScoreBoardProps {
    score: number;
    bestScore: number;
    lastScoreAdd: number;
    onNewGame: () => void;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = React.memo(({
    score, bestScore, lastScoreAdd, onNewGame
}) => {
    const [showAdd, setShowAdd] = useState(false);
    const prevScoreRef = useRef(score);
    const addKeyRef = useRef(0);

    useEffect(() => {
        if (score > prevScoreRef.current && lastScoreAdd > 0) {
            addKeyRef.current++;
            setShowAdd(true);
            const timer = setTimeout(() => setShowAdd(false), 700);
            prevScoreRef.current = score;
            return () => clearTimeout(timer);
        }
        prevScoreRef.current = score;
    }, [score, lastScoreAdd]);

    return (
        <>
            <div className="game2048-header">
                <div className="game2048-logo">2048</div>
                <div className="game2048-scores">
                    <div className="game2048-score-box">
                        <div className="game2048-score-label">Score</div>
                        <div className="game2048-score-value">{score}</div>
                        {showAdd && lastScoreAdd > 0 && (
                            <div key={addKeyRef.current} className="game2048-score-add">
                                +{lastScoreAdd}
                            </div>
                        )}
                    </div>
                    <div className="game2048-score-box">
                        <div className="game2048-score-label">Best</div>
                        <div className="game2048-score-value">{bestScore}</div>
                    </div>
                </div>
            </div>
            <div className="game2048-controls">
                <span className="game2048-subtitle">Join the tiles, get to <b>2048!</b></span>
                <button className="game2048-new-btn" onClick={onNewGame}>New Game</button>
            </div>
        </>
    );
});

ScoreBoard.displayName = 'ScoreBoard';
