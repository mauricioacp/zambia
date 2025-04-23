import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '@zambia/data-access-auth';
import { map, Observable, take } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

export const authGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const loginPath = '/';

  return toObservable(authService.session).pipe(
    take(1),
    map((session) => {
      const isAuthenticated = !!session;
      if (isAuthenticated) {
        return true;
      } else {
        return router.createUrlTree([loginPath]);
      }
    })
  );
};
