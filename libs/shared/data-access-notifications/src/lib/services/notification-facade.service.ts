import { Injectable, computed, inject, signal } from '@angular/core';
import { Subject, catchError, of, switchMap, tap } from 'rxjs';
import { NotificationApiService } from './notification-api.service';
import type {
  Notification,
  NotificationFilters,
  NotificationPreferences,
  SendNotificationRequest,
  SendRoleNotificationRequest,
} from '../types/notification.types';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  pageSize: number;
  filters: NotificationFilters;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  hasMore: true,
  currentPage: 0,
  pageSize: 20,
  filters: {},
};

@Injectable({
  providedIn: 'root',
})
export class NotificationFacadeService {
  private readonly api = inject(NotificationApiService);

  // State management
  private readonly state = signal<NotificationState>(initialState);

  // Actions
  private readonly loadNotifications$ = new Subject<{ append: boolean }>();
  private readonly refreshUnreadCount$ = new Subject<void>();
  private readonly markAsRead$ = new Subject<string[]>();
  private readonly markAllAsRead$ = new Subject<void>();
  private readonly archiveNotification$ = new Subject<string>();

  // Public signals
  readonly notifications = computed(() => this.state().notifications);
  readonly unreadCount = computed(() => this.state().unreadCount);
  readonly isLoading = computed(() => this.state().isLoading);
  readonly error = computed(() => this.state().error);
  readonly hasMore = computed(() => this.state().hasMore);

  // Computed signals
  readonly hasUnread = computed(() => this.unreadCount() > 0);

  readonly groupedNotifications = computed(() => {
    const notifications = this.notifications();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const groups: Record<string, Notification[]> = {
      today: [],
      yesterday: [],
      thisWeek: [],
      older: [],
    };

    notifications.forEach((notification) => {
      const date = new Date(notification.created_at);
      date.setHours(0, 0, 0, 0);

      if (date.getTime() === today.getTime()) {
        groups['today'].push(notification);
      } else if (date.getTime() === yesterday.getTime()) {
        groups['yesterday'].push(notification);
      } else if (date.getTime() > weekAgo.getTime()) {
        groups['thisWeek'].push(notification);
      } else {
        groups['older'].push(notification);
      }
    });

    return groups;
  });

  // Preferences state
  private readonly preferencesState = signal<{
    preferences: NotificationPreferences[];
    isLoading: boolean;
    error: string | null;
  }>({
    preferences: [],
    isLoading: false,
    error: null,
  });

  readonly preferences = computed(() => this.preferencesState().preferences);
  readonly preferencesLoading = computed(() => this.preferencesState().isLoading);

  constructor() {
    this.setupEffects();
  }

