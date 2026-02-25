import React from "react";
import type { Scores } from "./useTicTacToe";
import type { GameMode } from "./useTicTacToe";

interface ScorePanelProps {
  scores: Scores;
  mode: GameMode;
  playerSymbol: string;
}

export const ScorePanel: React.FC<ScorePanelProps> = ({
  scores,
  mode,
  playerSymbol,
}) => {
  const xLabel =
    mode === "single" ? (playerSymbol === "X" ? "You" : "AI") : "Player X";
  const oLabel =
    mode === "single" ? (playerSymbol === "O" ? "You" : "AI") : "Player O";

  return (
    <div className="flex items-center justify-center space-x-6 py-2 px-4">
      <ScoreItem label={xLabel} value={scores.x} color="text-blue-500" />
      <div className="w-px h-8 bg-slate-300 dark:bg-slate-600" />
      <ScoreItem label="Draws" value={scores.draws} color="text-slate-400" />
      <div className="w-px h-8 bg-slate-300 dark:bg-slate-600" />
      <ScoreItem label={oLabel} value={scores.o} color="text-rose-500" />
    </div>
  );
};

const ScoreItem: React.FC<{ label: string; value: number; color: string }> = ({
  label,
  value,
  color,
}) => (
  <div className="flex flex-col items-center min-w-[48px]">
    <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
      {label}
    </span>
    <span className={`text-xl font-bold font-mono ${color}`}>{value}</span>
  </div>
);
