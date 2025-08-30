import { Signal } from '@angular/core';

export interface SearchConfig {
  placeholder?: string;
  debounceTime?: number;
  minLength?: number;
  maxLength?: number;
  caseSensitive?: boolean;
  searchKeys?: string[];
  fuzzySearch?: boolean;
  highlightMatches?: boolean;
}

export interface SearchResult<T = unknown> {
  item: T;
  score?: number;
  highlights?: SearchHighlight[];
}

export interface SearchHighlight {
  key: string;
  indices: Array<[number, number]>;
}

export interface AdvancedSearchConfig extends SearchConfig {
  enableFilters?: boolean;
  enableSorting?: boolean;
  enableDateRange?: boolean;
  customFields?: SearchField[];
}

export interface SearchField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select';
  searchable?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  options?: Array<{ value: string; label: string }>;
}

export interface SearchState {
  term: string;
  isSearching: boolean;
  results: unknown[];
  totalResults: number;
  searchTime?: number;
  error?: string;
}

export interface SearchModalConfig<T = unknown> {
  title?: string;
  searchConfig: AdvancedSearchConfig;
  data?: T[];
  searchService?: SearchService<T>;
  multiple?: boolean;
  showRecent?: boolean;
  recentItemsKey?: string;
  maxRecentItems?: number;
}

export interface SearchModalResult<T = unknown> {
  selected: T | T[] | null;
  searchTerm?: string;
  filters?: Record<string, unknown>;
}

// Search service interface
export interface SearchService<T = unknown> {
  // State
  searchState: Signal<SearchState>;

  // Configuration
  config: Signal<SearchConfig>;

  // Methods
  search(term: string, data?: T[]): Promise<SearchResult<T>[]>;
  clearSearch(): void;
  setConfig(config: Partial<SearchConfig>): void;

  // Recent searches
  recentSearches: Signal<string[]>;
  addRecentSearch(term: string): void;
  clearRecentSearches(): void;
}

// Search criteria for advanced search
export interface SearchCriteria {
  searchTerm?: string;
  filters?: Record<string, unknown>;
  dateRange?: {
    start: Date | null;
    end: Date | null;
  };
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

// Search operators for advanced filtering
export type SearchOperator =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'notContains'
  | 'startsWith'
  | 'endsWith'
  | 'greaterThan'
  | 'lessThan'
  | 'greaterThanOrEqual'
  | 'lessThanOrEqual'
  | 'between'
  | 'in'
  | 'notIn';

export interface SearchFilter {
  field: string;
  operator: SearchOperator;
  value: unknown;
  label?: string;
}
