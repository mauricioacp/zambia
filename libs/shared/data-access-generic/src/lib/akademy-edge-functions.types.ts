export interface CreateUserRequest {
  agreement_id: string;
}

export interface UserCreationResponse {
  user_id: string;
  email: string;
  password: string;
  headquarter_name: string;
  country_name: string;
  season_name: string;
  role_name: string;
  phone: string;
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
