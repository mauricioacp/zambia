import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterLink } from '@angular/router';
import { TuiIcon } from '@taiga-ui/core';
import { WelcomeHeaderUiComponent } from './welcome-header.ui-component';
import type { WelcomeHeaderData } from './welcome-header.ui-component';
import { NavigationCardUiComponent } from './navigation-card.ui-component';
import type { NavigationCardData } from './navigation-card.ui-component';
import { StudentAgreementCardUiComponent } from './student-agreement-card.ui-component';
import type { StudentAgreementData } from './student-agreement-card.ui-component';
import { StatusDashboardCardUiComponent } from './status-dashboard-card.ui-component';
import type { StatusDashboardCardData } from './status-dashboard-card.ui-component';
import { GlassContainerUiComponent } from './glass-container.ui-component';
import { TranslateModule } from '@ngx-translate/core';
import { DataBadgeUiComponent } from './data-badge.ui-component';
import type { StatBadge } from '@zambia/data-access-dashboard';
import { CardComponent } from './card/card.component';
import type { CardColumnData } from './card/card.component';
import { WelcomeMessageUiComponent } from './welcome-message.ui-component';
import { KpiCardUiComponent } from './kpi-card.ui-component';
import type { KpiData } from './kpi-card.ui-component';
import { QuickActionCardUiComponent } from './quick-action-card.ui-component';
import type { QuickActionData } from './quick-action-card.ui-component';

interface DashboardStat {
  label: string;
  value: number;
  icon: string;
  color: string;
}

interface RecentActivity {
  id: string;
  title: string;
  date: Date;
  type: string;
}

interface QuickLink {
  label: string;
  route: string;
  icon: string;
  description?: string;
}

interface SystemAlert {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  date: Date;
}

interface HeadquarterSummary {
  id: string;
  name: string;
  studentCount: number;
  collaboratorCount: number;
  upcomingWorkshops: number;
}

interface HeadquarterActivity {
  id: string;
  description: string;
  date: Date;
  type: 'info' | 'warning' | 'error' | 'success';
}

interface HeadquarterPerformanceMetric {
  label: string;
  currentValue: number;
  previousValue: number;
  trend: 'up' | 'down' | 'stable';
  percentChange: number;
}

