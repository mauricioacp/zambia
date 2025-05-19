import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiTableTh } from '@taiga-ui/addon-table';
import { TuiCell } from '@taiga-ui/layout';
import { TuiCheckbox } from '@taiga-ui/kit';
import { FormsModule } from '@angular/forms';
import { TuiTitle } from '@taiga-ui/core';

@Component({
  selector: 'z-generic-table',
  standalone: true,
  imports: [CommonModule, TuiTableTh, TuiCell, TuiCheckbox, FormsModule, TuiTitle],
  template: `
    <div class="overflow-x-auto">
      @if (loading()) {
        <!-- Skeleton Table -->
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="w-10 px-6 py-3">
                <div class="h-5 w-5 rounded bg-gray-200 dark:bg-gray-700"></div>
              </th>
              @for (i of [1, 2, 3, 4, 5]; track i) {
                <th scope="col" class="px-6 py-3 text-left">
                  <div class="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
                </th>
              }
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
            @for (i of [1, 2, 3, 4, 5]; track i) {
              <tr>
                <td class="px-6 py-4">
                  <div class="h-5 w-5 rounded bg-gray-200 dark:bg-gray-700"></div>
                </td>
                @for (j of [1, 2, 3, 4, 5]; track j) {
                  <td class="px-6 py-4">
                    <div class="h-4 w-full max-w-[120px] rounded bg-gray-200 dark:bg-gray-700"></div>
                  </td>
                }
              </tr>
            }
          </tbody>
        </table>
      } @else if (items().length > 0) {
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th tuiTh>
                <div [tuiCell]="'m'">
                  <input
                    tuiCheckbox
                    type="checkbox"
                    [ngModel]="checked"
                    [size]="'m'"
                    (ngModelChange)="onCheck($event)"
                  />
                  <span tuiTitle>Checkbox</span>
                </div>
              </th>
              @for (header of displayHeaders(); track header) {
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                >
                  {{ header }}
                </th>
              }
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
            @for (item of items(); track getTrackBy(item)) {
              <tr class="hover:bg-gray-50 dark:hover:bg-gray-800">
                @for (header of displayHeaders(); track header) {
                  <td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                    {{ item[header] }}
                  </td>
                }
              </tr>
            }
          </tbody>
        </table>
      } @else {
        <div class="py-8 text-center text-gray-500 dark:text-gray-400">
          <p>{{ emptyMessage() }}</p>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenericTableUiComponent<T extends Record<string, unknown>> {
  loading = input<boolean>(true);
  items = input<T[]>([]);
  headers = input<string[]>([]);
  emptyMessage = input<string>('No data available');
  itemsSelectionChange = output<T[]>();
  trackBy = input<string>('id');
  displayHeaders = computed(() => {
    const providedHeaders = this.headers();
    const currentItems = this.items();

    if (providedHeaders.length > 0 || !currentItems || currentItems.length === 0) {
      return providedHeaders;
    }

    return Object.keys(currentItems[0]);
  });

  protected get checked(): boolean | null {
    const every = this.items().every(({ selected }) => selected);
    const some = this.items().some(({ selected }) => selected);

    return every || (some && null);
  }

  protected onCheck(checked: boolean): void {
    const updatedItems = this.items().map((item) => ({
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
}
