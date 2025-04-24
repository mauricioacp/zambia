import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '@zambia/data-access-auth';
import {
  HasAnyRoleDirective,
  HasRoleDirective,
  HasRoleLevelDirective,
  RolesService,
} from '@zambia/data-access-roles-permissions';
import { Role } from '@zambia/util-roles-permissions';

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

@Component({
  selector: 'z-panel',
  standalone: true,
  imports: [CommonModule, RouterLink, HasRoleLevelDirective, HasAnyRoleDirective, HasRoleDirective],
  template: `
    <div class="h-full overflow-auto p-6">
      <h1 class="mb-6 text-2xl font-bold">Panel de Control</h1>

      <!-- Welcome message based on role -->
      <div class="mb-8 rounded-lg bg-white p-6 shadow-md">
        <!--        <h2 class="mb-2 text-xl font-semibold">Bienvenido, {{ getUserDisplayName() }}</h2>-->
        <p class="text-gray-600">
          @if (rolesService.hasRole(Role.SUPERADMIN)) {
            Tienes acceso completo a todas las funciones del sistema.
          } @else if (rolesService.hasRole(Role.GENERAL_DIRECTOR)) {
            Tienes acceso a la información de todas las sedes.
          } @else if (rolesService.hasRole(Role.HEADQUARTER_MANAGER)) {
            Tienes acceso a la información de tu sede.
          } @else {
            Bienvenido al sistema.
          }
        </p>
      </div>

      <!-- Stats Section -->
      <div class="mb-8">
        <h2 class="mb-4 text-xl font-semibold">Estadísticas</h2>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          @for (stat of stats(); track stat.label) {
            <div class="rounded-lg bg-white p-4 shadow-md">
              <div class="flex items-center">
                <div class="mr-4 flex h-12 w-12 items-center justify-center rounded-full" [ngClass]="stat.color">
                  <span class="material-icons text-white">{{ stat.icon }}</span>
                </div>
                <div>
                  <p class="text-sm text-gray-500">{{ stat.label }}</p>
                  <p class="text-2xl font-bold">{{ stat.value }}</p>
                </div>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Role-specific sections -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- Admin Section -->
        <div *hasRole="Role.SUPERADMIN" class="rounded-lg bg-white p-6 shadow-md">
          <h2 class="mb-4 text-xl font-semibold">Administración</h2>
          <div class="space-y-2">
            <div class="flex items-center justify-between rounded bg-gray-100 p-3">
              <span>Acuerdos pendientes de aprobación</span>
              <span class="rounded-full bg-red-500 px-3 py-1 text-sm text-white">5</span>
            </div>
            <div class="flex items-center justify-between rounded bg-gray-100 p-3">
              <span>Usuarios nuevos esta semana</span>
              <span class="rounded-full bg-green-500 px-3 py-1 text-sm text-white">12</span>
            </div>
            <div class="mt-4">
              <a
                routerLink="/dashboard/agreements"
                class="inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Gestionar Acuerdos
              </a>
            </div>
          </div>
        </div>

        <!-- Director Section -->
        <div *hasAnyRole="[Role.GENERAL_DIRECTOR, Role.EXECUTIVE_LEADER]" class="rounded-lg bg-white p-6 shadow-md">
          <h2 class="mb-4 text-xl font-semibold">Dirección General</h2>
          <div class="space-y-2">
            <div class="flex items-center justify-between rounded bg-gray-100 p-3">
              <span>Sedes activas</span>
              <span class="rounded-full bg-blue-500 px-3 py-1 text-sm text-white">8</span>
            </div>
            <div class="flex items-center justify-between rounded bg-gray-100 p-3">
              <span>Total de estudiantes</span>
              <span class="rounded-full bg-purple-500 px-3 py-1 text-sm text-white">1,245</span>
            </div>
            <div class="mt-4">
              <a
                routerLink="/dashboard/reports"
                class="inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Ver Reportes
              </a>
            </div>
          </div>
        </div>

        <!-- Headquarter Manager Section -->
        <div *hasRoleLevel="Role.HEADQUARTER_MANAGER" class="rounded-lg bg-white p-6 shadow-md">
          <h2 class="mb-4 text-xl font-semibold">Mi Sede</h2>
          <div class="space-y-2">
            <div class="flex items-center justify-between rounded bg-gray-100 p-3">
              <span>Estudiantes activos</span>
              <span class="rounded-full bg-green-500 px-3 py-1 text-sm text-white">156</span>
            </div>
            <div class="flex items-center justify-between rounded bg-gray-100 p-3">
              <span>Facilitadores</span>
              <span class="rounded-full bg-yellow-500 px-3 py-1 text-sm text-white">12</span>
            </div>
            <div class="mt-4">
              <a
                routerLink="/dashboard/headquarter"
                class="inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Gestionar Sede
              </a>
            </div>
          </div>
        </div>

        <!-- Recent Activity Section - visible to all -->
        <div class="rounded-lg bg-white p-6 shadow-md">
          <h2 class="mb-4 text-xl font-semibold">Actividad Reciente</h2>
          <div class="space-y-3">
            @for (activity of recentActivities(); track activity.id) {
              <div class="flex items-center justify-between border-b border-gray-200 pb-2">
                <div>
                  <p class="font-medium">{{ activity.title }}</p>
                  <p class="text-sm text-gray-500">{{ activity.date | date: 'medium' }}</p>
                </div>
                <span
                  class="rounded-full px-3 py-1 text-xs"
                  [ngClass]="{
                    'bg-blue-100 text-blue-800': activity.type === 'info',
                    'bg-green-100 text-green-800': activity.type === 'success',
                    'bg-yellow-100 text-yellow-800': activity.type === 'warning',
                    'bg-red-100 text-red-800': activity.type === 'error',
                  }"
                >
                  {{ activity.type }}
                </span>
              </div>
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
      min-height: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelSmartComponent {
  private authService = inject(AuthService);
  protected rolesService = inject(RolesService);
  protected Role = Role;

  // Sample data - in a real app, this would come from a service
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

  protected getUserDisplayName(): string {
    const session = this.authService.session();
    if (!session) return 'Usuario';

    const email = session.user?.email || '';
    const name = (session.user?.user_metadata?.['name'] as string) || '';

    return name || email.split('@')[0] || 'Usuario';
  }
}
