import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'z-quick-link-item',
  imports: [CommonModule],
  template: `<p>quick-link-item works!</p>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickLinkItemUiComponent {}
