import { describe, it, expect } from "vitest";
import { searchData, type CSVData } from "../services/dataService";

describe("searchData", () => {
  const mockData: CSVData = {
    headers: ["id", "name", "role", "city"],
    rows: [
      ["1", "Alice Smith", "Engineer", "New York"],
      ["2", "Bob Johnson", "Manager", "San Francisco"],
      ["3", "Charlie Brown", "Engineer", "London"],
      ["4", "Diana Prince", "Director", "New York"],
    ],
    totalRows: 4,
  };

  it("should return the original data if the query is empty or just whitespace", () => {
    expect(searchData(mockData, "")).toBe(mockData);
    expect(searchData(mockData, "   ")).toBe(mockData);
  });

  it("should return the correct matching row(s) (case insensitive)", () => {
    const result = searchData(mockData, "alice");
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0]).toEqual([
      "1",
      "Alice Smith",
      "Engineer",
      "New York",
    ]);
    expect(result.totalRows).toBe(1);

    const result2 = searchData(mockData, "SMITH");
    expect(result2.rows).toHaveLength(1);
    expect(result2.rows[0]).toEqual([
      "1",
      "Alice Smith",
      "Engineer",
      "New York",
    ]);

    const result3 = searchData(mockData, "engineer");
    expect(result3.rows).toHaveLength(2);
    expect(result3.rows[0]).toEqual([
      "1",
      "Alice Smith",
      "Engineer",
      "New York",
    ]);
    expect(result3.rows[1]).toEqual([
      "3",
      "Charlie Brown",
      "Engineer",
      "London",
    ]);
    expect(result3.totalRows).toBe(2);
  });

  it("should search across all columns", () => {
    // Search in ID
    const resultId = searchData(mockData, "2");
    expect(resultId.rows).toHaveLength(1);
    expect(resultId.rows[0]).toEqual([
      "2",
      "Bob Johnson",
      "Manager",
      "San Francisco",
    ]);

    // Search in City
    const resultCity = searchData(mockData, "New York");
    expect(resultCity.rows).toHaveLength(2);
    expect(resultCity.rows[0]).toEqual([
      "1",
      "Alice Smith",
      "Engineer",
      "New York",
    ]);
    expect(resultCity.rows[1]).toEqual([
      "4",
      "Diana Prince",
      "Director",
      "New York",
    ]);
  });

  it("should return empty rows and 0 totalRows if no match is found, and headers should be preserved", () => {
    const result = searchData(mockData, "nonexistent");
    expect(result.rows).toHaveLength(0);
    expect(result.totalRows).toBe(0);
    expect(result.headers).toEqual(mockData.headers);
  });
});
