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
  styleUrls: ['./generic-table.ui-component.less'],
  template: `
    <div class="z-table-container overflow-hidden rounded-lg shadow-md ring-1 ring-gray-200 dark:ring-gray-700">
      <!-- Table Configuration Controls -->
      @if (showTableControls()) {
        <div class="z-table-controls border-b border-gray-200 dark:border-gray-700">
          <div class="z-controls-wrapper">
            <!-- Column Visibility -->
            @if (enableColumnVisibility()) {
              <div class="relative">
                <button
                  tuiButton
                  type="button"
                  appearance="outline"
                  [size]="'s'"
                  [tuiDropdown]="columnDropdown"
                  [(tuiDropdownOpen)]="showColumnDropdown"
                  class="z-column-button"
                >
                  <tui-icon icon="@tui.eye" class="h-4 w-4" />
                  <span>Columnas</span>
                </button>

                <ng-template #columnDropdown>
                  <tui-data-list class="z-dropdown" role="menu">
                    <div class="z-dropdown-content">
                      <h4 class="z-dropdown-title">Visibilidad de Columnas</h4>
                      @for (column of allAvailableColumns(); track column) {
                        <!-- eslint-disable-next-line @angular-eslint/template/label-has-associated-control -->
                        <label class="z-column-option">
                          <input
                            type="checkbox"
                            [checked]="isColumnVisible(column)"
                            (change)="onColumnVisibilityChange(column, $event)"
                          />
                          <span>
                            {{ displayLabels()[column] || column }}
                          </span>
                        </label>
                      }

                      <div class="z-dropdown-footer">
                        <button type="button" (click)="resetColumnVisibility()" class="z-reset-button">
                          Mostrar todas las columnas
                        </button>
                      </div>
                    </div>
                  </tui-data-list>
                </ng-template>
              </div>
            }

            <!-- Search/Filter -->
            @if (enableFiltering()) {
              <div class="z-search-container">
                <div class="relative">
                  <tui-textfield [tuiTextfieldSize]="'m'" class="z-search-input">
                    <label for="search" tuiLabel>{{ getSearchPlaceholder() }}</label>
                    <input
                      id="search"
                      tuiTextfield
                      [value]="searchInputValue()"
                      (input)="onSearchChange($event)"
                      class="pr-10"
                    />
                    <tui-icon icon="@tui.search" />
                  </tui-textfield>
                </div>
                @if (searchableColumns().length > 0) {
                  <div class="z-search-info">
                    <tui-icon icon="@tui.filter" class="h-3 w-3" />
                    <span>Buscando en: {{ getSearchableColumnsDisplay() }}</span>
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
            class="z-table min-w-full"
            tuiTable
            [size]="tableSize()"
            [columns]="displayHeaders()"
          >
            <thead tuiThead>
              <tr tuiThGroup>
                @for (header of displayHeaders(); track header) {
                  <th tuiTh scope="col" [style.min-width.px]="getColumnWidth(header)">
                    <div class="z-header-content">
                      <span>{{ displayLabels()[header] || header }}</span>
                    </div>
                  </th>
                }
              </tr>
            </thead>
            <tbody tuiTbody *tuiLet="paginatedItems() | tuiTableSort as sortedItems" [data]="sortedItems">
              @for (item of sortedItems; track getTrackBy(item)) {
                <tr tuiTr [ngClass]="getRowClasses(item)" (click)="onRowClick(item)">
                  @for (header of displayHeaders(); track header) {
                    <td [ngClass]="getCellClasses(header)" tuiTd *tuiCell="header">
                      @if (getColumnTemplate(header); as template) {
                        <ng-container *ngTemplateOutlet="template; context: { $implicit: item, item: item }" />
                      } @else if (header === 'status') {
                        @let status = getStatusDisplay(item[header]);
                        <span class="z-status-badge" [ngClass]="getStatusComponentClasses(item[header])">
                          <span class="z-status-dot"></span>
                          {{ status }}
                        </span>
                      } @else {
                        <span class="z-cell-content">{{ formatCellValue(item[header]) }}</span>
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
          <div class="z-pagination border-t border-gray-200 dark:border-gray-700">
            <div class="z-pagination-wrapper">
              <div class="z-pagination-info">
                Mostrando {{ currentPage() * pageSize() + 1 }} -
                {{ Math.min((currentPage() + 1) * pageSize(), totalItems()) }} de {{ totalItems() }} resultados
              </div>
              <tui-table-pagination
                [total]="totalItems()"
                [page]="currentPage()"
                [size]="pageSize()"
                [items]="pageSizeOptions()"
                (paginationChange)="onPaginationChange($event)"
                class="flex items-center gap-4"
              />
            </div>
          </div>
        }
      } @else {
        <div class="z-empty-state">
          <div class="z-empty-icon">
            <tui-icon icon="@tui.database" class="h-8 w-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 class="z-empty-title">No hay datos disponibles</h3>
          <p class="z-empty-description">{{ emptyMessage() }}</p>
          @if (searchTerm()) {
            <button type="button" (click)="clearSearch()" class="z-clear-search">
              <tui-icon icon="@tui.x" class="h-4 w-4" />
              Limpiar búsqueda
            </button>
          }
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

  getEnhancedStatusClasses(status: unknown): string {
    if (typeof status === 'string') {
      return status === 'active'
        ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20 dark:bg-green-900/30 dark:text-green-400 dark:ring-green-400/30'
        : 'bg-red-50 text-red-700 ring-1 ring-red-600/20 dark:bg-red-900/30 dark:text-red-400 dark:ring-red-400/30';
    }
    return 'bg-gray-50 text-gray-700 ring-1 ring-gray-600/20 dark:bg-gray-900/30 dark:text-gray-400 dark:ring-gray-400/30';
  }

  getStatusDotClasses(status: unknown): string {
    if (typeof status === 'string') {
      return status === 'active' ? 'bg-green-500 dark:bg-green-400' : 'bg-red-500 dark:bg-red-400';
    }
    return 'bg-gray-500 dark:bg-gray-400';
  }

  clearSearch(): void {
    this.searchInputValue.set('');
  }

  // Helper for template access to Math
  Math = Math;

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

    return searchableColumns.map((column) => labels[column] || column).join(', ');
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

      const stringProps = Object.values(obj).filter((v) => typeof v === 'string');
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

  getRowClasses(item: T): string[] {
    const classes: string[] = [];

    if (this.isSelected(item)) {
      classes.push('z-row-selected');
    }

    return classes;
  }

  getCellClasses(header: string): string[] {
    const classes: string[] = [];

    if (!this.isTextColumn(header)) {
      classes.push('whitespace-nowrap');
    }

    return classes;
  }

  getStatusComponentClasses(status: unknown): string[] {
    const classes: string[] = [];

    if (typeof status === 'string') {
      if (status === 'active') {
        classes.push('z-status-active');
      } else if (status === 'inactive') {
        classes.push('z-status-inactive');
      } else {
        classes.push('z-status-neutral');
      }
    } else {
      classes.push('z-status-neutral');
    }

    return classes;
  }
}
