import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CountriesFacadeService, Country, CountryFormData } from '../../services/countries-facade.service';
import { WelcomeMessageUiComponent } from '@zambia/ui-components';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TuiDialogService, TuiButton, TuiIcon, TuiTitle, TuiAutoColorPipe, TuiInitialsPipe } from '@taiga-ui/core';
import { TuiTable } from '@taiga-ui/addon-table';
import { TuiAvatar, TuiBadge, TuiStatus } from '@taiga-ui/kit';
import { TuiCell } from '@taiga-ui/layout';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { CountryFormModalSmartComponent } from './country-form-modal.smart-component';
import { ConfirmationModalSmartComponent, ConfirmationData } from './confirmation-modal.smart-component';
import { tryCatch } from '@zambia/data-access-generic';

@Component({
  selector: 'z-countries-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslatePipe,
    WelcomeMessageUiComponent,
    TuiButton,
    TuiTable,
    TuiCell,
    TuiTitle,
    TuiIcon,
    TuiAvatar,
    TuiBadge,
    TuiStatus,
    TuiAutoColorPipe,
    TuiInitialsPipe,
  ],
  template: `
    <div class="countries-container">
      <div class="header">
        <h1 class="countries-title">{{ 'countries' | translate }}</h1>
        <button
          tuiButton
          appearance="primary"
          size="m"
          iconStart="@tui.plus"
          (click)="onCreateCountry()"
          [disabled]="isProcessing()"
        >
          {{ 'create_country' | translate }}
        </button>
      </div>

      <div class="welcome-section">
        <z-welcome-message [welcomeText]="welcomeText()"></z-welcome-message>
      </div>

      <div class="table-container">
        <table tuiTable size="m" class="countries-table">
          <thead>
            <tr>
              <th tuiTh>{{ 'name' | translate }}</th>
              <th tuiTh>{{ 'code' | translate }}</th>
              <th tuiTh>{{ 'status' | translate }}</th>
              <th tuiTh>{{ 'actions' | translate }}</th>
            </tr>
          </thead>
          <tbody tuiTbody>
            <tr *ngFor="let country of countriesFacade.countriesResource()">
              <td tuiTd>
                <div tuiCell="m">
                  <tui-avatar
                    [src]="country.name | tuiInitials"
                    [style.background]="country.name | tuiAutoColor"
                    size="s"
                  ></tui-avatar>
                  <span tuiTitle>
                    {{ country.name }}
                    <span tuiSubtitle>{{ getCountryDescription(country) }}</span>
                  </span>
                </div>
              </td>
              <td tuiTd>
                <tui-badge class="country-code-badge">{{ country.code }}</tui-badge>
              </td>
              <td tuiTd>
                <span [tuiStatus]="getStatusColor(country.status)">
                  <tui-icon [icon]="getStatusIcon(country.status)"></tui-icon>
                  {{ country.status | translate }}
                </span>
              </td>
              <td tuiTd>
                <span tuiStatus class="actions-group">
                  <a
                    [routerLink]="['/dashboard/countries', country.id]"
                    tuiButton
                    appearance="action"
                    iconStart="@tui.eye"
                    size="xs"
                    class="action-button"
                  >
                    {{ 'view' | translate }}
                  </a>
                  <button
                    tuiButton
                    appearance="action"
                    iconStart="@tui.pencil"
                    size="xs"
                    (click)="onEditCountry(country)"
                    [disabled]="isProcessing()"
                    class="action-button edit-button"
                  >
                    {{ 'edit' | translate }}
                  </button>
                  <button
                    tuiButton
                    appearance="action"
                    iconStart="@tui.trash"
                    size="xs"
                    (click)="onDeleteCountry(country)"
                    [disabled]="isProcessing()"
                    class="action-button delete-button"
                  >
                    {{ 'delete' | translate }}
                  </button>
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        <div *ngIf="countriesFacade.isLoading() || isProcessing()" class="loading-overlay">
          <tui-icon icon="@tui.loader" class="loading-spinner"></tui-icon>
          <span>{{ 'loading' | translate }}</span>
        </div>

        <div
          *ngIf="countriesFacade.countriesResource()?.length === 0 && !countriesFacade.isLoading()"
          class="empty-state"
        >
          <tui-icon icon="@tui.map-pin" class="empty-icon"></tui-icon>
          <h3>{{ 'no_countries_found' | translate }}</h3>
          <p>{{ 'no_countries_description' | translate }}</p>
          <button tuiButton appearance="primary" size="m" iconStart="@tui.plus" (click)="onCreateCountry()">
            {{ 'create_first_country' | translate }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
      min-height: 100%;
    }

    .countries-container {
      padding: 1.5rem;
      min-height: 100%;
      background: var(--tui-base-01);
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--tui-border-normal);
    }

    .countries-title {
      font-size: 2rem;
      font-weight: 700;
      margin: 0;
      color: var(--tui-text-primary);
    }

    .welcome-section {
      margin-bottom: 1.5rem;
    }

    .table-container {
      position: relative;
      background: var(--tui-base-02);
      border-radius: 0.75rem;
      overflow: hidden;
      box-shadow: var(--tui-shadow-small);
    }

    .countries-table {
      width: 100%;
    }

    .country-code-badge {
      font-family: var(--tui-font-mono, 'Courier New', monospace);
      font-weight: 600;
    }

    .actions-group {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .action-button {
      min-width: auto;
    }

    .edit-button {
      color: var(--tui-status-warning);
    }

    .delete-button {
      color: var(--tui-status-negative);
    }

    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--tui-base-02);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      z-index: 10;
    }

    .loading-spinner {
      animation: spin 1s linear infinite;
      color: var(--tui-primary);
      font-size: 2rem;
    }

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    .empty-state {
      text-align: center;
      padding: 3rem 2rem;
      color: var(--tui-text-secondary);
    }

    .empty-icon {
      font-size: 4rem;
      color: var(--tui-text-tertiary);
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0 0 0.5rem 0;
      color: var(--tui-text-primary);
    }

    .empty-state p {
      margin: 0 0 1.5rem 0;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }

    [tuiTh],
    [tuiTd] {
      border-inline-start: none;
      border-inline-end: none;
    }

    [tuiTable][data-size='m'] [tuiTitle] {
      flex-direction: row;
      gap: 0.75rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountriesListSmartComponent {
  protected countriesFacade = inject(CountriesFacadeService);
  private translate = inject(TranslateService);
  private dialogService = inject(TuiDialogService);

  isProcessing = signal(false);
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

  getStatusClass(status: string): string {
    return status === 'active'
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
  }

  getStatusColor(status: string): string {
    return status === 'active' ? 'var(--tui-status-positive)' : 'var(--tui-status-negative)';
  }

  getStatusIcon(status: string): string {
    return status === 'active' ? '@tui.check' : '@tui.x';
  }

  getCountryDescription(country: Country): string {
    return `Code: ${country.code} • Status: ${this.translate.instant(country.status || 'unknown')}`;
  }

  onItemsSelectionChange(countries: Country[]): void {
    console.log('Selected countries:', countries);
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
      console.log('Country created successfully:', data);
      // TODO: Show success notification
    }

    this.isProcessing.set(false);
  }

  private async handleCountryUpdate(id: string, countryData: CountryFormData): Promise<void> {
    this.isProcessing.set(true);

    const { data, error } = await tryCatch(() => this.countriesFacade.updateCountry(id, countryData));

    if (error) {
      console.error('Failed to update country:', error);
      // TODO: Show error notification
    } else {
      console.log('Country updated successfully:', data);
      // TODO: Show success notification
    }

    this.isProcessing.set(false);
  }

  private async handleCountryDelete(id: string): Promise<void> {
    this.isProcessing.set(true);

    const { data, error } = await tryCatch(() => this.countriesFacade.deleteCountry(id));
    console.log(data);

    if (error) {
      console.error('Failed to delete country:', error);
      // TODO: Show error notification
    } else {
      console.log('Country deleted successfully');
      // TODO: Show success notification
    }

    this.isProcessing.set(false);
  }
}
