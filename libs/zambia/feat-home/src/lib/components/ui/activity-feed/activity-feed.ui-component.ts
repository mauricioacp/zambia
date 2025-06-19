import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiLoader } from '@taiga-ui/core';

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
  icon?: string;
}

@Component({
  selector: 'z-activity-feed',
  standalone: true,
  imports: [CommonModule, TuiLoader],
  template: `
    <div
      class="rounded-2xl border border-gray-200/50 bg-white/90 shadow-lg shadow-gray-900/5 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/90 dark:shadow-slate-900/20"
    >
      <div class="border-b border-gray-200 p-6 dark:border-slate-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ title() }}</h3>
      </div>
      <div class="p-6">
        @if (loading()) {
          <div class="flex h-48 items-center justify-center">
            <tui-loader size="m" />
          </div>
        } @else if (activities().length === 0) {
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
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V19.5a2.25 2.25 0 002.25 2.25h.75"
              />
            </svg>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">No recent activities</p>
          </div>
        } @else {
          <div class="space-y-4">
            @for (activity of activities(); track activity.id) {
              <div
                class="group relative overflow-hidden rounded-lg border border-gray-100 bg-gray-50/50 p-4 transition-all duration-200 hover:border-gray-200 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-900/50 dark:hover:border-slate-600 dark:hover:bg-slate-900"
              >
                <div class="flex gap-3">
                  <div
                    class="mt-0.5 rounded-lg p-2"
                    [ngClass]="{
                      'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400': activity.type === 'info',
                      'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400':
                        activity.type === 'success',
                      'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400':
                        activity.type === 'warning',
                      'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400': activity.type === 'error',
                    }"
                  >
                    @if (activity.icon) {
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2">
                        <path [attr.d]="activity.icon" />
                      </svg>
                    } @else {
                      <div class="h-4 w-4 rounded-full bg-current"></div>
                    }
                  </div>
                  <div class="flex-1">
                    <p class="font-medium text-gray-900 dark:text-white">
                      {{ activity.title }}
                    </p>
                    <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      {{ activity.description }}
                    </p>
                    <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      {{ activity.timestamp }}
                    </p>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityFeedComponent {
  activities = input.required<ActivityItem[]>();
  title = input<string>('Recent Activities');
  loading = input<boolean>(false);
}
