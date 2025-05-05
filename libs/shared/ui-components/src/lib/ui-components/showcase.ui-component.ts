import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HasAnyRoleDirective } from '@zambia/data-access-roles-permissions';
import { Role } from '@zambia/util-roles-permissions';
import { RouterLink } from '@angular/router';

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
  type: string;
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
  imports: [CommonModule, HasAnyRoleDirective, RouterLink],
  template: `
    <!-- Stats Section -->
    <div class="mb-8">
      <h2 class="mb-4 text-xl font-semibold text-gray-800 dark:text-white">Estadísticas</h2>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        @for (stat of stats(); track stat.label) {
          <div class="rounded-lg bg-white p-4 shadow-md dark:bg-gray-800 dark:shadow-gray-900/30">
            <div class="flex items-center">
              <div class="mr-4 flex h-12 w-12 items-center justify-center rounded-full" [ngClass]="stat.color">
                <span class="material-icons text-white">{{ stat.icon }}</span>
              </div>
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ stat.label }}</p>
                <p class="text-2xl font-bold text-gray-800 dark:text-white">{{ stat.value }}</p>
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
        *hasRole="Role.SUPERADMIN"
        class="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800 dark:shadow-gray-900/30"
      >
        <h2 class="mb-4 text-xl font-semibold text-gray-800 dark:text-white">Administración</h2>
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
        *hasAnyRole="[Role.GENERAL_DIRECTOR, Role.EXECUTIVE_LEADER, Role.SUPERADMIN]"
        class="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800 dark:shadow-gray-900/30"
      >
        <h2 class="mb-4 text-xl font-semibold text-gray-800 dark:text-white">Dirección General</h2>
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
        *hasAnyRole="[Role.HEADQUARTER_MANAGER, Role.SUPERADMIN]"
        class="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800 dark:shadow-gray-900/30"
      >
        <h2 class="mb-4 text-xl font-semibold text-gray-800 dark:text-white">Mi Sede</h2>
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
      <div class="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800 dark:shadow-gray-900/30">
        <h2 class="mb-4 text-xl font-semibold text-gray-800 dark:text-white">Actividad Reciente</h2>
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
      <div class="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800 dark:shadow-gray-900/30">
        <h2 class="mb-4 text-xl font-semibold text-gray-800 dark:text-white">Accesos Rápidos</h2>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          @for (link of quickLinks(); track link.label) {
            <a
              [routerLink]="link.route"
              class="flex items-center rounded-lg border border-gray-200 p-3 transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50"
            >
              <div class="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <span class="material-icons text-blue-600 dark:text-blue-300">{{ link.icon }}</span>
              </div>
              <div>
                <p class="font-medium text-gray-800 dark:text-white">{{ link.label }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ link.description }}</p>
              </div>
            </a>
          }
        </div>
      </div>

      <!-- System Status Widget - visible to all -->
      <div class="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800 dark:shadow-gray-900/30">
        <h2 class="mb-4 text-xl font-semibold text-gray-800 dark:text-white">Estado del Sistema</h2>
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
                <span
                  class="material-icons mr-2 text-lg"
                  [ngClass]="{
                    'text-blue-500 dark:text-blue-400': alert.type === 'info',
                    'text-green-500 dark:text-green-400': alert.type === 'success',
                    'text-yellow-500 dark:text-yellow-400': alert.type === 'warning',
                    'text-red-500 dark:text-red-400': alert.type === 'error',
                  }"
                >
                  {{
                    alert.type === 'info'
                      ? 'info'
                      : alert.type === 'success'
                        ? 'check_circle'
                        : alert.type === 'warning'
                          ? 'warning'
                          : 'error'
                  }}
                </span>
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
                      <span class="material-icons text-sm">
                        {{
                          metric.trend === 'up' ? 'arrow_upward' : metric.trend === 'down' ? 'arrow_downward' : 'remove'
                        }}
                      </span>
                      {{ metric.percentChange }}%
                    </span>
                  </div>
                </div>
                <div class="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    class="h-full rounded-full bg-blue-600"
                    [style.width.%]="(metric.currentValue / metric.previousValue) * 100"
                  ></div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Management Actions Widget -->
        <div class="rounded-lg bg-white p-6 shadow-md">
          <h2 class="mb-4 text-xl font-semibold">Gestión</h2>
          <div class="grid grid-cols-2 gap-3">
            @for (action of headquarterManagementActions(); track action.label) {
              <a
                [routerLink]="action.route"
                class="flex flex-col items-center rounded-lg border border-gray-200 p-4 text-center transition hover:bg-gray-50"
              >
                <span class="material-icons mb-2 text-3xl text-blue-600">{{ action.icon }}</span>
                <p class="font-medium">{{ action.label }}</p>
              </a>
            }
          </div>
        </div>
      </div>
    </div>

    <div class="h-full overflow-auto bg-gray-50 p-6 dark:bg-gray-900">
      <h1 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">{{ headquarterSummary().name }} - Dashboard</h1>

      <!-- Headquarter Summary Widget -->
      <div class="mb-8 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800 dark:shadow-gray-900/30">
        <h2 class="mb-4 text-xl font-semibold text-gray-800 dark:text-white">Resumen de Sede</h2>
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
        <div class="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800 dark:shadow-gray-900/30">
          <h2 class="mb-4 text-xl font-semibold text-gray-800 dark:text-white">Actividad Local</h2>
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
                  <span
                    class="material-icons text-sm"
                    [ngClass]="{
                      'text-blue-600 dark:text-blue-300': activity.type === 'info',
                      'text-green-600 dark:text-green-300': activity.type === 'success',
                      'text-yellow-600 dark:text-yellow-300': activity.type === 'warning',
                      'text-red-600 dark:text-red-300': activity.type === 'error',
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
                  <p class="font-medium text-gray-800 dark:text-white">{{ activity.description }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ activity.date | date: 'medium' }}</p>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Headquarter Performance Widget -->
        <div class="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800 dark:shadow-gray-900/30">
          <h2 class="mb-4 text-xl font-semibold text-gray-800 dark:text-white">Rendimiento</h2>
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
                      <span class="material-icons text-sm">
                        {{
                          metric.trend === 'up' ? 'arrow_upward' : metric.trend === 'down' ? 'arrow_downward' : 'remove'
                        }}
                      </span>
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
                <span class="material-icons mb-2 text-3xl text-blue-600 dark:text-blue-400">{{ action.icon }}</span>
                <p class="font-medium text-gray-800 dark:text-white">{{ action.label }}</p>
              </a>
            }
          </div>
        </div>
      </div>
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
  protected Role = Role;

  protected stats = signal<DashboardStat[]>([
    { label: 'Estudiantes', value: 1245, icon: 'school', color: 'bg-blue-500' },
    { label: 'Facilitadores', value: 78, icon: 'person', color: 'bg-green-500' },
    { label: 'Acompañantes', value: 42, icon: 'people', color: 'bg-purple-500' },
    { label: 'Sedes', value: 8, icon: 'location_on', color: 'bg-orange-500' },
  ]);

  protected recentActivities = signal<RecentActivity[]>([
    {
      id: '1',
      title: 'Nuevo estudiante registrado',
      date: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      type: 'success',
    },
    {
      id: '2',
      title: 'Actualización de perfil de facilitador',
      date: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
      type: 'info',
    },
    {
      id: '3',
      title: 'Problema con la sincronización de datos',
      date: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
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
      icon: 'person',
      description: 'Ver y editar información personal',
    },
    {
      label: 'Calendario',
      route: '/calendar',
      icon: 'calendar_today',
      description: 'Eventos y actividades programadas',
    },
    {
      label: 'Mensajes',
      route: '/messages',
      icon: 'mail',
      description: 'Centro de comunicaciones',
    },
    {
      label: 'Documentos',
      route: '/documents',
      icon: 'description',
      description: 'Archivos y recursos compartidos',
    },
  ]);

  // System Status Widget data
  protected systemAlerts = signal<SystemAlert[]>([
    {
      id: '1',
      message: 'Mantenimiento programado el 15 de Julio a las 22:00',
      type: 'info',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3 days in future
    },
    {
      id: '2',
      message: 'Sincronización de datos completada exitosamente',
      type: 'success',
      date: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
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
      date: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      type: 'success',
    },
    {
      id: '2',
      description: 'Taller "Introducción a la Programación" completado',
      date: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      type: 'info',
    },
    {
      id: '3',
      description: 'Facilitador ausente: Juan Pérez',
      date: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
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
      icon: 'person_add',
    },
    {
      label: 'Gestionar Colaboradores',
      route: '/dashboard/headquarter/collaborators',
      icon: 'people',
    },
    {
      label: 'Programar Taller',
      route: '/dashboard/headquarter/workshops/new',
      icon: 'event',
    },
    {
      label: 'Reportes Locales',
      route: '/dashboard/headquarter/reports',
      icon: 'bar_chart',
    },
  ]);
}
