import { computed, inject, Injectable } from '@angular/core';
import { AuthService } from '@zambia/data-access-auth';
import { Role, RoleCode } from '@zambia/util-roles-permissions';

/**
 * Service for managing role-based permissions and access control.
 * Provides methods for checking roles, permissions, and role hierarchies.
 */
@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private authService = inject(AuthService);

  // Role hierarchy levels - higher number means higher level of access
  private readonly roleLevels = new Map<RoleCode, number>([
    [Role.SUPERADMIN, 100],
    [Role.GENERAL_DIRECTOR, 90],
    [Role.EXECUTIVE_LEADER, 90],
    [Role.PEDAGOGICAL_LEADER, 80],
    [Role.INNOVATION_LEADER, 80],
    [Role.COMMUNICATION_LEADER, 80],
    [Role.COMMUNITY_LEADER, 80],
    [Role.COORDINATION_LEADER, 80],
    [Role.LEGAL_ADVISOR, 80],
    [Role.COORDINATOR, 70],
    [Role.KONSEJO_MEMBER, 70],
    [Role.HEADQUARTER_MANAGER, 50],
    [Role.PEDAGOGICAL_MANAGER, 40],
    [Role.COMMUNICATION_MANAGER, 40],
    [Role.COMPANION_DIRECTOR, 40],
    [Role.MANAGER_ASSISTANT, 30],
    [Role.COMPANION, 20],
    [Role.FACILITATOR, 20],
    [Role.STUDENT, 1],
  ]);

  // Signal for the current user's role level
  private readonly userRoleLevel = computed(() => {
    const userRoles = this.authService.userRoles();
    if (!userRoles.length) return 0;

    // Get the highest role level the user has
    return Math.max(...userRoles.map((role) => this.roleLevels.get(role as RoleCode) || 0));
  });

  /**
   * Checks if the current user has a specific role
   * @param role The role to check
   * @returns True if the user has the role, false otherwise
   */
  public hasRole(role: RoleCode): boolean {
    return this.authService.hasRole(role);
  }

  /**
   * Checks if the current user has any of the specified roles
   * @param roles Array of roles to check
   * @returns True if the user has any of the roles, false otherwise
   */
  public hasAnyRole(roles: RoleCode[]): boolean {
    return this.authService.hasAnyRole(roles);
  }

  /**
   * Checks if the current user has a role with a level equal to or higher than the specified role
   * @param role The minimum role level required
   * @returns True if the user has a role with equal or higher level, false otherwise
   */
  public hasRoleLevelOrHigher(role: RoleCode): boolean {
    const requiredLevel = this.roleLevels.get(role) || 0;
    return this.userRoleLevel() >= requiredLevel;
  }

  /**
   * Gets the current user's highest role level
   * @returns The highest role level the user has
   */
  public getUserRoleLevel(): number {
    return this.userRoleLevel();
  }

  /**
   * Gets the level of a specific role
   * @param role The role to get the level for
   * @returns The level of the role, or 0 if not found
   */
  public getRoleLevel(role: RoleCode): number {
    return this.roleLevels.get(role) || 0;
  }
}
