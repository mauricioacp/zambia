import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DashboardData } from '../../../types/dashboard-data.interface';
import { KpiWidgetComponent } from '../../ui/kpi-widget/kpi-widget.ui-component';
import { QuickActionCardComponent } from '../../ui/quick-action-card/quick-action-card.ui-component';
import { RecentAgreementsWidgetComponent } from '../../ui/recent-agreements-widget/recent-agreements-widget.ui-component';
import { ActivityFeedComponent } from '../../ui/activity-feed/activity-feed.ui-component';

@Component({
  selector: 'z-leadership-dashboard',
  standalone: true,
  imports: [
    TranslateModule,
    KpiWidgetComponent,
    QuickActionCardComponent,
    RecentAgreementsWidgetComponent,
    ActivityFeedComponent,
  ],
  template: `
    <div class="space-y-8">
      <!-- Organization KPIs -->
      @if (data().organizationKpis) {
        <z-kpi-widget [data]="data().organizationKpis!" />
      }

      <!-- Quick Actions -->
      <section>
        <h2 class="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
          {{ 'dashboard.home.quickActions' | translate }}
        </h2>
        <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          @for (action of data().quickActions.leadership; track action.title) {
            <z-quick-action-card [data]="action" (actionClicked)="handleQuickAction($event)" />
          }
        </div>
      </section>

      <!-- Recent Agreements -->
      <z-recent-agreements-widget
        [agreements]="data().recentAgreements"
        [loading]="data().loadingAgreements"
        (viewAgreement)="navigateToAgreement($event)"
      />

      <!-- Recent Activities -->
      <z-activity-feed
        [activities]="data().recentActivities"
        [loading]="data().loadingActivities"
        [title]="'dashboard.home.systemActivities' | translate"
      />
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
export class LeadershipDashboardSmartComponent {
  private router = inject(Router);

  data = input.required<DashboardData>();

  handleQuickAction(action: string) {
    console.log('Quick action clicked:', action);
    // TODO: Implement action handlers
  }

  navigateToAgreement(agreementId: string) {
    this.router.navigate(['/dashboard/agreements', agreementId]);
  }
}
