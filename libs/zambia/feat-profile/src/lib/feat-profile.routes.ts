import { Route } from '@angular/router';
import { authGuard } from '@zambia/util-roles-permissions';


export const featProfileRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./components/smart/profile.smart-component').then(
        (m) => m.ProfileSmartComponent
      ),
    canActivate: [authGuard],
  },
];
