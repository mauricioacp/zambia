// Notification types based on Supabase schema

export type NotificationType =
  | 'system'
  | 'direct_message'
  | 'action_required'
  | 'reminder'
  | 'alert'
  | 'achievement'
  | 'role_based';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export type NotificationChannel = 'in_app' | 'email' | 'sms' | 'push';

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  sender_id: string | null;
  sender_type: string;
  recipient_id: string;
  recipient_role_code: string | null;
  recipient_role_level: number | null;
  title: string;
  body: string;
  data: Record<string, any>;
  category: string | null;
  tags: string[];
  expires_at: string | null;
  is_read: boolean;
  read_at: string | null;
  is_archived: boolean;
  archived_at: string | null;
  delivered_channels: NotificationChannel[];
  action_url: string | null;
  related_entity_type: string | null;
  related_entity_id: string | null;
  created_at: string;
  updated_at: string | null;
  // Extended fields from RPC functions
  sender?: {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export interface NotificationPreferences {
  id: string;
  user_id: string;
  notification_type: NotificationType;
  in_app_enabled: boolean;
  email_enabled: boolean;
  sms_enabled: boolean;
  push_enabled: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface NotificationFilters {
  type?: NotificationType;
  priority?: NotificationPriority;
  is_read?: boolean;
  category?: string;
  limit?: number;
  offset?: number;
}

export interface SendNotificationRequest {
  recipient_id: string;
  title: string;
  body: string;
  type?: NotificationType;
  priority?: NotificationPriority;
  data?: Record<string, any>;
  action_url?: string;
  related_entity_type?: string;
  related_entity_id?: string;
}

export interface SendRoleNotificationRequest {
  role_codes: string[];
  min_role_level?: number;
  title: string;
  body: string;
  type?: NotificationType;
  priority?: NotificationPriority;
  data?: Record<string, any>;
}

export interface NotificationListResponse {
  data: Notification[];
  count: number;
  has_more: boolean;
}

export interface UnreadCountResponse {
  unread_count: number;
  by_priority: {
    urgent: number;
    high: number;
    medium: number;
    low: number;
  };
}

export interface UserSearchResult {
  id: string;
  email: string;
  full_name: string | null;
  role_code: string;
  role_name: string;
  role_level: number;
  avatar_url: string | null;
}