  private setupEffects(): void {
    // Load notifications effect
    this.loadNotifications$
      .pipe(
        tap(() => this.updateState({ isLoading: true, error: null })),
        switchMap(({ append }) => {
          const state = this.state();
          const offset = append ? state.notifications.length : 0;

          return this.api
            .getNotifications({
              ...state.filters,
              limit: state.pageSize,
              offset,
            })
            .pipe(
              tap((response) => {
                this.updateState({
                  notifications: append ? [...state.notifications, ...response.data] : response.data,
                  hasMore: response.has_more,
                  isLoading: false,
                  currentPage: append ? state.currentPage + 1 : 0,
                });
              }),
              catchError((error) => {
                this.updateState({
                  error: 'Failed to load notifications',
                  isLoading: false,
                });
                return of(null);
              })
            );
        })
      )
      .subscribe();

    // Refresh unread count effect
    this.refreshUnreadCount$
      .pipe(
        switchMap(() =>
          this.api.getUnreadCount().pipe(
            tap((response) => {
              this.updateState({ unreadCount: response.unread_count });
            }),
            catchError(() => of(null))
          )
        )
      )
      .subscribe();

    // Mark as read effect
    this.markAsRead$
      .pipe(
        switchMap((ids) => {
          // Optimistic update
          this.updateState({
            notifications: this.state().notifications.map((n) =>
              ids.includes(n.id) ? { ...n, is_read: true, read_at: new Date().toISOString() } : n
            ),
            unreadCount: Math.max(0, this.state().unreadCount - ids.length),
          });

          return this.api.markAsRead(ids).pipe(
            catchError((error) => {
              // Revert on error
              this.loadNotifications(false);
              this.refreshUnreadCount();
              return of(null);
            })
          );
        })
      )
      .subscribe();

    // Mark all as read effect
    this.markAllAsRead$
      .pipe(
        switchMap(() => {
          // Optimistic update
          this.updateState({
            notifications: this.state().notifications.map((n) => ({
              ...n,
              is_read: true,
              read_at: new Date().toISOString(),
            })),
            unreadCount: 0,
          });

          return this.api.markAllAsRead().pipe(
            catchError((error) => {
              // Revert on error
              this.loadNotifications(false);
              this.refreshUnreadCount();
              return of(null);
            })
          );
        })
      )
      .subscribe();

    // Archive notification effect
    this.archiveNotification$
      .pipe(
        switchMap((id) => {
          // Optimistic update
          const notification = this.state().notifications.find((n) => n.id === id);
          this.updateState({
            notifications: this.state().notifications.filter((n) => n.id !== id),
            unreadCount:
              notification && !notification.is_read
                ? Math.max(0, this.state().unreadCount - 1)
                : this.state().unreadCount,
          });

          return this.api.archiveNotification(id).pipe(
            catchError((error) => {
              // Revert on error
              this.loadNotifications(false);
              this.refreshUnreadCount();
              return of(null);
            })
          );
        })
      )
      .subscribe();
  }

  private updateState(partial: Partial<NotificationState>): void {
    this.state.update((state) => ({ ...state, ...partial }));
  }

  // Public methods
  loadNotifications(append = false): void {
    this.loadNotifications$.next({ append });
  }

  refreshUnreadCount(): void {
    this.refreshUnreadCount$.next();
  }

  markAsRead(notificationIds: string[]): void {
    if (notificationIds.length === 0) return;
    this.markAsRead$.next(notificationIds);
  }

  markAllAsRead(): void {
    this.markAllAsRead$.next();
  }

  archiveNotification(notificationId: string): void {
    this.archiveNotification$.next(notificationId);
  }

  setFilters(filters: NotificationFilters): void {
    this.updateState({ filters });
    this.loadNotifications(false);
  }

  // Preferences methods
  loadPreferences(): void {
    this.preferencesState.update((state) => ({ ...state, isLoading: true, error: null }));

    this.api
      .getPreferences()
      .pipe(
        tap((response) => {
          this.preferencesState.update((state) => ({
            ...state,
            preferences: response.data,
            isLoading: false,
          }));
        }),
        catchError((error) => {
          this.preferencesState.update((state) => ({
            ...state,
            error: 'Failed to load preferences',
            isLoading: false,
          }));
          return of(null);
        })
      )
      .subscribe();
  }

  updatePreferences(preferences: Partial<NotificationPreferences>[]): void {
    this.api
      .updatePreferences(preferences)
      .pipe(
        tap((response) => {
          if (response.success) {
            this.preferencesState.update((state) => ({
              ...state,
              preferences: response.data,
            }));
          }
        }),
        catchError((error) => {
          console.error('Failed to update preferences:', error);
          return of(null);
        })
      )
      .subscribe();
  }

  // Send notification methods (for admin users)
  sendNotification(notification: SendNotificationRequest) {
    return this.api.sendDirectNotification(notification);
  }

  sendRoleNotification(notification: SendRoleNotificationRequest) {
    return this.api.sendRoleNotification(notification);
  }

  // Search users for notifications
  searchUsers(query: string, filters?: { role_code?: string; min_role_level?: number }) {
    return this.api.searchUsers(query);
  }
}
