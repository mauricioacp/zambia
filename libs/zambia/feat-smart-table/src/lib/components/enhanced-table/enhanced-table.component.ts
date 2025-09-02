import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  QueryList,
  TemplateRef,
  computed,
  inject,
  input,
  output,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

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
import { TuiLet } from '@taiga-ui/cdk';

import {
  TablePaginationComponent,
  TableColumnVisibilityComponent,
  TableSearchTriggerComponent,
  TableEmptyStateComponent,
  TableLoadingStateComponent,
  TableColumnConfig,
  TablePaginationConfig,
  TableSearchConfig,
  TableEmptyStateConfig,
  TableLoadingStateConfig,
} from '@zambia/ui-table-primitives';

import { TableStateService } from '../../services/table-state.service';
import { ColumnTemplateDirective } from '../../directives/column-template.directive';
import { TableSearchPipe } from '../../pipes/table-search.pipe';
import { TableSortPipe } from '../../pipes/table-sort.pipe';
import { EnhancedTableConfig, TableColumnWithTemplate, TableActionButton } from '../../types/table.types';
import {
  getDisplayValue,
  getNestedValue,
  getStatusColor,
  getStatusIcon,
  getActionButtonClass,
  trackByField,
} from '../../utils/table.utils';

@Component({
  selector: 'z-enhanced-table',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TranslatePipe,
    // TaigaUI
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
    TuiChip,
    TuiLineClamp,
    TuiHint,
    // Table primitives
    TablePaginationComponent,
    TableColumnVisibilityComponent,
    TableSearchTriggerComponent,
    TableEmptyStateComponent,
    TableLoadingStateComponent,
  ],
  providers: [TableStateService],
  template: `
    <div class="h-full w-full p-4 sm:p-6">
      <!-- Header Section -->
      @if (config().title || config().showCreateButton) {
        <div class="mb-6 flex items-center justify-between">
          @if (config().title) {
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white">
              {{ config().title }}
            </h2>
          }
          @if (config().showCreateButton) {
            <button
              tuiButton
              appearance="primary"
              size="m"
              [iconStart]="config().createButtonIcon || '@tui.plus'"
              (click)="createClick.emit()"
              [disabled]="loading()"
            >
              {{ config().createButtonLabel || ('create' | translate) }}
            </button>
          }
        </div>
      }

      <!-- Description Section -->
      @if (config().description) {
        <div class="mb-6">
          <p class="text-gray-600 dark:text-gray-400">{{ config().description }}</p>
        </div>
      }

      <!-- Controls Section -->
      @if (showControls()) {
        <div class="mb-6 space-y-4">
          <div class="filters flex flex-wrap items-center gap-4">
            @if (config().enableFiltering) {
              <div class="input min-w-64 flex-1">
                <tui-textfield iconStart="@tui.search" tuiTextfieldSize="m">
                  <input
                    id="table-search"
                    tuiTextfield
                    [value]="tableState.searchTerm()"
                    (input)="onSearchInput($event)"
                    [placeholder]="searchPlaceholder()"
                  />
                  <label tuiLabel for="table-search">{{ 'find' | translate }}</label>
                </tui-textfield>
              </div>
            }

            <div class="flex items-center gap-2">
              @if (config().enableAdvancedSearch) {
                <z-table-search-trigger [config]="searchConfig()" (searchClick)="advancedSearchClick.emit()" />
              }

              @if (config().enableColumnVisibility) {
                <z-table-column-visibility [columns]="columnConfigs()" (columnsChange)="onColumnsChange($event)" />
              }
            </div>
          </div>
        </div>
      }

      <!-- Table Container -->
      <div class="rounded-lg shadow-md ring-1 ring-gray-200 dark:ring-gray-700">
        @if (loading()) {
          <z-table-loading-state [config]="loadingConfig()" />
        } @else if (paginatedItems().length > 0) {
          <div class="-mx-4 overflow-x-auto sm:mx-0">
            <table
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
                      class="table-header px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
                      [style.width.px]="column.width"
                      [class.sortable]="column.sortable"
                      (click)="onHeaderClick(column)"
                    >
                      <div class="flex items-center gap-2">
                        {{ column.label | translate }}
                        @if (column.sortable && isColumnSorted(column)) {
                          <tui-icon [icon]="getSortIcon(column)" class="h-4 w-4" />
                        }
                      </div>
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
                @for (item of items; track trackByFn(0, item)) {
                  <tr
                    class="table-row cursor-pointer transition-colors duration-200"
                    (click)="onRowClick(item, $event)"
                  >
                    @for (column of displayColumns(); track column.key) {
                      <td
                        tuiTd
                        class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100"
                        [class]="getCellClasses(column)"
                      >
                        @switch (column.type) {
                          @case ('avatar') {
                            <div tuiCell="m" class="max-w-xs">
                              <tui-avatar
                                [src]="getAvatarText(item, column) | tuiInitials"
                                [style.background]="getAvatarText(item, column) | tuiAutoColor"
                                size="s"
                              />
                              <div
                                class="max-w-[200px] min-w-0 flex-1"
                                [tuiHint]="getCellValue(item, column)"
                                tuiHintDirection="top"
                              >
                                <tui-line-clamp [content]="title" [lineHeight]="20" [linesLimit]="1" class="block">
                                </tui-line-clamp>
                                <ng-template #title>
                                  <span tuiTitle class="whitespace-nowrap">
                                    {{ getCellValue(item, column) }}
                                  </span>
                                </ng-template>
                                @if (getSubtitle(item, column); as subtitle) {
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
                            <tui-chip appearance="info">
                              {{ getCellValue(item, column) | date: 'dd MMM, yyyy' }}
                            </tui-chip>
                          }
                          @case ('badge') {
                            <tui-badge>{{ getCellValue(item, column) }}</tui-badge>
                          }
                          @case ('status') {
                            <span [tuiStatus]="getStatusColorForCell(item, column)">
                              <tui-icon [icon]="getStatusIconForCell(item, column)" />
                              {{ getCellValue(item, column) | translate }}
                            </span>
                          }
                          @case ('actions') {
                            <span class="actions-group flex gap-1">
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
                                    (click)="$event.stopPropagation()"
                                  >
                                  </a>
                                } @else {
                                  <button
                                    tuiButton
                                    appearance="flat"
                                    [iconStart]="action.icon || '@tui.more-horizontal'"
                                    size="xs"
                                    (click)="onActionClick(action, item, $event)"
                                    [disabled]="isActionDisabled(action, item)"
                                    [class]="getActionClass(action)"
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
                            @if (column.template) {
                              <ng-container
                                *ngTemplateOutlet="column.template; context: { $implicit: item, item: item }"
                              />
                            } @else {
                              <span>{{ getCellValue(item, column) }}</span>
                            }
                          }
                          @default {
                            <span class="block truncate" [tuiHint]="getCellValue(item, column)" tuiHintDirection="top">
                              {{ getCellValue(item, column) }}
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
          @if (config().enablePagination && tableState.totalItems() > 0) {
            <div class="border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-700">
              <z-table-pagination
                [config]="paginationConfig()"
                (pageChange)="tableState.setPage($event)"
                (pageSizeChange)="tableState.setPageSize($event)"
              />
            </div>
          }
        } @else {
          <!-- Empty State -->
          <z-table-empty-state [config]="emptyStateConfig()" />
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

    .table-header {
      user-select: none;
    }

    .table-header.sortable {
      cursor: pointer;
    }

    .table-header.sortable:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }

    :host(.dark) .table-header.sortable:hover,
    .dark .table-header.sortable:hover {
      background-color: rgba(255, 255, 255, 0.05);
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

    .secondary-button:hover {
      background-color: var(--tui-status-info-pale) !important;
      color: var(--tui-status-info) !important;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnhancedTableComponent<T extends Record<string, unknown>> {
  readonly tableState = inject(TableStateService<T>);
  readonly translate = inject(TranslateService);

  items = input.required<T[]>();
  columns = input.required<TableColumnWithTemplate<T>[]>();
  actions = input<TableActionButton<T>[]>([]);
  loading = input<boolean>(false);
  config = input<EnhancedTableConfig<T>>({
    enablePagination: true,
    enableFiltering: true,
    enableColumnVisibility: true,
    enableAdvancedSearch: false,
    enableSorting: true,
    enableSelection: false,
    pageSize: 10,
    pageSizeOptions: [10, 25, 50, 100],
    searchableColumns: [],
    searchDebounceTime: 300,
    trackBy: 'id',
  });

  createClick = output<void>();
  rowClick = output<T>();
  advancedSearchClick = output<void>();

  @ContentChildren(ColumnTemplateDirective)
  columnTemplates?: QueryList<ColumnTemplateDirective<T>>;

  searchedItems = computed(() => {
    const items = this.items();
    const searchTerm = this.tableState.searchTerm();
    const searchableColumns = this.config().searchableColumns || [];
    const searchPipe = new TableSearchPipe();
    return searchPipe.transform(items, searchTerm, searchableColumns);
  });

  filteredItems = computed(() => {
    const items = this.searchedItems();
    const sortConfig = this.tableState.sortConfig();

    // Apply sort pipe logic
    const sortPipe = new TableSortPipe();
    return sortPipe.transform(items, sortConfig);
  });

  paginatedItems = computed(() => {
    const filtered = this.filteredItems();
    const config = this.config();

    if (!config.enablePagination) {
      return filtered;
    }

    const page = this.tableState.currentPage();
    const size = this.tableState.pageSize();
    const start = (page - 1) * size;
    const end = start + size;

    return filtered.slice(start, end);
  });

  displayColumns = computed(() => {
    const columns = this.columns();
    const visibility = this.tableState.columnVisibility();

    // If no visibility state, show all columns
    if (Object.keys(visibility).length === 0) {
      return columns;
    }

    return columns.filter((col) => visibility[String(col.key)] !== false);
  });

  displayHeaders = computed(() => this.displayColumns().map((col) => col.key));

  showControls = computed(() => {
    const config = this.config();
    return config.enableFiltering || config.enableColumnVisibility || config.enableAdvancedSearch;
  });

  searchPlaceholder = computed(() => {
    const searchable = this.config().searchableColumns || [];
    if (searchable.length === 0) {
      return 'Search in all columns...';
    }
    return `Buscar en ${searchable.length} columna${searchable.length > 1 ? 's' : ''}...`;
  });

  columnConfigs = computed<TableColumnConfig[]>(() => {
    const visibility = this.tableState.columnVisibility();
    return this.columns().map((col) => ({
      key: String(col.key),
      label: col.label,
      visible: visibility[String(col.key)] !== false,
      sortable: col.sortable,
      type: col.type,
    }));
  });

  paginationConfig = computed<TablePaginationConfig>(() => ({
    currentPage: this.tableState.currentPage(),
    pageSize: this.tableState.pageSize(),
    totalItems: this.tableState.totalItems(),
    pageSizeOptions: this.config().pageSizeOptions || [10, 25, 50, 100],
  }));

  searchConfig = computed<TableSearchConfig>(() => ({
    placeholder: 'Advanced Search',
    debounceTime: this.config().searchDebounceTime || 300,
    minLength: 0,
  }));

  emptyStateConfig = computed<TableEmptyStateConfig>(() => {
    const config = this.config();
    return {
      title: config.emptyStateTitle || 'No data found',
      description: config.emptyStateDescription || 'There are no items to display.',
      icon: config.emptyStateIcon || '@tui.database',
      actionLabel: config.showEmptyStateAction && config.showCreateButton ? config.createButtonLabel : undefined,
      actionCallback:
        config.showEmptyStateAction && config.showCreateButton ? () => this.createClick.emit() : undefined,
    };
  });

  loadingConfig = computed<TableLoadingStateConfig>(() => ({
    text: this.config().loadingText || 'Loading...',
    showSpinner: true,
  }));

  trackByFn = trackByField<T>(this.config().trackBy);

  constructor() {
    effect(() => {
      this.tableState.setItems(this.filteredItems());
    });

    effect(() => {
      const pageSize = this.config().pageSize;
      if (pageSize) {
        this.tableState.setPageSize(pageSize);
      }
    });
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.tableState.setSearchTerm(target.value);
  }

  onColumnsChange(columns: TableColumnConfig[]): void {
    columns.forEach((col) => {
      this.tableState.setColumnVisibility(col.key, col.visible);
    });
  }

  onHeaderClick(column: TableColumnWithTemplate<T>): void {
    if (column.sortable && this.config().enableSorting) {
      this.tableState.setSort(column.key);
    }
  }

  onRowClick(item: T, event: MouseEvent): void {
    // Don't emit row click if clicking on an action button
    const target = event.target as HTMLElement;
    if (target.closest('.actions-group')) {
      return;
    }
    this.rowClick.emit(item);
  }

  onActionClick(action: TableActionButton<T>, item: T, event: MouseEvent): void {
    event.stopPropagation();
    action.handler(item);
  }

  getColumnTemplate(columnKey: string): TemplateRef<unknown> | null {
    if (!this.columnTemplates) {
      return null;
    }

    const templateDir = this.columnTemplates.find((dir) => dir.columnName === columnKey);
    return templateDir ? templateDir.template : null;
  }

  getCellValue(item: T, column: TableColumnWithTemplate<T>): string {
    if (column.valueGetter) {
      return getDisplayValue(column.valueGetter(item));
    }

    const key = column.key as string;
    if (key.includes('.')) {
      return getDisplayValue(getNestedValue(item as Record<string, unknown>, key));
    }

    return getDisplayValue(item[column.key as keyof T]);
  }

  getAvatarText(item: T, column: TableColumnWithTemplate<T>): string {
    return this.getCellValue(item, column);
  }

  getSubtitle(item: T, column: TableColumnWithTemplate<T>): string | null {
    const key = column.key;
    if (key === 'name' && 'code' in item) {
      return `Código: ${item['code']}`;
    }
    if (key === 'name' && 'status' in item) {
      const status = item['status'];
      return `Estado: ${this.translate.instant(`${status}`)}`;
    }
    return null;
  }

  getStatusColorForCell(item: T, column: TableColumnWithTemplate<T>): string {
    const value = column.valueGetter ? column.valueGetter(item) : item[column.key as keyof T];
    return getStatusColor(value);
  }

  getStatusIconForCell(item: T, column: TableColumnWithTemplate<T>): string {
    const value = column.valueGetter ? column.valueGetter(item) : item[column.key as keyof T];
    return getStatusIcon(value);
  }

  getVisibleActions(item: T): TableActionButton<T>[] {
    return this.actions().filter((action) => !action.visible || action.visible(item));
  }

  isActionDisabled(action: TableActionButton<T>, item: T): boolean {
    return action.disabled ? action.disabled(item) : false;
  }

  getCellClasses(column: TableColumnWithTemplate<T>): string {
    const classes: string[] = [];

    if (column.align === 'center') {
      classes.push('text-center');
    } else if (column.align === 'right') {
      classes.push('text-right');
    }

    if (column.type === 'actions') {
      classes.push('whitespace-nowrap');
    }

    return classes.join(' ');
  }

  getActionClass(action: TableActionButton<T>): string {
    return getActionButtonClass(action.color);
  }

  isColumnSorted(column: TableColumnWithTemplate<T>): boolean {
    const sortConfig = this.tableState.sortConfig();
    return sortConfig?.key === column.key;
  }

  getSortIcon(column: TableColumnWithTemplate<T>): string {
    const sortConfig = this.tableState.sortConfig();
    if (sortConfig?.key === column.key) {
      return sortConfig.direction === 'asc' ? '@tui.chevron-up' : '@tui.chevron-down';
    }
    return '@tui.chevron-down';
  }
}
