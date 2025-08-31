import { Injectable, signal, computed } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { TableState, PaginationState, SortConfig, ColumnVisibilityState, TableFilterState } from '../types/table.types';
import { FilterConfig } from '@zambia/ui-table-primitives';

/**
 * Service for managing table state (pagination, sorting, filtering, etc.)
 * Can be injected at component level for isolated state or at root for shared state
 */
@Injectable()
export class TableStateService<T extends Record<string, unknown>> {
  // Core state signals
  private readonly _items = signal<T[]>([]);
  private readonly _searchTerm = signal<string>('');
  private readonly _sortConfig = signal<SortConfig<T> | null>(null);
  private readonly _filters = signal<FilterConfig<T>[]>([]);
  private readonly _currentPage = signal<number>(1);
  private readonly _pageSize = signal<number>(10);
  private readonly _columnVisibility = signal<ColumnVisibilityState>({});
  private readonly _selectedItems = signal<Set<string>>(new Set());

  // Debounced search term
  readonly searchTerm = toSignal(toObservable(this._searchTerm).pipe(debounceTime(300), distinctUntilChanged()), {
    initialValue: '',
  });

  // Computed values
  readonly totalItems = computed(() => this._items().length);

  readonly totalPages = computed(() => Math.ceil(this.totalItems() / this._pageSize()));

  readonly paginationState = computed<PaginationState>(() => ({
    currentPage: this._currentPage(),
    pageSize: this._pageSize(),
    totalItems: this.totalItems(),
  }));

  readonly tableState = computed<TableState<T>>(() => ({
    data: this._items(),
    pagination: this.paginationState(),
    sort: this._sortConfig() || undefined,
    filters: this._filters(),
    search: this.searchTerm(),
    selectedRows: Array.from(this._selectedItems())
      .map((id) => this._items().find((item) => this.getItemId(item) === id))
      .filter(Boolean) as T[],
  }));

  readonly filterState = computed<TableFilterState<T>>(() => ({
    searchTerm: this.searchTerm(),
    filters: this._filters(),
  }));

  // Public accessors
  readonly items = this._items.asReadonly();
  readonly sortConfig = this._sortConfig.asReadonly();
  readonly filters = this._filters.asReadonly();
  readonly currentPage = this._currentPage.asReadonly();
  readonly pageSize = this._pageSize.asReadonly();
  readonly columnVisibility = this._columnVisibility.asReadonly();
  readonly selectedItems = this._selectedItems.asReadonly();

  // Methods
  setItems(items: T[]): void {
    this._items.set(items);
    this._currentPage.set(1); // Reset to first page
    this._selectedItems.set(new Set()); // Clear selection
  }

  setSearchTerm(term: string): void {
    this._searchTerm.set(term);
    this._currentPage.set(1); // Reset to first page on search
  }

  setSort(column: keyof T | string, direction?: 'asc' | 'desc'): void {
    const currentSort = this._sortConfig();

    if (currentSort?.key === column && !direction) {
      // Toggle direction if same column
      const newDirection = currentSort.direction === 'asc' ? 'desc' : 'asc';
      this._sortConfig.set({ key: column, direction: newDirection });
    } else {
      this._sortConfig.set({ key: column, direction: direction || 'asc' });
    }
  }

  clearSort(): void {
    this._sortConfig.set(null);
  }

  addFilter(filter: FilterConfig<T>): void {
    const currentFilters = this._filters();
    const existingIndex = currentFilters.findIndex((f) => f.key === filter.key);

    if (existingIndex >= 0) {
      // Replace existing filter
      const newFilters = [...currentFilters];
      newFilters[existingIndex] = filter;
      this._filters.set(newFilters);
    } else {
      this._filters.set([...currentFilters, filter]);
    }

    this._currentPage.set(1); // Reset to first page
  }

  removeFilter(key: keyof T | string): void {
    const currentFilters = this._filters();
    this._filters.set(currentFilters.filter((f) => f.key !== key));
    this._currentPage.set(1); // Reset to first page
  }

  clearFilters(): void {
    this._filters.set([]);
    this._currentPage.set(1);
  }

  setPage(page: number): void {
    const maxPage = this.totalPages();
    const validPage = Math.max(1, Math.min(page, maxPage));
    this._currentPage.set(validPage);
  }

  setPageSize(size: number): void {
    this._pageSize.set(size);
    this._currentPage.set(1); // Reset to first page
  }

  setColumnVisibility(columnKey: string, visible: boolean): void {
    this._columnVisibility.update((state) => ({
      ...state,
      [columnKey]: visible,
    }));
  }

  toggleColumnVisibility(columnKey: string): void {
    this._columnVisibility.update((state) => ({
      ...state,
      [columnKey]: !state[columnKey],
    }));
  }

  setAllColumnsVisibility(visible: boolean): void {
    const allColumns = this.getAllColumnKeys();
    const newVisibility: ColumnVisibilityState = {};

    allColumns.forEach((key) => {
      newVisibility[key] = visible;
    });

    this._columnVisibility.set(newVisibility);
  }

  selectItem(item: T): void {
    const id = this.getItemId(item);
    if (id) {
      this._selectedItems.update((set) => {
        const newSet = new Set(set);
        newSet.add(id);
        return newSet;
      });
    }
  }

  deselectItem(item: T): void {
    const id = this.getItemId(item);
    if (id) {
      this._selectedItems.update((set) => {
        const newSet = new Set(set);
        newSet.delete(id);
        return newSet;
      });
    }
  }

  toggleItemSelection(item: T): void {
    const id = this.getItemId(item);
    if (id) {
      this._selectedItems.update((set) => {
        const newSet = new Set(set);
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
        return newSet;
      });
    }
  }

  selectAll(): void {
    const allIds = this._items()
      .map((item) => this.getItemId(item))
      .filter(Boolean) as string[];

    this._selectedItems.set(new Set(allIds));
  }

  clearSelection(): void {
    this._selectedItems.set(new Set());
  }

  isItemSelected(item: T): boolean {
    const id = this.getItemId(item);
    return id ? this._selectedItems().has(id) : false;
  }

  // Helper methods
  private getItemId(item: T): string | null {
    if ('id' in item && item['id']) {
      return String(item['id']);
    }
    return null;
  }

  private getAllColumnKeys(): string[] {
    // Get all unique keys from items
    const keys = new Set<string>();

    this._items().forEach((item) => {
      Object.keys(item).forEach((key) => keys.add(key));
    });

    return Array.from(keys);
  }

  // State persistence methods
  saveState(key: string): void {
    const state = {
      sort: this._sortConfig(),
      filters: this._filters(),
      pageSize: this._pageSize(),
      columnVisibility: this._columnVisibility(),
    };

    localStorage.setItem(`table-state-${key}`, JSON.stringify(state));
  }

  loadState(key: string): void {
    const savedState = localStorage.getItem(`table-state-${key}`);

    if (savedState) {
      try {
        const state = JSON.parse(savedState);

        if (state.sort) this._sortConfig.set(state.sort);
        if (state.filters) this._filters.set(state.filters);
        if (state.pageSize) this._pageSize.set(state.pageSize);
        if (state.columnVisibility) this._columnVisibility.set(state.columnVisibility);
      } catch (error) {
        console.error('Failed to load table state:', error);
      }
    }
  }

  clearSavedState(key: string): void {
    localStorage.removeItem(`table-state-${key}`);
  }
}
