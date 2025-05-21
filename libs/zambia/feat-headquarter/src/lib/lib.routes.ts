import { Route } from '@angular/router';
import { HeadquartersListSmartComponent } from './components/smart/headquarters-list.smart-component';
import { HeadquarterDetailSmartComponent } from './components/smart/headquarter-detail.smart-component';

export const featHeadQuarterRoutes: Route[] = [
  {
    path: '',
    component: HeadquartersListSmartComponent,
  },
  {
    path: ':headquarterId',
    component: HeadquarterDetailSmartComponent,
  },
];
