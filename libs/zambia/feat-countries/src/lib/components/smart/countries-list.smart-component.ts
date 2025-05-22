import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CountriesFacadeService, Country, CountryFormData } from '../../services/countries-facade.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { CountryFormModalSmartComponent } from './country-form-modal.smart-component';
import { ConfirmationModalSmartComponent, ConfirmationData } from './confirmation-modal.smart-component';
import { tryCatch } from '@zambia/data-access-generic';
import { EnhancedTableUiComponent, type TableColumn, type TableAction } from '@zambia/ui-components';

@Component({
  selector: 'z-countries-list',
  standalone: true,
  imports: [CommonModule, TranslatePipe, EnhancedTableUiComponent],
  template: `
    <div class="countries-wrapper">
      <z-enhanced-table
        [items]="countriesFacade.countriesResource()"
        [columns]="tableColumns()"
        [actions]="tableActions()"
        [loading]="countriesFacade.isLoading() || isProcessing()"
        [title]="'countries' | translate"
        [description]="'countries_description' | translate"
        [showCreateButton]="true"
        [createButtonLabel]="'create_country' | translate"
        [createButtonIcon]="'@tui.plus'"
        [emptyStateTitle]="'no_countries_found' | translate"
        [emptyStateDescription]="'no_countries_description' | translate"
        [emptyStateIcon]="'@tui.map-pin'"
        [loadingText]="'loading' | translate"
        [enablePagination]="true"
        [enableFiltering]="true"
        [enableColumnVisibility]="true"
        [pageSize]="10"
        [searchableColumns]="searchableColumns()"
        (createClick)="onCreateCountry()"
        (rowClick)="onRowClick($event)"
      />
    </div>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
      min-height: 100%;
    }

    .countries-wrapper {
      padding: 1.5rem;
      min-height: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountriesListSmartComponent {
  protected countriesFacade = inject(CountriesFacadeService);
  private translate = inject(TranslateService);
  private dialogService = inject(TuiDialogService);
  private router = inject(Router);

  isProcessing = signal(false);
  welcomeText = computed(() => this.translate.instant('welcome.countries.list'));

  tableColumns = computed((): TableColumn[] => [
    {
      key: 'name',
      label: this.translate.instant('name'),
      type: 'avatar',
      sortable: true,
      searchable: true,
    },
    {
      key: 'code',
      label: this.translate.instant('code'),
      type: 'badge',
      sortable: true,
      searchable: true,
    },
    {
      key: 'status',
      label: this.translate.instant('status'),
      type: 'status',
      sortable: true,
    },
    {
      key: 'actions',
      label: this.translate.instant('actions'),
      type: 'actions',
      align: 'center',
    },
  ]);

  tableActions = computed((): TableAction<Country>[] => [
    {
      label: this.translate.instant('view'),
      icon: '@tui.eye',
      color: 'primary',
      handler: (country: Country) => this.onViewCountry(country),
    },
    {
      label: this.translate.instant('edit'),
      icon: '@tui.pencil',
      color: 'warning',
      handler: (country: Country) => this.onEditCountry(country),
      disabled: () => this.isProcessing(),
    },
    {
      label: this.translate.instant('delete'),
      icon: '@tui.trash',
      color: 'danger',
      handler: (country: Country) => this.onDeleteCountry(country),
      disabled: () => this.isProcessing(),
    },
  ]);

  searchableColumns = computed(() => ['name', 'code']);

  constructor() {
    this.countriesFacade.countries.reload();
  }

  onRowClick(country: Country): void {
    this.onViewCountry(country);
  }

  onViewCountry(country: Country): void {
    this.router.navigate(['/dashboard/countries', country.id]);
  }

  onCreateCountry(): void {
    const dialog = this.dialogService.open<CountryFormData>(new PolymorpheusComponent(CountryFormModalSmartComponent), {
      data: null,
      dismissible: true,
      size: 'm',
    });

    dialog.subscribe({
      next: async (result) => {
        if (result) {
          await this.handleCountryCreate(result);
        }
      },
      error: (error) => {
        console.error('Create country dialog error:', error);
        // TODO: Show error notification
      },
    });
  }

  onEditCountry(country: Country): void {
    const dialog = this.dialogService.open<CountryFormData>(new PolymorpheusComponent(CountryFormModalSmartComponent), {
      data: country,
      dismissible: true,
      size: 'm',
    });

    dialog.subscribe({
      next: async (result) => {
        if (result) {
          await this.handleCountryUpdate(country.id, result);
        }
      },
      error: (error) => {
        console.error('Edit country dialog error:', error);
        // TODO: Show error notification
      },
    });
  }

  onDeleteCountry(country: Country): void {
    const confirmationData: ConfirmationData = {
      title: this.translate.instant('delete_country'),
      message: this.translate.instant('delete_country_confirmation', { name: country.name }),
      confirmText: this.translate.instant('delete'),
      danger: true,
    };

    const dialog = this.dialogService.open<boolean>(new PolymorpheusComponent(ConfirmationModalSmartComponent), {
      data: confirmationData,
      dismissible: true,
      size: 's',
    });

    dialog.subscribe({
      next: async (confirmed) => {
        if (confirmed) {
          await this.handleCountryDelete(country.id);
        }
      },
      error: (error) => {
        console.error('Delete country dialog error:', error);
        // TODO: Show error notification
      },
    });
  }

  private async handleCountryCreate(countryData: CountryFormData): Promise<void> {
    this.isProcessing.set(true);

    const { data, error } = await tryCatch(() => this.countriesFacade.createCountry(countryData));

    if (error) {
      console.error('Failed to create country:', error);
      // TODO: Show error notification
    } else {
      // TODO: Show success notification
      this.countriesFacade.countries.reload();
    }

    this.isProcessing.set(false);
  }

  private async handleCountryUpdate(id: string, countryData: CountryFormData): Promise<void> {
    this.isProcessing.set(true);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, error } = await tryCatch(() => this.countriesFacade.updateCountry(id, countryData));

    if (error) {
      console.error('Failed to update country:', error);
      // TODO: Show error notification
    } else {
      // TODO: Show success notification
      this.countriesFacade.countries.reload();
    }

    this.isProcessing.set(false);
  }

  private async handleCountryDelete(id: string): Promise<void> {
    this.isProcessing.set(true);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, error } = await tryCatch(() => this.countriesFacade.deleteCountry(id));

    if (error) {
      console.error('Failed to delete country:', error);
      // TODO: Show error notification
    } else {
      // TODO: Show success notification
      this.countriesFacade.countries.reload();
    }

    this.isProcessing.set(false);
  }
}
