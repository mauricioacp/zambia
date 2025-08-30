import { Pipe, PipeTransform } from '@angular/core';
import { FilterConfig } from '@zambia/ui-table-primitives';

@Pipe({
  name: 'tableFilter',
  pure: true,
})
export class TableFilterPipe implements PipeTransform {
  transform<T extends Record<string, any>>(items: T[], filters?: FilterConfig<T>[] | null): T[] {
    if (!items || !filters || filters.length === 0) {
      return items;
    }

    return items.filter((item) => {
      // All filters must match (AND logic)
      return filters.every((filter) => this.matchesFilter(item, filter));
    });
  }

  private matchesFilter<T extends Record<string, any>>(item: T, filter: FilterConfig<T>): boolean {
    const value = this.getValue(item, filter.key as string);
    const filterValue = filter.value;
    const operator = filter.operator || 'eq';

    // Handle null/undefined
    if (value === null || value === undefined) {
      return filterValue === null || filterValue === undefined;
    }

    switch (operator) {
      case 'eq':
        return value === filterValue;

      case 'neq':
        return value !== filterValue;

      case 'gt':
        return Number(value) > Number(filterValue);

      case 'gte':
        return Number(value) >= Number(filterValue);

      case 'lt':
        return Number(value) < Number(filterValue);

      case 'lte':
        return Number(value) <= Number(filterValue);

      case 'contains':
        return String(value).toLowerCase().includes(String(filterValue).toLowerCase());

      case 'startsWith':
        return String(value).toLowerCase().startsWith(String(filterValue).toLowerCase());

      case 'endsWith':
        return String(value).toLowerCase().endsWith(String(filterValue).toLowerCase());

      default:
        return value === filterValue;
    }
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
