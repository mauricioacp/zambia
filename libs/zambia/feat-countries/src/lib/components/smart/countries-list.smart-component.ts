import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Country, CountriesFacadeService } from '../../services/countries-facade.service';
import { GenericTableUiComponent } from '@zambia/ui-components';

@Component({
  selector: 'z-countries-list',
  standalone: true,
  imports: [CommonModule, RouterModule, GenericTableUiComponent],
  template: `
    <div class="container mx-auto p-6">
      <h1 class="mb-6 text-2xl font-bold text-gray-800 dark:text-white">Countries</h1>
      <z-generic-table
        [items]="countriesFacade.countriesResource()"
        [loading]="countriesFacade.isLoading()"
        (itemsSelectionChange)="onItemsSelectionChange($event)"
      ></z-generic-table>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountriesListSmartComponent {
  countriesFacade = inject(CountriesFacadeService);

  constructor() {
    this.countriesFacade.countries.reload();
  }

  onItemsSelectionChange($event: Country[]) {
    console.log($event);
  }
}
