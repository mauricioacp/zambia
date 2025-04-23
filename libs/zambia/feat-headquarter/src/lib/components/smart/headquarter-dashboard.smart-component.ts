import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'z-headquarter-dashboard',
  imports: [CommonModule],
  template: `<!-- Statistics: Bordered with Info and Action -->
    <div class="grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-8">
      <!-- Card -->
      <a
        href="javascript:void(0)"
        class="flex flex-col rounded-lg border border-gray-200 bg-white hover:border-gray-300 active:border-blue-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:border-gray-600 dark:active:border-blue-700"
      >
        <div class="flex grow items-center justify-between p-5">
          <dl>
            <dt class="text-2xl font-bold">458</dt>
            <dd class="text-sm font-medium text-gray-500 dark:text-gray-400">Sales</dd>
          </dl>
          <div
            class="flex size-12 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-500 dark:border-blue-900 dark:bg-blue-900/25 dark:text-blue-100"
          >
            <svg
              class="hi-outline hi-presentation-chart-line size-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"
              />
            </svg>
          </div>
        </div>
        <div
          class="border-t border-gray-100 px-5 py-3 text-xs font-medium text-gray-500 dark:border-gray-700/50 dark:text-gray-400"
        >
          <p>In the last 30 days</p>
        </div>
      </a>
      <!-- END Card -->

      <!-- Card -->
      <a
        href="javascript:void(0)"
        class="flex flex-col rounded-lg border border-gray-200 bg-white hover:border-gray-300 active:border-blue-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:border-gray-600 dark:active:border-blue-700"
      >
        <div class="flex grow items-center justify-between p-5">
          <dl>
            <dt class="text-2xl font-bold">$7,685</dt>
            <dd class="text-sm font-medium text-gray-500 dark:text-gray-400">Earnings</dd>
          </dl>
          <div
            class="flex size-12 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-500 dark:border-blue-900 dark:bg-blue-900/25 dark:text-blue-100"
          >
            <svg
              class="hi-solid hi-wallet inline-block size-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
              />
            </svg>
          </div>
        </div>
        <div
          class="border-t border-gray-100 px-5 py-3 text-xs font-medium text-gray-500 dark:border-gray-700/50 dark:text-gray-400"
        >
          <p>Available to withdraw</p>
        </div>
      </a>
      <!-- END Card -->

      <!-- Card -->
      <a
        href="javascript:void(0)"
        class="flex flex-col rounded-lg border border-gray-200 bg-white hover:border-gray-300 active:border-blue-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:border-gray-600 dark:active:border-blue-700"
      >
        <div class="flex grow items-center justify-between p-5">
          <dl>
            <dt class="text-2xl font-bold">16,852</dt>
            <dd class="text-sm font-medium text-gray-500 dark:text-gray-400">Customers</dd>
          </dl>
          <div
            class="flex size-12 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-500 dark:border-blue-900 dark:bg-blue-900/25 dark:text-blue-100"
          >
            <svg
              class="hi-outline hi-users inline-block size-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
              />
            </svg>
          </div>
        </div>
        <div
          class="border-t border-gray-100 px-5 py-3 text-xs font-medium text-gray-500 dark:border-gray-700/50 dark:text-gray-400"
        >
          <p>All active accounts</p>
        </div>
      </a>
      <!-- END Card -->
    </div>
    <!-- END Statistics: Bordered with Info and Action --> `,
  styles: `
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeadquarterDashboardSmartComponent {}
