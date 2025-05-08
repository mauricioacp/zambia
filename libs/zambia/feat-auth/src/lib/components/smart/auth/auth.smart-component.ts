import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormFieldComponent, logoSvg, ThemeService } from '@zambia/ui-components';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '@zambia/data-access-auth';
import { Router } from '@angular/router';

interface AuthFormData {
  email: string;
  password: string;
}

@Component({
  selector: 'z-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, TranslatePipe, FormFieldComponent],
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
                    <div [innerHTML]="safeSvg" [class.dark-logo]="isDarkMode"></div>
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

                  <div class="flex items-center justify-between pt-2">
                    <a class="text-sm font-medium text-blue-600 hover:text-blue-500">
                      {{ 'forgot-password' | translate }}
                    </a>
                  </div>

                  <button
                    type="submit"
                    class="w-full rounded-lg bg-blue-600 px-5 py-3 text-white transition hover:bg-blue-700 focus:ring-3 focus:ring-blue-500/50 disabled:opacity-50"
                    [disabled]="authForm.invalid || isLoading()"
                  >
                    @if (isLoading()) {
                      <span>{{ 'loading' | translate }}...</span>
                    } @else {
                      <span>{{ 'log-in' | translate }}</span>
                    }
                  </button>

                  @if (signInError) {
                    <div class="mt-4 text-sm text-red-600">
                      {{ signInError | translate }}
                    </div>
                  }
                </form>

                <div class="text-secondary mt-6 text-center text-sm">
                  {{ 'no-account' | translate }}
                  <a class="font-medium text-blue-600 hover:text-blue-500">
                    {{ 'sign-up' | translate }}
                  </a>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
})
export class AuthSmartComponent {
  private router = inject(Router);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly themeService = inject(ThemeService);
  private readonly authService = inject(AuthService);

  readonly safeSvg = this.sanitizer.bypassSecurityTrustHtml(logoSvg);
  readonly isDarkMode = this.themeService.isDarkTheme;
  readonly isLoading = this.authService.acting;

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

  async onSubmit(): Promise<void> {
    if (this.authForm.valid) {
      const { email, password } = this.authForm.value as AuthFormData;

      const success = await this.authService.signIn(email, password);
      if (success) {
        this.authForm.reset();
        await this.router.navigate(['/dashboard/panel']);
      } else {
        this.signInError = 'invalid_login';
      }
    }
  }
}
