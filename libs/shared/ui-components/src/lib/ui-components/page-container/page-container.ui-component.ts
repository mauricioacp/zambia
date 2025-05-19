import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'z-page-container',
  imports: [CommonModule],
  template: `
    <main id="page-content" class="flex min-h-full max-w-full flex-auto grow flex-col pt-16">
      <div class="max-w-10xl mx-auto w-full p-4 lg:p-8">
        <div
          class="flex h-[calc(100lvh-7rem)] rounded-xl border-2 border-gray-200 bg-gray-50 p-3 text-gray-400 dark:border-gray-700 dark:bg-gray-800"
        >
          <ng-content />
        </div>
      </div>
    </main>
  `,
  host: {},
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageContainerUiComponent {}
