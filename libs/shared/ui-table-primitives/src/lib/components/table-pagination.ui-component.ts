import { Component, input, output, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TuiButton, TuiIcon, TuiDataList, TuiDropdown } from '@taiga-ui/core';
import { TablePaginationConfig } from '../types/table-primitives.types';

@Component({
  selector: 'z-table-pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, TuiButton, TuiIcon, TuiDropdown, TuiDataList],
  template: `
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <!-- Page info -->
      <div class="text-sm text-gray-700 dark:text-gray-300">
        Showing
        <span class="font-medium">{{ startItem() }}</span>
        to
        <span class="font-medium">{{ endItem() }}</span>
        of
        <span class="font-medium">{{ config().totalItems }}</span>
        results
      </div>

      <div class="flex items-center gap-4">
        <!-- Page size selector -->
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-700 dark:text-gray-300">Items per page:</span>
          <button
            tuiButton
            type="button"
            appearance="secondary"
            size="s"
            [tuiDropdown]="pageSizeDropdown"
            [tuiDropdownOpen]="pageSizeDropdownOpen()"
            (tuiDropdownOpenChange)="pageSizeDropdownOpen.set($event)"
            class="min-w-[80px]"
          >
            {{ config().pageSize }}
            <tui-icon
              icon="@tui.chevron-down"
              class="ml-1 transition-transform"
              [class.rotate-180]="pageSizeDropdownOpen()"
            />
          </button>
          <ng-template #pageSizeDropdown>
            <tui-data-list>
              @for (size of config().pageSizeOptions; track size) {
                <button
                  tuiOption
                  type="button"
                  (click)="selectPageSize(size)"
                  [class.bg-gray-100.dark:bg-slate-700]="size === config().pageSize"
                >
                  {{ size }}
                </button>
              }
            </tui-data-list>
          </ng-template>
        </div>

        <!-- Navigation buttons -->
        <nav class="flex items-center gap-1" aria-label="Pagination">
          <button
            tuiButton
            type="button"
            appearance="secondary"
            size="s"
            icon="@tui.chevron-left"
            [disabled]="!canGoPrevious()"
            (click)="goToPage(config().currentPage - 1)"
            aria-label="Previous page"
          ></button>

          <!-- Page numbers -->
          <div class="hidden items-center gap-1 sm:flex">
            @for (page of displayedPages(); track page) {
              @if (page === '...') {
                <span class="px-2 text-gray-400 dark:text-gray-500">...</span>
              } @else {
                <button
                  tuiButton
                  type="button"
                  [appearance]="page === config().currentPage ? 'primary' : 'secondary'"
                  size="s"
                  (click)="goToPage(page)"
                  class="min-w-[40px]"
                >
                  {{ page }}
                </button>
              }
            }
          </div>

          <!-- Mobile page indicator -->
          <span class="px-3 text-sm text-gray-700 sm:hidden dark:text-gray-300">
            {{ config().currentPage }} / {{ totalPages() }}
          </span>

          <button
            tuiButton
            type="button"
            appearance="secondary"
            size="s"
            icon="@tui.chevron-right"
            [disabled]="!canGoNext()"
            (click)="goToPage(config().currentPage + 1)"
            aria-label="Next page"
          ></button>
        </nav>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class TablePaginationComponent {
  config = input.required<TablePaginationConfig>();
  pageChange = output<number>();
  pageSizeChange = output<number>();

  pageSizeDropdownOpen = signal(false);

  totalPages = computed(() => Math.ceil(this.config().totalItems / this.config().pageSize));

  startItem = computed(() => {
    const { currentPage, pageSize } = this.config();
    return Math.min((currentPage - 1) * pageSize + 1, this.config().totalItems);
  });

  endItem = computed(() => {
    const { currentPage, pageSize, totalItems } = this.config();
    return Math.min(currentPage * pageSize, totalItems);
  });

  canGoPrevious = computed(() => this.config().currentPage > 1);
  canGoNext = computed(() => this.config().currentPage < this.totalPages());

  displayedPages = computed(() => {
    const current = this.config().currentPage;
    const total = this.totalPages();
    const pages: (number | string)[] = [];

    if (total <= 7) {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (current > 3) {
        pages.push('...');
      }

      // Show pages around current
      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (current < total - 2) {
        pages.push('...');
      }

      // Always show last page
      pages.push(total);
    }

    return pages;
  });

  goToPage(page: number | string): void {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages()) {
      this.pageChange.emit(page);
    }
  }

  selectPageSize(size: number): void {
    this.pageSizeChange.emit(size);
    this.pageSizeDropdownOpen.set(false);
  }
}
