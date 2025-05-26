import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleService } from '@zambia/data-access-roles-permissions';
import { CardColumnData, CardComponent, DataBadgeUiComponent } from '@zambia/ui-components';
import { DashboardFacadeService, ReviewStat } from '@zambia/data-access-dashboard';
import { TuiSkeleton } from '@taiga-ui/kit';
import { ROLE } from '@zambia/util-roles-definitions';

@Component({
  selector: 'z-panel',
  standalone: true,
  imports: [CommonModule, DataBadgeUiComponent, CardComponent, TuiSkeleton],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-slate-900">
      <!-- Header Section -->
      <div class="relative overflow-hidden bg-white/80 p-6 backdrop-blur-sm sm:p-8 dark:bg-slate-800/80">
        <div
          class="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 dark:from-blue-400/10 dark:to-purple-400/10"
        ></div>
        <div class="relative">
          <div class="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 class="mb-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
                Panel de Control
              </h1>
              <p class="text-lg text-gray-600 dark:text-gray-300">Vista general de tu organización</p>
            </div>
            <div class="flex items-center gap-3">
              <div class="rounded-full bg-green-100 p-2 dark:bg-green-900/30">
                <div class="h-2 w-2 rounded-full bg-green-500"></div>
              </div>
              <span class="text-sm font-medium text-gray-600 dark:text-gray-300">Sistema activo</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions Section -->
      <section class="py-8">
        <div class="mb-6">
          <h2 class="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Acciones Rápidas</h2>
          <p class="text-gray-600 dark:text-gray-300">Accesos directos a funciones principales</p>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          @for (action of quickActions(); track action.title) {
            <button
              class="group relative overflow-hidden rounded-xl bg-white p-6 text-left shadow-sm transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10 dark:bg-slate-800 dark:hover:shadow-blue-400/10"
              [class]="action.bgClass"
            >
              <div class="flex items-center gap-4">
                <div class="rounded-lg p-3" [class]="action.iconBgClass">
                  <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      [attr.d]="action.iconPath"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white">{{ action.title }}</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-300">{{ action.description }}</p>
                </div>
              </div>
              <div
                class="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-10"
                [class]="action.hoverBg"
              ></div>
            </button>
          }
        </div>
      </section>

      <!-- Quick Stats Overview -->
      @if (showGlobalStats()) {
        <section class="mb-12">
          <div class="mb-6">
            <h2 class="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Estadísticas Globales</h2>
            <p class="text-gray-600 dark:text-gray-300">Vista general del estado de acuerdos en la organización</p>
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
                <div [tuiSkeleton]="true" class="h-28 w-full rounded-xl"></div>
              }
            </div>
          } @loading {
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              @for (i of [1, 2, 3, 4]; track i) {
                <div [tuiSkeleton]="true" class="h-28 w-full animate-pulse rounded-xl"></div>
              }
            </div>
          }
        </section>
      }

      <!-- Executive Dashboard (Level 70+) -->
      @if (isExecutiveLevel()) {
        <section class="mb-12">
          <div class="mb-6">
            <div class="flex items-center gap-3">
              <div class="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 p-2">
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
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Panel Ejecutivo</h2>
                <p class="text-gray-600 dark:text-gray-300">Métricas estratégicas y análisis organizacional</p>
              </div>
            </div>
          </div>

          @defer (on viewport; prefetch on idle) {
            <div class="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
              <!-- Overall Performance Card -->
              @if (overallStat()) {
                <div class="transform transition-all duration-200 hover:scale-[1.02] lg:col-span-2 xl:col-span-3">
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
                </div>
              }
            </div>
          } @placeholder {
            <div [tuiSkeleton]="true" class="h-40 w-full rounded-xl"></div>
          } @loading {
            <div [tuiSkeleton]="true" class="h-40 w-full animate-pulse rounded-xl"></div>
          }
        </section>
      }

      <!-- Management Dashboard (Level 50+) -->
      @if (isManagerLevel()) {
        <section class="mb-12">
          <div class="mb-6">
            <div class="flex items-center gap-3">
              <div class="rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 p-2">
                <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  ></path>
                </svg>
              </div>
              <div>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Panel de Gestión</h2>
                <p class="text-gray-600 dark:text-gray-300">Herramientas de gestión y supervisión operativa</p>
              </div>
            </div>
          </div>

          @defer (on viewport; prefetch on idle) {
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              @if (reviewStatsLoading()) {
                @for (i of [1, 2, 3, 4, 5, 6]; track i) {
                  <div [tuiSkeleton]="true" class="h-48 w-full rounded-xl"></div>
                }
              } @else {
                @for (stat of otherStats(); track stat.title) {
                  <div class="transform transition-all duration-200 hover:scale-[1.02]">
                    <z-card
                      [mainTitle]="stat.title"
                      [mainSubtitle]="stat.total + ' Acuerdos Totales'"
                      [colData]="getCardColData(stat)"
                      [progressPercentage]="stat.percentage_reviewed"
                      [progressBarColor]="stat.color"
                      [progressTextColor]="stat.textColor"
                      [applyAnimatedBorder]="true"
                      [icon]="stat.iconSvg!"
                    ></z-card>
                  </div>
                }
              }
            </div>
          } @placeholder {
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              @for (i of [1, 2, 3, 4, 5, 6]; track i) {
                <div [tuiSkeleton]="true" class="h-48 w-full rounded-xl"></div>
              }
            </div>
          } @loading {
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              @for (i of [1, 2, 3, 4, 5, 6]; track i) {
                <div [tuiSkeleton]="true" class="h-48 w-full animate-pulse rounded-xl"></div>
              }
            </div>
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
  protected welcomeText = computed(() => this.roleService.getWelcomeText());
  protected dashboardFacade = inject(DashboardFacadeService);

  protected reviewStatsLoading = computed(() => this.dashboardFacade.reviewStatsLoading());
  protected overallStat = computed(() => this.dashboardFacade.overallStat());
  protected otherStats = computed(() => this.dashboardFacade.otherStats());

  // Role-based access levels
  protected userRole = computed(() => this.roleService.userRole());

  // Role level detection (based on hierarchy from ROLES_CONSTANTS.ts)
  protected isExecutiveLevel = computed(() => {
    const role = this.userRole();
    return (
      role === ROLE.SUPERADMIN || // level 100
      role === ROLE.GENERAL_DIRECTOR || // level 90
      role === ROLE.EXECUTIVE_LEADER || // level 90
      role === ROLE.PEDAGOGICAL_LEADER || // level 80
      role === ROLE.INNOVATION_LEADER || // level 80
      role === ROLE.COMMUNICATION_LEADER || // level 80
      role === ROLE.COMMUNITY_LEADER || // level 80
      role === ROLE.COORDINATION_LEADER || // level 80
      role === ROLE.LEGAL_ADVISOR || // level 80
      role === ROLE.COORDINATOR || // level 70
      role === ROLE.KONSEJO_MEMBER
    ); // level 70
  });

  protected isManagerLevel = computed(() => {
    const role = this.userRole();
    return (
      this.isExecutiveLevel() ||
      role === ROLE.HEADQUARTER_MANAGER || // level 50
      role === ROLE.PEDAGOGICAL_MANAGER || // level 40
      role === ROLE.COMMUNICATION_MANAGER || // level 40
      role === ROLE.COMPANION_DIRECTOR
    ); // level 40
  });

  protected showGlobalStats = computed(() => {
    return this.roleService.isInAnyGroup(['ADMINISTRATION', 'TOP_MANAGEMENT', 'LEADERSHIP_TEAM', 'COORDINATION_TEAM']);
  });

  // Quick actions based on role
  protected quickActions = computed(() => {
    const role = this.userRole();
    const baseActions = [
      {
        title: 'Ver Perfil',
        description: 'Gestiona tu información personal',
        iconPath: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
        iconBgClass: 'bg-gradient-to-r from-blue-500 to-blue-600',
        bgClass: '',
        hoverBg: 'bg-blue-500',
      },
    ];

    if (this.isExecutiveLevel()) {
      baseActions.unshift(
        {
          title: 'Reportes Ejecutivos',
          description: 'Análisis y métricas estratégicas',
          iconPath:
            'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
          iconBgClass: 'bg-gradient-to-r from-purple-500 to-pink-500',
          bgClass: '',
          hoverBg: 'bg-purple-500',
        },
        {
          title: 'Panel Estratégico',
          description: 'Vista global de la organización',
          iconPath:
            'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064',
          iconBgClass: 'bg-gradient-to-r from-indigo-500 to-purple-500',
          bgClass: '',
          hoverBg: 'bg-indigo-500',
        }
      );
    }

    if (this.isManagerLevel()) {
      baseActions.unshift(
        {
          title: 'Gestión de Equipos',
          description: 'Supervisión y coordinación',
          iconPath:
            'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
          iconBgClass: 'bg-gradient-to-r from-emerald-500 to-teal-500',
          bgClass: '',
          hoverBg: 'bg-emerald-500',
        },
        {
          title: 'Acuerdos Pendientes',
          description: 'Revisar y gestionar acuerdos',
          iconPath:
            'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
          iconBgClass: 'bg-gradient-to-r from-orange-500 to-red-500',
          bgClass: '',
          hoverBg: 'bg-orange-500',
        }
      );
    }

    if (this.roleService.isInAnyGroup(['HEADQUARTERS_MANAGEMENT'])) {
      baseActions.unshift({
        title: 'Mi Sede',
        description: 'Información de tu sede',
        iconPath:
          'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
        iconBgClass: 'bg-gradient-to-r from-cyan-500 to-blue-500',
        bgClass: '',
        hoverBg: 'bg-cyan-500',
      });
    }

    return baseActions.slice(0, 4); // Limit to 4 actions for layout
  });

  getCardColData(stat: ReviewStat): CardColumnData[] {
    return [
      { dataSubtitle: 'Pendientes', dataNumber: stat.pending },
      { dataSubtitle: 'Revisados', dataNumber: stat.reviewed },
    ];
  }
}
