import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DashboardData } from '../../types/dashboard-data.interface';
import { QuickActionCardComponent } from '../ui/quick-action-card/quick-action-card.ui-component';
import { ActivityFeedComponent } from '../ui/activity-feed/activity-feed.ui-component';

@Component({
  selector: 'z-student-dashboard',
  standalone: true,
  imports: [CommonModule, TranslateModule, QuickActionCardComponent, ActivityFeedComponent],
  template: `
    <div class="space-y-8">
      <!-- Student Agreement Info -->
      @if (data().myAgreement) {
        <section>
          <h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            {{ 'dashboard.home.myAgreement' | translate }}
          </h2>
          <div
            class="rounded-2xl border border-gray-200/50 bg-white/90 p-6 shadow-lg backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/90"
          >
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ 'dashboard.home.role' | translate }}</p>
                <p class="mt-1 font-medium text-gray-900 dark:text-white">
                  {{ data().myAgreement!.role }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ 'dashboard.home.status' | translate }}</p>
                <p class="mt-1 font-medium text-gray-900 dark:text-white">
                  {{ data().myAgreement!.status }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ 'dashboard.home.headquarter' | translate }}
                </p>
                <p class="mt-1 font-medium text-gray-900 dark:text-white">
                  {{ data().myAgreement!.headquarter_name }}
                </p>
              </div>
            </div>
          </div>
        </section>
      }

      <!-- Student Quick Actions -->
      <section>
        <h2 class="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
          {{ 'dashboard.home.quickActions' | translate }}
        </h2>
        <div class="grid grid-cols-1 gap-8 sm:grid-cols-2">
          @for (action of data().quickActions.student; track action.title) {
            <z-quick-action-card [data]="action" (actionClicked)="handleQuickAction($event)" />
          }
        </div>
      </section>

      <!-- Recent Activities -->
      <z-activity-feed
        [activities]="data().recentActivities"
        [loading]="data().loadingActivities"
        [title]="'dashboard.home.myRecentActivities' | translate"
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
export class StudentDashboardSmartComponent {
  private router = inject(Router);

  data = input.required<DashboardData>();

  handleQuickAction(action: string) {
    console.log('Quick action clicked:', action);
    // TODO: Implement action handlers
  }
}
