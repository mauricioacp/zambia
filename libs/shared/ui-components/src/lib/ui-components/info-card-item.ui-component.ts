import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'z-info-card-item',
  imports: [CommonModule],
  template: `<p>info-card-item works!</p>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoCardItemUiComponent {}
