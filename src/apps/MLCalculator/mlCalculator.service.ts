/* ═══════════════════════════════════════════════════
   ML Calculator Service
   Pure TypeScript implementations — no external deps
   ═══════════════════════════════════════════════════ */

export type ProgressCallback = (step: string, pct: number) => void;

// ─── Helper: yield to UI thread ───
const yieldFrame = () => new Promise<void>((r) => setTimeout(r, 0));

// ─── Euclidean distance ───
function euclidean(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += (a[i] - b[i]) ** 2;
  return Math.sqrt(sum);
}

/* ═══════════════════════════════════════════════════
   1. K-Nearest Neighbors (Classification)
   ═══════════════════════════════════════════════════ */

export async function trainKNN(
  xTrain: number[][],
  yTrain: number[],
  xTest: number[][],
  k: number,
  onProgress?: ProgressCallback,
): Promise<number[]> {
  onProgress?.("Computing distances…", 10);
  await yieldFrame();

  const predictions: number[] = [];

  for (let i = 0; i < xTest.length; i++) {
    const distances = xTrain.map((xt, idx) => ({
      dist: euclidean(xTest[i], xt),
      label: yTrain[idx],
    }));
    distances.sort((a, b) => a.dist - b.dist);

    // Majority vote
    const votes = new Map<number, number>();
    for (let j = 0; j < k; j++) {
      const lbl = distances[j].label;
      votes.set(lbl, (votes.get(lbl) ?? 0) + 1);
    }
    let maxVotes = -1;
    let pred = 0;
    for (const [lbl, cnt] of votes) {
      if (cnt > maxVotes) {
        maxVotes = cnt;
        pred = lbl;
      }
    }
    predictions.push(pred);

    if (i % 5 === 0) {
      const pct = 10 + 80 * ((i + 1) / xTest.length);
      onProgress?.(`Classifying sample ${i + 1}/${xTest.length}…`, pct);
      await yieldFrame();
    }
  }

  onProgress?.("KNN complete", 100);
  return predictions;
}

/* ═══════════════════════════════════════════════════
   2. Logistic Regression (Multi-class via One-vs-Rest)
   ═══════════════════════════════════════════════════ */

function sigmoid(z: number): number {
  return 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, z))));
}

function dotRow(x: number[], w: number[]): number {
  let s = 0;
  for (let i = 0; i < x.length; i++) s += x[i] * w[i];
  return s;
}

export async function trainLogisticRegression(
  xTrain: number[][],
  yTrain: number[],
  xTest: number[][],
  learningRate: number,
  epochs: number,
  onProgress?: ProgressCallback,
): Promise<number[]> {
  const classes = [...new Set(yTrain)].sort((a, b) => a - b);
  const nFeatures = xTrain[0].length;
  const nTrain = xTrain.length;

  // One-vs-Rest: one weight vector per class
  const allWeights: number[][] = [];

  for (let c = 0; c < classes.length; c++) {
    const weights = new Array(nFeatures + 1).fill(0); // +1 for bias
    const binaryY = yTrain.map((y) => (y === classes[c] ? 1 : 0));

    for (let epoch = 0; epoch < epochs; epoch++) {
      const grad = new Array(nFeatures + 1).fill(0);

      for (let i = 0; i < nTrain; i++) {
        const z = dotRow(xTrain[i], weights) + weights[nFeatures]; // bias
        const pred = sigmoid(z);
        const err = pred - binaryY[i];
        for (let j = 0; j < nFeatures; j++) grad[j] += err * xTrain[i][j];
        grad[nFeatures] += err; // bias gradient
      }

      for (let j = 0; j <= nFeatures; j++) {
        weights[j] -= (learningRate * grad[j]) / nTrain;
      }

      if (epoch % 10 === 0) {
        const basePct = (c / classes.length) * 80;
        const epochPct = ((epoch + 1) / epochs) * (80 / classes.length);
        onProgress?.(
          `Training class ${classes[c]} — epoch ${epoch + 1}/${epochs}`,
          10 + basePct + epochPct,
        );
        await yieldFrame();
      }
    }
    allWeights.push(weights);
  }

  // Predict: pick class with highest probability
  onProgress?.("Predicting…", 92);
  await yieldFrame();

  const predictions = xTest.map((x) => {
    let maxProb = -Infinity;
    let maxClass = classes[0];
    for (let c = 0; c < classes.length; c++) {
      const prob = sigmoid(dotRow(x, allWeights[c]) + allWeights[c][nFeatures]);
      if (prob > maxProb) {
        maxProb = prob;
        maxClass = classes[c];
      }
    }
    return maxClass;
  });

  onProgress?.("Logistic Regression complete", 100);
  return predictions;
}

/* ═══════════════════════════════════════════════════
   3. Linear Regression (Normal Equation)
   ═══════════════════════════════════════════════════ */

function transpose(M: number[][]): number[][] {
  const rows = M.length;
  const cols = M[0].length;
  const T: number[][] = Array.from({ length: cols }, () => new Array(rows));
  for (let i = 0; i < rows; i++)
    for (let j = 0; j < cols; j++) T[j][i] = M[i][j];
  return T;
}

function matMul(A: number[][], B: number[][]): number[][] {
  const rA = A.length,
    cA = A[0].length,
    cB = B[0].length;
  const C: number[][] = Array.from({ length: rA }, () => new Array(cB).fill(0));
  for (let i = 0; i < rA; i++)
    for (let j = 0; j < cB; j++)
      for (let k = 0; k < cA; k++) C[i][j] += A[i][k] * B[k][j];
  return C;
}

