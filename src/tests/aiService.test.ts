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
    it("should return an array of prediction steps", () => {
      const steps = getPredictionSteps();
      expect(Array.isArray(steps)).toBe(true);
      expect(steps.length).toBeGreaterThan(0);
      expect(steps[0]).toHaveProperty("label");
      expect(steps[0]).toHaveProperty("duration");
    });

    it("should return a new array instance", () => {
      const steps1 = getPredictionSteps();
      const steps2 = getPredictionSteps();
      expect(steps1).not.toBe(steps2);
      expect(steps1).toEqual(steps2);
    });
  });

  describe("getRandomPrediction", () => {
    let originalRandom: typeof Math.random;

    beforeEach(() => {
      originalRandom = Math.random;
    });

    afterEach(() => {
      Math.random = originalRandom;
    });

    it("should return a prediction result", () => {
      const result = getRandomPrediction();
      expect(result).toHaveProperty("documentType");
      expect(result).toHaveProperty("fields");
      expect(result).toHaveProperty("confidence");
    });

    it("should return the first sample when Math.random() is close to 0", () => {
      Math.random = vi.fn().mockReturnValue(0);
      const result = getRandomPrediction();
      expect(result.documentType).toBe("Invoice");
    });

    it("should return the last sample when Math.random() is close to 1", () => {
      Math.random = vi.fn().mockReturnValue(0.9999);
      const result = getRandomPrediction();
      expect(result.documentType).toBe("Purchase Order");
    });
  });

  describe("simulatePrediction", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should call onStep callback and return a result", async () => {
      const onStep = vi.fn();
      const promise = simulatePrediction(onStep);

      await vi.runAllTimersAsync();

      const result = await promise;
      expect(onStep).toHaveBeenCalled();
      expect(onStep).toHaveBeenLastCalledWith("Complete!", 100);
      expect(result).toHaveProperty("documentType");
    });
  });

  describe("simulateTraining", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should call onOutput with training progress", async () => {
      const onOutput = vi.fn();
      const promise = simulateTraining(onOutput, 1);

      await vi.runAllTimersAsync();

      await promise;
      expect(onOutput).toHaveBeenCalled();
      expect(onOutput).toHaveBeenCalledWith(expect.stringContaining("Training complete!"));
    });
  });

  describe("getModelInfo", () => {
    it("should return a formatted string with model details", () => {
      const info = getModelInfo();
      expect(typeof info).toBe("string");
      expect(info).toContain("MODEL: InvoiceExtractor-v3");
      expect(info).toContain("Accuracy:");
    });
  });
});
