import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationDropdownSmartComponent } from '@zambia/feat-notifications';

@Component({
  selector: 'z-notifications-button',
  standalone: true,
  imports: [CommonModule, NotificationDropdownSmartComponent],
  template: ` <z-notification-dropdown /> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsButtonComponent {}
