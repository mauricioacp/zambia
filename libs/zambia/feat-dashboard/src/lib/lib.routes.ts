import { DashboardSmartComponent } from './components/smart/dashboard/dashboard.smart-component';
import { Route } from '@angular/router';

import { AccessDeniedPageUiComponent, ShowcaseUiComponent } from '@zambia/ui-components';
import { PanelSmartComponent } from './components/smart/main-panel/panel.smart-component';
import { authGuard, rolesGuard } from '@zambia/util-roles-permissions';
import { ROLE } from '@zambia/util-roles-definitions';

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
        component: ShowcaseUiComponent,
      },
      {
        path: 'countries',
        canActivate: [authGuard, rolesGuard],
        data: {
          requiredRoles: [ROLE.SUPERADMIN, ROLE.HEADQUARTER_MANAGER],
        },
        loadChildren: () => import('@zambia/feat-countries').then((mod) => mod.featCountriesRoutes),
      },
      {
        path: 'headquarters',
        canActivate: [authGuard, rolesGuard],
        data: {
          requiredRoles: [ROLE.SUPERADMIN, ROLE.HEADQUARTER_MANAGER],
        },
        loadChildren: () => import('@zambia/feat-headquarter').then((mod) => mod.featHeadQuarterRoutes),
      },
      {
        path: 'agreements',
        canActivate: [authGuard, rolesGuard],
        data: {
          requiredRoles: [ROLE.SUPERADMIN, ROLE.HEADQUARTER_MANAGER],
        },
        loadChildren: () => import('@zambia/feat-agreements').then((mod) => mod.featAgreementsRoutes),
      },
      {
        path: 'workshops',
        canActivate: [authGuard, rolesGuard],
        data: {
          requiredRoles: [ROLE.SUPERADMIN, ROLE.HEADQUARTER_MANAGER, ROLE.FACILITATOR],
        },
        loadChildren: () => import('@zambia/feat-workshops').then((mod) => mod.featWorkshopsRoutes),
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
