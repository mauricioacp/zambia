// Core Table Types
export interface TableColumn<T = unknown> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  type?: 'text' | 'number' | 'date' | 'badge' | 'avatar' | 'status' | 'actions' | 'custom';
  customTemplate?: string;
  valueGetter?: (row: T) => string | number | Date;
}

export interface TableAction<T = unknown> {
  label: string;
  icon?: string;
  action: (row: T) => void;
  visible?: (row: T) => boolean;
  disabled?: (row: T) => boolean;
  class?: string;
}

// Pagination Types
export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
}

export interface TablePaginationConfig extends PaginationState {
  pageSizeOptions: number[];
}

// Column Configuration
export interface ColumnConfig extends Omit<TableColumn, 'key'> {
  key: string;
  visible: boolean;
}

export interface TableColumnConfig<T = unknown> extends Omit<ColumnConfig, 'key'> {
  key: keyof T | string;
  visible: boolean;
}

// Search Types
export interface TableSearchConfig {
  placeholder: string;
  debounceTime?: number;
  minLength?: number;
  searchKeys?: string[];
}

// State Types
export interface TableEmptyStateConfig {
  title: string;
  description?: string;
  icon?: string;
  actionLabel?: string;
  actionCallback?: () => void;
}

export interface TableLoadingStateConfig {
  text?: string;
  showSpinner?: boolean;
  rows?: number;
  columns?: number;
}

// Table Header Types
export interface TableHeaderConfig {
  title: string;
  description?: string;
  showActions?: boolean;
}

// Sort Types
export interface SortConfig<T = unknown> {
  key: keyof T | string;
  direction: 'asc' | 'desc';
}

// Filter Types
export interface FilterConfig<T = unknown> {
  key: keyof T | string;
  value: unknown;
  operator?: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'startsWith' | 'endsWith';
}

// Table State
export interface TableState<T = unknown> {
  data: T[];
  pagination: PaginationState;
  sort?: SortConfig<T>;
  filters?: FilterConfig<T>[];
  search?: string;
  selectedRows?: T[];
}

// Events
export interface TablePageChangeEvent {
  currentPage: number;
  pageSize: number;
}

export interface TableSortChangeEvent<T = unknown> {
  column: TableColumn<T>;
  direction: 'asc' | 'desc';
}

export interface TableFilterChangeEvent<T = unknown> {
  filters: FilterConfig<T>[];
}

export interface TableSelectionChangeEvent<T = unknown> {
  selectedRows: T[];
}
