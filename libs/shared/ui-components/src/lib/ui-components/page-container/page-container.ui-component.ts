import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../../layout/layout.service';

@Component({
  selector: 'z-page-container',
  imports: [CommonModule],
  template: `
    <div
      class="mx-auto flex min-h-dvh w-full min-w-80 flex-col bg-gray-100 dark:bg-gray-900 dark:text-gray-100"
      [class.lg:pl-72]="sidebarOpen()">
      <ng-content select="z-sidebar"></ng-content>
    </div>
  `,
  host: {
    '[attr.data-sidebar-state]': 'sidebarOpen() ? "open" : "closed"',
  },
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageContainerUiComponent {
  layoutService = inject(LayoutService);
  sidebarOpen = this.layoutService.sidebarOpen;
}
