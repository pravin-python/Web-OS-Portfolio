import { describe, it, expect } from 'vitest';
import { getDatasetStats, CSVData } from '../services/dataService';

describe('getDatasetStats', () => {
  it('should generate statistics for a standard dataset', () => {
    const data: CSVData = {
      headers: ['Name', 'Age', 'Location'],
      rows: [['Alice', '25', 'NY'], ['Bob', '30', 'SF']],
      totalRows: 2,
    };
    const expected = [
      'Columns: 3',
      'Rows: 2',
      'Headers: Name, Age, Location'
    ].join('\n');

    expect(getDatasetStats(data)).toBe(expected);
  });

  it('should generate statistics for an empty dataset', () => {
    const data: CSVData = {
      headers: [],
      rows: [],
      totalRows: 0,
    };
    const expected = [
      'Columns: 0',
      'Rows: 0',
      'Headers: '
    ].join('\n');

    expect(getDatasetStats(data)).toBe(expected);
  });

  it('should generate statistics for a single column/row dataset', () => {
    const data: CSVData = {
      headers: ['ID'],
      rows: [['1']],
      totalRows: 1,
    };
    const expected = [
      'Columns: 1',
      'Rows: 1',
      'Headers: ID'
    ].join('\n');

    expect(getDatasetStats(data)).toBe(expected);
  });
});
