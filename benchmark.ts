import { performance } from 'perf_hooks';
import { resolveRouteToAppKey } from './src/core/appRegistry';

const paths = [
  '/about',
  '/files',
  '/games/snake',
  '/settings/advanced',
  '/non-existent',
  '/ai-predictor/subpath',
];

const iterations = 1000000;

const start = performance.now();
for (let i = 0; i < iterations; i++) {
  for (const path of paths) {
    resolveRouteToAppKey(path);
  }
}
const end = performance.now();

console.log(`Baseline Execution Time: ${(end - start).toFixed(2)} ms for ${iterations * paths.length} resolutions`);
