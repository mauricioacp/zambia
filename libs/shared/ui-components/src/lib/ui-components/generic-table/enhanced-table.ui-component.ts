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
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ColumnTemplateDirective } from '../../directives/column-template.directive';
import { TuiTable, type TuiTablePaginationEvent } from '@taiga-ui/addon-table';
import {
  TuiButton,
  TuiIcon,
  TuiTitle,
  TuiAutoColorPipe,
  TuiInitialsPipe,
  TuiDropdown,
  TuiTextfield,
  TuiLabel,
  TuiLoader,
} from '@taiga-ui/core';
import {
  TuiAvatar,
  TuiBadge,
  TuiChevron,
  TuiStatus,
  TuiButtonSelect,
  TuiDataListWrapper,
  TuiPagination,
} from '@taiga-ui/kit';
import { TuiCell } from '@taiga-ui/layout';
import { TuiLet, TUI_DEFAULT_MATCHER } from '@taiga-ui/cdk';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { injectCurrentTheme } from '../../layout/theme.service';
import { TranslatePipe } from '@ngx-translate/core';

export interface TableAction<T = any> {
  label: string;
  icon?: string;
  color?: 'primary' | 'secondary' | 'warning' | 'danger';
  handler: (item: T) => void;
  disabled?: (item: T) => boolean;
  visible?: (item: T) => boolean;
  routerLink?: (item: T) => string | string[];
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  searchable?: boolean;
  type?: 'text' | 'avatar' | 'badge' | 'status' | 'actions' | 'custom';
  width?: number;
  align?: 'left' | 'center' | 'right';
}

