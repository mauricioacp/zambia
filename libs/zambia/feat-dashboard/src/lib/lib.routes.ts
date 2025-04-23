import { DashboardSmartComponent } from './components/smart/dashboard/dashboard.smart-component';
import { Route } from '@angular/router';
import { authGuard, rolesGuard } from '@zambia/util-roles-permissions';
import { AccessDeniedPageUiComponent } from '@zambia/ui-components';

export const zambiaFeatDashboardRoutes: Route[] = [
  {
    path: '',
    component: DashboardSmartComponent,
    children: [
      {
        path: 'headquarter',
        canActivate: [authGuard, rolesGuard],
        data: {
          requiredRoles: ['admin', 'editor'],
        },
        loadChildren: () => import('@zambia/feat-headquarter').then((mod) => mod.featHeadQuarterRoutes),
      },
      {
        path: 'access-denied',
        component: AccessDeniedPageUiComponent,
      },
      {
        path: '**',
        redirectTo: 'access-denied',
      },
    ],
  },
];
