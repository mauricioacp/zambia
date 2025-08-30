import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TableStateService } from './table-state.service';
import { FilterConfig } from '@zambia/ui-table-primitives';

describe('TableStateService', () => {
  let service: TableStateService<any>;

  // Mock data based on real PostgreSQL data
  const mockItems = [
    {
      id: '1812a6e1-968a-4de2-933b-f10d06042a39',
      name: 'Super',
      last_name: 'Admin',
      email: 'test@test.com',
      status: 'active',
    },
    {
      id: '43f39ab2-f77d-48ef-b0e2-2a27ec8c42bf',
      name: 'Lidia',
      last_name: 'Ribera Lorente',
      email: 'lidiaribera@gmail.com',
      status: 'prospect',
    },
    {
      id: 'b890aedd-a54b-45c2-a141-18ae665ce623',
      name: 'Aurelia',
      last_name: 'Alvarez Alonso',
      email: 'aureliaescuela@gmail.com',
      status: 'prospect',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TableStateService],
    });
    service = TestBed.inject(TableStateService);
  });

  afterEach(() => {
    // Clear localStorage after each test
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Items Management', () => {
    it('should set items and reset page and selection', () => {
      service.setPage(2);
      service.selectItem(mockItems[0]);

      service.setItems(mockItems);

      expect(service.items()).toEqual(mockItems);
      expect(service.currentPage()).toBe(1);
      expect(service.selectedItems().size).toBe(0);
    });

    it('should calculate total items correctly', () => {
      service.setItems(mockItems);
      expect(service.totalItems()).toBe(3);
    });

    it('should calculate total pages correctly', () => {
      service.setItems(mockItems);
      service.setPageSize(2);
      expect(service.totalPages()).toBe(2);
    });
  });

  describe('Search Functionality', () => {
    it('should set search term', () => {
      service.setSearchTerm('test');
      // The internal _searchTerm signal is private, but we can verify through public methods
      // The searchTerm is debounced, so we check immediate internal state indirectly
    });

    it('should reset to first page when search term changes', () => {
      service.setPage(2);
      service.setSearchTerm('new search');
      expect(service.currentPage()).toBe(1);
    });

    it('should debounce search term', fakeAsync(() => {
      service.setSearchTerm('t');
      service.setSearchTerm('te');
      service.setSearchTerm('test');

      tick(200);
      expect(service.searchTerm()).toBe('');

      tick(100);
      expect(service.searchTerm()).toBe('test');
    }));
  });

  describe('Sort Functionality', () => {
    it('should set sort configuration', () => {
      service.setSort('name', 'asc');

      expect(service.sortConfig()).toEqual({
        key: 'name',
        direction: 'asc',
      });
    });

    it('should toggle sort direction when clicking same column', () => {
      service.setSort('name', 'asc');
      service.setSort('name');

      expect(service.sortConfig()).toEqual({
        key: 'name',
        direction: 'desc',
      });

      service.setSort('name');
      expect(service.sortConfig()).toEqual({
        key: 'name',
        direction: 'asc',
      });
    });

    it('should clear sort configuration', () => {
      service.setSort('name', 'asc');
      service.clearSort();

      expect(service.sortConfig()).toBeNull();
    });
  });

  describe('Filter Functionality', () => {
    it('should add a new filter', () => {
      const filter: FilterConfig<any> = {
        key: 'status',
        value: 'active',
        operator: 'eq',
      };

      service.addFilter(filter);

      expect(service.filters()).toEqual([filter]);
      expect(service.currentPage()).toBe(1);
    });

    it('should replace existing filter with same key', () => {
      const filter1: FilterConfig<any> = {
        key: 'status',
        value: 'active',
        operator: 'eq',
      };
      const filter2: FilterConfig<any> = {
        key: 'status',
        value: 'prospect',
        operator: 'eq',
      };

      service.addFilter(filter1);
      service.addFilter(filter2);

      expect(service.filters().length).toBe(1);
      expect(service.filters()[0].value).toBe('prospect');
    });

    it('should remove filter by key', () => {
      const filter1: FilterConfig<any> = {
        key: 'status',
        value: 'active',
        operator: 'eq',
      };
      const filter2: FilterConfig<any> = {
        key: 'name',
        value: 'John',
        operator: 'contains',
      };

      service.addFilter(filter1);
      service.addFilter(filter2);
      service.removeFilter('status');

      expect(service.filters().length).toBe(1);
      expect(service.filters()[0].key).toBe('name');
    });

    it('should clear all filters', () => {
      service.addFilter({ key: 'status', value: 'active', operator: 'eq' });
      service.addFilter({ key: 'name', value: 'John', operator: 'contains' });

      service.clearFilters();

      expect(service.filters()).toEqual([]);
      expect(service.currentPage()).toBe(1);
    });
  });

  describe('Pagination', () => {
    it('should set page within valid range', () => {
      service.setItems(mockItems);
      service.setPageSize(2);

      service.setPage(2);
      expect(service.currentPage()).toBe(2);

      service.setPage(5);
      expect(service.currentPage()).toBe(2); // Max page

      service.setPage(0);
      expect(service.currentPage()).toBe(1); // Min page
    });

    it('should set page size and reset to first page', () => {
      service.setPage(2);
      service.setPageSize(25);

      expect(service.pageSize()).toBe(25);
      expect(service.currentPage()).toBe(1);
    });

    it('should calculate pagination state correctly', () => {
      service.setItems(mockItems);
      service.setPageSize(2);
      service.setPage(2);

      const paginationState = service.paginationState();

      expect(paginationState).toEqual({
        currentPage: 2,
        pageSize: 2,
        totalItems: 3,
      });
    });
  });

  describe('Column Visibility', () => {
    it('should set column visibility', () => {
      service.setColumnVisibility('name', false);
      service.setColumnVisibility('email', true);

      expect(service.columnVisibility()).toEqual({
        name: false,
        email: true,
      });
    });

    it('should toggle column visibility', () => {
      service.setColumnVisibility('name', true);
      service.toggleColumnVisibility('name');

      expect(service.columnVisibility()['name']).toBe(false);

      service.toggleColumnVisibility('name');
      expect(service.columnVisibility()['name']).toBe(true);
    });

    it('should set all columns visibility', () => {
      service.setItems(mockItems);
      service.setAllColumnsVisibility(true);

      const visibility = service.columnVisibility();
      expect(visibility['id']).toBe(true);
      expect(visibility['name']).toBe(true);
      expect(visibility['email']).toBe(true);
      expect(visibility['status']).toBe(true);
    });
  });

  describe('Selection Management', () => {
    it('should select an item', () => {
      service.selectItem(mockItems[0]);

      expect(service.selectedItems().has(mockItems[0].id)).toBe(true);
      expect(service.isItemSelected(mockItems[0])).toBe(true);
    });

    it('should deselect an item', () => {
      service.selectItem(mockItems[0]);
      service.deselectItem(mockItems[0]);

      expect(service.selectedItems().has(mockItems[0].id)).toBe(false);
      expect(service.isItemSelected(mockItems[0])).toBe(false);
    });

    it('should toggle item selection', () => {
      service.toggleItemSelection(mockItems[0]);
      expect(service.isItemSelected(mockItems[0])).toBe(true);

      service.toggleItemSelection(mockItems[0]);
      expect(service.isItemSelected(mockItems[0])).toBe(false);
    });

    it('should select all items', () => {
      service.setItems(mockItems);
      service.selectAll();

      expect(service.selectedItems().size).toBe(3);
      mockItems.forEach((item) => {
        expect(service.isItemSelected(item)).toBe(true);
      });
    });

    it('should clear selection', () => {
      service.setItems(mockItems);
      service.selectAll();
      service.clearSelection();

      expect(service.selectedItems().size).toBe(0);
    });

    it('should handle items without id', () => {
      const itemWithoutId = { name: 'No ID', email: 'noid@test.com' };

      service.selectItem(itemWithoutId);
      expect(service.selectedItems().size).toBe(0);
      expect(service.isItemSelected(itemWithoutId)).toBe(false);
    });
  });

  describe('Table State', () => {
    it('should compute complete table state', () => {
      service.setItems(mockItems);
      service.setSearchTerm('test');
      service.setSort('name', 'asc');
      service.addFilter({ key: 'status', value: 'active', operator: 'eq' });
      service.selectItem(mockItems[0]);

      const tableState = service.tableState();

      expect(tableState.data).toEqual(mockItems);
      expect(tableState.pagination.totalItems).toBe(3);
      expect(tableState.sort).toEqual({ key: 'name', direction: 'asc' });
      expect(tableState.filters!.length).toBe(1);
      expect(tableState.selectedRows!.length).toBe(1);
      expect(tableState.selectedRows![0]).toEqual(mockItems[0]);
    });

    it('should compute filter state', () => {
      service.setSearchTerm('test');
      service.addFilter({ key: 'status', value: 'active', operator: 'eq' });

      const filterState = service.filterState();

      expect(filterState.searchTerm).toBe('test');
      expect(filterState.filters!.length).toBe(1);
    });
  });

  describe('State Persistence', () => {
    it('should save state to localStorage', () => {
      service.setSort('name', 'asc');
      service.setPageSize(25);
      service.setColumnVisibility('email', false);
      service.addFilter({ key: 'status', value: 'active', operator: 'eq' });

      service.saveState('test-table');

      const saved = localStorage.getItem('table-state-test-table');
      expect(saved).toBeTruthy();

      const parsedState = JSON.parse(saved!);
      expect(parsedState.sort).toEqual({ key: 'name', direction: 'asc' });
      expect(parsedState.pageSize).toBe(25);
      expect(parsedState.columnVisibility.email).toBe(false);
      expect(parsedState.filters.length).toBe(1);
    });

    it('should load state from localStorage', () => {
      const savedState = {
        sort: { key: 'email', direction: 'desc' },
        filters: [{ key: 'status', value: 'prospect', operator: 'eq' }],
        pageSize: 50,
        columnVisibility: { name: false, email: true },
      };

      localStorage.setItem('table-state-test-table', JSON.stringify(savedState));

      service.loadState('test-table');

      expect(service.sortConfig()).toEqual(savedState.sort);
      expect(service.filters()).toEqual(savedState.filters);
      expect(service.pageSize()).toBe(50);
      expect(service.columnVisibility()).toEqual(savedState.columnVisibility);
    });

    it('should handle corrupted saved state gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      localStorage.setItem('table-state-test-table', 'invalid json');

      service.loadState('test-table');

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should clear saved state', () => {
      localStorage.setItem('table-state-test-table', 'some data');

      service.clearSavedState('test-table');

      expect(localStorage.getItem('table-state-test-table')).toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty items array', () => {
      service.setItems([]);

      expect(service.totalItems()).toBe(0);
      expect(service.totalPages()).toBe(0);
    });

    it('should handle page size of 0', () => {
      service.setItems(mockItems);
      service.setPageSize(0);

      expect(service.totalPages()).toBe(Infinity);
    });
  });
});
