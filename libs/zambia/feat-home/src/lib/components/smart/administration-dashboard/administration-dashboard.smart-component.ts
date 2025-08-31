import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TuiIcon, TuiButton } from '@taiga-ui/core';
import { SectionHeaderUiComponent } from '@zambia/ui-components';
import { TuiButtonLoading } from '@taiga-ui/kit';
import { KpiCardUiComponent } from '@zambia/ui-components';
import { AdministrationDashboardFacadeService } from '../../../services/administration-dashboard-facade.service';
@Component({
  selector: 'z-administration-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    SectionHeaderUiComponent,
    KpiCardUiComponent,
    TuiIcon,
    TuiButtonLoading,
    TuiButton,
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

      <!-- Organization Overview -->
      <div>
        <z-section-header [icon]="'@tui.building-2'" [iconColor]="'sky'" [compact]="true" [showDescription]="false">
          <span title>{{ 'dashboard.administration.organizationOverview' | translate }}</span>
        </z-section-header>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          @for (kpi of organizationKpis(); track kpi.title) {
            <z-kpi-card
              [kpiData]="kpi"
              [loading]="dashboardService.isLoading()"
              (cardClicked)="handleQuickAction(kpi.route || '')"
            />
          }
        </div>
      </div>

      <!-- Leadership Team -->
      <div>
        <z-section-header [icon]="'@tui.crown'" [iconColor]="'purple'" [variant]="'gradient'" [compact]="true">
          <span title>{{ 'dashboard.administration.leadershipTeam' | translate }}</span>
          <span description>{{ 'dashboard.administration.leadershipSubtitle' | translate }}</span>
        </z-section-header>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          @for (kpi of leadershipKpis(); track kpi.title) {
            <z-kpi-card [kpiData]="kpi" [loading]="dashboardService.isLoading()" />
          }
        </div>
      </div>

      <!-- Operations Team -->
      <div>
        <z-section-header [icon]="'@tui.users'" [iconColor]="'emerald'" [compact]="true" [showDescription]="false">
          <span title>{{ 'dashboard.administration.operationsTeam' | translate }}</span>
        </z-section-header>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          @for (kpi of operationsKpis(); track kpi.title) {
            <z-kpi-card [kpiData]="kpi" [loading]="dashboardService.isLoading()" />
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
  protected dashboardService = inject(AdministrationDashboardFacadeService);

  // Computed properties for KPI data - now delegated to the service
  organizationKpis = this.dashboardService.organizationKpis;
  leadershipKpis = this.dashboardService.leadershipKpis;
  operationsKpis = this.dashboardService.operationsKpis;

  handleQuickAction(route: string) {
    if (route.startsWith('/')) {
      this.router.navigate([route]);
    }
  }
}
