import { Component, input, ChangeDetectionStrategy } from '@angular/core';

import { TuiLoader } from '@taiga-ui/core';
import { HeadquarterMetrics } from '../../../services/home-facade.service';

@Component({
  selector: 'z-headquarter-metrics-widget',
  standalone: true,
  imports: [TuiLoader],
  template: `
    <div
      class="rounded-2xl border border-gray-200/50 bg-white/90 shadow-lg shadow-gray-900/5 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/90 dark:shadow-slate-900/20"
    >
      <div class="border-b border-gray-200 p-6 dark:border-slate-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ title() }}
        </h3>
      </div>
      <div class="p-6">
        @if (loading()) {
          <div class="flex h-48 items-center justify-center">
            <tui-loader size="m" />
          </div>
        } @else if (metrics()) {
          <div class="grid grid-cols-2 gap-6">
            <!-- Active Agreements -->
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Active Agreements</p>
              <p class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                {{ metrics()!.active_agreements_count }}
              </p>
            </div>

            <!-- Staff Count -->
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Staff</p>
              <p class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                {{ metrics()!.facilitators_count + metrics()!.companions_count }}
              </p>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {{ metrics()!.facilitators_count }} facilitators, {{ metrics()!.companions_count }} companions
              </p>
            </div>

            <!-- Student Distribution -->
            <div class="col-span-2">
              <p class="mb-3 text-sm font-medium text-gray-600 dark:text-gray-400">Student Distribution</p>
              <div class="space-y-3">
                <div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-300">Active</span>
                    <span class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ metrics()!.students.active }}
                    </span>
                  </div>
                  <div class="mt-1 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div class="h-full bg-emerald-500" [style.width.%]="getStudentPercentage('active')"></div>
                  </div>
                </div>
                <div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-300">Inactive</span>
                    <span class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ metrics()!.students.inactive }}
                    </span>
                  </div>
                  <div class="mt-1 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div class="h-full bg-amber-500" [style.width.%]="getStudentPercentage('inactive')"></div>
                  </div>
                </div>
                <div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-300">Prospects</span>
                    <span class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ metrics()!.students.prospects }}
                    </span>
                  </div>
                  <div class="mt-1 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div class="h-full bg-sky-500" [style.width.%]="getStudentPercentage('prospects')"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        } @else {
          <div class="py-12 text-center">
            <p class="text-sm text-gray-500 dark:text-gray-400">No data available</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeadquarterMetricsWidgetComponent {
  metrics = input<HeadquarterMetrics | null>();
  title = input<string>('Headquarter Metrics');
  loading = input<boolean>(false);

  getStudentPercentage(type: 'active' | 'inactive' | 'prospects'): number {
    const metrics = this.metrics();
    if (!metrics) return 0;

    const total = metrics.students.active + metrics.students.inactive + metrics.students.prospects;
    if (total === 0) return 0;

    return (metrics.students[type] / total) * 100;
  }
}
