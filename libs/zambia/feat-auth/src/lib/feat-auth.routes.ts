import { Route } from '@angular/router';
import { AuthSmartComponent } from './components/smart/auth/auth.smart-component';
import { ForgotPasswordSmartComponent } from './components/smart/forgot-password/forgot-password.smart-component';

export const featAuthRoutes: Route[] = [
  {
    path: '',
    component: AuthSmartComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordSmartComponent,
  },
];
