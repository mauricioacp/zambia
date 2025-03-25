import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'z-sidebar',
  imports: [CommonModule],
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
      [id]="'z-sidebar'"
      class="fixed top-0 bottom-0 left-0 z-50 flex h-full w-full -translate-x-full flex-col border-r border-gray-200 bg-gray-800 pl-14 transition-transform duration-500 ease-out lg:w-72 lg:translate-x-0 dark:border-gray-800 dark:text-gray-200"
      aria-label="Main Sidebar Navigation">
      <ng-content select="z-sidebar-mini"></ng-content>

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
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarUiComponent {}
