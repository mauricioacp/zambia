import { Tables, TablesInsert, TablesUpdate } from './supabase.type';

/**
 * Type representing an Agreement entity from the database
 */
export type Agreement = Tables<'agreements'>;

/**
 * Type for inserting a new Agreement
 */
export type AgreementInsert = TablesInsert<'agreements'>;

/**
 * Type for updating an existing Agreement
 */
export type AgreementUpdate = TablesUpdate<'agreements'>;

/**
 * Type representing an Agreement with its associated roles
 */
export type AgreementWithRoles = Tables<'agreement_with_roles'>;

/**
 * Type for Agreement status
 */
export type AgreementStatus = 'pending' | 'approved' | 'rejected' | 'inactive';

/**
 * Type for Agreement role
 */
export type AgreementRole = {
  agreement_id: string;
  role_id: string;
  created_at?: string | null;
};

/**
 * View model for Agreement with additional UI-specific properties
 */
export interface AgreementViewModel extends Agreement {
  isSelected?: boolean;
  displayName?: string;
  roleNames?: string[];
}
