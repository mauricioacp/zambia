import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Role } from '@zambia/util-roles-permissions';
import { RouterLink } from '@angular/router';

interface HeadquarterSummary {
  id: string;
  name: string;
  studentCount: number;
  collaboratorCount: number;
  upcomingWorkshops: number;
}

/**
 * Interface for headquarter activity
 */
interface HeadquarterActivity {
  id: string;
  description: string;
  date: Date;
  type: string;
}

/**
 * Interface for headquarter performance metric
 */
interface HeadquarterPerformanceMetric {
  label: string;
  currentValue: number;
  previousValue: number;
  trend: 'up' | 'down' | 'stable';
  percentChange: number;
}

/**
 * Interface for headquarter management action
 */
interface HeadquarterManagementAction {
  label: string;
  route: string;
  icon: string;
}

/**
 * Smart component for the headquarter dashboard
 * Displays headquarter-specific widgets including:
 * - Headquarter Summary
 * - Local Activity Feed
 * - Headquarter Performance
 * - Management Actions
 */
@Component({
  selector: 'z-headquarter-dashboard',
  imports: [CommonModule, RouterLink],
  template: `<div class="h-full overflow-auto bg-gray-50 p-6 dark:bg-gray-900">
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
  </div>`,
  styles: `
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeadquarterDashboardSmartComponent {
  // private authService = inject(AuthService);
  // protected rolesService = inject(RolesService);
  protected Role = Role;

  /**
   * Optional input property for the headquarter ID
   * This would be used to fetch real data for a specific headquarter
   */
  @Input() headquarterId: string | null = null;

  // Sample data for headquarter summary
  protected headquarterSummary = signal<HeadquarterSummary>({
    id: '1',
    name: 'Sede Madrid',
    studentCount: 156,
    collaboratorCount: 25,
    upcomingWorkshops: 3,
  });

  // Sample data for headquarter activities
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
    {
      id: '4',
      description: 'Error en la sincronización de datos de estudiantes',
      date: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
      type: 'error',
    },
    {
      id: '5',
      description: 'Nueva inscripción: Carlos Rodríguez',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      type: 'success',
    },
  ]);

  // Sample data for headquarter performance metrics
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

  // Sample data for headquarter management actions
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
