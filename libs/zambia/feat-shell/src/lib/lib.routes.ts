import { Route } from '@angular/router';
import { ShellSmartComponent } from './components/smart/shell/shell.smart-component';
import { AuthSmartComponent } from '@zambia/feat-auth';

const childRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadChildren: () => import('@zambia/feat-dashboard').then((mod) => mod.zambiaFeatDashboardRoutes),
  },
  {
    path: 'login',
    component: AuthSmartComponent,
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];

export const zambiaFeatShellRoutes: Route[] = [
  {
    path: '',
    component: ShellSmartComponent,
    children: childRoutes,
  },
];
