import { Component, ChangeDetectionStrategy, input, computed, output, inject } from '@angular/core';

import { TuiIcon, TuiButton } from '@taiga-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { HasRoleDirective } from '@zambia/util-roles-permissions';
import { injectCurrentTheme, WindowService } from '../..';
import { RoleCode } from '@zambia/util-roles-definitions';
import { TuiSkeleton } from '@taiga-ui/kit';

export type PageHeaderColorScheme = 'emerald' | 'purple' | 'blue' | 'red' | 'indigo' | 'amber';
export type ButtonAppearance = 'primary' | 'secondary' | 'outline' | 'flat';

export interface PageHeaderAction {
  id: string;
  labelKey: string;
  icon: string;
  appearance: ButtonAppearance;
  colorScheme?: PageHeaderColorScheme;
  disabled?: boolean;
  roleMin: RoleCode;
}

export interface PageHeaderConfig {
  icon: string;
  titleKey: string;
  descriptionKey: string;
  colorScheme?: PageHeaderColorScheme;
  actions?: PageHeaderAction[];
}

@Component({
  selector: 'z-page-header-with-actions',
  standalone: true,
  imports: [TuiIcon, TuiButton, TranslateModule, HasRoleDirective, TuiSkeleton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      [tuiSkeleton]="loading()"
      class="flex flex-col gap-4 rounded-md sm:flex-row sm:items-center sm:justify-between"
    >
      <!-- Header Info Section -->
      <div class="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        <div [class]="iconContainerClasses()">
          <tui-icon [icon]="config().icon" class="text-3xl text-white"></tui-icon>
        </div>
        <div>
          <h1 class="mb-1 text-2xl font-bold text-gray-800 sm:text-3xl dark:text-white">
            {{ config().titleKey | translate }}
          </h1>
          <p class="text-sm text-gray-600 sm:text-base dark:text-slate-400">
            {{ config().descriptionKey | translate }}
          </p>
        </div>
      </div>

      <!-- Actions Section -->
      <div class="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
        <ng-content select="[slot=actions]" />

        @for (action of config()?.actions; track action.id) {
          <button
            *zHasRoleMin="action.roleMin"
            tuiButton
            [appearance]="action.appearance"
            [size]="buttonSize()"
            [iconStart]="action.icon"
            [attr.tuiTheme]="currentTheme()"
            (click)="onActionClick(action.id)"
            [disabled]="action.disabled || false"
          >
            {{ action.labelKey | translate }}
          </button>
        }
      </div>
    </div>
  `,
  styles: ``,
})
export class PageHeaderWithActionsUiComponent {
  readonly config = input.required<PageHeaderConfig>();
  readonly actionClick = output<string>();
  readonly loading = input<boolean>(true);

  private windowService = inject(WindowService);
  protected currentTheme = injectCurrentTheme();
  protected buttonSize = computed(() => (this.windowService.isMobile() ? 'm' : 'l'));

  protected iconContainerClasses = computed(() => {
    const colorScheme = this.config().colorScheme || 'emerald';

    const colorMap: Record<PageHeaderColorScheme, string> = {
      emerald: 'bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600',
      purple: 'bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600',
      blue: 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600',
      red: 'bg-gradient-to-br from-red-400 via-red-500 to-red-600',
      indigo: 'bg-gradient-to-br from-indigo-400 via-indigo-500 to-indigo-600',
      amber: 'bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600',
    };

    return `mx-auto rounded-2xl ${colorMap[colorScheme]} p-4 shadow-lg sm:mx-0`;
  });

  protected onActionClick(actionId: string): void {
    this.actionClick.emit(actionId);
  }
}
