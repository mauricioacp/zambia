import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '@zambia/shared/data-access-auth';
import { Observable, filter, map, of, switchMap, take, tap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

/**
 * Guard that checks if the user is authenticated
 * Redirects to the login page if not authenticated
 * Handles the initial loading state of the AuthService
 *
 * @param route The activated route snapshot
 * @param state The router state snapshot
 * @returns An Observable, Promise, or boolean indicating if activation is allowed
 */
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> | Promise<boolean> | boolean => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const loginPath = '/login';

  // Use toObservable to react to signal changes, including the initial loading state
  return toObservable(authService.isLoading).pipe(
    take(1), // Check loading state once initially
    switchMap(isLoading => {
      if (isLoading) {
        // If still loading, wait for the loading state to become false
        console.log('[AuthGuard] Auth state loading, waiting...');
        return toObservable(authService.isLoading).pipe(
          filter(loading => !loading), // Wait until loading is false
          take(1), // Take the first emission where loading is false
          map(() => authService.isAuthenticated()) // Check auth status *after* loading completes
        );
      } else {
        // If not loading, check authentication status directly
        return of(authService.isAuthenticated());
      }
    }),
    tap(isAuthenticated => {
      console.log(`[AuthGuard] Check complete. Authenticated: ${isAuthenticated}`);
      if (!isAuthenticated) {
        console.log('[AuthGuard] User not authenticated. Redirecting to login.');
        // Store the attempted URL for redirection after login
        const returnUrl = state.url;
        router.navigate([loginPath], { queryParams: { returnUrl } });
      }
    })
  );
};
