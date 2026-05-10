import mlEngineCode from "./ml_engine.py?raw";
import type { TrainResult } from "./types";

// Declare Pyodide global interface
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    loadPyodide: (config: { indexURL: string }) => Promise<any>;
  }
}

export type PyodideStatus = "loading" | "ready" | "error";

class PyodideService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private pyodide: any = null;
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
      console.log("[PyodideService] Successfully initialized ML Engine");
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
    // Escape quotes to safely pass JSON string into python eval
    const escapedStr = jsonStr.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

    // Call the python function
    const resultJson = await this.pyodide.runPythonAsync(`
run_ml_task("${escapedStr}")
    `);

    const result = JSON.parse(resultJson);
    if (result.error) {
      throw new Error(result.error);
    }
    return result as TrainResult;
  }
}

// Export singleton instance
export const pyodideService = new PyodideService();
