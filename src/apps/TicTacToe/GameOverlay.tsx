import React from "react";
import type { WinResult } from "./gameEngine";
import type { GameMode, GameStatus } from "./useTicTacToe";

interface GameOverlayProps {
  gameStatus: GameStatus;
  winResult: WinResult | null;
  mode: GameMode;
  playerSymbol: string;
  onPlayAgain: () => void;
}

export const GameOverlay: React.FC<GameOverlayProps> = ({
  gameStatus,
  winResult,
  mode,
  playerSymbol,
  onPlayAgain,
}) => {
  if (gameStatus === "playing") return null;

  let emoji = "🤝";
  let title = "Draw!";
  let subtitle = "Well played — nobody wins";

  if (gameStatus === "won" && winResult) {
    const w = winResult.winner;
    if (mode === "single") {
      if (w === playerSymbol) {
        emoji = "🎉";
        title = "You Won!";
        subtitle = "Impressive moves!";
      } else {
        emoji = "🤖";
        title = "AI Won";
        subtitle = "Better luck next time";
      }
    } else {
      emoji = "🏆";
      title = `Player ${w} Wins!`;
      subtitle = "Great game!";
    }
  }

  return (
    <div className="ttt-overlay absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/60 dark:bg-slate-900/70 backdrop-blur-sm rounded-xl">
      <span className="text-6xl ttt-result-icon mb-3">{emoji}</span>
      <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-1">
        {title}
      </h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        {subtitle}
      </p>
      <button
        onClick={onPlayAgain}
        className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-lg shadow-md transition-all active:scale-[0.97]"
      >
        Play Again
      </button>
    </div>
  );
};
