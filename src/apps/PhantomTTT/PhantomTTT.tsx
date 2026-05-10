import React, { useState, useCallback, useEffect, useRef } from "react";
import type { WindowInstance } from "../../core/state/useWindowStore";
import "./PhantomTTT.css";

/* ═══════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════ */
type Cell = "O" | "X" | null;
type GameMode = "pvp" | "ai";
type AIDifficulty = "easy" | "medium" | "hard";
type Phase = "idle" | "playing" | "gameover";

interface GameState {
  board: Cell[];
  oQueue: number[]; // O's placed cells, oldest → newest
  xQueue: number[]; // X's placed cells, oldest → newest
  current: "O" | "X";
}

/* ═══════════════════════════════════════════════════
   Constants
   ═══════════════════════════════════════════════════ */
const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const MAX_PIECES = 3;

// Cell coordinate labels matching board positions
const CELL_LABELS = ["a1", "b1", "c1", "a2", "b2", "c2", "a3", "b3", "c3"];

/* ═══════════════════════════════════════════════════
   Game Logic
   ═══════════════════════════════════════════════════ */
function checkWinner(board: Cell[]): [Cell, number[]] {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      return [board[a], line];
    }
  }
  return [null, []];
}

function applyMove(state: GameState, cellIndex: number): GameState {
  const newBoard = [...state.board];
  const oQ = [...state.oQueue];
  const xQ = [...state.xQueue];

  const isO = state.current === "O";
  const queue = isO ? oQ : xQ;

  // Remove oldest piece if already at max
  if (queue.length >= MAX_PIECES) {
    const oldest = queue.shift()!;
    newBoard[oldest] = null;
  }

  newBoard[cellIndex] = state.current;
  queue.push(cellIndex);

  return {
    board: newBoard,
    oQueue: isO ? queue : oQ,
    xQueue: isO ? xQ : queue,
    current: state.current === "O" ? "X" : "O",
  };
}

function getEmptyCells(board: Cell[]): number[] {
  return board.map((c, i) => (c === null ? i : -1)).filter((i) => i !== -1);
}

/* ─── Minimax with alpha-beta pruning ─── */
function minimax(
  state: GameState,
  depth: number,
  isMax: boolean,
  alpha: number,
  beta: number,
  aiMark: "X" | "O",
): number {
  const humanMark: Cell = aiMark === "X" ? "O" : "X";
  const [winner] = checkWinner(state.board);

  if (winner === aiMark) return 100 - depth;
  if (winner === humanMark) return depth - 100;
  if (depth >= 8) return 0; // depth limit for cycle safety

  const empty = getEmptyCells(state.board);
  if (empty.length === 0) return 0;

  if (isMax) {
    let best = -Infinity;
    for (const cell of empty) {
      const next = applyMove(state, cell);
      const score = minimax(next, depth + 1, false, alpha, beta, aiMark);
      best = Math.max(best, score);
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break;
    }
    return best;
  } else {
    let best = Infinity;
    for (const cell of empty) {
      const next = applyMove(state, cell);
      const score = minimax(next, depth + 1, true, alpha, beta, aiMark);
      best = Math.min(best, score);
      beta = Math.min(beta, best);
      if (beta <= alpha) break;
    }
    return best;
  }
}

function getBestMove(
  state: GameState,
  aiMark: "X" | "O",
  difficulty: AIDifficulty,
): number {
  const empty = getEmptyCells(state.board);

  // Easy: mostly random
  if (difficulty === "easy") {
    if (Math.random() < 0.75)
      return empty[Math.floor(Math.random() * empty.length)];
  }
  // Medium: 40% random
  if (difficulty === "medium") {
    if (Math.random() < 0.4)
      return empty[Math.floor(Math.random() * empty.length)];
  }

  let bestScore = -Infinity;
  let bestMove = empty[0];

  for (const cell of empty) {
    const next = applyMove(state, cell);
    const score = minimax(next, 0, false, -Infinity, Infinity, aiMark);
    if (score > bestScore) {
      bestScore = score;
      bestMove = cell;
    }
  }

  return bestMove;
}

/* ═══════════════════════════════════════════════════
   Initial state factory
   ═══════════════════════════════════════════════════ */
function freshState(): GameState {
  return {
    board: Array(9).fill(null),
    oQueue: [],
    xQueue: [],
    current: "O",
  };
}

