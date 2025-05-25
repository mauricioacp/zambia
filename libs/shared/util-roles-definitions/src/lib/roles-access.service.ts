import { computed, inject, Injectable } from '@angular/core';
import { ROLE, ROLE_GROUPS, RoleCode } from './ROLES_CONSTANTS';
import { AuthService } from '@zambia/data-access-auth';

@Injectable({
  providedIn: 'root',
})
export class RolesAccessService {
  private authService = inject(AuthService);
  userRole = computed(() => this.authService.session()?.user.user_metadata['role']);

  getCurrentRole() {
    return this.userRole();
  }

  hasRole(role: RoleCode): boolean {
    return this.userRole() === role;
  }

  hasAnyRole(roles: RoleCode[]): boolean {
    return roles.some((role) => this.hasRole(role));
  }

  hasFullDashboardAccess() {
    const role = this.userRole();
    if (!role) return false;

    const fullAccessRoles = [
      ...ROLE_GROUPS.ADMINISTRATION,
      ...ROLE_GROUPS.LEADERSHIP_TEAM,
      ...ROLE_GROUPS.TOP_MANAGEMENT,
      ...ROLE_GROUPS.COORDINATION_TEAM,
    ];

    return fullAccessRoles.includes(role);
  }

  getNavigationForRole(role: RoleCode | null) {
    if (!role) return [];

    const adminAndManagementRoles = [
      ...ROLE_GROUPS.ADMINISTRATION,
      ...ROLE_GROUPS.TOP_MANAGEMENT,
      ...ROLE_GROUPS.HEADQUARTERS_MANAGEMENT,
      ...ROLE_GROUPS.LEADERSHIP_TEAM,
    ];

    return [
      {
        items: [{ text: 'main_panel', route: 'panel' }],
      },
      /* todo {
        header: 'members',
        roles: [...Object.values(filterRoleGroups('STUDENTS')).flat()],
        items: [
          {
            text: 'board',
            route: 'board',
            roles: [
              ...ROLE_GROUPS.ADMINISTRATION,
              ...ROLE_GROUPS.TOP_MANAGEMENT,
              ...ROLE_GROUPS.LEADERSHIP_TEAM,
              ...ROLE_GROUPS.COORDINATION_TEAM,
            ],
          },
          {
            text: 'students',
            route: 'students',
            roles: [...Object.values(filterRoleGroups('STUDENTS')).flat()],
          },
          {
            text: 'facilitators',
            route: 'facilitators',
            roles: [...Object.values(filterRoleGroups('STUDENTS')).flat()],
          },
          {
            text: 'Acompañantes',
            route: 'companions',
            roles: [...Object.values(filterRoleGroups('STUDENTS')).flat()],
          },
        ],
      },*/
      {
        header: 'management',
        roles: [...adminAndManagementRoles],
        items: [
          {
            text: 'countries',
            route: 'countries',
            roles: [...adminAndManagementRoles],
          },
          {
            text: 'headquarters',
            route: 'headquarters',
            roles: [...adminAndManagementRoles],
          },
          {
            text: 'workshops',
            route: 'workshops',
            roles: [...adminAndManagementRoles],
          },
          {
            text: 'agreements',
            route: 'agreements',
            roles: [...adminAndManagementRoles],
          },
        ],
      },
      /* todo {
        header: 'reports',
        items: [
          {
            text: 'reports',
            route: 'reports',
            roles: [
              ...ROLE_GROUPS.ADMINISTRATION,
              ...ROLE_GROUPS.TOP_MANAGEMENT,
              ...ROLE_GROUPS.LEADERSHIP_TEAM,
              ...ROLE_GROUPS.COORDINATION_TEAM,
              ...ROLE_GROUPS.HEADQUARTERS_MANAGEMENT,
            ],
          },
        ],
      },*/
      /* todo  {
        header: 'my_akademy',
        items: [
          {
            text: 'documents',
            route: 'documents',
            roles: [...Object.values(ROLE_GROUPS).flat()],
          },
        ],
      },*/
    ];
  }
}
