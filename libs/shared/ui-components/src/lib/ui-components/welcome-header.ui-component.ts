import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface WelcomeHeaderData {
  title: string;
  subtitle?: string;
  beforeTitleText?: string;
  statusText?: string;
  showStatus?: boolean;
}

@Component({
  selector: 'z-welcome-header',
  imports: [],
  template: `
    <div class="glow relative overflow-hidden rounded-3xl">
      <!-- Background Glow -->
      <div
        class="bg-glow absolute inset-0 -inset-x-6 rounded-3xl bg-gradient-to-r from-blue-300 via-teal-500 to-blue-700 opacity-15 blur-3xl"
      ></div>

      <!-- Glass Header Container -->
      <div
        class="relative rounded-2xl bg-white/50 p-3 ring-1 ring-gray-200/60 backdrop-blur-md dark:bg-gray-900/30 dark:ring-gray-700/60"
      >
        <div
          class="rounded-xl border border-white/60 bg-white/95 p-6 shadow-xl ring-1 shadow-gray-900/5 ring-black/5 dark:border-white/10 dark:bg-gray-950/90 dark:shadow-slate-900/20 dark:ring-white/5"
        >
          <div class="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              @if (data().beforeTitleText) {
                <span class="mb-1 block text-base font-semibold text-gray-700/80 sm:text-sm dark:text-gray-300/90">
                  {{ data()?.beforeTitleText }}
                </span>
              }
              <h1
                class="mb-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl md:text-5xl dark:text-white"
              >
                {{ data().title }}
              </h1>
              @if (data().subtitle) {
                <p class="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                  {{ data().subtitle }}
                </p>
              }
            </div>

            <!-- Status Indicator -->
            @if (data().showStatus) {
              <div class="flex items-center gap-3">
                <div class="rounded-full bg-emerald-100 p-2 dark:bg-emerald-900/30">
                  <div class="status-dot h-2 w-2 rounded-full bg-emerald-500"></div>
                </div>
                <span class="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {{ data().statusText ?? '' }}
                </span>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;

      isolation: isolate;
    }

    .glow .bg-glow {
      animation: float-gradient 18s ease-in-out infinite;
      will-change: transform, opacity, filter;
    }

    @keyframes float-gradient {
      0% {
        transform: translate3d(-2%, -2%, 0) scale(1);
        opacity: 0.12;
        filter: blur(36px);
      }
      25% {
        transform: translate3d(1%, -1%, 0) scale(1.05);
        opacity: 0.16;
        filter: blur(42px);
      }
      50% {
        transform: translate3d(2%, 1%, 0) scale(1.02);
        opacity: 0.14;
        filter: blur(38px);
      }
      75% {
        transform: translate3d(-1%, 2%, 0) scale(1.06);
        opacity: 0.17;
        filter: blur(44px);
      }
      100% {
        transform: translate3d(-2%, -2%, 0) scale(1);
        opacity: 0.12;
        filter: blur(36px);
      }
    }

    .status-dot {
      position: relative;
      box-shadow: 0 0 0 1px rgba(16, 185, 129, 0.25);
    }
    .status-dot::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 9999px;
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.35);
      animation: pulse-ring 2.4s ease-out infinite;
    }

    @keyframes pulse-ring {
      0% {
        transform: scale(1);
        opacity: 0.6;
        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.35);
      }
      70% {
        transform: scale(2.6);
        opacity: 0;
        box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
      }
      100% {
        transform: scale(2.6);
        opacity: 0;
        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .glow .bg-glow {
        animation: none !important;
      }
      .status-dot::after {
        animation: none !important;
        opacity: 0.35;
        transform: none;
      }
    }
  `,

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeHeaderUiComponent {
  readonly data = input.required<WelcomeHeaderData>();
}
