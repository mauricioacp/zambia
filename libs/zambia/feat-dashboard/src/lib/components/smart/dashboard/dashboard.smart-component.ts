import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon, MatIconRegistry } from '@angular/material/icon';
import { MatMiniFabButton } from '@angular/material/button';
import { DomSanitizer } from '@angular/platform-browser';
import { logoSvg } from '@zambia/ui-components';
import { LayoutService } from '@zambia/ui-components';

@Component({
  selector: 'z-dashboard',
  imports: [CommonModule, MatIcon, MatMiniFabButton],
  template: `
    <!-- Page Container -->
    <!--
      Sidebar on Desktop
        Closed '' (no class)
        Opened 'lg:pl-72'
    -->
    <div
      id="page-container"
      [class.lg:pl-72]="layoutService.sidebarOpen()"
      class="mx-auto flex min-h-dvh w-full min-w-80 flex-col bg-gray-100  dark:bg-gray-900 dark:text-gray-100">
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
        class="fixed top-0 bottom-0 left-0 z-50 flex h-full w-full -translate-x-full flex-col border-r border-gray-200 bg-gray-800 pl-14 transition-transform duration-300 ease-in-out lg:w-72 lg:translate-x-0 dark:border-gray-800 dark:text-gray-200"
        aria-label="Main Sidebar Navigation">
        <!-- Sidebar Mini -->
        <div class="absolute top-0 bottom-0 left-0 z-10 flex w-14 flex-col border-r border-transparent bg-gray-900/50">
          <!-- Brand -->
          <div class="flex-none">
            <a
              href="javascript:void(0)"
              class="flex h-16 w-full items-center justify-center text-lg font-bold tracking-wide text-blue-400 hover:bg-gray-900 hover:text-blue-300 active:bg-gray-900/50">
              <mat-icon class="logo-icon inline-block" svgIcon="logo"></mat-icon>
            </a>
          </div>
          <!-- END Brand -->

          <!-- Main Navigation -->
          <nav class="grow space-y-2 px-2 py-4">
            <a
              href="javascript:void(0)"
              class="flex h-10 w-full items-center justify-center rounded-sm text-gray-300 hover:bg-gray-700 hover:text-gray-100 active:bg-gray-700/5">
              <mat-icon>dashboard</mat-icon>
            </a>
            <!--            <a-->
            <!--              href="javascript:void(0)"-->
            <!--              class="flex h-10 w-full items-center justify-center rounded-sm text-gray-300 hover:bg-gray-700 hover:text-gray-100 active:bg-gray-700/5">-->
            <!--              <mat-icon>insert_chart</mat-icon>-->
            <!--            </a>-->
            <!--            <a-->
            <!--              href="javascript:void(0)"-->
            <!--              class="flex h-10 w-full items-center justify-center rounded-sm text-gray-300 hover:bg-gray-700 hover:text-gray-100 active:bg-gray-700/5">-->
            <!--              <mat-icon>description</mat-icon>-->
            <!--            </a>-->
          </nav>
          <!-- END Main Navigation -->

          <!-- User Navigation -->
          <nav class="flex-none space-y-2 px-2 py-4">
            <a
              href="javascript:void(0)"
              class="flex h-10 w-full items-center justify-center rounded-sm text-gray-300 hover:bg-gray-700 hover:text-gray-100 active:bg-gray-700/5">
              <mat-icon>settings</mat-icon>
            </a>
            <a
              href="javascript:void(0)"
              class="flex h-10 w-full items-center justify-center rounded-sm text-gray-300 hover:bg-gray-700 hover:text-gray-100 active:bg-gray-700/5">
              <mat-icon>logout</mat-icon>
            </a>
          </nav>
          <!-- END User Navigation -->
        </div>
        <!-- END Sidebar Mini -->

        <!-- Sidebar Content -->
        <div class="h-screen overflow-y-auto bg-white dark:bg-gray-800">
          <!-- Sidebar Header -->
          <div
            class="flex h-16 w-full flex-none items-center justify-between px-4 shadow-xs lg:justify-center dark:bg-gray-600/25">
            <h2 class="grow text-sm font-semibold">Bienvenido User</h2>

            <!-- Close Sidebar on Mobile -->
            <div class="flex-none lg:hidden">
              <button
                (click)="layoutService.closeSidebar()"
                type="button"
                class="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm leading-5 font-semibold text-gray-800 hover:border-gray-300 hover:text-gray-900 hover:shadow-xs focus:ring-3 focus:ring-gray-300/25 active:border-gray-200 active:shadow-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-200 dark:focus:ring-gray-600/40 dark:active:border-gray-700">
                <svg
                  class="hi-mini hi-x-mark -mx-0.5 inline-block size-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true">
                  <path
                    d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
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
                  class="group flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-2.5 text-sm font-medium text-gray-900 dark:border-transparent dark:bg-gray-700/75 dark:text-white">
                  <span class="flex flex-none items-center text-blue-500 dark:text-gray-300">
                    <mat-icon aria-hidden="false" aria-label="home icon" fontIcon="home"></mat-icon>
                  </span>
                  <span class="grow py-2">Mi sede</span>
                  <span
                    class="inline-flex rounded-full border border-blue-200 bg-blue-100 px-1.5 py-0.5 text-xs leading-4 font-semibold text-blue-700 dark:border-blue-700 dark:bg-blue-700 dark:text-blue-50">
                    3
                  </span>
                </a>
                <div class="px-3 pt-5 pb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                  Integrantes
                </div>
                <a
                  href="javascript:void(0)"
                  class="group flex items-center gap-2 rounded-lg border border-transparent px-2.5 text-sm font-medium text-gray-800 hover:bg-blue-50 hover:text-gray-900 active:border-blue-100 dark:text-gray-200 dark:hover:bg-gray-700/75 dark:hover:text-white dark:active:border-gray-600">
                  <span
                    class="flex flex-none items-center text-gray-400 group-hover:text-blue-500 dark:text-gray-500 dark:group-hover:text-gray-300">
                    <mat-icon>face</mat-icon>
                  </span>
                  <span class="grow py-2">Alumnos</span>
                  <span
                    class="inline-flex rounded-full border border-blue-200 bg-blue-100 px-1.5 py-0.5 text-xs leading-4 font-semibold text-blue-700 dark:border-blue-700 dark:bg-blue-700 dark:text-blue-50">
                    26
                  </span>
                </a>
                <a
                  href="javascript:void(0)"
                  class="group flex items-center gap-2 rounded-lg border border-transparent px-2.5 text-sm font-medium text-gray-800 hover:bg-blue-50 hover:text-gray-900 active:border-blue-100 dark:text-gray-200 dark:hover:bg-gray-700/75 dark:hover:text-white dark:active:border-gray-600">
                  <span
                    class="flex flex-none items-center text-gray-400 group-hover:text-blue-500 dark:text-gray-500 dark:group-hover:text-gray-300">
                    <mat-icon>person</mat-icon>
                  </span>
                  <span class="grow py-2">Facilitadores</span>
                  <span
                    class="inline-flex rounded-full border border-blue-200 bg-blue-100 px-1.5 py-0.5 text-xs leading-4 font-semibold text-blue-700 dark:border-blue-700 dark:bg-blue-700 dark:text-blue-50">
                    26
                  </span>
                </a>
                <a
                  href="javascript:void(0)"
                  class="group flex items-center gap-2 rounded-lg border border-transparent px-2.5 text-sm font-medium text-gray-800 hover:bg-blue-50 hover:text-gray-900 active:border-blue-100 dark:text-gray-200 dark:hover:bg-gray-700/75 dark:hover:text-white dark:active:border-gray-600">
                  <span
                    class="flex flex-none items-center text-gray-400 group-hover:text-blue-500 dark:text-gray-500 dark:group-hover:text-gray-300">
                    <mat-icon>people</mat-icon>
                  </span>
                  <span class="grow py-2">Acompañantes</span>
                  <span
                    class="inline-flex rounded-full border border-blue-200 bg-blue-100 px-1.5 py-0.5 text-xs leading-4 font-semibold text-blue-700 dark:border-blue-700 dark:bg-blue-700 dark:text-blue-50">
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

      <!-- Page Header -->
      <!--
        Sidebar on Desktop
          Closed '' (no class)
          Opened 'lg:pl-72'
      -->
      <header
        id="page-header"
        [class.lg:pl-72]="layoutService.sidebarOpen()"
        class="fixed top-0 right-0 left-0 z-30 flex h-16 flex-none items-center bg-white shadow-xs dark:bg-gray-800">
        <div class="mx-auto flex w-full max-w-10xl justify-between px-4 lg:px-8">
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
            <a
              href="javascript:void(0)"
              class="group inline-flex items-center gap-2 text-lg font-bold tracking-wide text-gray-900 hover:text-gray-600 dark:text-gray-100 dark:hover:text-gray-300">
              <svg
                class="hi-mini hi-cube-transparent inline-block size-5 text-blue-600 transition group-hover:scale-110 dark:text-blue-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true">
                <path
                  fill-rule="evenodd"
                  d="M9.638 1.093a.75.75 0 01.724 0l2 1.104a.75.75 0 11-.724 1.313L10 2.607l-1.638.903a.75.75 0 11-.724-1.313l2-1.104zM5.403 4.287a.75.75 0 01-.295 1.019l-.805.444.805.444a.75.75 0 01-.724 1.314L3.5 7.02v.73a.75.75 0 01-1.5 0v-2a.75.75 0 01.388-.657l1.996-1.1a.75.75 0 011.019.294zm9.194 0a.75.75 0 011.02-.295l1.995 1.101A.75.75 0 0118 5.75v2a.75.75 0 01-1.5 0v-.73l-.884.488a.75.75 0 11-.724-1.314l.806-.444-.806-.444a.75.75 0 01-.295-1.02zM7.343 8.284a.75.75 0 011.02-.294L10 8.893l1.638-.903a.75.75 0 11.724 1.313l-1.612.89v1.557a.75.75 0 01-1.5 0v-1.557l-1.612-.89a.75.75 0 01-.295-1.019zM2.75 11.5a.75.75 0 01.75.75v1.557l1.608.887a.75.75 0 01-.724 1.314l-1.996-1.101A.75.75 0 012 14.25v-2a.75.75 0 01.75-.75zm14.5 0a.75.75 0 01.75.75v2a.75.75 0 01-.388.657l-1.996 1.1a.75.75 0 11-.724-1.313l1.608-.887V12.25a.75.75 0 01.75-.75zm-7.25 4a.75.75 0 01.75.75v.73l.888-.49a.75.75 0 01.724 1.313l-2 1.104a.75.75 0 01-.724 0l-2-1.104a.75.75 0 11.724-1.313l.888.49v-.73a.75.75 0 01.75-.75z"
                  clip-rule="evenodd" />
              </svg>
              <span class="hidden sm:inline">Company</span>
            </a>
          </div>
          <!-- END Center Section -->

          <!-- Right Section -->
          <div class="flex items-center gap-2">
            <!-- Notifications -->
            <a
              href="javascript:void(0)"
              class="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm leading-5 font-semibold text-gray-800 hover:border-gray-300 hover:text-gray-900 hover:shadow-xs focus:ring-3 dark:hover:text-gray-200 focus:ring-gray-300/25 active:border-gray-200 active:shadow-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-200 dark:focus:ring-gray-600/40 dark:active:border-gray-700">
              <mat-icon>notifications</mat-icon>
            </a>
            <!-- END Notifications -->
          </div>
          <!-- END Right Section -->
        </div>
      </header>
      <!-- END Page Header -->

      <!-- Page Content -->
      <main id="page-content" class="flex max-w-full flex-auto flex-col pt-16">
        <!-- Page Section -->
        <div class="mx-auto w-full max-w-10xl p-4 lg:p-8">
          <!--

          ADD YOUR MAIN CONTENT BELOW

          -->

          <!-- Placeholder -->
          <div
            class="flex items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 py-64 text-gray-400 dark:border-gray-700 dark:bg-gray-800">
            Content (max width 1920px)
          </div>

          <!--

          ADD YOUR MAIN CONTENT ABOVE

          -->
        </div>
        <!-- END Page Section -->
      </main>
      <!-- END Page Content -->

      <!-- Page Footer -->
      <footer id="page-footer" class="flex flex-none items-center bg-white dark:bg-gray-800/50">
        <div
          class="mx-auto flex w-full max-w-10xl flex-col px-4 text-center text-sm md:flex-row md:justify-between md:text-left lg:px-8">
          <div class="pt-4 pb-1 md:pb-4">
            <a
              href="https://tailkit.com"
              target="_blank"
              class="font-medium text-blue-600 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300">
              Tailkit
            </a>
            ©
          </div>
          <div class="inline-flex items-center justify-center pt-1 pb-4 md:pt-4">
            <span>Crafted with</span>
            <svg
              class="hi-solid hi-heart mx-1 inline-block size-4 text-red-600"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clip-rule="evenodd" />
            </svg>
            <span>
              by
              <a
                href="https://pixelcave.com"
                target="_blank"
                class="font-medium text-blue-600 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300">
                pixelcave
              </a>
            </span>
          </div>
        </div>
      </footer>
      <!-- END Page Footer -->
    </div>
    <!-- END Page Container -->
  `,
  styles: `
    .logo-icon {
      width: 44px;
      height: 44px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardSmartComponent {
  private readonly iconRegistry = inject(MatIconRegistry);
  private readonly domSanitizer = inject(DomSanitizer);
  readonly layoutService = inject(LayoutService);
  constructor() {
    this.iconRegistry.addSvgIconLiteral('logo', this.domSanitizer.bypassSecurityTrustHtml(logoSvg));
  }
}
