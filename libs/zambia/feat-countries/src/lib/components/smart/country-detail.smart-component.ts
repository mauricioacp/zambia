import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  CountriesFacadeService,
  CountryFormData,
  CountryUpdate,
  CountryWithHeadquarters,
  Headquarter,
} from '../../services/countries-facade.service';
import { TuiBreadcrumbs } from '@taiga-ui/kit';
import { TuiButton, TuiDialogService, TuiIcon, TuiLink, TuiNotification } from '@taiga-ui/core';
import { EnhancedTableUiComponent, type TableAction, type TableColumn } from '@zambia/ui-components';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ICONS } from '@zambia/util-constants';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { CountryFormModalSmartComponent } from './country-form-modal.smart-component';
import { tryCatch } from '@zambia/data-access-generic';
import { TuiItem } from '@taiga-ui/cdk';

@Component({
  selector: 'z-country-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TuiIcon,
    TuiButton,
    TuiLink,
    TuiBreadcrumbs,
    TuiNotification,
    EnhancedTableUiComponent,
    TranslatePipe,
    TuiItem,
  ],
  template: `
    <div class="min-h-screen bg-slate-800">
      <!-- Header Section -->
      <div class="bg-slate-900 shadow-xl">
        <div class="container mx-auto px-6 py-4">
          <!-- Breadcrumbs -->
          <tui-breadcrumbs class="mb-6">
            <a *tuiItem routerLink="/dashboard" tuiLink iconStart="@tui.house">
              {{ 'dashboard' | translate }}
            </a>
            <a *tuiItem routerLink="/dashboard/countries" tuiLink>
              {{ 'countries' | translate }}
            </a>
            <span *tuiItem>
              {{ countryData()?.name || ('loading' | translate) }}
            </span>
          </tui-breadcrumbs>

          @if (countryData()) {
            <!-- Country Header -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-4 shadow-lg">
                  <tui-icon [icon]="ICONS.COUNTRIES" class="text-3xl text-white"></tui-icon>
                </div>
                <div>
                  <h1 class="mb-1 text-3xl font-bold text-white">
                    {{ countryData()!.name }}
                  </h1>
                  <p class="text-slate-400">{{ 'country_detail_subtitle' | translate }}</p>
                </div>
              </div>
              <button
                tuiButton
                appearance="primary"
                size="l"
                iconStart="@tui.pencil"
                (click)="onEdit()"
                [disabled]="isProcessing()"
                class="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                {{ 'edit' | translate }}
              </button>
            </div>
          }
        </div>
      </div>

      <div class="container mx-auto px-6 py-8">
        @if (countriesFacade.isDetailLoading()) {
          <!-- Loading State -->
          <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            @for (i of [1, 2, 3]; track i) {
              <div class="animate-pulse rounded-xl bg-slate-900 p-6">
                <div class="mb-3 h-4 w-24 rounded bg-slate-700"></div>
                <div class="h-8 w-32 rounded bg-slate-700"></div>
              </div>
            }
          </div>
          <div class="animate-pulse rounded-xl bg-slate-900 p-6">
            <div class="mb-4 h-6 w-48 rounded bg-slate-700"></div>
            <div class="space-y-3">
              @for (i of [1, 2, 3]; track i) {
                <div class="h-12 rounded bg-slate-700"></div>
              }
            </div>
          </div>
        } @else if (countryData()) {
          <!-- Country Info Cards -->
          <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <!-- Code Card -->
            <div
              class="rounded-xl border border-slate-700 bg-slate-900 p-6 transition-all duration-300 hover:border-slate-600 hover:shadow-lg"
            >
              <div class="mb-3 flex items-center justify-between">
                <span class="text-sm font-medium tracking-wider text-slate-400 uppercase">
                  {{ 'code' | translate }}
                </span>
                <tui-icon icon="@tui.code" class="text-blue-500"></tui-icon>
              </div>
              <p class="font-mono text-2xl font-bold text-white">
                {{ countryData()!.code }}
              </p>
            </div>

            <!-- Status Card -->
            <div
              class="rounded-xl border border-slate-700 bg-slate-900 p-6 transition-all duration-300 hover:border-slate-600 hover:shadow-lg"
            >
              <div class="mb-3 flex items-center justify-between">
                <span class="text-sm font-medium tracking-wider text-slate-400 uppercase">
                  {{ 'status' | translate }}
                </span>
                <tui-icon icon="@tui.activity" class="text-green-500"></tui-icon>
              </div>
              <div
                class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold"
                [ngClass]="{
                  'bg-green-500/20 text-green-400': countryData()!.status === 'active',
                  'bg-red-500/20 text-red-400': countryData()!.status === 'inactive',
                }"
              >
                <tui-icon
                  [icon]="countryData()!.status === 'active' ? '@tui.check-circle' : '@tui.x-circle'"
                  class="text-xs"
                ></tui-icon>
                {{ countryData()!.status || '' | translate }}
              </div>
            </div>

            <!-- Headquarters Count Card -->
            <div
              class="rounded-xl border border-slate-700 bg-slate-900 p-6 transition-all duration-300 hover:border-slate-600 hover:shadow-lg"
            >
              <div class="mb-3 flex items-center justify-between">
                <span class="text-sm font-medium tracking-wider text-slate-400 uppercase">
                  {{ 'headquarters_count' | translate }}
                </span>
                <tui-icon icon="@tui.building" class="text-indigo-500"></tui-icon>
              </div>
              <p class="text-2xl font-bold text-white">
                {{ countryData()!.headquarters?.length || 0 }}
              </p>
            </div>
          </div>

          <!-- Headquarters Section -->
          <div class="overflow-hidden rounded-xl bg-slate-900 shadow-xl">
            <div class="border-b border-slate-700 px-6 py-4">
              <h2 class="flex items-center gap-3 text-xl font-bold text-white">
                <tui-icon icon="@tui.building" class="text-indigo-500"></tui-icon>
                {{ 'headquarters.in' | translate }} {{ countryData()!.name }}
              </h2>
            </div>
            <z-enhanced-table
              [items]="countryData()!.headquarters || []"
              [columns]="headquartersColumns()"
              [actions]="headquartersActions()"
              [loading]="false"
              [enablePagination]="true"
              [enableFiltering]="true"
              [enableColumnVisibility]="true"
              [pageSize]="10"
              [searchableColumns]="['name', 'address']"
              [emptyStateTitle]="'no.headquarters.found' | translate"
              [emptyStateDescription]="'no_headquarters_description' | translate"
              [emptyStateIcon]="'@tui.building'"
              [showCreateButton]="false"
              (rowClick)="onHeadquarterClick($event)"
            />
          </div>
        } @else if (countriesFacade.detailLoadingError()) {
          <!-- Error State -->
          <div class="mx-auto max-w-md">
            <tui-notification status="error" class="border border-red-500/20 bg-red-500/10">
              <div class="py-8 text-center">
                <tui-icon icon="@tui.alert-triangle" class="mb-4 text-4xl text-red-500"></tui-icon>
                <h3 class="mb-2 text-xl font-bold text-white">{{ 'error_loading_country' | translate }}</h3>
                <p class="mb-6 text-slate-400">{{ countriesFacade.detailLoadingError() }}</p>
                <button tuiButton appearance="destructive" size="m" (click)="retry()">
                  {{ 'retry' | translate }}
                </button>
              </div>
            </tui-notification>
          </div>
        } @else if (!countryData() && !countriesFacade.isDetailLoading()) {
          <!-- Not Found State -->
          <div class="mx-auto max-w-md">
            <tui-notification status="warning" class="border border-yellow-500/20 bg-yellow-500/10">
              <div class="py-8 text-center">
                <tui-icon icon="@tui.help-circle" class="mb-4 text-4xl text-yellow-500"></tui-icon>
                <h3 class="mb-2 text-xl font-bold text-white">{{ 'country.not.found' | translate }}</h3>
                <p class="mb-6 text-slate-400">{{ 'country_not_found_description' | translate }}</p>
                <button tuiButton appearance="secondary" size="m" routerLink="/dashboard/countries">
                  {{ 'back.to.countries' | translate }}
                </button>
              </div>
            </tui-notification>
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
export class CountryDetailSmartComponent {
  protected countriesFacade = inject(CountriesFacadeService);
  private router = inject(Router);
  private translate = inject(TranslateService);
  private dialogService = inject(TuiDialogService);

  countryId = input.required<string>();
  countryData: WritableSignal<CountryWithHeadquarters | null> = signal(null);
  isProcessing = signal(false);

  ICONS = ICONS;

  headquartersColumns = computed((): TableColumn[] => [
    {
      key: 'name',
      label: this.translate.instant('name'),
      type: 'text',
      sortable: true,
      searchable: true,
    },
    {
      key: 'address',
      label: this.translate.instant('address'),
      type: 'text',
      sortable: true,
      searchable: true,
    },
    {
      key: 'city',
      label: this.translate.instant('city'),
      type: 'text',
      sortable: true,
    },
    {
      key: 'status',
      label: this.translate.instant('status'),
      type: 'status',
      sortable: true,
      width: 120,
    },
    {
      key: 'actions',
      label: this.translate.instant('actions'),
      type: 'actions',
      align: 'center',
      width: 150,
    },
  ]);

  headquartersActions = computed((): TableAction<Headquarter>[] => [
    {
      label: this.translate.instant('view'),
      icon: '@tui.eye',
      color: 'primary',
      handler: (headquarter) => this.onHeadquarterView(headquarter),
    },
    {
      label: this.translate.instant('edit'),
      icon: '@tui.pencil',
      color: 'warning',
      handler: (headquarter) => this.onHeadquarterEdit(headquarter),
      disabled: () => this.isProcessing(),
    },
  ]);

  constructor() {
    effect(() => {
      this.countriesFacade.countryId.set(this.countryId());
      this.countriesFacade.loadCountryById();
    });

    effect(() => {
      this.countryData.set(this.countriesFacade.countryByIdResource());
    });
  }

  onEdit(): void {
    const country = this.countryData();
    if (!country) return;

    const dialog = this.dialogService.open<CountryFormData>(new PolymorpheusComponent(CountryFormModalSmartComponent), {
      data: country,
      dismissible: true,
      size: 'm',
    });

    dialog.subscribe({
      next: async (result) => {
        const updateData: Partial<CountryFormData> = {
          ...result,
          status: result.status || 'inactive',
        };
        await this.handleCountryUpdate(country.id, updateData);
      },
      error: (error) => {
        console.error('Create country dialog error:', error);
        // TODO: Show error notification
      },
    });
  }

  onHeadquarterClick(headquarter: Headquarter): void {
    this.router.navigate(['/dashboard/headquarters', headquarter.id]);
  }

  onHeadquarterView(headquarter: Headquarter): void {
    this.router.navigate(['/dashboard/headquarters', headquarter.id]);
  }

  onHeadquarterEdit(headquarter: Headquarter): void {
    // TODO: Implement headquarter edit
    console.log('Edit headquarter:', headquarter);
  }

  retry(): void {
    this.countriesFacade.loadCountryById();
  }

  private async handleCountryUpdate(id: string, countryData: CountryUpdate): Promise<void> {
    this.isProcessing.set(true);

    const { error } = await tryCatch(() => this.countriesFacade.updateCountry(id, countryData));

    if (error) {
      console.error('Failed to update country:', error);
      // TODO: Show error notification
    } else {
      // TODO: Show success notification
      this.countriesFacade.loadCountryById();
    }

    this.isProcessing.set(false);
  }
}
