import { Pipe, PipeTransform } from '@angular/core';
import { SortConfig } from '../types/table.types';

/**
 * Pipe for sorting table data
 * Supports nested object properties using dot notation (e.g., 'user.name')
 */
@Pipe({
  name: 'tableSort',
  pure: true,
})
export class TableSortPipe implements PipeTransform {
  transform<T extends Record<string, unknown>>(items: T[], sortConfig?: SortConfig<T> | null): T[] {
    if (!items || !items.length || !sortConfig) {
      return items;
    }

    const { key, direction } = sortConfig;

    return [...items].sort((a, b) => {
      const aValue = this.getNestedValue(a, key as string);
      const bValue = this.getNestedValue(b, key as string);

      const comparison = this.compareValues(aValue, bValue);

      return direction === 'asc' ? comparison : -comparison;
    });
  }

  private getNestedValue(obj: Record<string, unknown>, path: string): unknown {
    const keys = path.split('.');
    let value: unknown = obj;

    for (const key of keys) {
      value = (value as Record<string, unknown>)?.[key];
      if (value === undefined || value === null) {
        return null;
      }
    }

    return value;
  }

  private compareValues(a: unknown, b: unknown): number {
    // Handle null/undefined values
    if (a === null || a === undefined) {
      return b === null || b === undefined ? 0 : 1;
    }
    if (b === null || b === undefined) {
      return -1;
    }

    // Handle dates
    if (a instanceof Date && b instanceof Date) {
      return a.getTime() - b.getTime();
    }

    // Handle objects with display properties
    if (typeof a === 'object' && typeof b === 'object') {
      const aDisplay = this.getDisplayValue(a as Record<string, unknown>);
      const bDisplay = this.getDisplayValue(b as Record<string, unknown>);
      return this.compareValues(aDisplay, bDisplay);
    }

    // Handle numbers
    if (typeof a === 'number' && typeof b === 'number') {
      return a - b;
    }

    // Handle booleans (false first in ascending order)
    if (typeof a === 'boolean' && typeof b === 'boolean') {
      return a === b ? 0 : a ? 1 : -1;
    }

    // Convert to strings for comparison
    const aStr = String(a).toLowerCase();
    const bStr = String(b).toLowerCase();

    // Natural sort for strings with numbers
    return this.naturalSort(aStr, bStr);
  }

  private getDisplayValue(obj: Record<string, unknown>): unknown {
    return obj['name'] || obj['title'] || obj['label'] || obj['code'] || obj['role_name'] || '';
  }

  private naturalSort(a: string, b: string): number {
    // Check if both strings are purely numeric
    const aNum = Number(a);
    const bNum = Number(b);

    if (!isNaN(aNum) && !isNaN(bNum)) {
      return aNum - bNum;
    }

    // Natural alphanumeric sort
    const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
    return collator.compare(a, b);
  }
}
