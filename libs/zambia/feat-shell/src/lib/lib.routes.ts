import { Route } from '@angular/router';
import { ShellSmartComponent } from './components/smart/shell/shell.smart-component';

const childRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'dashboard',
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
    path: '',
    component: ShellSmartComponent,
    children: childRoutes,
  },
];
