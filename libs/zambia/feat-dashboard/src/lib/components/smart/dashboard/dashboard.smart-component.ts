import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  BrandLogoComponent,
  LayoutService,
  MainSidebarNavItemUiComponent,
  PageContainerUiComponent,
  PageHeaderUiComponent,
  SidebarHeaderUiComponent,
  SidebarMiniUiComponent,
  SidebarNavItemUiComponent,
  SidebarNavSectionHeaderUiComponent,
  SidebarNavUiComponent,
  SidebarUiComponent,
  WindowService,
} from '@zambia/ui-components';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '@zambia/data-access-auth';
import { RoleService } from '@zambia/data-access-roles-permissions';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'z-dashboard',
  imports: [
    CommonModule,
    SidebarUiComponent,
    PageContainerUiComponent,
    PageHeaderUiComponent,
    SidebarMiniUiComponent,
    SidebarNavItemUiComponent,
    SidebarHeaderUiComponent,
    SidebarNavUiComponent,
    MainSidebarNavItemUiComponent,
    SidebarNavSectionHeaderUiComponent,
    BrandLogoComponent,
    RouterOutlet,
    TranslateModule,
  ],
  template: `
    <div
      id="page-container"
      [class.lg:pl-72]="layoutService.sidebarOpen()"
      class="flex min-h-dvh w-full flex-col bg-gray-100 transition-all duration-500 ease-out dark:bg-gray-900 dark:text-gray-100"
    >
      <z-sidebar [isOpen]="layoutService.sidebarOpen()">
        <z-sidebar-header
          sidebar-header
          title="{{ authService.userName() }}"
          (closeClicked)="layoutService.toggleSidebar()"
        >
        </z-sidebar-header>
        <z-sidebar-nav sidebar-nav>
          @for (section of roleService.getNavigationItems(); track section) {
            @if (section.headerKey) {
              <z-sidebar-nav-section-header [text]="section.headerKey | translate"> </z-sidebar-nav-section-header>
            }
            @for (item of section.items; track item.key) {
              <div class="mb-2">
                <z-main-sidebar-nav-item
                  [icon]="item.icon"
                  [text]="item.translationKey | translate"
                  [route]="item.route"
                ></z-main-sidebar-nav-item>
              </div>
            }
          }
        </z-sidebar-nav>
        <z-sidebar-mini sidebar-mini>
          <z-sidebar-nav-item
            [label]="'Panel de gestión'"
            main-nav
            icon="layout-dashboard"
            [route]="'/dashboard/panel'"
          ></z-sidebar-nav-item>
          <z-sidebar-nav-item [label]="'Mis datos'" user-nav icon="user" [route]="'settings'"></z-sidebar-nav-item>
          <z-sidebar-nav-item
            [label]="'Cerrar sesión'"
            user-nav
            icon="log-out"
            (clicked)="handleLogout()"
          ></z-sidebar-nav-item>
        </z-sidebar-mini>
      </z-sidebar>

      <!-- Mobile backdrop -->
      @if (layoutService.sidebarOpen() && windowService.isMobile()) {
        <button
          type="button"
          class="fixed inset-0 z-40 cursor-default bg-black/50 transition-opacity duration-300 lg:hidden"
          (click)="layoutService.closeSidebar()"
          aria-label="Close sidebar"
        ></button>
      }

      <z-page-header [sidebarOpenState]="layoutService.sidebarOpen()" (toggleSidebar)="layoutService.toggleSidebar()">
        <z-brand-logo brand-logo-mobile />
        <div class="flex h-16 flex-none items-center justify-center" brand-logo-mobile></div>
      </z-page-header>
      <z-page-container>
        <router-outlet />
      </z-page-container>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardSmartComponent {
  layoutService = inject(LayoutService);
  authService = inject(AuthService);
  roleService = inject(RoleService);
  windowService = inject(WindowService);

  async handleLogout() {
    try {
      await this.authService.signOut();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
}
