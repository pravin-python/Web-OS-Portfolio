import { describe, it, expect } from 'vitest';
import { paginateData, type CSVData } from '../services/dataService';

describe('paginateData', () => {
  const mockData: CSVData = {
    headers: ['id', 'name'],
    rows: [
      ['1', 'Alice'],
      ['2', 'Bob'],
      ['3', 'Charlie'],
      ['4', 'David'],
      ['5', 'Eve'],
    ],
    totalRows: 5,
  };

  it('should return the correct slice for page 1', () => {
    const result = paginateData(mockData, 1, 2);
    expect(result.rows).toEqual([
      ['1', 'Alice'],
      ['2', 'Bob'],
    ]);
    expect(result.totalPages).toBe(3);
    expect(result.currentPage).toBe(1);
  });

  it('should return the correct slice for page 2', () => {
    const result = paginateData(mockData, 2, 2);
    expect(result.rows).toEqual([
      ['3', 'Charlie'],
      ['4', 'David'],
    ]);
    expect(result.totalPages).toBe(3);
    expect(result.currentPage).toBe(2);
  });

  it('should return the correct slice for page 3 (last page with fewer items)', () => {
    const result = paginateData(mockData, 3, 2);
    expect(result.rows).toEqual([
      ['5', 'Eve'],
    ]);
    expect(result.totalPages).toBe(3);
    expect(result.currentPage).toBe(3);
  });

  it('should return an empty slice for an out of bounds page number', () => {
    const result = paginateData(mockData, 4, 2);
    expect(result.rows).toEqual([]);
    expect(result.totalPages).toBe(3);
    expect(result.currentPage).toBe(4);
  });

  it('should return all rows if perPage is larger than the total length of the data', () => {
    const result = paginateData(mockData, 1, 10);
    expect(result.rows).toEqual(mockData.rows);
    expect(result.totalPages).toBe(1);
    expect(result.currentPage).toBe(1);
  });

  it('should handle an empty dataset correctly', () => {
    const emptyData: CSVData = {
      headers: ['id', 'name'],
      rows: [],
      totalRows: 0,
    };
    const result = paginateData(emptyData, 1, 2);
    expect(result.rows).toEqual([]);
    expect(result.totalPages).toBe(0);
    expect(result.currentPage).toBe(1);
  });
});
