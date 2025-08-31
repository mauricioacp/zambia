import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { TuiIcon } from '@taiga-ui/core';

export interface StatCard {
  id: string;
  title: string;
  value: number;
  icon: string;
  color: 'blue' | 'emerald' | 'yellow' | 'red' | 'purple' | 'indigo' | 'pink';
  gradient: string;
}

@Component({
  selector: 'z-data-card',
  standalone: true,
  imports: [TranslatePipe, TuiIcon],
  template: `
    <div [class]="cardClasses()">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600 dark:text-gray-300">{{ stat().title | translate }}</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stat().value }}</p>
        </div>
        <div class="rounded-lg p-3" [class]="stat().gradient">
          <tui-icon [icon]="stat().icon" class="text-white" size="s"></tui-icon>
        </div>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataCardUiComponent {
  stat = input.required<StatCard>();
  customClasses = input<string>('');

  private readonly baseClasses =
    'group relative block overflow-hidden rounded-2xl border bg-white/90 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:bg-slate-900';

  private readonly colorVariants = {
    blue: 'border-gray-200/50 shadow-gray-900/5 hover:border-blue-300/70 hover:shadow-blue-500/20 dark:border-slate-700/50 dark:shadow-slate-900/20 dark:hover:border-blue-600/70 dark:hover:shadow-blue-500/30',
    emerald:
      'border-gray-200/50 shadow-gray-900/5 hover:border-emerald-300/70 hover:shadow-emerald-500/20 dark:border-slate-700/50 dark:shadow-slate-900/20 dark:hover:border-emerald-600/70 dark:hover:shadow-emerald-500/30',
    yellow:
      'border-gray-200/50 shadow-gray-900/5 hover:border-yellow-300/70 hover:shadow-yellow-500/20 dark:border-slate-700/50 dark:shadow-slate-900/20 dark:hover:border-yellow-600/70 dark:hover:shadow-yellow-500/30',
    red: 'border-gray-200/50 shadow-gray-900/5 hover:border-red-300/70 hover:shadow-red-500/20 dark:border-slate-700/50 dark:shadow-slate-900/20 dark:hover:border-red-600/70 dark:hover:shadow-red-500/30',
    purple:
      'border-gray-200/50 shadow-gray-900/5 hover:border-purple-300/70 hover:shadow-purple-500/20 dark:border-slate-700/50 dark:shadow-slate-900/20 dark:hover:border-purple-600/70 dark:hover:shadow-purple-500/30',
    indigo:
      'border-gray-200/50 shadow-gray-900/5 hover:border-indigo-300/70 hover:shadow-indigo-500/20 dark:border-slate-700/50 dark:shadow-slate-900/20 dark:hover:border-indigo-600/70 dark:hover:shadow-indigo-500/30',
    pink: 'border-gray-200/50 shadow-gray-900/5 hover:border-pink-300/70 hover:shadow-pink-500/20 dark:border-slate-700/50 dark:shadow-slate-900/20 dark:hover:border-pink-600/70 dark:hover:shadow-pink-500/30',
  };

  protected cardClasses = computed(() => {
    const colorClasses = this.colorVariants[this.stat().color];
    return `${this.baseClasses} ${colorClasses} ${this.customClasses()}`.trim();
  });
}
