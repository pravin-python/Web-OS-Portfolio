import mlEngineCode from "./ml_engine.py?raw";
import type { TrainResult } from "./types";

// Interface matching the Pyodide API usage in this service
export interface PyodideInterface {
  loadPackage: (packages: string | string[]) => Promise<void>;
  runPythonAsync: (code: string) => Promise<string>;
}

// Declare Pyodide global interface
declare global {
  interface Window {
    loadPyodide: (config: { indexURL: string }) => Promise<PyodideInterface>;
  }
}

export type PyodideStatus = "loading" | "ready" | "error";

class PyodideService {
  private pyodide: PyodideInterface | null = null;
  private status: PyodideStatus = "loading";
  private initPromise: Promise<void> | null = null;
  private subscribers: ((status: PyodideStatus) => void)[] = [];

  constructor() {
    this.initPromise = this.init();
  }

  public subscribe(cb: (status: PyodideStatus) => void) {
    this.subscribers.push(cb);
    cb(this.status);
    return () => {
      this.subscribers = this.subscribers.filter((fn) => fn !== cb);
    };
  }

  private setStatus(s: PyodideStatus) {
    this.status = s;
    this.subscribers.forEach((cb) => cb(s));
  }

  private async init() {
    try {
      this.setStatus("loading");

      // Load script dynamically
      await new Promise<void>((resolve, reject) => {
        if (typeof window.loadPyodide !== "undefined") return resolve();
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";
        script.onload = () => resolve();
        script.onerror = () =>
          reject(new Error("Failed to load Pyodide script"));
        document.head.appendChild(script);
      });

      // Initialize pyodide
      this.pyodide = await window.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/",
      });

      // Load required packages
      await this.pyodide.loadPackage([
        "micropip",
        "numpy",
        "pandas",
        "scikit-learn",
      ]);

      // Run our engine script
      await this.pyodide.runPythonAsync(mlEngineCode);

      this.setStatus("ready");
    } catch (err) {
      console.error("[PyodideService] Initialization failed:", err);
      this.setStatus("error");
    }
  }

  public async runTask(config: {
    dataset_id: string;
    task_type: string;
    algo_id: string;
    hyperparams: Record<string, number | string | boolean>;
    test_size?: number;
  }): Promise<TrainResult> {
    if (this.status !== "ready") {
      await this.initPromise;
    }
    if (!this.pyodide) throw new Error("Pyodide not loaded");

    const jsonStr = JSON.stringify(config);

    // Call the python function
    let runMlTaskProxy;
    let resultJson;
    try {
      runMlTaskProxy = this.pyodide.globals.get("run_ml_task");
      resultJson = runMlTaskProxy(jsonStr);
    } finally {
      if (runMlTaskProxy && typeof runMlTaskProxy.destroy === "function") {
        runMlTaskProxy.destroy();
      }
    }

    const result = JSON.parse(resultJson);
    if (result.error) {
      throw new Error(result.error);
    }
    return result as TrainResult;
  }
}

// Export singleton instance
export const pyodideService = new PyodideService();
