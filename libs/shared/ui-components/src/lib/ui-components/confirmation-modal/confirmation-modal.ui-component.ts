import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { injectContext } from '@taiga-ui/polymorpheus';
import { TranslatePipe } from '@ngx-translate/core';
import type { TuiDialogContext } from '@taiga-ui/core';
import { TuiButtonLoading } from '@taiga-ui/kit';

export interface ConfirmationData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}

@Component({
  selector: 'z-confirmation-modal',
  standalone: true,
  imports: [TuiButton, TranslatePipe, TuiButtonLoading, TuiIcon],
  template: `
    <div
      class="mx-auto w-full max-w-full divide-y divide-[var(--tui-border-normal)] text-center"
      role="dialog"
      aria-modal="true"
      [attr.aria-busy]="isProcessing()"
    >
      <!-- Header -->
      <div class="flex flex-col items-center justify-center px-6 pt-8 pb-4">
        <tui-icon
          [icon]="context.data.danger ? 'triangle-alert' : '@tui.circle-help'"
          class="mb-4 text-5xl"
          [style.color]="context.data.danger ? 'var(--tui-status-negative)' : 'var(--tui-primary)'"
        ></tui-icon>
        <h2 class="m-0 text-2xl leading-snug font-bold text-[var(--tui-text-primary)]">
          {{ context.data.title }}
        </h2>
      </div>

      <!-- Content -->
      <div class="px-6 py-6">
        <p class="m-0 text-base leading-relaxed text-[var(--tui-text-secondary)]">
          {{ context.data.message }}
        </p>
      </div>

      <!-- Actions -->
      <div class="px-6 py-6">
        <div class="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
          <button
            tuiButton
            type="button"
            appearance="secondary"
            size="l"
            iconStart="@tui.x"
            (click)="onCancel()"
            [disabled]="isProcessing()"
            class="w-full min-w-36 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tui-primary)] focus-visible:ring-offset-2 sm:w-auto"
          >
            {{ context.data.cancelText || ('cancel' | translate) }}
          </button>

          <button
            tuiButton
            type="button"
            size="l"
            [iconStart]="context.data.danger ? '@tui.trash' : '@tui.check'"
            [appearance]="context.data.danger ? 'destructive' : 'primary'"
            (click)="onConfirm()"
            [loading]="isProcessing()"
            class="w-full min-w-36 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tui-primary)] focus-visible:ring-offset-2 sm:w-auto"
          >
            {{ context.data.confirmText || ('confirm' | translate) }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationModalUiComponent {
  readonly context = injectContext<TuiDialogContext<boolean, ConfirmationData>>();

  isProcessing = signal(false);

  onConfirm(): void {
    this.isProcessing.set(true);
    this.context.completeWith(true);
  }

  onCancel(): void {
    this.context.completeWith(false);
  }
}
