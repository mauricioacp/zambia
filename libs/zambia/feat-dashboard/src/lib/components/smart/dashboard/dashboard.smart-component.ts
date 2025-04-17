import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LayoutService,
  MainSidebarNavItemUiComponent,
  PageContainerUiComponent,
  PageFooterUiComponent,
  PageHeaderUiComponent,
  SidebarHeaderUiComponent,
  SidebarMiniUiComponent,
  SidebarNavItemUiComponent,
  SidebarNavSectionHeaderUiComponent,
  SidebarNavUiComponent,
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
    SidebarHeaderUiComponent,
    SidebarNavUiComponent,
    MainSidebarNavItemUiComponent,
    SidebarNavSectionHeaderUiComponent,
  ],
  template: `
    <div
      id="page-container"
      [class.lg:pl-72]="layoutService.sidebarOpen()"
      class="mx-auto flex min-h-dvh w-full min-w-80 flex-col bg-gray-100 dark:bg-gray-900 dark:text-gray-100"
    >
      <z-sidebar>
        <z-sidebar-header sidebar-header title="Bienvenido Usuario" (closeClicked)="layoutService.closeSidebar()">
        </z-sidebar-header>
        <z-sidebar-nav sidebar-nav>
          <z-main-sidebar-nav-item icon="home" text="Mi sede" [route]="''"></z-main-sidebar-nav-item>
          <z-sidebar-nav-section-header text="Integrantes"></z-sidebar-nav-section-header>
          <z-main-sidebar-nav-item
            icon="face"
            text="Alumnos"
            [badgeNumber]="26"
            [route]="'students'"
          ></z-main-sidebar-nav-item>
          <z-main-sidebar-nav-item
            icon="person"
            text="Facilitadores"
            [badgeNumber]="26"
            [route]="'facilitators'"
          ></z-main-sidebar-nav-item>
          <z-main-sidebar-nav-item
            icon="people"
            text="Acompañantes"
            [badgeNumber]="26"
            [route]="'companions'"
          ></z-main-sidebar-nav-item>
        </z-sidebar-nav>
        <z-sidebar-mini sidebar-mini>
          <z-sidebar-nav-item main-nav icon="dashboard" [route]="'/'"></z-sidebar-nav-item>
          <z-sidebar-nav-item user-nav icon="settings" [route]="'settings'"></z-sidebar-nav-item>
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
