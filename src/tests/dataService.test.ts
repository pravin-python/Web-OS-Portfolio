import { describe, it, expect } from "vitest";
import { parseCSV } from "../services/dataService";

describe("dataService", () => {
  describe("parseCSV", () => {
    it("parses standard CSV correctly", () => {
      const csv = `name, age, city\nAlice, 30, New York\nBob, 25, Los Angeles`;
      const result = parseCSV(csv);

      expect(result.headers).toEqual(["name", "age", "city"]);
      expect(result.rows).toEqual([
        ["Alice", "30", "New York"],
        ["Bob", "25", "Los Angeles"],
      ]);
      expect(result.totalRows).toBe(2);
    });

    it("handles empty string", () => {
      const result = parseCSV("");

      expect(result.headers).toEqual([]);
      expect(result.rows).toEqual([]);
      expect(result.totalRows).toBe(0);
    });

    it("handles strings with only empty lines or whitespace", () => {
      const result = parseCSV("   \n\n  \n");

      expect(result.headers).toEqual([]);
      expect(result.rows).toEqual([]);
      expect(result.totalRows).toBe(0);
    });

    it("trims whitespace from headers and cells", () => {
      const csv = `  header1  ,  header2  \n  val1  ,  val2  `;
      const result = parseCSV(csv);

      expect(result.headers).toEqual(["header1", "header2"]);
      expect(result.rows).toEqual([["val1", "val2"]]);
      expect(result.totalRows).toBe(1);
    });

    it("handles single column CSV", () => {
      const csv = `id\n1\n2\n3`;
      const result = parseCSV(csv);

      expect(result.headers).toEqual(["id"]);
      expect(result.rows).toEqual([["1"], ["2"], ["3"]]);
      expect(result.totalRows).toBe(3);
    });

    it("handles header only CSV", () => {
      const csv = `header1, header2`;
      const result = parseCSV(csv);

      expect(result.headers).toEqual(["header1", "header2"]);
      expect(result.rows).toEqual([]);
      expect(result.totalRows).toBe(0);
    });
  });
});
