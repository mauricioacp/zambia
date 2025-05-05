import { DashboardSmartComponent } from './components/smart/dashboard/dashboard.smart-component';
import { Route } from '@angular/router';
import { authGuard, Role, rolesGuard } from '@zambia/util-roles-permissions';
import { AccessDeniedPageUiComponent } from '@zambia/ui-components';
import { PanelSmartComponent } from './components/smart/main-panel/panel.smart-component';

export const zambiaFeatDashboardRoutes: Route[] = [
  {
    path: '',
    component: DashboardSmartComponent,
    children: [
      {
        path: 'panel',
        component: PanelSmartComponent,
      },
      {
        path: 'showcase',
        loadComponent: () => import('@zambia/ui-components').then((mod) => mod.ShowcaseUiComponent),
      },
      {
        path: 'headquarter',
        canActivate: [authGuard, rolesGuard],
        data: {
          requiredRoles: [Role.SUPERADMIN, Role.HEADQUARTER_MANAGER],
        },
        loadChildren: () => import('@zambia/feat-headquarter').then((mod) => mod.featHeadQuarterRoutes),
      },
      {
        path: 'agreements',
        canActivate: [authGuard, rolesGuard],
        data: {
          requiredRoles: [Role.SUPERADMIN, Role.HEADQUARTER_MANAGER],
        },
        loadChildren: () => import('@zambia/feat-agreements').then((mod) => mod.featAgreementsRoutes),
      },
      {
        path: 'access-denied',
        component: AccessDeniedPageUiComponent,
      },
      {
        path: '**',
        redirectTo: 'panel',
      },
    ],
  },
];
