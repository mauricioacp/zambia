import { Component, ChangeDetectionStrategy, input } from '@angular/core';

import { TuiBadgeNotification } from '@taiga-ui/kit';

@Component({
  selector: 'z-notification-badge',
  standalone: true,
  imports: [TuiBadgeNotification],
  template: `
    @if (count() > 0) {
      <tui-badge-notification [size]="size()" class="notification-badge">
        {{ displayValue() }}
      </tui-badge-notification>
    }
  `,
  styles: [
    `
      :host {
        display: block;
        position: absolute;
        right: -4px;
        top: -4px;
        pointer-events: none;
      }

      .notification-badge {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }

      @keyframes pulse {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0.8;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationBadgeUiComponent {
  count = input.required<number>();
  maxDisplay = input<number>(99);
  status = input<'primary' | 'error' | 'success' | 'warning'>('error');
  size = input<'xs' | 's' | 'm' | 'l'>('xs');

  displayValue(): string {
    const count = this.count();
    const max = this.maxDisplay();
    return count > max ? `${max}+` : count.toString();
  }
}
