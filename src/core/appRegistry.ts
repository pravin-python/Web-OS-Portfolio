import type { ComponentType } from "react";
import { Terminal } from "../apps/Terminal/Terminal";
import { FileExplorer } from "../apps/FileExplorer/FileExplorer";
import { Notepad } from "../apps/Notepad/Notepad";
import { TicTacToe } from "../apps/TicTacToe/TicTacToe";
import { SnakeGame } from "../apps/SnakeGame/SnakeGame";
import { TwentyFortyEight } from "../apps/Game2048/Game2048";
import { AIPredictor } from "../apps/AIPredictor/AIPredictor";
import { DatasetViewer } from "../apps/DatasetViewer/DatasetViewer";
import { SecurityToolkit } from "../apps/SecurityToolkit/SecurityToolkit";
import { SystemLogs } from "../apps/SystemLogs/SystemLogs";
import { ModelLogs } from "../apps/ModelLogs/ModelLogs";
import { ContactCenter } from "../apps/ContactCenter/ContactCenter";
import { AboutProfile } from "../apps/AboutProfile/AboutProfile";

export interface AppDefinition {
  key: string;
  title: string;
  icon: string;
  component: ComponentType<any>;
  route: string;
  defaultSize: { width: number; height: number };
  showOnDesktop: boolean;
  category: "system" | "game" | "ai" | "security" | "data" | "utility";
}

export const APP_REGISTRY: Record<string, AppDefinition> = {
  /* ─── Profile ─── */
  aboutProfile: {
    key: "aboutProfile",
    title: "About Me",
    icon: "system/about",
    component: AboutProfile,
    route: "/os/about",
    defaultSize: { width: 900, height: 650 },
    showOnDesktop: true,
    category: "system",
  },

  /* ─── AI & Research ─── */
  aiPredictor: {
    key: "aiPredictor",
    title: "AI Predictor",
    icon: "apps/predictor",
    component: AIPredictor,
    route: "/os/ai-predictor",
    defaultSize: { width: 480, height: 560 },
    showOnDesktop: true,
    category: "ai",
  },
  modelLogs: {
    key: "modelLogs",
    title: "AI Research Lab",
    icon: "apps/model-logs",
    component: ModelLogs,
    route: "/os/model-logs",
    defaultSize: { width: 600, height: 650 },
    showOnDesktop: true,
    category: "ai",
  },
  datasetViewer: {
    key: "datasetViewer",
    title: "Datasets",
    icon: "system/dataset",
    component: DatasetViewer,
    route: "/os/datasets",
    defaultSize: { width: 750, height: 500 },
    showOnDesktop: true,
    category: "data",
  },

  /* ─── Security ─── */
  securityToolkit: {
    key: "securityToolkit",
    title: "Security Toolkit",
    icon: "system/security",
    component: SecurityToolkit,
    route: "/os/security",
    defaultSize: { width: 550, height: 520 },
    showOnDesktop: true,
    category: "security",
  },

  /* ─── System ─── */
  terminal: {
    key: "terminal",
    title: "Terminal",
    icon: "system/terminal",
    component: Terminal,
    route: "/os/terminal",
    defaultSize: { width: 700, height: 450 },
    showOnDesktop: true,
    category: "system",
  },
  systemLogs: {
    key: "systemLogs",
    title: "System Logs",
    icon: "system/log",
    component: SystemLogs,
    route: "/os/system-logs",
    defaultSize: { width: 700, height: 450 },
    showOnDesktop: true,
    category: "system",
  },
  fileExplorer: {
    key: "fileExplorer",
    title: "Experiments",
    icon: "apps/experiments",
    component: FileExplorer,
    route: "/os/files",
    defaultSize: { width: 750, height: 500 },
    showOnDesktop: true,
    category: "system",
  },
  notepad: {
    key: "notepad",
    title: "Notepad",
    icon: "apps/notepad",
    component: Notepad,
    route: "/os/notes",
    defaultSize: { width: 600, height: 450 },
    showOnDesktop: true,
    category: "utility",
  },

  /* ─── Games ─── */
  snake: {
    key: "snake",
    title: "Neural Snake",
    icon: "apps/snake",
    component: SnakeGame,
    route: "/os/games/snake",
    defaultSize: { width: 550, height: 550 },
    showOnDesktop: true,
    category: "game",
  },
  tictactoe: {
    key: "tictactoe",
    title: "TicTacToe AI",
    icon: "apps/tictactoe",
    component: TicTacToe,
    route: "/os/games/tictactoe",
    defaultSize: { width: 700, height: 750 },
    showOnDesktop: true,
    category: "game",
  },
  game2048: {
    key: "game2048",
    title: "Logic Grid 2048",
    icon: "apps/game-2048",
    component: TwentyFortyEight,
    route: "/os/games/2048",
    defaultSize: { width: 450, height: 600 },
    showOnDesktop: true,
    category: "game",
  },

  /* ─── Communication ─── */
  contactCenter: {
    key: "contactCenter",
    title: "Contact Center",
    icon: "system/contact",
    component: ContactCenter,
    route: "/os/contact",
    defaultSize: { width: 750, height: 520 },
    showOnDesktop: true,
    category: "system",
  },

  settings: {
    key: "settings",
    title: "Settings",
    icon: "system/settings",
    component: (() => null) as any,
    route: "/os/settings",
    defaultSize: { width: 600, height: 450 },
    showOnDesktop: false,
    category: "system",
  },
};

/**
 * Get list of apps shown on the desktop
 */
export function getDesktopApps(): AppDefinition[] {
  return Object.values(APP_REGISTRY).filter((app) => app.showOnDesktop);
}

/**
 * Resolve a URL route path to an app key.
 */
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

/**
 * Get the component for an app key.
 */
export function getAppComponent(appKey: string): ComponentType<any> {
  const app = APP_REGISTRY[appKey];
  return app?.component || (() => null);
}
