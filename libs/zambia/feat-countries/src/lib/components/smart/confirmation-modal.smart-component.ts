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
    <div class="confirmation-modal">
      <div class="modal-header">
        <tui-icon 
          [icon]="context.data.danger ? '@tui.alert-triangle' : '@tui.help-circle'" 
          [class]="context.data.danger ? 'danger-icon' : 'info-icon'"
        ></tui-icon>
        <h3 class="heading">{{ context.data.title }}</h3>
      </div>

      <div class="modal-content">
        <p class="message">{{ context.data.message }}</p>
      </div>

      <div class="form-actions">
        <button 
          tuiButton 
          type="button" 
          appearance="secondary" 
          size="l"
          iconStart="@tui.x"
          (click)="onCancel()" 
          [disabled]="isProcessing()"
          class="cancel-button"
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
          class="confirm-button"
        >
          {{ context.data.confirmText || ('confirm' | translate) }}
        </button>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .confirmation-modal {
      min-width: 400px;
      max-width: 500px;
    }

    .modal-header {
      text-align: center;
      padding: 2rem 2rem 1rem;
      background: var(--tui-base-02);
      border-bottom: 1px solid var(--tui-border-normal);
    }

    .danger-icon {
      font-size: 3rem;
      color: var(--tui-status-negative);
      margin-bottom: 1rem;
    }

    .info-icon {
      font-size: 3rem;
      color: var(--tui-primary);
      margin-bottom: 1rem;
    }

    .heading {
      font-size: 1.25rem;
      font-weight: 700;
      margin: 0;
      color: var(--tui-text-primary);
    }

    .modal-content {
      padding: 1.5rem 2rem;
    }

    .message {
      margin: 0;
      line-height: 1.6;
      color: var(--tui-text-secondary);
      text-align: center;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      padding: 1.5rem 2rem 2rem;
      border-top: 1px solid var(--tui-border-normal);
      background: var(--tui-base-02);
    }

    .cancel-button {
      min-width: 120px;
    }

    .confirm-button {
      min-width: 120px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationModalSmartComponent {
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
