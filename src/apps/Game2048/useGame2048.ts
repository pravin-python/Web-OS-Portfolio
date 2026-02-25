/* ═══════════════════════════════════════════════════
   useGame2048 — React Hook bridging Engine → UI
   ═══════════════════════════════════════════════════ */

import { useState, useCallback, useRef } from 'react';
import {
    initGame,
    move,
    spawnTile,
    canMove,
    hasWon,
    getTiles,
    clearFlags,
    type Board,
    type Direction,
    type TileData,
} from './gameEngine';
import { useNotificationStore } from '../../core/state/useNotificationStore';

const LS_BEST = 'webos.game2048.bestscore';

export type GameStatus = 'playing' | 'won' | 'over';

export interface Game2048State {
    tiles: TileData[];
    score: number;
    bestScore: number;
    status: GameStatus;
    /** Whether the user chose "Continue" after winning (so we don't show the win overlay again) */
    continuedPastWin: boolean;
}

export interface Game2048Actions {
    handleDirection: (dir: Direction) => void;
    newGame: () => void;
    continueAfterWin: () => void;
}

export function useGame2048(): [Game2048State, Game2048Actions, React.MutableRefObject<number>] {
    const boardRef = useRef<Board>(initGame());
    const [tiles, setTiles] = useState<TileData[]>(() => getTiles(boardRef.current));
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(() => {
        const saved = localStorage.getItem(LS_BEST);
        return saved ? parseInt(saved, 10) : 0;
    });
    const [status, setStatus] = useState<GameStatus>('playing');
    const [continuedPastWin, setContinuedPastWin] = useState(false);
    const lastScoreAddRef = useRef(0);

    const animLockRef = useRef(false);

    const addGlobalNotification = useNotificationStore(state => state.addNotification);

    const saveBest = useCallback((newScore: number) => {
        setBestScore(prev => {
            if (newScore > prev && prev > 0) {
                // only notify if beating an existing score > 0
                addGlobalNotification(
                    'New High Score! 🏆',
                    `You reached a new top score of ${newScore} in Logic Grid 2048!`,
                    'success',
                    'LogiGrid 2048'
                );
            }
            const best = Math.max(prev, newScore);
            localStorage.setItem(LS_BEST, String(best));
            return best;
        });
    }, [addGlobalNotification]);

    const handleDirection = useCallback((dir: Direction) => {
        if (animLockRef.current) return;
        if (status === 'over') return;
        // If won and not continued, block moves (overlay is showing)
        if (status === 'won' && !continuedPastWin) return;

        const result = move(boardRef.current, dir);
        if (!result.moved) return;

        // Lock during animation
        animLockRef.current = true;

        const newScore = score + result.scoreGained;
        lastScoreAddRef.current = result.scoreGained;
        boardRef.current = result.board;
        setTiles(getTiles(result.board));
        setScore(newScore);
        saveBest(newScore);

        // After slide animation, spawn tile and clear flags
        setTimeout(() => {
            let afterSpawn = spawnTile(boardRef.current);
            boardRef.current = afterSpawn;
            setTiles(getTiles(afterSpawn));

            // Check win (only if not already continued past win)
            if (!continuedPastWin && hasWon(afterSpawn)) {
                setStatus('won');
                addGlobalNotification(
                    '2048 Reached! 🎉',
                    'Incredible! You merged your way to the 2048 tile.',
                    'success',
                    'LogiGrid 2048'
                );
            }
            // Check game over
            else if (!canMove(afterSpawn)) {
                setStatus('over');
                addGlobalNotification(
                    'Game Over 💀',
                    `No more moves available. Final score: ${newScore}`,
                    'warning',
                    'LogiGrid 2048'
                );
            }

            // Clear animation flags after animations complete
            setTimeout(() => {
                boardRef.current = clearFlags(boardRef.current);
                setTiles(getTiles(boardRef.current));
                animLockRef.current = false;
            }, 150);
        }, 130);
    }, [score, status, continuedPastWin, saveBest]);

    const newGame = useCallback(() => {
        const board = initGame();
        boardRef.current = board;
        setTiles(getTiles(board));
        setScore(0);
        setStatus('playing');
        setContinuedPastWin(false);
        lastScoreAddRef.current = 0;
        animLockRef.current = false;
    }, []);

    const continueAfterWin = useCallback(() => {
        setContinuedPastWin(true);
        setStatus('playing');
    }, []);

    const state: Game2048State = { tiles, score, bestScore, status, continuedPastWin };
    const actions: Game2048Actions = { handleDirection, newGame, continueAfterWin };

    return [state, actions, lastScoreAddRef];
}
