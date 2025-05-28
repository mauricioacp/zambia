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
  phone?: string;
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
  message: string;
  new_password: string;
  user_email: string;
}

export interface DeactivateUserRequest {
  user_id: string;
}

export interface DeactivateUserResponse {
  message: string;
  user_id: string;
}

export interface ProcessedAgreement {
  id: number;
  email: string;
  name: string;
  headquarters: string;
  role: string;
  status: 'inserted' | 'updated' | 'skipped';
}

export interface MigrationResponse {
  success: boolean;
  statistics: {
    strapiTotal: number;
    supabaseInserted: number;
    supabaseUpdated: number;
    duplicatesSkipped: number;
  };
  processedData: ProcessedAgreement[];
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  services: string[];
}

export interface ApiStatusResponse {
  status: string;
  message: string;
  timestamp: string;
  endpoints: string[];
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
