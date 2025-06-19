import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'z-page-container',
  imports: [CommonModule],
  template: `
    <main id="page-content" class="flex flex-auto flex-col pt-16">
      <div class="w-full overflow-x-auto p-4 lg:p-8">
        <ng-content />
      </div>
    </main>
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
