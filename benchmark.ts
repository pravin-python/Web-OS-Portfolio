import { f1Score } from './src/apps/MLCalculator/utils/metrics.ts';
import { performance } from 'perf_hooks';

const n = 100000;
const yTrue = Array.from({ length: n }, () => Math.floor(Math.random() * 10));
const yPred = Array.from({ length: n }, () => Math.floor(Math.random() * 10));

const start = performance.now();
for (let i = 0; i < 100; i++) {
  f1Score(yTrue, yPred);
}
const end = performance.now();
console.log(`Baseline f1Score time: ${end - start} ms`);