interface HeadquarterManagementAction {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'z-showcase',
  imports: [
    CommonModule,
    RouterLink,
    TranslateModule,
    TuiIcon,
    WelcomeHeaderUiComponent,
    NavigationCardUiComponent,
    StudentAgreementCardUiComponent,
    StatusDashboardCardUiComponent,
    GlassContainerUiComponent,
    DataBadgeUiComponent,
    CardComponent,
    WelcomeMessageUiComponent,
    KpiCardUiComponent,
    QuickActionCardUiComponent,
  ],
  template: `
    <!-- KPI Card Components Section -->
    <div class="mb-8">
      <h2 class="mb-4 text-xl font-semibold text-gray-800 dark:text-white">KPI Cards</h2>
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        @for (kpi of kpiCardsData(); track kpi.id) {
          <z-kpi-card [kpiData]="kpi" [loading]="false" (cardClicked)="onKpiCardClick($event)" />
        }
      </div>
    </div>

    <!-- Quick Action Cards Section -->
    <div class="mb-8">
      <h2 class="mb-4 text-xl font-semibold text-gray-800 dark:text-white">Quick Action Cards</h2>
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        @for (action of quickActionCardsData(); track action.id) {
          <z-quick-action-card [actionData]="action" (actionClicked)="onQuickActionCardClick($event)" />
        }
      </div>
    </div>

    <!-- Stats Section -->
    <div class="mb-8">
      <h2 class="mb-4 text-xl font-semibold text-gray-800 dark:text-white">Estadísticas</h2>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        @for (stat of stats(); track stat.label) {
          <div
            class="group relative overflow-hidden rounded-xl border border-gray-200/50 bg-white/90 p-4 shadow-lg shadow-gray-900/5 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-gray-300/70 hover:shadow-xl hover:shadow-gray-900/10 dark:border-slate-700/50 dark:bg-slate-800/90 dark:shadow-slate-900/20 dark:hover:border-slate-600/70 dark:hover:shadow-slate-900/40"
          >
            <!-- Gradient overlay on hover -->
            <div
              class="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-slate-700/30"
            ></div>

            <div class="relative z-10 flex items-center">
              <div
                class="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br shadow-lg transition-transform duration-300 group-hover:scale-110"
                [ngClass]="getStatGradientClass(stat.color)"
              >
                <tui-icon [icon]="stat.icon" [style.color]="'white'" [style.font-size.rem]="1.5" />
              </div>
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ stat.label }}</p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stat.value }}</p>
              </div>
            </div>
          </div>
        }
      </div>
    </div>

    <!-- Role-specific sections -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Admin Section -->
      <div
        class="group relative overflow-hidden rounded-xl border border-gray-200/50 bg-white/90 p-6 shadow-lg shadow-gray-900/5 backdrop-blur-sm transition-all duration-300 hover:border-gray-300/70 hover:shadow-xl dark:border-slate-700/50 dark:bg-slate-800/90 dark:shadow-slate-900/20 dark:hover:border-slate-600/70"
      >
        <h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Administración</h2>
        <div class="space-y-2">
          <div class="flex items-center justify-between rounded bg-gray-100 p-3 dark:bg-gray-700 dark:text-gray-200">
            <span>Acuerdos pendientes de aprobación</span>
            <span class="rounded-full bg-red-500 px-3 py-1 text-sm text-white dark:bg-red-600">5</span>
          </div>
          <div class="flex items-center justify-between rounded bg-gray-100 p-3 dark:bg-gray-700 dark:text-gray-200">
            <span>Usuarios nuevos esta semana</span>
            <span class="rounded-full bg-green-500 px-3 py-1 text-sm text-white dark:bg-green-600">12</span>
          </div>
          <div class="mt-4">
            <a
              routerLink="/dashboard/agreements"
              class="inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              Gestionar Acuerdos
            </a>
          </div>
        </div>
      </div>

      <!-- Director Section -->
      <div
        class="group relative overflow-hidden rounded-xl border border-gray-200/50 bg-white/90 p-6 shadow-lg shadow-gray-900/5 backdrop-blur-sm transition-all duration-300 hover:border-gray-300/70 hover:shadow-xl dark:border-slate-700/50 dark:bg-slate-800/90 dark:shadow-slate-900/20 dark:hover:border-slate-600/70"
      >
        <h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Dirección General</h2>
        <div class="space-y-2">
          <div class="flex items-center justify-between rounded bg-gray-100 p-3 dark:bg-gray-700 dark:text-gray-200">
            <span>Sedes activas</span>
            <span class="rounded-full bg-blue-500 px-3 py-1 text-sm text-white dark:bg-blue-600">8</span>
          </div>
          <div class="flex items-center justify-between rounded bg-gray-100 p-3 dark:bg-gray-700 dark:text-gray-200">
            <span>Total de estudiantes</span>
            <span class="rounded-full bg-purple-500 px-3 py-1 text-sm text-white dark:bg-purple-600">1,245</span>
          </div>
          <div class="mt-4">
            <a
              routerLink="/dashboard/reports"
              class="inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              Ver Reportes
            </a>
          </div>
        </div>
      </div>

      <!-- Headquarter Manager Section -->
      <div
        class="group relative overflow-hidden rounded-xl border border-gray-200/50 bg-white/90 p-6 shadow-lg shadow-gray-900/5 backdrop-blur-sm transition-all duration-300 hover:border-gray-300/70 hover:shadow-xl dark:border-slate-700/50 dark:bg-slate-800/90 dark:shadow-slate-900/20 dark:hover:border-slate-600/70"
      >
        <h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Mi Sede</h2>
        <div class="space-y-2">
          <div class="flex items-center justify-between rounded bg-gray-100 p-3 dark:bg-gray-700 dark:text-gray-200">
            <span>Estudiantes activos</span>
            <span class="rounded-full bg-green-500 px-3 py-1 text-sm text-white dark:bg-green-600">156</span>
          </div>
          <div class="flex items-center justify-between rounded bg-gray-100 p-3 dark:bg-gray-700 dark:text-gray-200">
            <span>Facilitadores</span>
            <span class="rounded-full bg-yellow-500 px-3 py-1 text-sm text-white dark:bg-yellow-600">12</span>
          </div>
          <div class="mt-4">
            <a
              routerLink="/dashboard/headquarter"
              class="inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              Gestionar Sede
            </a>
          </div>
        </div>
      </div>

      <!-- Recent Activity Section - visible to all -->
      <div
        class="group relative overflow-hidden rounded-xl border border-gray-200/50 bg-white/90 p-6 shadow-lg shadow-gray-900/5 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/90 dark:shadow-slate-900/20"
      >
        <h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Actividad Reciente</h2>
        <div class="space-y-3">
          @for (activity of recentActivities(); track activity.id) {
            <div class="flex items-center justify-between border-b border-gray-200 pb-2 dark:border-gray-700">
              <div>
                <p class="font-medium text-gray-800 dark:text-white">{{ activity.title }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ activity.date | date: 'medium' }}</p>
              </div>
              <span
                class="rounded-full px-3 py-1 text-xs"
                [ngClass]="{
                  'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300': activity.type === 'info',
                  'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300': activity.type === 'success',
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300':
                    activity.type === 'warning',
                  'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300': activity.type === 'error',
                }"
              >
                {{ activity.type }}
              </span>
            </div>
          }
        </div>
      </div>

      <!-- Quick Links Widget - visible to all -->
      <div
        class="group relative overflow-hidden rounded-xl border border-gray-200/50 bg-white/90 p-6 shadow-lg shadow-gray-900/5 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/90 dark:shadow-slate-900/20"
      >
        <h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Accesos Rápidos</h2>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          @for (link of quickLinks(); track link.label) {
            <a
              [routerLink]="link.route"
              class="group/link relative overflow-hidden rounded-lg border border-gray-200/50 p-3 transition-all duration-300 hover:scale-[1.02] hover:border-gray-300/70 hover:bg-white/50 hover:shadow-md dark:border-gray-700/50 dark:hover:border-gray-600/70 dark:hover:bg-gray-700/50"
            >
              <div class="flex items-center">
                <div
                  class="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-md transition-transform duration-300 group-hover/link:scale-110"
                >
                  <tui-icon [icon]="link.icon" [style.color]="'white'" [style.font-size.rem]="1.25" />
                </div>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">{{ link.label }}</p>
                  <p class="text-xs text-gray-600 dark:text-gray-400">{{ link.description }}</p>
                </div>
              </div>
            </a>
          }
        </div>
      </div>

      <!-- System Status Widget - visible to all -->
      <div
        class="group relative overflow-hidden rounded-xl border border-gray-200/50 bg-white/90 p-6 shadow-lg shadow-gray-900/5 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/90 dark:shadow-slate-900/20"
      >
        <h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Estado del Sistema</h2>
        <div class="space-y-3">
          @for (alert of systemAlerts(); track alert.id) {
            <div
              class="rounded-lg p-3"
              [ngClass]="{
                'border-l-4 border-blue-400 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20': alert.type === 'info',
                'border-l-4 border-green-400 bg-green-50 dark:border-green-500 dark:bg-green-900/20':
                  alert.type === 'success',
                'border-l-4 border-yellow-400 bg-yellow-50 dark:border-yellow-500 dark:bg-yellow-900/20':
                  alert.type === 'warning',
                'border-l-4 border-red-400 bg-red-50 dark:border-red-500 dark:bg-red-900/20': alert.type === 'error',
              }"
            >
              <div class="flex items-center">
                <tui-icon
                  class="mr-2"
                  [icon]="getAlertIcon(alert.type)"
                  [ngClass]="{
                    'text-blue-500 dark:text-blue-400': alert.type === 'info',
                    'text-green-500 dark:text-green-400': alert.type === 'success',
                    'text-yellow-500 dark:text-yellow-400': alert.type === 'warning',
                    'text-red-500 dark:text-red-400': alert.type === 'error',
                  }"
                  [style.font-size.rem]="1.25"
                />
                <p class="font-medium text-gray-800 dark:text-white">{{ alert.message }}</p>
              </div>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{ alert.date | date: 'medium' }}</p>
            </div>
          }
        </div>
      </div>

      <!-- Headquarter Summary Widget -->
      <div class="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800 dark:shadow-gray-900/30">
        <h2 class="mb-4 text-xl font-semibold text-gray-800 dark:text-white">{{ headquarterSummary().name }}</h2>
        <div class="grid grid-cols-3 gap-4">
          <div class="rounded-lg bg-blue-50 p-4 text-center dark:bg-blue-900/20">
            <p class="text-3xl font-bold text-blue-600 dark:text-blue-400">{{ headquarterSummary().studentCount }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-300">Estudiantes</p>
          </div>
          <div class="rounded-lg bg-green-50 p-4 text-center dark:bg-green-900/20">
            <p class="text-3xl font-bold text-green-600 dark:text-green-400">
              {{ headquarterSummary().collaboratorCount }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-300">Colaboradores</p>
          </div>
          <div class="rounded-lg bg-purple-50 p-4 text-center dark:bg-purple-900/20">
            <p class="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {{ headquarterSummary().upcomingWorkshops }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-300">Talleres Próximos</p>
          </div>
        </div>
      </div>

      <!-- Headquarter Dashboard Design Reference (commented out) -->
      <!--
    This section contains the design for the headquarter-specific dashboard widgets.
    These would be implemented in a separate component (e.g., headquarter-dashboard.smart-component.ts).-->

      <div class="grid grid-cols-2 gap-6 lg:grid-cols-2">
        <!-- Local Activity Feed Widget -->
        <div class="rounded-lg bg-white p-6 shadow-md">
          <h2 class="mb-4 text-xl font-semibold">Actividad Local</h2>
          <div class="space-y-3">
            @for (activity of headquarterActivities(); track activity.id) {
              <div class="flex items-center border-b border-gray-200 pb-2">
                <div
                  class="mr-3 flex h-8 w-8 items-center justify-center rounded-full"
                  [ngClass]="{
                    'bg-blue-100': activity.type === 'info',
                    'bg-green-100': activity.type === 'success',
                    'bg-yellow-100': activity.type === 'warning',
                    'bg-red-100': activity.type === 'error',
                  }"
                >
                  <span
                    class="material-icons text-sm"
                    [ngClass]="{
                      'text-blue-600': activity.type === 'info',
                      'text-green-600': activity.type === 'success',
                      'text-yellow-600': activity.type === 'warning',
                      'text-red-600': activity.type === 'error',
                    }"
                  >
                    {{
                      activity.type === 'info'
                        ? 'info'
                        : activity.type === 'success'
                          ? 'check_circle'
                          : activity.type === 'warning'
                            ? 'warning'
                            : 'error'
                    }}
                  </span>
                </div>
                <div>
                  <p class="font-medium">{{ activity.description }}</p>
                  <p class="text-xs text-gray-500">{{ activity.date | date: 'medium' }}</p>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Headquarter Performance Widget -->
        <div class="rounded-lg bg-white p-6 shadow-md">
          <h2 class="mb-4 text-xl font-semibold">Rendimiento</h2>
          <div class="space-y-4">
            @for (metric of headquarterPerformanceMetrics(); track metric.label) {
              <div>
                <div class="flex items-center justify-between">
                  <p class="font-medium">{{ metric.label }}</p>
                  <div class="flex items-center">
                    <p class="font-bold">{{ metric.currentValue }}</p>
                    <span
                      class="ml-2 flex items-center text-sm"
                      [ngClass]="{
                        'text-red-600': metric.trend === 'up' && metric.label === 'Abandonos',
                        'text-green-600': metric.trend === 'down' && metric.label === 'Abandonos',
                        'text-gray-600': metric.trend === 'stable',
                      }"
                    >
                      <tui-icon
                        [icon]="
                          metric.trend === 'up'
                            ? '@tui.chevron-up'
                            : metric.trend === 'down'
                              ? '@tui.chevron-down'
                              : '@tui.minus'
                        "
                        [style.font-size.rem]="0.875"
                      />
                      {{ metric.percentChange }}%
                    </span>
                  </div>
                </div>
                <div class="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    class="h-full rounded-full bg-blue-600 dark:bg-blue-500"
                    [style.width.%]="(metric.currentValue / metric.previousValue) * 100"
                  ></div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Management Actions Widget -->
        <div
          class="group relative overflow-hidden rounded-xl border border-gray-200/50 bg-white/90 p-6 shadow-lg shadow-gray-900/5 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/90 dark:shadow-slate-900/20"
        >
          <h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Gestión</h2>
          <div class="grid grid-cols-2 gap-3">
            @for (action of headquarterManagementActions(); track action.label) {
              <a
                [routerLink]="action.route"
                class="flex flex-col items-center rounded-lg border border-gray-200 p-4 text-center transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50"
              >
                <tui-icon
                  [icon]="action.icon"
                  class="mb-2 text-blue-600 dark:text-blue-400"
                  [style.font-size.rem]="1.875"
                />
                <p class="font-medium text-gray-800 dark:text-white">{{ action.label }}</p>
              </a>
            }
          </div>
        </div>
      </div>
    </div>

    <div class="h-full overflow-auto bg-gray-50 p-6 dark:bg-gray-900">
      <h1 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">{{ headquarterSummary().name }} - Dashboard</h1>

      <!-- Headquarter Summary Widget -->
      <div
        class="group relative mb-8 overflow-hidden rounded-xl border border-gray-200/50 bg-white/90 p-6 shadow-lg shadow-gray-900/5 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/90 dark:shadow-slate-900/20"
      >
        <h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Resumen de Sede</h2>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div class="rounded-lg bg-blue-50 p-4 text-center dark:bg-blue-900/20">
            <p class="text-3xl font-bold text-blue-600 dark:text-blue-400">{{ headquarterSummary().studentCount }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-300">Estudiantes</p>
          </div>
          <div class="rounded-lg bg-green-50 p-4 text-center dark:bg-green-900/20">
            <p class="text-3xl font-bold text-green-600 dark:text-green-400">
              {{ headquarterSummary().collaboratorCount }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-300">Colaboradores</p>
          </div>
          <div class="rounded-lg bg-purple-50 p-4 text-center dark:bg-purple-900/20">
            <p class="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {{ headquarterSummary().upcomingWorkshops }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-300">Talleres Próximos</p>
          </div>
        </div>
      </div>

      <!-- Main Dashboard Widgets -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- Local Activity Feed Widget -->
        <div
          class="group relative overflow-hidden rounded-xl border border-gray-200/50 bg-white/90 p-6 shadow-lg shadow-gray-900/5 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/90 dark:shadow-slate-900/20"
        >
          <h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Actividad Local</h2>
          <div class="space-y-3">
            @for (activity of headquarterActivities(); track activity.id) {
              <div class="flex items-center border-b border-gray-200 pb-2 dark:border-gray-700">
                <div
                  class="mr-3 flex h-8 w-8 items-center justify-center rounded-full"
                  [ngClass]="{
                    'bg-blue-100 dark:bg-blue-900/30': activity.type === 'info',
                    'bg-green-100 dark:bg-green-900/30': activity.type === 'success',
                    'bg-yellow-100 dark:bg-yellow-900/30': activity.type === 'warning',
                    'bg-red-100 dark:bg-red-900/30': activity.type === 'error',
                  }"
                >
                  <tui-icon
                    [icon]="getAlertIcon(activity.type)"
                    [ngClass]="{
                      'text-blue-600 dark:text-blue-300': activity.type === 'info',
                      'text-green-600 dark:text-green-300': activity.type === 'success',
                      'text-yellow-600 dark:text-yellow-300': activity.type === 'warning',
                      'text-red-600 dark:text-red-300': activity.type === 'error',
                    }"
                    [style.font-size.rem]="0.875"
                  />
                </div>
                <div>
                  <p class="font-medium text-gray-800 dark:text-white">{{ activity.description }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ activity.date | date: 'medium' }}</p>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Headquarter Performance Widget -->
        <div
          class="group relative overflow-hidden rounded-xl border border-gray-200/50 bg-white/90 p-6 shadow-lg shadow-gray-900/5 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/90 dark:shadow-slate-900/20"
        >
          <h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Rendimiento</h2>
          <div class="space-y-4">
            @for (metric of headquarterPerformanceMetrics(); track metric.label) {
              <div>
                <div class="flex items-center justify-between">
                  <p class="font-medium text-gray-800 dark:text-white">{{ metric.label }}</p>
                  <div class="flex items-center">
                    <p class="font-bold text-gray-800 dark:text-white">{{ metric.currentValue }}</p>
                    <span
                      class="ml-2 flex items-center text-sm"
                      [ngClass]="{
                        'text-red-600 dark:text-red-400': metric.trend === 'up' && metric.label === 'Abandonos',
                        'text-green-600 dark:text-green-400': metric.trend === 'down' && metric.label === 'Abandonos',
                        'text-gray-600 dark:text-gray-400': metric.trend === 'stable',
                      }"
                    >
                      <tui-icon
                        [icon]="
                          metric.trend === 'up'
                            ? '@tui.chevron-up'
                            : metric.trend === 'down'
                              ? '@tui.chevron-down'
                              : '@tui.minus'
                        "
                        [style.font-size.rem]="0.875"
                      />
                      {{ metric.percentChange }}%
                    </span>
                  </div>
                </div>
                <div class="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    class="h-full rounded-full bg-blue-600 dark:bg-blue-500"
                    [style.width.%]="(metric.currentValue / metric.previousValue) * 100"
                  ></div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Management Actions Widget -->
        <div class="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800 dark:shadow-gray-900/30">
          <h2 class="mb-4 text-xl font-semibold text-gray-800 dark:text-white">Gestión</h2>
          <div class="grid grid-cols-2 gap-3">
            @for (action of headquarterManagementActions(); track action.label) {
              <a
                [routerLink]="action.route"
                class="flex flex-col items-center rounded-lg border border-gray-200 p-4 text-center transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50"
              >
                <tui-icon
                  [icon]="action.icon"
                  class="mb-2 text-blue-600 dark:text-blue-400"
                  [style.font-size.rem]="1.875"
                />
                <p class="font-medium text-gray-800 dark:text-white">{{ action.label }}</p>
              </a>
            }
          </div>
        </div>
      </div>
    </div>

    <!-- New UI Components Showcase -->
    <div class="space-y-12 bg-gray-50 p-8 dark:bg-gray-900">
      <h1 class="mb-8 text-3xl font-bold text-gray-900 dark:text-white">New UI Components Showcase</h1>

      <!-- Welcome Header Component -->
      <section>
        <h2 class="mb-4 text-2xl font-semibold text-gray-800 dark:text-white">Welcome Header</h2>
        <div class="space-y-4">
          <z-welcome-header [data]="welcomeHeaderData()" />
          <z-welcome-header [data]="welcomeHeaderDataNoStatus()" />
        </div>
      </section>

      <!-- Glass Container Component -->
      <section>
        <h2 class="mb-4 text-2xl font-semibold text-gray-800 dark:text-white">Glass Container</h2>
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <z-glass-container [glowColor]="'blue'">
            <div class="p-6">
              <h3 class="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Blue Glow Container</h3>
              <p class="text-gray-600 dark:text-gray-300">This is content inside a glass container with blue glow.</p>
            </div>
          </z-glass-container>
          <z-glass-container [glowColor]="'purple'">
            <div class="p-6">
              <h3 class="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Purple Glow Container</h3>
              <p class="text-gray-600 dark:text-gray-300">This is content inside a glass container with purple glow.</p>
            </div>
          </z-glass-container>
        </div>
      </section>

      <!-- Navigation Card Component -->
      <section>
        <h2 class="mb-4 text-2xl font-semibold text-gray-800 dark:text-white">Navigation Cards</h2>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          @for (navCard of navigationCards(); track navCard.title) {
            <z-navigation-card [data]="navCard" (clicked)="onNavigationCardClick($event)" />
          }
        </div>
      </section>

      <!-- Student Agreement Card Component -->
      <section>
        <h2 class="mb-4 text-2xl font-semibold text-gray-800 dark:text-white">Student Agreement Card</h2>
        <div class="max-w-2xl">
          <z-student-agreement-card [data]="studentAgreementData()">
            <span title>{{ 'dashboard.home.myAgreement' | translate }}</span>
          </z-student-agreement-card>
        </div>
      </section>

      <!-- Status Dashboard Cards -->
      <section>
        <h2 class="mb-4 text-2xl font-semibold text-gray-800 dark:text-white">Status Dashboard Cards</h2>
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          @for (statusCard of statusDashboardCards(); track statusCard.id) {
            <z-status-dashboard-card [data]="statusCard" (clicked)="onStatusCardClick($event)" />
          }
        </div>
      </section>

      <!-- Data Badge Component -->
      <section>
        <h2 class="mb-4 text-2xl font-semibold text-gray-800 dark:text-white">Data Badge</h2>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          @for (badge of dataBadges(); track badge.label) {
            <z-data-badge [stat]="badge" [loading]="false" />
          }
        </div>
      </section>

      <!-- Card Component -->
      <section>
        <h2 class="mb-4 text-2xl font-semibold text-gray-800 dark:text-white">Card Component</h2>
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
          @for (card of cardData(); track card.mainTitle) {
            <z-card
              [mainTitle]="card.mainTitle"
              [mainSubtitle]="card.mainSubtitle"
              [colData]="card.colData"
              [progressPercentage]="card.progressPercentage"
              [progressBarColor]="card.progressBarColor"
              [progressTextColor]="card.progressTextColor"
              [icon]="card.icon"
              [staticBorderColor]="card.staticBorderColor"
              [applyAnimatedBorder]="card.applyAnimatedBorder"
            />
          }
        </div>
      </section>

      <!-- Welcome Message Component -->
      <section>
        <h2 class="mb-4 text-2xl font-semibold text-gray-800 dark:text-white">Welcome Message</h2>
        <div class="grid grid-cols-1 gap-4">
          <z-welcome-message [welcomeText]="'Welcome to Akademia! You have access to all organizational data.'" />
          <z-welcome-message
            [welcomeText]="'Level: Manager. You can access headquarters data and manage operations.'"
          />
          <z-welcome-message [welcomeText]="'Role: Student. You can access your personal data and course materials.'" />
        </div>
      </section>
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
export class ShowcaseUiComponent {
  protected stats = signal<DashboardStat[]>([
    { label: 'Estudiantes', value: 1245, icon: '@tui.users', color: 'bg-blue-500' },
    { label: 'Facilitadores', value: 78, icon: '@tui.user', color: 'bg-green-500' },
    { label: 'Acompañantes', value: 42, icon: '@tui.users', color: 'bg-purple-500' },
    { label: 'Sedes', value: 8, icon: '@tui.building-2', color: 'bg-orange-500' },
  ]);

  protected recentActivities = signal<RecentActivity[]>([
    {
      id: '1',
      title: 'Nuevo estudiante registrado',
      date: new Date(Date.now() - 1000 * 60 * 30),
      type: 'success',
    },
    {
      id: '2',
      title: 'Actualización de perfil de facilitador',
      date: new Date(Date.now() - 1000 * 60 * 120),
      type: 'info',
    },
    {
      id: '3',
      title: 'Problema con la sincronización de datos',
      date: new Date(Date.now() - 1000 * 60 * 60 * 5),
      type: 'error',
    },
    {
      id: '4',
      title: 'Nuevo acuerdo pendiente de revisión',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      type: 'warning',
    },
  ]);

  // Quick Links Widget data
  protected quickLinks = signal<QuickLink[]>([
    {
      label: 'Mi Perfil',
      route: '/profile',
      icon: '@tui.user',
      description: 'Ver y editar información personal',
    },
    {
      label: 'Calendario',
      route: '/calendar',
      icon: '@tui.calendar',
      description: 'Eventos y actividades programadas',
    },
    {
      label: 'Mensajes',
      route: '/messages',
      icon: '@tui.mail',
      description: 'Centro de comunicaciones',
    },
    {
      label: 'Documentos',
      route: '/documents',
      icon: '@tui.file-text',
      description: 'Archivos y recursos compartidos',
    },
  ]);

  // System Status Widget data
  protected systemAlerts = signal<SystemAlert[]>([
    {
      id: '1',
      message: 'Mantenimiento programado el 15 de Julio a las 22:00',
      type: 'info',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
    },
    {
      id: '2',
      message: 'Sincronización de datos completada exitosamente',
      type: 'success',
      date: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      id: '3',
      message: 'Actualización de sistema disponible',
      type: 'warning',
      date: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    },
  ]);

  // Sample data for headquarter-specific dashboard (for design reference)
  // In a real implementation, these would be in the headquarter dashboard component
  protected headquarterSummary = signal<HeadquarterSummary>({
    id: '1',
    name: 'Sede Madrid',
    studentCount: 156,
    collaboratorCount: 25,
    upcomingWorkshops: 3,
  });

  protected headquarterActivities = signal<HeadquarterActivity[]>([
    {
      id: '1',
      description: 'Nuevo estudiante: María García',
      date: new Date(Date.now() - 1000 * 60 * 60),
      type: 'success',
    },
    {
      id: '2',
      description: 'Taller "Introducción a la Programación" completado',
      date: new Date(Date.now() - 1000 * 60 * 60 * 3),
      type: 'info',
    },
    {
      id: '3',
      description: 'Facilitador ausente: Juan Pérez',
      date: new Date(Date.now() - 1000 * 60 * 60 * 5),
      type: 'warning',
    },
  ]);

  protected headquarterPerformanceMetrics = signal<HeadquarterPerformanceMetric[]>([
    {
      label: 'Asistencia',
      currentValue: 92,
      previousValue: 88,
      trend: 'up',
      percentChange: 4.5,
    },
    {
      label: 'Satisfacción',
      currentValue: 4.7,
      previousValue: 4.5,
      trend: 'up',
      percentChange: 4.4,
    },
    {
      label: 'Abandonos',
      currentValue: 3,
      previousValue: 5,
      trend: 'down',
      percentChange: 40,
    },
    {
      label: 'Progreso Académico',
      currentValue: 78,
      previousValue: 75,
      trend: 'up',
      percentChange: 4,
    },
  ]);

  protected headquarterManagementActions = signal<HeadquarterManagementAction[]>([
    {
      label: 'Añadir Estudiante',
      route: '/dashboard/headquarter/students/new',
      icon: '@tui.user-plus',
    },
    {
      label: 'Gestionar Colaboradores',
      route: '/dashboard/headquarter/collaborators',
      icon: '@tui.users',
    },
    {
      label: 'Programar Taller',
      route: '/dashboard/headquarter/workshops/new',
      icon: '@tui.calendar-days',
    },
    {
      label: 'Reportes Locales',
      route: '/dashboard/headquarter/reports',
      icon: '@tui.bar-chart-2',
    },
  ]);

  // New component data
  protected welcomeHeaderData = signal<WelcomeHeaderData>({
    title: 'Welcome to the Dashboard',
    subtitle: 'Your personalized workspace for managing organizational data',
    showStatus: true,
    statusText: 'System Active',
  });

  protected welcomeHeaderDataNoStatus = signal<WelcomeHeaderData>({
    title: 'Control Panel',
    subtitle: 'Organizational overview and analysis',
    showStatus: false,
  });

  protected navigationCards = signal<NavigationCardData[]>([
    {
      title: 'Go to Homepage',
      description: 'Access main dashboard and quick actions',
      icon: 'home',
      iconColor: 'blue',
      route: '/dashboard/homepage',
    },
    {
      title: 'My Profile',
      description: 'Manage your personal information',
      icon: 'user',
      iconColor: 'purple',
      route: '/dashboard/profile',
    },
    {
      title: 'Analytical Reports',
      description: 'Detailed insights and metrics',
      icon: 'chart-bar',
      iconColor: 'emerald',
      action: 'reports',
    },
  ]);

  protected studentAgreementData = signal<StudentAgreementData>({
    role: 'Student',
    status: 'Active',
    headquarterName: 'Madrid Headquarters',
    roleLabel: 'Role',
    statusLabel: 'Status',
    headquarterLabel: 'Headquarter',
  });

  protected statusDashboardCards = signal<StatusDashboardCardData[]>([
    {
      id: '1',
      title: 'Headquarters Overview',
      metrics: [
        { label: 'Total Headquarters', value: '12', colorClass: 'text-gray-900 dark:text-white' },
        { label: 'Active', value: '10', colorClass: 'text-emerald-600 dark:text-emerald-400' },
        { label: 'Inactive', value: '2', colorClass: 'text-red-600 dark:text-red-400' },
      ],
      iconPath:
        'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
      iconBgClass: 'from-emerald-600 to-teal-700',
      route: '/dashboard/headquarters',
    },
    {
      id: '2',
      title: 'Agreements Status',
      metrics: [
        { label: 'Total Agreements', value: '156' },
        { label: 'Active', value: '142', colorClass: 'text-emerald-600 dark:text-emerald-400' },
        { label: 'Pending Review', value: '14', colorClass: 'text-yellow-600 dark:text-yellow-400' },
      ],
      iconPath:
        'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      iconBgClass: 'from-purple-600 to-indigo-700',
      route: '/dashboard/agreements',
    },
    {
      id: '3',
      title: 'Student Statistics',
      metrics: [
        { label: 'Total Students', value: '1,245' },
        { label: 'New This Month', value: '+45', colorClass: 'text-emerald-600 dark:text-emerald-400' },
        { label: 'Graduation Rate', value: '92%', colorClass: 'text-blue-600 dark:text-blue-400' },
      ],
      iconPath:
        'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
      iconBgClass: 'from-blue-600 to-cyan-700',
      route: '/dashboard/students',
    },
  ]);

  protected onNavigationCardClick(action: string): void {
    console.log('Navigation card clicked:', action);
  }

  protected onStatusCardClick(card: StatusDashboardCardData): void {
    console.log('Status card clicked:', card.title);
  }

  // Data Badge Component data
  protected dataBadges = signal<StatBadge[]>([
    {
      label: 'Total Countries',
      value: 12,
      icon: '@tui.globe',
      color: 'bg-blue-500',
      details: {
        active: 10,
        inactive: 2,
      },
    },
    {
      label: 'Total Headquarters',
      value: 45,
      icon: '@tui.home',
      color: 'bg-emerald-500',
      details: {
        active: 42,
        inactive: 3,
      },
    },
    {
      label: 'Total Students',
      value: 1245,
      icon: '@tui.users',
      color: 'bg-purple-500',
      details: {
        active: 1180,
        inactive: 65,
      },
    },
    {
      label: 'Active Agreements',
      value: 890,
      icon: '@tui.file',
      color: 'bg-orange-500',
      details: {
        active: 850,
        standby: 40,
      },
    },
  ]);

  // Card Component data
  protected cardData = signal<
    Array<{
      mainTitle: string;
      mainSubtitle: string;
      colData: CardColumnData[];
      progressPercentage: number;
      progressBarColor: string;
      progressTextColor: string;
      icon: string;
      staticBorderColor: string;
      applyAnimatedBorder: boolean;
    }>
  >([
    {
      mainTitle: 'Agreement Overview',
      mainSubtitle: '156 Total Agreements',
      colData: [
        { dataSubtitle: 'Pending', dataNumber: 45 },
        { dataSubtitle: 'Reviewed', dataNumber: 111 },
      ],
      progressPercentage: 71.2,
      progressBarColor: 'bg-gradient-to-r from-blue-500 to-purple-500',
      progressTextColor: 'text-blue-600',
      icon: '@tui.file',
      staticBorderColor: 'ring-blue-500/20',
      applyAnimatedBorder: true,
    },
    {
      mainTitle: 'Student Progress',
      mainSubtitle: '1,245 Active Students',
      colData: [
        { dataSubtitle: 'New', dataNumber: 78 },
        { dataSubtitle: 'Graduating', dataNumber: 234 },
        { dataSubtitle: 'On Track', dataNumber: 933 },
      ],
      progressPercentage: 85.7,
      progressBarColor: 'bg-gradient-to-r from-emerald-500 to-teal-500',
      progressTextColor: 'text-emerald-600',
      icon: '@tui.users',
      staticBorderColor: 'ring-emerald-500/20',
      applyAnimatedBorder: true,
    },
  ]);

  // KPI Card data
  protected kpiCardsData = signal<KpiData[]>([
    {
      id: '1',
      title: 'Total Headquarters',
      value: 45,
      trend: 'up',
      trendPercentage: 12.5,
      icon: '@tui.home',
      iconBgClass: 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700',
      route: '/dashboard/headquarters',
    },
    {
      id: '2',
      title: 'Active Students',
      value: 1245,
      trend: 'up',
      trendPercentage: 8.3,
      icon: '@tui.users',
      iconBgClass: 'bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700',
      route: '/dashboard/students',
    },
    {
      id: '3',
      title: 'Total Agreements',
      value: 890,
      trend: 'down',
      trendPercentage: 2.1,
      icon: '@tui.file',
      iconBgClass: 'bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700',
      route: '/dashboard/agreements',
    },
    {
      id: '4',
      title: 'Active Workshops',
      value: 23,
      trend: 'stable',
      trendPercentage: 0,
      icon: '@tui.calendar',
      iconBgClass: 'bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700',
      route: '/dashboard/workshops',
    },
  ]);

  // Quick Action Card data
  protected quickActionCardsData = signal<QuickActionData[]>([
    {
      id: '1',
      title: 'Create New Agreement',
      description: 'Register a new student or staff member',
      icon: '@tui.user-plus',
      iconBgClass: 'bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700',
      route: '/dashboard/agreements/new',
    },
    {
      id: '2',
      title: 'Schedule Workshop',
      description: 'Plan and organize educational workshops',
      icon: '@tui.calendar-plus',
      iconBgClass: 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700',
      route: '/dashboard/workshops/new',
    },
    {
      id: '3',
      title: 'Generate Reports',
      description: 'Create analytics and performance reports',
      icon: '@tui.bar-chart-2',
      iconBgClass: 'bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700',
      action: () => console.log('Generate reports action'),
    },
  ]);

  protected onKpiCardClick(kpi: KpiData): void {
    console.log('KPI card clicked:', kpi.title);
  }

  protected onQuickActionCardClick(action: QuickActionData): void {
    console.log('Quick action card clicked:', action.title);
  }

  protected getStatGradientClass(color: string): string {
    // Map colors to gradient classes
    if (color.includes('blue') || color.includes('sky')) {
      return 'from-blue-500 to-blue-600';
    } else if (color.includes('green') || color.includes('emerald')) {
      return 'from-emerald-500 to-emerald-600';
    } else if (color.includes('purple') || color.includes('violet')) {
      return 'from-purple-500 to-purple-600';
    } else if (color.includes('orange') || color.includes('amber')) {
      return 'from-orange-500 to-orange-600';
    } else {
      return 'from-gray-500 to-gray-600';
    }
  }

  protected getAlertIcon(type: 'info' | 'warning' | 'error' | 'success'): string {
    switch (type) {
      case 'info':
        return '@tui.info';
      case 'success':
        return '@tui.circle-check';
      case 'warning':
        return '@tui.triangle-alert';
      case 'error':
        return '@tui.circle-x';
      default:
        return '@tui.info';
    }
  }
}
