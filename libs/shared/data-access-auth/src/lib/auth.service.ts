import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  AuthError,
  AuthState,
  AuthCredentials,
  PasswordResetRequest,
  PasswordUpdate,
  Session,
  SignUpData,
  User
} from '@zambia/shared/types-supabase';
import { Observable, from, map, of, switchMap, tap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

/**
 * Service for handling authentication with Supabase
 * Uses Angular Signals for reactive state management
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);

  // Auth state signal with initial values
  private authStateSignal = signal<AuthState>({
    user: null,
    session: null,
    loading: true,
    initialized: false,
    error: null,
  });

  // Computed signals for derived state
  public user = computed(() => this.authStateSignal().user);
  public session = computed(() => this.authStateSignal().session);
  public isAuthenticated = computed(() => !!this.authStateSignal().session);
  public isLoading = computed(() => this.authStateSignal().loading);
  public error = computed(() => this.authStateSignal().error);

  // Computed signal for user roles
  public userRoles = computed(() => {
    const user = this.user();
    if (!user || !user.role) return [];
    return [user.role];
  });

  // Observable for auth state
  private authState$ = toObservable(this.authStateSignal);

  constructor() {
    // Initialize the auth state
    this.initializeAuth();

    // Set up effect to log auth state changes (for debugging)
    effect(() => {
      const authState = this.authStateSignal();
      if (authState.initialized) {
        console.log('Auth state changed:', {
          isAuthenticated: !!authState.session,
          user: authState.user,
        });
      }
    });
  }

  /**
   * Initialize the authentication state
   * Checks for existing session and sets up auth state change listener
   */
  private async initializeAuth(): Promise<void> {
    try {
      // Import dynamically to avoid SSR issues
      const { createClient } = await import('@supabase/supabase-js');

      // Initialize Supabase client
      // Note: In a real application, these values should come from environment variables
      const supabaseUrl = 'https://your-project-url.supabase.co';
      const supabaseKey = 'your-anon-key';
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Get initial session
      const { data: { session } } = await supabase.auth.getSession();

      // Get user if session exists
      let user: User | null = null;
      if (session) {
        const { data: { user: supabaseUser } } = await supabase.auth.getUser();
        if (supabaseUser) {
          // Transform to our User type with additional properties
          user = {
            ...supabaseUser,
            // You would typically fetch these from your database
            role: supabaseUser.user_metadata?.role,
            roleId: supabaseUser.user_metadata?.roleId,
            permissions: supabaseUser.user_metadata?.permissions || [],
          };
        }
      }

      // Update auth state
      this.authStateSignal.update(state => ({
        ...state,
        user,
        session: session as Session,
        loading: false,
        initialized: true,
      }));

      // Set up auth state change listener
      supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state change:', event, session);

        let user: User | null = null;
        if (session) {
          const { data: { user: supabaseUser } } = await supabase.auth.getUser();
          if (supabaseUser) {
            // Transform to our User type with additional properties
            user = {
              ...supabaseUser,
              // You would typically fetch these from your database
              role: supabaseUser.user_metadata?.role,
              roleId: supabaseUser.user_metadata?.roleId,
              permissions: supabaseUser.user_metadata?.permissions || [],
            };
          }
        }

        // Update auth state
        this.authStateSignal.update(state => ({
          ...state,
          user,
          session: session as Session,
          loading: false,
        }));
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
      this.authStateSignal.update(state => ({
        ...state,
        loading: false,
        initialized: true,
        error: {
          message: 'Failed to initialize authentication',
        },
      }));
    }
  }

  /**
   * Sign in with email and password
   * @param credentials User credentials
   * @returns Observable of user
   */
  public signIn(credentials: AuthCredentials): Observable<User | null> {
    this.authStateSignal.update(state => ({
      ...state,
      loading: true,
      error: null,
    }));

    return from(this.getSupabaseClient()).pipe(
      switchMap(supabase =>
        from(supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        }))
      ),
      map(({ data, error }) => {
        if (error) {
          this.handleAuthError(error);
          return null;
        }

        const { user: supabaseUser, session } = data;

        if (!supabaseUser) {
          this.handleAuthError({ message: 'User not found' });
          return null;
        }

        // Transform to our User type with additional properties
        const user: User = {
          ...supabaseUser,
          // You would typically fetch these from your database
          role: supabaseUser.user_metadata?.role,
          roleId: supabaseUser.user_metadata?.roleId,
          permissions: supabaseUser.user_metadata?.permissions || [],
        };

        // Update auth state
        this.authStateSignal.update(state => ({
          ...state,
          user,
          session: session as Session,
          loading: false,
        }));

        return user;
      }),
      tap(() => this.authStateSignal.update(state => ({ ...state, loading: false })))
    );
  }

  /**
   * Sign up with email and password
   * @param signUpData User sign-up data
   * @returns Observable of user
   */
  public signUp(signUpData: SignUpData): Observable<User | null> {
    this.authStateSignal.update(state => ({
      ...state,
      loading: true,
      error: null,
    }));

    return from(this.getSupabaseClient()).pipe(
      switchMap(supabase =>
        from(supabase.auth.signUp({
          email: signUpData.email,
          password: signUpData.password,
          options: {
            data: {
              first_name: signUpData.firstName,
              last_name: signUpData.lastName,
            },
          },
        }))
      ),
      map(({ data, error }) => {
        if (error) {
          this.handleAuthError(error);
          return null;
        }

        const { user: supabaseUser, session } = data;

        if (!supabaseUser) {
          this.handleAuthError({ message: 'User not found' });
          return null;
        }

        // Transform to our User type with additional properties
        const user: User = {
          ...supabaseUser,
          // You would typically fetch these from your database
          role: supabaseUser.user_metadata?.role,
          roleId: supabaseUser.user_metadata?.roleId,
          permissions: supabaseUser.user_metadata?.permissions || [],
        };

        // Update auth state
        this.authStateSignal.update(state => ({
          ...state,
          user,
          session: session as Session,
          loading: false,
        }));

        return user;
      }),
      tap(() => this.authStateSignal.update(state => ({ ...state, loading: false })))
    );
  }

  /**
   * Sign out the current user
   * @returns Observable of success status
   */
  public signOut(): Observable<boolean> {
    this.authStateSignal.update(state => ({
      ...state,
      loading: true,
      error: null,
    }));

    return from(this.getSupabaseClient()).pipe(
      switchMap(supabase => from(supabase.auth.signOut())),
      map(({ error }) => {
        if (error) {
          this.handleAuthError(error);
          return false;
        }

        // Update auth state
        this.authStateSignal.update(state => ({
          ...state,
          user: null,
          session: null,
          loading: false,
        }));

        // Navigate to login page
        this.router.navigate(['/login']);

        return true;
      }),
      tap(() => this.authStateSignal.update(state => ({ ...state, loading: false })))
    );
  }

  /**
   * Request a password reset for a user
   * @param request Password reset request
   * @returns Observable of success status
   */
  public requestPasswordReset(request: PasswordResetRequest): Observable<boolean> {
    this.authStateSignal.update(state => ({
      ...state,
      loading: true,
      error: null,
    }));

    return from(this.getSupabaseClient()).pipe(
      switchMap(supabase =>
        from(supabase.auth.resetPasswordForEmail(request.email))
      ),
      map(({ error }) => {
        if (error) {
          this.handleAuthError(error);
          return false;
        }

        return true;
      }),
      tap(() => this.authStateSignal.update(state => ({ ...state, loading: false })))
    );
  }

  /**
   * Update the password for the current user
   * @param update Password update
   * @returns Observable of success status
   */
  public updatePassword(update: PasswordUpdate): Observable<boolean> {
    this.authStateSignal.update(state => ({
      ...state,
      loading: true,
      error: null,
    }));

    return from(this.getSupabaseClient()).pipe(
      switchMap(supabase =>
        from(supabase.auth.updateUser({ password: update.password }))
      ),
      map(({ error }) => {
        if (error) {
          this.handleAuthError(error);
          return false;
        }

        return true;
      }),
      tap(() => this.authStateSignal.update(state => ({ ...state, loading: false })))
    );
  }

  /**
   * Check if the current user has the specified role
   * @param role Role to check
   * @returns True if the user has the role
   */
  public hasRole(role: string): boolean {
    const roles = this.userRoles();
    return roles.includes(role);
  }

  /**
   * Check if the current user has any of the specified roles
   * @param roles Roles to check
   * @returns True if the user has any of the roles
   */
  public hasAnyRole(roles: string[]): boolean {
    const userRoles = this.userRoles();
    return roles.some(role => userRoles.includes(role));
  }

  /**
   * Get the current user's roles
   * @returns Array of roles
   */
  public getCurrentUserRoles(): string[] {
    return this.userRoles();
  }

  /**
   * Get the Supabase client
   * @returns Promise of Supabase client
   */
  private async getSupabaseClient() {
    const { createClient } = await import('@supabase/supabase-js');

    // Note: In a real application, these values should come from environment variables
    const supabaseUrl = 'https://your-project-url.supabase.co';
    const supabaseKey = 'your-anon-key';

    return createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Handle authentication errors
   * @param error The error to handle
   */
  private handleAuthError(error: any): void {
    console.error('Authentication error:', error);

    const authError: AuthError = {
      message: error.message || 'Authentication failed',
      status: error.status,
      code: error.code,
    };

    this.authStateSignal.update(state => ({
      ...state,
      error: authError,
      loading: false,
    }));
  }
}
