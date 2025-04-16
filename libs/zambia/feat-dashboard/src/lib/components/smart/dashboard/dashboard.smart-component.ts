import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PageContainerUiComponent,
  PageFooterUiComponent,
  PageHeaderUiComponent,
  SidebarMiniUiComponent,
  SidebarUiComponent,
} from '@zambia/ui-components';
import { LayoutService } from '@zambia/ui-components';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'z-dashboard',
  imports: [
    CommonModule,
    SidebarUiComponent,
    PageContainerUiComponent,
    PageFooterUiComponent,
    PageHeaderUiComponent,
    RouterOutlet,
    SidebarMiniUiComponent,
  ],
  template: `
    <div
      id="page-container"
      [class.lg:pl-72]="layoutService.sidebarOpen()"
      class="mx-auto flex min-h-dvh w-full min-w-80 flex-col bg-gray-100 dark:bg-gray-900 dark:text-gray-100"
    >
      <z-sidebar>
        <z-sidebar-mini></z-sidebar-mini>
      </z-sidebar>
      <z-page-header />
      <z-page-container>
        <router-outlet></router-outlet>
      </z-page-container>
      <section class="mt-auto">
        <z-page-footer />
      </section>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardSmartComponent {
  readonly layoutService = inject(LayoutService);
}
