import { Route } from '@angular/router';
import { WorkshopsListSmartComponent } from './components/smart/workshops-list.smart-component';
import { WorkshopDetailSmartComponent } from './components/smart/workshop-detail.smart-component';

export const featWorkshopsRoutes: Route[] = [
  {
    path: '',
    component: WorkshopsListSmartComponent,
  },
  {
    path: ':workshopId',
    component: WorkshopDetailSmartComponent,
  },
];
