import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiError, TuiTextfield, TuiIcon, tuiItemsHandlersProvider } from '@taiga-ui/core';
import { TuiButtonLoading, TuiFieldErrorPipe, TuiDataListWrapper, TuiSelect, TuiChevron } from '@taiga-ui/kit';
import { TuiAutoFocus } from '@taiga-ui/cdk';
import { injectContext } from '@taiga-ui/polymorpheus';
import { TranslatePipe } from '@ngx-translate/core';
import type { TuiDialogContext } from '@taiga-ui/core';
import { Headquarter, HeadquarterFormData } from '../../services/headquarters-facade.service';
import { CountriesFacadeService } from '@zambia/feat-countries';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'z-headquarter-form-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiButton,
    TuiError,
    TuiTextfield,
    TuiFieldErrorPipe,
    TranslatePipe,
    TuiButtonLoading,
    AsyncPipe,
    TuiAutoFocus,
    TuiIcon,
    TuiSelect,
    TuiChevron,
    TuiDataListWrapper,
  ],
  template: `
    <div class="headquarter-form">
      <div class="form-header">
        <tui-icon [icon]="isEditMode() ? '@tui.pencil' : '@tui.plus'" class="form-icon"></tui-icon>
        <h3 class="heading">
          {{ isEditMode() ? ('edit_headquarter' | translate) : ('create_headquarter' | translate) }}
        </h3>
        <p class="form-description">
          {{
            isEditMode() ? ('edit_headquarter_description' | translate) : ('create_headquarter_description' | translate)
          }}
        </p>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form-content">
        <div class="form-field">
          <label class="field-label" for="headquarter-name">
            <tui-icon icon="@tui.building" class="field-icon"></tui-icon>
            {{ 'headquarter_name' | translate }}
          </label>
          <tui-textfield tuiAutoFocus tuiTextfieldSize="m" class="form-input">
            <input
              tuiTextfield
              id="headquarter-name"
              formControlName="name"
              [placeholder]="'enter_headquarter_name' | translate"
            />
          </tui-textfield>
          <tui-error formControlName="name" [error]="[] | tuiFieldError | async"></tui-error>
        </div>

        <div class="form-field">
          <label class="field-label" for="headquarter-address">
            <tui-icon icon="@tui.map-pin" class="field-icon"></tui-icon>
            {{ 'headquarter_address' | translate }}
          </label>
          <tui-textfield tuiTextfieldSize="m" class="form-input">
            <input
              tuiTextfield
              id="headquarter-address"
              formControlName="address"
              [placeholder]="'enter_headquarter_address' | translate"
            />
          </tui-textfield>
          <tui-error formControlName="address" [error]="[] | tuiFieldError | async"></tui-error>
        </div>

        <div class="form-field">
          <label class="field-label" for="headquarter-country">
            <tui-icon icon="@tui.globe" class="field-icon"></tui-icon>
            {{ 'country' | translate }}
          </label>
          <tui-textfield tuiChevron tuiTextfieldSize="m" class="form-input">
            <input
              tuiSelect
              id="headquarter-country"
              formControlName="country_id"
              [placeholder]="'select_country' | translate"
            />
            <tui-data-list-wrapper *tuiTextfieldDropdown new [items]="countryOptions()" />
          </tui-textfield>
          <tui-error formControlName="country_id" [error]="[] | tuiFieldError | async"></tui-error>
        </div>

        <div class="form-field">
          <label class="field-label" for="headquarter-status">
            <tui-icon icon="@tui.power" class="field-icon"></tui-icon>
            {{ 'status' | translate }}
          </label>
          <tui-textfield tuiChevron tuiTextfieldSize="m" class="form-input">
            <input
              tuiSelect
              id="headquarter-status"
              formControlName="status"
              [placeholder]="'select_status' | translate"
            />
            <tui-data-list-wrapper *tuiTextfieldDropdown new [items]="statusOptions" />
          </tui-textfield>
          <tui-error formControlName="status" [error]="[] | tuiFieldError | async"></tui-error>
        </div>

        <div class="form-actions">
          <button
            tuiButton
            type="button"
            appearance="secondary"
            size="l"
            iconStart="@tui.x"
            (click)="onCancel()"
            [disabled]="isSubmitting()"
            class="cancel-button"
          >
            {{ 'cancel' | translate }}
          </button>
          <button
            tuiButton
            type="submit"
            appearance="primary"
            size="l"
            [iconStart]="isEditMode() ? '@tui.check' : '@tui.plus'"
            [disabled]="form.invalid || isSubmitting()"
            [loading]="isSubmitting()"
            class="submit-button"
          >
            {{ isEditMode() ? ('update_headquarter' | translate) : ('create_headquarter' | translate) }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .headquarter-form {
      min-width: 500px;
      max-width: 600px;
    }

    .form-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 2.5rem 2rem 1.5rem;
      border-bottom: 1px solid var(--tui-border-normal);
    }

    .form-icon {
      display: block;
      font-size: 3.5rem;
      margin-bottom: 1.5rem;
      color: var(--tui-background-accent-1);
    }

    .heading {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0 0 0.75rem;
      color: var(--tui-text-primary);
      line-height: 1.3;
    }

    .form-description {
      color: var(--tui-text-secondary);
      margin: 0;
      font-size: 1rem;
      line-height: 1.5;
    }

    .form-content {
      padding: 2rem 2.5rem;
    }

    .form-field {
      margin-bottom: 1.75rem;
    }

    .form-field:last-of-type {
      margin-bottom: 0;
    }

    .field-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      color: var(--tui-text-primary);
      margin-bottom: 0.75rem;
      font-size: 0.9375rem;
      cursor: pointer;
    }

    .field-icon {
      font-size: 1.125rem;
      color: var(--tui-background-accent-1);
      opacity: 0.8;
    }

    .form-input {
      width: 100%;
    }

    .field-hint {
      font-size: 0.8125rem;
      color: var(--tui-text-tertiary);
      margin-top: 0.5rem;
      padding-left: 0.25rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      align-items: center;
      padding: 1.5rem 2rem 2rem;
      border-top: 1px solid var(--tui-border-normal);
    }

    .cancel-button {
      min-width: 140px;
    }

    .submit-button {
      min-width: 140px;
    }

    @media (max-width: 580px) {
      .headquarter-form {
        min-width: 320px;
      }

      .form-content {
        padding: 1.5rem;
      }

      .form-actions {
        flex-direction: column-reverse;
        gap: 0.75rem;
      }

      .cancel-button,
      .submit-button {
        width: 100%;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    tuiItemsHandlersProvider({
      stringify: signal((item: string | { name: string; id: string }) => {
        if (typeof item === 'string') {
          return item === 'active' ? '✓ Active' : '✗ Inactive';
        }
        return item.name;
      }),
    }),
  ],
})
export class HeadquarterFormModalSmartComponent {
  private readonly fb = inject(FormBuilder);
  private readonly countriesFacade = inject(CountriesFacadeService);
  readonly context = injectContext<TuiDialogContext<HeadquarterFormData | null, Headquarter | null>>();

  isSubmitting = signal(false);
  isEditMode = signal(false);

  form: FormGroup;

  readonly statusOptions = ['active', 'inactive'] as const;

  countryOptions = computed(() => {
    const countries = this.countriesFacade.countriesResource();
    if (!countries) return [];

    return countries
      .filter((country) => country.status === 'active')
      .map((country) => ({
        id: country.id,
        name: `${country.name} (${country.code})`,
      }));
  });

  constructor() {
    const headquarter = this.context.data;
    this.isEditMode.set(!!headquarter);

    this.form = this.fb.group({
      name: [headquarter?.name || '', [Validators.required, Validators.minLength(2)]],
      address: [headquarter?.address || ''],
      country_id: [headquarter?.country_id || null],
      status: [headquarter?.status || 'active', [Validators.required]],
    });

    this.countriesFacade.countries.reload();
  }

  async onSubmit(): Promise<void> {
    if (this.form.valid && !this.isSubmitting()) {
      this.isSubmitting.set(true);

      try {
        const formData: HeadquarterFormData = {
          name: this.form.value.name,
          address: this.form.value.address || null,
          country_id: this.form.value.country_id || null,
          status: this.form.value.status,
        };
        this.context.completeWith(formData);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        this.isSubmitting.set(false);
      }
    }
  }

  onCancel(): void {
    this.context.completeWith(null);
  }
}
