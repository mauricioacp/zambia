import { Route } from '@angular/router';
import { StudentProgressSmartComponent } from './components/smart/student-progress.smart-component';
import { CollaborationDemographicsSmartComponent } from './components/smart/collaboration-demographics.smart-component';
import { OrganizationalHealthSmartComponent } from './components/smart/organizational-health.smart-component';

export const featStudentsRoutes: Route[] = [
  {
    path: 'progress',
    component: StudentProgressSmartComponent,
    title: 'Student Progress | Zambia',
  },
  {
    path: 'demographics',
    component: CollaborationDemographicsSmartComponent,
    title: 'Collaboration Demographics | Zambia',
  },
  {
    path: 'health',
    component: OrganizationalHealthSmartComponent,
    title: 'Organizational Health | Zambia',
  },
];
