import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LayoutService,
  PageContainerUiComponent,
  PageFooterUiComponent,
  PageHeaderUiComponent,
  SidebarMiniUiComponent,
  SidebarNavItemUiComponent,
  SidebarUiComponent,
} from '@zambia/ui-components';
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
    SidebarNavItemUiComponent,
  ],
  template: `
    <div
      id="page-container"
      [class.lg:pl-72]="layoutService.sidebarOpen()"
      class="mx-auto flex min-h-dvh w-full min-w-80 flex-col bg-gray-100 dark:bg-gray-900 dark:text-gray-100"
    >
      <z-sidebar>
        <z-sidebar-mini>
          <z-sidebar-nav-item main-nav icon="dashboard" [route]="'/'"></z-sidebar-nav-item>
          <z-sidebar-nav-item user-nav icon="settings" [route]="'/'"></z-sidebar-nav-item>
          <z-sidebar-nav-item user-nav icon="logout" [route]="'/'"></z-sidebar-nav-item>
        </z-sidebar-mini>
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
