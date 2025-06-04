import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@taiga-ui/polymorpheus';
import { TranslateModule } from '@ngx-translate/core';
import { TuiButton, TuiError, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiFieldErrorPipe } from '@taiga-ui/kit';

interface PasswordResetData {
  name: string;
  lastName: string;
  email: string;
}

@Component({
  selector: 'z-password-reset-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    TuiButton,
    TuiIcon,
    TuiTextfield,
    TuiError,
    TuiFieldErrorPipe,
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="p-6">
      <div class="mb-6">
        <h3 class="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
          {{ 'reset_password' | translate }}
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{ 'reset_password_for' | translate }}: <strong>{{ userData.name }} {{ userData.lastName }}</strong>
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-500">{{ userData.email }}</p>
      </div>

      <div class="space-y-4">
        <div>
          <label for="newPassword" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ 'new_password' | translate }} <span class="text-red-500">*</span>
          </label>
          <input
            id="newPassword"
            tuiTextfield
            type="password"
            formControlName="newPassword"
            [placeholder]="'enter_new_password' | translate"
            class="w-full"
          />
          @if (form.controls.newPassword.touched && form.controls.newPassword.errors) {
            <tui-error [error]="passwordError() | tuiFieldError | async" class="mt-1"></tui-error>
          }
        </div>

        <div>
          <label for="confirmPassword" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ 'confirm_password' | translate }} <span class="text-red-500">*</span>
          </label>
          <input
            id="confirmPassword"
            tuiTextfield
            type="password"
            formControlName="confirmPassword"
            [placeholder]="'confirm_new_password' | translate"
            class="w-full"
          />
          @if (form.controls.confirmPassword.touched && confirmPasswordError().length > 0) {
            <tui-error [error]="confirmPasswordError() | tuiFieldError | async" class="mt-1"></tui-error>
          }
        </div>

        @if (passwordStrength()) {
          <div class="rounded-lg bg-gray-50 p-3 dark:bg-slate-800">
            <p class="mb-2 text-xs font-medium text-gray-600 dark:text-gray-400">
              {{ 'password_strength' | translate }}:
            </p>
            <div class="mb-2 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                class="h-full transition-all duration-300"
                [class]="passwordStrengthClass()"
                [style.width.%]="passwordStrengthPercentage()"
              ></div>
            </div>
            <p class="text-xs" [class]="passwordStrengthTextClass()">
              {{ passwordStrengthText() }}
            </p>
          </div>
        }
      </div>

      <div class="mt-6 flex justify-end gap-3">
        <button tuiButton appearance="secondary" size="m" type="button" (click)="cancel()">
          {{ 'cancel' | translate }}
        </button>
        <button tuiButton appearance="primary" size="m" type="submit" [disabled]="!form.valid || isSubmitting()">
          @if (isSubmitting()) {
            <tui-icon icon="@tui.loader" class="animate-spin"></tui-icon>
            {{ 'resetting' | translate }}...
          } @else {
            {{ 'reset_password' | translate }}
          }
        </button>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordResetModalComponent {
  private readonly context =
    inject<TuiDialogContext<{ newPassword: string } | null, PasswordResetData>>(POLYMORPHEUS_CONTEXT);

  protected isSubmitting = signal(false);

  protected form = new FormGroup({
    newPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
    ]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  protected passwordStrength = signal<'weak' | 'medium' | 'strong' | null>(null);

  constructor() {
    // Watch password changes for strength calculation
    this.form.controls.newPassword.valueChanges.subscribe((value) => {
      this.calculatePasswordStrength(value || '');
      this.validatePasswordMatch();
    });

    this.form.controls.confirmPassword.valueChanges.subscribe(() => {
      this.validatePasswordMatch();
    });
  }

  get userData(): PasswordResetData {
    return this.context.data;
  }

  protected passwordError = signal<string[]>([]);
  protected confirmPasswordError = signal<string[]>([]);

  private calculatePasswordStrength(password: string): void {
    if (!password) {
      this.passwordStrength.set(null);
      return;
    }

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;

    if (strength <= 2) this.passwordStrength.set('weak');
    else if (strength <= 4) this.passwordStrength.set('medium');
    else this.passwordStrength.set('strong');
  }

  protected passwordStrengthPercentage(): number {
    const strength = this.passwordStrength();
    if (!strength) return 0;
    return strength === 'weak' ? 33 : strength === 'medium' ? 66 : 100;
  }

  protected passwordStrengthClass(): string {
    const strength = this.passwordStrength();
    if (!strength) return '';
    return strength === 'weak' ? 'bg-red-500' : strength === 'medium' ? 'bg-yellow-500' : 'bg-emerald-500';
  }

  protected passwordStrengthTextClass(): string {
    const strength = this.passwordStrength();
    if (!strength) return '';
    return strength === 'weak'
      ? 'text-red-600 dark:text-red-400'
      : strength === 'medium'
        ? 'text-yellow-600 dark:text-yellow-400'
        : 'text-emerald-600 dark:text-emerald-400';
  }

  protected passwordStrengthText(): string {
    const strength = this.passwordStrength();
    if (!strength) return '';
    return strength === 'weak' ? 'Weak' : strength === 'medium' ? 'Medium' : 'Strong';
  }

  private validatePasswordMatch(): void {
    const password = this.form.controls.newPassword.value;
    const confirmPassword = this.form.controls.confirmPassword.value;

    if (password && confirmPassword && password !== confirmPassword) {
      this.form.controls.confirmPassword.setErrors({ mismatch: true });
      this.confirmPasswordError.set(['Passwords do not match']);
    } else {
      this.form.controls.confirmPassword.setErrors(null);
      this.confirmPasswordError.set([]);
    }
  }

  onSubmit(): void {
    if (this.form.valid && !this.isSubmitting()) {
      this.isSubmitting.set(true);
      const newPassword = this.form.controls.newPassword.value || '';
      this.context.completeWith({ newPassword });
    }
  }

  cancel(): void {
    this.context.completeWith(null);
  }
}
