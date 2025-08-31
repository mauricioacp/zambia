import { DashboardSmartComponent } from './components/smart/dashboard/dashboard.smart-component';
import { Route } from '@angular/router';

import { AccessDeniedPageUiComponent, ShowcaseUiComponent } from '@zambia/ui-components';
import { PanelSmartComponent } from './components/smart/main-panel/panel.smart-component';
import { authGuard, roleGuard } from '@zambia/util-roles-permissions';
import { getRouteDataFromNavigation } from '@zambia/util-roles-definitions';

export const zambiaFeatDashboardRoutes: Route[] = [
  {
    path: '',
    component: DashboardSmartComponent,
    canActivate: [authGuard, roleGuard],
    children: [
      {
        path: '',
        redirectTo: 'homepage',
        pathMatch: 'full',
      },
      {
        path: 'homepage',
        loadChildren: () => import('@zambia/feat-home').then((mod) => mod.featHomeRoutes),
      },
      {
        path: 'profile',
        loadChildren: () => import('@zambia/feat-profile').then((mod) => mod.featProfileRoutes),
      },
      {
        path: 'panel',
        data: getRouteDataFromNavigation('/dashboard/panel'),
        component: PanelSmartComponent,
      },
      {
        path: 'showcase',
        data: {
          groups: ['ADMINISTRATION', 'TOP_MANAGEMENT', 'LEADERSHIP_TEAM'],
        },
        component: ShowcaseUiComponent,
      },
      {
        path: 'countries',
        data: getRouteDataFromNavigation('/dashboard/countries'),
        loadChildren: () => import('@zambia/feat-countries').then((mod) => mod.featCountriesRoutes),
      },
      {
        path: 'headquarters',
        data: getRouteDataFromNavigation('/dashboard/headquarters'),
        loadChildren: () => import('@zambia/feat-headquarter').then((mod) => mod.featHeadQuarterRoutes),
      },
      {
        path: 'agreements',
        data: getRouteDataFromNavigation('/dashboard/agreements'),
        loadChildren: () => import('@zambia/feat-agreements').then((mod) => mod.featAgreementsRoutes),
      },
      {
        path: 'workshops',
        data: getRouteDataFromNavigation('/dashboard/workshops'),
        loadChildren: () => import('@zambia/feat-workshops').then((mod) => mod.featWorkshopsRoutes),
      },
      {
        path: 'students',
        data: getRouteDataFromNavigation('/dashboard/students'),
        loadChildren: () => import('@zambia/feat-students').then((mod) => mod.featStudentsRoutes),
      },
      {
        path: 'collaborators',
        data: getRouteDataFromNavigation('/dashboard/collaborators'),
        loadChildren: () => import('@zambia/feat-students').then((mod) => mod.featStudentsRoutes),
      },
      {
        path: 'organizational-health',
        data: getRouteDataFromNavigation('/dashboard/organizational-health'),
        loadChildren: () => import('@zambia/feat-students').then((mod) => mod.featStudentsRoutes),
      },
      {
        path: 'access-denied',
        component: AccessDeniedPageUiComponent,
      },
      {
        path: '**',
        redirectTo: 'homepage',
      },
    ],
  },
];
