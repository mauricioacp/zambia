import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../../layout/layout.service';

@Component({
  selector: 'z-page-container',
  imports: [CommonModule],
  template: `
    <!-- Page Content -->
    <main
      id="page-content"
      class="flex min-h-full max-w-full flex-auto grow flex-col pt-16"
    >
      <!-- Page Section -->
      <div class="max-w-10xl mx-auto w-full p-4 lg:p-8">
        <div
          class="flex h-[calc(100lvh-12rem)] rounded-xl border-2 border-gray-200 bg-gray-50 p-5 text-gray-400 dark:border-gray-700 dark:bg-gray-800"
        >
          <ng-content />
          something
        </div>
      </div>
      <!-- END Page Section -->
    </main>
    <!-- END Page Content -->
  `,
  host: {},
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageContainerUiComponent {
  layoutService = inject(LayoutService);
  sidebarOpen = this.layoutService.sidebarOpen;
}
