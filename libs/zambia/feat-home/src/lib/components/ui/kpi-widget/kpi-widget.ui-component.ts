import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KpiCardComponent, KpiCardData } from '../kpi-card/kpi-card.ui-component';

export interface KpiWidgetData {
  title: string;
  kpis: KpiCardData[];
}

@Component({
  selector: 'z-kpi-widget',
  standalone: true,
  imports: [CommonModule, KpiCardComponent],
  template: `
    <div class="space-y-4">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
        {{ data().title }}
      </h2>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        @for (kpi of data().kpis; track kpi.title) {
          <z-kpi-card [data]="kpi" />
        }
      </div>
    </div>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiWidgetComponent {
  data = input.required<KpiWidgetData>();
}
