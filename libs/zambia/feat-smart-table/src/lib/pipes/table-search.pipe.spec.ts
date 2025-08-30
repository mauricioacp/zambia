import { TableSearchPipe } from './table-search.pipe';

describe('TableSearchPipe', () => {
  let pipe: TableSearchPipe;

  // Mock data based on real PostgreSQL data
  const mockAgreements = [
    {
      id: '1812a6e1-968a-4de2-933b-f10d06042a39',
      name: 'Super',
      last_name: 'Admin',
      email: 'test@test.com',
      status: 'active',
      created_at: '2025-06-19T12:15:29.767Z',
      headquarter: { name: 'Mendoza' },
      role: { name: 'Super administrador' },
      country: { name: 'Argentina' },
    },
    {
      id: '43f39ab2-f77d-48ef-b0e2-2a27ec8c42bf',
      name: 'Lidia',
      last_name: 'Ribera Lorente',
      email: 'lidiaribera@gmail.com',
      status: 'prospect',
      created_at: '2023-06-23T11:10:23.600Z',
      headquarter: { name: 'Konsejo Akademiko' },
      role: { name: 'Director/a de Comunicación Local' },
      country: { name: 'Chile' },
    },
    {
      id: 'b890aedd-a54b-45c2-a141-18ae665ce623',
      name: 'Aurelia',
      last_name: 'Alvarez Alonso',
      email: 'aureliaescuela@gmail.com',
      status: 'prospect',
      created_at: '2023-06-23T11:11:03.664Z',
      headquarter: { name: 'Konsejo Akademiko' },
      role: { name: 'Asistente a la dirección' },
      country: { name: 'Chile' },
    },
  ];

  beforeEach(() => {
    pipe = new TableSearchPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('transform', () => {
    it('should return all items when search term is empty', () => {
      const result = pipe.transform(mockAgreements, '', ['name']);
      expect(result).toEqual(mockAgreements);
    });

    it('should return all items when search term is null', () => {
      const result = pipe.transform(mockAgreements, null as any, ['name']);
      expect(result).toEqual(mockAgreements);
    });

    it('should filter items by single column', () => {
      const result = pipe.transform(mockAgreements, 'Lidia', ['name']);
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Lidia');
    });

    it('should filter items by multiple columns', () => {
      const result = pipe.transform(mockAgreements, 'gmail', ['email', 'name']);
      expect(result.length).toBe(2);
      expect(result.every((item) => item.email.includes('gmail'))).toBe(true);
    });

    it('should be case insensitive', () => {
      const result = pipe.transform(mockAgreements, 'LIDIA', ['name']);
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Lidia');
    });

    it('should search in nested properties using dot notation', () => {
      const result = pipe.transform(mockAgreements, 'Mendoza', ['headquarter.name']);
      expect(result.length).toBe(1);
      expect(result[0].headquarter.name).toBe('Mendoza');
    });

    it('should search in all string properties when no columns specified', () => {
      const result = pipe.transform(mockAgreements, 'Chile', []);
      expect(result.length).toBe(2);
      expect(result.every((item) => item.country.name === 'Chile')).toBe(true);
    });

    it('should handle null values in data', () => {
      const dataWithNull = [
        { id: '1', name: null, email: 'test@example.com' },
        { id: '2', name: 'John', email: 'john@example.com' },
      ];
      const result = pipe.transform(dataWithNull, 'john', ['name', 'email']);
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('2');
    });

    it('should handle undefined values in data', () => {
      const dataWithUndefined = [
        { id: '1', name: undefined, email: 'test@example.com' },
        { id: '2', name: 'Jane', email: 'jane@example.com' },
      ];
      const result = pipe.transform(dataWithUndefined, 'jane', ['name', 'email']);
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('2');
    });

    it('should handle nested properties that do not exist', () => {
      const result = pipe.transform(mockAgreements, 'something', ['nonexistent.property']);
      expect(result).toEqual([]);
    });

    it('should handle special characters in search term', () => {
      const dataWithSpecialChars = [
        { id: '1', name: 'User (Admin)', email: 'admin@test.com' },
        { id: '2', name: 'Regular User', email: 'user@test.com' },
      ];
      const result = pipe.transform(dataWithSpecialChars, '(Admin)', ['name']);
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('User (Admin)');
    });

    it('should handle numeric values', () => {
      const dataWithNumbers = [
        { id: 1, name: 'Item 1', quantity: 100 },
        { id: 2, name: 'Item 2', quantity: 200 },
      ];
      const result = pipe.transform(dataWithNumbers, '100', ['quantity']);
      expect(result.length).toBe(1);
      expect(result[0].quantity).toBe(100);
    });

    it('should handle boolean values', () => {
      const dataWithBooleans = [
        { id: '1', name: 'Active User', active: true },
        { id: '2', name: 'Inactive User', active: false },
      ];
      const result = pipe.transform(dataWithBooleans, 'true', ['active']);
      expect(result.length).toBe(1);
      expect(result[0].active).toBe(true);
    });

    it('should match partial strings', () => {
      const result = pipe.transform(mockAgreements, 'Alons', ['last_name']);
      expect(result.length).toBe(1);
      expect(result[0].last_name).toBe('Alvarez Alonso');
    });

    it('should handle empty searchable columns array', () => {
      const result = pipe.transform(mockAgreements, 'test@test.com', []);
      expect(result.length).toBe(1);
      expect(result[0].email).toBe('test@test.com');
    });
  });
});
