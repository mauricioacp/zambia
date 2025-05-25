import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CountriesFacadeService, Country, CountryFormData } from '../../services/countries-facade.service';
import { SupabaseService } from '@zambia/data-access-supabase';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TuiButton, TuiDialogService, TuiIcon, TuiLink } from '@taiga-ui/core';
import { TuiBreadcrumbs, TuiSkeleton } from '@taiga-ui/kit';
import { TuiItem } from '@taiga-ui/cdk';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { CountryFormModalSmartComponent } from './country-form-modal.smart-component';
import { ConfirmationModalSmartComponent, ConfirmationData } from './confirmation-modal.smart-component';
import { ExportModalSmartComponent, ExportOptions } from './export-modal.smart-component';
import {
  tryCatch,
  NotificationService,
  isDatabaseConstraintError,
  parseConstraintError,
  ExportService,
} from '@zambia/data-access-generic';
import { EnhancedTableUiComponent, type TableColumn, type TableAction } from '@zambia/ui-components';
import { ICONS } from '@zambia/util-constants';
import { injectCurrentTheme } from '@zambia/ui-components';

@Component({
  selector: 'z-countries-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslatePipe,
    EnhancedTableUiComponent,
    TuiIcon,
    TuiButton,
    TuiLink,
    TuiBreadcrumbs,
    TuiItem,
    TuiSkeleton,
  ],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-slate-800">
      <!-- Header Section -->
      <div class="border-b border-gray-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
        <div class="container mx-auto px-6 py-6">
          <!-- Breadcrumbs -->
          <tui-breadcrumbs class="mb-6">
            <a *tuiItem routerLink="/dashboard" tuiLink iconStart="@tui.house">
              {{ 'dashboard' | translate }}
            </a>
            <span *tuiItem>
              {{ 'countries' | translate }}
            </span>
          </tui-breadcrumbs>

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-4 shadow-lg">
                <tui-icon [icon]="ICONS.COUNTRIES" class="text-3xl text-white"></tui-icon>
              </div>
              <div>
                <h1 class="mb-1 text-3xl font-bold text-gray-800 dark:text-white">
                  {{ 'countries' | translate }}
                </h1>
                <p class="text-gray-600 dark:text-slate-400">{{ 'countries_description' | translate }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <button
                tuiButton
                appearance="secondary"
                size="l"
                iconStart="@tui.download"
                [attr.tuiTheme]="currentTheme()"
                (click)="onExportCountries()"
                [disabled]="isProcessing() || !statsData()?.total"
                class="border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
              >
                {{ 'export' | translate }}
              </button>
              <button
                tuiButton
                appearance="primary"
                size="l"
                iconStart="@tui.plus"
                [attr.tuiTheme]="currentTheme()"
                (click)="onCreateCountry()"
                [disabled]="isProcessing()"
                class="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
              >
                {{ 'create_country' | translate }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="container mx-auto px-6 py-8">
        @defer (on viewport; prefetch on idle) {
          @if (statsData()) {
            <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
              <!-- Total Countries -->
              <div
                class="rounded-xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-gray-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600"
              >
                <div class="mb-3 flex items-center justify-between">
                  <span class="text-sm font-medium tracking-wider text-gray-500 uppercase dark:text-slate-400">
                    {{ 'total_countries' | translate }}
                  </span>
                  <tui-icon icon="@tui.globe" class="text-emerald-500"></tui-icon>
                </div>
                <p class="text-2xl font-bold text-gray-800 dark:text-white">
                  {{ statsData()!.total }}
                </p>
              </div>

              <!-- Active Countries -->
              <div
                class="rounded-xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-gray-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600"
              >
                <div class="mb-3 flex items-center justify-between">
                  <span class="text-sm font-medium tracking-wider text-gray-500 uppercase dark:text-slate-400">
                    {{ 'active_countries' | translate }}
                  </span>
                  <tui-icon icon="@tui.check" class="text-green-500"></tui-icon>
                </div>
                <p class="text-2xl font-bold text-gray-800 dark:text-white">
                  {{ statsData()!.active }}
                </p>
              </div>

              <!-- Inactive Countries -->
              <div
                class="rounded-xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-gray-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600"
              >
                <div class="mb-3 flex items-center justify-between">
                  <span class="text-sm font-medium tracking-wider text-gray-500 uppercase dark:text-slate-400">
                    {{ 'inactive_countries' | translate }}
                  </span>
                  <tui-icon icon="@tui.x" class="text-red-500"></tui-icon>
                </div>
                <p class="text-2xl font-bold text-gray-800 dark:text-white">
                  {{ statsData()!.inactive }}
                </p>
              </div>

              <!-- Countries with Data -->
              <div
                class="rounded-xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-gray-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600"
              >
                <div class="mb-3 flex items-center justify-between">
                  <span class="text-sm font-medium tracking-wider text-gray-500 uppercase dark:text-slate-400">
                    {{ 'last_updated' | translate }}
                  </span>
                  <tui-icon icon="@tui.refresh-cw" class="text-blue-500"></tui-icon>
                </div>
                <p class="text-lg font-semibold text-gray-800 dark:text-white">
                  {{ 'today' | translate }}
                </p>
              </div>
            </div>
          }
        } @placeholder {
          <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
            @for (i of [1, 2, 3, 4]; track i) {
              <div [tuiSkeleton]="true" class="h-24 w-full rounded-xl"></div>
            }
          </div>
        } @loading {
          <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
            @for (i of [1, 2, 3, 4]; track i) {
              <div [tuiSkeleton]="true" class="h-24 w-full animate-pulse rounded-xl"></div>
            }
          </div>
        }

        <!-- Countries Table -->
        @defer (on viewport; prefetch on hover) {
          <div
            class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900"
          >
            <z-enhanced-table
              [attr.tuiTheme]="currentTheme()"
              [items]="countriesFacade.countriesResource()"
              [columns]="tableColumns()"
              [actions]="tableActions()"
              [loading]="countriesFacade.isLoading() || isProcessing()"
              [showCreateButton]="false"
              [emptyStateTitle]="'no_countries_found' | translate"
              [emptyStateDescription]="'no_countries_description' | translate"
              [emptyStateIcon]="'@tui.map-pin'"
              [loadingText]="'loading' | translate"
              [enablePagination]="false"
              [enableFiltering]="true"
              [enableColumnVisibility]="true"
              [pageSize]="10"
              [searchableColumns]="searchableColumns()"
              (rowClick)="onRowClick($event)"
            />
          </div>
        } @placeholder {
          <div
            class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900"
          >
            <div class="p-6">
              <div class="mb-4 flex items-center justify-between">
                <div [tuiSkeleton]="true" class="h-8 w-32 rounded"></div>
                <div [tuiSkeleton]="true" class="h-10 w-24 rounded"></div>
              </div>
              <div [tuiSkeleton]="true" class="mb-4 h-10 w-64 rounded"></div>
              <div class="space-y-3">
                @for (i of [1, 2, 3, 4, 5]; track i) {
                  <div [tuiSkeleton]="true" class="h-12 w-full rounded"></div>
                }
              </div>
            </div>
          </div>
        } @loading {
          <div
            class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900"
          >
            <div class="p-6">
              <div class="mb-4 flex items-center justify-between">
                <div [tuiSkeleton]="true" class="h-8 w-32 animate-pulse rounded"></div>
                <div [tuiSkeleton]="true" class="h-10 w-24 animate-pulse rounded"></div>
              </div>
              <div [tuiSkeleton]="true" class="mb-4 h-10 w-64 animate-pulse rounded"></div>
              <div class="space-y-3">
                @for (i of [1, 2, 3, 4, 5]; track i) {
                  <div [tuiSkeleton]="true" class="h-12 w-full animate-pulse rounded"></div>
                }
              </div>
            </div>
          </div>
        }
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
  private notificationService = inject(NotificationService);
  private supabaseService = inject(SupabaseService);
  private exportService = inject(ExportService);

  isProcessing = signal(false);
  currentTheme = injectCurrentTheme();

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

  onExportCountries(): void {
    const countries = this.countriesFacade.countriesResource();
    if (!countries || countries.length === 0) {
      this.notificationService.showWarning('no_data_to_export').subscribe();
      return;
    }

    // Open export options modal
    const dialog = this.dialogService.open<ExportOptions>(new PolymorpheusComponent(ExportModalSmartComponent), {
      dismissible: true,
      size: 'm',
    });

    dialog.subscribe({
      next: (options) => {
        if (options) {
          this.handleExport(countries, options);
        }
      },
      error: (error) => {
        console.error('Export dialog error:', error);
        this.notificationService.showError('dialog_error').subscribe();
      },
    });
  }

  private handleExport(countries: Country[], options: ExportOptions): void {
    // Create export columns from table columns
    const exportColumns = this.exportService.createExportColumns(this.tableColumns());

    // Generate filename with current date
    const date = new Date().toISOString().split('T')[0];
    const filename = `countries_${date}`;

    // Export based on selected format
    if (options.format === 'csv') {
      this.exportService.exportToCSV(countries, exportColumns, filename);
    } else {
      this.exportService.exportToExcel(countries, exportColumns, filename);
    }

    // Show success notification
    this.notificationService
      .showSuccess('export_success', {
        translateParams: {
          count: countries.length,
          format: options.format.toUpperCase(),
        },
      })
      .subscribe();
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
        this.notificationService.showError('dialog_error').subscribe();
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
        this.notificationService.showError('dialog_error').subscribe();
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
          await this.handleCountryDelete(country);
        }
      },
      error: (error) => {
        console.error('Delete country dialog error:', error);
        this.notificationService.showError('dialog_error').subscribe();
      },
    });
  }

  private async handleCountryCreate(countryData: CountryFormData): Promise<void> {
    this.isProcessing.set(true);

    const { error } = await tryCatch(() => this.countriesFacade.createCountry(countryData));

    if (error) {
      console.error('Failed to create country:', error);
      this.notificationService.showError('country_create_error').subscribe();
    } else {
      this.notificationService
        .showSuccess('country_created_success', {
          translateParams: { name: countryData.name },
        })
        .subscribe();
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
      this.notificationService.showError('country_update_error').subscribe();
    } else {
      this.notificationService
        .showSuccess('country_updated_success', {
          translateParams: { name: countryData.name },
        })
        .subscribe();
      this.countriesFacade.countries.reload();
    }

    this.isProcessing.set(false);
  }

  private async handleCountryDelete(country: Country): Promise<void> {
    this.isProcessing.set(true);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, error } = await tryCatch(() => this.countriesFacade.deleteCountry(country.id));

    if (error) {
      console.error('Failed to delete country:', error);

      // Check if it's a database constraint error
      if (isDatabaseConstraintError(error)) {
        const constraintInfo = parseConstraintError(error);

        if (constraintInfo.type === 'foreign_key' && constraintInfo.referencedTable === 'headquarters') {
          // Try to get headquarters count, fallback to "some" if we can't get exact count
          this.getHeadquartersCount(country.id)
            .then((count) => {
              this.notificationService
                .showWarning('country_delete_has_headquarters', {
                  translateParams: {
                    name: country.name,
                    count: count || 'some',
                  },
                })
                .subscribe();
            })
            .catch(() => {
              // Fallback if we can't get count
              this.notificationService
                .showWarning('country_delete_has_headquarters', {
                  translateParams: {
                    name: country.name,
                    count: 'some',
                  },
                })
                .subscribe();
            });
        } else {
          // Other constraint errors
          this.notificationService.showError('country_delete_error').subscribe();
        }
      } else {
        // Generic error
        this.notificationService.showError('country_delete_error').subscribe();
      }
    } else {
      this.notificationService
        .showSuccess('country_deleted_success', {
          translateParams: { name: country.name },
        })
        .subscribe();
      this.countriesFacade.countries.reload();
    }

    this.isProcessing.set(false);
  }

  private async getHeadquartersCount(countryId: string): Promise<number> {
    const { count, error } = await this.supabaseService
      .getClient()
      .from('headquarters')
      .select('*', { count: 'exact', head: true })
      .eq('country_id', countryId);

    if (error) {
      console.warn('Failed to get headquarters count:', error);
      return 1; // Fallback to at least 1 since constraint failed
    }

    return count || 1;
  }
}
