import React from "react";
import { Cell } from "./Cell";
import type { Board as BoardType, WinResult } from "./gameEngine";

interface BoardProps {
  board: BoardType;
  winResult: WinResult | null;
  disabled: boolean;
  onCellClick: (index: number) => void;
}

export const Board: React.FC<BoardProps> = ({
  board,
  winResult,
  disabled,
  onCellClick,
}) => {
  const winningCells = new Set(winResult?.line ?? []);

  return (
    <div className="ttt-board grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-gradient-to-br from-indigo-100/50 to-purple-100/50 dark:from-slate-800/80 dark:to-slate-700/60 border border-indigo-200/30 dark:border-slate-600/30">
      {board.map((cell, idx) => (
        <Cell
          key={idx}
          value={cell}
          index={idx}
          isWinning={winningCells.has(idx)}
          disabled={disabled || cell !== null}
          onClick={onCellClick}
        />
      ))}
    </div>
  );
};
