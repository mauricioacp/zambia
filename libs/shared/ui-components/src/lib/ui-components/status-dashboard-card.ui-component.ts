import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface StatusMetric {
  label: string;
  value: string | number;
  colorClass?: string;
}

export interface StatusDashboardCardData {
  id: string;
  title: string;
  metrics: StatusMetric[];
  iconPath: string;
  iconBgClass: string;
  route?: string;
}

@Component({
  selector: 'z-status-dashboard-card',
  imports: [CommonModule],
  template: `
    <button
      class="group relative w-full overflow-hidden rounded-2xl border border-gray-200/50 bg-white/90 p-6 text-left shadow-lg shadow-gray-900/5 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:border-slate-700/50 dark:bg-slate-800/90 dark:shadow-slate-900/20"
      [ngClass]="getHoverClass()"
      (click)="handleClick()"
      [attr.aria-label]="'Navigate to ' + data().title"
    >
      <div class="relative z-10">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ data().title }}</h3>
          <div class="rounded-lg bg-gradient-to-r p-2" [ngClass]="data().iconBgClass">
            <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="data().iconPath"></path>
            </svg>
          </div>
        </div>

        <div class="space-y-3">
          @for (metric of data().metrics; track metric.label) {
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ metric.label }}</span>
              <span class="font-semibold" [ngClass]="metric.colorClass || 'text-gray-900 dark:text-white'">
                {{ metric.value }}
              </span>
            </div>
          }
        </div>
      </div>

      <!-- Hover overlay -->
      <div
        class="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        [ngClass]="getGradientClass()"
      ></div>
    </button>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusDashboardCardUiComponent {
  readonly data = input.required<StatusDashboardCardData>();
  readonly clicked = output<StatusDashboardCardData>();

  protected handleClick(): void {
    this.clicked.emit(this.data());
  }

  protected getHoverClass(): string {
    const iconBg = this.data().iconBgClass;

    if (iconBg.includes('emerald') || iconBg.includes('teal')) {
      return 'hover:border-emerald-300/70 hover:shadow-emerald-500/20 dark:hover:border-emerald-600/70 dark:hover:shadow-emerald-400/20';
    } else if (iconBg.includes('purple') || iconBg.includes('indigo')) {
      return 'hover:border-purple-300/70 hover:shadow-purple-500/20 dark:hover:border-purple-600/70 dark:hover:shadow-purple-400/20';
    } else if (iconBg.includes('blue') || iconBg.includes('cyan')) {
      return 'hover:border-blue-300/70 hover:shadow-blue-500/20 dark:hover:border-blue-600/70 dark:hover:shadow-blue-400/20';
    }

    return 'hover:border-gray-300/70 hover:shadow-gray-900/10 dark:hover:border-slate-600/70 dark:hover:shadow-slate-900/40';
  }

  protected getGradientClass(): string {
    const iconBg = this.data().iconBgClass;

    if (iconBg.includes('emerald') || iconBg.includes('teal')) {
      return 'bg-gradient-to-br from-emerald-500/10 via-transparent to-emerald-600/5';
    } else if (iconBg.includes('purple') || iconBg.includes('indigo')) {
      return 'bg-gradient-to-br from-purple-500/10 via-transparent to-purple-600/5';
    } else if (iconBg.includes('blue') || iconBg.includes('cyan')) {
      return 'bg-gradient-to-br from-blue-500/10 via-transparent to-blue-600/5';
    }

    return 'bg-gradient-to-br from-white/50 to-transparent dark:from-slate-700/30';
  }
}
