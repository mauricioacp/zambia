import { Pipe, PipeTransform } from '@angular/core';
import { SortConfig } from '@zambia/ui-table-primitives';

@Pipe({
  name: 'tableSort',
  pure: true,
})
export class TableSortPipe implements PipeTransform {
  transform<T extends Record<string, any>>(items: T[], sortConfig?: SortConfig<T> | null): T[] {
    if (!items || !sortConfig) {
      return items;
    }

    const { key, direction } = sortConfig;

    return [...items].sort((a, b) => {
      const aValue = this.getValue(a, key as string);
      const bValue = this.getValue(b, key as string);

      // Handle null/undefined values
      if (aValue === null || aValue === undefined) return direction === 'asc' ? 1 : -1;
      if (bValue === null || bValue === undefined) return direction === 'asc' ? -1 : 1;

      // Compare values
      let comparison = 0;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.toLowerCase().localeCompare(bValue.toLowerCase());
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else if (aValue instanceof Date && bValue instanceof Date) {
        comparison = aValue.getTime() - bValue.getTime();
      } else {
        // Fallback to string comparison
        comparison = String(aValue).toLowerCase().localeCompare(String(bValue).toLowerCase());
      }

      return direction === 'asc' ? comparison : -comparison;
    });
  }

  private getValue(obj: any, path: string): any {
    // Handle nested properties (e.g., 'user.name')
    const keys = path.split('.');
    let value = obj;

    for (const key of keys) {
      if (value === null || value === undefined) {
        return null;
      }
      value = value[key];
    }

    return value;
  }
}
