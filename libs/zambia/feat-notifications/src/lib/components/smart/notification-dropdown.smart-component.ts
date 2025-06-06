import { Component, ChangeDetectionStrategy, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiDropdown, TuiButton, TuiDataList, TuiLink, TuiScrollbar, TuiHint, TuiIcon } from '@taiga-ui/core';
import { TuiBadgeNotification } from '@taiga-ui/kit';
import { NotificationFacadeService, NotificationRealtimeService } from '@zambia/shared/data-access-notifications';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationListUiComponent } from '../ui/notification-list.ui-component';

@Component({
  selector: 'z-notification-dropdown',
  standalone: true,
  imports: [
    CommonModule,
    TuiDropdown,
    TuiButton,
    TuiDataList,
    TuiLink,
    TuiScrollbar,
    TuiBadgeNotification,
    TuiHint,
    TuiIcon,
    TranslateModule,
    NotificationListUiComponent,
  ],
  template: `
    <div class="relative">
      <button
        tuiButton
        [appearance]="'flat'"
        size="m"
        [tuiDropdownOpen]="isOpen()"
        (tuiDropdownOpenChange)="isOpen.set($event)"
        [tuiDropdown]="dropdown"
        [tuiHint]="'NOTIFICATIONS.TOOLTIP' | translate"
        tuiHintDirection="bottom"
        class="relative"
      >
        <tui-icon icon="@tui.bell" [style.height.rem]="1" />
        @if (unreadCount() > 0) {
          <tui-badge-notification size="xs" class="absolute -top-1 -right-1">
            {{ unreadCount() > 99 ? '99+' : unreadCount() }}
          </tui-badge-notification>
        }
      </button>

      <ng-template #dropdown>
        <tui-data-list
          class="notification-dropdown rounded-2xl border border-gray-200/50 bg-white/90 shadow-2xl shadow-gray-900/10 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/90 dark:shadow-slate-900/40"
          style="width: 380px; max-height: 70vh;"
        >
          <!-- Header -->
          <div class="flex items-center justify-between border-b border-gray-200 p-4 dark:border-slate-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ 'NOTIFICATIONS.TITLE' | translate }}
            </h3>
            @if (unreadCount() > 0) {
              <button
                tuiLink
                size="s"
                (click)="markAllAsRead()"
                class="text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
              >
                {{ 'NOTIFICATIONS.MARK_ALL_READ' | translate }}
              </button>
            }
          </div>

          <!-- Content -->
          <div class="relative" style="max-height: calc(70vh - 120px);">
            @if (isLoading()) {
              <!-- Loading skeleton -->
              <div class="space-y-3 p-4">
                @for (i of [1, 2, 3]; track i) {
                  <div class="flex gap-3">
                    <div class="h-10 w-10 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                    <div class="flex-1 space-y-2">
                      <div class="h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                      <div class="h-3 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                    </div>
                  </div>
                }
              </div>
            } @else if (error()) {
              <!-- Error state -->
              <div class="p-8 text-center">
                <p class="text-red-600 dark:text-red-400">
                  {{ 'NOTIFICATIONS.ERROR_LOADING' | translate }}
                </p>
                <button tuiButton size="s" appearance="secondary" (click)="reload()" class="mt-4">
                  {{ 'COMMON.RETRY' | translate }}
                </button>
              </div>
            } @else if (notifications().length === 0) {
              <!-- Empty state -->
              <div class="p-8 text-center">
                <div
                  class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-700"
                >
                  <tui-icon icon="@tui.bell" class="text-gray-400 dark:text-gray-500"></tui-icon>
                </div>
                <p class="text-gray-600 dark:text-gray-400">
                  {{ 'NOTIFICATIONS.EMPTY' | translate }}
                </p>
              </div>
            } @else {
              <!-- Notification list -->
              <tui-scrollbar>
                <z-notification-list
                  [notifications]="notifications()"
                  [groupedNotifications]="groupedNotifications()"
                  (markAsRead)="markAsRead($event)"
                  (archive)="archiveNotification($event)"
                ></z-notification-list>
              </tui-scrollbar>
            }
          </div>

          <!-- Footer (future: link to full page) -->
          <!-- <div class="border-t border-gray-200 p-3 text-center dark:border-slate-700">
            <button
              tuiLink
              size="s"
              routerLink="/notifications"
              (click)="isOpen.set(false)"
            >
              {{ 'NOTIFICATIONS.VIEW_ALL' | translate }}
            </button>
          </div> -->
        </tui-data-list>
      </ng-template>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .notification-dropdown {
        overflow: hidden;
      }

      tui-scrollbar {
        height: 100%;
      }

      /* Glass morphism effect enhancement */
      .notification-dropdown::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
        pointer-events: none;
        border-radius: inherit;
      }

      /* Smooth transition for dropdown */
      :host ::ng-deep [tuiDropdown] {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationDropdownSmartComponent {
  private readonly facade = inject(NotificationFacadeService);
  private readonly realtime = inject(NotificationRealtimeService);

  // Signals
  readonly isOpen = signal(false);

  // Facade signals
  readonly notifications = this.facade.notifications;
  readonly groupedNotifications = this.facade.groupedNotifications;
  readonly unreadCount = this.facade.unreadCount;
  readonly isLoading = this.facade.isLoading;
  readonly error = this.facade.error;

  constructor() {
    // Load notifications when dropdown opens
    effect(() => {
      if (this.isOpen()) {
        this.facade.loadNotifications(false);
        // Mark notifications as read after a short delay
        setTimeout(() => {
          const unreadIds = this.notifications()
            .filter((n) => !n.is_read)
            .map((n) => n.id);
          if (unreadIds.length > 0) {
            this.facade.markAsRead(unreadIds);
          }
        }, 2000);
      }
    });

    // Always refresh unread count on component init
    this.facade.refreshUnreadCount();
  }

  markAsRead(notificationIds: string[]): void {
    this.facade.markAsRead(notificationIds);
  }

  markAllAsRead(): void {
    this.facade.markAllAsRead();
  }

  archiveNotification(notificationId: string): void {
    this.facade.archiveNotification(notificationId);
  }

  reload(): void {
    this.facade.loadNotifications(false);
  }
}
