/* ═══════════════════════════════════════════════════
   Preprocessing — train/test split, normalization
   ═══════════════════════════════════════════════════ */

/** Seeded pseudo-random for reproducible splits */
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Shuffle indices using Fisher-Yates */
function shuffleIndices(n: number, seed = 42): number[] {
  const idx = Array.from({ length: n }, (_, i) => i);
  const rng = seededRandom(seed);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx;
}

export interface SplitResult {
  xTrain: number[][];
  xTest: number[][];
  yTrain: number[];
  yTest: number[];
}

/**
 * Train/test split with optional stratification for classification.
 */
export function trainTestSplit(
  X: number[][],
  y: number[],
  testRatio: number,
  stratify = true,
  seed = 42,
): SplitResult {
  const n = X.length;
  if (!stratify || new Set(y).size > 10) {
    // Random split (regression / clustering)
    const indices = shuffleIndices(n, seed);
    const splitAt = Math.round(n * (1 - testRatio));
    return {
      xTrain: indices.slice(0, splitAt).map((i) => X[i]),
      xTest: indices.slice(splitAt).map((i) => X[i]),
      yTrain: indices.slice(0, splitAt).map((i) => y[i]),
      yTest: indices.slice(splitAt).map((i) => y[i]),
    };
  }

  // Stratified split
  const classMap = new Map<number, number[]>();
  y.forEach((label, i) => {
    if (!classMap.has(label)) classMap.set(label, []);
    classMap.get(label)!.push(i);
  });

  const trainIdx: number[] = [];
  const testIdx: number[] = [];
  const rng = seededRandom(seed);

  for (const indices of classMap.values()) {
    // Shuffle class indices
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    const splitAt = Math.round(indices.length * (1 - testRatio));
    trainIdx.push(...indices.slice(0, splitAt));
    testIdx.push(...indices.slice(splitAt));
  }

  return {
    xTrain: trainIdx.map((i) => X[i]),
    xTest: testIdx.map((i) => X[i]),
    yTrain: trainIdx.map((i) => y[i]),
    yTest: testIdx.map((i) => y[i]),
  };
}

export interface NormParams {
  min: number[];
  max: number[];
}

/**
 * Min-max normalization to [0, 1]. Returns normalized data + params.
 */
export function normalize(X: number[][]): {
  data: number[][];
  params: NormParams;
} {
  if (X.length === 0) return { data: [], params: { min: [], max: [] } };
  const nFeatures = X[0].length;
  const min = new Array(nFeatures).fill(Infinity);
  const max = new Array(nFeatures).fill(-Infinity);

  for (const row of X) {
    for (let j = 0; j < nFeatures; j++) {
      if (row[j] < min[j]) min[j] = row[j];
      if (row[j] > max[j]) max[j] = row[j];
    }
  }

  const data = X.map((row) =>
    row.map((v, j) => {
      const range = max[j] - min[j];
      return range === 0 ? 0 : (v - min[j]) / range;
    }),
  );

  return { data, params: { min, max } };
}

/**
 * Apply existing normalization params to new data.
 */
export function applyNormalize(X: number[][], params: NormParams): number[][] {
  return X.map((row) =>
    row.map((v, j) => {
      const range = params.max[j] - params.min[j];
      return range === 0 ? 0 : (v - params.min[j]) / range;
    }),
  );
}

/**
 * Select specific feature columns by index.
 */
export function selectFeatures(X: number[][], indices: number[]): number[][] {
  return X.map((row) => indices.map((i) => row[i]));
}
