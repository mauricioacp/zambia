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
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColumnTemplateDirective } from '../../directives/column-template.directive';
import { TuiTable, TuiTablePagination, type TuiTablePaginationEvent, type TuiSortChange } from '@taiga-ui/addon-table';
import { TUI_DEFAULT_MATCHER, TuiLet } from '@taiga-ui/cdk';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { TuiButton } from '@taiga-ui/core/components/button';
import { TuiIcon } from '@taiga-ui/core/components/icon';
import { TuiDropdownDirective, TuiDropdownOpen } from '@taiga-ui/core/directives/dropdown';
import { TuiDataList } from '@taiga-ui/core/components/data-list';
import { TuiSkeleton } from '@taiga-ui/kit';
import { TuiLabel, TuiTextfieldComponent, TuiTextfieldDirective, TuiTextfieldOptionsDirective } from '@taiga-ui/core';

@Component({
  selector: 'z-generic-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TuiTable,
    TuiTablePagination,
    TuiLet,
    TuiButton,
    TuiIcon,
    TuiDropdownDirective,
    TuiDropdownOpen,
    TuiDataList,
    TuiSkeleton,
    TuiTextfieldDirective,
    TuiTextfieldComponent,
    TuiLabel,
    TuiTextfieldOptionsDirective,
  ],
  template: `
    <div class="rounded-lg bg-white shadow-md dark:bg-slate-800 dark:shadow-gray-900/30">
      <!-- Table Configuration Controls -->
      @if (showTableControls()) {
        <div class="border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <!-- Column Visibility -->
            @if (enableColumnVisibility()) {
              <div class="relative">
                <button
                  tuiButton
                  type="button"
                  appearance="outline"
                  size="s"
                  [tuiDropdown]="columnDropdown"
                  [(tuiDropdownOpen)]="showColumnDropdown"
                  class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <tui-icon icon="@tui.eye" class="mr-2" />
                  Show/Hide Columns
                </button>

                <ng-template #columnDropdown>
                  <tui-data-list class="w-64" role="menu">
                    <div class="p-3">
                      <h4 class="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Column Visibility</h4>
                      @for (column of allAvailableColumns(); track column) {
                        <div>
                          <input
                            id="{{ column }}"
                            type="checkbox"
                            [checked]="isColumnVisible(column)"
                            (change)="onColumnVisibilityChange(column, $event)"
                            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                          />
                          <span class="text-sm text-gray-700 dark:text-gray-300">
                            {{ displayLabels()[column] || column }}
                          </span>
                        </div>
                      }

                      <div class="mt-3 border-t border-gray-200 pt-3 dark:border-gray-600">
                        <button
                          type="button"
                          (click)="resetColumnVisibility()"
                          class="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Mostrar todo
                        </button>
                      </div>
                    </div>
                  </tui-data-list>
                </ng-template>
              </div>
            }

            <!-- Search/Filter -->
            @if (enableFiltering()) {
              <div class="max-w-sm flex-1">
                <tui-textfield [tuiTextfieldSize]="'m'">
                  <label for="search" tuiLabel>{{ getSearchPlaceholder() }}</label>
                  <input tuiTextfield [value]="searchInputValue()" (input)="onSearchChange($event)" />
                </tui-textfield>
                @if (searchableColumns().length > 0) {
                  <div class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Buscando en: {{ getSearchableColumnsDisplay() }}
                  </div>
                }
              </div>
            }
          </div>
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
  enableColumnVisibility = input<boolean>(true);
  enableRowSelection = input<boolean>(false);
  showTableControls = input<boolean>(false);
  tableSize = input<'s' | 'm' | 'l'>('m');

  pageSize = input<number>(10);
  pageSizeOptions = input<number[]>([5, 10, 20, 50, 100]);

  // Search configuration
  searchDebounceTime = input<number>(300);
  searchableColumns = input<string[]>([]);
  searchTransformers = input<Record<string, (value: any) => string>>({}); // Custom transformers for specific columns

  sortableColumns = input<string[]>([]);
  columnWidths = input<Record<string, number>>({});
  textColumns = input<string[]>(['description', 'notes', 'comment']);

  itemsSelectionChange = output<T[]>();
  sortChange = output<TuiSortChange<T>>();
  paginationChange = output<TuiTablePaginationEvent>();
  rowClick = output<T>();

  currentPage = signal(0);
  searchInputValue = signal('');
  selectedItems = signal<T[]>([]);
  visibleColumns = signal<string[]>([]);
  showColumnDropdown = signal(false);

  // Debounced search term using RxJS interop
  searchTerm = toSignal(
    toObservable(this.searchInputValue).pipe(
      debounceTime(300), // Use default 300ms for now, can be made configurable later
      distinctUntilChanged(),
      map((term) => term.toLowerCase().trim())
    ),
    { initialValue: '' }
  );

  @ContentChildren(ColumnTemplateDirective) columnTemplates?: QueryList<ColumnTemplateDirective<T>>;

  allAvailableColumns = computed(() => {
    const providedHeaders = this.headers();
    const currentItems = this.items();

    if (providedHeaders.length > 0) {
      return providedHeaders;
    } else if (currentItems && currentItems.length > 0) {
      return Object.keys(currentItems[0]);
    } else {
      return [];
    }
  });

  displayHeaders = computed(() => {
    const allColumns = this.allAvailableColumns();
    const visibleCols = this.visibleColumns();

    // If no visible columns are set, show all columns
    if (visibleCols.length === 0) {
      return allColumns;
    }

    // Filter to only show visible columns in the same order as allColumns
    return allColumns.filter((header) => visibleCols.includes(header));
  });

  displayLabels = computed(() => this.headerLabels() || {});

  filteredItems = computed(() => {
    const items = this.items();
    const searchTerm = this.searchTerm();

    if (!searchTerm) return items;

    const searchableColumns = this.searchableColumns();
    const allColumns = this.allAvailableColumns();

    // Determine which columns to search in
    const columnsToSearch = searchableColumns.length > 0 ? searchableColumns : allColumns;

    return items.filter((item) =>
      columnsToSearch.some((column) => {
        const value = this.getSearchableValueForColumn(item, column);
        if (value === null || value === undefined) return false;

        // Use TUI_DEFAULT_MATCHER for better matching (handles accents, special chars, etc.)
        return TUI_DEFAULT_MATCHER(value, searchTerm);
      })
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
    this.searchInputValue.set(target.value);
    // Page reset is handled automatically by the effect
  }

  getSearchPlaceholder(): string {
    const searchableColumns = this.searchableColumns();
    if (searchableColumns.length === 0) {
      return 'Buscar en todas las columnas...';
    }
    return `Buscar en ${searchableColumns.length} columna${searchableColumns.length > 1 ? 's' : ''}...`;
  }

  getSearchableColumnsDisplay(): string {
    const searchableColumns = this.searchableColumns();
    const labels = this.displayLabels();

    return searchableColumns
      .map(column => labels[column] || column)
      .join(', ');
  }

  getSearchableValueForColumn(item: T, column: string): unknown {
    const value = item[column];
    const transformers = this.searchTransformers();

    if (transformers[column]) {
      return transformers[column](value);
    }

    if (value && typeof value === 'object') {
      if (column === 'country' || column === 'countries') {
        const countryObj = value as any;
        if (countryObj.name && countryObj.code) {
          return `${countryObj.name} (${countryObj.code}) ${countryObj.name} ${countryObj.code}`;
        }
        if (countryObj.name) return countryObj.name;
        if (countryObj.code) return countryObj.code;
      }

      const obj = value as any;
      if (obj.name) return obj.name;
      if (obj.title) return obj.title;
      if (obj.description) return obj.description;
      if (obj.label) return obj.label;

      const stringProps = Object.values(obj).filter(v => typeof v === 'string');
      if (stringProps.length > 0) {
        return stringProps.join(' ');
      }

      return JSON.stringify(value);
    }
    return value;
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

  // Column visibility methods
  isColumnVisible(column: string): boolean {
    const visible = this.visibleColumns();
    // If no columns are explicitly set as visible, all are visible by default
    return visible.length === 0 || visible.includes(column);
  }

  onColumnVisibilityChange(column: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    const isChecked = target.checked;
    const currentVisible = this.visibleColumns();
    const allColumns = this.allAvailableColumns();

    if (isChecked) {
      // Add column to visible list
      if (!currentVisible.includes(column)) {
        // If this is the first column being explicitly set, initialize with all columns
        const newVisible = currentVisible.length === 0 ? [...allColumns] : [...currentVisible, column];
        this.visibleColumns.set(newVisible);
      }
    } else {
      // Remove column from visible list
      if (currentVisible.length === 0) {
        // If all columns were visible by default, initialize with all except this one
        this.visibleColumns.set(allColumns.filter((col) => col !== column));
      } else {
        // Remove from existing visible list
        this.visibleColumns.set(currentVisible.filter((col) => col !== column));
      }
    }
  }

  resetColumnVisibility(): void {
    this.visibleColumns.set([]);
    this.showColumnDropdown.set(false);
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
