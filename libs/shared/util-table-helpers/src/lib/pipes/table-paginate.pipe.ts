import { Pipe, PipeTransform } from '@angular/core';
import { PaginationState } from '@zambia/ui-table-primitives';

@Pipe({
  name: 'tablePaginate',
  pure: true,
})
export class TablePaginatePipe implements PipeTransform {
  transform<T>(items: T[], pagination?: PaginationState | null): T[] {
    if (!items || !pagination) {
      return items;
    }

    const { currentPage, pageSize } = pagination;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return items.slice(startIndex, endIndex);
  }
}
