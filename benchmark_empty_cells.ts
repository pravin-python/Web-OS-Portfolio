type Cell = "O" | "X" | null;

function getEmptyCellsOriginal(board: Cell[]): number[] {
  return board.map((c, i) => (c === null ? i : -1)).filter((i) => i !== -1);
}

function getEmptyCellsOptimized(board: Cell[]): number[] {
  const result: number[] = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      result.push(i);
    }
  }
  return result;
}

const boards: Cell[][] = [
  [null, null, null, null, null, null, null, null, null],
  ["X", "O", "X", "O", null, "X", "O", null, null],
  ["X", "O", "X", "O", "X", "O", "X", "O", "X"],
];

function runBench(fn: (board: Cell[]) => number[], name: string) {
  const start = performance.now();
  let dummy = 0;
  for (let i = 0; i < 1_000_000; i++) {
    for (const board of boards) {
      dummy += fn(board).length;
    }
  }
  const end = performance.now();
  console.log(`${name}: ${(end - start).toFixed(2)}ms (dummy: ${dummy})`);
}

console.log("Warming up...");
runBench(getEmptyCellsOriginal, "Original Warmup");
runBench(getEmptyCellsOptimized, "Optimized Warmup");
console.log("---");
runBench(getEmptyCellsOriginal, "Original");
runBench(getEmptyCellsOptimized, "Optimized");
