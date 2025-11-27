import { Injectable, inject, signal, DestroyRef } from '@angular/core';
import { SupabaseService } from '@zambia/data-access-supabase';
import { NotificationService } from '@zambia/data-access-generic';
import { TranslateService } from '@ngx-translate/core';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

/**
 * Types of database change events
 */
export type AgreementEventType = 'INSERT' | 'UPDATE' | 'DELETE';

/**
 * Agreement change event data
 */
export interface AgreementChangeEvent {
  type: AgreementEventType;
  agreementId: string;
  timestamp: Date;
  payload?: RealtimePostgresChangesPayload<any>;
}

/**
 * Callback function type for invalidation
 */
export type InvalidateCallback = () => void;

/**
 * Subscription options
 */
export interface SubscriptionOptions {
  /** Whether to show toast notifications for changes */
  showNotifications?: boolean;
  /** Whether to auto-invalidate cache on changes */
  autoInvalidate?: boolean;
  /** Callback for custom handling of events */
  onEvent?: (event: AgreementChangeEvent) => void;
}

/**
 * Service for managing real-time subscriptions to agreements table changes.
 *
 * Features:
 * - Real-time notifications when agreements are inserted, updated, or deleted
 * - Automatic cache invalidation on changes
 * - RLS-aware (only receives events for agreements user has access to)
 * - Event history tracking
 * - Configurable notifications
 * - Automatic cleanup on service destroy
 *
 * @example
 * ```typescript
 * // Subscribe to changes with automatic cache invalidation
 * realtimeService.subscribe(() => {
 *   // Invalidate cache and reload
 *   this.agreements.reload();
 * }, {
 *   showNotifications: true,
 *   autoInvalidate: true
 * });
 *
 * // Unsubscribe when done
 * realtimeService.unsubscribe();
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class AgreementsRealtimeService {
  private supabase = inject(SupabaseService);
  private notificationService = inject(NotificationService);
  private translate = inject(TranslateService);
  private destroyRef = inject(DestroyRef);

  private channel: RealtimeChannel | null = null;
  private invalidateCallback: InvalidateCallback | null = null;
  private options: SubscriptionOptions = {};

  // State signals
  private changeEvents = signal<AgreementChangeEvent[]>([]);
  isSubscribed = signal(false);
  isConnected = signal(false);
  lastEventTime = signal<Date | null>(null);

  // Event counters
  private insertCount = signal(0);
  private updateCount = signal(0);
  private deleteCount = signal(0);

  constructor() {
    // Cleanup on destroy
    this.destroyRef.onDestroy(() => {
      this.unsubscribe();
    });
  }

  /**
   * Subscribe to real-time changes on the agreements table
   *
   * @param onInvalidate - Callback function to call when cache should be invalidated
   * @param options - Subscription options
   */
  subscribe(onInvalidate: InvalidateCallback, options: SubscriptionOptions = {}): void {
    if (this.isSubscribed()) {
      console.warn('[AgreementsRealtime] Already subscribed to agreements changes');
      return;
    }

    this.invalidateCallback = onInvalidate;
    this.options = {
      showNotifications: true,
      autoInvalidate: true,
      ...options,
    };

    const client = this.supabase.getClient();

    console.log('[AgreementsRealtime] Subscribing to agreements changes...');

    // Create channel for agreements table
    this.channel = client
      .channel('agreements-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'agreements',
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          this.handleChange(payload);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          this.isSubscribed.set(true);
          this.isConnected.set(true);
          console.log('[AgreementsRealtime] Successfully subscribed to agreements changes');
        } else if (status === 'CHANNEL_ERROR') {
          this.isConnected.set(false);
          console.error('[AgreementsRealtime] Subscription error');
        } else if (status === 'TIMED_OUT') {
          this.isConnected.set(false);
          console.error('[AgreementsRealtime] Subscription timed out');
        }
      });
  }

  /**
   * Handle incoming change event
   */
  private handleChange(payload: RealtimePostgresChangesPayload<any>): void {
    const eventType = payload.eventType as AgreementEventType;
    const agreementId = (payload.new?.id || payload.old?.id) as string;

    console.log('[AgreementsRealtime] Change detected:', eventType, agreementId);

    // Create event object
    const event: AgreementChangeEvent = {
      type: eventType,
      agreementId,
      timestamp: new Date(),
      payload,
    };

    // Add to event history
    this.changeEvents.update((events) => [...events.slice(-99), event]); // Keep last 100 events
    this.lastEventTime.set(new Date());

    // Update counters
    switch (eventType) {
      case 'INSERT':
        this.insertCount.update((c) => c + 1);
        break;
      case 'UPDATE':
        this.updateCount.update((c) => c + 1);
        break;
      case 'DELETE':
        this.deleteCount.update((c) => c + 1);
        break;
    }

    // Show notification if enabled
    if (this.options.showNotifications) {
      this.notifyUser(eventType, payload);
    }

    // Call custom event handler if provided
    if (this.options.onEvent) {
      this.options.onEvent(event);
    }

    // Auto-invalidate cache if enabled
    if (this.options.autoInvalidate && this.invalidateCallback) {
      console.log('[AgreementsRealtime] Auto-invalidating cache');
      this.invalidateCallback();
    }
  }

  /**
   * Show user notification based on event type
   */
  private notifyUser(eventType: AgreementEventType, payload: RealtimePostgresChangesPayload<any>): void {
    const name = this.getAgreementName(payload);

    switch (eventType) {
      case 'INSERT':
        this.notificationService.showInfo(
          this.translate.instant('realtime.new_agreement_added', { name }),
          this.translate.instant('realtime.agreement_list_updated')
        );
        break;

      case 'UPDATE':
        // Only notify for significant changes (status, role, etc.)
        if (this.isSignificantUpdate(payload)) {
          this.notificationService.showInfo(
            this.translate.instant('realtime.agreement_updated', { name }),
            this.translate.instant('realtime.agreement_list_updated')
          );
        }
        break;

      case 'DELETE':
        this.notificationService.showWarning(
          this.translate.instant('realtime.agreement_removed', { name }),
          this.translate.instant('realtime.agreement_list_updated')
        );
        break;
    }
  }

  /**
   * Get agreement name from payload
   */
  private getAgreementName(payload: RealtimePostgresChangesPayload<any>): string {
    const record = payload.new || payload.old;
    if (!record) return this.translate.instant('realtime.agreement');

    const name = record.name || '';
    const lastName = record.last_name || '';
    return name && lastName ? `${name} ${lastName}` : name || lastName || this.translate.instant('realtime.agreement');
  }

  /**
   * Determine if an update is significant enough to notify user
   */
  private isSignificantUpdate(payload: RealtimePostgresChangesPayload<any>): boolean {
    const oldRecord = payload.old;
    const newRecord = payload.new;

    if (!oldRecord || !newRecord) return true;

    // Check for changes in important fields
    const significantFields = ['status', 'role_id', 'headquarter_id', 'season_id', 'name', 'last_name', 'email'];

    return significantFields.some((field) => oldRecord[field] !== newRecord[field]);
  }

  /**
   * Unsubscribe from real-time updates
   */
  unsubscribe(): void {
    if (this.channel) {
      console.log('[AgreementsRealtime] Unsubscribing from agreements changes');
      this.supabase.getClient().removeChannel(this.channel);
      this.channel = null;
      this.isSubscribed.set(false);
      this.isConnected.set(false);
      this.invalidateCallback = null;
    }
  }

  /**
   * Pause notifications without unsubscribing
   * Events will still be tracked but notifications won't be shown
   */
  pauseNotifications(): void {
    this.options.showNotifications = false;
  }

  /**
   * Resume notifications
   */
  resumeNotifications(): void {
    this.options.showNotifications = true;
  }

  /**
   * Get recent change events
   *
   * @param limit - Maximum number of events to return (default: 10)
   * @returns Array of recent change events
   */
  getRecentChanges(limit = 10): AgreementChangeEvent[] {
    return this.changeEvents().slice(-limit);
  }

  /**
   * Get changes filtered by event type
   *
   * @param type - Event type to filter by
   * @param limit - Maximum number of events to return
   * @returns Array of filtered events
   */
  getChangesByType(type: AgreementEventType, limit?: number): AgreementChangeEvent[] {
    const filtered = this.changeEvents().filter((e) => e.type === type);
    return limit ? filtered.slice(-limit) : filtered;
  }

  /**
   * Get changes for a specific agreement
   *
   * @param agreementId - Agreement ID to filter by
   * @returns Array of events for the agreement
   */
  getChangesForAgreement(agreementId: string): AgreementChangeEvent[] {
    return this.changeEvents().filter((e) => e.agreementId === agreementId);
  }

  /**
   * Clear event history
   */
  clearHistory(): void {
    this.changeEvents.set([]);
    this.insertCount.set(0);
    this.updateCount.set(0);
    this.deleteCount.set(0);
    this.lastEventTime.set(null);
  }

  /**
   * Get subscription statistics
   */
  getStats() {
    return {
      isSubscribed: this.isSubscribed(),
      isConnected: this.isConnected(),
      totalEvents: this.changeEvents().length,
      inserts: this.insertCount(),
      updates: this.updateCount(),
      deletes: this.deleteCount(),
      lastEventTime: this.lastEventTime(),
      options: this.options,
    };
  }

  /**
   * Check if there are any new events since a given time
   *
   * @param since - Date to compare against
   * @returns True if there are newer events
   */
  hasNewEventsSince(since: Date): boolean {
    const lastEvent = this.lastEventTime();
    return lastEvent !== null && lastEvent > since;
  }

  /**
   * Force trigger invalidation callback manually
   */
  triggerInvalidation(): void {
    if (this.invalidateCallback) {
      console.log('[AgreementsRealtime] Manually triggering invalidation');
      this.invalidateCallback();
    }
  }
}
