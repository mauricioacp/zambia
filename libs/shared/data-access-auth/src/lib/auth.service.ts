import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

import { filter, Observable, shareReplay } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { Session } from '@supabase/supabase-js';
import { SupabaseService } from '@zambia/data-access-supabase';
import { tryCatch } from '@zambia/data-access-generic';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);
  readonly #supabaseService = inject(SupabaseService);
  readonly #session = signal<Session | null>(null);
  readonly #loading = signal<boolean>(false);
  readonly #acting = signal<boolean>(false);
  readonly #supabase = this.#supabaseService.getClient();

  readonly acting = this.#acting.asReadonly();
  readonly loading = this.#loading.asReadonly();
  readonly session = this.#session.asReadonly();

  readonly isAuthenticated = computed(() => !!this.#session());

  readonly userName = computed(() => {
    const session = this.session();
    if (!session) return '';
    const email = session.user?.email || '';
    const name = (session.user?.user_metadata?.['name'] as string) || '';
    return name || email.split('@')[0] || 'Usuario';
  });

  readonly initialAuthCheckComplete$: Observable<boolean> = toObservable(this.loading).pipe(
    filter((loading) => !loading),
    shareReplay(1)
  );

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
  }

  async signIn(email: string, password: string): Promise<boolean> {
    this.#acting.set(true);
    this.#loading.set(true);

    const { data } = await tryCatch(() =>
      this.#supabase.auth.signInWithPassword({
        email,
        password,
      })
    );

    this.#acting.set(false);
    this.#loading.set(false);

    return !!data;
  }

  async signOut() {
    this.#acting.set(true);
    return this.#supabase.auth.signOut().then((v) => {
      this.#acting.set(false);
      this.router.navigate(['/']);
      return v;
    });
  }
}
