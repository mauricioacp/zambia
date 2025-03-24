import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { logoSvg } from '@zambia/ui-components';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

interface AuthFormData {
  email: string;
  password: string;
}

@Component({
  selector: 'z-auth',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, TranslatePipe],
  template: `
    <!-- Pages: Log in -->
    <!-- Page Container -->
    <div
      id="page-container"
      class="mx-auto flex min-h-dvh w-full min-w-80 flex-col bg-gray-100 dark:bg-gray-900 dark:text-gray-100">
      <!-- Page Content -->
      <main id="page-content" class="flex max-w-full flex-auto flex-col">
        <div
          class="relative mx-auto flex min-h-dvh w-full max-w-10xl items-center justify-center overflow-hidden p-4 lg:p-8">
          <!-- Log In Section -->
          <section class="w-full max-w-xl py-6">
            <!-- Header -->
            <header class="mb-10 text-center">
              <h1 class="mb-2 inline-flex items-center gap-2 text-2xl font-bold">
                <div [innerHTML]="safeSvg"></div>

                <span>{{ 'the.akademy' | translate }}</span>
              </h1>
              <h2 class="text-sm font-medium text-gray-500 dark:text-gray-400">
                {{ 'welcome-log-in' | translate }}
              </h2>
            </header>
            <!-- END Header -->

            <!-- Sign In Form -->
            <div
              class="flex flex-col overflow-hidden rounded-lg bg-white shadow-xs dark:bg-gray-800 dark:text-gray-100">
              <div class="grow p-5 md:px-16 md:py-12">
                <form [formGroup]="authForm" class="space-y-6" (ngSubmit)="onSubmit()">
                  <div class="space-y-1">
                    <label for="email" class="inline-block text-sm font-medium">{{ 'email' | translate }}</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      formControlName="email"
                      placeholder="{{ 'enter-your-email' | translate }}"
                      [class.border-red-500]="showEmailError"
                      class="block w-full rounded-lg border border-gray-200 px-5 py-3 leading-6 placeholder-gray-500 focus:border-blue-500 focus:ring-3 focus:ring-blue-500/50 dark:border-gray-600 dark:bg-gray-800 dark:placeholder-gray-400 dark:focus:border-blue-500" />
                    <span *ngIf="showEmailError" class="text-red-300 text-xs mt-1">
                      {{ 'invalid-email' | translate }}
                    </span>
                  </div>
                  <div class="space-y-1">
                    <label for="password" class="inline-block text-sm font-medium">{{ 'password' | translate }}</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      formControlName="password"
                      placeholder="{{ 'enter-your-password' | translate }}"
                      [class.border-red-500]="showPasswordError"
                      class="block w-full rounded-lg border border-gray-200 px-5 py-3 leading-6 placeholder-gray-500 focus:border-blue-500 focus:ring-3 focus:ring-blue-500/50 dark:border-gray-600 dark:bg-gray-800 dark:placeholder-gray-400 dark:focus:border-blue-500" />
                    <span *ngIf="showPasswordError" class="text-red-300 text-xs mt-1">
                      {{ 'password-min-length-error' | translate }}
                    </span>
                  </div>
                  <div>
                    <div class="mb-5 flex items-center justify-between gap-2">
                      <label class="flex items-center">
                        <input
                          type="checkbox"
                          id="remember_me"
                          name="remember_me"
                          class="size-4 rounded-sm border border-gray-200 text-blue-500 checked:border-blue-500 focus:border-blue-500 focus:ring-3 focus:ring-blue-500/50 dark:border-gray-600 dark:bg-gray-800 dark:ring-offset-gray-900 dark:checked:border-transparent dark:checked:bg-blue-500 dark:focus:border-blue-500" />
                        <span class="ml-2 text-sm">{{ 'remember-me' | translate }}</span>
                      </label>
                      <a
                        href="javascript:void(0)"
                        class="inline-block text-sm font-medium text-blue-600 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300">
                        {{ 'forgot-password' | translate }}
                      </a>
                    </div>
                    <button
                      type="submit"
                      [disabled]="!authForm.valid"
                      class="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-blue-700 bg-blue-700 px-6 py-3 leading-6 font-semibold text-white hover:border-blue-600 hover:bg-blue-600 hover:text-white focus:ring-3 focus:ring-blue-400/50 active:border-blue-700 active:bg-blue-700 dark:focus:ring-blue-400/90">
                      <svg
                        class="hi-mini hi-arrow-uturn-right inline-block size-5 opacity-50"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true">
                        <path
                          fill-rule="evenodd"
                          d="M12.207 2.232a.75.75 0 00.025 1.06l4.146 3.958H6.375a5.375 5.375 0 000 10.75H9.25a.75.75 0 000-1.5H6.375a3.875 3.875 0 010-7.75h10.003l-4.146 3.957a.75.75 0 001.036 1.085l5.5-5.25a.75.75 0 000-1.085l-5.5-5.25a.75.75 0 00-1.06.025z"
                          clip-rule="evenodd" />
                      </svg>
                      <span>{{ 'log-in' | translate }}</span>
                    </button>
                  </div>
                </form>
              </div>
              <div class="grow bg-gray-50 p-5 text-center text-sm md:px-16 dark:bg-gray-700/50">
                {{ 'no-account' | translate }}
                <a
                  href="javascript:void(0)"
                  class="font-medium text-blue-600 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300">
                  {{ 'sign-up' | translate }}
                </a>
              </div>
            </div>
            <!-- END Sign In Form -->
            <!-- Footer -->
            <div class="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              Powered by
              <a
                href="https://github.com/mauricioacp"
                class="font-medium text-blue-600 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300">
                Mcp
              </a>
            </div>
            <!-- END Footer -->
          </section>
          <!-- END Log In Section -->
        </div>
      </main>
      <!-- END Page Content -->
    </div>
    <!-- END Page Container -->
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthSmartComponent {
  private readonly sanitizer = inject(DomSanitizer);

  protected readonly safeSvg = this.sanitizer.bypassSecurityTrustHtml(logoSvg);

  readonly authForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  get showEmailError() {
    const control = this.authForm.get('email');
    return control?.touched && control?.invalid;
  }

  get showPasswordError() {
    const control = this.authForm.get('password');
    return control?.touched && control?.invalid;
  }

  onSubmit() {
    if (this.authForm.valid) {
      const formValue = this.authForm.value as AuthFormData;
      console.log('Form submitted:', formValue);
    }
  }
}
