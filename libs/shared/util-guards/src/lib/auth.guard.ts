import { inject } from '@angular/core';
import { CanActivateFn, UrlTree } from '@angular/router';
import { AuthService } from '@zambia/data-access-auth';

export const authGuard: CanActivateFn = (): boolean | UrlTree => {
  const authService = inject(AuthService);

  const isLoading = authService.loading();
  const isAuthenticated = authService.isAuthenticated();

  console.debug(`[AuthGuard] isLoading: ${isLoading}, isAuthenticated: ${isAuthenticated}`);

  return isLoading || isAuthenticated;
};
