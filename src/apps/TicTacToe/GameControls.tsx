import React from 'react';
import { RotateCcw, Trash2 } from 'lucide-react';
import type { GameMode } from './useTicTacToe';
import type { Difficulty } from './aiEngine';
import type { Player } from './gameEngine';

interface GameControlsProps {
    mode: GameMode;
    difficulty: Difficulty;
    playerSymbol: Player;
    onModeChange: (m: GameMode) => void;
    onDifficultyChange: (d: Difficulty) => void;
    onSymbolChange: (s: Player) => void;
    onNewGame: () => void;
    onResetScore: () => void;
}

const DIFFS: { key: Difficulty; label: string }[] = [
    { key: 'easy', label: 'Easy' },
    { key: 'medium', label: 'Medium' },
    { key: 'hard', label: 'Hard' },
    { key: 'expert', label: 'Expert' },
];

export const GameControls: React.FC<GameControlsProps> = ({
    mode, difficulty, playerSymbol,
    onModeChange, onDifficultyChange, onSymbolChange,
    onNewGame, onResetScore,
}) => {
    return (
        <div className="flex flex-col items-center space-y-3 w-full max-w-xs mx-auto">
            {/* Mode Switch */}
            <div className="flex rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 w-full">
                <ModeBtn active={mode === 'single'} onClick={() => onModeChange('single')}>🤖 vs AI</ModeBtn>
                <ModeBtn active={mode === 'double'} onClick={() => onModeChange('double')}>👥 2 Player</ModeBtn>
            </div>

            {/* Difficulty (single only) */}
            {mode === 'single' && (
                <div className="flex rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 w-full">
                    {DIFFS.map(d => (
                        <button
                            key={d.key}
                            onClick={() => onDifficultyChange(d.key)}
                            className={`flex-1 text-[11px] font-semibold py-1.5 transition-all ${difficulty === d.key
                                    ? 'bg-indigo-500 text-white'
                                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                                }`}
                        >
                            {d.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Symbol picker (single only) */}
            {mode === 'single' && (
                <div className="flex items-center space-x-2 text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Play as:</span>
                    <button
                        onClick={() => onSymbolChange('X')}
                        className={`px-3 py-1 rounded-md font-bold transition-all ${playerSymbol === 'X'
                                ? 'bg-blue-500 text-white shadow-sm'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                            }`}
                    >X</button>
                    <button
                        onClick={() => onSymbolChange('O')}
                        className={`px-3 py-1 rounded-md font-bold transition-all ${playerSymbol === 'O'
                                ? 'bg-rose-500 text-white shadow-sm'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                            }`}
                    >O</button>
                </div>
            )}

            {/* Action buttons */}
            <div className="flex space-x-2 w-full">
                <button
                    onClick={onNewGame}
                    className="flex-1 flex items-center justify-center space-x-1.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-all active:scale-[0.97] shadow-sm"
                >
                    <RotateCcw size={14} />
                    <span>New Game</span>
                </button>
                <button
                    onClick={onResetScore}
                    className="flex items-center justify-center space-x-1.5 py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs font-medium rounded-lg transition-all active:scale-[0.97]"
                >
                    <Trash2 size={14} />
                    <span>Reset</span>
                </button>
            </div>
        </div>
    );
};

const ModeBtn: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`flex-1 text-xs font-semibold py-2 transition-all ${active
                ? 'bg-indigo-500 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
    >
        {children}
    </button>
);
