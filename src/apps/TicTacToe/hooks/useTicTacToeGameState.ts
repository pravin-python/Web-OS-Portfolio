import { useState } from "react";
import type { Board, Player, WinResult } from "../gameEngine";
import { createBoard } from "../gameEngine";
import type { Difficulty } from "../aiEngine";

export type GameMode = "single" | "double";
export type GameStatus = "playing" | "won" | "draw";

export function useTicTacToeGameState() {
  const [board, setBoard] = useState<Board>(createBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [mode, setModeState] = useState<GameMode>("single");
  const [difficulty, setDiffState] = useState<Difficulty>("hard");
  const [playerSymbol, setPlayerSym] = useState<Player>("X");
  const [winResult, setWinResult] = useState<WinResult | null>(null);
  const [gameStatus, setGameStatus] = useState<GameStatus>("playing");
  const [aiThinking, setAiThinking] = useState(false);

  return {
    board,
    setBoard,
    currentPlayer,
    setCurrentPlayer,
    mode,
    setModeState,
    difficulty,
    setDiffState,
    playerSymbol,
    setPlayerSym,
    winResult,
    setWinResult,
    gameStatus,
    setGameStatus,
    aiThinking,
    setAiThinking,
  };
}
