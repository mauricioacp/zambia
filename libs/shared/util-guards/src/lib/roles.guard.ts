import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot, UrlTree } from '@angular/router';
import { REQUIRED_ROLES } from './GUARDS_CONSTANTS';

export const rolesGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  state: RouterStateSnapshot
): boolean | UrlTree => {
  // const authService = inject(AuthService);
  // const router = inject(Router);
  console.log(state);

  const requiredRoles = route.data[REQUIRED_ROLES] as string[] | undefined;
  // const userRoles: string[] = authService.getCurrentUserRoles();

  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  // const hasRequiredRole = userRoles.some((role) => requiredRoles.includes(role));

  // if (hasRequiredRole) {
  //   return true;
  // } else {
  //   console.warn(
  //     `Acceso denegado. Roles requeridos: ${requiredRoles.join(', ')}. Roles del usuario: ${userRoles.join(', ')}`
  //   );
  //
  //   return router.createUrlTree(['/access-denied']);
  // }
  return true;
};
