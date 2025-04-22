import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../../layout/layout.service';
import { MatIcon } from '@angular/material/icon';
import { MatMiniFabButton } from '@angular/material/button';
import { NotificationsButtonComponent } from './notifications-button.component';
import { ThemeToggleComponent } from './theme-toggle.component';

@Component({
  selector: 'z-page-header',
  imports: [CommonModule, MatIcon, MatMiniFabButton, NotificationsButtonComponent, ThemeToggleComponent],
  template: `
    <header
      id="page-header"
      [class.lg:pl-72]="layoutService.sidebarOpen()"
      class="fixed top-0 right-0 left-0 z-30 flex h-16 flex-none items-center bg-white shadow-xs dark:bg-gray-800"
    >
      <div class="max-w-10xl mx-auto flex w-full justify-between px-4 lg:px-8">
        <!-- Left Section -->
        <div class="flex items-center gap-2">
          <!-- Toggle Sidebar on Desktop -->
          <div class="hidden lg:block">
            <button (click)="layoutService.toggleSidebar()" mat-mini-fab aria-label="Abrir/Cerrar menu">
              <mat-icon>menu</mat-icon>
            </button>
          </div>
          <!-- END Toggle Sidebar on Desktop -->

          <!-- Toggle Sidebar on Mobile -->
          <div class="lg:hidden">
            <button (click)="layoutService.openSidebar()" mat-mini-fab aria-label="Abrir/Cerrar menu">
              <mat-icon>menu</mat-icon>
            </button>
          </div>
          <!-- END Toggle Sidebar on Mobile -->
        </div>
        <!-- END Left Section -->

        <!-- Center Section -->
        <div class="flex items-center lg:hidden">
          <ng-content select="[brand-logo-mobile]"></ng-content>
        </div>
        <!-- END Center Section -->

        <!-- Right Section -->
        <div class="flex items-center gap-2">
          <z-theme-toggle />
          <z-notifications-button />
        </div>
        <!-- END Right Section -->
      </div>
    </header>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeaderUiComponent {
  readonly layoutService = inject(LayoutService);
}
