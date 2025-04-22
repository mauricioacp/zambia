import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'z-notifications-button',
  standalone: true,
  imports: [CommonModule, MatIcon],
  template: `
    <a
      href="javascript:void(0)"
      class="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm leading-5 font-semibold text-gray-800 hover:border-gray-300 hover:text-gray-900 hover:shadow-xs focus:ring-3 focus:ring-gray-300/25 active:border-gray-200 active:shadow-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-200 dark:focus:ring-gray-600/40 dark:active:border-gray-700"
    >
      <mat-icon>notifications</mat-icon>
    </a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsButtonComponent {}
