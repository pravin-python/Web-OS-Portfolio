/* ═══════════════════════════════════════════════════
   2048 Game Engine — Pure Logic, Zero React
   ═══════════════════════════════════════════════════ */

export const BOARD_SIZE = 4;

let nextTileId = 1;

/* ─── Types ─── */
export interface TileData {
  id: number;
  value: number;
  row: number;
  col: number;
  isNew?: boolean;
  mergedFrom?: [number, number];
}

export type Board = (TileData | null)[][];

export type Direction = "up" | "down" | "left" | "right";

export interface MoveResult {
  board: Board;
  scoreGained: number;
  moved: boolean;
}

/* ─── Board Creation ─── */
export function createEmptyBoard(): Board {
  const board: Board = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    board[r] = [];
    for (let c = 0; c < BOARD_SIZE; c++) {
      board[r][c] = null;
    }
  }
  return board;
}

export function cloneBoard(board: Board): Board {
  return board.map((row) => row.map((tile) => (tile ? { ...tile } : null)));
}

/* ─── Tile Spawning ─── */
export function getEmptyCells(board: Board): { r: number; c: number }[] {
  const cells: { r: number; c: number }[] = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] === null) cells.push({ r, c });
    }
  }
  return cells;
}

export function spawnTile(board: Board): Board {
  const empty = getEmptyCells(board);
  if (empty.length === 0) return board;

  const newBoard = cloneBoard(board);
  const cell = empty[Math.floor(Math.random() * empty.length)];
  const value = Math.random() < 0.9 ? 2 : 4;
  newBoard[cell.r][cell.c] = {
    id: nextTileId++,
    value,
    row: cell.r,
    col: cell.c,
    isNew: true,
  };
  return newBoard;
}

/* ─── Movement ─── */

/**
 * Slides and merges a single line towards index 0.
 * Returns { line, scored }.
 * Each tile merges at most once per move.
 */
function slideLine(line: (TileData | null)[]): {
  result: (TileData | null)[];
  scored: number;
} {
  const tiles = line.filter((t): t is TileData => t !== null);
  const result: (TileData | null)[] = [];
  let scored = 0;
  let i = 0;

  while (i < tiles.length) {
    if (i + 1 < tiles.length && tiles[i].value === tiles[i + 1].value) {
      const mergedValue = tiles[i].value * 2;
      result.push({
        id: nextTileId++,
        value: mergedValue,
        row: 0,
        col: 0,
        mergedFrom: [tiles[i].id, tiles[i + 1].id],
      });
      scored += mergedValue;
      i += 2;
    } else {
      result.push({ ...tiles[i] });
      i += 1;
    }
  }

  while (result.length < BOARD_SIZE) {
    result.push(null);
  }

  return { result, scored };
}

/**
 * Move left: each row slides left.
 */
function moveLeft(board: Board): MoveResult {
  const newBoard = createEmptyBoard();
  let totalScored = 0;

  for (let r = 0; r < BOARD_SIZE; r++) {
    const row = board[r];
    const { result, scored } = slideLine(row);
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (result[c]) {
        result[c]!.row = r;
        result[c]!.col = c;
      }
      newBoard[r][c] = result[c];
    }
    totalScored += scored;
  }

  return {
    board: newBoard,
    scoreGained: totalScored,
    moved: !boardsEqual(board, newBoard),
  };
}

/**
 * Move right: reverse each row, slide left, reverse back.
 */
function moveRight(board: Board): MoveResult {
  const newBoard = createEmptyBoard();
  let totalScored = 0;

  for (let r = 0; r < BOARD_SIZE; r++) {
    const row = [...board[r]].reverse();
    const { result, scored } = slideLine(row);
    const reversed = result.reverse();
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (reversed[c]) {
        reversed[c]!.row = r;
        reversed[c]!.col = c;
      }
      newBoard[r][c] = reversed[c];
    }
    totalScored += scored;
  }

  return {
    board: newBoard,
    scoreGained: totalScored,
    moved: !boardsEqual(board, newBoard),
  };
}

/**
 * Move up: treat each column as a row, slide left.
 */
function moveUp(board: Board): MoveResult {
  const newBoard = createEmptyBoard();
  let totalScored = 0;

  for (let c = 0; c < BOARD_SIZE; c++) {
    // Extract column top-to-bottom
    const col: (TileData | null)[] = [];
    for (let r = 0; r < BOARD_SIZE; r++) {
      col.push(board[r][c]);
    }
    const { result, scored } = slideLine(col);
    for (let r = 0; r < BOARD_SIZE; r++) {
      if (result[r]) {
        result[r]!.row = r;
        result[r]!.col = c;
      }
      newBoard[r][c] = result[r];
    }
    totalScored += scored;
  }

  return {
    board: newBoard,
    scoreGained: totalScored,
    moved: !boardsEqual(board, newBoard),
  };
}

/**
 * Move down: treat each column bottom-to-top as a row, slide left, reverse.
 */
function moveDown(board: Board): MoveResult {
  const newBoard = createEmptyBoard();
  let totalScored = 0;

  for (let c = 0; c < BOARD_SIZE; c++) {
    // Extract column bottom-to-top
    const col: (TileData | null)[] = [];
    for (let r = BOARD_SIZE - 1; r >= 0; r--) {
      col.push(board[r][c]);
    }
    const { result, scored } = slideLine(col);
    // Place back bottom-to-top
    for (let i = 0; i < BOARD_SIZE; i++) {
      const r = BOARD_SIZE - 1 - i;
      if (result[i]) {
        result[i]!.row = r;
        result[i]!.col = c;
      }
      newBoard[r][c] = result[i];
    }
    totalScored += scored;
  }

  return {
    board: newBoard,
    scoreGained: totalScored,
    moved: !boardsEqual(board, newBoard),
  };
}

/**
 * Dispatch move in the given direction.
 */
export function move(board: Board, direction: Direction): MoveResult {
  switch (direction) {
    case "left":
      return moveLeft(board);
    case "right":
      return moveRight(board);
    case "up":
      return moveUp(board);
    case "down":
      return moveDown(board);
  }
}

function boardsEqual(a: Board, b: Board): boolean {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const ta = a[r][c];
      const tb = b[r][c];
      if (ta === null && tb === null) continue;
      if (ta === null || tb === null) return false;
      if (ta.value !== tb.value) return false;
    }
  }
  return true;
}

/* ─── Win / Game Over Checks ─── */
export function hasWon(board: Board): boolean {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] && board[r][c]!.value >= 2048) return true;
    }
  }
  return false;
}

export function canMove(board: Board): boolean {
  if (getEmptyCells(board).length > 0) return true;

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const val = board[r][c]?.value;
      if (val === undefined) continue;
      if (r < BOARD_SIZE - 1 && board[r + 1][c]?.value === val) return true;
      if (c < BOARD_SIZE - 1 && board[r][c + 1]?.value === val) return true;
    }
  }
  return false;
}

/* ─── Get all tiles as flat array (for rendering) ─── */
export function getTiles(board: Board): TileData[] {
  const tiles: TileData[] = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c]) tiles.push(board[r][c]!);
    }
  }
  return tiles;
}

/* ─── Initialize a new game ─── */
export function initGame(): Board {
  nextTileId = 1;
  let board = createEmptyBoard();
  board = spawnTile(board);
  board = spawnTile(board);
  return board;
}

/* ─── Clear new/merged flags (call after animation) ─── */
export function clearFlags(board: Board): Board {
  return board.map((row) =>
    row.map((tile) => {
      if (!tile) return null;
      return { ...tile, isNew: false, mergedFrom: undefined };
    }),
  );
}
