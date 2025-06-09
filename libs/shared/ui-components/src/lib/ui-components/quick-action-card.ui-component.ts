import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TuiIcon } from '@taiga-ui/core';

export interface QuickActionData {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconBgClass: string;
  route?: string;
  action?: () => void;
  hoverColorClass?: string;
}

@Component({
  selector: 'z-quick-action-card',
  imports: [CommonModule, RouterModule, TuiIcon],
  template: `
    @if (actionData().route) {
      <a
        [routerLink]="actionData().route"
        class="group relative block w-full overflow-hidden rounded-2xl border border-gray-200/50 bg-white/90 p-6 shadow-lg shadow-gray-900/5 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:border-slate-700/50 dark:bg-slate-800/90 dark:shadow-slate-900/20"
        [ngClass]="getHoverBorderAndShadowClass()"
        [attr.aria-label]="'Navigate to ' + actionData().title"
      >
        <ng-container *ngTemplateOutlet="cardContent"></ng-container>
      </a>
    } @else {
      <button
        class="group relative w-full overflow-hidden rounded-2xl border border-gray-200/50 bg-white/90 p-6 text-left shadow-lg shadow-gray-900/5 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:border-slate-700/50 dark:bg-slate-800/90 dark:shadow-slate-900/20"
        [ngClass]="getHoverBorderAndShadowClass()"
        (click)="onActionClick()"
        [attr.aria-label]="actionData().title"
      >
        <ng-container *ngTemplateOutlet="cardContent"></ng-container>
      </button>
    }

    <!-- Shared card content template -->
    <ng-template #cardContent>
      <div class="relative z-10">
        <div class="flex items-start gap-4">
          <!-- Icon -->
          <div class="rounded-xl p-3 shadow-lg" [ngClass]="[actionData().iconBgClass, getIconShadowClass()]">
            <tui-icon
              [icon]="actionData().icon"
              [style.color]="'white'"
              [style.font-size.rem]="1.25"
              [attr.aria-label]="actionData().title + ' icon'"
            />
          </div>

          <!-- Content -->
          <div class="min-w-0 flex-1">
            <h3 class="mb-1 font-semibold text-gray-900 dark:text-white">
              {{ actionData().title }}
            </h3>
            <p class="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              {{ actionData().description }}
            </p>
          </div>

          <!-- Arrow indicator -->
          <div class="flex-shrink-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <svg class="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Hover overlay with color-coordinated gradient -->
      <div
        class="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        [ngClass]="getHoverGradientClass()"
      ></div>
    </ng-template>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickActionCardUiComponent {
  readonly actionData = input.required<QuickActionData>();

  readonly actionClicked = output<QuickActionData>();

  protected onActionClick(): void {
    this.actionClicked.emit(this.actionData());
  }

  protected getHoverBorderAndShadowClass(): string {
    const iconBg = this.actionData().iconBgClass;

    // Extract color from gradient class
    if (iconBg.includes('blue')) {
      return 'hover:border-blue-300/70 hover:shadow-blue-500/20 dark:hover:border-blue-600/70 dark:hover:shadow-blue-400/20';
    } else if (iconBg.includes('purple') || iconBg.includes('pink')) {
      return 'hover:border-purple-300/70 hover:shadow-purple-500/20 dark:hover:border-purple-600/70 dark:hover:shadow-purple-400/20';
    } else if (iconBg.includes('emerald') || iconBg.includes('teal') || iconBg.includes('green')) {
      return 'hover:border-emerald-300/70 hover:shadow-emerald-500/20 dark:hover:border-emerald-600/70 dark:hover:shadow-emerald-400/20';
    } else if (iconBg.includes('orange') || iconBg.includes('amber') || iconBg.includes('yellow')) {
      return 'hover:border-orange-300/70 hover:shadow-orange-500/20 dark:hover:border-orange-600/70 dark:hover:shadow-orange-400/20';
    } else if (iconBg.includes('red')) {
      return 'hover:border-red-300/70 hover:shadow-red-500/20 dark:hover:border-red-600/70 dark:hover:shadow-red-400/20';
    } else if (iconBg.includes('indigo')) {
      return 'hover:border-indigo-300/70 hover:shadow-indigo-500/20 dark:hover:border-indigo-600/70 dark:hover:shadow-indigo-400/20';
    } else if (iconBg.includes('cyan')) {
      return 'hover:border-cyan-300/70 hover:shadow-cyan-500/20 dark:hover:border-cyan-600/70 dark:hover:shadow-cyan-400/20';
    }

    // Default gray
    return 'hover:border-gray-300/70 hover:shadow-gray-900/10 dark:hover:border-slate-600/70 dark:hover:shadow-slate-900/40';
  }

  protected getIconShadowClass(): string {
    const iconBg = this.actionData().iconBgClass;

    if (iconBg.includes('blue')) return 'shadow-blue-500/25';
    else if (iconBg.includes('purple') || iconBg.includes('pink')) return 'shadow-purple-500/25';
    else if (iconBg.includes('emerald') || iconBg.includes('teal') || iconBg.includes('green'))
      return 'shadow-emerald-500/25';
    else if (iconBg.includes('orange') || iconBg.includes('amber') || iconBg.includes('yellow'))
      return 'shadow-orange-500/25';
    else if (iconBg.includes('red')) return 'shadow-red-500/25';
    else if (iconBg.includes('indigo')) return 'shadow-indigo-500/25';
    else if (iconBg.includes('cyan')) return 'shadow-cyan-500/25';

    return 'shadow-gray-900/10 dark:shadow-slate-900/20';
  }

  protected getHoverGradientClass(): string {
    const iconBg = this.actionData().iconBgClass;

    if (iconBg.includes('blue')) {
      return 'bg-gradient-to-br from-blue-500/10 via-transparent to-blue-600/5';
    } else if (iconBg.includes('purple') || iconBg.includes('pink')) {
      return 'bg-gradient-to-br from-purple-500/10 via-transparent to-purple-600/5';
    } else if (iconBg.includes('emerald') || iconBg.includes('teal') || iconBg.includes('green')) {
      return 'bg-gradient-to-br from-emerald-500/10 via-transparent to-emerald-600/5';
    } else if (iconBg.includes('orange') || iconBg.includes('amber') || iconBg.includes('yellow')) {
      return 'bg-gradient-to-br from-orange-500/10 via-transparent to-orange-600/5';
    } else if (iconBg.includes('red')) {
      return 'bg-gradient-to-br from-red-500/10 via-transparent to-red-600/5';
    } else if (iconBg.includes('indigo')) {
      return 'bg-gradient-to-br from-indigo-500/10 via-transparent to-indigo-600/5';
    } else if (iconBg.includes('cyan')) {
      return 'bg-gradient-to-br from-cyan-500/10 via-transparent to-cyan-600/5';
    }

    // Default gray
    return 'bg-gradient-to-br from-white/50 to-transparent dark:from-slate-700/30';
  }
}
