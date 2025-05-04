import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

import { distinctUntilChanged, filter, from, map, Observable, shareReplay } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { Session } from '@supabase/supabase-js';
import { SupabaseService } from '@zambia/data-access-supabase';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);
  readonly #supabaseService = inject(SupabaseService);

  readonly #session = signal<Session | null>(null);
  readonly isAuthenticated = computed(() => !!this.#session());
  readonly isAuthenticatedAsAdmin = computed(() => this.isAuthenticated() && this.hasRole('admin'));
  readonly #loading = signal<boolean>(false);
  readonly #acting = signal<boolean>(false);
  readonly #supabase = this.#supabaseService.getClient();

  public readonly acting = this.#acting.asReadonly();
  public readonly loading = this.#loading.asReadonly();
  public readonly session = this.#session.asReadonly();
  public readonly userId$ = toObservable(this.#session).pipe(
    map((v) => v?.user?.id),
    filter((v) => !!v),
    distinctUntilChanged(),
    map((v) => v as string)
  );
  readonly userName = computed(() => {
    const session = this.session();
    if (!session) return 'Usuario';
    const email = session.user?.email || '';
    const name = (session.user?.user_metadata?.['name'] as string) || '';
    return name || email.split('@')[0] || 'Usuario';
  });

  public readonly initialAuthCheckComplete$: Observable<boolean> = toObservable(this.loading).pipe(
    filter((loading) => !loading),
    shareReplay(1)
  );

  public userRoles = computed(() => {
    const user = this.session()?.user;

    if (!user || !user.user_metadata?.['roles']) {
      return [];
    }

    const rolesMetadata = user.user_metadata['roles'];

    if (!Array.isArray(rolesMetadata)) {
      console.warn('user_metadata.roles is not an array:', rolesMetadata);
      return [];
    }

    return rolesMetadata
      .map((role) => role?.code)
      .filter((code): code is string => typeof code === 'string' && code.length > 0);
  });

  constructor() {
    this.#supabase.auth
      .getSession()
      .then(({ data }) => {
        this.#session.set(data.session);
      })
      .finally(() => {
        this.#loading.set(false);
      });

    this.#supabase.auth.onAuthStateChange((_event, session) => {
      this.#session.set(session);
      if (this.#loading()) {
        this.#loading.set(false);
      }
    });

    effect(() => {
      const session = this.#session();
      console.log('Auth state changed:', {
        isAuthenticated: !!session,
        user: session?.user,
      });
    });
  }

  public async getUserId(): Promise<string> {
    const session = await this.#supabase.auth.getSession();
    return session.data.session?.user.id as string;
  }

  public refreshToken(): Observable<string> {
    return from(this.#supabase.auth.refreshSession()).pipe(
      map((session) => {
        if (!session?.data.session?.access_token) {
          throw new Error('Failed to refresh token.');
        }
        return session.data.session.access_token;
      })
    );
  }

  /**
   * @param email
   * @param password
   * @returns Promise
   */
  public async signIn(email: string, password: string) {
    this.#acting.set(true);
    this.#loading.set(true);

    const v = await this.#supabase.auth.signInWithPassword({
      email,
      password,
    });
    this.router.navigate(['/dashboard/panel']);
    this.#acting.set(false);
    this.#loading.set(false);
    return v;
  }

  public async signOut() {
    this.#acting.set(true);
    return this.#supabase.auth.signOut().then((v) => {
      this.#acting.set(false);
      this.router.navigate(['/login']);
      return v;
    });
  }

  public hasRole(role: string): boolean {
    const roles = this.userRoles();
    return roles.includes(role);
  }

  public hasAnyRole(roles: string[]): boolean {
    const userRoles = this.userRoles();
    return roles.some((role) => userRoles.includes(role));
  }

  public getCurrentUserRoles(): string[] {
    return this.userRoles();
  }
}
