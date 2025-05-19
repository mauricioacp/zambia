import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CountriesFacadeService, Country } from '../../services/countries-facade.service';
import { ColumnTemplateDirective, GenericTableUiComponent, WelcomeMessageUiComponent } from '@zambia/ui-components';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'z-countries-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    GenericTableUiComponent,
    TranslatePipe,
    WelcomeMessageUiComponent,
    ColumnTemplateDirective,
  ],
  template: `
    <div class="container mx-auto p-6">
      <h2 class="mb-6 text-2xl font-bold text-gray-800 dark:text-white">{{ 'countries' | translate }}</h2>
      <z-welcome-message [welcomeText]="welcomeText()"></z-welcome-message>
      <z-generic-table
        [headers]="['name', 'code', 'status']"
        [headerLabels]="headerLabels"
        [actions]="['actions']"
        [items]="countriesFacade.countriesResource()"
        [loading]="countriesFacade.isLoading()"
        (itemsSelectionChange)="onItemsSelectionChange($event)"
      >
        <ng-template zColumnTemplate="code" let-country>
          <span class="rounded bg-gray-100 px-2 py-1 font-mono dark:bg-gray-800">{{ country.code }}</span>
        </ng-template>

        <ng-template zColumnTemplate="actions" let-country>
          <div class="flex space-x-2">
            <a
              [routerLink]="['/dashboard/countries', country.id]"
              class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {{ 'view' | translate }}
            </a>
            <!-- todo  <button
              (click)="onEdit(country)"
              class="text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
            >
              {{ 'edit' | translate }}
            </button>-->
          </div>
        </ng-template>
      </z-generic-table>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountriesListSmartComponent {
  countriesFacade = inject(CountriesFacadeService);
  translate = inject(TranslateService);
  welcomeText = computed(() => this.translate.instant('welcome.countries.list'));

  headerLabels = {
    name: this.translate.instant('name'),
    code: this.translate.instant('code'),
    status: this.translate.instant('status'),
    actions: this.translate.instant('actions'),
  };

  constructor() {
    this.countriesFacade.countries.reload();
  }

  onItemsSelectionChange($event: Country[]) {
    console.log($event);
  }

  onEdit(country: Country) {
    console.log('Edit country', country);
  }

  onDelete(country: Country) {
    console.log('Delete country', country);
  }
}
