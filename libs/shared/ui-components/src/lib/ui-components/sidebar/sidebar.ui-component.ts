import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../../layout/layout.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'z-sidebar',
  imports: [CommonModule, MatIcon],
  template: `
    <!-- Page Sidebar -->
    <!--
      Sidebar on Mobile
        Closed '-translate-x-full'
        Opened 'translate-x-0'

      Sidebar on Desktop
        Closed 'lg:-translate-x-full'
        Opened 'lg:translate-x-0'
    -->
    <aside
      id="page-sidebar"
      [class.-translate-x-full]="!layoutService.sidebarOpen()"
      [class.translate-x-0]="layoutService.sidebarOpen()"
      [class.lg:translate-x-0]="layoutService.sidebarOpen()"
      class="fixed top-0 bottom-0 left-0 z-50 flex h-full w-full -translate-x-full flex-col border-r border-gray-200 bg-gray-800 pl-14 duration-300 ease-in-out lg:w-72 lg:translate-x-0 dark:border-gray-800 dark:text-gray-200"
      aria-label="Main Sidebar Navigation"
    >
      <ng-content />

      <!-- Sidebar Content -->
      <div class="h-screen overflow-y-auto bg-white dark:bg-gray-800">
        <!-- Sidebar Header -->
        <div
          class="flex h-16 w-full flex-none items-center justify-between px-4 shadow-xs lg:justify-center dark:bg-gray-600/25"
        >
          <h2 class="grow text-sm font-semibold">Bienvenido User</h2>

          <!-- Close Sidebar on Mobile -->
          <div class="flex-none lg:hidden">
            <button
              (click)="layoutService.closeSidebar()"
              type="button"
              class="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm leading-5 font-semibold text-gray-800 hover:border-gray-300 hover:text-gray-900 hover:shadow-xs focus:ring-3 focus:ring-gray-300/25 active:border-gray-200 active:shadow-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-200 dark:focus:ring-gray-600/40 dark:active:border-gray-700"
            >
              <svg
                class="hi-mini hi-x-mark -mx-0.5 inline-block size-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
                />
              </svg>
            </button>
          </div>
          <!-- END Close Sidebar on Mobile -->
        </div>
        <!-- END Sidebar Header -->

        <!-- Sidebar Navigation -->
        <div class="overflow-y-auto">
          <div class="w-full p-4">
            <nav class="space-y-1">
              <a
                href="javascript:void(0)"
                class="group flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-2.5 text-sm font-medium text-gray-900 dark:border-transparent dark:bg-gray-700/75 dark:text-white"
              >
                <span class="flex flex-none items-center text-blue-500 dark:text-gray-300">
                  <mat-icon aria-hidden="false" aria-label="home icon" fontIcon="home"></mat-icon>
                </span>
                <span class="grow py-2">Mi sede</span>
              </a>
              <div class="px-3 pt-5 pb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">Integrantes</div>
              <a
                href="javascript:void(0)"
                class="group flex items-center gap-2 rounded-lg border border-transparent px-2.5 text-sm font-medium text-gray-800 hover:bg-blue-50 hover:text-gray-900 active:border-blue-100 dark:text-gray-200 dark:hover:bg-gray-700/75 dark:hover:text-white dark:active:border-gray-600"
              >
                <span
                  class="flex flex-none items-center text-gray-400 group-hover:text-blue-500 dark:text-gray-500 dark:group-hover:text-gray-300"
                >
                  <mat-icon>face</mat-icon>
                </span>
                <span class="grow py-2">Alumnos</span>
                <span
                  class="inline-flex rounded-full border border-blue-200 bg-blue-100 px-1.5 py-0.5 text-xs leading-4 font-semibold text-blue-700 dark:border-blue-700 dark:bg-blue-700 dark:text-blue-50"
                >
                  26
                </span>
              </a>
              <a
                href="javascript:void(0)"
                class="group flex items-center gap-2 rounded-lg border border-transparent px-2.5 text-sm font-medium text-gray-800 hover:bg-blue-50 hover:text-gray-900 active:border-blue-100 dark:text-gray-200 dark:hover:bg-gray-700/75 dark:hover:text-white dark:active:border-gray-600"
              >
                <span
                  class="flex flex-none items-center text-gray-400 group-hover:text-blue-500 dark:text-gray-500 dark:group-hover:text-gray-300"
                >
                  <mat-icon>person</mat-icon>
                </span>
                <span class="grow py-2">Facilitadores</span>
                <span
                  class="inline-flex rounded-full border border-blue-200 bg-blue-100 px-1.5 py-0.5 text-xs leading-4 font-semibold text-blue-700 dark:border-blue-700 dark:bg-blue-700 dark:text-blue-50"
                >
                  26
                </span>
              </a>
              <a
                href="javascript:void(0)"
                class="group flex items-center gap-2 rounded-lg border border-transparent px-2.5 text-sm font-medium text-gray-800 hover:bg-blue-50 hover:text-gray-900 active:border-blue-100 dark:text-gray-200 dark:hover:bg-gray-700/75 dark:hover:text-white dark:active:border-gray-600"
              >
                <span
                  class="flex flex-none items-center text-gray-400 group-hover:text-blue-500 dark:text-gray-500 dark:group-hover:text-gray-300"
                >
                  <mat-icon>people</mat-icon>
                </span>
                <span class="grow py-2">Acompañantes</span>
                <span
                  class="inline-flex rounded-full border border-blue-200 bg-blue-100 px-1.5 py-0.5 text-xs leading-4 font-semibold text-blue-700 dark:border-blue-700 dark:bg-blue-700 dark:text-blue-50"
                >
                  26
                </span>
              </a>
            </nav>
          </div>
        </div>
        <!-- END Sidebar Navigation -->
      </div>
      <!-- END Sidebar Content -->
    </aside>
    <!-- Page Sidebar -->
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarUiComponent {
  readonly layoutService = inject(LayoutService);
}
