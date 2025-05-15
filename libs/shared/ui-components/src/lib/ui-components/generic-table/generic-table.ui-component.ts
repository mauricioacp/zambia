/* eslint-disable */

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  InputSignal,
  output,
  signal,
  TemplateRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TuiButton, TuiExpandComponent, TuiIcon, TuiLoader, TuiTextfield } from '@taiga-ui/core';
import { TuiPagination, TuiTooltip } from '@taiga-ui/kit';
import { TuiTable } from '@taiga-ui/addon-table';

/**
 * Defines the structure for a table column.
 * @template T The type of data in the row.
 */
export interface ColumnDefinition<T> {
  /** Unique key for the column, can be a dot-separated path for nested properties. */
  key: string;
  /** Text to display in the column header. */
  header: string;
  /** Optional: Whether the column is sortable (sorting logic not fully implemented in this example). */
  sortable?: boolean;
  /** Optional: Custom template for rendering cells in this column.
   * Receives the row item as $implicit and the resolved cell value as `value`.
   */
  cellTemplate?: TemplateRef<{ $implicit: T; value: any }>;
  /** Optional: CSS class(es) for the header cell (<th>). */
  headerClass?: string;
  /** Optional: CSS class(es) for the data cells (<td>). Can be a string or a function returning a string. */
  cellClass?: string | ((item: T) => string);
}

/**
 * Defines a custom action to be displayed for each row.
 * @template T The type of data in the row.
 */
export interface RowAction<T> {
  /** Taiga UI icon name (e.g., '@tui.edit', '@tui.trash'). */
  icon: string;
  /** Accessible label for the action button (used as title/tooltip). */
  label: string;
  /** A unique key to identify the action when an event is emitted. */
  actionKey: string;
  /** Optional: Function to determine if the action should be disabled for a specific item. */
  disabled?: (item: T) => boolean;
  /** Optional: CSS class(es) for the action button. Can be a string or a function returning a string. */
  class?: string | ((item: T) => string);
}

