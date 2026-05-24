import { performance } from 'perf_hooks';

interface AppDefinition {
  key: string;
  route: string;
  showOnDesktop: boolean;
  category: string;
}

const APP_REGISTRY: Record<string, AppDefinition> = {
  aboutProfile: { key: "aboutProfile", route: "/about", showOnDesktop: true, category: "system" },
  aiPredictor: { key: "aiPredictor", route: "/ai-predictor", showOnDesktop: true, category: "ai" },
  modelLogs: { key: "modelLogs", route: "/model-logs", showOnDesktop: true, category: "ai" },
  datasetViewer: { key: "datasetViewer", route: "/datasets", showOnDesktop: true, category: "data" },
  dsaLab: { key: "dsaLab", route: "/dsa-lab", showOnDesktop: true, category: "ai" },
  mlLab: { key: "mlLab", route: "/ml-lab", showOnDesktop: true, category: "ai" },
  mlCalculator: { key: "mlCalculator", route: "/ml-calculator", showOnDesktop: true, category: "ai" },
  mlStudio: { key: "mlStudio", route: "/ml-studio", showOnDesktop: true, category: "ai" },
  securityToolkit: { key: "securityToolkit", route: "/security", showOnDesktop: true, category: "security" },
  terminal: { key: "terminal", route: "/terminal", showOnDesktop: true, category: "system" },
  systemLogs: { key: "systemLogs", route: "/system-logs", showOnDesktop: true, category: "system" },
  fileExplorer: { key: "fileExplorer", route: "/files", showOnDesktop: true, category: "system" },
  notepad: { key: "notepad", route: "/notes", showOnDesktop: true, category: "utility" },
  snake: { key: "snake", route: "/games/snake", showOnDesktop: true, category: "game" },
  tictactoe: { key: "tictactoe", route: "/games/tictactoe", showOnDesktop: true, category: "game" },
  game2048: { key: "game2048", route: "/games/2048", showOnDesktop: true, category: "game" },
  phantomTTT: { key: "phantomTTT", route: "/games/phantom-ttt", showOnDesktop: true, category: "game" },
  contactCenter: { key: "contactCenter", route: "/contact", showOnDesktop: true, category: "system" },
  settings: { key: "settings", route: "/settings", showOnDesktop: false, category: "system" },
  trash: { key: "trash", route: "/trash", showOnDesktop: true, category: "system" },
};

export function resolveRouteToAppKey(pathname: string): string | null {
  for (const app of Object.values(APP_REGISTRY)) {
    if (pathname === app.route) {
      return app.key;
    }
  }
  for (const app of Object.values(APP_REGISTRY)) {
    if (pathname.startsWith(app.route + "/")) {
      return app.key;
    }
  }
  return null;
}

const APPS = Object.values(APP_REGISTRY);

export function resolveRouteToAppKeyOptimized(pathname: string): string | null {
  for (let i = 0; i < APPS.length; i++) {
    if (pathname === APPS[i].route) {
      return APPS[i].key;
    }
  }
  for (let i = 0; i < APPS.length; i++) {
    if (pathname.startsWith(APPS[i].route + "/")) {
      return APPS[i].key;
    }
  }
  return null;
}

const ROUTE_TO_KEY_MAP = new Map(APPS.map(app => [app.route, app.key]));

export function resolveRouteToAppKeyMemoryMap(pathname: string): string | null {
  const exactMatch = ROUTE_TO_KEY_MAP.get(pathname);
  if (exactMatch) return exactMatch;
  for (let i = 0; i < APPS.length; i++) {
    if (pathname.startsWith(APPS[i].route + "/")) {
      return APPS[i].key;
    }
  }
  return null;
}

export function resolveRouteToAppKeyOptimized2(pathname: string): string | null {
  for (const app of APPS) {
    if (pathname === app.route) {
      return app.key;
    }
  }
  for (const app of APPS) {
    if (pathname.startsWith(app.route + "/")) {
      return app.key;
    }
  }
  return null;
}

const paths = [
  '/about',
  '/files',
  '/games/snake',
  '/settings/advanced',
  '/non-existent',
  '/ai-predictor/subpath',
];

const iterations = 1000000;

function runBench(name: string, fn: (path: string) => string | null) {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    for (const path of paths) {
      fn(path);
    }
  }
  const end = performance.now();
  console.log(`${name}: ${(end - start).toFixed(2)} ms for ${iterations * paths.length} resolutions`);
  return end - start;
}

// Warm up
for (let i = 0; i < 10000; i++) {
  resolveRouteToAppKey('/about');
  resolveRouteToAppKeyOptimized('/about');
  resolveRouteToAppKeyMemoryMap('/about');
  resolveRouteToAppKeyOptimized2('/about');
}

const baseline = runBench('Baseline (Object.values)', resolveRouteToAppKey);
const optimized = runBench('Optimized (Cached APPS)', resolveRouteToAppKeyOptimized);
const mapOpt = runBench('MemoryMap (ROUTE_TO_KEY_MAP)', resolveRouteToAppKeyMemoryMap);
const opt2 = runBench('Optimized2 (for...of APPS)', resolveRouteToAppKeyOptimized2);

console.log(`\nImprovement (Cached vs Baseline): ${((baseline - optimized) / baseline * 100).toFixed(2)}%`);
console.log(`Improvement (Map vs Baseline): ${((baseline - mapOpt) / baseline * 100).toFixed(2)}%`);
console.log(`Improvement (ForOf vs Baseline): ${((baseline - opt2) / baseline * 100).toFixed(2)}%`);
