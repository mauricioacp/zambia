import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TuiIcon, TuiButton } from '@taiga-ui/core';
import { AdministrationDashboardFacadeService } from '../../../services/administration-dashboard-facade.service';
import { KpiData } from '@zambia/ui-components';
import { TuiButtonLoading } from '@taiga-ui/kit';
import { KpiCardUiComponent } from '@zambia/ui-components';

@Component({
  selector: 'z-administration-dashboard',
  standalone: true,
  imports: [CommonModule, TuiButtonLoading, TranslateModule, TuiIcon, TuiButton, KpiCardUiComponent],
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

      <!-- Organization Overview -->
      <div>
        <h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          {{ 'dashboard.administration.organizationOverview' | translate }}
        </h2>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          @for (kpi of organizationKpis(); track kpi.title) {
            <z-kpi-card
              [kpiData]="kpi"
              [loading]="dashboardService.isLoading()"
              (actionClick)="handleQuickAction(kpi.route || '')"
            />
          }
        </div>
      </div>

      <!-- Leadership Team -->
      <div>
        <h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          {{ 'dashboard.administration.leadershipTeam' | translate }}
        </h2>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          @for (kpi of leadershipKpis(); track kpi.title) {
            <z-kpi-card
              [kpiData]="kpi"
              [loading]="dashboardService.isLoading()"
              (actionClick)="handleQuickAction(kpi.route || '')"
            />
          }
        </div>
      </div>

      <!-- Operations Team -->
      <div>
        <h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          {{ 'dashboard.administration.operationsTeam' | translate }}
        </h2>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          @for (kpi of operationsKpis(); track kpi.title) {
            <z-kpi-card
              [kpiData]="kpi"
              [loading]="dashboardService.isLoading()"
              (actionClick)="handleQuickAction(kpi.route || '')"
            />
          }
        </div>
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
  private translate = inject(TranslateService);
  protected dashboardService = inject(AdministrationDashboardFacadeService);

  private buildRoleSubtitle(roleCode: string): string {
    const stats = this.dashboardService.getRoleStats(roleCode);
    const active = this.translate.instant('dashboard.administration.active');
    const inactive = this.translate.instant('dashboard.administration.inactive');
    const graduated = this.translate.instant('dashboard.administration.graduated');
    return roleCode === 'student'
      ? `${active}: ${stats.active} | ${inactive}: ${stats.inactive} | ${graduated}: ${stats.graduated}`
      : `${active}: ${stats.active} | ${inactive}: ${stats.inactive}`;
  }

  protected organizationKpis = computed<KpiData[]>(() => {
    const stats = this.dashboardService.statistics();

    return [
      {
        icon: '@tui.flag',
        title: this.translate.instant('dashboard.administration.countries'),
        value: stats.countries.total,
        iconBgClass: 'bg-blue-500',
        subtitle: `${this.translate.instant('dashboard.administration.active')}: ${stats.countries.active} | ${this.translate.instant('dashboard.administration.inactive')}: ${stats.countries.inactive}`,
        route: '/administration/countries',
      },
      {
        icon: '@tui.building',
        title: this.translate.instant('dashboard.administration.headquarters'),
        value: stats.headquarters.total,
        iconBgClass: 'bg-sky-500',
        subtitle: `${this.translate.instant('dashboard.administration.active')}: ${stats.headquarters.active} | ${this.translate.instant('dashboard.administration.inactive')}: ${stats.headquarters.inactive}`,
        route: '/administration/headquarters',
      },
      {
        icon: '@tui.file-text',
        title: this.translate.instant('dashboard.administration.agreements'),
        value: this.dashboardService.getTotalAgreements(),
        iconBgClass: 'bg-purple-500',
        subtitle: `${this.translate.instant('dashboard.administration.active')}: ${this.dashboardService.getAgreementsByStatus('active')} | ${this.translate.instant('dashboard.administration.prospect')}: ${this.dashboardService.getAgreementsByStatus('prospect')} | ${this.translate.instant('dashboard.administration.graduated')}: ${this.dashboardService.getAgreementsByStatus('graduated')}`,
        route: '/administration/agreements',
      },
      {
        icon: '@tui.users',
        title: this.translate.instant('dashboard.administration.totalUsers'),
        value: stats.users.totalCollaborators + stats.users.totalStudents,
        iconBgClass: 'bg-indigo-500',
        subtitle: `${this.translate.instant('dashboard.administration.collaborators')}: ${stats.users.totalCollaborators} | ${this.translate.instant('dashboard.administration.students')}: ${stats.users.totalStudents}`,
        route: '/administration/users',
      },
    ];
  });

  protected leadershipKpis = computed<KpiData[]>(() => {
    const stats = this.dashboardService.statistics();

    return [
      {
        icon: '@tui.crown',
        title: this.translate.instant('dashboard.administration.leadership'),
        value: stats.users.totalLeadership,
        iconBgClass: 'bg-amber-500',
        subtitle: this.translate.instant('dashboard.administration.leadershipSubtitle'),
        route: '/administration/users?filter=leadership',
      },
      {
        icon: '@tui.shield',
        title: this.translate.instant('dashboard.administration.superAdmin'),
        value: this.dashboardService.getRoleStats('superadmin').total,
        iconBgClass: 'bg-red-600',
        subtitle: this.buildRoleSubtitle('superadmin'),
        route: '/administration/users?filter=superadmin',
      },
      {
        icon: '@tui.briefcase',
        title: this.translate.instant('dashboard.administration.generalDirector'),
        value: this.dashboardService.getRoleStats('general_director').total,
        iconBgClass: 'bg-purple-600',
        subtitle: this.buildRoleSubtitle('general_director'),
        route: '/administration/users?filter=general_director',
      },
      {
        icon: '@tui.users',
        title: this.translate.instant('dashboard.administration.executiveLeader'),
        value: this.dashboardService.getRoleStats('executive_leader').total,
        iconBgClass: 'bg-indigo-600',
        subtitle: this.buildRoleSubtitle('executive_leader'),
        route: '/administration/users?filter=executive_leader',
      },
    ];
  });

  protected operationsKpis = computed<KpiData[]>(() => {
    return [
      {
        icon: '@tui.building-2',
        title: this.translate.instant('dashboard.administration.headquarterManagers'),
        value: this.dashboardService.getRoleStats('headquarter_manager').total,
        iconBgClass: 'bg-blue-600',
        subtitle: this.buildRoleSubtitle('headquarter_manager'),
        route: '/administration/users?filter=managers',
      },
      {
        icon: '@tui.presentation',
        title: this.translate.instant('dashboard.administration.facilitators'),
        value: this.dashboardService.getRoleStats('facilitator').total,
        iconBgClass: 'bg-teal-500',
        subtitle: this.buildRoleSubtitle('facilitator'),
        route: '/administration/users?filter=facilitators',
      },
      {
        icon: '@tui.heart-handshake',
        title: this.translate.instant('dashboard.administration.companions'),
        value: this.dashboardService.getRoleStats('companion').total,
        iconBgClass: 'bg-rose-500',
        subtitle: this.buildRoleSubtitle('companion'),
        route: '/administration/users?filter=companions',
      },
      {
        icon: '@tui.graduation-cap',
        title: this.translate.instant('dashboard.administration.students'),
        value: this.dashboardService.getRoleStats('student').total,
        iconBgClass: 'bg-violet-500',
        subtitle: this.buildRoleSubtitle('student'),
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
