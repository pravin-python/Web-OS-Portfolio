/* ═══════════════════════════════════════════════════
   Metrics — classification, regression, clustering
   ═══════════════════════════════════════════════════ */

// ─── Classification ───

export function accuracy(yTrue: number[], yPred: number[]): number {
  let correct = 0;
  for (let i = 0; i < yTrue.length; i++) {
    if (yTrue[i] === yPred[i]) correct++;
  }
  return yTrue.length === 0 ? 0 : correct / yTrue.length;
}

export function confusionMatrix(yTrue: number[], yPred: number[]): number[][] {
  const classes = [...new Set([...yTrue, ...yPred])].sort((a, b) => a - b);
  const n = classes.length;
  const classIndex = new Map(classes.map((c, i) => [c, i]));
  const matrix = Array.from({ length: n }, () => new Array(n).fill(0));

  for (let i = 0; i < yTrue.length; i++) {
    const ti = classIndex.get(yTrue[i])!;
    const pi = classIndex.get(yPred[i])!;
    matrix[ti][pi]++;
  }
  return matrix;
}

export function precision(yTrue: number[], yPred: number[]): number {
  const cm = confusionMatrix(yTrue, yPred);
  const n = cm.length;
  let totalPrecision = 0;
  let validClasses = 0;

  for (let j = 0; j < n; j++) {
    const tp = cm[j][j];
    let colSum = 0;
    for (let i = 0; i < n; i++) colSum += cm[i][j];
    if (colSum > 0) {
      totalPrecision += tp / colSum;
      validClasses++;
    }
  }
  return validClasses === 0 ? 0 : totalPrecision / validClasses;
}

export function recall(yTrue: number[], yPred: number[]): number {
  const cm = confusionMatrix(yTrue, yPred);
  const n = cm.length;
  let totalRecall = 0;
  let validClasses = 0;

  for (let i = 0; i < n; i++) {
    const tp = cm[i][i];
    let rowSum = 0;
    for (let j = 0; j < n; j++) rowSum += cm[i][j];
    if (rowSum > 0) {
      totalRecall += tp / rowSum;
      validClasses++;
    }
  }
  return validClasses === 0 ? 0 : totalRecall / validClasses;
}

export function f1Score(yTrue: number[], yPred: number[]): number {
  const p = precision(yTrue, yPred);
  const r = recall(yTrue, yPred);
  return p + r === 0 ? 0 : (2 * p * r) / (p + r);
}

// ─── Regression ───

export function mae(yTrue: number[], yPred: number[]): number {
  let sum = 0;
  for (let i = 0; i < yTrue.length; i++) sum += Math.abs(yTrue[i] - yPred[i]);
  return yTrue.length === 0 ? 0 : sum / yTrue.length;
}

export function mse(yTrue: number[], yPred: number[]): number {
  let sum = 0;
  for (let i = 0; i < yTrue.length; i++) sum += (yTrue[i] - yPred[i]) ** 2;
  return yTrue.length === 0 ? 0 : sum / yTrue.length;
}

export function rmse(yTrue: number[], yPred: number[]): number {
  return Math.sqrt(mse(yTrue, yPred));
}

export function r2Score(yTrue: number[], yPred: number[]): number {
  const mean = yTrue.reduce((a, b) => a + b, 0) / yTrue.length;
  let ssTot = 0;
  let ssRes = 0;
  for (let i = 0; i < yTrue.length; i++) {
    ssTot += (yTrue[i] - mean) ** 2;
    ssRes += (yTrue[i] - yPred[i]) ** 2;
  }
  return ssTot === 0 ? 0 : 1 - ssRes / ssTot;
}

// ─── Clustering ───

export function clusterSizes(labels: number[]): Map<number, number> {
  const counts = new Map<number, number>();
  for (const l of labels) counts.set(l, (counts.get(l) ?? 0) + 1);
  return counts;
}

/**
 * Within-cluster sum of squared errors (inertia).
 */
export function inertia(
  X: number[][],
  labels: number[],
  centroids: number[][],
): number {
  let total = 0;
  for (let i = 0; i < X.length; i++) {
    const c = centroids[labels[i]];
    for (let j = 0; j < X[i].length; j++) {
      total += (X[i][j] - c[j]) ** 2;
    }
  }
  return total;
}

/**
 * Simplified silhouette score (average over all points).
 */
export function silhouetteScore(X: number[][], labels: number[]): number {
  const n = X.length;
  if (n <= 1) return 0;
  const uniqueLabels = [...new Set(labels)];
  if (uniqueLabels.length <= 1) return 0;

  const dist = (a: number[], b: number[]) => {
    let s = 0;
    for (let j = 0; j < a.length; j++) s += (a[j] - b[j]) ** 2;
    return Math.sqrt(s);
  };

  let totalSil = 0;
  for (let i = 0; i < n; i++) {
    // a(i) = average distance to same-cluster points
    let aSum = 0;
    let aCount = 0;
    for (let j = 0; j < n; j++) {
      if (j !== i && labels[j] === labels[i]) {
        aSum += dist(X[i], X[j]);
        aCount++;
      }
    }
    const a = aCount === 0 ? 0 : aSum / aCount;

    // b(i) = min average distance to other-cluster points
    let b = Infinity;
    for (const cl of uniqueLabels) {
      if (cl === labels[i]) continue;
      let bSum = 0;
      let bCount = 0;
      for (let j = 0; j < n; j++) {
        if (labels[j] === cl) {
          bSum += dist(X[i], X[j]);
          bCount++;
        }
      }
      if (bCount > 0) b = Math.min(b, bSum / bCount);
    }

    const maxAB = Math.max(a, b);
    totalSil += maxAB === 0 ? 0 : (b - a) / maxAB;
  }
  return totalSil / n;
}
