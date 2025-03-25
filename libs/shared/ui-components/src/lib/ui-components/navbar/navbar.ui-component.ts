import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'z-navbar',
  imports: [CommonModule],
  template: `
    <!-- Page Container -->
    <!--
      Sidebar on Desktop
        Closed '' (no class)
        Opened 'lg:pl-72'
    -->
    <div
      id="page-container"
      class="mx-auto flex min-h-dvh w-full min-w-80 flex-col bg-gray-100 lg:pl-72 dark:bg-gray-900 dark:text-gray-100">
      <!-- Page Header -->
      <!--
        Sidebar on Desktop
          Closed '' (no class)
          Opened 'lg:pl-72'
      -->
      <header
        id="page-header"
        class="fixed top-0 right-0 left-0 z-30 flex h-16 flex-none items-center bg-white shadow-xs lg:pl-72 dark:bg-gray-800">
        <div class="mx-auto flex w-full max-w-10xl justify-between px-4 lg:px-8">
          <!-- Left Section -->
          <div class="flex items-center gap-2">
            <!-- Toggle Sidebar on Desktop -->
            <div class="hidden lg:block">
              <button
                type="button"
                class="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm leading-5 font-semibold text-gray-800 hover:border-gray-300 hover:text-gray-900 hover:shadow-xs focus:ring-3 focus:ring-gray-300/25 active:border-gray-200 active:shadow-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-200 dark:focus:ring-gray-600/40 dark:active:border-gray-700">
                <svg
                  class="hi-solid hi-menu-alt-1 inline-block size-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill-rule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clip-rule="evenodd" />
                </svg>
              </button>
            </div>
            <!-- END Toggle Sidebar on Desktop -->

            <!-- Toggle Sidebar on Mobile -->
            <div class="lg:hidden">
              <button
                type="button"
                class="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm leading-5 font-semibold text-gray-800 hover:border-gray-300 hover:text-gray-900 hover:shadow-xs focus:ring-3 focus:ring-gray-300/25 active:border-gray-200 active:shadow-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-200 dark:focus:ring-gray-600/40 dark:active:border-gray-700">
                <svg
                  class="hi-solid hi-menu-alt-1 inline-block size-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill-rule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clip-rule="evenodd" />
                </svg>
              </button>
            </div>
            <!-- END Toggle Sidebar on Mobile -->

            <!-- Search -->
            <div class="hidden lg:block">
              <form onsubmit="return false;">
                <input
                  type="text"
                  class="block w-full rounded-lg border border-gray-200 py-2 text-sm leading-5 placeholder-gray-400 focus:border-blue-500 focus:ring-3 focus:ring-blue-500/50 dark:border-gray-700 dark:bg-gray-900/25 dark:focus:border-blue-500"
                  id="search"
                  name="search"
                  placeholder="Search.." />
              </form>
            </div>
            <div class="lg:hidden">
              <button
                type="button"
                class="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm leading-5 font-semibold text-gray-800 hover:border-gray-300 hover:text-gray-900 hover:shadow-xs focus:ring-3 focus:ring-gray-300/25 active:border-gray-200 active:shadow-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-200 dark:focus:ring-gray-600/40 dark:active:border-gray-700">
                <svg
                  class="hi-solid hi-search inline-block size-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill-rule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clip-rule="evenodd" />
                </svg>
              </button>
            </div>
            <!-- END Search -->
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
              class="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm leading-5 font-semibold text-gray-800 hover:border-gray-300 hover:text-gray-900 hover:shadow-xs focus:ring-3 focus:ring-gray-300/25 active:border-gray-200 active:shadow-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-200 dark:focus:ring-gray-600/40 dark:active:border-gray-700">
              <svg
                class="hi-outline hi-bell-alert inline-block size-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5" />
              </svg>
            </a>
            <!-- END Notifications -->

            <!-- User Dropdown -->
            <div class="relative inline-block">
              <!-- Dropdown Toggle Button -->
              <button
                type="button"
                id="tk-dropdown-layouts-user"
                class="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm leading-5 font-semibold text-gray-800 hover:border-gray-300 hover:text-gray-900 hover:shadow-xs focus:ring-3 focus:ring-gray-300/25 active:border-gray-200 active:shadow-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-200 dark:focus:ring-gray-600/40 dark:active:border-gray-700"
                aria-haspopup="true"
                aria-expanded="true">
                <svg
                  class="hi-mini hi-user-circle inline-block size-5 sm:hidden"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true">
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z"
                    clip-rule="evenodd" />
                </svg>
                <span class="hidden sm:inline">John</span>
                <svg
                  class="hi-mini hi-chevron-down hidden size-5 opacity-40 sm:inline-block"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true">
                  <path
                    fill-rule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clip-rule="evenodd" />
                </svg>
              </button>
              <!-- END Dropdown Toggle Button -->

              <!-- Dropdown -->
              <!--
                Visibility
                  Closed        'hidden'
                  Opened        '' (no class)

                Show/Hide with transitions
                  enter         'transition ease-out duration-100'
                  enter-start   'opacity-0 scale-90'
                  enter-end     'opacity-100 scale-100'
                  leave         'transition ease-in duration-75'
                  leave-start   'opacity-100 scale-100'
                  leave-end     'opacity-0 scale-90'
              -->
              <div
                role="menu"
                aria-labelledby="tk-dropdown-layouts-user"
                class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-lg shadow-xl dark:shadow-gray-900">
                <div
                  class="divide-y divide-gray-100 rounded-lg bg-white ring-1 ring-black/5 dark:divide-gray-700 dark:bg-gray-800 dark:ring-gray-700">
                  <div class="space-y-1 p-2.5">
                    <a
                      role="menuitem"
                      href="javascript:void(0)"
                      class="group flex items-center justify-between gap-2 rounded-lg border border-transparent px-2.5 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-800 active:border-blue-100 dark:text-gray-200 dark:hover:bg-gray-700/75 dark:hover:text-white dark:active:border-gray-600">
                      <svg
                        class="hi-mini hi-inbox inline-block size-5 flex-none opacity-25 group-hover:opacity-50"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true">
                        <path
                          fill-rule="evenodd"
                          d="M1 11.27c0-.246.033-.492.099-.73l1.523-5.521A2.75 2.75 0 015.273 3h9.454a2.75 2.75 0 012.651 2.019l1.523 5.52c.066.239.099.485.099.732V15a2 2 0 01-2 2H3a2 2 0 01-2-2v-3.73zm3.068-5.852A1.25 1.25 0 015.273 4.5h9.454a1.25 1.25 0 011.205.918l1.523 5.52c.006.02.01.041.015.062H14a1 1 0 00-.86.49l-.606 1.02a1 1 0 01-.86.49H8.236a1 1 0 01-.894-.553l-.448-.894A1 1 0 006 11H2.53l.015-.062 1.523-5.52z"
                          clip-rule="evenodd" />
                      </svg>
                      <span class="grow">Inbox</span>
                      <div
                        class="inline-flex rounded-full border border-blue-200 bg-blue-100 px-1.5 py-0.5 text-xs leading-4 font-semibold text-blue-700 dark:border-blue-700 dark:bg-blue-700 dark:text-blue-50">
                        2
                      </div>
                    </a>
                    <a
                      role="menuitem"
                      href="javascript:void(0)"
                      class="group flex items-center justify-between gap-2 rounded-lg border border-transparent px-2.5 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-800 active:border-blue-100 dark:text-gray-200 dark:hover:bg-gray-700/75 dark:hover:text-white dark:active:border-gray-600">
                      <svg
                        class="hi-mini hi-flag inline-block size-5 flex-none opacity-25 group-hover:opacity-50"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true">
                        <path
                          d="M3.5 2.75a.75.75 0 00-1.5 0v14.5a.75.75 0 001.5 0v-4.392l1.657-.348a6.449 6.449 0 014.271.572 7.948 7.948 0 005.965.524l2.078-.64A.75.75 0 0018 12.25v-8.5a.75.75 0 00-.904-.734l-2.38.501a7.25 7.25 0 01-4.186-.363l-.502-.2a8.75 8.75 0 00-5.053-.439l-1.475.31V2.75z" />
                      </svg>
                      <span class="grow">Notifications</span>
                      <div
                        class="inline-flex rounded-full border border-blue-200 bg-blue-100 px-1.5 py-0.5 text-xs leading-4 font-semibold text-blue-700 dark:border-blue-700 dark:bg-blue-700 dark:text-blue-50">
                        5
                      </div>
                    </a>
                  </div>
                  <div class="space-y-1 p-2.5">
                    <a
                      role="menuitem"
                      href="javascript:void(0)"
                      class="group flex items-center justify-between gap-2 rounded-lg border border-transparent px-2.5 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-800 active:border-blue-100 dark:text-gray-200 dark:hover:bg-gray-700/75 dark:hover:text-white dark:active:border-gray-600">
                      <svg
                        class="hi-mini hi-user-circle inline-block size-5 flex-none opacity-25 group-hover:opacity-50"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true">
                        <path
                          fill-rule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z"
                          clip-rule="evenodd" />
                      </svg>
                      <span class="grow">Account</span>
                    </a>
                    <a
                      role="menuitem"
                      href="javascript:void(0)"
                      class="group flex items-center justify-between gap-2 rounded-lg border border-transparent px-2.5 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-800 active:border-blue-100 dark:text-gray-200 dark:hover:bg-gray-700/75 dark:hover:text-white dark:active:border-gray-600">
                      <svg
                        class="hi-mini hi-cog-6-tooth inline-block size-5 flex-none opacity-25 group-hover:opacity-50"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true">
                        <path
                          fill-rule="evenodd"
                          d="M7.84 1.804A1 1 0 018.82 1h2.36a1 1 0 01.98.804l.331 1.652a6.993 6.993 0 011.929 1.115l1.598-.54a1 1 0 011.186.447l1.18 2.044a1 1 0 01-.205 1.251l-1.267 1.113a7.047 7.047 0 010 2.228l1.267 1.113a1 1 0 01.206 1.25l-1.18 2.045a1 1 0 01-1.187.447l-1.598-.54a6.993 6.993 0 01-1.929 1.115l-.33 1.652a1 1 0 01-.98.804H8.82a1 1 0 01-.98-.804l-.331-1.652a6.993 6.993 0 01-1.929-1.115l-1.598.54a1 1 0 01-1.186-.447l-1.18-2.044a1 1 0 01.205-1.251l1.267-1.114a7.05 7.05 0 010-2.227L1.821 7.773a1 1 0 01-.206-1.25l1.18-2.045a1 1 0 011.187-.447l1.598.54A6.993 6.993 0 017.51 3.456l.33-1.652zM10 13a3 3 0 100-6 3 3 0 000 6z"
                          clip-rule="evenodd" />
                      </svg>
                      <span class="grow">Settings</span>
                    </a>
                  </div>
                  <div class="space-y-1 p-2.5">
                    <form onsubmit="return false;">
                      <button
                        type="submit"
                        role="menuitem"
                        class="group flex w-full items-center justify-between gap-2 rounded-lg border border-transparent px-2.5 py-2 text-left text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-800 active:border-blue-100 dark:text-gray-200 dark:hover:bg-gray-700/75 dark:hover:text-white dark:active:border-gray-600">
                        <svg
                          class="hi-mini hi-lock-closed inline-block size-5 flex-none opacity-25 group-hover:opacity-50"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true">
                          <path
                            fill-rule="evenodd"
                            d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                            clip-rule="evenodd" />
                        </svg>
                        <span class="grow">Sign out</span>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
              <!-- END Dropdown -->
            </div>
            <!-- END User Dropdown -->
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
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarUiComponent {}
