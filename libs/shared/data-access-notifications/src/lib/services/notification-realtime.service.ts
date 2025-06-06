import { Injectable, inject, OnDestroy, effect } from '@angular/core';
import { SupabaseService } from '@zambia/data-access-supabase';
import { NotificationFacadeService } from './notification-facade.service';
import { AuthService } from '@zambia/data-access-auth';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { NotificationService } from '@zambia/data-access-generic';
import type { Notification, NotificationPriority } from '../types/notification.types';

@Injectable({
  providedIn: 'root',
})
export class NotificationRealtimeService implements OnDestroy {
  private readonly supabase = inject(SupabaseService);
  private readonly facade = inject(NotificationFacadeService);
  private readonly auth = inject(AuthService);
  private readonly toastService = inject(NotificationService);

  private channel: RealtimeChannel | null = null;
  private notificationSound: HTMLAudioElement | null = null;

  constructor() {
    // Initialize notification sound (optional)
    if (typeof window !== 'undefined' && window.Audio) {
      this.notificationSound = new Audio('/assets/sounds/notification.mp3');
      this.notificationSound.volume = 0.5;
    }

    // Set up realtime subscription when user is authenticated
    // Use effect to watch session changes
    effect(() => {
      const session = this.auth.session();
      if (session?.user) {
        this.setupRealtimeSubscription(session.user.id);
      } else {
        this.cleanup();
      }
    });
  }

  private setupRealtimeSubscription(userId: string): void {
    // Clean up any existing subscription
    this.cleanup();

    // Create a new channel for notifications
    this.channel = this.supabase
      .getClient()
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.${userId}`,
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          this.handleNewNotification(payload.new as Notification);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Realtime notification subscription active');
        }
      });
  }

  private handleNewNotification(notification: Notification): void {
    // Update the facade service state
    this.facade.refreshUnreadCount();

    // Reload notifications if the dropdown is open
    if (this.facade.notifications().length > 0) {
      this.facade.loadNotifications(false);
    }

    // Play notification sound for high priority notifications
    if (this.shouldPlaySound(notification.priority)) {
      this.playNotificationSound();
    }

    // Show toast notification for important notifications
    if (this.shouldShowToast(notification.type, notification.priority)) {
      this.showToastNotification(notification);
    }
  }

  private shouldPlaySound(priority: NotificationPriority): boolean {
    return priority === 'urgent' || priority === 'high';
  }

  private shouldShowToast(type: string, priority: NotificationPriority): boolean {
    // Show toast for urgent notifications or specific types
    return priority === 'urgent' || type === 'action_required' || type === 'alert' || type === 'direct_message';
  }

  private playNotificationSound(): void {
    if (this.notificationSound) {
      this.notificationSound.play().catch((error) => {
        // Ignore errors (e.g., autoplay policy)
        console.debug('Could not play notification sound:', error);
      });
    }
  }

  private showToastNotification(notification: Notification): void {
    switch (notification.priority) {
      case 'urgent':
        this.toastService.showError(notification.title);
        break;
      case 'high':
        this.toastService.showWarning(notification.title);
        break;
      case 'low':
        this.toastService.showSuccess(notification.title);
        break;
      case 'medium':
      default:
        this.toastService.showInfo(notification.title);
        break;
    }
  }

  private cleanup(): void {
    if (this.channel) {
      this.supabase.getClient().removeChannel(this.channel);
      this.channel = null;
    }
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  /**
   * Enable or disable notification sounds
   */
  setNotificationSoundEnabled(enabled: boolean): void {
    if (this.notificationSound) {
      this.notificationSound.muted = !enabled;
    }
  }

  /**
   * Test the notification sound
   */
  testNotificationSound(): void {
    this.playNotificationSound();
  }
}
