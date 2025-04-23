import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '@zambia/shared/data-access-auth';
import { REQUIRED_ROLES } from './GUARDS_CONSTANTS';
import { Observable, combineLatest, filter, map, of, switchMap, take, tap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

/**
 * Guard that checks if the user has the required roles to access a route
 * Redirects to the access denied page if the user doesn't have the required roles
 * Handles the initial loading state of the AuthService
 *
 * @param route The activated route snapshot
 * @param state The router state snapshot
 * @returns An Observable, Promise, or boolean indicating if activation is allowed
 */
export const rolesGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const forbiddenPath = '/access-denied';
  const loginPath = '/login';

  // Get the required roles from the route data
  const requiredRoles = route.data[REQUIRED_ROLES] as string[] | undefined;

  // If no roles are required, allow access
  if (!requiredRoles || requiredRoles.length === 0) {
    console.log('[RolesGuard] No required roles specified for this route. Allowing access.');
    return true;
  }

  console.log(`[RolesGuard] Required roles: ${requiredRoles.join(', ')}`);

  // Combine waiting for auth loading and getting the current user
  return combineLatest([
    toObservable(authService.isLoading).pipe(filter(loading => !loading), take(1)), // Wait until not loading
    toObservable(authService.user).pipe(take(1)) // Get the user once loading is done
  ]).pipe(
    switchMap(([_, user]) => {
      if (!user) {
        console.log('[RolesGuard] User not authenticated. Redirecting to login.');
        return of(router.createUrlTree([loginPath], { queryParams: { returnUrl: state.url } }));
      }

      console.log(`[RolesGuard] User authenticated. Checking roles...`);

      // Get the user's roles
      const userRoles: string[] = authService.getCurrentUserRoles();
      console.log(`[RolesGuard] User roles: ${userRoles.join(', ')}`);

      // Check if the user has any of the required roles
      const hasRequiredRole = requiredRoles.some(requiredRole =>
        userRoles.some(userRole => userRole.toUpperCase() === requiredRole.toUpperCase())
      );

      if (hasRequiredRole) {
        console.log('[RolesGuard] User has required role(s). Allowing access.');
        return of(true);
      } else {
        console.warn(
          `[RolesGuard] Access denied. Required roles: ${requiredRoles.join(', ')}. User roles: ${userRoles.join(', ')}`
        );
        return of(router.createUrlTree([forbiddenPath]));
      }
    })
  );
};
