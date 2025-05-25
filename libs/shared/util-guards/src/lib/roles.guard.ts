import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, UrlTree } from '@angular/router';
import { APP_CONFIG } from '@zambia/util-config';
import { AuthService } from '@zambia/data-access-auth';
import { firstValueFrom } from 'rxjs';
import { RoleService } from '@zambia/data-access-roles-permissions';
import { RoleCode, ROLE_GROUP } from '@zambia/util-roles-definitions';

export const roleGuard: CanActivateFn = async (route: ActivatedRouteSnapshot): Promise<boolean | UrlTree> => {
  const roleService = inject(RoleService);
  const authService = inject(AuthService);
  const router = inject(Router);
  const config = inject(APP_CONFIG);
  const forbiddenPath = '/access-denied';

  const requiredRoles = route.data['roles'] as RoleCode[] | undefined;
  const requiredGroups = route.data['groups'] as ROLE_GROUP[] | undefined;

  await firstValueFrom(authService.initialAuthCheckComplete$);

  const userRole = roleService.userRole();

  const hasAccess =
    (!requiredRoles || roleService.hasAnyRole(requiredRoles)) &&
    (!requiredGroups || roleService.isInAnyGroup(requiredGroups));

  if (!hasAccess) {
    if (!config.PROD) {
      console.warn(
        `[RoleGuard] Access denied. Required roles: ${requiredRoles?.join(', ') || 'none'}. Required groups: ${requiredGroups?.join(', ') || 'none'}. User role: ${userRole}`
      );
    }
    return router.createUrlTree([forbiddenPath]);
  }
  return true;
};
