import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NotificationDropdownSmartComponent } from '@zambia/feat-notifications';

@Component({
  selector: 'z-notifications-button',
  standalone: true,
  imports: [NotificationDropdownSmartComponent],
  template: ` <z-notification-dropdown /> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsButtonComponent {}
