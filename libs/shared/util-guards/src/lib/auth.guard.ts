import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '@zambia/data-access-auth';
import { toObservable } from '@angular/core/rxjs-interop';
import { map, filter, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

export const authGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return toObservable(authService.loading).pipe(
    filter((loading) => !loading),
    take(1),
    map(() => {
      const isAuthenticated = authService.isAuthenticated();
      console.debug(`[AuthGuard] isAuthenticated: ${isAuthenticated}`);

      if (!isAuthenticated) {
        return router.createUrlTree(['/auth']);
      }

      return true;
    })
  );
};
