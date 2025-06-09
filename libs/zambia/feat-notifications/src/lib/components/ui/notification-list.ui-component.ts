import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiDataList } from '@taiga-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationItemUiComponent } from './notification-item.ui-component';
import type { Notification } from '@zambia/shared/data-access-notifications';

@Component({
  selector: 'z-notification-list',
  standalone: true,
  imports: [CommonModule, TuiDataList, TranslateModule, NotificationItemUiComponent],
  template: `
    <div class="notification-list">
      @for (section of sections; track section.key) {
        @if (section.notifications.length > 0) {
          <div class="mb-2">
            <div class="px-4 py-2 text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
              {{ section.label | translate }}
            </div>
            <tui-data-list>
              @for (notification of section.notifications; track notification.id) {
                <z-notification-item
                  [notification]="notification"
                  [isRead]="notification.is_read"
                  (markAsRead)="handleMarkAsRead(notification.id)"
                  (archive)="handleArchive(notification.id)"
                ></z-notification-item>
              }
            </tui-data-list>
          </div>
        }
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .notification-list {
        padding: 0.5rem 0;
      }

      tui-group:last-child {
        margin-bottom: 0;
      }

      /* Remove default TUI data list padding */
      :host ::ng-deep tui-data-list {
        padding: 0;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationListUiComponent {
  notifications = input.required<Notification[]>();
  groupedNotifications = input.required<Record<string, Notification[]>>();

  markAsRead = output<string[]>();
  archive = output<string>();

  get sections() {
    const groups = this.groupedNotifications();
    return [
      { key: 'today', label: 'NOTIFICATIONS.TODAY', notifications: groups['today'] || [] },
      { key: 'yesterday', label: 'NOTIFICATIONS.YESTERDAY', notifications: groups['yesterday'] || [] },
      { key: 'thisWeek', label: 'NOTIFICATIONS.THIS_WEEK', notifications: groups['thisWeek'] || [] },
      { key: 'older', label: 'NOTIFICATIONS.OLDER', notifications: groups['older'] || [] },
    ];
  }

  handleMarkAsRead(notificationId: string): void {
    this.markAsRead.emit([notificationId]);
  }

  handleArchive(notificationId: string): void {
    this.archive.emit(notificationId);
  }
}
