import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TuiLoader } from '@taiga-ui/core';

export interface RecentAgreement {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'pending' | 'expired' | 'cancelled';
  createdAt: string;
  headquarter: string;
}

@Component({
  selector: 'z-recent-agreements-widget',
  standalone: true,
  imports: [CommonModule, RouterLink, TuiLoader],
  template: `
    <div
      class="rounded-2xl border border-gray-200/50 bg-white/90 shadow-lg shadow-gray-900/5 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/90 dark:shadow-slate-900/20"
    >
      <div class="flex items-center justify-between border-b border-gray-200 p-6 dark:border-slate-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Agreements</h3>
        <a
          routerLink="/dashboard/agreements"
          class="text-sm font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
        >
          View all
        </a>
      </div>
      <div class="p-6">
        @if (loading()) {
          <div class="flex h-64 items-center justify-center">
            <tui-loader size="m" />
          </div>
        } @else if (agreements().length === 0) {
          <div class="py-12 text-center">
            <svg
              class="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">No recent agreements</p>
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-100 dark:border-slate-700">
                  <th
                    class="pb-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                  >
                    Name
                  </th>
                  <th
                    class="pb-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                  >
                    Role
                  </th>
                  <th
                    class="pb-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                  >
                    Status
                  </th>
                  <th
                    class="pb-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                  >
                    Headquarter
                  </th>
                  <th
                    class="pb-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                  >
                    Date
                  </th>
                  <th class="pb-3"></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-slate-700">
                @for (agreement of agreements(); track agreement.id) {
                  <tr class="group transition-colors hover:bg-gray-50/50 dark:hover:bg-slate-900/50">
                    <td class="py-4">
                      <div>
                        <p class="font-medium text-gray-900 dark:text-white">
                          {{ agreement.name }}
                        </p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                          {{ agreement.email }}
                        </p>
                      </div>
                    </td>
                    <td class="py-4">
                      <span class="text-sm text-gray-600 dark:text-gray-300">
                        {{ agreement.role }}
                      </span>
                    </td>
                    <td class="py-4">
                      <span
                        class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium"
                        [ngClass]="{
                          'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400':
                            agreement.status === 'active',
                          'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400':
                            agreement.status === 'expired' || agreement.status === 'cancelled',
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400':
                            agreement.status === 'pending',
                        }"
                      >
                        {{ agreement.status }}
                      </span>
                    </td>
                    <td class="py-4">
                      <span class="text-sm text-gray-600 dark:text-gray-300">
                        {{ agreement.headquarter }}
                      </span>
                    </td>
                    <td class="py-4">
                      <span class="text-sm text-gray-500 dark:text-gray-400">
                        {{ agreement.createdAt }}
                      </span>
                    </td>
                    <td class="py-4">
                      <button
                        (click)="viewAgreement.emit(agreement.id)"
                        class="text-sky-600 opacity-0 transition-opacity group-hover:opacity-100 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
                      >
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentAgreementsWidgetComponent {
  agreements = input.required<RecentAgreement[]>();
  loading = input<boolean>(false);
  viewAgreement = output<string>();

  getStatusType(status: string): 'positive' | 'negative' | 'warning' | 'neutral' {
    switch (status) {
      case 'active':
        return 'positive';
      case 'expired':
      case 'cancelled':
        return 'negative';
      case 'pending':
        return 'warning';
      default:
        return 'neutral';
    }
  }
}
