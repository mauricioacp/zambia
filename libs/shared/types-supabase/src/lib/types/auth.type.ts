import { User as SupabaseUser, Session as SupabaseSession } from '@supabase/supabase-js';

/**
 * Type representing a User entity
 * Extends the Supabase User type with additional properties
 */
export interface User extends SupabaseUser {
  role?: string;
  roleId?: string;
  permissions?: string[];
  profile?: UserProfile;
}

/**
 * Type representing a Session entity
 * Extends the Supabase Session type with additional properties
 */
export interface Session extends SupabaseSession {
  user: User;
}

/**
 * Type for user profile information
 */
export interface UserProfile {
  id: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
  contactEmail?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  birthDate?: string;
  preferences?: UserPreferences;
  metadata?: Record<string, any>;
}

/**
 * Type for user preferences
 */
export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  timezone?: string;
}

/**
 * Type for authentication credentials
 */
export interface AuthCredentials {
  email: string;
  password: string;
}

/**
 * Type for sign-up data
 */
export interface SignUpData extends AuthCredentials {
  firstName?: string;
  lastName?: string;
}

/**
 * Type for password reset request
 */
export interface PasswordResetRequest {
  email: string;
}

/**
 * Type for password update
 */
export interface PasswordUpdate {
  password: string;
}

/**
 * Type for authentication error
 */
export interface AuthError {
  message: string;
  status?: number;
  code?: string;
}

/**
 * Type for authentication state
 */
export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
  error: AuthError | null;
}
