import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '@zambia/data-access-auth';

export const authGuard: CanActivateFn = (): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const loginPath = '/login';

  const isLoading = authService.loading();
  const isAuthenticated = authService.isAuthenticated();

  console.debug(`[AuthGuard] isLoading: ${isLoading}, isAuthenticated: ${isAuthenticated}`);

  if (isLoading) {
    return true;
  }

  if (isAuthenticated) {
    return true;
  } else {
    return router.createUrlTree([loginPath]);
  }
};
