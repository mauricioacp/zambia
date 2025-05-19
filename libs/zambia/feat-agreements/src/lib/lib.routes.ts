import { Route } from '@angular/router';
import { AgreementsListSmartComponent } from './components/smart/agreements-list.smart-component';
import { AgreementDetailSmartComponent } from './components/smart/agreement-detail.smart-component';

export const featAgreementsRoutes: Route[] = [
  {
    path: '',
    component: AgreementsListSmartComponent,
  },
  {
    path: ':agreementId',
    component: AgreementDetailSmartComponent,
  },
];
