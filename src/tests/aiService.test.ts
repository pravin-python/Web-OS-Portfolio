import { describe, it, expect } from "vitest";
import {
  getModelInfo,
  getPredictionSteps,
  getRandomPrediction,
} from "../services/aiService";

describe("aiService", () => {
  describe("getModelInfo", () => {
    it("should return the formatted model info string", () => {
      const info = getModelInfo();
      expect(typeof info).toBe("string");
      expect(info).toContain("MODEL: InvoiceExtractor-v3");
      expect(info).toContain("Framework:    PyTorch 2.1");
      expect(info).toContain("Status: Ready for inference");
      expect(info).toContain("Accuracy:  94.2%");
    });
  });

  describe("getPredictionSteps", () => {
    it("should return a list of prediction steps", () => {
      const steps = getPredictionSteps();
      expect(Array.isArray(steps)).toBe(true);
      expect(steps.length).toBeGreaterThan(0);
      expect(steps[0]).toHaveProperty("label");
      expect(steps[0]).toHaveProperty("duration");
    });
  });

  describe("getRandomPrediction", () => {
    it("should return a random prediction result", () => {
      const result = getRandomPrediction();
      expect(result).toHaveProperty("documentType");
      expect(result).toHaveProperty("fields");
      expect(result).toHaveProperty("confidence");
      expect(Array.isArray(result.fields)).toBe(true);
    });
  });
});
