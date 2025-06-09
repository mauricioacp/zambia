import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiButton, TuiDataList, TuiIcon, TuiHint } from '@taiga-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import type { Notification } from '@zambia/shared/data-access-notifications';

@Component({
  selector: 'z-notification-item',
  standalone: true,
  imports: [CommonModule, TuiButton, TuiDataList, TuiIcon, TuiHint, TranslateModule],
  template: `
    <button tuiOption class="notification-item group relative" [class.unread]="!isRead()" (click)="handleClick()">
      <div class="flex w-full gap-3 p-3 pr-10">
        <!-- Icon -->
        <div class="flex-shrink-0">
          <div
            class="notification-icon-wrapper flex h-10 w-10 items-center justify-center rounded-lg"
            [style.background-color]="iconConfig().bgColor"
          >
            <tui-icon [icon]="iconConfig().icon" class="text-white" />
          </div>
        </div>

        <!-- Content -->
        <div class="min-w-0 flex-1 text-left">
          <div class="flex items-start justify-between">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white" [class.font-semibold]="!isRead()">
              {{ notification().title }}
            </h4>
            <span class="ml-2 flex-shrink-0 text-xs text-gray-500 dark:text-gray-400">
              {{ getRelativeTime() }}
            </span>
          </div>

          <p class="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
            {{ notification().body }}
          </p>

          @if (notification().sender?.full_name) {
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {{ 'NOTIFICATIONS.FROM' | translate }}: {{ notification().sender!.full_name }}
            </p>
          }
        </div>

        <!-- Actions (visible on hover) -->
        <div
          class="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100"
        >
          @if (!isRead()) {
            <button
              tuiIconButton
              type="button"
              size="xs"
              appearance="flat"
              icon="@tui.check"
              [tuiHint]="'NOTIFICATIONS.MARK_AS_READ' | translate"
              (click)="markAsReadClicked($event)"
              aria-label="Mark as read"
            >
              <span class="sr-only">Mark as read</span>
            </button>
          }
          <button
            tuiIconButton
            type="button"
            size="xs"
            appearance="flat"
            icon="@tui.archive"
            [tuiHint]="'NOTIFICATIONS.ARCHIVE' | translate"
            (click)="archiveClicked($event)"
            aria-label="Archive notification"
          >
            <span class="sr-only">Archive</span>
          </button>
        </div>

        <!-- Unread indicator -->
        @if (!isRead()) {
          <div class="absolute top-0 left-0 h-full w-1 bg-sky-500"></div>
        }
      </div>
    </button>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .notification-item {
        cursor: pointer;
        transition: all 0.2s ease;
        position: relative;
        overflow: hidden;
        width: 100%;
        text-align: left;
      }

      .notification-item:hover {
        background-color: rgba(0, 0, 0, 0.02);
      }

      :host-context(.dark) .notification-item:hover {
        background-color: rgba(255, 255, 255, 0.02);
      }

      .notification-item.unread {
        background-color: rgba(14, 165, 233, 0.05);
      }

      :host-context(.dark) .notification-item.unread {
        background-color: rgba(14, 165, 233, 0.1);
      }

      .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .notification-icon {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .notification-icon tui-icon {
        color: white;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationItemUiComponent {
  notification = input.required<Notification>();
  isRead = input.required<boolean>();

  markAsRead = output<void>();
  archive = output<void>();
  clicked = output<Notification>();

  iconConfig = computed(() => {
    const type = this.notification().type;
    const priority = this.notification().priority;

    let icon = '@tui.bell';
    let color = '#6B7280'; // gray-500
    let bgColor = '#E5E7EB'; // gray-200

    // Icon by type
    switch (type) {
      case 'system':
        icon = '@tui.settings-2';
        break;
      case 'direct_message':
        icon = '@tui.message-circle';
        break;
      case 'action_required':
        icon = '@tui.alert-circle';
        break;
      case 'reminder':
        icon = '@tui.clock';
        break;
      case 'alert':
        icon = '@tui.alert-triangle';
        break;
      case 'achievement':
        icon = '@tui.award';
        break;
      case 'role_based':
        icon = '@tui.users';
        break;
    }

    // Color by priority
    switch (priority) {
      case 'urgent':
        color = '#FFFFFF';
        bgColor = '#EF4444'; // red-500
        break;
      case 'high':
        color = '#FFFFFF';
        bgColor = '#F97316'; // orange-500
        break;
      case 'medium':
        color = '#FFFFFF';
        bgColor = '#3B82F6'; // blue-500
        break;
      case 'low':
        color = '#FFFFFF';
        bgColor = '#6B7280'; // gray-500
        break;
    }

    return { icon, color, bgColor };
  });

  getRelativeTime(): string {
    const date = new Date(this.notification().created_at);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  handleClick(): void {
    if (!this.isRead()) {
      this.markAsRead.emit();
    }

    // If notification has an action URL, we could navigate to it
    if (this.notification().action_url) {
      // Future: navigate to action URL
    }

    this.clicked.emit(this.notification());
  }

  markAsReadClicked(event: Event): void {
    event.stopPropagation();
    this.markAsRead.emit();
  }

  archiveClicked(event: Event): void {
    event.stopPropagation();
    this.archive.emit();
  }
}
