import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'z-dashboard',
  imports: [CommonModule, MatIcon],
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
        class="fixed top-0 bottom-0 left-0 z-50 flex h-full w-full -translate-x-full flex-col border-r border-gray-200 bg-gray-800 pl-14 transition-transform duration-500 ease-out lg:w-72 lg:translate-x-0 dark:border-gray-800 dark:text-gray-200"
        aria-label="Main Sidebar Navigation">
        <!-- Sidebar Mini -->
        <div class="absolute top-0 bottom-0 left-0 z-10 flex w-14 flex-col border-r border-transparent bg-gray-900/50">
          <!-- Brand -->
          <div class="flex-none">
            <a
              href="javascript:void(0)"
              class="flex h-16 w-full items-center justify-center text-lg font-bold tracking-wide text-blue-400 hover:bg-gray-900 hover:text-blue-300 active:bg-gray-900/50">
              <svg
                class="hi-mini hi-cube-transparent inline-block size-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true">
                <path
                  fill-rule="evenodd"
                  d="M9.638 1.093a.75.75 0 01.724 0l2 1.104a.75.75 0 11-.724 1.313L10 2.607l-1.638.903a.75.75 0 11-.724-1.313l2-1.104zM5.403 4.287a.75.75 0 01-.295 1.019l-.805.444.805.444a.75.75 0 01-.724 1.314L3.5 7.02v.73a.75.75 0 01-1.5 0v-2a.75.75 0 01.388-.657l1.996-1.1a.75.75 0 011.019.294zm9.194 0a.75.75 0 011.02-.295l1.995 1.101A.75.75 0 0118 5.75v2a.75.75 0 01-1.5 0v-.73l-.884.488a.75.75 0 11-.724-1.314l.806-.444-.806-.444a.75.75 0 01-.295-1.02zM7.343 8.284a.75.75 0 011.02-.294L10 8.893l1.638-.903a.75.75 0 11.724 1.313l-1.612.89v1.557a.75.75 0 01-1.5 0v-1.557l-1.612-.89a.75.75 0 01-.295-1.019zM2.75 11.5a.75.75 0 01.75.75v1.557l1.608.887a.75.75 0 01-.724 1.314l-1.996-1.101A.75.75 0 012 14.25v-2a.75.75 0 01.75-.75zm14.5 0a.75.75 0 01.75.75v2a.75.75 0 01-.388.657l-1.996 1.1a.75.75 0 11-.724-1.313l1.608-.887V12.25a.75.75 0 01.75-.75zm-7.25 4a.75.75 0 01.75.75v.73l.888-.49a.75.75 0 01.724 1.313l-2 1.104a.75.75 0 01-.724 0l-2-1.104a.75.75 0 11.724-1.313l.888.49v-.73a.75.75 0 01.75-.75z"
                  clip-rule="evenodd" />
              </svg>
            </a>
          </div>
          <!-- END Brand -->

          <!-- Main Navigation -->
          <nav class="grow space-y-2 px-2 py-4">
            <a
              href="javascript:void(0)"
              class="flex h-10 w-full items-center justify-center rounded-sm text-gray-300 hover:bg-gray-700 hover:text-gray-100 active:bg-gray-700/5">
              <svg
                class="hi-solid hi-briefcase inline-block size-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                  clip-rule="evenodd" />
                <path
                  d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
              </svg>
            </a>
            <a
              href="javascript:void(0)"
              class="flex h-10 w-full items-center justify-center rounded-sm text-gray-300 hover:bg-gray-700 hover:text-gray-100 active:bg-gray-700/5">
              <svg
                class="hi-solid hi-presentation-chart-line inline-block size-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd" />
              </svg>
            </a>
            <a
              href="javascript:void(0)"
              class="flex h-10 w-full items-center justify-center rounded-sm text-gray-300 hover:bg-gray-700 hover:text-gray-100 active:bg-gray-700/5">
              <svg
                class="hi-solid hi-document-text inline-block size-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                  clip-rule="evenodd" />
              </svg>
            </a>
          </nav>
          <!-- END Main Navigation -->

          <!-- User Navigation -->
          <nav class="flex-none space-y-2 px-2 py-4">
            <a
              href="javascript:void(0)"
              class="flex h-10 w-full items-center justify-center rounded-sm text-gray-300 hover:bg-gray-700 hover:text-gray-100 active:bg-gray-700/5">
              <svg
                class="hi-solid hi-cog inline-block size-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                  clip-rule="evenodd" />
              </svg>
            </a>
            <a
              href="javascript:void(0)"
              class="flex h-10 w-full items-center justify-center rounded-sm text-gray-300 hover:bg-gray-700 hover:text-gray-100 active:bg-gray-700/5">
              <svg
                class="hi-solid hi-logout inline-block size-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                  clip-rule="evenodd" />
              </svg>
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
            <h2 class="grow text-sm font-semibold">Welcome Admin</h2>

            <!-- Close Sidebar on Mobile -->
            <div class="flex-none lg:hidden">
              <button
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
                    <mat-icon aria-hidden="false" aria-label="Example home icon" fontIcon="home"></mat-icon>
                  </span>
                  <span class="grow py-2">Dashboard</span>
                  <span
                    class="inline-flex rounded-full border border-blue-200 bg-blue-100 px-1.5 py-0.5 text-xs leading-4 font-semibold text-blue-700 dark:border-blue-700 dark:bg-blue-700 dark:text-blue-50">
                    3
                  </span>
                </a>
                <a
                  href="javascript:void(0)"
                  class="group flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-2.5 text-sm font-medium text-gray-900 dark:border-transparent dark:bg-gray-700/75 dark:text-white">
                  <span class="flex flex-none items-center text-blue-500 dark:text-gray-300">
                    <svg
                      class="hi-outline hi-home inline-block size-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      aria-hidden="true">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                  </span>
                  <span class="grow py-2">Dashboard</span>
                  <span
                    class="inline-flex rounded-full border border-blue-200 bg-blue-100 px-1.5 py-0.5 text-xs leading-4 font-semibold text-blue-700 dark:border-blue-700 dark:bg-blue-700 dark:text-blue-50">
                    3
                  </span>
                </a>
                <div class="px-3 pt-5 pb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">Projects</div>
                <a
                  href="javascript:void(0)"
                  class="group flex items-center gap-2 rounded-lg border border-transparent px-2.5 text-sm font-medium text-gray-800 hover:bg-blue-50 hover:text-gray-900 active:border-blue-100 dark:text-gray-200 dark:hover:bg-gray-700/75 dark:hover:text-white dark:active:border-gray-600">
                  <span
                    class="flex flex-none items-center text-gray-400 group-hover:text-blue-500 dark:text-gray-500 dark:group-hover:text-gray-300">
                    <svg
                      class="hi-outline hi-briefcase inline-block size-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      aria-hidden="true">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                    </svg>
                  </span>
                  <span class="grow py-2">Manage</span>
                  <span
                    class="inline-flex rounded-full border border-blue-200 bg-blue-100 px-1.5 py-0.5 text-xs leading-4 font-semibold text-blue-700 dark:border-blue-700 dark:bg-blue-700 dark:text-blue-50">
                    99+
                  </span>
                </a>
                <a
                  href="javascript:void(0)"
                  class="group flex items-center gap-2 rounded-lg border border-transparent px-2.5 text-sm font-medium text-gray-800 hover:bg-blue-50 hover:text-gray-900 active:border-blue-100 dark:text-gray-200 dark:hover:bg-gray-700/75 dark:hover:text-white dark:active:border-gray-600">
                  <span
                    class="flex flex-none items-center text-gray-400 group-hover:text-blue-500 dark:text-gray-500 dark:group-hover:text-gray-300">
                    <svg
                      class="hi-outline hi-clipboard-document-list inline-block size-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      aria-hidden="true">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                    </svg>
                  </span>
                  <span class="grow py-2">Tasks</span>
                  <span
                    class="inline-flex rounded-full border border-blue-200 bg-blue-100 px-1.5 py-0.5 text-xs leading-4 font-semibold text-blue-700 dark:border-blue-700 dark:bg-blue-700 dark:text-blue-50">
                    9
                  </span>
                </a>
                <a
                  href="javascript:void(0)"
                  class="group flex items-center gap-2 rounded-lg border border-transparent px-2.5 text-sm font-medium text-gray-800 hover:bg-blue-50 hover:text-gray-900 active:border-blue-100 dark:text-gray-200 dark:hover:bg-gray-700/75 dark:hover:text-white dark:active:border-gray-600">
                  <span
                    class="flex flex-none items-center text-gray-400 group-hover:text-blue-500 dark:text-gray-500 dark:group-hover:text-gray-300">
                    <svg
                      class="hi-outline hi-users inline-block size-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      aria-hidden="true">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    </svg>
                  </span>
                  <span class="grow py-2">Clients</span>
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
                    <svg
                      class="hi-outline hi-plus inline-block size-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </span>
                  <span class="grow py-2">Add New</span>
                </a>
                <div class="px-3 pt-5 pb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">Account</div>
                <a
                  href="javascript:void(0)"
                  class="group flex items-center gap-2 rounded-lg border border-transparent px-2.5 text-sm font-medium text-gray-800 hover:bg-blue-50 hover:text-gray-900 active:border-blue-100 dark:text-gray-200 dark:hover:bg-gray-700/75 dark:hover:text-white dark:active:border-gray-600">
                  <span
                    class="flex flex-none items-center text-gray-400 group-hover:text-blue-500 dark:text-gray-500 dark:group-hover:text-gray-300">
                    <svg
                      class="hi-outline hi-user-circle inline-block size-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      aria-hidden="true">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                  <span class="grow py-2">Profile</span>
                </a>
                <a
                  href="javascript:void(0)"
                  class="group flex items-center gap-2 rounded-lg border border-transparent px-2.5 text-sm font-medium text-gray-800 hover:bg-blue-50 hover:text-gray-900 active:border-blue-100 dark:text-gray-200 dark:hover:bg-gray-700/75 dark:hover:text-white dark:active:border-gray-600">
                  <span
                    class="flex flex-none items-center text-gray-400 group-hover:text-blue-500 dark:text-gray-500 dark:group-hover:text-gray-300">
                    <svg
                      class="hi-outline hi-cog-8-tooth inline-block size-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      aria-hidden="true">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                  <span class="grow py-2">Settings</span>
                </a>
                <a
                  href="javascript:void(0)"
                  class="group flex items-center gap-2 rounded-lg border border-transparent px-2.5 text-sm font-medium text-gray-800 hover:bg-blue-50 hover:text-gray-900 active:border-blue-100 dark:text-gray-200 dark:hover:bg-gray-700/75 dark:hover:text-white dark:active:border-gray-600">
                  <span
                    class="flex flex-none items-center text-gray-400 group-hover:text-blue-500 dark:text-gray-500 dark:group-hover:text-gray-300">
                    <svg
                      class="hi-outline hi-lock-closed inline-block size-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      aria-hidden="true">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </span>
                  <span class="grow py-2">Log out</span>
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
export class DashboardSmartComponent {}
