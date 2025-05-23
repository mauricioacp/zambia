import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CountriesFacadeService, Country, CountryFormData } from '../../services/countries-facade.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TuiButton, TuiDialogService, TuiIcon } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { CountryFormModalSmartComponent } from './country-form-modal.smart-component';
import { ConfirmationModalSmartComponent, ConfirmationData } from './confirmation-modal.smart-component';
import { tryCatch } from '@zambia/data-access-generic';
import { EnhancedTableUiComponent, type TableColumn, type TableAction } from '@zambia/ui-components';
import { ICONS } from '@zambia/util-constants';

@Component({
  selector: 'z-countries-list',
  standalone: true,
  imports: [CommonModule, TranslatePipe, EnhancedTableUiComponent, TuiIcon, TuiButton],
  template: `
    <div class="min-h-screen bg-slate-800">
      <!-- Header Section -->
      <div class="bg-slate-900 shadow-xl">
        <div class="container mx-auto px-6 py-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-4 shadow-lg">
                <tui-icon [icon]="ICONS.COUNTRIES" class="text-3xl text-white"></tui-icon>
              </div>
              <div>
                <h1 class="mb-1 text-3xl font-bold text-white">
                  {{ 'countries' | translate }}
                </h1>
                <p class="text-slate-400">{{ 'countries_description' | translate }}</p>
              </div>
            </div>
            <button
              tuiButton
              appearance="primary"
              size="l"
              iconStart="@tui.plus"
              (click)="onCreateCountry()"
              [disabled]="isProcessing()"
              class="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
            >
              {{ 'create_country' | translate }}
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="container mx-auto px-6 py-8">
        @if (statsData()) {
          <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
            <!-- Total Countries -->
            <div
              class="rounded-xl border border-slate-700 bg-slate-900 p-6 transition-all duration-300 hover:border-slate-600 hover:shadow-lg"
            >
              <div class="mb-3 flex items-center justify-between">
                <span class="text-sm font-medium tracking-wider text-slate-400 uppercase">
                  {{ 'total_countries' | translate }}
                </span>
                <tui-icon icon="@tui.globe" class="text-emerald-500"></tui-icon>
              </div>
              <p class="text-2xl font-bold text-white">
                {{ statsData()!.total }}
              </p>
            </div>

            <!-- Active Countries -->
            <div
              class="rounded-xl border border-slate-700 bg-slate-900 p-6 transition-all duration-300 hover:border-slate-600 hover:shadow-lg"
            >
              <div class="mb-3 flex items-center justify-between">
                <span class="text-sm font-medium tracking-wider text-slate-400 uppercase">
                  {{ 'active_countries' | translate }}
                </span>
                <tui-icon icon="@tui.check-circle" class="text-green-500"></tui-icon>
              </div>
              <p class="text-2xl font-bold text-white">
                {{ statsData()!.active }}
              </p>
            </div>

            <!-- Inactive Countries -->
            <div
              class="rounded-xl border border-slate-700 bg-slate-900 p-6 transition-all duration-300 hover:border-slate-600 hover:shadow-lg"
            >
              <div class="mb-3 flex items-center justify-between">
                <span class="text-sm font-medium tracking-wider text-slate-400 uppercase">
                  {{ 'inactive_countries' | translate }}
                </span>
                <tui-icon icon="@tui.x-circle" class="text-red-500"></tui-icon>
              </div>
              <p class="text-2xl font-bold text-white">
                {{ statsData()!.inactive }}
              </p>
            </div>

            <!-- Countries with Data -->
            <div
              class="rounded-xl border border-slate-700 bg-slate-900 p-6 transition-all duration-300 hover:border-slate-600 hover:shadow-lg"
            >
              <div class="mb-3 flex items-center justify-between">
                <span class="text-sm font-medium tracking-wider text-slate-400 uppercase">
                  {{ 'last_updated' | translate }}
                </span>
                <tui-icon icon="@tui.refresh-cw" class="text-blue-500"></tui-icon>
              </div>
              <p class="text-lg font-semibold text-white">
                {{ 'today' | translate }}
              </p>
            </div>
          </div>
        }

        <!-- Countries Table -->
        <div class="overflow-hidden rounded-xl bg-slate-900 shadow-xl">
          <z-enhanced-table
            [items]="countriesFacade.countriesResource()"
            [columns]="tableColumns()"
            [actions]="tableActions()"
            [loading]="countriesFacade.isLoading() || isProcessing()"
            [showCreateButton]="false"
            [emptyStateTitle]="'no_countries_found' | translate"
            [emptyStateDescription]="'no_countries_description' | translate"
            [emptyStateIcon]="'@tui.map-pin'"
            [loadingText]="'loading' | translate"
            [enablePagination]="true"
            [enableFiltering]="true"
            [enableColumnVisibility]="true"
            [pageSize]="10"
            [searchableColumns]="searchableColumns()"
            (rowClick)="onRowClick($event)"
          />
        </div>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
      height: 100%;
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

  ICONS = ICONS;

  statsData = computed(() => {
    const countries = this.countriesFacade.countriesResource();
    if (!countries || countries.length === 0) return null;

    return {
      total: countries.length,
      active: countries.filter((c) => c.status === 'active').length,
      inactive: countries.filter((c) => c.status === 'inactive').length,
    };
  });

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
      size: 'm',
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

    const { error } = await tryCatch(() => this.countriesFacade.createCountry(countryData));

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
