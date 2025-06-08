import { Route } from '@angular/router';
import { ShellSmartComponent } from './components/smart/shell/shell.smart-component';
import { authGuard } from '@zambia/util-roles-permissions';

const childRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'dashboard/homepage',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadChildren: () => import('@zambia/feat-dashboard').then((mod) => mod.zambiaFeatDashboardRoutes),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];

export const zambiaFeatShellRoutes: Route[] = [
  {
    path: 'auth',
    loadChildren: () => import('@zambia/feat-auth').then((mod) => mod.featAuthRoutes),
  },
  {
    path: '',
    component: ShellSmartComponent,
    canActivate: [authGuard],
    children: childRoutes,
  },
];