@Component({
  selector: 'z-generic-table',
  imports: [
    CommonModule,
    CommonModule,
    FormsModule,
    TuiTextfield,
    TuiExpandComponent,
    TuiPagination,
    TuiButton,
    TuiTable,
    TuiLoader,
    TuiIcon,
    TuiTooltip,
  ],
  template: ` <div class="smart-table-container" [ngClass]="customTableClass()">
      <div class="smart-table-controls">
        <tui-textfield iconStart="@tui.search">
          <label tuiLabel>I am a label</label>
          <input placeholder="I am placeholder" tuiTextfield />
          <tui-icon icon="@tui.bell" />
          <tui-icon tuiTooltip="I am a hint" />
        </tui-textfield>
        <!-- Items per page selector can be added here -->
      </div>

      <div class="tui-table-wrapper">
        <tui-loader [showLoader]="isLoading()" [overlay]="true" size="l">
          <table tuiTable [columns]="columnKeys()" class="smart-table" aria-label="Data table">
            <thead tuiThead>
              <tr tuiThGroup>
                <th
                  *ngIf="expandableRowContent()"
                  tuiTh
                  class="expand-column tui-table__th_sticky tui-table__th_sticky-left"
                  scope="col"
                >
                  <span class="visually-hidden">Expand/Collapse Row</span>
                </th>
                <th *ngFor="let col of columns()" tuiTh="col.key" [class]="col.headerClass || ''" scope="col">
                  {{ col.header }}
                  <!-- Add sorting indicators if col.sortable -->
                </th>
                <th
                  *ngIf="actions().length > 0"
                  tuiTh
                  class="actions-column tui-table__th_sticky tui-table__th_sticky-right"
                  scope="col"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody tuiTbody [data]="paginatedData()">
              <ng-container *ngFor="let item of paginatedData(); let i = index">
                <tr tuiTr>
                  <td
                    *ngIf="expandableRowContent()"
                    tuiTd
                    class="expand-column tui-table__td_sticky tui-table__td_sticky-left"
                  >
                    <button
                      tuiIconButton
                      type="button"
                      size="s"
                      appearance="icon"
                      (click)="toggleExpandRow(item)"
                      [title]="isRowExpanded(item) ? 'Collapse row' : 'Expand row'"
                      [attr.aria-expanded]="isRowExpanded(item)"
                      [attr.aria-controls]="'expanded-content-' + i"
                    >
                      <tui-icon
                        [icon]="isRowExpanded(item) ? '@tui.chevron-up' : '@tui.chevron-down'"
                        [style.height.rem]="1"
                      />
                    </button>
                  </td>
                  <td
                    *ngFor="let col of columns()"
                    tuiTd="col.key"
                    [class]="typeof col.cellClass === 'function' ? col.cellClass(item) : col.cellClass || ''"
                  >
                    <ng-container *ngIf="col.cellTemplate; else defaultCell">
                      <ng-container
                        *tuiLet="resolveValue(item, col.key) as value"
                        [ngTemplateOutlet]="col.cellTemplate"
                        [ngTemplateOutletContext]="{ $implicit: item, value: value }"
                      ></ng-container>
                    </ng-container>
                    <ng-template #defaultCell>
                      {{ resolveValue(item, col.key) }}
                    </ng-template>
                  </td>
                  <td
                    *ngIf="actions().length > 0"
                    tuiTd
                    class="actions-column tui-table__td_sticky tui-table__td_sticky-right"
                  >
                    <button
                      *ngFor="let action of actions()"
                      tuiIconButton
                      type="button"
                      size="s"
                      appearance="icon"
                      (click)="handleRowAction(action, item)"
                      [title]="action.label"
                      [attr.aria-label]="action.label + ' for ' + item['name']"
                      [disabled]="action.disabled ? action.disabled(item) : false"
                      [ngClass]="typeof action.class === 'function' ? action.class(item) : action.class || ''"
                    >
                      <tui-icon [icon]="action.icon" [style.height.rem]="1" />
                    </button>
                  </td>
                </tr>
                <tr
                  *ngIf="expandableRowContent() && isRowExpanded(item)"
                  class="expanded-row"
                  [id]="'expanded-content-' + i"
                >
                  <td [attr.colspan]="getColspan()">
                    <tui-expand [expanded]="isRowExpanded(item)" class="expanded-content-host">
                      <ng-container
                        [ngTemplateOutlet]="expandableRowContent()!"
                        [ngTemplateOutletContext]="{ $implicit: item }"
                      ></ng-container>
                    </tui-expand>
                  </td>
                </tr>
              </ng-container>
              <tr *ngIf="!paginatedData().length && !isLoading()">
                <td [attr.colspan]="getColspan()" class="no-data-cell">No data to display.</td>
              </tr>
            </tbody>
          </table>
        </tui-loader>
      </div>

      <tui-pagination
        *ngIf="totalPages() > 1 && totalItems() > 0"
        class="smart-table-pagination"
        [length]="totalPages()"
        [index]="currentPage()"
        (indexChange)="onPageChange($event)"
      ></tui-pagination>
    </div>

    <span class="visually-hidden" aria-live="polite">
      {{
        isLoading()
          ? 'Table data is loading.'
          : paginatedData().length
            ? 'Table data loaded.'
            : 'No data available in table.'
      }}
    </span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenericTableUiComponent<T extends Record<string, any>> {
  // Inputs
  /** The array of data items to display in the table. */
  data: InputSignal<T[]> = input.required<T[]>();
  /** Array of column definitions for the table. */
  columns: InputSignal<ColumnDefinition<T>[]> = input.required<ColumnDefinition<T>[]>();
  /** Array of row action definitions. */
  actions: InputSignal<RowAction<T>[]> = input<RowAction<T>[]>([]);
  // itemsPerPageOptions: InputSignal<number[]> = input<number[]>([10, 25, 50, 100]); // For future items per page selector
  /** Initial number of items to display per page. */
  initialItemsPerPage: InputSignal<number> = input<number>(10);
  /** Placeholder text for the search input. */
  searchPlaceholder: InputSignal<string> = input<string>('Search...');
  /** Optional template for rendering expanded row content. Receives the row item as $implicit. */
  expandableRowContent: InputSignal<TemplateRef<{ $implicit: T }> | undefined> = input<TemplateRef<{ $implicit: T }>>();
  /** Signal to indicate if data is currently loading. */
  isLoading: InputSignal<boolean> = input<boolean>(false);
  /** Optional custom CSS class(es) for the main table container. */
  customTableClass: InputSignal<string> = input<string>('');

  // Outputs
  /** Emits when a row action button is clicked. */
  rowActionClicked = output<{ action: RowAction<T>; item: T }>();
  /** Emits the debounced search term when it changes. */
  searchTermChanged = output<string>();
  /** Emits when the page or items per page changes. */
  pageChanged = output<{ page: number; itemsPerPage: number }>();

  // Internal Signals
  protected searchTerm = signal<string>('');
  protected debouncedSearchTerm = signal<string>('');
  protected currentPage = signal<number>(0); // 0-indexed
  protected itemsPerPage = signal<number>(10); // Initialized in constructor
  protected expandedRows = signal<Set<T>>(new Set());

  private searchDebounceSubject = new Subject<string>();
  private destroyRef = inject(DestroyRef);

  constructor() {
    this.itemsPerPage.set(this.initialItemsPerPage()); // Initialize from input

    this.searchDebounceSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((term) => {
        this.debouncedSearchTerm.set(term);
        this.currentPage.set(0); // Reset to first page on search
        this.searchTermChanged.emit(term);
      });

    // Effect to re-calculate pagination or current page if data/filters change
    effect(
      () => {
        const total = this.totalItems();
        const perPage = this.itemsPerPage();
        const current = this.currentPage();
        const maxPage = total > 0 ? Math.ceil(total / perPage) - 1 : 0;

        if (current > maxPage) {
          this.currentPage.set(maxPage);
        }
        this.pageChanged.emit({ page: this.currentPage(), itemsPerPage: perPage });
      },
      { allowSignalWrites: true }
    );
  }

  // Computed Signals
  protected readonly filteredData = computed(() => {
    const allData = this.data();
    const term = this.debouncedSearchTerm().toLowerCase();

    if (!term) {
      return allData;
    }
    return allData.filter((item) =>
      this.columns().some((colDef) => {
        const value = this.resolveValue(item, colDef.key);
        return String(value).toLowerCase().includes(term);
      })
    );
  });

  protected readonly totalItems = computed(() => this.filteredData().length);

  protected readonly paginatedData = computed(() => {
    const dataToPaginate = this.filteredData();
    const page = this.currentPage();
    const perPage = this.itemsPerPage();
    const startIndex = page * perPage;
    return dataToPaginate.slice(startIndex, startIndex + perPage);
  });

  protected readonly totalPages = computed(() => {
    const total = this.totalItems();
    const perPage = this.itemsPerPage();
    return total > 0 ? Math.ceil(total / perPage) : 1; // Return 1 even for 0 items for tui-pagination
  });

  protected readonly columnKeys = computed(() => this.columns().map((col) => col.key));

  protected onRawSearchTermChange(term: string): void {
    this.searchTerm.set(term);
    this.searchDebounceSubject.next(term);
  }

  protected onPageChange(newPageIndex: number): void {
    this.currentPage.set(newPageIndex);
  }

  onItemsPerPageChange(newItemsPerPage: number): void {
    this.itemsPerPage.set(newItemsPerPage);
    this.currentPage.set(0);
  }

  protected handleRowAction(action: RowAction<T>, item: T): void {
    if (action.disabled && action.disabled(item)) {
      return;
    }
    this.rowActionClicked.emit({ action, item });
  }

  protected toggleExpandRow(item: T): void {
    this.expandedRows.update((currentSet) => {
      const newSet = new Set(currentSet);
      if (newSet.has(item)) {
        newSet.delete(item);
      } else {
        newSet.add(item);
      }
      return newSet;
    });
  }

  protected isRowExpanded(item: T): boolean {
    return this.expandedRows().has(item);
  }

  /**
   * Resolves a value from an item using a dot-separated path.
   * @param item The data object.
   * @param path The dot-separated string path to the value.
   * @returns The resolved value, or undefined if the path is invalid.
   */
  protected resolveValue(item: T | null | undefined, path: string): any {
    if (!item) {
      return undefined;
    }
    return path.split('.').reduce((acc: any, part: string) => {
      if (acc && typeof acc === 'object' && part in acc) {
        return acc[part];
      }
      return undefined;
    }, item);
  }

  protected getColspan(): number {
    let colspan = this.columns().length;
    if (this.actions().length > 0) {
      colspan++;
    }
    if (this.expandableRowContent()) {
      colspan++;
    }
    return colspan > 0 ? colspan : 1;
  }
}
