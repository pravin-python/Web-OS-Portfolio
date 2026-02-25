/**
 * TicTacToe — Pure game logic (no React dependencies).
 */

export type CellValue = 'X' | 'O' | null;
export type Board = CellValue[];
export type Player = 'X' | 'O';

export interface WinResult {
    winner: Player;
    line: number[];           // indices of the 3 winning cells
}

const WIN_LINES: number[][] = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],   // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8],   // cols
    [0, 4, 8], [2, 4, 6],              // diagonals
];

/** Create a fresh 3×3 board */
export function createBoard(): Board {
    return Array(9).fill(null);
}

/** Place a mark on the board (returns new board, pure) */
export function makeMove(board: Board, index: number, player: Player): Board {
    if (board[index] !== null) return board;   // occupied
    const next = [...board];
    next[index] = player;
    return next;
}

/** Check for a winner — returns WinResult or null */
export function checkWinner(board: Board): WinResult | null {
    for (const line of WIN_LINES) {
        const [a, b, c] = line;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return { winner: board[a] as Player, line };
        }
    }
    return null;
}

/** True when every cell is filled and no winner */
export function isDraw(board: Board): boolean {
    return !checkWinner(board) && board.every(c => c !== null);
}

/** Return indices of all empty cells */
export function getAvailableMoves(board: Board): number[] {
    return board.reduce<number[]>((acc, cell, i) => {
        if (cell === null) acc.push(i);
        return acc;
    }, []);
}

/** Toggle player */
export function opponent(player: Player): Player {
    return player === 'X' ? 'O' : 'X';
}
