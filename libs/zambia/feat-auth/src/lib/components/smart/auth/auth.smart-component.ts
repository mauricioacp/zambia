import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';

import { FormFieldComponent, logoSvg, ThemeService } from '@zambia/ui-components';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthService } from '@zambia/data-access-auth';
import { Router } from '@angular/router';
import { TuiButton } from '@taiga-ui/core';
import { TuiButtonLoading } from '@taiga-ui/kit';
import { NotificationService } from '@zambia/data-access-generic';

interface AuthFormData {
  email: string;
  password: string;
}

@Component({
  selector: 'z-auth',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, TranslatePipe, FormFieldComponent, TuiButton, TuiButtonLoading],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        height: 100vh;
      }
    `,
  ],
  template: `
    <div class="auth-container min-h-dvh bg-gray-100 dark:bg-gray-900 dark:text-gray-100">
      <main class="flex max-w-full flex-auto flex-col">
        <div class="mx-auto flex min-h-dvh w-full items-center justify-center p-4 lg:p-8">
          <div class="w-full max-w-lg lg:py-16">
            <div class="bg-primary flex flex-col overflow-hidden rounded-lg shadow-lg md:flex-row">
              <!-- Form Section -->
              <section class="bg-gray-100 px-6 py-10 md:px-10 lg:p-16 dark:bg-gray-800">
                <header class="mb-8 text-center">
                  <h1 class="text-primary mb-2 inline-flex items-center gap-2 text-2xl font-bold">
                    <div [innerHTML]="safeSvg" [class.dark-logo]="isDarkMode()"></div>
                    <span>{{ 'the.akademy' | translate }}</span>
                  </h1>
                  <h2 class="text-secondary text-sm font-medium">
                    {{ 'welcome-log-in' | translate }}
                  </h2>
                </header>

                <form [formGroup]="authForm" class="space-y-6" (ngSubmit)="onSubmit()">
                  <z-form-field
                    [control]="emailControl"
                    label="email"
                    type="email"
                    [placeholder]="'enter-your-email' | translate"
                    [errorMessage]="'invalid-email' | translate"
                  />

                  <z-form-field
                    [control]="passwordControl"
                    label="password"
                    type="password"
                    [placeholder]="'enter-your-password' | translate"
                    [errorMessage]="'password-min-length-error' | translate"
                  />

                  <!-- todo recover password <div class="flex items-center justify-between pt-2">
                     <a routerLink="/auth/forgot-password" class="text-sm font-medium text-blue-600 hover:text-blue-500">
                       {{ 'forgot-password' | translate }}
                     </a>
                   </div> -->

                  <div class="pt-4">
                    <button
                      tuiButton
                      type="submit"
                      size="l"
                      appearance="primary"
                      class="w-full"
                      iconStart="@tui.log-in"
                      [disabled]="authForm.invalid"
                      [loading]="isSubmitting()"
                    >
                      {{ 'log-in' | translate }}
                    </button>
                  </div>

                  @if (signInError) {
                    <div class="mt-4 text-sm text-red-600">
                      {{ signInError | translate }}
                    </div>
                  }
                </form>

                <!-- todo register form new signatures <div class="text-secondary mt-6 text-center text-sm">
                  {{ 'no-account' | translate }}
                  <a class="font-medium text-blue-600 hover:text-blue-500">
                    {{ 'sign-up' | translate }}
                  </a>
                </div>-->
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
})
export class AuthSmartComponent implements OnInit {
  private router = inject(Router);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly themeService = inject(ThemeService);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly translate = inject(TranslateService);

  readonly safeSvg = this.sanitizer.bypassSecurityTrustHtml(logoSvg);
  readonly isDarkMode = this.themeService.isDarkTheme;
  readonly isSubmitting = signal(false);

  signInError = '';

  readonly authForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  get emailControl() {
    return this.authForm.get('email') as FormControl;
  }

  get passwordControl() {
    return this.authForm.get('password') as FormControl;
  }

  ngOnInit(): void {
    // Solo redirigir si está autenticado y no está en proceso de logout
    if (this.authService.isAuthenticated() && !this.authService.acting()) {
      this.router.navigate(['/dashboard/panel']);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.authForm.valid && !this.isSubmitting()) {
      this.isSubmitting.set(true);
      this.signInError = '';

      const { email, password } = this.authForm.value as AuthFormData;

      try {
        const success = await this.authService.signIn(email, password);

        if (success) {
          await this.handleSuccessfulLogin(email);
        } else {
          this.handleAuthError('invalid_login');
        }
      } catch (error: unknown) {
        this.handleSignInError(error);
      } finally {
        this.isSubmitting.set(false);
      }
    }
  }

  private async handleSuccessfulLogin(email: string): Promise<void> {
    this.notificationService
      .showSuccess('login_success', {
        translateParams: { name: email.split('@')[0] },
      })
      .subscribe();

    this.authForm.reset();
    await this.router.navigate(['/dashboard/home']);
  }

  private handleSignInError(error: unknown): void {
    const errorKey = this.mapErrorToKey(error);
    this.handleAuthError(errorKey);
  }

  private mapErrorToKey(error: unknown): string {
    if (!error || typeof error !== 'object') {
      return 'auth_error_generic';
    }

    const errorObj = error as { message?: string; name?: string };
    const message = errorObj.message?.toLowerCase() || '';
    const name = errorObj.name || '';

    if (message.includes('failed to fetch') || name === 'AuthRetryableFetchError' || message.includes('network')) {
      return 'network_error';
    }

    if (message.includes('invalid login')) {
      return 'invalid_login';
    }

    if (message.includes('email not confirmed')) {
      return 'email_not_confirmed';
    }

    if (message.includes('too many requests')) {
      return 'too_many_attempts';
    }

    return 'auth_error_generic';
  }

  private handleAuthError(errorKey: string): void {
    errorKey = this.translate.instant(errorKey);
    this.signInError = errorKey;
    this.notificationService
      .showError(errorKey, {
        autoClose: 7000,
      })
      .subscribe();
  }
}
