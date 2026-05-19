import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getPredictionSteps,
  getRandomPrediction,
  simulatePrediction,
  simulateTraining,
  getModelInfo,
} from "../services/aiService";

describe("aiService", () => {
  describe("getPredictionSteps", () => {
    it("should return an array of 5 steps", () => {
      const steps = getPredictionSteps();
      expect(Array.isArray(steps)).toBe(true);
      expect(steps).toHaveLength(5);
    });

    it("should return a new array reference each time", () => {
      const steps1 = getPredictionSteps();
      const steps2 = getPredictionSteps();
      expect(steps1).not.toBe(steps2);
      expect(steps1).toEqual(steps2); // Content should be the same
    });

    it("should have correct properties in steps", () => {
      const steps = getPredictionSteps();
      steps.forEach((step) => {
        expect(step).toHaveProperty("label");
        expect(typeof step.label).toBe("string");
        expect(step).toHaveProperty("duration");
        expect(typeof step.duration).toBe("number");
      });
    });
  });

  describe("getRandomPrediction", () => {
    it("should return a valid prediction object", () => {
      const prediction = getRandomPrediction();
      expect(prediction).toHaveProperty("documentType");
      expect(typeof prediction.documentType).toBe("string");

      expect(prediction).toHaveProperty("fields");
      expect(Array.isArray(prediction.fields)).toBe(true);
      prediction.fields.forEach((field) => {
        expect(field).toHaveProperty("label");
        expect(typeof field.label).toBe("string");
        expect(field).toHaveProperty("value");
        expect(typeof field.value).toBe("string");
      });

      expect(prediction).toHaveProperty("confidence");
      expect(typeof prediction.confidence).toBe("number");
    });
  });

  describe("simulatePrediction", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should call onStep callback 6 times and return a prediction", async () => {
      const onStep = vi.fn();
      const predictionPromise = simulatePrediction(onStep);

      // Fast forward timers for each step + completion
      const steps = getPredictionSteps();
      for (const step of steps) {
        await vi.advanceTimersByTimeAsync(step.duration);
      }

      const prediction = await predictionPromise;

      // 5 steps + 1 completion
      expect(onStep).toHaveBeenCalledTimes(6);
      expect(onStep).toHaveBeenLastCalledWith("Complete!", 100);

      // Should return a valid prediction
      expect(prediction).toHaveProperty("documentType");
      expect(prediction).toHaveProperty("fields");
      expect(prediction).toHaveProperty("confidence");
    });
  });

  describe("simulateTraining", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should output training steps and complete successfully", async () => {
      const onOutput = vi.fn();
      const epochs = 3;
      const trainingPromise = simulateTraining(onOutput, epochs);

      // Fast forward timers
      // Initial delays: 600 + 800 + 400 + 300 = 2100
      await vi.advanceTimersByTimeAsync(2100);

      // Epoch delays: 700 * 3 = 2100
      for (let i = 0; i < epochs; i++) {
        await vi.advanceTimersByTimeAsync(700);
      }

      // Final delay: 400
      await vi.advanceTimersByTimeAsync(400);

      await trainingPromise;

      expect(onOutput).toHaveBeenCalled();

      // Verify some key output phrases
      const calls = onOutput.mock.calls.map((call) => call[0]);
      expect(calls.some(call => call.includes("Loading dataset..."))).toBe(true);
      expect(calls.some(call => call.includes(`Starting training (${epochs} epochs)...`))).toBe(true);
      expect(calls.some(call => call.includes("Training complete!"))).toBe(true);
      expect(calls.some(call => call.includes("Model saved to /ai_lab/model_v4.pth"))).toBe(true);
    });
  });

  describe("getModelInfo", () => {
    it("should return a formatted string with model details", () => {
      const info = getModelInfo();
      expect(typeof info).toBe("string");
      expect(info).toContain("InvoiceExtractor-v3");
      expect(info).toContain("Framework:    PyTorch 2.1");
      expect(info).toContain("Accuracy:");
    });
  });
});
