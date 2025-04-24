import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

import { distinctUntilChanged, filter, from, map, Observable } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { AuthSession } from '@supabase/supabase-js';
import { SupabaseService } from '@zambia/data-access-supabase';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);
  readonly #supabaseService = inject(SupabaseService);

  readonly #session = signal<AuthSession | null>(null);
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

  public userRoles = computed(() => {
    const user = this.session()?.user;
    if (!user || !user.user_metadata?.['role']) return [];
    return [user.user_metadata['role']];
  });

  constructor() {
    this.#supabase.auth.getSession().then(({ data }) => {
      this.#session.set(data.session);
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
    const v = await this.#supabase.auth.signInWithPassword({
      email,
      password,
    });
    this.#acting.set(false);
    return v;
  }

  public async signOut() {
    this.#acting.set(true);
    this.#session.set(null);
    return this.#supabase.auth.signOut().then((v) => {
      this.#acting.set(false);
      this.router.navigate(['/']);
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
