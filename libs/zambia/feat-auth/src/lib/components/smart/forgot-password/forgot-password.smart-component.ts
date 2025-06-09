import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { AkademyEdgeFunctionsService } from '@zambia/data-access-generic';
import { NotificationService } from '@zambia/data-access-generic';
import { DomSanitizer } from '@angular/platform-browser';
import { logoSvg, ThemeService, FormFieldComponent } from '@zambia/ui-components';

@Component({
  selector: 'z-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslateModule, TuiButton, TuiIcon, FormFieldComponent],
  template: `
    <div class="min-h-dvh bg-gray-100 dark:bg-gray-900 dark:text-gray-100">
      <main class="flex max-w-full flex-auto flex-col">
        <div class="mx-auto flex min-h-dvh w-full items-center justify-center p-4 lg:p-8">
          <div class="w-full max-w-lg lg:py-16">
            <!-- Glass Card Container -->
            <div
              class="group relative overflow-hidden rounded-2xl border border-gray-200/50 bg-white/90 shadow-lg shadow-gray-900/5 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/90 dark:shadow-slate-900/20"
            >
              <!-- Background Gradient Effect -->
              <div
                class="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-transparent to-emerald-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              ></div>

              <!-- Content Section -->
              <section class="relative z-10 px-6 py-10 md:px-10 lg:p-16">
                <!-- Header -->
                <header class="mb-8 text-center">
                  <div class="mb-6">
                    <div [innerHTML]="safeSvg" [class.dark-logo]="isDarkMode()" class="mx-auto mb-4"></div>
                    <h1 class="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                      {{ 'forgot_password' | translate }}
                    </h1>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      {{ 'forgot_password_description' | translate }}
                    </p>
                  </div>
                </header>

                <!-- Form Steps -->
                <div class="mb-6">
                  <!-- Step Indicator -->
                  <div class="flex items-center justify-center space-x-2">
                    @for (step of [1, 2]; track step) {
                      <div class="flex items-center">
                        <div
                          class="flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all duration-300"
                          [class]="
                            currentStep() >= step
                              ? 'bg-sky-600 text-white dark:bg-sky-500'
                              : 'bg-gray-200 text-gray-500 dark:bg-slate-700 dark:text-gray-400'
                          "
                        >
                          {{ step }}
                        </div>
                        @if (step < 2) {
                          <div
                            class="ml-2 h-0.5 w-16 transition-all duration-300"
                            [class]="
                              currentStep() > step ? 'bg-sky-600 dark:bg-sky-500' : 'bg-gray-200 dark:bg-slate-700'
                            "
                          ></div>
                        }
                      </div>
                    }
                  </div>
                  <div class="mt-4 text-center">
                    <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {{
                        currentStep() === 1
                          ? ('step_1_user_identification' | translate)
                          : ('step_2_new_password' | translate)
                      }}
                    </p>
                  </div>
                </div>

                <!-- Step 1: User Identification -->
                @if (currentStep() === 1) {
                  <form [formGroup]="identificationForm" (ngSubmit)="verifyUser()" class="space-y-6">
                    <z-form-field
                      [control]="$any(identificationForm.controls.email)"
                      label="email"
                      type="email"
                      [placeholder]="'enter_your_email' | translate"
                      [errorMessage]="getEmailErrorMessage()"
                    ></z-form-field>

                    <z-form-field
                      [control]="$any(identificationForm.controls.documentNumber)"
                      label="document_number"
                      type="text"
                      [placeholder]="'enter_document_number' | translate"
                      [errorMessage]="'document_number_required' | translate"
                    ></z-form-field>

                    <z-form-field
                      [control]="$any(identificationForm.controls.phone)"
                      label="phone"
                      type="tel"
                      [placeholder]="'enter_phone_number' | translate"
                      [errorMessage]="'phone_required' | translate"
                    ></z-form-field>

                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <z-form-field
                        [control]="$any(identificationForm.controls.firstName)"
                        label="first_name"
                        type="text"
                        [placeholder]="'enter_first_name' | translate"
                        [errorMessage]="'first_name_required' | translate"
                      ></z-form-field>

                      <z-form-field
                        [control]="$any(identificationForm.controls.lastName)"
                        label="last_name"
                        type="text"
                        [placeholder]="'enter_last_name' | translate"
                        [errorMessage]="'last_name_required' | translate"
                      ></z-form-field>
                    </div>

                    <div class="flex items-center justify-between pt-4">
                      <a
                        routerLink="/auth"
                        class="inline-flex items-center gap-2 text-sm font-medium text-sky-600 transition-colors hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300"
                      >
                        <tui-icon icon="@tui.arrow-left" class="!h-4 !w-4"></tui-icon>
                        {{ 'back_to_login' | translate }}
                      </a>
                      <button
                        tuiButton
                        type="submit"
                        size="m"
                        appearance="primary"
                        [iconEnd]="isVerifying() ? '' : '@tui.arrow-right'"
                        [disabled]="identificationForm.invalid || isVerifying()"
                      >
                        @if (isVerifying()) {
                          <tui-icon icon="@tui.loader-2" class="mr-2 animate-spin"></tui-icon>
                          {{ 'loading' | translate }}
                        } @else {
                          {{ 'continue' | translate }}
                        }
                      </button>
                    </div>
                  </form>
                }

                <!-- Step 2: New Password -->
                @if (currentStep() === 2) {
                  <form [formGroup]="passwordForm" (ngSubmit)="resetPassword()" class="space-y-6">
                    <!-- User Info Display -->
                    <div class="rounded-lg bg-sky-50 p-4 dark:bg-slate-700/50">
                      <div class="flex items-center gap-3">
                        <div
                          class="flex h-12 w-12 items-center justify-center rounded-full bg-sky-600 text-white dark:bg-sky-500"
                        >
                          <tui-icon icon="@tui.user" class="!h-6 !w-6"></tui-icon>
                        </div>
                        <div>
                          <p class="font-semibold text-gray-900 dark:text-white">
                            {{ userInfo().firstName }} {{ userInfo().lastName }}
                          </p>
                          <p class="text-sm text-gray-600 dark:text-gray-400">{{ userInfo().email }}</p>
                        </div>
                      </div>
                    </div>

                    <z-form-field
                      [control]="$any(passwordForm.controls.newPassword)"
                      label="new_password"
                      type="password"
                      [placeholder]="'enter_new_password' | translate"
                      [errorMessage]="getPasswordErrorMessage()"
                    ></z-form-field>

                    <z-form-field
                      [control]="$any(passwordForm.controls.confirmPassword)"
                      label="confirm_password"
                      type="password"
                      [placeholder]="'confirm_new_password' | translate"
                      [errorMessage]="getConfirmPasswordErrorMessage()"
                    ></z-form-field>

                    <!-- Password Strength Indicator -->
                    @if (passwordStrength()) {
                      <div class="rounded-lg bg-gray-50 p-4 dark:bg-slate-800">
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
                          {{ passwordStrengthText() | translate }}
                        </p>
                      </div>
                    }

                    <div class="flex items-center justify-between pt-4">
                      <button
                        tuiButton
                        type="button"
                        size="m"
                        appearance="secondary"
                        iconStart="@tui.arrow-left"
                        (click)="goBack()"
                      >
                        {{ 'back' | translate }}
                      </button>
                      <button
                        tuiButton
                        type="submit"
                        size="m"
                        appearance="primary"
                        [iconStart]="isResetting() ? '' : '@tui.lock'"
                        [disabled]="passwordForm.invalid || isResetting()"
                      >
                        @if (isResetting()) {
                          <tui-icon icon="@tui.loader-2" class="mr-2 animate-spin"></tui-icon>
                          {{ 'loading' | translate }}
                        } @else {
                          {{ 'reset_password' | translate }}
                        }
                      </button>
                    </div>
                  </form>
                }

                <!-- Success State -->
                @if (isSuccess()) {
                  <div class="text-center">
                    <div
                      class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600"
                    >
                      <tui-icon icon="@tui.check" class="!h-10 !w-10 text-white"></tui-icon>
                    </div>
                    <h2 class="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                      {{ 'password_reset_success' | translate }}
                    </h2>
                    <p class="mb-8 text-sm text-gray-600 dark:text-gray-400">
                      {{ 'password_reset_success_description' | translate }}
                    </p>
                    <a
                      routerLink="/auth"
                      tuiButton
                      appearance="primary"
                      size="l"
                      iconStart="@tui.log-in"
                      class="inline-flex"
                    >
                      {{ 'go_to_login' | translate }}
                    </a>
                  </div>
                }
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordSmartComponent {
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);
  private themeService = inject(ThemeService);
  private edgeFunctionsService = inject(AkademyEdgeFunctionsService);
  private notificationService = inject(NotificationService);

  readonly safeSvg = this.sanitizer.bypassSecurityTrustHtml(logoSvg);
  readonly isDarkMode = this.themeService.isDarkTheme;

  currentStep = signal(1);
  isVerifying = signal(false);
  isResetting = signal(false);
  isSuccess = signal(false);

  userInfo = signal({
    email: '',
    firstName: '',
    lastName: '',
  });

  identificationForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    documentNumber: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
  });

  passwordForm = new FormGroup({
    newPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
    ]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  passwordStrength = signal<'weak' | 'medium' | 'strong' | null>(null);
  confirmPasswordError = signal<string[]>([]);

  constructor() {
    // Watch password changes
    this.passwordForm.controls.newPassword.valueChanges.subscribe((value) => {
      this.calculatePasswordStrength(value || '');
      this.validatePasswordMatch();
    });

    this.passwordForm.controls.confirmPassword.valueChanges.subscribe(() => {
      this.validatePasswordMatch();
    });
  }

  getEmailErrorMessage(): string {
    const control = this.identificationForm.controls.email;
    if (control.errors?.['required']) return 'email_required';
    if (control.errors?.['email']) return 'invalid_email';
    return '';
  }

  getPasswordErrorMessage(): string {
    const control = this.passwordForm.controls.newPassword;
    if (control.errors?.['required']) return 'password_required';
    if (control.errors?.['minlength']) return 'password_min_length';
    if (control.errors?.['pattern']) return 'password_pattern_error';
    return '';
  }

  getConfirmPasswordErrorMessage(): string {
    return this.confirmPasswordError().length > 0 ? this.confirmPasswordError()[0] : '';
  }

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

  passwordStrengthPercentage(): number {
    const strength = this.passwordStrength();
    if (!strength) return 0;
    return strength === 'weak' ? 33 : strength === 'medium' ? 66 : 100;
  }

  passwordStrengthClass(): string {
    const strength = this.passwordStrength();
    if (!strength) return '';
    return strength === 'weak' ? 'bg-red-500' : strength === 'medium' ? 'bg-yellow-500' : 'bg-emerald-500';
  }

  passwordStrengthTextClass(): string {
    const strength = this.passwordStrength();
    if (!strength) return '';
    return strength === 'weak'
      ? 'text-red-600 dark:text-red-400'
      : strength === 'medium'
        ? 'text-yellow-600 dark:text-yellow-400'
        : 'text-emerald-600 dark:text-emerald-400';
  }

  passwordStrengthText(): string {
    const strength = this.passwordStrength();
    if (!strength) return '';
    return strength === 'weak' ? 'weak_password' : strength === 'medium' ? 'medium_password' : 'strong_password';
  }

  private validatePasswordMatch(): void {
    const password = this.passwordForm.controls.newPassword.value;
    const confirmPassword = this.passwordForm.controls.confirmPassword.value;

    if (password && confirmPassword && password !== confirmPassword) {
      this.passwordForm.controls.confirmPassword.setErrors({ mismatch: true });
      this.confirmPasswordError.set(['passwords_do_not_match']);
    } else {
      this.passwordForm.controls.confirmPassword.setErrors(null);
      this.confirmPasswordError.set([]);
    }
  }

  async verifyUser(): Promise<void> {
    if (this.identificationForm.valid && !this.isVerifying()) {
      this.isVerifying.set(true);

      // Store user info for next step
      this.userInfo.set({
        email: this.identificationForm.value.email || '',
        firstName: this.identificationForm.value.firstName || '',
        lastName: this.identificationForm.value.lastName || '',
      });

      // Simulate verification (in real app, you might want to verify the user exists)
      setTimeout(() => {
        this.isVerifying.set(false);
        this.currentStep.set(2);
      }, 1000);
    }
  }

  async resetPassword(): Promise<void> {
    if (this.passwordForm.valid && !this.isResetting()) {
      this.isResetting.set(true);

      try {
        const response = await this.edgeFunctionsService.resetPassword({
          email: this.identificationForm.value.email || '',
          document_number: this.identificationForm.value.documentNumber || '',
          new_password: this.passwordForm.value.newPassword || '',
          phone: this.identificationForm.value.phone || '',
          first_name: this.identificationForm.value.firstName || '',
          last_name: this.identificationForm.value.lastName || '',
        });

        if (response.data?.success) {
          this.isSuccess.set(true);
          this.notificationService.showSuccess('password_reset_success').subscribe();
        } else {
          this.notificationService.showError(response.error || 'password_reset_failed').subscribe();
        }
      } catch {
        this.notificationService.showError('password_reset_failed').subscribe();
      } finally {
        this.isResetting.set(false);
      }
    }
  }

  goBack(): void {
    this.currentStep.set(1);
    this.passwordForm.reset();
    this.passwordStrength.set(null);
  }
}
