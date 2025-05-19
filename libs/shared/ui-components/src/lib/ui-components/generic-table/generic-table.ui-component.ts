import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ContentChildren,
  input,
  output,
  QueryList,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColumnTemplateDirective } from '../../directives/column-template.directive';

@Component({
  selector: 'z-generic-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="overflow-x-auto overflow-y-auto rounded-lg bg-white shadow-md dark:bg-slate-800">
      @if (loading()) {
        <!-- Skeleton Table -->
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900">
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
          <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-slate-800">
            @for (i of [1, 2, 3, 4, 5]; track i) {
              <tr>
                <td class="px-6 py-4">
                  <div class="h-5 w-5 rounded bg-gray-200 dark:bg-gray-700"></div>
                </td>
                @for (j of [1, 2, 3, 4, 5]; track j) {
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="h-4 w-full max-w-[120px] rounded bg-gray-200 dark:bg-gray-700"></div>
                  </td>
                }
              </tr>
            }
          </tbody>
        </table>
      } @else if (items().length > 0) {
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              @for (header of displayHeaders(); track header) {
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
                >
                  {{ displayLabels()[header] || header }}
                </th>
              }

              <!-- Action columns -->
              @for (action of actions(); track action) {
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
                >
                  {{ action }}
                </th>
              }
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-slate-800">
            @for (item of items(); track getTrackBy(item)) {
              <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                @for (header of displayHeaders(); track header) {
                  <td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-300">
                    @if (getColumnTemplate(header)) {
                      <ng-container
                        [ngTemplateOutlet]="getColumnTemplate(header)"
                        [ngTemplateOutletContext]="{ $implicit: item, item: item }"
                      ></ng-container>
                    } @else if (header === 'status') {
                      <span
                        class="inline-flex rounded-full px-2 text-xs leading-5 font-semibold"
                        [class.bg-green-100]="item[header] === 'active'"
                        [class.text-green-800]="item[header] === 'active'"
                        [class.dark:bg-green-900]="item[header] === 'active'"
                        [class.dark:text-green-300]="item[header] === 'active'"
                        [class.bg-gray-100]="item[header] !== 'active'"
                        [class.text-gray-800]="item[header] !== 'active'"
                        [class.dark:bg-gray-900]="item[header] !== 'active'"
                        [class.dark:text-gray-300]="item[header] !== 'active'"
                      >
                        {{ item[header] }}
                      </span>
                    } @else {
                      {{ item[header] }}
                    }
                  </td>
                }

                <!-- Action column cells -->
                @for (action of actions(); track action) {
                  <td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-300">
                    <ng-container
                      [ngTemplateOutlet]="getColumnTemplate(action)"
                      [ngTemplateOutletContext]="{ $implicit: item, item: item }"
                    ></ng-container>
                  </td>
                }
              </tr>
            }
          </tbody>
        </table>
      } @else {
        <div class="px-6 py-4">
          <div class="border-l-4 border-yellow-400 bg-yellow-50 p-4 dark:border-yellow-500 dark:bg-yellow-900">
            <p class="text-yellow-700 dark:text-yellow-300">{{ emptyMessage() }}</p>
          </div>
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
  headerLabels = input<Record<string, string>>({});
  actions = input<string[]>([]);
  emptyMessage = input<string>('No data available');
  itemsSelectionChange = output<T[]>();
  trackBy = input<string>('id');

  @ContentChildren(ColumnTemplateDirective) columnTemplates?: QueryList<ColumnTemplateDirective<T>>;

  displayHeaders = computed(() => {
    const providedHeaders = this.headers();
    const currentItems = this.items();

    if (providedHeaders.length > 0 || !currentItems || currentItems.length === 0) {
      return providedHeaders;
    }

    return Object.keys(currentItems[0]);
  });

  displayLabels = computed(() => this.headerLabels() || {});

  getColumnTemplate(columnName: string): TemplateRef<any> | null {
    if (!this.columnTemplates) {
      return null;
    }

    const templateDir = this.columnTemplates.find((dir) => dir.columnName === columnName);
    return templateDir ? templateDir.template : null;
  }

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
