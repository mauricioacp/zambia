import { inject, Injectable, signal } from '@angular/core';
import { SupabaseService } from '@zambia/data-access-supabase';
import { FunctionsHttpError, FunctionsRelayError, FunctionsFetchError } from '@supabase/supabase-js';

import {
  CreateUserRequest,
  UserCreationResponse,
  ResetPasswordRequest,
  PasswordResetResponse,
  DeactivateUserRequest,
  DeactivateUserResponse,
  MigrationResponse,
  ApiResponse,
} from './akademy-edge-functions.types';

@Injectable({
  providedIn: 'root',
})
export class AkademyEdgeFunctionsService {
  private supabaseService = inject(SupabaseService);
  private supabase = this.supabaseService.getClient();

  private isLoading = signal(false);
  private lastError = signal<string | null>(null);

  // Response signals for each endpoint
  private migrationData = signal<MigrationResponse | null>(null);
  private userCreationData = signal<UserCreationResponse | null>(null);
  private passwordResetData = signal<PasswordResetResponse | null>(null);
  private userDeactivationData = signal<DeactivateUserResponse | null>(null);

  // Read-only signals
  readonly loading = this.isLoading.asReadonly();
  readonly error = this.lastError.asReadonly();
  readonly migration = this.migrationData.asReadonly();
  readonly userCreation = this.userCreationData.asReadonly();
  readonly passwordReset = this.passwordResetData.asReadonly();
  readonly userDeactivation = this.userDeactivationData.asReadonly();

  private async invokeFunction<T>(
    functionName: string,
    options: {
      body?: Record<string, unknown> | unknown[] | object;
      headers?: Record<string, string>;
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    } = {}
  ): Promise<ApiResponse<T>> {
    this.isLoading.set(true);
    this.lastError.set(null);

    try {
      const { data, error } = await this.supabase.functions.invoke(functionName, {
        body: options.body,
        headers: options.headers,
        method: options.method || 'POST',
      });

      this.isLoading.set(false);

      if (error) {
        let errorMessage = 'Unknown error occurred';
        let status = 500;

        if (error instanceof FunctionsHttpError) {
          try {
            const errorData = await error.context.json();
            errorMessage = errorData.error || errorData.message || 'HTTP error occurred';
            status = error.context.status;
          } catch {
            errorMessage = 'HTTP error occurred';
            status = error.context.status;
          }
        } else if (error instanceof FunctionsRelayError) {
          errorMessage = 'Function relay error occurred';
        } else if (error instanceof FunctionsFetchError) {
          errorMessage = 'Network error occurred';
        } else {
          errorMessage = error.message || 'Unknown error occurred';
        }

        this.lastError.set(errorMessage);
        return {
          error: errorMessage,
          status,
        };
      }

      return { data };
    } catch (error: unknown) {
      this.isLoading.set(false);
      const errorMessage = error instanceof Error ? error.message : 'Unexpected error occurred';
      this.lastError.set(errorMessage);

      return {
        error: errorMessage,
        status: 500,
      };
    }
  }

  async migrate(): Promise<ApiResponse<MigrationResponse>> {
    const response = await this.invokeFunction<MigrationResponse>('akademy-app/migrate', {
      method: 'POST',
      body: {},
    });
    if (response.data) {
      this.migrationData.set(response.data);
    }
    return response;
  }

  async createUser(request: CreateUserRequest): Promise<ApiResponse<UserCreationResponse>> {
    const response = await this.invokeFunction<UserCreationResponse>('akademy-app/create-user', {
      method: 'POST',
      body: request,
    });
    if (response.data) {
      this.userCreationData.set(response.data);
    }
    return response;
  }

  async resetPassword(request: ResetPasswordRequest): Promise<ApiResponse<PasswordResetResponse>> {
    const response = await this.invokeFunction<PasswordResetResponse>('akademy-app/reset-password', {
      method: 'POST',
      body: request,
    });
    if (response.data) {
      this.passwordResetData.set(response.data);
    }
    return response;
  }

  async deactivateUser(request: DeactivateUserRequest): Promise<ApiResponse<DeactivateUserResponse>> {
    const response = await this.invokeFunction<DeactivateUserResponse>('akademy-app/deactivate-user', {
      method: 'POST',
      body: request,
    });
    if (response.data) {
      this.userDeactivationData.set(response.data);
    }
    return response;
  }

  clearError(): void {
    this.lastError.set(null);
  }

  clearData(): void {
    this.migrationData.set(null);
    this.userCreationData.set(null);
    this.passwordResetData.set(null);
    this.userDeactivationData.set(null);
  }
}
