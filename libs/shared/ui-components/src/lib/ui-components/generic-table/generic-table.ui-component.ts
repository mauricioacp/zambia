import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ContentChildren,
  input,
  output,
  QueryList,
  TemplateRef,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColumnTemplateDirective } from '../../directives/column-template.directive';
import {
  TuiTable,
  TuiTablePagination,
  TuiTableFilters,
  TuiReorder,
  type TuiTablePaginationEvent,
  type TuiSortChange,
} from '@taiga-ui/addon-table';
import { TuiLet } from '@taiga-ui/cdk';
import { TuiButton } from '@taiga-ui/core/components/button';
import { TuiIcon } from '@taiga-ui/core/components/icon';
import { TuiSkeleton } from '@taiga-ui/kit';

@Component({
  selector: 'z-generic-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TuiTable,
    TuiTablePagination,
    TuiTableFilters,
    TuiReorder,
    TuiLet,
    TuiButton,
    TuiIcon,
    TuiSkeleton,
  ],
  template: `
    <div class="rounded-lg bg-white shadow-md dark:bg-slate-800 dark:shadow-gray-900/30">
      <!-- Table Configuration Controls -->
      @if (showTableControls()) {
        <div class="border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <!-- Column Reordering -->
            @if (enableColumnReordering()) {
              <button
                tuiButton
                type="button"
                appearance="outline"
                size="s"
                (click)="toggleColumnReordering()"
                class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <tui-icon icon="@tui.settings" class="mr-2" />
                Configure Columns
              </button>
            }

            <!-- Search/Filter -->
            @if (enableFiltering()) {
              <div class="max-w-sm flex-1">
                <input
                  type="text"
                  placeholder="Search..."
                  [value]="searchTerm()"
                  (input)="onSearchChange($event)"
                  class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-400"
                />
              </div>
            }
          </div>

          <!-- Column Reordering Interface -->
          @if (showColumnReorderingInterface()) {
            <div class="mt-4 rounded-md border border-gray-200 bg-white p-3 dark:border-gray-600 dark:bg-gray-800">
              <h4 class="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Reorder Columns</h4>
              <tui-reorder
                [items]="reorderableColumns()"
                [enabled]="enabledColumns()"
                (itemsChange)="onColumnsReorder($event)"
                (enabledChange)="onColumnsToggle($event)"
              />
            </div>
          }
        </div>
      }

      <!-- Table Content -->
      @if (paginatedItems().length > 0) {
        <div class="overflow-x-auto">
          <table
            [tuiSkeleton]="loading()"
            class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
            tuiTable
            [size]="tableSize()"
            [columns]="displayHeaders()"
            tuiTheme="dark"
          >
            <thead class="bg-gray-50 dark:bg-gray-900" tuiThead>
              <tr tuiThGroup>
                @for (header of displayHeaders(); track header) {
                  <th
                    tuiTh
                    scope="col"
                    class="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase sm:px-6 dark:text-gray-300"
                    [style.min-width.px]="getColumnWidth(header)"
                  >
                    {{ displayLabels()[header] || header }}
                  </th>
                }
              </tr>
            </thead>
            <tbody
              class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-slate-800"
              tuiTbody
              *tuiLet="paginatedItems() | tuiTableSort as sortedItems"
              [data]="sortedItems"
            >
              @for (item of sortedItems; track getTrackBy(item)) {
                <tr
                  tuiTr
                  class="transition-colors hover:bg-gray-50 dark:hover:bg-slate-700"
                  [class.bg-blue-50]="isSelected(item)"
                  [ngClass]="isSelected(item) ? 'dark:bg-blue-[900/20]' : ''"
                  (click)="onRowClick(item)"
                >
                  @for (header of displayHeaders(); track header) {
                    <td
                      class="px-4 py-4 text-sm text-gray-700 sm:px-6 dark:text-gray-300"
                      [class.whitespace-nowrap]="!isTextColumn(header)"
                      tuiTd
                      *tuiCell="header"
                    >
                      @if (getColumnTemplate(header); as template) {
                        <ng-container *ngTemplateOutlet="template; context: { $implicit: item, item: item }" />
                      } @else if (header === 'status') {
                        @let status = getStatusDisplay(item[header]);
                        @let statusColor = getStatusColor(item[header]);
                        <span
                          class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                          [class]="getStatusClasses(item[header])"
                        >
                          {{ status }}
                        </span>
                      } @else {
                        {{ formatCellValue(item[header]) }}
                      }
                    </td>
                  }
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        @if (enablePagination() && totalItems() > pageSize()) {
          <div class="border-t border-gray-200 bg-gray-50 px-4 py-3 sm:px-6 dark:border-gray-700 dark:bg-gray-900">
            <tui-table-pagination
              [total]="totalItems()"
              [page]="currentPage()"
              [size]="pageSize()"
              [items]="pageSizeOptions()"
              (paginationChange)="onPaginationChange($event)"
            />
          </div>
        }
      } @else {
        <div class="px-6 py-8">
          <div
            class="rounded-md border-l-4 border-yellow-400 bg-yellow-50 p-4 dark:border-yellow-500 dark:bg-yellow-900/30"
          >
            <div class="flex items-center">
              <tui-icon icon="@tui.alert-triangle" class="h-5 w-5 text-yellow-400 dark:text-yellow-300" />
              <p class="ml-3 text-sm text-yellow-700 dark:text-yellow-300">{{ emptyMessage() }}</p>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenericTableUiComponent<T extends Record<string, unknown>> {
  loading = input<boolean>(false);
  items = input<T[]>([]);
  headers = input<string[]>([]);
  headerLabels = input<Record<string, string>>({});
  emptyMessage = input<string>('No data available');
  trackBy = input<string>('id');

  enablePagination = input<boolean>(true);
  enableSorting = input<boolean>(true);
  enableFiltering = input<boolean>(true);
  enableColumnReordering = input<boolean>(false);
  enableRowSelection = input<boolean>(false);
  showTableControls = input<boolean>(false);
  tableSize = input<'s' | 'm' | 'l'>('m');

  pageSize = input<number>(10);
  pageSizeOptions = input<number[]>([5, 10, 20, 50, 100]);

  sortableColumns = input<string[]>([]);
  columnWidths = input<Record<string, number>>({});
  textColumns = input<string[]>(['description', 'notes', 'comment']);

  itemsSelectionChange = output<T[]>();
  sortChange = output<TuiSortChange<T>>();
  paginationChange = output<TuiTablePaginationEvent>();
  rowClick = output<T>();

  currentPage = signal(0);
  searchTerm = signal('');
  selectedItems = signal<T[]>([]);
  reorderableColumns = signal<string[]>([]);
  enabledColumns = signal<string[]>([]);
  showColumnReorderingInterface = signal(false);

  @ContentChildren(ColumnTemplateDirective) columnTemplates?: QueryList<ColumnTemplateDirective<T>>;

  displayHeaders = computed(() => {
    const enabledCols = this.enabledColumns();
    const providedHeaders = this.headers();
    const currentItems = this.items();

    let headers: string[];
    if (providedHeaders.length > 0) {
      headers = providedHeaders;
    } else if (currentItems && currentItems.length > 0) {
      headers = Object.keys(currentItems[0]);
    } else {
      headers = [];
    }

    if (enabledCols.length > 0) {
      return headers.filter((header) => enabledCols.includes(header));
    }

    return headers;
  });

  displayLabels = computed(() => this.headerLabels() || {});

  filteredItems = computed(() => {
    const items = this.items();
    const searchTerm = this.searchTerm().toLowerCase().trim();

    if (!searchTerm) {
      return items;
    }

    return items.filter((item) =>
      Object.values(item).some((value) => String(value).toLowerCase().includes(searchTerm))
    );
  });

  totalItems = computed(() => this.filteredItems().length);

  paginatedItems = computed(() => {
    const filtered = this.filteredItems();

    if (!this.enablePagination()) {
      return filtered;
    }

    const start = this.currentPage() * this.pageSize();
    const end = start + this.pageSize();
    return filtered.slice(start, end);
  });

  getColumnTemplate(columnName: string): TemplateRef<any> | null {
    if (!this.columnTemplates) {
      return null;
    }

    const templateDir = this.columnTemplates.find((dir) => dir.columnName === columnName);
    return templateDir ? templateDir.template : null;
  }

  getTrackBy(item: T): unknown {
    const trackByProp = this.trackBy();

    if (trackByProp && trackByProp in item) {
      return item[trackByProp];
    }

    if ('id' in item && item?.['id'] !== undefined) {
      return item?.['id'];
    }

    if ('name' in item && item['name'] !== undefined) {
      return item['name'];
    }

    return JSON.stringify(item);
  }

  isSortable(column: string): boolean {
    if (!this.enableSorting()) return false;

    const sortableCols = this.sortableColumns();
    return sortableCols.length === 0 || sortableCols.includes(column);
  }

  getColumnWidth(column: string): number | undefined {
    return this.columnWidths()[column];
  }

  isTextColumn(column: string): boolean {
    return this.textColumns().includes(column);
  }

  isSelected(item: T): boolean {
    if (!this.enableRowSelection()) return false;

    return this.selectedItems().some((selected) => this.getTrackBy(selected) === this.getTrackBy(item));
  }

  getStatusDisplay(status: unknown): string {
    if (typeof status === 'string') {
      return status === 'active' ? 'Active' : 'Inactive';
    }
    return String(status);
  }

  getStatusColor(status: unknown): string {
    if (typeof status === 'string') {
      return status === 'active' ? 'var(--tui-status-positive)' : 'var(--tui-status-negative)';
    }
    return 'var(--tui-status-neutral)';
  }

  getStatusClasses(status: unknown): string {
    if (typeof status === 'string') {
      return status === 'active'
        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    }
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
  }

  formatCellValue(value: unknown): string {
    if (value === null || value === undefined) {
      return '-';
    }

    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }

    if (typeof value === 'number') {
      return value.toLocaleString();
    }

    return String(value);
  }

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
    this.currentPage.set(0);
  }

  onPaginationChange(event: TuiTablePaginationEvent): void {
    this.currentPage.set(event.page);
    this.paginationChange.emit(event);
  }

  onRowClick(item: T): void {
    if (this.enableRowSelection()) {
      const selected = this.selectedItems();
      const itemKey = this.getTrackBy(item);
      const isCurrentlySelected = selected.some((s) => this.getTrackBy(s) === itemKey);

      if (isCurrentlySelected) {
        this.selectedItems.set(selected.filter((s) => this.getTrackBy(s) !== itemKey));
      } else {
        this.selectedItems.set([...selected, item]);
      }

      this.itemsSelectionChange.emit(this.selectedItems());
    }

    this.rowClick.emit(item);
  }

  toggleColumnReordering(): void {
    const show = !this.showColumnReorderingInterface();
    this.showColumnReorderingInterface.set(show);

    if (show && this.reorderableColumns().length === 0) {
      // Initialize reorderable columns
      const headers = this.displayHeaders();
      this.reorderableColumns.set([...headers]);
      this.enabledColumns.set([...headers]);
    }
  }

  onColumnsReorder(orderedColumns: string[]): void {
    this.reorderableColumns.set(orderedColumns);
  }

  onColumnsToggle(enabledColumns: string[]): void {
    this.enabledColumns.set(enabledColumns);
  }

  // Legacy selection methods (for backward compatibility)
  protected get checked(): boolean | null {
    const items = this.items();
    const every = items.every((item: any) => item.selected);
    const some = items.some((item: any) => item.selected);

    return every || (some && null);
  }

  protected onCheck(checked: boolean): void {
    const updatedItems = this.items().map((item: any) => ({
      ...item,
      selected: checked,
    }));
    this.itemsSelectionChange.emit(updatedItems);
  }

  protected onItemCheck(item: T, checked: boolean): void {
    const updatedItems = this.items().map((currentItem) =>
      this.getTrackBy(currentItem) === this.getTrackBy(item) ? { ...currentItem, selected: checked } : currentItem
    );
    this.itemsSelectionChange.emit(updatedItems);
  }
}
