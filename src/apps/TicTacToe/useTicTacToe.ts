/**
 * useTicTacToe — React hook that owns the full game state machine.
 *
 * Manages: board, turns, mode, difficulty, scores (localStorage),
 *          AI turn lock, game-over detection, notifications.
 */

import { useState, useCallback, useRef, useEffect } from "react";
import type { Board, Player, WinResult } from "./gameEngine";
import {
  createBoard,
  makeMove as engineMove,
  checkWinner,
  isDraw,
  opponent,
} from "./gameEngine";
import { getAIMove } from "./aiEngine";
import type { Difficulty } from "./aiEngine";
import { useNotificationStore } from "../../core/state/useNotificationStore";

export type GameMode = "single" | "double";
export type GameStatus = "playing" | "won" | "draw";

export interface Scores {
  x: number;
  o: number;
  draws: number;
}

export interface Notification {
  id: number;
  text: string;
  type: "info" | "success" | "warning";
}

const STORAGE_KEY = "webos.tictactoe.score";

function loadScores(): Scores {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return { x: 0, o: 0, draws: 0 };
}

function saveScores(s: Scores) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

let notifId = 0;

export function useTicTacToe() {
  const [board, setBoard] = useState<Board>(createBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [mode, setModeState] = useState<GameMode>("single");
  const [difficulty, setDiffState] = useState<Difficulty>("hard");
  const [playerSymbol, setPlayerSym] = useState<Player>("X");
  const [scores, setScores] = useState<Scores>(loadScores);
  const [winResult, setWinResult] = useState<WinResult | null>(null);
  const [gameStatus, setGameStatus] = useState<GameStatus>("playing");
  const [aiThinking, setAiThinking] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addGlobalNotification = useNotificationStore(
    (state) => state.addNotification,
  );

  const aiLock = useRef(false);

  // ── helpers ──────────────────────────────────────────────────

  const notify = useCallback(
    (text: string, type: Notification["type"] = "info") => {
      const id = ++notifId;
      setNotifications((prev) => [...prev, { id, text, type }]);
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 3000);
    },
    [],
  );

  const updateScores = useCallback((key: "x" | "o" | "draws") => {
    setScores((prev) => {
      const next = { ...prev, [key]: prev[key] + 1 };
      saveScores(next);
      return next;
    });
  }, []);

  const finishGame = useCallback(
    (result: WinResult | null) => {
      if (result) {
        setWinResult(result);
        setGameStatus("won");
        updateScores(result.winner === "X" ? "x" : "o");

        if (mode === "single") {
          const won = result.winner === playerSymbol;
          notify(
            won ? "You Won! 🎉" : "AI Won 🤖",
            won ? "success" : "warning",
          );
          addGlobalNotification(
            won ? "TicTacToe Victory" : "TicTacToe Defeat",
            won
              ? "You beat the AI opponent! Great algorithmic thinking."
              : "You lost to the AI opponent.",
            won ? "success" : "warning",
            "TicTacToe",
          );
        } else {
          notify(`Player ${result.winner} Wins! 🎉`, "success");
          addGlobalNotification(
            "TicTacToe Match Over",
            `Player ${result.winner} won the local multiplayer match.`,
            "success",
            "TicTacToe",
          );
        }
      } else {
        setGameStatus("draw");
        updateScores("draws");
        notify("Match Drawn 🤝", "info");
        addGlobalNotification(
          "TicTacToe Draw",
          "The match ended in a draw.",
          "info",
          "TicTacToe",
        );
      }
    },
    [mode, playerSymbol, notify, updateScores, addGlobalNotification],
  );

  // ── AI turn ──────────────────────────────────────────────────

  const doAITurn = useCallback(
    async (currentBoard: Board, aiPlayer: Player) => {
      if (aiLock.current) return;
      aiLock.current = true;
      setAiThinking(true);

      try {
        const move = await getAIMove(currentBoard, aiPlayer, difficulty);
        const nextBoard = engineMove(currentBoard, move, aiPlayer);
        setBoard(nextBoard);

        const win = checkWinner(nextBoard);
        if (win) {
          finishGame(win);
        } else if (isDraw(nextBoard)) {
          finishGame(null);
        } else {
          setCurrentPlayer(opponent(aiPlayer));
        }
      } finally {
        setAiThinking(false);
        aiLock.current = false;
      }
    },
    [difficulty, finishGame],
  );

  // ── human move ───────────────────────────────────────────────

  const humanMove = useCallback(
    (index: number) => {
      if (gameStatus !== "playing") return;
      if (aiThinking) return;
      if (board[index] !== null) return;

      const nextBoard = engineMove(board, index, currentPlayer);
      setBoard(nextBoard);

      const win = checkWinner(nextBoard);
      if (win) {
        finishGame(win);
        return;
      }
      if (isDraw(nextBoard)) {
        finishGame(null);
        return;
      }

      const nextPlayer = opponent(currentPlayer);
      setCurrentPlayer(nextPlayer);

      // If single-player and it's now AI's turn
      if (mode === "single" && nextPlayer !== playerSymbol) {
        doAITurn(nextBoard, nextPlayer);
      }
    },
    [
      board,
      currentPlayer,
      gameStatus,
      aiThinking,
      mode,
      playerSymbol,
      finishGame,
      doAITurn,
    ],
  );

  // ── new game ─────────────────────────────────────────────────

  const newGame = useCallback(() => {
    setBoard(createBoard());
    setWinResult(null);
    setGameStatus("playing");
    setCurrentPlayer("X");
    aiLock.current = false;
    setAiThinking(false);
    notify("New Game Started 🎮", "info");

    // If AI goes first in single mode
    if (mode === "single" && playerSymbol !== "X") {
      const aiPlayer: Player = "X";
      // small delay so UI renders first
      setTimeout(() => doAITurn(createBoard(), aiPlayer), 200);
    }
  }, [mode, playerSymbol, notify, doAITurn]);

  // ── settings ─────────────────────────────────────────────────

  const setMode = useCallback(
    (m: GameMode) => {
      setModeState(m);
      setBoard(createBoard());
      setWinResult(null);
      setGameStatus("playing");
      setCurrentPlayer("X");
      aiLock.current = false;
      setAiThinking(false);
      notify(
        m === "single" ? "Single Player Mode 🤖" : "Double Player Mode 👥",
        "info",
      );
    },
    [notify],
  );

  const setDifficulty = useCallback(
    (d: Difficulty) => {
      setDiffState(d);
      notify(
        `Difficulty: ${d.charAt(0).toUpperCase() + d.slice(1)} ⚙️`,
        "info",
      );
    },
    [notify],
  );

  const setPlayerSymbol = useCallback(
    (s: Player) => {
      setPlayerSym(s);
      // restart game when symbol changes
      setBoard(createBoard());
      setWinResult(null);
      setGameStatus("playing");
      setCurrentPlayer("X");
      aiLock.current = false;
      setAiThinking(false);

      if (mode === "single" && s !== "X") {
        setTimeout(() => doAITurn(createBoard(), "X"), 200);
      }
    },
    [mode, doAITurn],
  );

  const resetScore = useCallback(() => {
    const empty = { x: 0, o: 0, draws: 0 };
    setScores(empty);
    saveScores(empty);
    notify("Scores Reset 🔄", "info");
  }, [notify]);

  // ── initial AI move if AI is X ───────────────────────────────
  const initialised = useRef(false);
  useEffect(() => {
    if (initialised.current) return;
    initialised.current = true;
    if (mode === "single" && playerSymbol !== "X") {
      doAITurn(createBoard(), "X");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    board,
    currentPlayer,
    mode,
    difficulty,
    playerSymbol,
    scores,
    winResult,
    gameStatus,
    aiThinking,
    notifications,
    humanMove,
    newGame,
    setMode,
    setDifficulty,
    setPlayerSymbol,
    resetScore,
  };
}
