import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton, MatMiniFabButton } from '@angular/material/button';
import { LayoutService } from '../../layout/layout.service';
import { ThemeService } from '../../layout/theme.service';

@Component({
  selector: 'z-page-header',
  imports: [CommonModule, MatIcon, MatIconButton, MatMiniFabButton],
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
            <button
              (click)="layoutService.toggleSidebar()"
              mat-mini-fab
              aria-label="Abrir/Cerrar menu"
            >
              <mat-icon>menu</mat-icon>
            </button>
          </div>
          <!-- END Toggle Sidebar on Desktop -->

          <!-- Toggle Sidebar on Mobile -->
          <div class="lg:hidden">
            <button
              (click)="layoutService.openSidebar()"
              mat-mini-fab
              aria-label="Abrir/Cerrar menu"
            >
              <mat-icon>menu</mat-icon>
            </button>
          </div>
          <!-- END Toggle Sidebar on Mobile -->
        </div>
        <!-- END Left Section -->

        <!-- Center Section -->
        <div class="flex items-center lg:hidden">
          <a
            href="javascript:void(0)"
            class="group inline-flex items-center gap-2 text-lg font-bold tracking-wide text-gray-900 hover:text-gray-600 dark:text-gray-100 dark:hover:text-gray-300"
          >
            <svg
              class="hi-mini hi-cube-transparent inline-block size-5 text-blue-600 transition group-hover:scale-110 dark:text-blue-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M9.638 1.093a.75.75 0 01.724 0l2 1.104a.75.75 0 11-.724 1.313L10 2.607l-1.638.903a.75.75 0 11-.724-1.313l2-1.104zM5.403 4.287a.75.75 0 01-.295 1.019l-.805.444.805.444a.75.75 0 01-.724 1.314L3.5 7.02v.73a.75.75 0 01-1.5 0v-2a.75.75 0 01.388-.657l1.996-1.1a.75.75 0 011.019.294zm9.194 0a.75.75 0 011.02-.295l1.995 1.101A.75.75 0 0118 5.75v2a.75.75 0 01-1.5 0v-.73l-.884.488a.75.75 0 11-.724-1.314l.806-.444-.806-.444a.75.75 0 01-.295-1.02zM7.343 8.284a.75.75 0 011.02-.294L10 8.893l1.638-.903a.75.75 0 11.724 1.313l-1.612.89v1.557a.75.75 0 01-1.5 0v-1.557l-1.612-.89a.75.75 0 01-.295-1.019zM2.75 11.5a.75.75 0 01.75.75v1.557l1.608.887a.75.75 0 01-.724 1.314l-1.996-1.101A.75.75 0 012 14.25v-2a.75.75 0 01.75-.75zm14.5 0a.75.75 0 01.75.75v2a.75.75 0 01-.388.657l-1.996 1.1a.75.75 0 11-.724-1.313l1.608-.887V12.25a.75.75 0 01.75-.75zm-7.25 4a.75.75 0 01.75.75v.73l.888-.49a.75.75 0 01.724 1.313l-2 1.104a.75.75 0 01-.724 0l-2-1.104a.75.75 0 11.724-1.313l.888.49v-.73a.75.75 0 01.75-.75z"
                clip-rule="evenodd"
              />
            </svg>
            <span class="hidden sm:inline">Company</span>
          </a>
        </div>
        <!-- END Center Section -->

        <!-- Right Section -->
        <div class="flex items-center gap-2">
          <!-- Notifications -->
          <button
            mat-icon-button
            (click)="toggleTheme()"
            [attr.aria-label]="
              isDark() ? 'Switch to Light Mode' : 'Switch to Dark Mode'
            "
          >
            <mat-icon>{{ isDark() ? 'light_mode' : 'dark_mode' }}</mat-icon>
          </button>
          <a
            href="javascript:void(0)"
            class="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm leading-5 font-semibold text-gray-800 hover:border-gray-300 hover:text-gray-900 hover:shadow-xs focus:ring-3 focus:ring-gray-300/25 active:border-gray-200 active:shadow-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-200 dark:focus:ring-gray-600/40 dark:active:border-gray-700"
          >
            <mat-icon>notifications</mat-icon>
          </a>
          <!-- END Notifications -->
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
  private themeService = inject(ThemeService);
  isDark = () => this.themeService.isDarkTheme();

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