/* ═══════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════ */
export const PhantomTTT: React.FC<{ window: WindowInstance }> = () => {
  const [mode, setMode] = useState<GameMode>("pvp");
  const [difficulty, setDifficulty] = useState<AIDifficulty>("hard");
  const [phase, setPhase] = useState<Phase>("idle");
  const [gs, setGs] = useState<GameState>(freshState());
  const [winLine, setWinLine] = useState<number[]>([]);
  const [winner, setWinner] = useState<Cell>(null);
  const [scores, setScores] = useState({ O: 0, X: 0 });
  const [lastRemoved, setLastRemoved] = useState<number>(-1);
  const [moveCount, setMoveCount] = useState(0);

  const aiTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ─── Start / Restart ─── */
  const startGame = useCallback(() => {
    if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    setGs(freshState());
    setWinLine([]);
    setWinner(null);
    setLastRemoved(-1);
    setMoveCount(0);
    setPhase("playing");
  }, []);

  const goToMenu = useCallback(() => {
    if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    setPhase("idle");
  }, []);

  /* ─── Resolve a move ─── */
  const resolveMove = useCallback((state: GameState, cellIndex: number) => {
    // Determine which piece will be removed (for animation)
    const queue = state.current === "O" ? state.oQueue : state.xQueue;
    const removedIdx = queue.length >= MAX_PIECES ? queue[0] : -1;

    const next = applyMove(state, cellIndex);
    const [win, line] = checkWinner(next.board);

    setLastRemoved(removedIdx);
    setMoveCount((c) => c + 1);

    if (win) {
      setGs(next);
      setWinner(win);
      setWinLine(line);
      setPhase("gameover");
      setScores((prev) => ({ ...prev, [win]: prev[win as "O" | "X"] + 1 }));
    } else {
      setGs(next);
    }
  }, []);

  /* ─── Human click ─── */
  const handleCellClick = useCallback(
    (idx: number) => {
      if (phase !== "playing") return;
      if (gs.board[idx] !== null) return;
      if (mode === "ai" && gs.current === "X") return; // AI's turn — block human input

      resolveMove(gs, idx);
    },
    [phase, gs, mode, resolveMove],
  );

  /* ─── AI turn effect ─── */
  useEffect(() => {
    if (phase !== "playing") return;
    if (mode !== "ai") return;
    if (gs.current !== "X") return;

    const delay = 350 + Math.random() * 250;

    aiTimerRef.current = setTimeout(() => {
      const move = getBestMove(gs, "X", difficulty);
      resolveMove(gs, move);
    }, delay);

    return () => {
      if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    };
  }, [phase, mode, gs, difficulty, resolveMove]);

  /* ─── Derived values ─── */
  // aiThinking is true whenever it's AI's turn in AI mode — derived, no setState needed
  const aiThinking = phase === "playing" && mode === "ai" && gs.current === "X";
  const oldestO = gs.oQueue.length >= MAX_PIECES ? gs.oQueue[0] : -1;
  const oldestX = gs.xQueue.length >= MAX_PIECES ? gs.xQueue[0] : -1;

  const turnLabel = () => {
    if (phase !== "playing") return "";
    if (aiThinking) return "AI is thinking…";
    if (mode === "ai")
      return gs.current === "O" ? "Your turn (O)" : "AI's turn (X)";
    return `Player ${gs.current === "O" ? "1" : "2"}'s turn (${gs.current})`;
  };

  const winnerLabel = () => {
    if (!winner) return "It's a draw!";
    if (mode === "ai") return winner === "O" ? "You win! 🎉" : "AI wins! 🤖";
    return `Player ${winner === "O" ? "1" : "2"} wins! (${winner}) 🎉`;
  };

  /* ═══════════════════════════════════════════════════
     JSX
     ═══════════════════════════════════════════════════ */
  return (
    <div className="pttt-root">
      {/* ─── Header ─── */}
      <div className="pttt-header">
        <h2 className="pttt-title">PHANTOM TTT</h2>
        <p className="pttt-subtitle">Only 3 moves stay alive on the board</p>
      </div>

      {/* ─── Scoreboard ─── */}
      <div className="pttt-scoreboard">
        <div
          className={`pttt-score-card ${phase === "playing" && gs.current === "O" ? "pttt-active-o" : ""}`}
        >
          <div className="pttt-mark pttt-mark-o">O</div>
          <div className="pttt-player-info">
            <span className="pttt-player-name">
              {mode === "ai" ? "You" : "Player 1"}
            </span>
            <span className="pttt-score-num">{scores.O}</span>
          </div>
          <div className="pttt-piece-tracker">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`pttt-pip pttt-pip-o
                  ${i < gs.oQueue.length ? "pttt-pip-filled" : ""}
                  ${i === 0 && gs.oQueue.length >= MAX_PIECES ? "pttt-pip-warn" : ""}
                `}
              />
            ))}
          </div>
        </div>

        <div className="pttt-vs">VS</div>

        <div
          className={`pttt-score-card ${phase === "playing" && gs.current === "X" ? "pttt-active-x" : ""}`}
        >
          <div className="pttt-mark pttt-mark-x">X</div>
          <div className="pttt-player-info">
            <span className="pttt-player-name">
              {mode === "ai" ? "AI" : "Player 2"}
            </span>
            <span className="pttt-score-num">{scores.X}</span>
          </div>
          <div className="pttt-piece-tracker">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`pttt-pip pttt-pip-x
                  ${i < gs.xQueue.length ? "pttt-pip-filled" : ""}
                  ${i === 0 && gs.xQueue.length >= MAX_PIECES ? "pttt-pip-warn" : ""}
                `}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ─── IDLE: Setup Screen ─── */}
      {phase === "idle" && (
        <div className="pttt-setup">
          <div className="pttt-rule-hint">
            Each player places up to <strong>3 pieces</strong>.<br />
            On your 4th move, your <strong>oldest piece vanishes</strong>.
          </div>

          <div className="pttt-setup-group">
            <span className="pttt-setup-label">Mode</span>
            <div className="pttt-btn-row">
              <button
                className={`pttt-opt-btn ${mode === "pvp" ? "pttt-opt-selected" : ""}`}
                onClick={() => setMode("pvp")}
              >
                👥 2 Players
              </button>
              <button
                className={`pttt-opt-btn ${mode === "ai" ? "pttt-opt-selected" : ""}`}
                onClick={() => setMode("ai")}
              >
                🤖 vs AI
              </button>
            </div>
          </div>

          {mode === "ai" && (
            <div className="pttt-setup-group">
              <span className="pttt-setup-label">Difficulty</span>
              <div className="pttt-btn-row">
                {(["easy", "medium", "hard"] as AIDifficulty[]).map((d) => (
                  <button
                    key={d}
                    className={`pttt-diff-btn pttt-diff-${d} ${difficulty === d ? "pttt-diff-selected" : ""}`}
                    onClick={() => setDifficulty(d)}
                  >
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button className="pttt-start-btn" onClick={startGame}>
            Start Game
          </button>
        </div>
      )}

      {/* ─── PLAYING / GAMEOVER: Board ─── */}
      {phase !== "idle" && (
        <>
          {/* Board */}
          <div className="pttt-board">
            {gs.board.map((cell, i) => {
              const isWin = winLine.includes(i);
              const isOldestO = i === oldestO && phase === "playing";
              const isOldestX = i === oldestX && phase === "playing";
              const wasRemoved = i === lastRemoved;
              const isClickable =
                phase === "playing" &&
                cell === null &&
                !aiThinking &&
                !(mode === "ai" && gs.current === "X");

              return (
                <div
                  key={i}
                  className={[
                    "pttt-cell",
                    cell ? "pttt-cell-filled" : "pttt-cell-empty",
                    cell === "O"
                      ? "pttt-cell-o"
                      : cell === "X"
                        ? "pttt-cell-x"
                        : "",
                    isWin ? "pttt-cell-win" : "",
                    isOldestO ? "pttt-cell-fade-o" : "",
                    isOldestX ? "pttt-cell-fade-x" : "",
                    wasRemoved ? "pttt-cell-removed" : "",
                    isClickable ? "pttt-cell-hover" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => handleCellClick(i)}
                >
                  <span className="pttt-coord">{CELL_LABELS[i]}</span>
                  {cell && <span className="pttt-cell-symbol">{cell}</span>}
                  {(isOldestO || isOldestX) && cell && (
                    <span className="pttt-fade-badge">next</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Status bar */}
          <div className="pttt-status">
            {phase === "playing" && (
              <span
                className={`pttt-turn-text ${aiThinking ? "pttt-thinking" : ""}`}
              >
                {turnLabel()}
              </span>
            )}
            {phase === "gameover" && (
              <span className="pttt-winner-text">{winnerLabel()}</span>
            )}
          </div>

          {/* Move counter */}
          {phase === "playing" && (
            <div className="pttt-move-counter">Move #{moveCount + 1}</div>
          )}

          {/* Game over actions */}
          {phase === "gameover" && (
            <div className="pttt-actions">
              <button className="pttt-again-btn" onClick={startGame}>
                Play Again
              </button>
              <button className="pttt-menu-btn" onClick={goToMenu}>
                Menu
              </button>
            </div>
          )}
        </>
      )}

      {/* ─── Legend ─── */}
      {phase === "playing" && (
        <div className="pttt-legend">
          <span className="pttt-legend-item">
            <span className="pttt-legend-dot warn" /> = will vanish on next move
          </span>
        </div>
      )}
    </div>
  );
};
