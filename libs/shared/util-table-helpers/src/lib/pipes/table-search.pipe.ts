import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tableSearch',
  pure: true,
})
export class TableSearchPipe implements PipeTransform {
  transform<T extends Record<string, any>>(items: T[], searchTerm: string, searchKeys?: (keyof T)[]): T[] {
    if (!items || !searchTerm || searchTerm.trim() === '') {
      return items;
    }

    const term = searchTerm.toLowerCase().trim();

    return items.filter((item) => {
      // If searchKeys are specified, only search in those fields
      if (searchKeys && searchKeys.length > 0) {
        return searchKeys.some((key) => {
          const value = item[key];
          return this.searchInValue(value, term);
        });
      }

      // Otherwise, search in all string/number fields
      return Object.values(item).some((value) => this.searchInValue(value, term));
    });
  }

  private searchInValue(value: any, term: string): boolean {
    if (value === null || value === undefined) {
      return false;
    }

    // Handle string values
    if (typeof value === 'string') {
      return value.toLowerCase().includes(term);
    }

    // Handle number values
    if (typeof value === 'number') {
      return value.toString().includes(term);
    }

    // Handle nested objects (one level deep)
    if (typeof value === 'object' && !Array.isArray(value)) {
      return Object.values(value).some((nestedValue) => this.searchInValue(nestedValue, term));
    }

    // Handle arrays
    if (Array.isArray(value)) {
      return value.some((item) => this.searchInValue(item, term));
    }

    return false;
  }
}
