import React, { useState, useEffect, useCallback } from 'react';

type Board = number[][];

const BOARD_SIZE = 4;

export const TwentyFortyEight: React.FC = () => {
    const [board, setBoard] = useState<Board>(() => getEmptyBoard());
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    const initializeGame = useCallback(() => {
        let newBoard = getEmptyBoard();
        newBoard = addRandomTile(newBoard);
        newBoard = addRandomTile(newBoard);
        setBoard(newBoard);
        setScore(0);
        setGameOver(false);
    }, []);

    useEffect(() => {
        initializeGame();
    }, [initializeGame]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (gameOver) return;

            let newBoard = [...board.map(row => [...row])];
            let moved = false;
            let currentScore = score;

            if (e.key === 'ArrowUp') {
                [newBoard, moved, currentScore] = moveUp(newBoard, currentScore);
            } else if (e.key === 'ArrowDown') {
                [newBoard, moved, currentScore] = moveDown(newBoard, currentScore);
            } else if (e.key === 'ArrowLeft') {
                [newBoard, moved, currentScore] = moveLeft(newBoard, currentScore);
            } else if (e.key === 'ArrowRight') {
                [newBoard, moved, currentScore] = moveRight(newBoard, currentScore);
            }

            if (moved) {
                newBoard = addRandomTile(newBoard);
                setBoard(newBoard);
                setScore(currentScore);
                if (checkGameOver(newBoard)) {
                    setGameOver(true);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [board, score, gameOver]);

    return (
        <div className="flex flex-col items-center justify-center p-4 h-full bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 pt-8 pb-8 overflow-y-auto">
            <div className="flex justify-between items-center w-full max-w-xs mb-4">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">2048</h1>
                <div className="bg-slate-300 dark:bg-slate-700 rounded p-2 text-center min-w-[80px]">
                    <div className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400">Score</div>
                    <div className="font-bold">{score}</div>
                </div>
            </div>

            <div className="bg-slate-300 dark:bg-slate-700 p-2 rounded-lg relative touch-none">
                {gameOver && (
                    <div className="absolute inset-0 bg-black/60 z-10 rounded-lg flex flex-col items-center justify-center backdrop-blur-sm">
                        <div className="text-3xl font-bold text-white mb-4">Game Over!</div>
                        <button
                            onClick={initializeGame}
                            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-full transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-4 gap-2">
                    {board.map((row, i) =>
                        row.map((cell, j) => (
                            <div
                                key={`${i}-${j}`}
                                className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center text-xl sm:text-2xl font-bold rounded-md ${getTileColor(cell)}`}
                            >
                                {cell !== 0 ? cell : ''}
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
                <p>Use arrow keys to move tiles.</p>
                <p>Tiles with the same number merge into one!</p>
            </div>
        </div>
    );
};

// --- Game Logic ---

function getEmptyBoard(): Board {
    return Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(0));
}

function addRandomTile(board: Board): Board {
    const emptyCells: { r: number, c: number }[] = [];
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            if (board[r][c] === 0) {
                emptyCells.push({ r, c });
            }
        }
    }

    if (emptyCells.length > 0) {
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const newBoard = [...board];
        newBoard[randomCell.r][randomCell.c] = Math.random() < 0.9 ? 2 : 4;
        return newBoard;
    }
    return board;
}

function moveLeft(board: Board, score: number): [Board, boolean, number] {
    let moved = false;
    let newScore = score;
    const newBoard = board.map(row => {
        let newRow = row.filter(val => val !== 0);
        for (let i = 0; i < newRow.length - 1; i++) {
            if (newRow[i] === newRow[i + 1]) {
                newRow[i] *= 2;
                newScore += newRow[i];
                newRow.splice(i + 1, 1);
                moved = true;
            }
        }
        while (newRow.length < BOARD_SIZE) newRow.push(0);
        if (newRow.join(',') !== row.join(',')) moved = true;
        return newRow;
    });
    return [newBoard, moved, newScore];
}

function moveRight(board: Board, score: number): [Board, boolean, number] {
    const reversedBoard = board.map(row => [...row].reverse());
    const [newReversed, moved, newScore] = moveLeft(reversedBoard, score);
    const newBoard = newReversed.map(row => row.reverse());
    return [newBoard, moved, newScore];
}

function transpose(board: Board): Board {
    return board[0].map((_, colIndex) => board.map(row => row[colIndex]));
}

function moveUp(board: Board, score: number): [Board, boolean, number] {
    const transposed = transpose(board);
    const [newTransposed, moved, newScore] = moveLeft(transposed, score);
    const newBoard = transpose(newTransposed);
    return [newBoard, moved, newScore];
}

function moveDown(board: Board, score: number): [Board, boolean, number] {
    const transposed = transpose(board);
    const [newTransposed, moved, newScore] = moveRight(transposed, score);
    const newBoard = transpose(newTransposed);
    return [newBoard, moved, newScore];
}

function checkGameOver(board: Board): boolean {
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            if (board[r][c] === 0) return false;
            if (r < BOARD_SIZE - 1 && board[r][c] === board[r + 1][c]) return false;
            if (c < BOARD_SIZE - 1 && board[r][c] === board[r][c + 1]) return false;
        }
    }
    return true;
}

function getTileColor(value: number): string {
    const colors: Record<number, string> = {
        0: 'bg-slate-200 dark:bg-slate-600',
        2: 'bg-stone-200 text-stone-800',
        4: 'bg-stone-300 text-stone-800',
        8: 'bg-orange-300 text-white',
        16: 'bg-orange-400 text-white',
        32: 'bg-orange-500 text-white',
        64: 'bg-red-500 text-white',
        128: 'bg-yellow-400 text-white shadow-[0_0_10px_#facc15]',
        256: 'bg-yellow-500 text-white shadow-[0_0_15px_#eab308]',
        512: 'bg-yellow-600 text-white shadow-[0_0_20px_#ca8a04]',
        1024: 'bg-amber-400 text-white shadow-[0_0_30px_#fbbf24]',
        2048: 'bg-amber-500 text-white shadow-[0_0_40px_#f59e0b] animate-pulse',
    };
    return colors[value] || 'bg-slate-800 text-white text-sm';
}
