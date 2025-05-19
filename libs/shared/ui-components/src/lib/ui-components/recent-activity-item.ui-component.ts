import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'z-recent-activity-item',
  imports: [CommonModule],
  template: `<p>recent-activity-item works!</p>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentActivityItemUiComponent {}
