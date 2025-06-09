import { DashboardSmartComponent } from './components/smart/dashboard/dashboard.smart-component';
import { Route } from '@angular/router';

import { AccessDeniedPageUiComponent, ShowcaseUiComponent } from '@zambia/ui-components';
import { PanelSmartComponent } from './components/smart/main-panel/panel.smart-component';
import { authGuard, roleGuard } from '@zambia/util-roles-permissions';

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
        loadChildren: () => import('@zambia/feat-homepage').then((mod) => mod.featHomepageRoutes),
      },
      {
        path: 'profile',
        loadChildren: () => import('@zambia/feat-profile').then((mod) => mod.featProfileRoutes),
      },
      {
        path: 'panel',
        data: {
          groups: ['ADMINISTRATION', 'TOP_MANAGEMENT', 'LEADERSHIP_TEAM'],
        },
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
        data: {
          groups: ['ADMINISTRATION', 'TOP_MANAGEMENT', 'LEADERSHIP_TEAM'],
        },
        loadChildren: () => import('@zambia/feat-countries').then((mod) => mod.featCountriesRoutes),
      },
      {
        path: 'headquarters',
        data: {
          groups: ['ADMINISTRATION', 'TOP_MANAGEMENT', 'LEADERSHIP_TEAM'],
        },
        loadChildren: () => import('@zambia/feat-headquarter').then((mod) => mod.featHeadQuarterRoutes),
      },
      {
        path: 'agreements',
        data: {
          groups: ['ADMINISTRATION', 'TOP_MANAGEMENT', 'LEADERSHIP_TEAM', 'HEADQUARTERS_MANAGEMENT'],
        },
        loadChildren: () => import('@zambia/feat-agreements').then((mod) => mod.featAgreementsRoutes),
      },
      {
        path: 'workshops',
        data: {
          groups: ['ADMINISTRATION', 'TOP_MANAGEMENT', 'LEADERSHIP_TEAM', 'HEADQUARTERS_MANAGEMENT'],
        },
        loadChildren: () => import('@zambia/feat-workshops').then((mod) => mod.featWorkshopsRoutes),
      },
      {
        path: 'students',
        data: {
          groups: ['ADMINISTRATION', 'TOP_MANAGEMENT', 'LEADERSHIP_TEAM'],
        },
        loadChildren: () => import('@zambia/feat-students').then((mod) => mod.featStudentsRoutes),
      },
      {
        path: 'collaborators',
        data: {
          groups: ['ADMINISTRATION', 'TOP_MANAGEMENT', 'LEADERSHIP_TEAM'],
        },
        loadChildren: () => import('@zambia/feat-students').then((mod) => mod.featStudentsRoutes),
      },
      {
        path: 'organizational-health',
        data: {
          groups: ['ADMINISTRATION', 'TOP_MANAGEMENT', 'LEADERSHIP_TEAM'],
        },
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
