import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TuiIcon } from '@taiga-ui/core';
import { DashboardData } from '../../../types/dashboard-data.interface';
import { KpiWidgetComponent } from '../../ui/kpi-widget/kpi-widget.ui-component';
import { QuickActionCardComponent } from '../../ui/quick-action-card/quick-action-card.ui-component';
import { ActivityFeedComponent } from '../../ui/activity-feed/activity-feed.ui-component';

@Component({
  selector: 'z-administration-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    TuiIcon,
    KpiWidgetComponent,
    QuickActionCardComponent,
    ActivityFeedComponent,
  ],
  template: `
    <div class="space-y-8">
      <!-- System Overview Section -->
      <section>
        <h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          {{ 'dashboard.home.systemOverview' | translate }}
        </h2>
        <div
          class="rounded-2xl border border-gray-200/50 bg-white/90 p-6 shadow-lg backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/90"
        >
          <div class="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div class="text-center">
              <div class="mb-2 flex justify-center">
                <div class="rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 p-3">
                  <tui-icon icon="@tui.server" class="text-white" />
                </div>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ 'dashboard.home.systemStatus' | translate }}</p>
              <p class="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">Operational</p>
            </div>
            <div class="text-center">
              <div class="mb-2 flex justify-center">
                <div class="rounded-lg bg-gradient-to-r from-sky-500 to-sky-600 p-3">
                  <tui-icon icon="@tui.users" class="text-white" />
                </div>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ 'dashboard.home.activeUsers' | translate }}</p>
              <p class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                {{ data().organizationKpis?.kpis[2]?.value || 0 }}
              </p>
            </div>
            <div class="text-center">
              <div class="mb-2 flex justify-center">
                <div class="rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 p-3">
                  <tui-icon icon="@tui.database" class="text-white" />
                </div>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ 'dashboard.home.dataIntegrity' | translate }}</p>
              <p class="mt-1 text-2xl font-bold text-purple-600 dark:text-purple-400">99.9%</p>
            </div>
            <div class="text-center">
              <div class="mb-2 flex justify-center">
                <div class="rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 p-3">
                  <tui-icon icon="@tui.shield" class="text-white" />
                </div>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ 'dashboard.home.securityLevel' | translate }}</p>
              <p class="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">High</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Organization KPIs -->
      @if (data().organizationKpis) {
        <z-kpi-widget [data]="data().organizationKpis!" />
      }

      <!-- Admin Actions -->
      <section>
        <h2 class="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
          {{ 'dashboard.home.adminActions' | translate }}
        </h2>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <z-quick-action-card
            [data]="{
              title: 'dashboard.home.systemSettings',
              description: 'dashboard.home.systemSettingsDesc',
              icon: 'settings',
              route: '/dashboard/settings',
              color: 'slate',
            }"
            (actionClicked)="handleQuickAction($event)"
          />
          <z-quick-action-card
            [data]="{
              title: 'dashboard.home.userManagement',
              description: 'dashboard.home.userManagementDesc',
              icon: 'user-cog',
              route: '/dashboard/users',
              color: 'sky',
            }"
            (actionClicked)="handleQuickAction($event)"
          />
          <z-quick-action-card
            [data]="{
              title: 'dashboard.home.auditLogs',
              description: 'dashboard.home.auditLogsDesc',
              icon: 'file-search',
              route: '/dashboard/audit',
              color: 'purple',
            }"
            (actionClicked)="handleQuickAction($event)"
          />
        </div>
      </section>

      <!-- Recent System Activities -->
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
export class AdministrationDashboardSmartComponent {
  private router = inject(Router);

  data = input.required<DashboardData>();

  handleQuickAction(route: string) {
    if (route.startsWith('/')) {
      this.router.navigate([route]);
    }
  }
}
