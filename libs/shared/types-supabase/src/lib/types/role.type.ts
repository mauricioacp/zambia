import { Json, Tables, TablesInsert, TablesUpdate } from './supabase.type';

/**
 * Type representing a Role entity from the database
 */
export type Role = Tables<'roles'>;

/**
 * Type for inserting a new Role
 */
export type RoleInsert = TablesInsert<'roles'>;

/**
 * Type for updating an existing Role
 */
export type RoleUpdate = TablesUpdate<'roles'>;

/**
 * Type for Role status
 */
export type RoleStatus = 'active' | 'inactive';

/**
 * Type for Role permissions
 */
export interface RolePermissions {
  canViewDashboard?: boolean;
  canManageUsers?: boolean;
  canManageRoles?: boolean;
  canManageAgreements?: boolean;
  canManageEvents?: boolean;
  canManageWorkshops?: boolean;
  canManageHeadquarters?: boolean;
  canManageSeasons?: boolean;
  canManageStudents?: boolean;
  canManageCollaborators?: boolean;
  canManageProcesses?: boolean;
  canExportData?: boolean;
  canImportData?: boolean;
  canApproveAgreements?: boolean;
  canRejectAgreements?: boolean;
  modules?: {
    [key: string]: {
      read?: boolean;
      write?: boolean;
      delete?: boolean;
      approve?: boolean;
    };
  };
}

/**
 * View model for Role with additional UI-specific properties
 */
export interface RoleViewModel extends Role {
  isSelected?: boolean;
  typedPermissions?: RolePermissions;
  usersCount?: number;
}

/**
 * Helper function to parse the JSON permissions field into a typed RolePermissions
 * @param permissionsJson The JSON permissions field from the database
 * @returns A typed RolePermissions object
 */
export function parseRolePermissions(permissionsJson: Json | null): RolePermissions | null {
  if (!permissionsJson) return null;

  try {
    return permissionsJson as RolePermissions;
  } catch (error) {
    console.error('Error parsing role permissions:', error);
    return null;
  }
}
