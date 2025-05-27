import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiIcon } from '@taiga-ui/core';

export interface QuickActionData {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconBgClass: string;
  route?: string;
  action?: () => void;
}

@Component({
  selector: 'z-quick-action-card',
  imports: [CommonModule, TuiIcon],
  template: `
    <button
      class="group relative w-full overflow-hidden rounded-2xl border border-gray-200/50 bg-white/90 p-6 text-left shadow-lg shadow-gray-900/5 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-gray-300/70 hover:shadow-xl hover:shadow-gray-900/10 dark:border-slate-700/50 dark:bg-slate-800/90 dark:shadow-slate-900/20 dark:hover:border-slate-600/70 dark:hover:shadow-slate-900/40"
      (click)="onActionClick()"
    >
      <div class="relative z-10">
        <div class="flex items-start gap-4">
          <!-- Icon -->
          <div
            class="rounded-xl p-3 shadow-lg shadow-gray-900/10 dark:shadow-slate-900/20"
            [ngClass]="actionData().iconBgClass"
          >
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

      <!-- Hover overlay with subtle gradient -->
      <div
        class="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-slate-700/30"
      ></div>
    </button>
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
}
