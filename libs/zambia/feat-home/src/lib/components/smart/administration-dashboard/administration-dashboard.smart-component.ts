import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TuiIcon, TuiLoader, TuiButton } from '@taiga-ui/core';
import { TuiBadge } from '@taiga-ui/kit';
import { AdministrationDashboardFacadeService } from '../../../services/administration-dashboard-facade.service';

@Component({
  selector: 'z-administration-dashboard',
  standalone: true,
  imports: [CommonModule, TranslateModule, TuiIcon, TuiLoader, TuiButton, TuiBadge],
  template: `
    <div class="space-y-8">
      <!-- Header with Refresh -->
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
          {{ 'dashboard.administration.title' | translate }}
        </h1>
        <button
          tuiButton
          size="m"
          appearance="secondary"
          icon="@tui.rotate-cw"
          (click)="dashboardService.refreshDashboard()"
        >
          {{ 'common.refresh' | translate }}
        </button>
      </div>

      @if (dashboardService.isLoading() && !dashboardService.globalStats()) {
        <div class="flex min-h-[400px] items-center justify-center">
          <tui-loader size="l" />
        </div>
      } @else if (dashboardService.hasError()) {
        <div class="rounded-lg bg-white p-6 shadow-md dark:bg-slate-800">
          <div class="py-12 text-center">
            <tui-icon icon="@tui.alert-circle" class="mb-4 text-4xl text-red-500" />
            <p class="text-lg text-gray-600 dark:text-gray-400">
              {{ dashboardService.errorMessage() }}
            </p>
            <button tuiButton size="m" class="mt-4" (click)="dashboardService.refreshDashboard()">
              {{ 'common.tryAgain' | translate }}
            </button>
          </div>
        </div>
      } @else if (dashboardService.globalStats()) {
        <!-- Global Overview Grid -->
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <!-- Organization Card -->
          <div class="relative overflow-hidden rounded-lg bg-white p-6 shadow-md dark:bg-slate-800">
            <div class="p-6">
              <div class="mb-4 flex items-center justify-between">
                <div class="rounded-lg bg-gradient-to-r from-sky-500 to-sky-600 p-3">
                  <tui-icon icon="@tui.building" class="text-white" />
                </div>
                <tui-badge status="info" size="s">
                  {{ 'dashboard.administration.organization' | translate }}
                </tui-badge>
              </div>
              <div class="space-y-2">
                <div>
                  <p class="text-2xl font-bold text-gray-900 dark:text-white">
                    {{ dashboardService.globalStats()?.organization?.totalHeadquarters }}
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ 'dashboard.administration.headquarters' | translate }}
                  </p>
                </div>
                <div>
                  <p class="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    {{ dashboardService.globalStats()?.organization?.totalActiveSeasons }}
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ 'dashboard.administration.activeSeasons' | translate }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Users Card -->
          <div class="relative overflow-hidden rounded-lg bg-white p-6 shadow-md dark:bg-slate-800">
            <div class="p-6">
              <div class="mb-4 flex items-center justify-between">
                <div class="rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 p-3">
                  <tui-icon icon="@tui.users" class="text-white" />
                </div>
                <tui-badge status="success" size="s">
                  {{ 'dashboard.administration.users' | translate }}
                </tui-badge>
              </div>
              <div class="space-y-2">
                <div>
                  <p class="text-2xl font-bold text-gray-900 dark:text-white">
                    {{ dashboardService.globalStats()?.users?.totalUsers }}
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ 'dashboard.administration.totalUsers' | translate }}
                  </p>
                </div>
                <div class="flex gap-4 text-sm">
                  <div>
                    <span class="font-semibold">{{ dashboardService.globalStats()?.users?.totalStudents }}</span>
                    <span class="ml-1 text-gray-600 dark:text-gray-400">
                      {{ 'dashboard.administration.students' | translate }}
                    </span>
                  </div>
                  <div>
                    <span class="font-semibold">{{ dashboardService.globalStats()?.users?.totalCollaborators }}</span>
                    <span class="ml-1 text-gray-600 dark:text-gray-400">
                      {{ 'dashboard.administration.collaborators' | translate }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Agreements Card -->
          <div class="relative overflow-hidden rounded-lg bg-white p-6 shadow-md dark:bg-slate-800">
            <div class="p-6">
              <div class="mb-4 flex items-center justify-between">
                <div class="rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 p-3">
                  <tui-icon icon="@tui.file-text" class="text-white" />
                </div>
                <tui-badge status="warning" size="s">
                  {{ 'dashboard.administration.agreements' | translate }}
                </tui-badge>
              </div>
              <div class="space-y-2">
                <div>
                  <p class="text-2xl font-bold text-gray-900 dark:text-white">
                    {{ dashboardService.globalStats()?.agreements?.total }}
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ 'dashboard.administration.totalAgreements' | translate }}
                  </p>
                </div>
                <div class="space-y-1">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-400">
                      {{ 'dashboard.administration.prospect' | translate }}
                    </span>
                    <span class="text-sm font-semibold text-orange-600 dark:text-orange-400">
                      {{ dashboardService.globalStats()?.agreements?.prospect }}
                    </span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-400">
                      {{ 'dashboard.administration.active' | translate }}
                    </span>
                    <span class="text-sm font-semibold text-green-600 dark:text-green-400">
                      {{ dashboardService.globalStats()?.agreements?.active }}
                      ({{ dashboardService.globalStats()?.agreements?.percentages?.active }}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Operations Card -->
          <div class="relative overflow-hidden rounded-lg bg-white p-6 shadow-md dark:bg-slate-800">
            <div class="p-6">
              <div class="mb-4 flex items-center justify-between">
                <div class="rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 p-3">
                  <tui-icon icon="@tui.calendar" class="text-white" />
                </div>
                <tui-badge status="neutral" size="s">
                  {{ 'dashboard.administration.operations' | translate }}
                </tui-badge>
              </div>
              <div class="space-y-2">
                <div class="grid grid-cols-2 gap-2">
                  <div>
                    <p class="text-lg font-bold text-gray-900 dark:text-white">
                      {{ dashboardService.globalStats()?.operations?.totalWorkshops }}
                    </p>
                    <p class="text-xs text-gray-600 dark:text-gray-400">
                      {{ 'dashboard.administration.workshops' | translate }}
                    </p>
                  </div>
                  <div>
                    <p class="text-lg font-bold text-gray-900 dark:text-white">
                      {{ dashboardService.globalStats()?.operations?.totalEvents }}
                    </p>
                    <p class="text-xs text-gray-600 dark:text-gray-400">
                      {{ 'dashboard.administration.events' | translate }}
                    </p>
                  </div>
                </div>
                <div class="border-t border-gray-200 pt-2 dark:border-gray-700">
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ 'dashboard.administration.avgConversion' | translate }}
                  </p>
                  <p class="text-lg font-semibold text-gray-900 dark:text-white">
                    {{ dashboardService.globalStats()?.operations?.avgDaysProspectToActive }}
                    {{ 'common.days' | translate }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Key Metrics Summary -->
        <div class="rounded-lg bg-white p-6 shadow-md dark:bg-slate-800">
          <div class="p-6">
            <h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              {{ 'dashboard.administration.keyMetrics' | translate }}
            </h2>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div class="rounded-lg bg-gray-50 p-4 text-center dark:bg-slate-700">
                <p class="text-3xl font-bold text-sky-600 dark:text-sky-400">
                  {{ globalStats?.agreements?.thisYear }}
                </p>
                <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {{ 'dashboard.administration.agreementsThisYear' | translate }}
                </p>
              </div>
              <div class="rounded-lg bg-gray-50 p-4 text-center dark:bg-slate-700">
                <p class="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {{ globalStats?.agreements?.percentages?.graduated }}%
                </p>
                <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {{ 'dashboard.administration.graduationRate' | translate }}
                </p>
              </div>
              <div class="rounded-lg bg-gray-50 p-4 text-center dark:bg-slate-700">
                <p class="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {{ globalStats?.agreements?.total }}
                </p>
                <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {{ 'dashboard.administration.pendingReview' | translate }}
                </p>
              </div>
            </div>
          </div>
        </div>
      }
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
  protected dashboardService = inject(AdministrationDashboardFacadeService);
  protected globalStats = inject(AdministrationDashboardFacadeService).globalStats();

  handleQuickAction(route: string) {
    if (route.startsWith('/')) {
      this.router.navigate([route]);
    }
  }
}
