import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface WelcomeHeaderData {
  title: string;
  subtitle: string;
  statusText?: string;
  showStatus?: boolean;
}

@Component({
  selector: 'z-welcome-header',
  imports: [CommonModule],
  template: `
    <div class="relative overflow-hidden">
      <!-- Background Glow -->
      <div
        class="absolute inset-0 -inset-x-6 rounded-3xl bg-gradient-to-r from-blue-300 via-teal-500 to-blue-700 opacity-10 blur-2xl"
      ></div>

      <!-- Glass Header Container -->
      <div
        class="relative rounded-2xl bg-white/40 p-2.5 ring-1 ring-gray-200/50 backdrop-blur-sm dark:bg-gray-500/20 dark:ring-gray-700/60"
      >
        <div
          class="rounded-xl bg-white/95 p-6 shadow-xl shadow-gray-900/5 dark:bg-gray-950/95 dark:shadow-slate-900/20"
        >
          <div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 class="mb-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
                {{ data().title }}
              </h1>
              <p class="text-lg text-gray-600 dark:text-gray-300">
                {{ data().subtitle }}
              </p>
            </div>

            <!-- Status Indicator -->
            @if (data().showStatus) {
              <div class="flex items-center gap-3">
                <div class="rounded-full bg-emerald-100 p-2 dark:bg-emerald-900/30">
                  <div class="h-2 w-2 rounded-full bg-emerald-500"></div>
                </div>
                <span class="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {{ data().statusText || 'System Active' }}
                </span>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeHeaderUiComponent {
  readonly data = input.required<WelcomeHeaderData>();
}
