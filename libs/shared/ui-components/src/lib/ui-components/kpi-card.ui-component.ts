import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiIcon } from '@taiga-ui/core';
import { TuiSkeleton } from '@taiga-ui/kit';

export interface KpiData {
  id: string;
  title: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  icon: string;
  iconBgClass: string;
  route: string;
  subtitle?: string;
}

@Component({
  selector: 'z-kpi-card',
  imports: [CommonModule, TuiIcon, TuiSkeleton],
  template: `
    <button
      class="group relative w-full overflow-hidden rounded-2xl border border-gray-200/50 bg-white/90 p-6 text-left shadow-lg shadow-gray-900/5 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-blue-300/70 hover:shadow-xl hover:shadow-blue-500/20 dark:border-slate-700/50 dark:bg-slate-800/90 dark:shadow-slate-900/20 dark:hover:border-blue-600/70 dark:hover:shadow-blue-400/20"
      (click)="onCardClick()"
      [class.animate-pulse]="loading()"
      [attr.aria-label]="'View details for ' + kpiData().title"
    >
      <div class="relative z-10">
        <!-- Icon and Trend -->
        <div class="mb-4 flex items-center justify-between">
          <div class="rounded-xl p-3 shadow-lg" [ngClass]="kpiData().iconBgClass" [tuiSkeleton]="loading()">
            <tui-icon
              [icon]="kpiData().icon"
              [style.color]="'white'"
              [style.font-size.rem]="1.5"
              [attr.aria-label]="kpiData().title + ' icon'"
            />
          </div>
        </div>

        <!-- Title and Value -->
        <div class="space-y-1">
          <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400" [tuiSkeleton]="loading()">
            {{ kpiData().title }}
          </h3>
          <p class="text-2xl font-bold text-gray-900 dark:text-white" [tuiSkeleton]="loading()">
            {{ kpiData().value | number }}
          </p>
          @if (kpiData().subtitle && !loading()) {
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ kpiData().subtitle }}
            </p>
          }
        </div>
      </div>

      <!-- Hover overlay with gradient -->
      <div
        class="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-blue-600/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      ></div>

      <!-- Click indicator -->
      <div class="absolute right-2 bottom-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <svg class="h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          ></path>
        </svg>
      </div>
    </button>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCardUiComponent {
  readonly kpiData = input.required<KpiData>();
  readonly loading = input<boolean>(false);

  readonly cardClicked = output<KpiData>();

  protected onCardClick(): void {
    if (!this.loading()) {
      this.cardClicked.emit(this.kpiData());
    }
  }
}