@Component({
  selector: 'z-enhanced-table',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TuiTable,
    TuiCell,
    TuiTitle,
    TuiIcon,
    TuiAvatar,
    TuiAutoColorPipe,
    TuiInitialsPipe,
    TuiButton,
    TuiDropdown,
    TuiTextfield,
    TuiLabel,
    TuiLoader,
    TuiChevron,
    TuiLet,
    TuiBadge,
    TuiStatus,
    TuiButtonSelect,
    TuiDataListWrapper,
    TuiPagination,
    TranslatePipe,
  ],
  template: `
    <div class="h-full w-full overflow-auto p-6 dark:bg-gray-900">
      <!-- Header Section -->
      <div class="mb-6 flex items-center justify-between">
        @if (title()) {
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white">{{ title() }}</h2>
        }
        @if (showCreateButton()) {
          <button
            tuiButton
            appearance="primary"
            size="m"
            [iconStart]="createButtonIcon()"
            (click)="onCreateClick()"
            [disabled]="loading()"
          >
            {{ createButtonLabel() }}
          </button>
        }
      </div>

      <!-- Welcome/Description Section -->
      @if (description()) {
        <div class="mb-6">
          <p class="text-gray-600 dark:text-gray-400">{{ description() }}</p>
        </div>
      }

      <!-- Controls Section -->
      @if (enableFiltering() || enableColumnVisibility()) {
        <div class="mb-6 space-y-4">
          <!-- Search and Filters -->
          <div class="filters flex flex-wrap items-center gap-4">
            @if (enableFiltering()) {
              <div class="input min-w-64 flex-1">
                <tui-textfield iconStart="@tui.search" tuiTextfieldSize="m">
                  <input
                    id="table-search"
                    tuiTextfield
                    [value]="searchInputValue()"
                    (input)="onSearchChange($event)"
                    [placeholder]="getSearchPlaceholder()"
                  />
                  <label tuiLabel for="table-search">{{ 'find' | translate }}</label>
                </tui-textfield>
              </div>
            }

            @if (enableColumnVisibility()) {
              <button
                tuiButton
                tuiChevron
                size="m"
                appearance="secondary"
                [tuiDropdown]="columnDropdown"
                [(tuiDropdownOpen)]="showColumnDropdown"
              >
                {{ 'Columns' | translate }}
              </button>

              <ng-template #columnDropdown>
                <div class="columns w-48 p-4">
                  <h4 class="mb-2 text-sm font-medium text-gray-800 dark:text-white">Show Columns</h4>
                  @for (column of allAvailableColumns(); track column; let i = $index) {
                    <label class="mb-2 flex items-center space-x-2 text-sm" [for]="'column-' + i">
                      <input
                        [id]="'column-' + i"
                        type="checkbox"
                        class="rounded"
                        [checked]="isColumnVisible(column)"
                        (change)="onColumnVisibilityChange(column, $event)"
                      />
                      <span class="text-gray-700 dark:text-gray-300">
                        {{ displayLabels()[column] || column }}
                      </span>
                    </label>
                  }
                  <button
                    type="button"
                    class="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    (click)="resetColumnVisibility()"
                  >
                    Show all columns
                  </button>
                </div>
              </ng-template>
            }
          </div>
        </div>
      }

      <!-- Table Container -->
      <div class="overflow-hidden rounded-lg shadow-md ring-1 ring-gray-700 dark:ring-gray-700">
        <tui-loader [overlay]="true" [showLoader]="loading()">
          @if (paginatedItems().length > 0) {
            <div class="overflow-x-auto">
              <table
                [attr.tuiTheme]="currentTheme()"
                tuiTable
                class="min-w-full bg-white dark:bg-gray-800"
                [columns]="displayHeaders()"
                size="m"
              >
                <thead class="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    @for (column of displayColumns(); track column.key) {
                      <th
                        tuiTh
                        class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
                        [style.width.px]="column.width"
                      >
                        {{ column.label }}
                      </th>
                    }
                  </tr>
                </thead>
                <tbody
                  tuiTbody
                  *tuiLet="paginatedItems() as items"
                  [data]="items"
                  class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800"
                >
                  @for (item of items; track getTrackBy(item)) {
                    <tr class="table-row cursor-pointer transition-colors duration-200" (click)="onRowClick(item)">
                      @for (column of displayColumns(); track column.key) {
                        <td
                          tuiTd
                          class="px-6 py-4 text-sm whitespace-nowrap text-gray-900 dark:text-gray-100"
                          [class]="getCellClasses(column)"
                        >
                          @switch (column.type) {
                            @case ('avatar') {
                              <div tuiCell="m">
                                <tui-avatar
                                  [src]="getAvatarText(item, column.key) | tuiInitials"
                                  [style.background]="getAvatarText(item, column.key) | tuiAutoColor"
                                  size="s"
                                ></tui-avatar>
                                <span tuiTitle>
                                  {{ getDisplayValue(item, column.key) }}
                                  @if (getSubtitle(item, column.key); as subtitle) {
                                    <span tuiSubtitle>{{ subtitle }}</span>
                                  }
                                </span>
                              </div>
                            }
                            @case ('badge') {
                              <tui-badge> {{ getDisplayValue(item, column.key) }}</tui-badge>
                            }
                            @case ('status') {
                              <span [tuiStatus]="getStatusColor(item, column.key)">
                                <tui-icon [icon]="getStatusIcon(item, column.key)"></tui-icon>
                                {{ getDisplayValue(item, column.key) }}
                              </span>
                            }
                            @case ('actions') {
                              <span tuiStatus class="actions-group flex gap-1">
                                @for (action of getVisibleActions(item); track action.label) {
                                  @if (action.routerLink) {
                                    <a
                                      [routerLink]="action.routerLink(item)"
                                      tuiButton
                                      appearance="action"
                                      [iconStart]="action.icon"
                                      size="xs"
                                      class="action-button"
                                    >
                                      {{ action.label }}
                                    </a>
                                  } @else {
                                    <button
                                      tuiButton
                                      appearance="action"
                                      [iconStart]="action.icon"
                                      size="xs"
                                      (click)="action.handler(item); $event.stopPropagation()"
                                      [disabled]="isActionDisabled(action, item)"
                                      [class]="getActionButtonClass(action)"
                                    >
                                      {{ action.label }}
                                    </button>
                                  }
                                }
                              </span>
                            }
                            @case ('custom') {
                              @if (getColumnTemplate(column.key); as template) {
                                <ng-container *ngTemplateOutlet="template; context: { $implicit: item, item: item }" />
                              } @else {
                                <span>{{ getDisplayValue(item, column.key) }}</span>
                              }
                            }
                            @default {
                              <span>{{ getDisplayValue(item, column.key) }}</span>
                            }
                          }
                        </td>
                      }
                    </tr>
                  }
                </tbody>

                <!-- Enhanced Pagination Caption -->
                @if (enablePagination() && totalItems() > 0) {
                  <caption tuiCaption class="bg-gray-50 dark:bg-gray-700">
                    <div class="flex items-center justify-between px-6 py-4">
                      <!-- Total rows display -->
                      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {{ totalItems() }} {{ totalItems() === 1 ? ('row' | translate) : ('rows' | translate) }}
                      </span>

                      <!-- Page size selector -->
                      <button
                        appearance="flat"
                        tuiButton
                        tuiButtonSelect
                        type="button"
                        [(ngModel)]="currentPageSize"
                        class="mx-4 text-sm"
                      >
                        {{ startIndex() }}-{{ endIndex() }} {{ 'rows' | translate }}
                        <tui-data-list-wrapper
                          *tuiTextfieldDropdown
                          [itemContent]="pageSizeContent"
                          [items]="pageSizeOptions()"
                        />
                      </button>

                      <!-- Pagination controls -->
                      @if (totalPages() > 1) {
                        <tui-pagination [length]="totalPages()" [(index)]="currentPageIndex" class="float-right" />
                      }
                    </div>

                    <!-- Page size content template -->
                    <ng-template #pageSizeContent let-size> {{ size }} {{ 'items_per_page' | translate }} </ng-template>
                  </caption>
                }
              </table>
            </div>
          } @else {
            <!-- Empty State -->
            <div class="bg-white py-16 text-center dark:bg-gray-800">
              <tui-icon
                [icon]="emptyStateIcon()"
                class="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-500"
              ></tui-icon>
              <h3 class="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                {{ emptyStateTitle() }}
              </h3>
              <p class="mb-6 text-gray-500 dark:text-gray-400">
                {{ emptyStateDescription() }}
              </p>
              @if (showCreateButton() && showEmptyStateAction()) {
                <button
                  tuiButton
                  appearance="primary"
                  size="m"
                  [iconStart]="createButtonIcon()"
                  (click)="onCreateClick()"
                >
                  {{ createButtonLabel() }}
                </button>
              }
              @if (searchTerm()) {
                <button
                  type="button"
                  class="ml-2 text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  (click)="clearSearch()"
                >
                  Clear search
                </button>
              }
            </div>
          }
        </tui-loader>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
      min-height: 100%;
    }

    .filters {
      display: flex;
      gap: 1rem;
      align-items: center;
      flex-wrap: wrap;
    }

    .input {
      flex: 1;
      min-width: 16rem;
    }

    .columns {
      width: 12rem;
    }

    z-table {
      background: var(--tui-service-selection-background);
    }

    [tuiTh],
    [tuiTd] {
      border-inline-start: none;
      border-inline-end: none;
    }

    [tuiTable][data-size='m'] [tuiTitle] {
      flex-direction: row;
      gap: 0.75rem;
    }

    .table-row:hover {
      background: rgb(249 250 251) !important;
    }

    :host(.dark) .table-row:hover,
    .dark .table-row:hover {
      background: rgb(55 65 81) !important;
    }

    .actions-group {
      display: flex;
      gap: 0.25rem;
      align-items: center;
    }

    .action-button {
      transition: all 0.2s ease;
    }

    .view-button:hover {
      background-color: var(--tui-status-positive-pale) !important;
      color: var(--tui-status-positive) !important;
    }

    .edit-button:hover {
      background-color: var(--tui-status-warning-pale) !important;
      color: var(--tui-status-warning) !important;
    }

    .delete-button:hover {
      background-color: var(--tui-status-negative-pale) !important;
      color: var(--tui-status-negative) !important;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnhancedTableUiComponent<T extends Record<string, any>> {
  currentTheme = injectCurrentTheme();
  items = input.required<T[]>();
  columns = input.required<TableColumn[]>();
  loading = input<boolean>(false);
  trackBy = input<string>('id');

  title = input<string>('');
  description = input<string>('');

  showCreateButton = input<boolean>(false);
  createButtonLabel = input<string>('Create');
  createButtonIcon = input<string>('@tui.plus');

  loadingText = input<string>('Loading...');

  emptyStateTitle = input<string>('No data found');
  emptyStateDescription = input<string>('There are no items to display.');
  emptyStateIcon = input<string>('@tui.database');
  showEmptyStateAction = input<boolean>(true);

  actions = input<TableAction<T>[]>([]);

  enablePagination = input<boolean>(true);
  enableFiltering = input<boolean>(true);
  enableColumnVisibility = input<boolean>(true);

  pageSize = input<number>(10);
  pageSizeOptions = input<number[]>([10, 25, 50, 100]);

  // Enhanced pagination signals
  currentPageSize = signal(10);
  currentPageIndex = signal(0);

  searchableColumns = input<string[]>([]);

  createClick = output<void>();
  rowClick = output<T>();
  paginationChange = output<TuiTablePaginationEvent>();

  currentPage = signal(0);

  // Computed pagination properties
  totalPages = computed(() => Math.ceil(this.totalItems() / this.currentPageSize()));
  startIndex = computed(() => this.currentPageIndex() * this.currentPageSize() + 1);
  endIndex = computed(() => Math.min((this.currentPageIndex() + 1) * this.currentPageSize(), this.totalItems()));
  searchInputValue = signal('');
  visibleColumns = signal<string[]>([]);
  showColumnDropdown = signal(false);

  Math = Math;

  searchTerm = toSignal(
    toObservable(this.searchInputValue).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      map((term) => term.toLowerCase().trim())
    ),
    { initialValue: '' }
  );

  @ContentChildren(ColumnTemplateDirective) columnTemplates?: QueryList<ColumnTemplateDirective<T>>;

  allAvailableColumns = computed(() => {
    return this.columns().map((col) => col.key);
  });

  displayColumns = computed(() => {
    const allColumns = this.columns();
    const visibleCols = this.visibleColumns();

    if (visibleCols.length === 0) {
      return allColumns;
    }

    return allColumns.filter((col) => visibleCols.includes(col.key));
  });

  displayHeaders = computed(() => {
    return this.displayColumns().map((col) => col.key);
  });

  displayLabels = computed(() => {
    const labels: Record<string, string> = {};
    this.columns().forEach((col) => {
      labels[col.key] = col.label;
    });
    return labels;
  });

  filteredItems = computed(() => {
    const items = this.items();
    const searchTerm = this.searchTerm();

    if (!searchTerm) return items;

    const searchableColumns = this.searchableColumns();
    const allColumns = this.allAvailableColumns();

    const columnsToSearch = searchableColumns.length > 0 ? searchableColumns : allColumns;

    return items.filter((item) =>
      columnsToSearch.some((column) => {
        const value = this.getSearchableValueForColumn(item, column);
        if (value === null || value === undefined) return false;

        return TUI_DEFAULT_MATCHER(String(value), searchTerm);
      })
    );
  });

  totalItems = computed(() => this.filteredItems().length);

  paginatedItems = computed(() => {
    const filtered = this.filteredItems();

    if (!this.enablePagination()) {
      return filtered;
    }

    const start = this.currentPageIndex() * this.currentPageSize();
    const end = start + this.currentPageSize();
    return filtered.slice(start, end);
  });

  getTrackBy(item: T): unknown {
    const trackByProp = this.trackBy();

    if (trackByProp && trackByProp in item) {
      return item[trackByProp];
    }

    if ('id' in item) {
      return item['id'];
    }

    return JSON.stringify(item);
  }

  getColumnTemplate(columnKey: string): TemplateRef<any> | null {
    if (!this.columnTemplates) {
      return null;
    }

    const templateDir = this.columnTemplates.find((dir) => dir.columnName === columnKey);
    return templateDir ? templateDir.template : null;
  }

  getDisplayValue(item: T, key: string): string {
    const value = item[key];

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

  getAvatarText(item: T, key: string): string {
    return this.getDisplayValue(item, key);
  }

  getSubtitle(item: T, key: string): string | null {
    // Look for common subtitle patterns
    if (key === 'name' && item['code']) {
      return `Code: ${item['code']}`;
    }

    if (key === 'name' && item['status']) {
      return `Status: ${item['status']}`;
    }

    return null;
  }

  getStatusColor(item: T, key: string): string {
    const status = item[key];
    if (typeof status === 'string') {
      return status === 'active' ? 'var(--tui-status-positive)' : 'var(--tui-status-negative)';
    }
    return 'var(--tui-status-neutral)';
  }

  getStatusIcon(item: T, key: string): string {
    const status = item[key];
    if (typeof status === 'string') {
      return status === 'active' ? '@tui.check' : '@tui.x';
    }
    return '@tui.help-circle';
  }

  getVisibleActions(item: T): TableAction<T>[] {
    return this.actions().filter((action) => !action.visible || action.visible(item));
  }

  isActionDisabled(action: TableAction<T>, item: T): boolean {
    return action.disabled ? action.disabled(item) : false;
  }

  getCellClasses(column: TableColumn): string {
    const classes: string[] = [];

    if (column.align === 'center') {
      classes.push('text-center');
    } else if (column.align === 'right') {
      classes.push('text-right');
    }

    return classes.join(' ');
  }

  onCreateClick(): void {
    this.createClick.emit();
  }

  onRowClick(item: T): void {
    this.rowClick.emit(item);
  }

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchInputValue.set(target.value);
    this.currentPage.set(0);
    this.currentPageIndex.set(0); // Reset pagination on search
  }

  // Initialize page size from input
  constructor() {
    this.currentPageSize.set(this.pageSize());
  }

  getSearchPlaceholder(): string {
    const searchableColumns = this.searchableColumns();
    if (searchableColumns.length === 0) {
      return 'Search in all columns...';
    }
    return `Search in ${searchableColumns.length} column${searchableColumns.length > 1 ? 's' : ''}...`;
  }

  getSearchableValueForColumn(item: T, column: string): unknown {
    const value = item[column];

    if (value && typeof value === 'object') {
      const obj = value as any;
      if (obj.name) return obj.name;
      if (obj.title) return obj.title;
      if (obj.label) return obj.label;
      return JSON.stringify(value);
    }

    return value;
  }

  clearSearch(): void {
    this.searchInputValue.set('');
  }

  // Enhanced pagination functionality
  onPaginationChange(event: TuiTablePaginationEvent): void {
    this.currentPage.set(event.page);
    this.currentPageIndex.set(event.page);
    this.paginationChange.emit(event);
  }

  // Handle page size changes
  onPageSizeChange(newSize: number): void {
    this.currentPageSize.set(newSize);
    this.currentPageIndex.set(0); // Reset to first page when changing page size
    this.currentPage.set(0);

    // Emit pagination change event
    this.paginationChange.emit({
      page: 0,
      size: newSize,
    });
  }

  // Column visibility functionality
  isColumnVisible(column: string): boolean {
    const visible = this.visibleColumns();
    return visible.length === 0 || visible.includes(column);
  }

  onColumnVisibilityChange(column: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    const isChecked = target.checked;
    const currentVisible = this.visibleColumns();
    const allColumns = this.allAvailableColumns();

    if (isChecked) {
      if (!currentVisible.includes(column)) {
        const newVisible = currentVisible.length === 0 ? [...allColumns] : [...currentVisible, column];
        this.visibleColumns.set(newVisible);
      }
    } else {
      if (currentVisible.length === 0) {
        this.visibleColumns.set(allColumns.filter((col) => col !== column));
      } else {
        this.visibleColumns.set(currentVisible.filter((col) => col !== column));
      }
    }
  }

  resetColumnVisibility(): void {
    this.visibleColumns.set([]);
    this.showColumnDropdown.set(false);
  }

  getActionButtonClass(action: TableAction<T>): string {
    const baseClass = 'action-button';
    switch (action.color) {
      case 'primary':
        return `${baseClass} view-button`;
      case 'warning':
        return `${baseClass} edit-button`;
      case 'danger':
        return `${baseClass} delete-button`;
      default:
        return baseClass;
    }
  }
}
