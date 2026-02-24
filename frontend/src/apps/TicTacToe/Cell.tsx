import React from 'react';
import type { CellValue } from './gameEngine';

interface CellProps {
    value: CellValue;
    index: number;
    isWinning: boolean;
    disabled: boolean;
    onClick: (index: number) => void;
}

export const Cell: React.FC<CellProps> = ({ value, index, isWinning, disabled, onClick }) => {
    return (
        <button
            onClick={() => !disabled && onClick(index)}
            disabled={disabled}
            className={`
                w-[88px] h-[88px] rounded-xl flex items-center justify-center
                text-4xl font-black select-none transition-all duration-200
                ${isWinning ? 'ttt-winner-cell' : ''}
                ${!value && !disabled
                    ? 'bg-white/70 dark:bg-slate-800/70 hover:bg-blue-50 dark:hover:bg-slate-700 hover:scale-105 cursor-pointer shadow-sm'
                    : 'bg-white/50 dark:bg-slate-800/50 shadow-sm'
                }
                ${disabled && !value ? 'cursor-not-allowed opacity-70' : ''}
            `}
        >
            {value && (
                <span
                    className={`ttt-cell-pop ${value === 'X'
                            ? 'text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]'
                            : 'text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]'
                        }`}
                >
                    {value}
                </span>
            )}
        </button>
    );
};
