import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolesService } from '@zambia/data-access-roles-permissions';
import { CardColumnData, CardComponent, DataBadgeUiComponent, WelcomeMessageUiComponent } from '@zambia/ui-components';
import { DashboardFacadeService, ReviewStat } from '@zambia/data-access-dashboard';
import { TuiSkeleton } from '@taiga-ui/kit';

@Component({
  selector: 'z-panel',
  standalone: true,
  imports: [CommonModule, WelcomeMessageUiComponent, DataBadgeUiComponent, CardComponent, TuiSkeleton],
  template: `
    <div class="h-full w-full overflow-auto bg-gray-50 p-6 dark:bg-gray-900">
      <h1 class="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Panel de Control</h1>
      <z-welcome-message [welcomeText]="welcomeText()" />
      <!-- Stats Section -->
      <div class="mb-4">
        <div class="mb-4">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Estadísticas globales</h2>
          <p class="text-gray-600 dark:text-gray-300">Acuerdos que ya han sido revisados por un responsable</p>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          @for (stat of dashboardFacade.dashboardStats(); track stat.label) {
            <z-data-badge [loading]="dashboardFacade.globalDataLoading()" [stat]="stat" />
          }
        </div>
      </div>

      <div class="w-full space-y-6">
        <div class="mb-4">
          <div class="mb-4">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Estadísticas detalladas</h2>
            <p class="text-gray-600 dark:text-gray-300">
              Acuerdos pendientes por revisar y el porcentaje de acuerdos revisados.
            </p>
          </div>

          <!-- Overall stat card with skeleton loading -->
          <div [tuiSkeleton]="reviewStatsLoading()" class="w-full">
            @if (overallStat()) {
              <z-card
                [mainTitle]="overallStat()!.title"
                [mainSubtitle]="overallStat()!.total + ' Acuerdos Totales'"
                [colData]="getCardColData(overallStat()!)"
                [progressPercentage]="overallStat()!.percentage_reviewed"
                [progressBarColor]="'bg-sky-500'"
                [progressTextColor]="overallStat()!.textColor"
                [staticBorderColor]="'ring-sky-500'"
                [applyAnimatedBorder]="true"
                [icon]="overallStat()!.iconSvg!"
              ></z-card>
            }
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        @if (reviewStatsLoading()) {
          @for (i of [1, 2, 3, 4, 5, 6]; track i) {
            <div [tuiSkeleton]="true" class="h-40 w-full"></div>
          }
        } @else {
          @for (stat of otherStats(); track stat.title) {
            <z-card
              [mainTitle]="stat.title"
              [mainSubtitle]="stat.total + ' Acuerdos Totales'"
              [colData]="getCardColData(stat)"
              [progressPercentage]="stat.percentage_reviewed"
              [progressBarColor]="stat.color"
              [progressTextColor]="stat.textColor"
              [applyAnimatedBorder]="true"
              [icon]="stat.iconSvg!"
            >
            </z-card>
          }
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
      min-height: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelSmartComponent {
  protected rolesService = inject(RolesService);
  protected welcomeText = computed(() => this.rolesService.getWelcomeText());
  protected dashboardFacade = inject(DashboardFacadeService);

  protected reviewStatsLoading = computed(() => this.dashboardFacade.reviewStatsLoading());
  protected overallStat = computed(() => this.dashboardFacade.overallStat());
  protected otherStats = computed(() => this.dashboardFacade.otherStats());

  getCardColData(stat: ReviewStat): CardColumnData[] {
    return [
      { dataSubtitle: 'Pendientes', dataNumber: stat.pending },
      { dataSubtitle: 'Revisados', dataNumber: stat.reviewed },
    ];
  }
}
