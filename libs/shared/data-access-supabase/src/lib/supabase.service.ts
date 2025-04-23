import { Injectable, signal } from '@angular/core';
import { createClient, PostgrestError, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@zambia/types-supabase';
import { catchError, Observable, tap, throwError } from 'rxjs';

/**
 * Base service for Supabase client initialization and common operations
 * This service provides the Supabase client instance and common methods
 * for interacting with Supabase.
 */
@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabaseClient: SupabaseClient<Database>;

  // Signal for tracking loading state
  public loading = signal<boolean>(false);

  // Signal for tracking error state
  public error = signal<Error | null>(null);

  constructor() {
    // Initialize Supabase client
    // Note: In a real application, these values should come from environment variables
    const supabaseUrl = 'https://your-project-url.supabase.co';
    const supabaseKey = 'your-anon-key';

    this.supabaseClient = createClient<Database>(supabaseUrl, supabaseKey);
  }

  /**
   * Get the Supabase client instance
   * @returns The Supabase client instance
   */
  public getClient(): SupabaseClient<Database> {
    return this.supabaseClient;
  }

  /**
   * Reset error state
   */
  public resetError(): void {
    this.error.set(null);
  }

  /**
   * Start an operation by setting loading state
   */
  protected startOperation(): void {
    this.loading.set(true);
    this.error.set(null);
  }

  /**
   * Handle successful operation
   * @param data Optional data from the operation
   */
  protected handleSuccess<T>(data?: T): void {
    this.loading.set(false);
    this.error.set(null);
  }

  /**
   * Handle errors from Supabase operations
   * @param error The error to handle
   * @param context Optional context for the error
   */
  protected handleError(error: Error | PostgrestError, context = 'Operation'): void {
    console.error(`Supabase ${context} failed:`, error);
    this.error.set(error instanceof Error ? error : new Error(error['message'] || 'Unknown error'));
    this.loading.set(false);
  }

  /**
   * Wraps an Observable operation with loading and error handling.
   * @template T
   * @param {Observable<T>} operation$ - The Observable performing the Supabase call.
   * @param {string} [context='Operation'] - Context for error handling.
   * @returns {Observable<T>} Observable with integrated state handling.
   */
  protected wrapObservableOperation<T>(operation$: Observable<T>, context = 'Operation'): Observable<T> {
    this.startOperation();
    return operation$.pipe(
      tap((data) => this.handleSuccess(data)),
      catchError((err) => {
        this.handleError(err, context);
        return throwError(() => err); // Rethrow after handling state
      })
    );
  }

  /**
   * Wraps an async (Promise-based) Supabase operation with loading and error handling.
   * @template T
   * @param {Promise<T>} operationPromise - The Promise performing the Supabase call.
   * @param {string} [context='Operation'] - Context for error handling.
   * @returns {Promise<T | null>} Promise resolving with data or null on error.
   */
  protected async wrapAsyncOperation<T>(operationPromise: Promise<T>, context = 'Operation'): Promise<T | null> {
    this.startOperation();
    try {
      const result = await operationPromise;
      this.handleSuccess(result);
      return result;
    } catch (error) {
      this.handleError(error as Error, context);
      return null; // Indicate failure
    }
  }

  /**
   * Helper to extract data and handle potential PostgrestErrors from Supabase responses.
   * Throws an error if the Supabase call itself resulted in an error.
   * @template T
   * @param {{ data: T | null; error: PostgrestError | null }} response - The Supabase response object.
   * @param {string} [context='Fetch'] - Context for potential error messages.
   * @returns {T} The data from the response.
   * @throws {PostgrestError} If the Supabase response contains an error.
   */
  protected handleResponse<T>(response: { data: T | null; error: PostgrestError | null }, context = 'Fetch'): T {
    if (response.error) {
      console.error(`[Supabase Error - ${context}]:`, response.error);
      throw response.error; // Let the main handler catch this
    }
    return response.data as T; // Cast needed as data can be null
  }
}
