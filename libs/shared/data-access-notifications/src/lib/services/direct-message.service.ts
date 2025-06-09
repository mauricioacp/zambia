import { Injectable, inject, ComponentRef } from '@angular/core';
import { TuiDialogService } from '@taiga-ui/core';

@Injectable({
  providedIn: 'root',
})
export class DirectMessageService {
  private readonly dialogs = inject(TuiDialogService);

  /**
   * Open the direct message dialog
   * @param component The dialog component to open
   * @param recipientId Optional pre-selected recipient ID
   * @returns Promise that resolves when message is sent or dialog is cancelled
   */
  async openSendMessageDialog(component: any, recipientId?: string): Promise<boolean> {
    const dialog = this.dialogs.open<{ sent: boolean }>(component, {
      data: { recipientId },
      dismissible: true,
      size: 'm',
    });

    const result = await dialog.toPromise();
    return result?.sent || false;
  }
}