function matInverse(M: number[][]): number[][] {
  const n = M.length;
  // Augmented matrix [M | I]
  const aug = M.map((row, i) => [
    ...row.map((v) => v),
    ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)),
  ]);

  for (let col = 0; col < n; col++) {
    // Find pivot
    let maxRow = col;
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(aug[row][col]) > Math.abs(aug[maxRow][col])) maxRow = row;
    }
    [aug[col], aug[maxRow]] = [aug[maxRow], aug[col]];

    const pivot = aug[col][col];
    if (Math.abs(pivot) < 1e-10) {
      // Add small regularization
      aug[col][col] += 1e-6;
    }

    const pv = aug[col][col];
    for (let j = 0; j < 2 * n; j++) aug[col][j] /= pv;

    for (let row = 0; row < n; row++) {
      if (row === col) continue;
      const factor = aug[row][col];
      for (let j = 0; j < 2 * n; j++) aug[row][j] -= factor * aug[col][j];
    }
  }

  return aug.map((row) => row.slice(n));
}

export async function trainLinearRegression(
  xTrain: number[][],
  yTrain: number[],
  xTest: number[][],
  fitIntercept: boolean,
  onProgress?: ProgressCallback,
): Promise<{ predictions: number[]; weights: number[]; bias: number }> {
  onProgress?.("Building design matrix…", 10);
  await yieldFrame();

  // Add bias column if fitting intercept
  const X = fitIntercept
    ? xTrain.map((row) => [...row, 1])
    : xTrain.map((row) => [...row]);
  const Y = yTrain.map((y) => [y]);

  onProgress?.("Computing X^T X…", 25);
  await yieldFrame();

  const XT = transpose(X);
  const XTX = matMul(XT, X);

  onProgress?.("Inverting matrix…", 45);
  await yieldFrame();

  const XTX_inv = matInverse(XTX);

  onProgress?.("Solving normal equation…", 65);
  await yieldFrame();

  const XTY = matMul(XT, Y);
  const theta = matMul(XTX_inv, XTY);

  onProgress?.("Predicting…", 85);
  await yieldFrame();

  const nFeatures = xTrain[0].length;
  const weights = theta.slice(0, nFeatures).map((r) => r[0]);
  const bias = fitIntercept ? theta[nFeatures][0] : 0;

  const predictions = xTest.map((x) => {
    let pred = bias;
    for (let j = 0; j < nFeatures; j++) pred += x[j] * weights[j];
    return pred;
  });

  onProgress?.("Linear Regression complete", 100);
  return { predictions, weights, bias };
}

/* ═══════════════════════════════════════════════════
   4. K-Means Clustering (Lloyd's + k-means++ init)
   ═══════════════════════════════════════════════════ */

export async function trainKMeans(
  X: number[][],
  k: number,
  maxIter = 100,
  onProgress?: ProgressCallback,
): Promise<{ labels: number[]; centroids: number[][] }> {
  const n = X.length;
  const nFeatures = X[0].length;

  onProgress?.("Initializing centroids (k-means++)…", 5);
  await yieldFrame();

  // k-means++ initialization
  const centroids: number[][] = [];
  const rng = () => Math.random();

  // Pick first centroid randomly
  centroids.push([...X[Math.floor(rng() * n)]]);

  for (let c = 1; c < k; c++) {
    const distSq = X.map((x) => {
      let minDist = Infinity;
      for (const cent of centroids) {
        const d = euclidean(x, cent);
        if (d < minDist) minDist = d;
      }
      return minDist * minDist;
    });
    const totalDist = distSq.reduce((a, b) => a + b, 0);
    let r = rng() * totalDist;
    for (let i = 0; i < n; i++) {
      r -= distSq[i];
      if (r <= 0) {
        centroids.push([...X[i]]);
        break;
      }
    }
    if (centroids.length <= c) centroids.push([...X[Math.floor(rng() * n)]]);
  }

  let labels = new Array(n).fill(0);

  for (let iter = 0; iter < maxIter; iter++) {
    // Assignment step
    const newLabels = X.map((x) => {
      let minDist = Infinity;
      let best = 0;
      for (let c = 0; c < k; c++) {
        const d = euclidean(x, centroids[c]);
        if (d < minDist) {
          minDist = d;
          best = c;
        }
      }
      return best;
    });

    // Update step
    const sums = Array.from({ length: k }, () => new Array(nFeatures).fill(0));
    const counts = new Array(k).fill(0);

    for (let i = 0; i < n; i++) {
      const cl = newLabels[i];
      counts[cl]++;
      for (let j = 0; j < nFeatures; j++) sums[cl][j] += X[i][j];
    }

    for (let c = 0; c < k; c++) {
      if (counts[c] > 0) {
        for (let j = 0; j < nFeatures; j++)
          centroids[c][j] = sums[c][j] / counts[c];
      }
    }

    // Check convergence
    let changed = false;
    for (let i = 0; i < n; i++) {
      if (newLabels[i] !== labels[i]) {
        changed = true;
        break;
      }
    }
    labels = newLabels;

    if (iter % 3 === 0) {
      const pct = 10 + 85 * ((iter + 1) / maxIter);
      onProgress?.(`Iteration ${iter + 1}/${maxIter}…`, pct);
      await yieldFrame();
    }

    if (!changed) break;
  }

  onProgress?.("K-Means complete", 100);
  return { labels, centroids };
}
