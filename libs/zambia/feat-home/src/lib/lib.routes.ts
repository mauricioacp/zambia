import { Route } from '@angular/router';

export const featHomeRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./components/smart/home/home.smart-component').then((m) => m.HomeSmartComponent),
  },
];
