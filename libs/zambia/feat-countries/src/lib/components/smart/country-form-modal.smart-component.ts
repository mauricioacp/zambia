import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiError, TuiTextfield, TuiIcon } from '@taiga-ui/core';
import { TuiButtonLoading, TuiFieldErrorPipe } from '@taiga-ui/kit';
import { TuiAutoFocus } from '@taiga-ui/cdk';
import { injectContext } from '@taiga-ui/polymorpheus';
import { TranslatePipe } from '@ngx-translate/core';
import type { TuiDialogContext } from '@taiga-ui/core';
import { Country, CountryFormData } from '../../services/countries-facade.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'z-country-form-modal',
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
  ],
  template: `
    <div class="country-form">
      <div class="form-header">
        <tui-icon [icon]="isEditMode() ? '@tui.pencil' : '@tui.plus'" class="form-icon"></tui-icon>
        <h3 class="heading">
          {{ isEditMode() ? ('edit_country' | translate) : ('create_country' | translate) }}
        </h3>
        <p class="form-description">
          {{ isEditMode() ? ('edit_country_description' | translate) : ('create_country_description' | translate) }}
        </p>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form-content">
        <div class="form-field">
          <label class="field-label" for="country-name">
            <tui-icon icon="@tui.map-pin" class="field-icon"></tui-icon>
            {{ 'country_name' | translate }}
          </label>
          <tui-textfield tuiAutoFocus tuiTextfieldSize="l" class="form-input">
            <input
              tuiTextfield
              id="country-name"
              formControlName="name"
              [placeholder]="'enter_country_name' | translate"
            />
          </tui-textfield>
          <tui-error formControlName="name" [error]="[] | tuiFieldError | async"></tui-error>
        </div>

        <div class="form-field">
          <label class="field-label" for="country-code">
            <tui-icon icon="@tui.code" class="field-icon"></tui-icon>
            {{ 'country_code' | translate }}
          </label>
          <tui-textfield tuiTextfieldSize="l" class="form-input">
            <input
              tuiTextfield
              id="country-code"
              formControlName="code"
              [placeholder]="'enter_country_code' | translate"
              maxlength="3"
              style="text-transform: uppercase"
            />
          </tui-textfield>
          <tui-error formControlName="code" [error]="[] | tuiFieldError | async"></tui-error>
          <div class="field-hint">
            {{ 'country_code_hint' | translate }}
          </div>
        </div>

        <div class="form-field">
          <label class="field-label" for="country-status">
            <tui-icon icon="@tui.toggle-on" class="field-icon"></tui-icon>
            {{ 'status' | translate }}
          </label>
          <tui-textfield tuiTextfieldSize="l" class="form-input">
            <select tuiTextfield id="country-status" formControlName="status">
              <option value="" disabled>{{ 'select_status' | translate }}</option>
              <option value="active">{{ 'active' | translate }}</option>
              <option value="inactive">{{ 'inactive' | translate }}</option>
            </select>
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
            {{ isEditMode() ? ('update_country' | translate) : ('create_country' | translate) }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .country-form {
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
      background: var(--tui-base-02);
      border-bottom: 1px solid var(--tui-border-normal);
    }

    .form-icon {
      display: block;
      font-size: 3.5rem;
      color: var(--tui-primary);
      margin-bottom: 1.5rem;
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
      background: var(--tui-base-01);
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
      color: var(--tui-primary);
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
      background: var(--tui-base-02);
    }

    .cancel-button {
      min-width: 140px;
    }

    .submit-button {
      min-width: 140px;
    }

    @media (max-width: 580px) {
      .country-form {
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
})
export class CountryFormModalSmartComponent {
  private readonly fb = inject(FormBuilder);
  readonly context = injectContext<TuiDialogContext<CountryFormData | null, Country | null>>();

  isSubmitting = signal(false);
  isEditMode = signal(false);

  form: FormGroup;

  constructor() {
    const country = this.context.data;
    this.isEditMode.set(!!country);

    this.form = this.fb.group({
      name: [country?.name || '', [Validators.required, Validators.minLength(2)]],
      code: [country?.code || '', [Validators.required, Validators.minLength(2), Validators.maxLength(3)]],
      status: [country?.status || 'active', [Validators.required]],
    });
  }

  async onSubmit(): Promise<void> {
    if (this.form.valid && !this.isSubmitting()) {
      this.isSubmitting.set(true);

      try {
        const formData: CountryFormData = this.form.value;
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
