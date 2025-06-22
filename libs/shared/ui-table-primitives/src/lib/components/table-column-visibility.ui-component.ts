import { Component, input, output, signal, computed, ChangeDetectionStrategy, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TuiButton, TuiDataList, TuiDropdown } from '@taiga-ui/core';
import { TableColumnConfig } from '../types/table-primitives.types';

@Component({
  selector: 'z-table-column-visibility',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, TuiButton, TuiDropdown, TuiDataList],
  template: `
    <button
      tuiButton
      type="button"
      appearance="secondary"
      size="m"
      icon="@tui.settings"
      [tuiDropdown]="columnDropdown"
      [tuiDropdownOpen]="dropdownOpen()"
      (tuiDropdownOpenChange)="dropdownOpen.set($event)"
    >
      Columns
    </button>

    <ng-template #columnDropdown>
      <div class="w-64 p-4">
        <div class="mb-3 flex items-center justify-between">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Visible Columns</h3>
          <button tuiButton type="button" appearance="secondary" size="xs" (click)="toggleAll()">
            {{ allVisible() ? 'Hide All' : 'Show All' }}
          </button>
        </div>

        <div class="space-y-2">
          @for (column of columns(); track column.key) {
            <label
              class="flex cursor-pointer items-center gap-2 rounded-md p-2 hover:bg-gray-50 dark:hover:bg-slate-700"
              [for]="'column-checkbox-' + column.key"
            >
              <input
                type="checkbox"
                [id]="'column-checkbox-' + column.key"
                [checked]="column.visible"
                (change)="toggleColumn(column)"
                class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <span class="text-sm text-gray-700 dark:text-gray-300">
                {{ column.label }}
              </span>
            </label>
          }
        </div>

        <div class="mt-3 border-t border-gray-200 pt-3 dark:border-slate-700">
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ visibleCount() }} of {{ columns().length }} columns visible
          </p>
        </div>
      </div>
    </ng-template>
  `,
  styles: [
    `
      :host {
        display: inline-block;
      }
    `,
  ],
})
export class TableColumnVisibilityComponent implements OnInit {
  columns = input.required<TableColumnConfig[]>();
  columnsChange = output<TableColumnConfig[]>();
  storageKey = input<string>(); // Optional key for localStorage persistence

  dropdownOpen = signal(false);

  visibleCount = computed(() => this.columns().filter((col) => col.visible).length);
  allVisible = computed(() => this.visibleCount() === this.columns().length);

  constructor() {
    // Save to localStorage whenever columns change (if storageKey is provided)
    effect(() => {
      const key = this.storageKey();
      const columns = this.columns();

      if (key && columns.length > 0) {
        const visibilityMap = columns.reduce(
          (acc, col) => {
            acc[col.key as string] = col.visible;
            return acc;
          },
          {} as Record<string, boolean>
        );

        try {
          localStorage.setItem(key, JSON.stringify(visibilityMap));
        } catch (e) {
          console.warn('Failed to save column visibility to localStorage:', e);
        }
      }
    });
  }

  ngOnInit(): void {
    // Load from localStorage on init
    const key = this.storageKey();
    if (key) {
      try {
        const saved = localStorage.getItem(key);
        if (saved) {
          const visibilityMap = JSON.parse(saved) as Record<string, boolean>;
          const restoredColumns = this.columns().map((col) => ({
            ...col,
            visible: visibilityMap[col.key as string] ?? col.visible,
          }));

          // Only emit if there are actual changes
          if (JSON.stringify(restoredColumns) !== JSON.stringify(this.columns())) {
            this.columnsChange.emit(restoredColumns);
          }
        }
      } catch (e) {
        console.warn('Failed to load column visibility from localStorage:', e);
      }
    }
  }

  toggleColumn(column: TableColumnConfig): void {
    const updatedColumns = this.columns().map((col) =>
      col.key === column.key ? { ...col, visible: !col.visible } : col
    );
    this.columnsChange.emit(updatedColumns);
  }

  toggleAll(): void {
    const shouldShow = !this.allVisible();
    const updatedColumns = this.columns().map((col) => ({
      ...col,
      visible: shouldShow,
    }));
    this.columnsChange.emit(updatedColumns);
  }
}
