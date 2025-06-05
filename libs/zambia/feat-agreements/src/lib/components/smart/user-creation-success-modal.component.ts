import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@taiga-ui/polymorpheus';
import { TranslateModule } from '@ngx-translate/core';
import { TuiButton, TuiIcon, TuiAlertService } from '@taiga-ui/core';

interface UserCreationData {
  email: string;
  password: string;
  role: string;
  user_metadata: {
    first_name: string;
    last_name: string;
    phone: string;
  };
}

@Component({
  selector: 'z-user-creation-success-modal',
  imports: [CommonModule, TranslateModule, TuiButton, TuiIcon],
  template: `
    <div class="p-6">
      <div class="mb-4 flex items-center gap-3">
        <div class="rounded-full bg-emerald-100 p-3 dark:bg-emerald-900/20">
          <tui-icon icon="@tui.circle-check" class="text-2xl text-emerald-600 dark:text-emerald-400"></tui-icon>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
          {{ 'user_created_successfully' | translate }}
        </h3>
      </div>

      <div class="mb-6 space-y-4">
        <div class="rounded-lg bg-gray-50 p-4 dark:bg-slate-800">
          <p class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
            {{ 'user_details' | translate }}
          </p>
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ 'full_name' | translate }}:</span>
              <span class="font-medium text-gray-900 dark:text-white">
                {{ userData.user_metadata.first_name }} {{ userData.user_metadata.last_name }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ 'email' | translate }}:</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ userData.email }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ 'role' | translate }}:</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ userData.role }}</span>
            </div>
          </div>
        </div>

        <div class="rounded-lg border-2 border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
          <p class="mb-2 text-sm font-medium text-amber-800 dark:text-amber-200">
            {{ 'generated_password' | translate }}
          </p>
          <div class="mb-3 flex items-center justify-between rounded bg-white p-3 font-mono text-lg dark:bg-slate-800">
            <span class="text-gray-900 select-all dark:text-white">{{ userData.password }}</span>
            <button
              tuiButton
              size="xs"
              appearance="secondary"
              iconStart="@tui.copy"
              (click)="copyPassword()"
              class="ml-2"
            >
              {{ 'copy' | translate }}
            </button>
          </div>
          <p class="text-xs text-amber-700 dark:text-amber-300">
            <tui-icon icon="@tui.triangle-alert" class="mr-1"></tui-icon>
            {{ 'password_security_notice' | translate }}
          </p>
        </div>
      </div>

      <div class="flex justify-end gap-3">
        <button tuiButton appearance="primary" size="m" (click)="close()">
          {{ 'close' | translate }}
        </button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCreationSuccessModalComponent {
  private readonly context = inject<TuiDialogContext<void, UserCreationData>>(POLYMORPHEUS_CONTEXT);
  private readonly alerts = inject(TuiAlertService);

  get userData(): UserCreationData {
    console.log(this.context.data);
    return this.context.data;
  }

  copyPassword(): void {
    const password = this.userData.password;

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(password)
        .then(() => {
          this.alerts.open('Password copied to clipboard!', { appearance: 'positive' }).subscribe();
        })
        .catch((err) => {
          console.error('Failed to copy with clipboard API:', err);
          this.fallbackCopyToClipboard(password);
        });
    } else {
      this.fallbackCopyToClipboard(password);
    }
  }

  private fallbackCopyToClipboard(text: string): void {
    // Create a temporary textarea element
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);

    try {
      textArea.focus();
      textArea.select();

      const successful = document.execCommand('copy');
      if (successful) {
        this.alerts.open('Password copied to clipboard!', { appearance: 'positive' }).subscribe();
      } else {
        this.alerts.open('Failed to copy password. Please copy manually.', { appearance: 'negative' }).subscribe();
      }
    } catch (err) {
      console.error('Fallback copy failed:', err);
      this.alerts.open('Failed to copy password. Please copy manually.', { appearance: 'negative' }).subscribe();
    } finally {
      document.body.removeChild(textArea);
    }
  }

  close(): void {
    this.context.completeWith();
  }
}
