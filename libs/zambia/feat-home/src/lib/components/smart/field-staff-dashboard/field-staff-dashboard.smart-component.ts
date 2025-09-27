import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TuiIcon } from '@taiga-ui/core';
import { DashboardData } from '../../../types/dashboard-data.interface';
import { QuickActionCardComponent } from '../../ui/quick-action-card/quick-action-card.ui-component';
import { ActivityFeedComponent } from '../../ui/activity-feed/activity-feed.ui-component';

@Component({
  selector: 'z-field-staff-dashboard',
  standalone: true,
  imports: [TranslateModule, TuiIcon, QuickActionCardComponent, ActivityFeedComponent],
  template: `
    <div class="space-y-8">
      <!-- My Assignment -->
      @if (data().myAgreement) {
        <section>
          <h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            {{ 'dashboard.home.myAssignment' | translate }}
          </h2>
          <div
            class="rounded-2xl border border-gray-200/50 bg-white/90 p-6 shadow-lg backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/90"
          >
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ 'dashboard.home.role' | translate }}</p>
                <p class="mt-1 font-medium text-gray-900 dark:text-white">
                  {{ data().myAgreement!.role }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ 'dashboard.home.headquarter' | translate }}</p>
                <p class="mt-1 font-medium text-gray-900 dark:text-white">
                  {{ data().myAgreement!.headquarter_name }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ 'dashboard.home.status' | translate }}</p>
                <p class="mt-1 font-medium text-gray-900 dark:text-white">
                  {{ data().myAgreement!.status }}
                </p>
              </div>
            </div>
          </div>
        </section>
      }

      <!-- My Activities Summary -->
      <section>
        <h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          {{ 'dashboard.home.myActivities' | translate }}
        </h2>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div
            class="rounded-xl border border-gray-200/50 bg-white/90 p-6 text-center shadow-lg backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/90"
          >
            <div class="mb-2 flex justify-center">
              <div class="rounded-lg bg-gradient-to-r from-sky-500 to-sky-600 p-3">
                <tui-icon icon="@tui.calendar" class="text-white" />
              </div>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ 'dashboard.home.thisMonth' | translate }}</p>
            <p class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">12</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ 'dashboard.home.sessions' | translate }}</p>
          </div>
          <div
            class="rounded-xl border border-gray-200/50 bg-white/90 p-6 text-center shadow-lg backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/90"
          >
            <div class="mb-2 flex justify-center">
              <div class="rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 p-3">
                <tui-icon icon="@tui.users" class="text-white" />
              </div>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ 'dashboard.home.studentsReached' | translate }}</p>
            <p class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">45</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ 'dashboard.home.thisMonth' | translate }}</p>
          </div>
          <div
            class="rounded-xl border border-gray-200/50 bg-white/90 p-6 text-center shadow-lg backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/90"
          >
            <div class="mb-2 flex justify-center">
              <div class="rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 p-3">
                <tui-icon icon="@tui.trending-up" class="text-white" />
              </div>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ 'dashboard.home.completionRate' | translate }}</p>
            <p class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">92%</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ 'dashboard.home.average' | translate }}</p>
          </div>
        </div>
      </section>

      <!-- Quick Actions -->
      <section>
        <h2 class="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
          {{ 'dashboard.home.quickActions' | translate }}
        </h2>
        <div class="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <z-quick-action-card
            [data]="{
              title: 'dashboard.home.logActivity',
              description: 'dashboard.home.logActivityDesc',
              icon: 'plus-circle',
              route: '/dashboard/activities/new',
              color: 'emerald',
            }"
            (actionClicked)="handleQuickAction($event)"
          />
          <z-quick-action-card
            [data]="{
              title: 'dashboard.home.viewSchedule',
              description: 'dashboard.home.viewScheduleDesc',
              icon: 'calendar',
              route: '/dashboard/schedule',
              color: 'sky',
            }"
            (actionClicked)="handleQuickAction($event)"
          />
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
export class FieldStaffDashboardSmartComponent {
  private router = inject(Router);

  data = input.required<DashboardData>();

  handleQuickAction(route: string) {
    if (route.startsWith('/')) {
      this.router.navigate([route]);
    }
  }
}
