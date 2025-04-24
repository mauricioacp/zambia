import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';

import { REQUIRED_ROLES } from './GUARDS_CONSTANTS';
import { AuthService } from '@zambia/data-access-auth';
import { APP_CONFIG } from '@zambia/util-config';
import { firstValueFrom } from 'rxjs';

export const rolesGuard: CanActivateFn = async (route: ActivatedRouteSnapshot) => {
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

  const userRoles: string[] = authService.getCurrentUserRoles();
  const hasRequiredRole = requiredRoles.some((requiredRole) => userRoles.some((userRole) => userRole === requiredRole));

  if (hasRequiredRole) {
    console.log('[RolesGuard] User has required role(s). Allowing access.');
    return true;
  } else {
    if (!config.PROD) {
      console.warn(
        `[RolesGuard] Access denied. Required roles: ${requiredRoles.join(', ')}. User roles: ${userRoles.join(', ')}`
      );
    }

    await router.navigate([forbiddenPath]);
    return false;
  }
};
