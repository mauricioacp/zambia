import { inject, Injectable, signal } from '@angular/core';
import { createClient, PostgrestError, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@zambia/types-supabase';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { APP_CONFIG } from '@zambia/util-config';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private readonly supabaseClient: SupabaseClient<Database>;
  private config = inject(APP_CONFIG);
  public loading = signal<boolean>(false);

  public error = signal<Error | null>(null);

  constructor() {
    this.supabaseClient = createClient<Database>(this.config.API_URL, this.config.API_PUBLIC_KEY);
  }

  public getClient(): SupabaseClient<Database> {
    return this.supabaseClient;
  }

  public resetError(): void {
    this.error.set(null);
  }

  protected startOperation(): void {
    this.loading.set(true);
    this.error.set(null);
  }

  protected handleSuccess(): void {
    this.loading.set(false);
    this.error.set(null);
  }

  /**
   * @param error
   * @param context
   */
  protected handleError(error: Error | PostgrestError, context = 'Operation'): void {
    console.error(`Supabase ${context} failed:`, error);
    this.error.set(error instanceof Error ? error : new Error(error['message'] || 'Unknown error'));
    this.loading.set(false);
  }

  /**
   * @template T
   * @param {Observable<T>} operation$
   * @param {string} [context='Operation']
   * @returns {Observable<T>}
   */
  protected wrapObservableOperation<T>(operation$: Observable<T>, context = 'Operation'): Observable<T> {
    this.startOperation();
    return operation$.pipe(
      tap(() => this.handleSuccess()),
      catchError((err) => {
        this.handleError(err, context);
        return throwError(() => err);
      })
    );
  }

  /**
   * @template T
   * @param {Promise<T>} operationPromise
   * @param {string} [context='Operation']
   * @returns {Promise<T | null>}
   */
  protected async wrapAsyncOperation<T>(operationPromise: Promise<T>, context = 'Operation'): Promise<T | null> {
    this.startOperation();
    try {
      const result = await operationPromise;
      this.handleSuccess();
      return result;
    } catch (error) {
      this.handleError(error as Error, context);
      return null;
    }
  }

  /**
   * @template T
   * @param {{ data: T | null; error: PostgrestError | null }} response
   * @param {string} [context='Fetch']
   * @returns {T}
   * @throws {PostgrestError}
   */
  protected handleResponse<T>(response: { data: T | null; error: PostgrestError | null }, context = 'Fetch'): T {
    if (response.error) {
      console.error(`[Supabase Error - ${context}]:`, response.error);
      throw response.error;
    }
    return response.data as T;
  }
}
