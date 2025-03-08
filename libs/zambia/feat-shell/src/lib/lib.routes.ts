import { Route } from '@angular/router';
import { ShellSmartComponent } from './components/smart/shell/shell.smart-component';

const childRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  // {
  //   path: 'dashboard',
  //   loadChildren: () =>
  //     import('@simplified/influencer-feat-dashboard').then(
  //       (mod) => mod.influencerFeatDashboardRoutes
  //     ),
  // },
];

export const zambiaFeatShellRoutes: Route[] = [
  {
    path: '',
    component: ShellSmartComponent,
    children: childRoute,
  },
];
