import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
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
} from '@zambia/ui-components';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '@zambia/data-access-auth';
import { RolesService } from '@zambia/data-access-roles-permissions';

interface NavItem {
  icon: string;
  text: string;
  route: string;
  roles?: string[];
}

interface NavSection {
  header?: string;
  items: NavItem[];
  roles?: string[];
}

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
  ],
  template: `
    <div
      id="page-container"
      [class.lg:pl-72]="layoutService.sidebarOpen()"
      class="mx-auto flex min-h-dvh w-full min-w-80 flex-col bg-gray-100 transition-all duration-500 ease-out dark:bg-gray-900 dark:text-gray-100"
    >
      <z-sidebar [isOpen]="layoutService.sidebarOpen()">
        <z-sidebar-header
          sidebar-header
          title="{{ authService.userName() }}"
          (closeClicked)="layoutService.closeSidebar()"
        >
        </z-sidebar-header>
        <z-sidebar-nav sidebar-nav>
          @for (section of navSectionsByCurrentUserRole(); track section.header) {
            @if (section.header) {
              <z-sidebar-nav-section-header [text]="section.header"></z-sidebar-nav-section-header>
            }
            @for (item of section.items; track item.route) {
              <div class="mb-2">
                <z-main-sidebar-nav-item
                  [icon]="item.icon"
                  [text]="item.text"
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
            (clicked)="this.authService.signOut()"
          ></z-sidebar-nav-item>
        </z-sidebar-mini>
      </z-sidebar>

      <z-page-header [sidebarOpenState]="layoutService.sidebarOpen()" (toggleSidebar)="layoutService.toggleSidebar()">
        <z-brand-logo brand-logo-mobile />
        <div class="flex h-16 flex-none items-center justify-center" brand-logo-mobile></div>
      </z-page-header>
      <z-page-container>
        <router-outlet />
      </z-page-container>
      <!--      <section class="mt-auto">-->
      <!--        <z-page-footer />-->
      <!--      </section>-->
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardSmartComponent implements OnInit {
  readonly layoutService = inject(LayoutService);
  readonly authService = inject(AuthService);
  private allNavSections: NavSection[] = inject(RolesService).allowedNavigationsByRole();
  private readonly rolesService = inject(RolesService);

  readonly navSectionsByCurrentUserRole = signal<NavSection[]>([]);

  ngOnInit(): void {
    this.updateFilteredNavItems();
  }

  private updateFilteredNavItems(): void {
    const currentUserRole = this.rolesService.userRole();
    if (!currentUserRole) {
      this.navSectionsByCurrentUserRole.set([]);
      return;
    }

    const filteredSections = this.allNavSections
      .filter((section) => {
        return !section.roles || this.rolesService.hasAnyRole(section.roles);
      })
      .map((section) => {
        const filteredItems = section.items.filter((item) => {
          return !item.roles || this.rolesService.hasAnyRole(item.roles);
        });
        return { ...section, items: filteredItems };
      })
      .filter((section) => section.items.length > 0);
    this.navSectionsByCurrentUserRole.set(filteredSections);
  }
}
