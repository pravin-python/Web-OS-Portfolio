/**
 * TicTacToe AI — 4 difficulty levels.
 *
 *   Easy   — random empty cell
 *   Medium — block player's winning move, else random
 *   Hard   — full minimax
 *   Expert — minimax + alpha-beta pruning, prefers center/corners
 */

import type { Board, Player } from './gameEngine';
import {
    checkWinner, isDraw, getAvailableMoves, makeMove, opponent,
} from './gameEngine';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

// ─── public API ──────────────────────────────────────────────────

/** Returns a Promise that resolves with the chosen cell index after a human-like delay */
export function getAIMove(
    board: Board,
    aiPlayer: Player,
    difficulty: Difficulty,
): Promise<number> {
    const delay = 400 + Math.random() * 300;            // 400–700 ms
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(computeMove(board, aiPlayer, difficulty));
        }, delay);
    });
}

// ─── internal ────────────────────────────────────────────────────

function computeMove(board: Board, ai: Player, d: Difficulty): number {
    switch (d) {
        case 'easy': return easyMove(board);
        case 'medium': return mediumMove(board, ai);
        case 'hard': return hardMove(board, ai);
        case 'expert': return expertMove(board, ai);
    }
}

/** Random empty cell */
function easyMove(board: Board): number {
    const moves = getAvailableMoves(board);
    return moves[Math.floor(Math.random() * moves.length)];
}

/** Block the human if they're about to win, else random */
function mediumMove(board: Board, ai: Player): number {
    const human = opponent(ai);
    const moves = getAvailableMoves(board);

    // Can AI win in one move?
    for (const m of moves) {
        const b = makeMove(board, m, ai);
        if (checkWinner(b)) return m;
    }

    // Block human's winning move
    for (const m of moves) {
        const b = makeMove(board, m, human);
        if (checkWinner(b)) return m;
    }

    // Otherwise random
    return easyMove(board);
}

/** Full minimax (no pruning) */
function hardMove(board: Board, ai: Player): number {
    let bestScore = -Infinity;
    let bestMove = getAvailableMoves(board)[0];

    for (const m of getAvailableMoves(board)) {
        const b = makeMove(board, m, ai);
        const score = minimax(b, false, ai);
        if (score > bestScore) {
            bestScore = score;
            bestMove = m;
        }
    }
    return bestMove;
}

/** Minimax + alpha-beta pruning + strategic preference for center/corners */
function expertMove(board: Board, ai: Player): number {
    let bestScore = -Infinity;
    let bestMove = getAvailableMoves(board)[0];

    for (const m of getAvailableMoves(board)) {
        const b = makeMove(board, m, ai);
        const score = minimaxAB(b, false, ai, -Infinity, Infinity) + positionBonus(m);
        if (score > bestScore) {
            bestScore = score;
            bestMove = m;
        }
    }
    return bestMove;
}

/** Slight bonus for strategically superior positions */
function positionBonus(index: number): number {
    if (index === 4) return 0.03;              // center
    if ([0, 2, 6, 8].includes(index)) return 0.02; // corners
    return 0;
}

// ─── minimax variants ────────────────────────────────────────────

function minimax(board: Board, isMaximizing: boolean, ai: Player): number {
    const win = checkWinner(board);
    if (win) return win.winner === ai ? 10 : -10;
    if (isDraw(board)) return 0;

    const moves = getAvailableMoves(board);
    if (isMaximizing) {
        let best = -Infinity;
        for (const m of moves) {
            best = Math.max(best, minimax(makeMove(board, m, ai), false, ai));
        }
        return best;
    } else {
        let best = Infinity;
        for (const m of moves) {
            best = Math.min(best, minimax(makeMove(board, m, opponent(ai)), true, ai));
        }
        return best;
    }
}

function minimaxAB(
    board: Board, isMaximizing: boolean, ai: Player,
    alpha: number, beta: number,
): number {
    const win = checkWinner(board);
    if (win) return win.winner === ai ? 10 : -10;
    if (isDraw(board)) return 0;

    const moves = getAvailableMoves(board);
    if (isMaximizing) {
        let best = -Infinity;
        for (const m of moves) {
            best = Math.max(best, minimaxAB(makeMove(board, m, ai), false, ai, alpha, beta));
            alpha = Math.max(alpha, best);
            if (beta <= alpha) break;
        }
        return best;
    } else {
        let best = Infinity;
        for (const m of moves) {
            best = Math.min(best, minimaxAB(makeMove(board, m, opponent(ai)), true, ai, alpha, beta));
            beta = Math.min(beta, best);
            if (beta <= alpha) break;
        }
        return best;
    }
}
