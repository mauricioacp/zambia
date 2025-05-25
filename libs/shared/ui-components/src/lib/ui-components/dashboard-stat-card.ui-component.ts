import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'z-dashboard-stat-card',
  imports: [CommonModule],
  template: `<p>dashboard-stat-card works!</p>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardStatCardUiComponent {}
