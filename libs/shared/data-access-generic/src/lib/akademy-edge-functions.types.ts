import { z } from 'zod';

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

export const SendEmailRequest = z.object({
  userId: z.string(),
  recipient: z.string().email(),
  subject: z.string(),
  msgBody: z.string(),
});

export type SendEmailRequest = z.infer<typeof SendEmailRequest>;

export const SendEmailResponse = z.object({
  data: z.string(),
  ok: z.boolean(),
});

export type SendEmailResponse = z.infer<typeof SendEmailResponse>;

export interface ChangeRoleRequest {
  agreement_id: string;
  new_role_id: string;
}

export interface ChangeRoleResponse {
  message: string;
  agreement_id: string;
  user_id: string;
  old_role: {
    id: string;
    code: string;
    name: string;
    level: number;
  };
  new_role: {
    id: string;
    code: string;
    name: string;
    level: number;
  };
}
