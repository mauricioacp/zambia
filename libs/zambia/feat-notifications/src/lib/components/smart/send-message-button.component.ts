import { Component, inject, input } from '@angular/core';
import { TuiButton } from '@taiga-ui/core';
import { DirectMessageService } from '@zambia/shared/data-access-notifications';
import { DirectMessageDialogV2SmartComponent } from './direct-message-dialog-v2.smart-component';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'z-send-message-button',
  standalone: true,
  imports: [TuiButton, TranslateModule],
  template: `
    <button tuiButton appearance="secondary" size="s" iconStart="@tui.message-circle" (click)="openSendMessageDialog()">
      {{ 'send_message' | translate }}
    </button>
  `,
})
export class SendMessageButtonComponent {
  private readonly directMessageService = inject(DirectMessageService);

  recipientId = input<string>();

  async openSendMessageDialog(): Promise<void> {
    await this.directMessageService.openSendMessageDialog(
      new PolymorpheusComponent(DirectMessageDialogV2SmartComponent),
      this.recipientId()
    );
  }
}
