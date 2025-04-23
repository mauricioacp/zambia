import { DashboardSmartComponent } from './components/smart/dashboard/dashboard.smart-component';
import { Route } from '@angular/router';
import { authGuard, rolesGuard } from '@zambia/util-roles-permissions';

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
    ],
  },
];
