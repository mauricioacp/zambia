import { Signal } from '@angular/core';

export interface FilterOption<T = string> {
  value: T;
  label: string;
  icon?: string;
  disabled?: boolean;
  count?: number;
}

export interface FilterGroup<T = string> {
  label: string;
  options: FilterOption<T>[];
}

export interface BaseFilterConfig<T = unknown> {
  label: string;
  placeholder?: string;
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  icon?: string;
  disabled?: boolean;
  options?: FilterOption<T>[] | FilterGroup<T>[];
}

export interface SingleSelectFilterConfig<T = unknown> extends BaseFilterConfig<T> {
  multiple?: false;
  value?: T;
}

export interface MultiSelectFilterConfig<T = unknown> extends BaseFilterConfig<T> {
  multiple: true;
  value?: T[];
}

export type FilterConfig<T = unknown> = SingleSelectFilterConfig<T> | MultiSelectFilterConfig<T>;

// Filter events
export interface FilterChangeEvent<T = unknown> {
  value: T | T[] | null;
  filterKey: string;
}

// Filter state
export interface FilterState {
  [key: string]: unknown;
}

// Advanced filter types
export interface DateRangeFilter {
  start: Date | null;
  end: Date | null;
}

export interface NumberRangeFilter {
  min: number | null;
  max: number | null;
}

export interface TextFilter {
  value: string;
  operator: 'contains' | 'equals' | 'startsWith' | 'endsWith';
  caseSensitive?: boolean;
}

// Filter definitions for different data types
export type FilterType =
  | 'text'
  | 'number'
  | 'date'
  | 'select'
  | 'multiselect'
  | 'boolean'
  | 'dateRange'
  | 'numberRange';

export interface FilterDefinition {
  key: string;
  label: string;
  type: FilterType;
  config?: Partial<FilterConfig>;
  defaultValue?: unknown;
  validator?: (value: unknown) => boolean;
  formatter?: (value: unknown) => string;
}

// Filter preset
export interface FilterPreset {
  id: string;
  name: string;
  description?: string;
  filters: FilterState;
  isDefault?: boolean;
}

// Filter service interface
export interface TableFilterService<T = unknown> {
  // Current filter state
  filters: Signal<FilterState>;

  // Available filter definitions
  filterDefinitions: Signal<FilterDefinition[]>;

  // Filter presets
  presets: Signal<FilterPreset[]>;
  activePreset: Signal<FilterPreset | null>;

  // Methods
  setFilter(key: string, value: unknown): void;
  removeFilter(key: string): void;
  clearFilters(): void;
  applyPreset(presetId: string): void;
  savePreset(name: string, description?: string): void;
  deletePreset(presetId: string): void;

  // Filter data
  filterData(data: T[]): T[];
}
