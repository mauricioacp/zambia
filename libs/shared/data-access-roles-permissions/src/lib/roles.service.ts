import { computed, inject, Injectable } from '@angular/core';
import { AuthService } from '@zambia/data-access-auth';
import { ROLE, RoleCode } from '@zambia/util-roles-definitions';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private authService = inject(AuthService);
  userRole = computed(() => this.authService.session()?.user.user_metadata['role']);
  userRoleLevel = computed(() => this.authService.session()?.user.user_metadata['role_level']);

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
}
