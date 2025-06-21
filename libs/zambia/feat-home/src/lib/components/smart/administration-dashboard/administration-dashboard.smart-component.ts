import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TuiIcon, TuiLoader, TuiButton } from '@taiga-ui/core';
import { TuiBadge, TuiSkeleton } from '@taiga-ui/kit';
import { AdministrationDashboardFacadeService } from '../../../services/administration-dashboard-facade.service';
import { KpiData } from '@zambia/ui-components';
import { TuiButtonLoading } from '@taiga-ui/kit';
import { KpiCardUiComponent } from '@zambia/ui-components';

@Component({
  selector: 'z-administration-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    TuiButtonLoading,
    TranslateModule,
    TuiIcon,
    TuiLoader,
    TuiButton,
    TuiBadge,
    TuiSkeleton,
    KpiCardUiComponent,
  ],
  template: `
    <div class="space-y-8">
      <!-- Header with Refresh -->
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
          {{ 'dashboard.administration.title' | translate }}
        </h1>
        <button
          iconStart="@tui.rotate-cw"
          tuiButton
          size="m"
          appearance="secondary"
          type="button"
          [loading]="dashboardService.isLoading()"
          (click)="dashboardService.refreshDashboard()"
        >
          {{ 'common.refresh' | translate }}
        </button>
      </div>

      @if (dashboardService.hasError()) {
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
      }
      <!-- Role-based KPI Cards Section -->
      <div class="mt-8">
        <h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          {{ 'dashboard.administration.roleBasedStatistics' | translate }}
        </h2>
        <!-- Actual KPI cards -->

        @for (kpi of kpiCardsData(); track kpi.title) {
          <z-kpi-card [kpiData]="kpi" (actionClick)="handleQuickAction(kpi.route || '')" />
        }
      </div>
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

  protected kpiCardsData = computed<KpiData[]>(() => {
    const globalStats = this.dashboardService.safeGlobalStats();
    const agreementsByRole = this.dashboardService.agreementsByRole();

    const getRoleStats = (roleName: string) => {
      const stats = agreementsByRole[roleName] || { total: 0, active: 0, inactive: 0, graduated: 0, prospect: 0 };
      return {
        total: stats.total,
        subtitle: `Active: ${stats.active} | Inactive: ${stats.inactive} | Graduated: ${stats.graduated} | Prospect: ${stats.prospect}`,
      };
    };

    return [
      {
        // Total countries (we need to fetch countries)
        icon: '@tui.flag',
        title: 'dashboard.administration.countries',
        value: globalStats.organization.totalHeadquarters,
        iconBgClass: 'bg-blue-500',
        subtitle: 'dashboard.administration.totalCountries', // here we lack some states, we need to calculate this
        route: '/administration/countries',
      },
      {
        icon: '@tui.building',
        title: 'dashboard.administration.headquarters',
        value: globalStats.organization.totalHeadquarters,
        iconBgClass: 'bg-sky-500',
        subtitle: 'dashboard.administration.totalHeadquarters', // here we lack some states, we need to calculate this
        route: '/administration/headquarters',
      },
      {
        // Total agreements
        icon: '@tui.file-text',
        title: 'dashboard.administration.agreements',
        value: globalStats.agreements.total,
        iconBgClass: 'bg-purple-500',
        subtitle: `Active: ${globalStats.agreements.active} | Prospect: ${globalStats.agreements.prospect}`, // here we lack some states, we need to calculate this
        route: '/administration/agreements',
      },
      {
        // Total collaborators (all non-student roles) we need to calculate this
        icon: '@tui.users',
        title: 'dashboard.administration.collaborators',
        value: 0, // this is the total of non student roles,
        iconBgClass: 'bg-emerald-500',
        subtitle: getRoleStats('collaborator').subtitle,
        route: '/administration/users?filter=collaborators',
      },
      {
        // Konsejo members and leaders
        //       we need create a kpi card for all of these roles:
        // and one kpi card with the total of all of them
        //         /* level 100 */
        // SUPERADMIN: 'superadmin',
        // /* level 90 */
        // GENERAL_DIRECTOR: 'general_director',
        // EXECUTIVE_LEADER: 'executive_leader',
        // /* level 80 */
        // PEDAGOGICAL_LEADER: 'pedagogical_leader',
        // INNOVATION_LEADER: 'innovation_leader',
        // COMMUNICATION_LEADER: 'communication_leader',
        // COMMUNITY_LEADER: 'community_leader',
        // COORDINATION_LEADER: 'coordination_leader',
        // LEGAL_ADVISOR: 'legal_advisor',
        // UTOPIK_FOUNDATION_USER: 'utopik_foundation_user',
        // /* level 70 */
        // COORDINATOR: 'coordinator',
        // KONSEJO_MEMBER: 'konsejo_member',
        icon: '@tui.crown',
        title: 'dashboard.administration.konsejoMembers',
        value: getRoleStats('konsejo_member').total + getRoleStats('konsejo_leader').total,
        iconBgClass: 'bg-amber-500',
        subtitle: getRoleStats('konsejo_member').subtitle,
        route: '/administration/users?filter=konsejo',
      },
      {
        // Total managers
        icon: '@tui.briefcase',
        title: 'dashboard.administration.managers',
        value: getRoleStats('HEADQUARTER_MANAGER').total,
        iconBgClass: 'bg-indigo-500',
        subtitle: getRoleStats('HEADQUARTER_MANAGER').subtitle,
        route: '/administration/users?filter=managers',
      },
      {
        // Total facilitators
        icon: '@tui.presentation',
        title: 'dashboard.administration.facilitators',
        value: getRoleStats('facilitator').total,
        iconBgClass: 'bg-teal-500',
        subtitle: getRoleStats('facilitator').subtitle,
        route: '/administration/users?filter=facilitators',
      },
      {
        // Total companions
        icon: '@tui.heart-handshake',
        title: 'dashboard.administration.companions',
        value: getRoleStats('companion').total,
        iconBgClass: 'bg-rose-500',
        subtitle: getRoleStats('companion').subtitle,
        route: '/administration/users?filter=companions',
      },
      {
        // Total students
        icon: '@tui.graduation-cap',
        title: 'dashboard.administration.students',
        value: getRoleStats('student').total,
        iconBgClass: 'bg-violet-500',
        subtitle: getRoleStats('student').subtitle,
        route: '/administration/users?filter=students',
      },
    ];
  });

  handleQuickAction(route: string) {
    if (route.startsWith('/')) {
      this.router.navigate([route]);
    }
  }
}
