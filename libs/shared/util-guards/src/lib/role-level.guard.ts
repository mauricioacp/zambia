import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AuthService } from '@zambia/data-access-auth';
import { RolesService } from '@zambia/data-access-roles-permissions';
import { APP_CONFIG } from '@zambia/util-config';
import { RoleCode } from './GUARDS_CONSTANTS';

export const REQUIRED_ROLE_LEVEL = 'requiredRoleLevel';

/**
 * Route guard that checks if the user has a role with a level equal to or higher than the specified role.
 *
 * Usage in route configuration:
 * ```typescript
 * {
 *   path: 'admin-dashboard',
 *   component: AdminDashboardComponent,
 *   canActivate: [roleLevelGuard],
 *   data: { requiredRoleLevel: 'headquarter_manager' }
 * }
 * ```
 */
export const roleLevelGuard: CanActivateFn = async (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const rolesService = inject(RolesService);
  const router = inject(Router);
  const config = inject(APP_CONFIG);
  const forbiddenPath = '/access-denied';
  const requiredRoleLevel = route.data[REQUIRED_ROLE_LEVEL] as RoleCode | undefined;

  await firstValueFrom(authService.initialAuthCheckComplete$);

  if (!requiredRoleLevel) {
    console.log('[RoleLevelGuard] No required role level specified for this route. Allowing access.');
    return true;
  }

  const hasRequiredLevel = rolesService.hasRoleLevelOrHigher(requiredRoleLevel);

  if (hasRequiredLevel) {
    console.log(`[RoleLevelGuard] User has role level equal to or higher than ${requiredRoleLevel}. Allowing access.`);
    return true;
  } else {
    if (!config.PROD) {
      console.warn(
        `[RoleLevelGuard] Access denied. Required role level: ${requiredRoleLevel}. User's highest role level: ${rolesService.getUserRoleLevel()}`
      );
    }

    await router.navigate([forbiddenPath]);
    return false;
  }
};
