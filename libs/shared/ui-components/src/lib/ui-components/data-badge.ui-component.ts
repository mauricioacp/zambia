import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiIcon } from '@taiga-ui/core';
import { TuiSkeleton } from '@taiga-ui/kit';
import { StatBadge } from '@zambia/data-access-dashboard';

export interface GlobalData {
  label: string;
  value: number;
  icon: string;
  color: string;
}

@Component({
  selector: 'z-data-badge',
  imports: [CommonModule, TuiIcon, TuiSkeleton],
  template: ` <div
    class="group relative overflow-hidden rounded-xl border border-gray-200/50 bg-white/90 p-4 shadow-lg shadow-gray-900/5 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-gray-300/70 hover:shadow-xl hover:shadow-gray-900/10 dark:border-slate-700/50 dark:bg-slate-800/90 dark:shadow-slate-900/20 dark:hover:border-slate-600/70 dark:hover:shadow-slate-900/40"
  >
    <!-- Gradient overlay on hover -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-slate-700/30"
    ></div>

    <div class="relative z-10 flex items-center">
      <div
        [tuiSkeleton]="loading()"
        class="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br shadow-lg transition-transform duration-300 group-hover:scale-110"
        [ngClass]="getGradientClass()"
      >
        <tui-icon
          [attr.aria-label]="stat().label"
          [icon]="stat().icon"
          [style.color]="'white'"
          [style.font-size.rem]="1.5"
        />
      </div>

      <div class="flex-1">
        <p class="text-sm text-gray-600 dark:text-gray-400" [tuiSkeleton]="loading()">{{ stat().label }}</p>
        <p class="text-2xl font-bold text-gray-900 dark:text-white" [tuiSkeleton]="loading()">
          {{ stat().value }}
        </p>
        <!-- Active & Inactive indicators -->
        @let details = stat().details!;

        @if (details && !loading) {
          <div class="mt-1 flex items-center space-x-4">
            @if (details.active !== undefined) {
              <div class="flex items-center">
                <div class="mr-1 h-2 w-2 rounded-full bg-green-500 shadow-sm shadow-green-500/50"></div>
                <span class="text-xs text-gray-600 dark:text-gray-300">{{ details.active }}</span>
              </div>
            }

            @if (details.inactive !== undefined) {
              <div class="flex items-center">
                <div class="mr-1 h-2 w-2 rounded-full bg-red-500 shadow-sm shadow-red-500/50"></div>
                <span class="text-xs text-gray-600 dark:text-gray-300">{{ details.inactive }}</span>
              </div>
            }

            @if (details.standby !== undefined) {
              <div class="flex items-center">
                <div class="mr-1 h-2 w-2 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50"></div>
                <span class="text-xs text-gray-600 dark:text-gray-300">{{ details.standby }}</span>
              </div>
            }
          </div>
        }
      </div>
    </div>
  </div>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataBadgeUiComponent {
  readonly loading = input<boolean>(false);
  stat = input.required<StatBadge>();

  protected getGradientClass(): string {
    // Map colors to gradient classes
    const color = this.stat()?.color || '';

    if (color.includes('blue') || color.includes('sky')) {
      return 'from-blue-500 to-blue-600';
    } else if (color.includes('green') || color.includes('emerald')) {
      return 'from-emerald-500 to-emerald-600';
    } else if (color.includes('red') || color.includes('rose')) {
      return 'from-red-500 to-red-600';
    } else if (color.includes('yellow') || color.includes('amber')) {
      return 'from-amber-500 to-amber-600';
    } else if (color.includes('purple') || color.includes('violet')) {
      return 'from-purple-500 to-purple-600';
    } else if (color.includes('pink')) {
      return 'from-pink-500 to-pink-600';
    } else if (color.includes('indigo')) {
      return 'from-indigo-500 to-indigo-600';
    } else {
      return 'from-gray-500 to-gray-600';
    }
  }
}
