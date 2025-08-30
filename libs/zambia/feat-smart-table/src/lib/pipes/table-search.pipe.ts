import { Pipe, PipeTransform } from '@angular/core';
import { TUI_DEFAULT_MATCHER } from '@taiga-ui/cdk';

/**
 * Pipe for filtering table data based on search term
 * Supports nested object properties using dot notation (e.g., 'user.name')
 */
@Pipe({
  name: 'tableSearch',
  pure: true,
})
export class TableSearchPipe implements PipeTransform {
  transform<T extends Record<string, unknown>>(items: T[], searchTerm: string, searchableColumns?: string[]): T[] {
    if (!items || !items.length) {
      return items;
    }

    if (!searchTerm || searchTerm.trim() === '') {
      return items;
    }

    const term = searchTerm.toLowerCase().trim();

    return items.filter((item) => {
      // If no searchable columns specified, search all string/number properties
      if (!searchableColumns || searchableColumns.length === 0) {
        return this.searchAllProperties(item, term);
      }

      // Search only in specified columns
      return searchableColumns.some((column) => {
        const value = this.getNestedValue(item, column);
        return this.matchValue(value, term);
      });
    });
  }

  private searchAllProperties(item: Record<string, unknown>, term: string): boolean {
    for (const key in item) {
      if (Object.prototype.hasOwnProperty.call(item, key)) {
        const value = item[key];
        if (this.matchValue(value, term)) {
          return true;
        }
      }
    }
    return false;
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

  private matchValue(value: unknown, term: string): boolean {
    if (value === null || value === undefined) {
      return false;
    }

    // Handle objects with common display properties
    if (typeof value === 'object' && value !== null) {
      const obj = value as Record<string, unknown>;
      // Check common display properties
      const displayValue = obj['name'] || obj['title'] || obj['label'] || obj['code'] || obj['role_name'];
      if (displayValue) {
        return this.matchValue(displayValue, term);
      }
      return false;
    }

    // Convert to string and use TaigaUI's matcher for consistency
    const stringValue = String(value);
    return TUI_DEFAULT_MATCHER(stringValue, term);
  }
}
