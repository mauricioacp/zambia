import { Tables, TablesInsert, TablesUpdate } from './supabase.type';

/**
 * Type representing a Collaborator entity from the database
 */
export type Collaborator = Tables<'collaborators'>;

/**
 * Type for inserting a new Collaborator
 */
export type CollaboratorInsert = TablesInsert<'collaborators'>;

/**
 * Type for updating an existing Collaborator
 */
export type CollaboratorUpdate = TablesUpdate<'collaborators'>;

/**
 * Type for Collaborator status
 */
export type CollaboratorStatus = 'active' | 'inactive' | 'pending' | 'suspended';

/**
 * View model for Collaborator with additional UI-specific properties
 */
export interface CollaboratorViewModel extends Collaborator {
  isSelected?: boolean;
  displayName?: string;
  roleName?: string;
  headquarterName?: string;
  agreementDetails?: {
    name: string | null;
    last_name: string | null;
    email: string;
  };
}

/**
 * Type for Collaborator with related entities
 */
export interface CollaboratorWithRelations extends Collaborator {
  role?: {
    id: string;
    name: string;
    code: string;
  } | null;
  headquarter?: {
    id: string;
    name: string;
  } | null;
  agreement?: {
    id: string;
    name: string | null;
    last_name: string | null;
    email: string;
  } | null;
}
