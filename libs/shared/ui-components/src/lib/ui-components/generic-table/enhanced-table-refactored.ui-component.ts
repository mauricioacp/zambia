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
import { TuiTable } from '@taiga-ui/addon-table';
import {
  TuiButton,
  TuiIcon,
  TuiTitle,
  TuiAutoColorPipe,
  TuiInitialsPipe,
  TuiTextfield,
  TuiLabel,
  TuiHint,
} from '@taiga-ui/core';
import { TuiAvatar, TuiBadge, TuiStatus, TuiChip, TuiLineClamp } from '@taiga-ui/kit';
import { TuiCell } from '@taiga-ui/layout';
import { TuiLet, TUI_DEFAULT_MATCHER } from '@taiga-ui/cdk';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { injectCurrentTheme } from '../../layout/theme.service';
import { TranslatePipe } from '@ngx-translate/core';

import {
  TablePaginationComponent,
  TableColumnVisibilityComponent,
  TableSearchTriggerComponent,
  TableEmptyStateComponent,
  TableLoadingStateComponent,
  TablePaginationConfig,
  TableColumnConfig,
  TableSearchConfig,
  TableEmptyStateConfig,
  TableLoadingStateConfig,
} from '@zambia/ui-table-primitives';

import { TableAction, TableColumn } from './enhanced-table.ui-component';

export type { TableAction, TableColumn };

