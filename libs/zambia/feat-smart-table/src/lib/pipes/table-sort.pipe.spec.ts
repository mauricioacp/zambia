import { TableSortPipe } from './table-sort.pipe';
import { SortConfig } from '../types/table.types';

describe('TableSortPipe', () => {
  let pipe: TableSortPipe;

  // Mock data based on real PostgreSQL data
  const mockAgreements = [
    {
      id: '1812a6e1-968a-4de2-933b-f10d06042a39',
      name: 'Super',
      last_name: 'Admin',
      email: 'test@test.com',
      status: 'active',
      created_at: new Date('2025-06-19T12:15:29.767Z'),
      quantity: 100,
      active: true,
    },
    {
      id: '43f39ab2-f77d-48ef-b0e2-2a27ec8c42bf',
      name: 'Lidia',
      last_name: 'Ribera Lorente',
      email: 'lidiaribera@gmail.com',
      status: 'prospect',
      created_at: new Date('2023-06-23T11:10:23.600Z'),
      quantity: 50,
      active: false,
    },
    {
      id: 'b890aedd-a54b-45c2-a141-18ae665ce623',
      name: 'Aurelia',
      last_name: 'Alvarez Alonso',
      email: 'aureliaescuela@gmail.com',
      status: 'prospect',
      created_at: new Date('2023-06-23T11:11:03.664Z'),
      quantity: 150,
      active: true,
    },
  ];

  beforeEach(() => {
    pipe = new TableSortPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('transform', () => {
    it('should return items unchanged when sortConfig is null', () => {
      const result = pipe.transform([...mockAgreements], null);
      expect(result).toEqual(mockAgreements);
    });

    it('should return items unchanged when sortConfig is undefined', () => {
      const result = pipe.transform([...mockAgreements], undefined);
      expect(result).toEqual(mockAgreements);
    });

    it('should sort strings in ascending order', () => {
      const sortConfig: SortConfig<any> = { key: 'name', direction: 'asc' };
      const result = pipe.transform([...mockAgreements], sortConfig);

      expect(result[0].name).toBe('Aurelia');
      expect(result[1].name).toBe('Lidia');
      expect(result[2].name).toBe('Super');
    });

    it('should sort strings in descending order', () => {
      const sortConfig: SortConfig<any> = { key: 'name', direction: 'desc' };
      const result = pipe.transform([...mockAgreements], sortConfig);

      expect(result[0].name).toBe('Super');
      expect(result[1].name).toBe('Lidia');
      expect(result[2].name).toBe('Aurelia');
    });

    it('should sort numbers in ascending order', () => {
      const sortConfig: SortConfig<any> = { key: 'quantity', direction: 'asc' };
      const result = pipe.transform([...mockAgreements], sortConfig);

      expect(result[0].quantity).toBe(50);
      expect(result[1].quantity).toBe(100);
      expect(result[2].quantity).toBe(150);
    });

    it('should sort numbers in descending order', () => {
      const sortConfig: SortConfig<any> = { key: 'quantity', direction: 'desc' };
      const result = pipe.transform([...mockAgreements], sortConfig);

      expect(result[0].quantity).toBe(150);
      expect(result[1].quantity).toBe(100);
      expect(result[2].quantity).toBe(50);
    });

    it('should sort dates in ascending order', () => {
      const sortConfig: SortConfig<any> = { key: 'created_at', direction: 'asc' };
      const result = pipe.transform([...mockAgreements], sortConfig);

      expect(result[0].name).toBe('Lidia');
      expect(result[1].name).toBe('Aurelia');
      expect(result[2].name).toBe('Super');
    });

    it('should sort dates in descending order', () => {
      const sortConfig: SortConfig<any> = { key: 'created_at', direction: 'desc' };
      const result = pipe.transform([...mockAgreements], sortConfig);

      expect(result[0].name).toBe('Super');
      expect(result[1].name).toBe('Aurelia');
      expect(result[2].name).toBe('Lidia');
    });

    it('should sort booleans in ascending order (false first)', () => {
      const sortConfig: SortConfig<any> = { key: 'active', direction: 'asc' };
      const result = pipe.transform([...mockAgreements], sortConfig);

      expect(result[0].active).toBe(false);
      expect(result[1].active).toBe(true);
      expect(result[2].active).toBe(true);
    });

    it('should sort booleans in descending order (true first)', () => {
      const sortConfig: SortConfig<any> = { key: 'active', direction: 'desc' };
      const result = pipe.transform([...mockAgreements], sortConfig);

      expect(result[0].active).toBe(true);
      expect(result[1].active).toBe(true);
      expect(result[2].active).toBe(false);
    });

    it('should handle null values (null values last)', () => {
      const dataWithNull = [
        { id: '1', name: 'Charlie', value: 30 },
        { id: '2', name: null, value: 20 },
        { id: '3', name: 'Alice', value: 10 },
      ];

      const sortConfig: SortConfig<any> = { key: 'name', direction: 'asc' };
      const result = pipe.transform(dataWithNull, sortConfig);

      expect(result[0].name).toBe('Alice');
      expect(result[1].name).toBe('Charlie');
      expect(result[2].name).toBe(null);
    });

    it('should handle undefined values (undefined values last)', () => {
      const dataWithUndefined = [
        { id: '1', name: 'Bob', value: 30 },
        { id: '2', name: undefined, value: 20 },
        { id: '3', name: 'Alice', value: 10 },
      ];

      const sortConfig: SortConfig<any> = { key: 'name', direction: 'asc' };
      const result = pipe.transform(dataWithUndefined, sortConfig);

      expect(result[0].name).toBe('Alice');
      expect(result[1].name).toBe('Bob');
      expect(result[2].name).toBe(undefined);
    });

    it('should maintain original order for equal values', () => {
      const dataWithEqual = [
        { id: '1', name: 'User', order: 1 },
        { id: '2', name: 'User', order: 2 },
        { id: '3', name: 'User', order: 3 },
      ];

      const sortConfig: SortConfig<any> = { key: 'name', direction: 'asc' };
      const result = pipe.transform(dataWithEqual, sortConfig);

      expect(result[0].order).toBe(1);
      expect(result[1].order).toBe(2);
      expect(result[2].order).toBe(3);
    });

    it('should handle empty arrays', () => {
      const sortConfig: SortConfig<any> = { key: 'name', direction: 'asc' };
      const result = pipe.transform([], sortConfig);

      expect(result).toEqual([]);
    });

    it('should handle mixed type values gracefully', () => {
      const mixedData = [
        { id: '1', value: 'string' },
        { id: '2', value: 123 },
        { id: '3', value: true },
        { id: '4', value: null },
      ];

      const sortConfig: SortConfig<any> = { key: 'value', direction: 'asc' };
      const result = pipe.transform(mixedData, sortConfig);

      // Should not throw error
      expect(result.length).toBe(4);
    });

    it('should perform case-insensitive string sorting', () => {
      const caseData = [
        { id: '1', name: 'zebra' },
        { id: '2', name: 'Apple' },
        { id: '3', name: 'banana' },
      ];

      const sortConfig: SortConfig<any> = { key: 'name', direction: 'asc' };
      const result = pipe.transform(caseData, sortConfig);

      expect(result[0].name).toBe('Apple');
      expect(result[1].name).toBe('banana');
      expect(result[2].name).toBe('zebra');
    });

    it('should sort numeric strings naturally', () => {
      const numericStrings = [
        { id: '1', value: '100' },
        { id: '2', value: '20' },
        { id: '3', value: '3' },
      ];

      const sortConfig: SortConfig<any> = { key: 'value', direction: 'asc' };
      const result = pipe.transform(numericStrings, sortConfig);

      // Natural sort keeps numeric order in strings
      expect(result[0].value).toBe('3');
      expect(result[1].value).toBe('20');
      expect(result[2].value).toBe('100');
    });

    it('should handle date strings', () => {
      const dateStrings = [
        { id: '1', date: '2023-12-01' },
        { id: '2', date: '2023-01-15' },
        { id: '3', date: '2023-06-30' },
      ];

      const sortConfig: SortConfig<any> = { key: 'date', direction: 'asc' };
      const result = pipe.transform(dateStrings, sortConfig);

      expect(result[0].date).toBe('2023-01-15');
      expect(result[1].date).toBe('2023-06-30');
      expect(result[2].date).toBe('2023-12-01');
    });
  });
});
