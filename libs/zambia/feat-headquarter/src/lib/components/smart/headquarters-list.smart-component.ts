import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeadquartersFacadeService } from '../../services/headquarters-facade.service';
import { ColumnTemplateDirective, GenericTableUiComponent, WelcomeMessageUiComponent } from '@zambia/ui-components';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'z-headquarters-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    GenericTableUiComponent,
    WelcomeMessageUiComponent,
    TranslatePipe,
    ColumnTemplateDirective,
  ],
  template: `
    <div class="h-full w-full overflow-auto bg-gray-50 p-6 dark:bg-gray-900">
      <h1 class="mb-6 text-2xl font-bold text-gray-800 dark:text-white">{{ 'headquarters' | translate }}</h1>
      <z-welcome-message [welcomeText]="welcomeText()"></z-welcome-message>

      <z-generic-table
        [items]="headquartersFacade.headquartersResourceValue()"
        [headers]="['name', 'country', 'address', 'status', 'acciones']"
        [searchableColumns]="['name', 'countries', 'address']"
        [searchTransformers]="searchTransformers"
        [headerLabels]="headerLabels"
        [enablePagination]="true"
        [enableSorting]="true"
        [showTableControls]="true"
        [enableFiltering]="true"
        [pageSize]="10"
        [pageSizeOptions]="[5, 10, 20, 50]"
        [loading]="headquartersFacade.isLoading()"
        [emptyMessage]="'no.headquarters.found' | translate"
      >
        <!-- Error message -->
        @if (headquartersFacade.loadingError()) {
          <ng-container *ngTemplateOutlet="errorTemplate"></ng-container>
        }

        <!-- Columna country personalizada -->
        <ng-template zColumnTemplate="country" let-hq>
          {{ hq.countries?.name }} ({{ hq.countries?.code }})
        </ng-template>

        <!-- Columna address personalizada -->
        <ng-template zColumnTemplate="address" let-hq>
          {{ hq.address || 'Falta dirección' }}
        </ng-template>

        <!-- Columna de acciones -->
        <ng-template zColumnTemplate="acciones" let-hq>
          <a
            [routerLink]="['/dashboard/headquarters', hq.id]"
            class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {{ 'view' | translate }}
          </a>
        </ng-template>
      </z-generic-table>

      <!-- Error template -->
      <ng-template #errorTemplate>
        <div class="mt-4 border-l-4 border-red-400 bg-red-50 p-4 dark:border-red-500 dark:bg-red-900/30">
          <p class="text-red-700 dark:text-red-300">
            {{ 'failed.to.load' | translate }}: {{ headquartersFacade.loadingError() }}
          </p>
        </div>
      </ng-template>
    </div>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
      min-height: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeadquartersListSmartComponent {
  headquartersFacade = inject(HeadquartersFacadeService);
  translate = inject(TranslateService);

  welcomeText = computed(() => this.translate.instant('welcome.headquarters.list'));

  headerLabels = {
    name: this.translate.instant('name'),
    country: this.translate.instant('country'),
    address: this.translate.instant('address'),
    status: this.translate.instant('status'),
    actions: this.translate.instant('actions'),
  };

  // Search transformers to handle complex objects
  searchTransformers = {
    countries: (value: any) => {
      if (value && value.name && value.code) {
        return `${value.name} (${value.code}) ${value.name} ${value.code}`;
      }
      if (value && value.name) return value.name;
      if (value && value.code) return value.code;
      return '';
    }
  };

  constructor() {
    this.headquartersFacade.headquarters.reload();
  }
}
