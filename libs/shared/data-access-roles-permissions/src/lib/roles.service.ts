import { computed, inject, Injectable } from '@angular/core';
import { AuthService } from '@zambia/data-access-auth';
import { filterRoleGroups, ROLE, ROLE_GROUPS, RoleCode } from '@zambia/util-roles-definitions';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private authService = inject(AuthService);
  userRole = computed(() => this.authService.session()?.user.user_metadata['role']);

  public hasRole(role: RoleCode): boolean {
    return this.userRole() === role;
  }

  getWelcomeText() {
    /* todo this messages should be keys and then translated in the i18n json.*/
    if (this.hasRole(ROLE.SUPERADMIN)) {
      return 'Como Superadministrador, tienes acceso sin restricciones para gestionar acuerdos, usuarios, sedes y configuraciones del sistema en toda la plataforma.';
    } else if (this.hasRole(ROLE.GENERAL_DIRECTOR)) {
      return 'Como Director General, puedes ver datos completos y reportes de todas las sedes, monitorear el rendimiento general y gestionar operaciones de alto nivel.';
    } else if (this.hasRole(ROLE.HEADQUARTER_MANAGER)) {
      return 'Como Director de Sede, puedes gestionar estudiantes, colaboradores y actividades específicas de tu sede asignada.';
    } else {
      return 'Bienvenido! Explora las funciones disponibles según tu rol asignado.';
    }
  }

  hasAnyRole(roles: string[]) {
    return roles.some((role) => this.hasRole(role as RoleCode));
  }

  allowedNavigationsByRole() {
    return [
      {
        items: [{ icon: 'newspaper', text: 'main_panel', route: '' }],
      },
      {
        header: 'members',
        roles: [...Object.values(filterRoleGroups('STUDENTS')).flat()],
        items: [
          {
            icon: 'user-round-check',
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
            icon: 'circle-user-round',
            text: 'students',
            route: 'students',
            roles: [...Object.values(filterRoleGroups('STUDENTS')).flat()],
          },
          {
            icon: 'users-round',
            text: 'facilitators',
            route: 'facilitators',
            roles: [...Object.values(filterRoleGroups('STUDENTS')).flat()],
          },
          {
            icon: 'users-round',
            text: 'Acompañantes',
            route: 'companions',
            roles: [...Object.values(filterRoleGroups('STUDENTS')).flat()],
          },
        ],
      },
      {
        header: 'reports',
        items: [
          {
            icon: 'chart-area',
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
      },
      {
        header: 'my_akademy',
        items: [
          {
            icon: 'paperclip',
            text: 'documents',
            route: 'documents',
            roles: [...Object.values(ROLE_GROUPS).flat()],
          },
        ],
      },
    ];
  }
}
