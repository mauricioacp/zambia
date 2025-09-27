import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DashboardData } from '../../../types/dashboard-data.interface';
import { HeadquarterMetricsWidgetComponent } from '../../ui/headquarter-metrics-widget/headquarter-metrics-widget.ui-component';
import { QuickActionCardComponent } from '../../ui/quick-action-card/quick-action-card.ui-component';
import { ActivityFeedComponent } from '../../ui/activity-feed/activity-feed.ui-component';

@Component({
  selector: 'z-headquarters-dashboard',
  standalone: true,
  imports: [TranslateModule, HeadquarterMetricsWidgetComponent, QuickActionCardComponent, ActivityFeedComponent],
  template: `
    <div class="space-y-8">
      <!-- Headquarter Metrics -->
      @if (data().headquarterMetrics) {
        <z-headquarter-metrics-widget
          [metrics]="data().headquarterMetrics"
          [loading]="data().loadingHqMetrics"
          [title]="'dashboard.home.myHeadquarterPerformance' | translate"
        />
      }

      <!-- Quick Actions -->
      <section>
        <h2 class="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
          {{ 'dashboard.home.quickActions' | translate }}
        </h2>
        <div class="grid grid-cols-1 gap-8 sm:grid-cols-2">
          @for (action of data().quickActions.operational; track action.title) {
            <z-quick-action-card [data]="action" (actionClicked)="handleQuickAction($event)" />
          }
        </div>
      </section>

      <!-- Recent Activities -->
      <z-activity-feed [activities]="data().recentActivities" [loading]="data().loadingActivities" />
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeadquartersDashboardSmartComponent {
  private router = inject(Router);

  data = input.required<DashboardData>();

  handleQuickAction(action: string) {
    console.log('Quick action clicked:', action);
    // TODO: Implement action handlers
  }
}
