/**
 * useTicTacToe — React hook that owns the full game state machine.
 *
 * Manages: board, turns, mode, difficulty, scores (localStorage),
 *          AI turn lock, game-over detection, notifications.
 */

import { useCallback, useRef, useEffect } from "react";
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
import {
  useTicTacToeGameState,
  useTicTacToeScores,
  useTicTacToeNotifications,
} from "./hooks";
import type { GameMode, GameStatus } from "./hooks";

export type { GameMode, GameStatus };
export type { Scores } from "./hooks/useTicTacToeScores";
export type { Notification } from "./hooks/useTicTacToeNotifications";

export function useGameNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

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

  return { notifications, notify };
}

export function useTicTacToe() {
  const { notifications, notify } = useTicTacToeNotifications();
  const { scores, updateScores, resetScore } = useTicTacToeScores(notify);
  const {
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
  } = useTicTacToeGameState();

  const addGlobalNotification = useNotificationStore(
    (state) => state.addNotification,
  );

  const aiLock = useRef(false);

  // ── helpers ──────────────────────────────────────────────────

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
    [mode, playerSymbol, notify, updateScores, addGlobalNotification, setWinResult, setGameStatus],
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
    [difficulty, finishGame, setAiThinking, setBoard, setCurrentPlayer],
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
      setBoard,
      setCurrentPlayer,
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
  }, [mode, playerSymbol, notify, doAITurn, setBoard, setWinResult, setGameStatus, setCurrentPlayer, setAiThinking]);

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
    [notify, setModeState, setBoard, setWinResult, setGameStatus, setCurrentPlayer, setAiThinking],
  );

  const setDifficulty = useCallback(
    (d: Difficulty) => {
      setDiffState(d);
      notify(
        `Difficulty: ${d.charAt(0).toUpperCase() + d.slice(1)} ⚙️`,
        "info",
      );
    },
    [notify, setDiffState],
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
    [mode, doAITurn, setPlayerSym, setBoard, setWinResult, setGameStatus, setCurrentPlayer, setAiThinking],
  );

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
