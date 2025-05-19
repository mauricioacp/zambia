import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'z-page-container',
  imports: [CommonModule],
  template: `
    <div class="max-w-10xl p-4 lg:p-8">
      <div
        class="flex h-full flex-col rounded-xl border-2 border-gray-200 bg-gray-50 p-3 text-gray-400 dark:border-gray-700 dark:bg-gray-800"
      >
        <ng-content />
      </div>
    </div>
  `,
  host: {},
  styles: `
    :host {
      display: block;
      width: 100%;
      min-height: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageContainerUiComponent {}
