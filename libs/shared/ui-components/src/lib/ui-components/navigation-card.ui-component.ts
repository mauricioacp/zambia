import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface NavigationCardData {
  title: string;
  description: string;
  icon: string;
  iconColor: 'blue' | 'purple' | 'emerald' | 'orange' | 'pink' | 'indigo';
  route?: string;
  action?: string;
  ariaLabel?: string;
}

@Component({
  selector: 'z-navigation-card',
  imports: [CommonModule, RouterModule],
  template: `
    @if (data().route) {
      <a
        [routerLink]="data().route"
        class="group relative block overflow-hidden rounded-2xl border border-gray-200/50 bg-white/90 p-6 shadow-lg shadow-gray-900/5 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:border-slate-700/50 dark:bg-slate-800/90 dark:shadow-slate-900/20"
        [ngClass]="getHoverClass()"
        [attr.aria-label]="data().ariaLabel || data().title"
      >
        <ng-container *ngTemplateOutlet="cardContent"></ng-container>
      </a>
    } @else {
      <button
        class="group relative overflow-hidden rounded-2xl border border-gray-200/50 bg-white/90 p-6 text-left shadow-lg shadow-gray-900/5 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:border-slate-700/50 dark:bg-slate-800/90 dark:shadow-slate-900/20"
        [ngClass]="getHoverClass()"
        (click)="handleClick()"
        [attr.aria-label]="data().ariaLabel || data().title"
      >
        <ng-container *ngTemplateOutlet="cardContent"></ng-container>
      </button>
    }

    <!-- Shared card content template -->
    <ng-template #cardContent>
      <div class="relative z-10">
        <div class="mb-4 flex items-center gap-4">
          <div class="rounded-xl p-3 shadow-lg" [ngClass]="getIconClass()">
            <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="getIconPath()"></path>
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ data().title }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ data().description }}
            </p>
          </div>
        </div>
      </div>

      <!-- Hover overlay -->
      <div
        class="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        [ngClass]="getOverlayClass()"
      ></div>
    </ng-template>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationCardUiComponent {
  readonly data = input.required<NavigationCardData>();
  readonly clicked = output<string>();

  protected handleClick(): void {
    const action = this.data().action;
    if (action) {
      this.clicked.emit(action);
    }
  }

  protected getHoverClass(): string {
    const color = this.data().iconColor;
    const hoverClasses: Record<string, string> = {
      blue: 'hover:border-blue-300/70 hover:shadow-blue-500/20 dark:hover:border-blue-600/70 dark:hover:shadow-blue-500/30',
      purple:
        'hover:border-purple-300/70 hover:shadow-purple-500/20 dark:hover:border-purple-600/70 dark:hover:shadow-purple-500/30',
      emerald:
        'hover:border-emerald-300/70 hover:shadow-emerald-500/20 dark:hover:border-emerald-600/70 dark:hover:shadow-emerald-500/30',
      orange:
        'hover:border-orange-300/70 hover:shadow-orange-500/20 dark:hover:border-orange-600/70 dark:hover:shadow-orange-500/30',
      pink: 'hover:border-pink-300/70 hover:shadow-pink-500/20 dark:hover:border-pink-600/70 dark:hover:shadow-pink-500/30',
      indigo:
        'hover:border-indigo-300/70 hover:shadow-indigo-500/20 dark:hover:border-indigo-600/70 dark:hover:shadow-indigo-500/30',
    };
    return hoverClasses[color] || hoverClasses['blue'];
  }

  protected getIconClass(): string {
    const color = this.data().iconColor;
    const iconClasses: Record<string, string> = {
      blue: 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 shadow-blue-500/25',
      purple: 'bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 shadow-purple-500/25',
      emerald: 'bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 shadow-emerald-500/25',
      orange: 'bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 shadow-orange-500/25',
      pink: 'bg-gradient-to-br from-pink-500 via-pink-600 to-pink-700 shadow-pink-500/25',
      indigo: 'bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-700 shadow-indigo-500/25',
    };
    return iconClasses[color] || iconClasses['blue'];
  }

  protected getOverlayClass(): string {
    const color = this.data().iconColor;
    const overlayClasses: Record<string, string> = {
      blue: 'bg-gradient-to-br from-blue-500/10 to-transparent',
      purple: 'bg-gradient-to-br from-purple-500/10 to-transparent',
      emerald: 'bg-gradient-to-br from-emerald-500/10 to-transparent',
      orange: 'bg-gradient-to-br from-orange-500/10 to-transparent',
      pink: 'bg-gradient-to-br from-pink-500/10 to-transparent',
      indigo: 'bg-gradient-to-br from-indigo-500/10 to-transparent',
    };
    return overlayClasses[color] || overlayClasses['blue'];
  }

  protected getIconPath(): string {
    const iconPaths: Record<string, string> = {
      home: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      'chart-bar':
        'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      'file-text':
        'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      users:
        'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
      building:
        'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    };
    return iconPaths[this.data().icon] || iconPaths['home'];
  }
}
