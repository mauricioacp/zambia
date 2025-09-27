import { Component, input, ChangeDetectionStrategy } from '@angular/core';

import { TuiLoader, TuiIcon } from '@taiga-ui/core';

export interface KpiCardData {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon?: string;
  loading?: boolean;
}

@Component({
  selector: 'z-kpi-card',
  standalone: true,
  imports: [TuiLoader, TuiIcon],
  template: `
    <div
      class="group relative overflow-hidden rounded-2xl border border-gray-200/50 bg-white/90 p-6 shadow-lg shadow-gray-900/5 backdrop-blur-sm transition-all duration-300 hover:border-gray-300/70 hover:shadow-xl hover:shadow-gray-900/10 dark:border-slate-700/50 dark:bg-slate-800/90 dark:shadow-slate-900/20 dark:hover:border-slate-600/70 dark:hover:shadow-slate-900/40"
    >
      @if (data().loading) {
        <div class="flex h-32 items-center justify-center">
          <tui-loader size="m" />
        </div>
      } @else {
        <div class="relative z-10">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                {{ data().title }}
              </p>
              <p class="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {{ data().value }}
              </p>
            </div>
            @if (data().icon) {
              <div
                class="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-sky-500 to-sky-600 p-3 shadow-lg shadow-sky-500/20"
              >
                <tui-icon [icon]="'lucide:' + data().icon" class="h-6 w-6 text-white"></tui-icon>
              </div>
            }
          </div>
          @if (data().change !== undefined) {
            <div class="mt-4 flex items-center gap-2">
              @if (data().changeType === 'increase') {
                <tui-icon icon="lucide:trending-up" class="h-4 w-4 text-emerald-500"></tui-icon>
                <span class="text-sm font-medium text-emerald-500"> +{{ data().change }}% </span>
              } @else if (data().changeType === 'decrease') {
                <tui-icon icon="lucide:trending-down" class="h-4 w-4 text-red-500"></tui-icon>
                <span class="text-sm font-medium text-red-500"> {{ data().change }}% </span>
              } @else {
                <span class="text-sm font-medium text-gray-500">
                  {{ data().change! > 0 ? '+' : '' }}{{ data().change }}%
                </span>
              }
              <span class="text-sm text-gray-500 dark:text-gray-400">vs last month</span>
            </div>
          }
        </div>
        <div
          class="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-slate-700/30"
        ></div>
      }
    </div>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCardComponent {
  data = input.required<KpiCardData>();
}
