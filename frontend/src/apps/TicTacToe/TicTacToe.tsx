import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';

type Player = 'X' | 'O' | null;

export const TicTacToe: React.FC = () => {
    const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(true);

    const calculateWinner = (squares: Player[]) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
            [0, 4, 8], [2, 4, 6]             // diagonals
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return null;
    };

    const winner = calculateWinner(board);
    const isDraw = !winner && board.every(square => square !== null);

    const handleClick = (i: number) => {
        if (board[i] || winner) return;
        const newBoard = [...board];
        newBoard[i] = xIsNext ? 'X' : 'O';
        setBoard(newBoard);
        setXIsNext(!xIsNext);
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setXIsNext(true);
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 h-full bg-slate-50 dark:bg-slate-900 font-sans">
            <div className="mb-6 text-xl font-bold text-slate-800 dark:text-slate-200">
                {winner ? `Winner: ${winner}` : isDraw ? 'Draw!' : `Next Player: ${xIsNext ? 'X' : 'O'}`}
            </div>

            <div className="grid grid-cols-3 gap-2 bg-slate-300 dark:bg-slate-700 p-2 rounded-lg shadow-inner">
                {board.map((cell, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleClick(idx)}
                        className="w-20 h-20 bg-white dark:bg-slate-800 rounded flex items-center justify-center text-4xl font-bold text-blue-600 dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                    >
                        {cell}
                    </button>
                ))}
            </div>

            <button
                onClick={resetGame}
                className="mt-8 flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full shadow transition-transform active:scale-95"
            >
                <RotateCcw size={18} />
                <span>Restart Game</span>
            </button>
        </div>
    );
};
