import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CountriesFacadeService, Country } from '../../services/countries-facade.service';
import { GenericTableUiComponent, WelcomeMessageUiComponent } from '@zambia/ui-components';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'z-countries-list',
  standalone: true,
  imports: [CommonModule, RouterModule, GenericTableUiComponent, TranslatePipe, WelcomeMessageUiComponent],
  template: `
    <div class="container mx-auto p-6">
      <h2 class="mb-6 text-2xl font-bold text-gray-800 dark:text-white">{{ 'countries' | translate }}</h2>
      <z-welcome-message [welcomeText]="welcomeText()"></z-welcome-message>
      <z-generic-table
        [headers]="['name', 'code', 'status']"
        [headerLabels]="headerLabels"
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
  translate = inject(TranslateService);
  welcomeText = computed(() => this.translate.instant('welcome.countries.list'));

  // Custom header labels with translations
  headerLabels = {
    name: this.translate.instant('name'),
    code: this.translate.instant('code'),
    status: this.translate.instant('status'),
  };

  constructor() {
    this.countriesFacade.countries.reload();
  }

  onItemsSelectionChange($event: Country[]) {
    console.log($event);
  }
}
