import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { Router, RouterModule } from '@angular/router';
import { RoleService } from '@zambia/data-access-roles-permissions';
import { CardColumnData, CardComponent, DataBadgeUiComponent } from '@zambia/ui-components';
import { DashboardFacadeService, ReviewStat } from '@zambia/data-access-dashboard';
import { TuiSkeleton } from '@taiga-ui/kit';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'z-panel',
  standalone: true,
  imports: [RouterModule, DataBadgeUiComponent, CardComponent, TuiSkeleton, TranslateModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-slate-900">
      <!-- Header Section -->
      <div class="relative overflow-hidden">
        <!-- Background Glow -->
        <div
          class="absolute inset-0 -inset-x-6 rounded-3xl bg-gradient-to-r from-purple-300 via-blue-500 to-indigo-700 opacity-10 blur-2xl"
        ></div>

        <!-- Glass Header Container -->
        <div
          class="relative rounded-2xl bg-white/40 p-2.5 ring-1 ring-gray-200/50 backdrop-blur-sm dark:bg-gray-500/20 dark:ring-gray-700/60"
        >
          <div
            class="rounded-xl bg-white/95 p-6 shadow-xl shadow-gray-900/5 dark:bg-gray-950/95 dark:shadow-slate-900/20"
          >
            <div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 class="mb-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
                  {{ 'panel.title' | translate }}
                </h1>
                <p class="text-lg text-gray-600 dark:text-gray-300">
                  {{ 'panel.subtitle' | translate }}
                </p>
              </div>

              <!-- Status Indicator -->
              <div class="flex items-center gap-3">
                <div class="rounded-full bg-emerald-100 p-2 dark:bg-emerald-900/30">
                  <div class="h-2 w-2 rounded-full bg-emerald-500"></div>
                </div>
                <span class="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {{ 'homepage.systemActive' | translate }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Primary Navigation Section -->
      <section class="px-6 py-8 sm:px-8">
        <div class="mb-6">
          <h2 class="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            {{ 'homepage.quickActions' | translate }}
          </h2>
          <p class="text-gray-600 dark:text-gray-300">
            {{ 'panel.viewHomepageDesc' | translate }}
          </p>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <!-- Homepage Navigation Card -->
          <a
            routerLink="/dashboard/homepage"
            class="group relative block overflow-hidden rounded-2xl border border-gray-200/50 bg-white/90 p-6 shadow-lg shadow-gray-900/5 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-blue-300/70 hover:shadow-xl hover:shadow-blue-500/20 dark:border-slate-700/50 dark:bg-slate-800/90 dark:shadow-slate-900/20 dark:hover:border-blue-600/70 dark:hover:shadow-blue-500/30"
            [attr.aria-label]="'panel.viewHomepage' | translate"
          >
            <div class="relative z-10">
              <div class="mb-4 flex items-center gap-4">
                <div
                  class="rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 p-3 shadow-lg shadow-blue-500/25"
                >
                  <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    {{ 'panel.viewHomepage' | translate }}
                  </h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ 'homepage.quickActionsDesc' | translate }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Hover overlay -->
            <div
              class="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            ></div>
          </a>

          <!-- Profile Navigation Card -->
          <a
            routerLink="/dashboard/profile"
            class="group relative block overflow-hidden rounded-2xl border border-gray-200/50 bg-white/90 p-6 shadow-lg shadow-gray-900/5 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-purple-300/70 hover:shadow-xl hover:shadow-purple-500/20 dark:border-slate-700/50 dark:bg-slate-800/90 dark:shadow-slate-900/20 dark:hover:border-purple-600/70 dark:hover:shadow-purple-500/30"
            [attr.aria-label]="'profile.title' | translate"
          >
            <div class="relative z-10">
              <div class="mb-4 flex items-center gap-4">
                <div
                  class="rounded-xl bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 p-3 shadow-lg shadow-purple-500/25"
                >
                  <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    {{ 'profile.title' | translate }}
                  </h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ 'profile.subtitle' | translate }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Hover overlay -->
            <div
              class="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            ></div>
          </a>

          <!-- Analytical Reports Card -->
          @if (showAnalyticalReports()) {
            <button
              class="group relative overflow-hidden rounded-2xl border border-gray-200/50 bg-white/90 p-6 text-left shadow-lg shadow-gray-900/5 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-emerald-300/70 hover:shadow-xl hover:shadow-emerald-500/20 dark:border-slate-700/50 dark:bg-slate-800/90 dark:shadow-slate-900/20 dark:hover:border-emerald-600/70 dark:hover:shadow-emerald-500/30"
              (click)="navigateToReports()"
              [attr.aria-label]="'panel.analyticalReports' | translate"
            >
              <div class="relative z-10">
                <div class="mb-4 flex items-center gap-4">
                  <div
                    class="rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 p-3 shadow-lg shadow-emerald-500/25"
                  >
                    <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                      {{ 'panel.analyticalReports' | translate }}
                    </h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      {{ 'panel.analyticalReportsDesc' | translate }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Hover overlay -->
              <div
                class="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              ></div>
            </button>
          }
        </div>
      </section>

      <!-- Global Statistics Overview (for high-level users only) -->
      @if (showGlobalStats()) {
        <section class="px-6 py-8 sm:px-8">
          <div class="mb-6">
            <div class="flex items-center gap-3">
              <div
                class="rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-700 p-3 shadow-lg shadow-indigo-500/25"
              >
                <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  ></path>
                </svg>
              </div>
              <div>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                  {{ 'homepage.globalMetricsDesc' | translate }}
                </h2>
                <p class="text-gray-600 dark:text-gray-300">
                  {{ 'panel.analyticalReportsDesc' | translate }}
                </p>
              </div>
            </div>
          </div>

          @defer (on viewport; prefetch on idle) {
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              @for (stat of dashboardFacade.dashboardStats(); track stat.label) {
                <div class="transform transition-all duration-200 hover:scale-105">
                  <z-data-badge [loading]="dashboardFacade.globalDataLoading()" [stat]="stat" />
                </div>
              }
            </div>
          } @placeholder {
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              @for (i of [1, 2, 3, 4]; track i) {
                <div class="h-32 w-full rounded-2xl bg-white/40 backdrop-blur-sm" [tuiSkeleton]="true"></div>
              }
            </div>
          } @loading {
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              @for (i of [1, 2, 3, 4]; track i) {
                <div
                  class="h-32 w-full animate-pulse rounded-2xl bg-white/40 backdrop-blur-sm"
                  [tuiSkeleton]="true"
                ></div>
              }
            </div>
          }
        </section>
      }

      <!-- Detailed Analytics Cards (for executives only) -->
      @if (isExecutiveLevel()) {
        <section class="px-6 py-8 sm:px-8">
          <div class="mb-6">
            <div class="flex items-center gap-3">
              <div
                class="rounded-xl bg-gradient-to-br from-pink-500 via-pink-600 to-pink-700 p-3 shadow-lg shadow-pink-500/25"
              >
                <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
              </div>
              <div>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                  {{ 'panel.executiveAnalysis' | translate }}
                </h2>
                <p class="text-gray-600 dark:text-gray-300">
                  {{ 'panel.executiveAnalysisDesc' | translate }}
                </p>
              </div>
            </div>
          </div>

          @defer (on viewport; prefetch on idle) {
            <div class="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
              <!-- Overall Performance Card -->
              @if (overallStat()) {
                <a
                  routerLink="/dashboard/agreements"
                  class="block transform transition-all duration-200 hover:scale-[1.02] lg:col-span-2 xl:col-span-3"
                >
                  <z-card
                    [mainTitle]="overallStat()!.title"
                    [mainSubtitle]="overallStat()!.total + ' Acuerdos Totales'"
                    [colData]="getCardColData(overallStat()!)"
                    [progressPercentage]="overallStat()!.percentage_reviewed"
                    [progressBarColor]="'bg-gradient-to-r from-blue-500 to-purple-500'"
                    [progressTextColor]="overallStat()!.textColor"
                    [staticBorderColor]="'ring-blue-500/20'"
                    [applyAnimatedBorder]="true"
                    [icon]="overallStat()!.iconSvg!"
                  ></z-card>
                </a>
              }
            </div>
          } @placeholder {
            <div class="h-40 w-full rounded-2xl bg-white/40 backdrop-blur-sm" [tuiSkeleton]="true"></div>
          } @loading {
            <div class="h-40 w-full animate-pulse rounded-2xl bg-white/40 backdrop-blur-sm" [tuiSkeleton]="true"></div>
          }
        </section>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelSmartComponent {
  protected roleService = inject(RoleService);
  protected dashboardFacade = inject(DashboardFacadeService);
  private router = inject(Router);
  protected overallStat = computed(() => this.dashboardFacade.overallStat());

  protected isExecutiveLevel = computed(() => {
    return this.roleService.isInAnyGroup(['ADMINISTRATION', 'TOP_MANAGEMENT', 'LEADERSHIP_TEAM']);
  });

  protected showGlobalStats = computed(() => {
    return this.roleService.isInAnyGroup(['ADMINISTRATION', 'TOP_MANAGEMENT', 'LEADERSHIP_TEAM', 'COORDINATION_TEAM']);
  });

  protected showAnalyticalReports = computed(() => {
    return this.roleService.isInAnyGroup(['ADMINISTRATION', 'TOP_MANAGEMENT', 'LEADERSHIP_TEAM']);
  });

  protected navigateToHomepage(): void {
    this.router.navigate(['/dashboard/homepage']);
  }

  protected navigateToProfile(): void {
    this.router.navigate(['/dashboard/profile']);
  }

  protected navigateToReports(): void {
    // TODO: Implement reports route when reports feature is created
    console.log('Navigate to analytical reports - feature pending');
  }

  getCardColData(stat: ReviewStat): CardColumnData[] {
    return [
      { dataSubtitle: 'Pendientes', dataNumber: stat.pending },
      { dataSubtitle: 'Revisados', dataNumber: stat.reviewed },
    ];
  }
}
