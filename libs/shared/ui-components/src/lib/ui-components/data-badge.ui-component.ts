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
  template: ` <div class="rounded-lg bg-white p-4 shadow-md dark:bg-gray-800 dark:shadow-gray-900/30">
    <div class="flex items-center">
      <div
        [tuiSkeleton]="loading()"
        class="mr-4 flex h-12 w-12 items-center justify-center rounded-full"
        [ngClass]="stat()?.color"
      >
        <tui-icon
          [attr.aria-label]="stat().label"
          [icon]="stat().icon"
          [style.background]="stat().color"
          [style.color]="'white'"
          [style.font-size.rem]="2"
        />
      </div>

      <div>
        <p class="text-sm text-gray-500 dark:text-gray-400" [tuiSkeleton]="loading()">{{ stat().label }}</p>
        <p class="text-2xl font-bold text-gray-800 dark:text-white" [tuiSkeleton]="loading()">
          {{ stat().value }}
        </p>
        <!-- Active & Inactive indicators -->
        @let details = stat().details!;

        @if (details && !loading) {
          <div class="mt-1 flex items-center space-x-4">
            @if (details.active !== undefined) {
              <div class="flex items-center">
                <div class="mr-1 h-2 w-2 rounded-full bg-green-500"></div>
                <span class="text-xs text-gray-600 dark:text-gray-300">{{ details.active }}</span>
              </div>
            }

            @if (details.inactive !== undefined) {
              <div class="flex items-center">
                <div class="mr-1 h-2 w-2 rounded-full bg-red-500"></div>
                <span class="text-xs text-gray-600 dark:text-gray-300">{{ details.inactive }}</span>
              </div>
            }

            @if (details.standby !== undefined) {
              <div class="flex items-center">
                <div class="mr-1 h-2 w-2 rounded-full bg-amber-500"></div>
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
}
