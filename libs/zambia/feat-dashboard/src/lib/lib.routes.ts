import { DashboardSmartComponent } from './components/smart/dashboard/dashboard.smart-component';
import { Route } from '@angular/router';

import { AccessDeniedPageUiComponent, ShowcaseUiComponent } from '@zambia/ui-components';
import { PanelSmartComponent } from './components/smart/main-panel/panel.smart-component';
import { authGuard, roleGuard } from '@zambia/util-roles-permissions';

export const zambiaFeatDashboardRoutes: Route[] = [
  {
    path: '',
    component: DashboardSmartComponent,
    children: [
      {
        path: 'panel',
        canActivate: [authGuard, roleGuard],
        data: {
          groups: ['ADMINISTRATION', 'TOP_MANAGEMENT', 'LEADERSHIP_TEAM'],
        },
        component: PanelSmartComponent,
      },
      {
        path: 'showcase',
        canActivate: [authGuard, roleGuard],
        data: {
          groups: ['ADMINISTRATION', 'TOP_MANAGEMENT', 'LEADERSHIP_TEAM'],
        },
        component: ShowcaseUiComponent,
      },
      {
        path: 'countries',
        canActivate: [authGuard, roleGuard],
        data: {
          groups: ['ADMINISTRATION', 'TOP_MANAGEMENT', 'LEADERSHIP_TEAM'],
        },
        loadChildren: () => import('@zambia/feat-countries').then((mod) => mod.featCountriesRoutes),
      },
      {
        path: 'headquarters',
        canActivate: [authGuard, roleGuard],
        data: {
          groups: ['ADMINISTRATION', 'TOP_MANAGEMENT', 'LEADERSHIP_TEAM'],
        },
        loadChildren: () => import('@zambia/feat-headquarter').then((mod) => mod.featHeadQuarterRoutes),
      },
      {
        path: 'agreements',
        canActivate: [authGuard, roleGuard],
        data: {
          groups: ['ADMINISTRATION', 'TOP_MANAGEMENT', 'LEADERSHIP_TEAM', 'HEADQUARTERS_MANAGEMENT'],
        },
        loadChildren: () => import('@zambia/feat-agreements').then((mod) => mod.featAgreementsRoutes),
      },
      {
        path: 'workshops',
        canActivate: [authGuard, roleGuard],
        data: {
          groups: ['ADMINISTRATION', 'TOP_MANAGEMENT', 'LEADERSHIP_TEAM', 'HEADQUARTERS_MANAGEMENT'],
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
