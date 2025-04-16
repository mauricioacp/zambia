import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../../layout/layout.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'z-page-container',
  imports: [CommonModule, RouterOutlet],
  template: `
    <!-- Page Content -->
    <main id="page-content" class="flex max-w-full flex-auto flex-col pt-16">
      <!-- Page Section -->
      <div class="mx-auto w-full max-w-10xl p-4 lg:p-8">
        <div
          class="flex rounded-xl p-5 border-2 border-gray-200 bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-800">
          <router-outlet />
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
