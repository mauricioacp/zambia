import { Route } from '@angular/router';
import { CountriesListSmartComponent } from './components/smart/countries-list.smart-component';
import { CountryDetailSmartComponent } from './components/smart/country-detail.smart-component';

export const featCountriesRoutes: Route[] = [
  {
    path: '',
    component: CountriesListSmartComponent,
  },
  {
    path: ':countryId',
    component: CountryDetailSmartComponent,
  },
];
