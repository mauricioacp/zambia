import { Injectable, inject } from '@angular/core';
import { from, Observable, map } from 'rxjs';
import { SupabaseService } from '@zambia/data-access-supabase';
import type {
  Notification,
  NotificationFilters,
  NotificationListResponse,
  NotificationPreferences,
  SendNotificationRequest,
  SendRoleNotificationRequest,
  UnreadCountResponse,
  UserSearchResult,
} from '../types/notification.types';

@Injectable({
  providedIn: 'root',
})
export class NotificationApiService {
  private readonly supabase = inject(SupabaseService);

  private async invokeFunction<T>(
    path: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
      body?: any;
      params?: Record<string, string>;
    } = {}
  ): Promise<T> {
    const { method = 'GET', body = {}, params = {} } = options;

    // Build query string for GET requests
    let fullPath = path;
    if (method === 'GET' && Object.keys(params).length > 0) {
      const queryString = new URLSearchParams(params).toString();
      fullPath = `${path}?${queryString}`;
    }

    const { data, error } = await this.supabase.getClient().functions.invoke('akademy', {
      body: method === 'GET' ? {} : body,
      headers: {
        'x-invoke-path': fullPath,
      },
      method,
    });

    if (error) {
      console.error('Edge function error:', error);
      throw error;
    }

    return data as T;
  }

  /**
   * Get paginated list of notifications for the current user
   */
  getNotifications(filters?: NotificationFilters): Observable<NotificationListResponse> {
    const params: Record<string, string> = {};

    if (filters?.limit) params['limit'] = filters.limit.toString();
    if (filters?.offset) params['offset'] = filters.offset.toString();
    if (filters?.type) params['type'] = filters.type;
    if (filters?.priority) params['priority'] = filters.priority;
    if (filters?.is_read !== undefined) params['is_read'] = filters.is_read.toString();
    if (filters?.category) params['category'] = filters.category;

    return from(
      this.invokeFunction<NotificationListResponse>('/notifications', {
        method: 'GET',
        params,
      })
    );
  }

  /**
   * Get unread notification count for the current user
   */
  getUnreadCount(): Observable<UnreadCountResponse> {
    return from(
      this.invokeFunction<UnreadCountResponse>('/notifications/unread-count', {
        method: 'GET',
      })
    );
  }

  /**
   * Mark notifications as read
   */
  markAsRead(notificationIds: string[]): Observable<{ success: boolean }> {
    return from(
      this.invokeFunction<{ success: boolean }>('/notifications/mark-read', {
        method: 'PUT',
        body: { notification_ids: notificationIds },
      })
    );
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): Observable<{ success: boolean; updated_count: number }> {
    return from(
      this.invokeFunction<{ success: boolean; updated_count: number }>('/notifications/mark-all-read', {
        method: 'PUT',
        body: {},
      })
    );
  }

  /**
   * Archive a notification
   */
  archiveNotification(notificationId: string): Observable<{ success: boolean }> {
    return from(
      this.invokeFunction<{ success: boolean }>(`/notifications/${notificationId}/archive`, {
        method: 'PUT',
        body: {},
      })
    );
  }

  /**
   * Get notification preferences for the current user
   */
  getPreferences(): Observable<{ data: NotificationPreferences[] }> {
    return from(
      this.invokeFunction<{ data: NotificationPreferences[] }>('/notifications/preferences', {
        method: 'GET',
      })
    );
  }

  /**
   * Update notification preferences
   */
  updatePreferences(
    preferences: Partial<NotificationPreferences>[]
  ): Observable<{ success: boolean; data: NotificationPreferences[] }> {
    return from(
      this.invokeFunction<{ success: boolean; data: NotificationPreferences[] }>('/notifications/preferences', {
        method: 'PUT',
        body: { preferences },
      })
    );
  }

  /**
   * Search users for notification recipients
   */
  searchUsers(query: string): Observable<UserSearchResult[]> {
    return from(
      this.invokeFunction<{ data: UserSearchResult[] }>('/users/search', {
        method: 'GET',
        params: { q: query, limit: '10' },
      })
    ).pipe(map((response) => response.data));
  }

  /**
   * Send a direct notification to a user (requires appropriate permissions)
   */
  sendDirectNotification(
    notification: SendNotificationRequest
  ): Observable<{ success: boolean; notification_id: string }> {
    return from(
      this.invokeFunction<{ success: boolean; notification_id: string }>('/notifications/send', {
        method: 'POST',
        body: notification,
      })
    );
  }

  /**
   * Send notifications to users by role (requires appropriate permissions)
   */
  sendRoleNotification(
    notification: SendRoleNotificationRequest
  ): Observable<{ success: boolean; notification_count: number }> {
    return from(
      this.invokeFunction<{ success: boolean; notification_count: number }>('/notifications/send-role', {
        method: 'POST',
        body: notification,
      })
    );
  }
}
