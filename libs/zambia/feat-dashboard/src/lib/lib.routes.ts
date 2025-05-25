import { DashboardSmartComponent } from './components/smart/dashboard/dashboard.smart-component';
import { Route } from '@angular/router';

import { AccessDeniedPageUiComponent, ShowcaseUiComponent } from '@zambia/ui-components';
import { PanelSmartComponent } from './components/smart/main-panel/panel.smart-component';
import { authGuard, rolesGuard } from '@zambia/util-roles-permissions';
import { ROLE, ROLE_GROUPS } from '@zambia/util-roles-definitions';

export const zambiaFeatDashboardRoutes: Route[] = [
  {
    path: '',
    component: DashboardSmartComponent,
    canActivate: [authGuard],
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
        canActivate: [rolesGuard],
        data: {
          requiredRoles: [
            ROLE.SUPERADMIN,
            ...ROLE_GROUPS.LEADERSHIP_TEAM,
            ...ROLE_GROUPS.TOP_MANAGEMENT,
            ...ROLE_GROUPS.COORDINATION_TEAM,
          ],
        },
        loadChildren: () => import('@zambia/feat-countries').then((mod) => mod.featCountriesRoutes),
      },
      {
        path: 'headquarters',
        canActivate: [rolesGuard],
        data: {
          requiredRoles: [
            ROLE.SUPERADMIN,
            ...ROLE_GROUPS.LEADERSHIP_TEAM,
            ...ROLE_GROUPS.TOP_MANAGEMENT,
            ...ROLE_GROUPS.COORDINATION_TEAM,
          ],
        },
        loadChildren: () => import('@zambia/feat-headquarter').then((mod) => mod.featHeadQuarterRoutes),
      },
      {
        path: 'agreements',
        canActivate: [rolesGuard],
        data: {
          requiredRoles: [
            ROLE.SUPERADMIN,
            ...ROLE_GROUPS.LEADERSHIP_TEAM,
            ...ROLE_GROUPS.TOP_MANAGEMENT,
            ...ROLE_GROUPS.COORDINATION_TEAM,
            ...ROLE_GROUPS.HEADQUARTERS_MANAGEMENT,
          ],
        },
        loadChildren: () => import('@zambia/feat-agreements').then((mod) => mod.featAgreementsRoutes),
      },
      {
        path: 'workshops',
        canActivate: [rolesGuard],
        data: {
          requiredRoles: [
            ROLE.SUPERADMIN,
            ...ROLE_GROUPS.LEADERSHIP_TEAM,
            ...ROLE_GROUPS.TOP_MANAGEMENT,
            ...ROLE_GROUPS.COORDINATION_TEAM,
            ...ROLE_GROUPS.HEADQUARTERS_MANAGEMENT,
          ],
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
