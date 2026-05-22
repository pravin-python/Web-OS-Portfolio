import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { sessionStore } from "../services/storage";

describe("sessionStore", () => {
  const mockPrefix = "webos_v1_";
  const testKey = "testKey";
  const prefixedTestKey = `${mockPrefix}${testKey}`;

  beforeEach(() => {
    // Clear storage before each test
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("get", () => {
    it("should return parsed JSON when valid data exists", () => {
      const testData = { foo: "bar" };
      sessionStorage.setItem(prefixedTestKey, JSON.stringify(testData));

      const result = sessionStore.get(testKey);
      expect(result).toEqual(testData);
    });

    it("should return null when key does not exist", () => {
      const result = sessionStore.get("nonExistentKey");
      expect(result).toBeNull();
    });

    it("should return fallback when key does not exist and fallback is provided", () => {
      const fallback = { default: true };
      const result = sessionStore.get("nonExistentKey", fallback);
      expect(result).toEqual(fallback);
    });

    it("should return null when fallback is not provided and JSON.parse fails", () => {
      sessionStorage.setItem(prefixedTestKey, "invalid json");

      const result = sessionStore.get(testKey);
      expect(result).toBeNull();
    });

    it("should return fallback when JSON.parse fails and fallback is provided", () => {
      sessionStorage.setItem(prefixedTestKey, "invalid json");

      const fallback = { default: true };
      const result = sessionStore.get(testKey, fallback);
      expect(result).toEqual(fallback);
    });

    it("should handle sessionStorage.getItem throwing an error", () => {
      vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
        throw new Error("Simulated storage error");
      });

      const result = sessionStore.get(testKey);
      expect(result).toBeNull();

      const fallback = { fallback: true };
      const resultWithFallback = sessionStore.get(testKey, fallback);
      expect(resultWithFallback).toEqual(fallback);
    });
  });

  describe("set", () => {
    it("should set stringified value with prefix in sessionStorage", () => {
      const testData = { value: 123 };
      sessionStore.set(testKey, testData);

      const raw = sessionStorage.getItem(prefixedTestKey);
      expect(raw).toBe(JSON.stringify(testData));
    });

    it("should handle storage limit exceeded silently while logging a warning", () => {
      const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new Error("QuotaExceededError");
      });

      // Should not throw
      expect(() => sessionStore.set(testKey, "data")).not.toThrow();

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "[SessionStorage] set failed:",
        expect.any(Error)
      );
    });
  });

  describe("remove", () => {
    it("should remove value with prefix from sessionStorage", () => {
      sessionStorage.setItem(prefixedTestKey, "some data");
      expect(sessionStorage.getItem(prefixedTestKey)).not.toBeNull();

      sessionStore.remove(testKey);

      expect(sessionStorage.getItem(prefixedTestKey)).toBeNull();
    });
  });
});
