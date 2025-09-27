import { Component, input, ChangeDetectionStrategy } from '@angular/core';

import { TuiLoader } from '@taiga-ui/core';
import { TableLoadingStateConfig } from '../types/table-primitives.types';

@Component({
  selector: 'z-table-loading-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TuiLoader],
  template: `
    <div class="flex flex-col items-center justify-center px-6 py-12">
      @if (config().showSpinner !== false) {
        <tui-loader size="l" class="mb-4" />
      }

      @if (config().text) {
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{ config().text }}
        </p>
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
export class TableLoadingStateComponent {
  config = input<TableLoadingStateConfig>({});
}
