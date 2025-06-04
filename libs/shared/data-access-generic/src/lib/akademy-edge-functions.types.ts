export interface CreateUserRequest {
  agreement_id: string;
}

export interface UserCreationResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    role: string;
    password: string;
    user_metadata: {
      agreement_id: string;
      role_level: number;
      first_name: string;
      last_name: string;
      document_number: string;
      phone: string;
    };
  };
  error?: string;
}

export interface ResetPasswordRequest {
  email: string;
  document_number: string;
  new_password: string;
  phone: string;
  first_name: string;
  last_name: string;
}

export interface PasswordResetResponse {
  success: boolean;
  message: string;
  error?: string;
}

export interface DeactivateUserRequest {
  user_id: string;
}

export interface DeactivateUserResponse {
  success: boolean;
  message: string;
  error?: string;
}

export interface MigrationResponse {
  success: boolean;
  statistics: {
    strapiAgreementsFetched: number;
    supabaseInserted: number;
    supabaseSkippedDuplicates: number;
    supabaseErrors: number;
  };
  data?: {
    inserted: unknown[];
    errors: unknown[];
  };
  error?: string;
}

export interface ApiError {
  error: string;
  status: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status?: number;
}
