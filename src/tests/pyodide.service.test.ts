import { describe, it, expect, vi, beforeEach } from "vitest";
import { pyodideService } from "../apps/MLStudio/pyodide.service";

describe("pyodideService", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should securely call run_ml_task via globals to avoid code injection", async () => {
    // Mock the destroy method on the function proxy
    const destroyMock = vi.fn();

    // Mock the python function proxy
    const runMlTaskProxy = vi.fn().mockImplementation((jsonStr: string) => {
      // simulate the python function parsing JSON and returning JSON
      const parsed = JSON.parse(jsonStr);
      return JSON.stringify({
        type: "classification",
        accuracy: 0.95,
        mockedDataset: parsed.dataset_id,
      });
    });

    // Attach destroy to the mock function
    (runMlTaskProxy as unknown as Record<string, unknown>).destroy = destroyMock;

    const globalsGetMock = vi.fn().mockReturnValue(runMlTaskProxy);

    // Mock the pyodide object
    const pyodideMock = {
      globals: {
        get: globalsGetMock,
      },
    };

    // Inject mock into private property using unknown
    (pyodideService as unknown as Record<string, unknown>).pyodide = pyodideMock;
    (pyodideService as unknown as Record<string, unknown>).status = "ready";

    const config = {
      dataset_id: "test_ds",
      task_type: "classification",
      algo_id: "test_algo",
      hyperparams: { param1: 42 },
    };

    const result = await pyodideService.runTask(config);

    // Verify globals.get was called to get the function proxy
    expect(globalsGetMock).toHaveBeenCalledWith("run_ml_task");

    // Verify the function proxy was called with the JSON string directly, avoiding interpolation
    expect(runMlTaskProxy).toHaveBeenCalledWith(JSON.stringify(config));

    // Verify result is parsed correctly
    expect(result).toMatchObject({
      type: "classification",
      accuracy: 0.95,
      mockedDataset: "test_ds",
    });

    // Verify destroy was called
    expect(destroyMock).toHaveBeenCalled();
  });

  it("should throw an error if the python function returns an error", async () => {
    const destroyMock = vi.fn();
    const runMlTaskProxy = vi.fn().mockImplementation(() => {
      return JSON.stringify({ error: "Test python error" });
    });
    (runMlTaskProxy as unknown as Record<string, unknown>).destroy = destroyMock;

    (pyodideService as unknown as Record<string, unknown>).pyodide = {
      globals: {
        get: () => runMlTaskProxy,
      },
    };
    (pyodideService as unknown as Record<string, unknown>).status = "ready";

    const config = {
      dataset_id: "test_ds",
      task_type: "classification",
      algo_id: "test_algo",
      hyperparams: {},
    };

    await expect(pyodideService.runTask(config)).rejects.toThrow(
      "Test python error"
    );

    // Verify destroy is still called when an error occurs
    expect(destroyMock).toHaveBeenCalled();
  });
});
