import { inject, Injectable, TemplateRef } from '@angular/core';
import { TuiAlertService, type TuiAlertOptions } from '@taiga-ui/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationOptions extends Partial<Omit<TuiAlertOptions<unknown>, 'appearance' | 'autoClose'>> {
  /**
   * Translation parameters for interpolation
   */
  translateParams?: Record<string, unknown>;
  /**
   * Whether the message should be translated
   * @default true
   */
  translate?: boolean;
  /**
   * Auto close timeout in milliseconds
   * @default 3000 for success/info, 5000 for warning/error
   */
  autoClose?: number;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly alertService = inject(TuiAlertService);
  private readonly translateService = inject(TranslateService);

  showSuccess(message: string, options?: NotificationOptions): Observable<unknown> {
    return this.showNotification(message, 'success', {
      autoClose: 3000,
      ...options,
    });
  }

  showError(message: string, options?: NotificationOptions): Observable<unknown> {
    return this.showNotification(message, 'error', {
      autoClose: 5000,
      ...options,
    });
  }

  showWarning(message: string, options?: NotificationOptions): Observable<unknown> {
    return this.showNotification(message, 'warning', {
      autoClose: 4000,
      ...options,
    });
  }

  showInfo(message: string, options?: NotificationOptions): Observable<unknown> {
    return this.showNotification(message, 'info', {
      autoClose: 3000,
      ...options,
    });
  }

  private showNotification(
    message: string,
    type: NotificationType,
    options: NotificationOptions = {}
  ): Observable<unknown> {
    const { translate = true, translateParams, autoClose, ...alertOptions } = options;

    const finalMessage = translate ? this.translateService.instant(message, translateParams) : message;

    const appearance = this.mapTypeToAppearance(type);

    const defaultLabel = translate
      ? this.translateService.instant(this.getDefaultLabel(type))
      : this.getDefaultLabelText(type);

    const alertConfig = {
      appearance,
      autoClose: autoClose ?? this.getDefaultAutoClose(type),
      label: alertOptions.label || defaultLabel,
      data: undefined,
      ...alertOptions,
    } as TuiAlertOptions<unknown>;

    return this.alertService.open(finalMessage, alertConfig);
  }

  showCustom(
    content: string | TemplateRef<unknown> | object,
    options: Partial<TuiAlertOptions<unknown>> & { translate?: boolean; translateParams?: Record<string, unknown> } = {}
  ): Observable<unknown> {
    const { translate = true, translateParams, ...alertOptions } = options;

    const finalContent =
      typeof content === 'string' && translate ? this.translateService.instant(content, translateParams) : content;

    return this.alertService.open(finalContent, alertOptions);
  }

  private mapTypeToAppearance(type: NotificationType): TuiAlertOptions<unknown>['appearance'] {
    switch (type) {
      case 'success':
        return 'positive';
      case 'error':
        return 'negative';
      case 'warning':
        return 'warning';
      case 'info':
      default:
        return 'info';
    }
  }

  private getDefaultLabel(type: NotificationType): string {
    switch (type) {
      case 'success':
        return 'notification.success';
      case 'error':
        return 'notification.error';
      case 'warning':
        return 'notification.warning';
      case 'info':
      default:
        return 'notification.info';
    }
  }

  private getDefaultLabelText(type: NotificationType): string {
    switch (type) {
      case 'success':
        return 'Success';
      case 'error':
        return 'Error';
      case 'warning':
        return 'Warning';
      case 'info':
      default:
        return 'Information';
    }
  }

  private getDefaultAutoClose(type: NotificationType): number {
    switch (type) {
      case 'success':
      case 'info':
        return 3000;
      case 'warning':
        return 4000;
      case 'error':
        return 5000;
      default:
        return 3000;
    }
  }
}
