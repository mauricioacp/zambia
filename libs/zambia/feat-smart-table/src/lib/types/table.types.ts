import { TemplateRef } from '@angular/core';

import {
  TableColumn,
  TableAction,
  PaginationState,
  TablePaginationConfig,
  ColumnConfig,
  TableColumnConfig,
  TableSearchConfig,
  TableEmptyStateConfig,
  TableLoadingStateConfig,
  TableHeaderConfig,
  SortConfig,
  FilterConfig as BaseFilterConfig,
  TableState,
  TablePageChangeEvent,
  TableSortChangeEvent,
  TableFilterChangeEvent,
  TableSelectionChangeEvent,
} from '@zambia/ui-table-primitives';

// Re-export types
export {
  PaginationState,
  TablePaginationConfig,
  ColumnConfig,
  TableColumnConfig,
  TableSearchConfig,
  TableEmptyStateConfig,
  TableLoadingStateConfig,
  TableHeaderConfig,
  SortConfig,
  TableState,
  TablePageChangeEvent,
  TableSortChangeEvent,
  TableFilterChangeEvent,
  TableSelectionChangeEvent,
};

// Enhanced table specific types
export interface EnhancedTableConfig<T = unknown> {
  // Display
  title?: string;
  description?: string;

  // Features
  enablePagination?: boolean;
  enableFiltering?: boolean;
  enableColumnVisibility?: boolean;
  enableAdvancedSearch?: boolean;
  enableSorting?: boolean;
  enableSelection?: boolean;

  // Create button
  showCreateButton?: boolean;
  createButtonLabel?: string;
  createButtonIcon?: string;

  // Pagination
  pageSize?: number;
  pageSizeOptions?: number[];

  // Search
  searchableColumns?: string[];
  searchPlaceholder?: string;
  searchDebounceTime?: number;

  // Empty state
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  emptyStateIcon?: string;
  showEmptyStateAction?: boolean;

  // Loading
  loadingText?: string;

  // Tracking
  trackBy?: keyof T | string;
}

export interface TableActionButton<T = unknown> extends Omit<TableAction<T>, 'action'> {
  routerLink?: (item: T) => string[];
  color?: 'primary' | 'secondary' | 'warning' | 'danger';
  handler: (row: T) => void;
}

export interface TableColumnWithTemplate<T = unknown> extends TableColumn<T> {
  template?: TemplateRef<{ $implicit: T; item: T }>;
}

export interface TableStateConfig<T = unknown> {
  items: T[];
  columns: TableColumnWithTemplate<T>[];
  actions?: TableActionButton<T>[];
  config?: EnhancedTableConfig<T>;
}

// Events
export interface TableRowClickEvent<T = unknown> {
  item: T;
  event: MouseEvent;
}

export interface TableCreateClickEvent {
  event: MouseEvent;
}

export interface TableAdvancedSearchEvent {
  currentSearchTerm?: string;
}

// Column visibility
export interface ColumnVisibilityState {
  [key: string]: boolean;
}

// Sort state
export interface TableSortState<T = unknown> {
  column: keyof T | string;
  direction: 'asc' | 'desc';
}

// Filter state
export interface TableFilterState<T = unknown> {
  searchTerm?: string;
  filters?: BaseFilterConfig<T>[];
  customFilters?: Record<string, unknown>;
}
