import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { APP_CONFIG } from '@zambia/util-config';

import { AuthService } from '@zambia/data-access-auth';

import { firstValueFrom } from 'rxjs';
import { RolesService } from '@zambia/data-access-roles-permissions';

export const REQUIRED_ROLES = 'requiredRoles';

export const rolesGuard: CanActivateFn = async (route: ActivatedRouteSnapshot) => {
  const roleService = inject(RolesService);
  const authService = inject(AuthService);
  const router = inject(Router);
  const config = inject(APP_CONFIG);
  const forbiddenPath = '/access-denied';
  const requiredRoles = route.data[REQUIRED_ROLES] as string[] | undefined;

  await firstValueFrom(authService.initialAuthCheckComplete$);

  if (!requiredRoles || requiredRoles.length === 0) {
    console.log('[RolesGuard] No required roles specified for this route. Allowing access.');
    return true;
  }

  const userRole = roleService.userRole();
  const hasRequiredRole = roleService.hasAnyRole(requiredRoles);

  if (hasRequiredRole) {
    console.log('[RolesGuard] User has required role(s). Allowing access.');
    return true;
  } else {
    if (!config.PROD) {
      console.warn(`[RolesGuard] Access denied. Required roles: ${requiredRoles.join(', ')}. User role: ${userRole}`);
    }

    await router.navigate([forbiddenPath]);
    return false;
  }
};