@Component({
  selector: 'z-enhanced-table-refactored',
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
    TuiTextfield,
    TuiLabel,
    TuiLet,
    TuiBadge,
    TuiStatus,
    TranslatePipe,
    TuiChip,
    TuiLineClamp,
    TuiHint,
    TablePaginationComponent,
    TableColumnVisibilityComponent,
    TableSearchTriggerComponent,
    TableEmptyStateComponent,
    TableLoadingStateComponent,
  ],
  template: `
    <div class="h-full w-full p-4 sm:p-6 dark:bg-gray-900">
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
      @if (enableFiltering() || enableColumnVisibility() || enableAdvancedSearch()) {
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

            <div class="flex items-center gap-2">
              @if (enableAdvancedSearch()) {
                <z-table-search-trigger
                  [config]="searchConfig()"
                  (searchClick)="advancedSearchClick.emit()"
                ></z-table-search-trigger>
              }

              @if (enableColumnVisibility()) {
                <z-table-column-visibility
                  [columns]="columnConfigs()"
                  (columnsChange)="onColumnsChange($event)"
                ></z-table-column-visibility>
              }
            </div>
          </div>
        </div>
      }

      <!-- Table Container -->
      <div class="rounded-lg shadow-md ring-1 ring-gray-200 dark:ring-gray-700">
        @if (loading()) {
          <z-table-loading-state [config]="loadingConfig()"></z-table-loading-state>
        } @else if (paginatedItems().length > 0) {
          <div class="-mx-4 overflow-x-auto sm:mx-0">
            <table
              [attr.tuiTheme]="currentTheme()"
              tuiTable
              class="min-w-full table-auto bg-white dark:bg-gray-800"
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
                            <div tuiCell="m" class="max-w-xs">
                              <tui-avatar
                                [src]="getAvatarText(item, column.key) | tuiInitials"
                                [style.background]="getAvatarText(item, column.key) | tuiAutoColor"
                                size="s"
                              ></tui-avatar>
                              <div
                                class="max-w-[200px] min-w-0 flex-1"
                                [tuiHint]="getDisplayValue(item, column.key)"
                                tuiHintDirection="top"
                              >
                                <tui-line-clamp [content]="title" [lineHeight]="20" [linesLimit]="1" class="block">
                                </tui-line-clamp>
                                <ng-template #title>
                                  <span tuiTitle class="whitespace-nowrap">
                                    {{ getDisplayValue(item, column.key) }}
                                  </span>
                                </ng-template>
                                @if (getSubtitle(item, column.key); as subtitle) {
                                  <tui-line-clamp
                                    [content]="subtitleTemplate"
                                    [lineHeight]="16"
                                    [linesLimit]="1"
                                    class="block"
                                  >
                                  </tui-line-clamp>
                                  <ng-template #subtitleTemplate>
                                    <span tuiSubtitle class="text-sm whitespace-nowrap text-gray-500">
                                      {{ subtitle }}
                                    </span>
                                  </ng-template>
                                }
                              </div>
                            </div>
                          }
                          @case ('date') {
                            <tui-chip appearance="info">{{
                              getDisplayValue(item, column.key) | date: 'mediumDate'
                            }}</tui-chip>
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
                                    appearance="flat"
                                    [iconStart]="action.icon || '@tui.more-horizontal'"
                                    size="xs"
                                    class="action-button !p-1"
                                    [tuiHint]="action.label"
                                    tuiHintDirection="top"
                                  >
                                  </a>
                                } @else {
                                  <button
                                    tuiButton
                                    appearance="flat"
                                    [iconStart]="action.icon || '@tui.more-horizontal'"
                                    size="xs"
                                    (click)="action.handler(item); $event.stopPropagation()"
                                    [disabled]="isActionDisabled(action, item)"
                                    [class]="getActionButtonClass(action)"
                                    [tuiHint]="action.label"
                                    tuiHintDirection="top"
                                    class="!p-1"
                                    [attr.aria-label]="action.label"
                                  >
                                    <span class="sr-only">{{ action.label }}</span>
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
                            <span
                              class="block truncate"
                              [tuiHint]="getDisplayValue(item, column.key)"
                              tuiHintDirection="top"
                            >
                              {{ getDisplayValue(item, column.key) }}
                            </span>
                          }
                        }
                      </td>
                    }
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          @if (enablePagination() && totalItems() > 0) {
            <div class="border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-700">
              <z-table-pagination
                [config]="paginationConfig()"
                (pageChange)="onPageChange($event)"
                (pageSizeChange)="onPageSizeChange($event)"
              ></z-table-pagination>
            </div>
          }
        } @else {
          <!-- Empty State -->
          <z-table-empty-state [config]="emptyStateConfig()"></z-table-empty-state>
        }
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
export class EnhancedTableRefactoredComponent<T extends Record<string, unknown>> {
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
  enableAdvancedSearch = input<boolean>(false);

  pageSize = input<number>(10);
  pageSizeOptions = input<number[]>([10, 25, 50, 100]);

  // Enhanced pagination signals
  currentPageSize = signal(10);
  currentPageIndex = signal(1); // 1-based for user display

  searchableColumns = input<string[]>([]);

  createClick = output<void>();
  rowClick = output<T>();
  advancedSearchClick = output<void>();

  searchInputValue = signal('');

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

  // Column configs for the visibility component
  columnConfigs = computed<TableColumnConfig[]>(() => {
    return this.columns().map((col) => ({
      key: col.key,
      label: col.label,
      visible: true, // Will be managed by the visibility component
      sortable: col.sortable,
      type: col.type,
    }));
  });

  // Track visible columns from the visibility component
  visibleColumnKeys = signal<string[]>([]);

  displayColumns = computed(() => {
    const allColumns = this.columns();
    const visibleKeys = this.visibleColumnKeys();

    if (visibleKeys.length === 0) {
      return allColumns;
    }

    return allColumns.filter((col) => visibleKeys.includes(col.key));
  });

  displayHeaders = computed(() => {
    return this.displayColumns().map((col) => col.key);
  });

  filteredItems = computed(() => {
    const items = this.items();
    const searchTerm = this.searchTerm();

    if (!searchTerm) return items;

    const searchableColumns = this.searchableColumns();
    const allColumns = this.columns().map((c) => c.key);

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

  totalPages = computed(() => Math.ceil(this.totalItems() / this.currentPageSize()));

  paginatedItems = computed(() => {
    const filtered = this.filteredItems();

    if (!this.enablePagination()) {
      return filtered;
    }

    const start = (this.currentPageIndex() - 1) * this.currentPageSize();
    const end = start + this.currentPageSize();
    return filtered.slice(start, end);
  });

  // Configs for primitive components
  paginationConfig = computed<TablePaginationConfig>(() => ({
    currentPage: this.currentPageIndex(),
    pageSize: this.currentPageSize(),
    totalItems: this.totalItems(),
    pageSizeOptions: this.pageSizeOptions(),
  }));

  searchConfig = computed<TableSearchConfig>(() => ({
    placeholder: 'Advanced Search...',
    minLength: 2,
  }));

  emptyStateConfig = computed<TableEmptyStateConfig>(() => ({
    title: this.emptyStateTitle(),
    description: this.emptyStateDescription(),
    icon: this.emptyStateIcon(),
    actionLabel: this.showEmptyStateAction() && this.showCreateButton() ? this.createButtonLabel() : undefined,
    actionCallback: this.showEmptyStateAction() && this.showCreateButton() ? () => this.onCreateClick() : undefined,
  }));

  loadingConfig = computed<TableLoadingStateConfig>(() => ({
    text: this.loadingText(),
    showSpinner: true,
  }));

  // Initialize page size from input
  constructor() {
    this.currentPageSize.set(this.pageSize());
  }

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

  getColumnTemplate(columnKey: string): TemplateRef<unknown> | null {
    if (!this.columnTemplates) {
      return null;
    }

    const templateDir = this.columnTemplates.find((dir) => dir.columnName === columnKey);
    return templateDir ? templateDir.template : null;
  }

  getDisplayValue(item: T, key: string): string {
    const keys = key.split('.');
    let value: unknown = item;

    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k];
      if (value === undefined || value === null) {
        return '-';
      }
    }

    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }

    if (typeof value === 'number') {
      return value.toLocaleString();
    }

    if (typeof value === 'object') {
      const obj = value as Record<string, unknown>;
      if (obj?.['name']) return String(obj['name']);
      if (obj?.['role_name']) return String(obj['role_name']);
      if (obj?.['title']) return String(obj['title']);
      if (obj?.['label']) return String(obj['label']);
      if (obj?.['code']) return String(obj['code']);
      if (obj?.['role_code']) return String(obj['role_code']);
      return '-';
    }

    return String(value);
  }

  getAvatarText(item: T, key: string): string {
    return this.getDisplayValue(item, key);
  }

  getSubtitle(item: T, key: string): string | null {
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
    return '@tui.circle-help';
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
    this.currentPageIndex.set(1); // Reset to first page on search
  }

  getSearchPlaceholder(): string {
    const searchableColumns = this.searchableColumns();
    if (searchableColumns.length === 0) {
      return 'Search in all columns...';
    }
    return `Search in ${searchableColumns.length} column${searchableColumns.length > 1 ? 's' : ''}...`;
  }

  getSearchableValueForColumn(item: T, column: string): unknown {
    // Handle nested properties (e.g., 'role.name')
    const keys = column.split('.');
    let value: unknown = item;

    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k];
      if (value === undefined || value === null) {
        return null;
      }
    }

    if (value && typeof value === 'object') {
      const obj = value as Record<string, unknown>;
      if (obj?.['name']) return String(obj['name']);
      if (obj?.['role_name']) return String(obj['role_name']);
      if (obj?.['title']) return String(obj['title']);
      if (obj?.['label']) return String(obj['label']);
      if (obj?.['code']) return String(obj['code']);
      if (obj?.['role_code']) return String(obj['role_code']);
      return '';
    }

    return value;
  }

  clearSearch(): void {
    this.searchInputValue.set('');
  }

  onPageChange(newPage: number): void {
    this.currentPageIndex.set(newPage);
  }

  onPageSizeChange(newSize: number): void {
    this.currentPageSize.set(newSize);
    this.currentPageIndex.set(1); // Reset to first page when changing page size
  }

  onColumnsChange(columns: TableColumnConfig[]): void {
    const visibleKeys = columns.filter((col) => col.visible).map((col) => col.key as string);
    this.visibleColumnKeys.set(visibleKeys);
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
