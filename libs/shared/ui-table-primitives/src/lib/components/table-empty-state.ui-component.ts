import { Component, input, ChangeDetectionStrategy } from '@angular/core';

import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { TableEmptyStateConfig } from '../types/table-primitives.types';

@Component({
  selector: 'z-table-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TuiButton, TuiIcon],
  template: `
    <div class="flex flex-col items-center justify-center px-6 py-12 text-center">
      @if (config().icon) {
        <div class="mb-4 rounded-full bg-gray-100 p-3 dark:bg-slate-700">
          <tui-icon [icon]="config().icon!" class="text-gray-400 dark:text-gray-500" style="font-size: 2rem;" />
        </div>
      }

      <h3 class="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
        {{ config().title }}
      </h3>

      @if (config().description) {
        <p class="mb-6 max-w-md text-sm text-gray-600 dark:text-gray-400">
          {{ config().description }}
        </p>
      }

      @if (config().actionLabel && config().actionCallback) {
        <button tuiButton type="button" appearance="primary" size="m" (click)="config().actionCallback!()">
          {{ config().actionLabel }}
        </button>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class TableEmptyStateComponent {
  config = input.required<TableEmptyStateConfig>();
}
