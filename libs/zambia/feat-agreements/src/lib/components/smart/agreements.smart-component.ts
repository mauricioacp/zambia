import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgreementsService } from '@zambia/data-access-dashboard';

interface AgreementStats {
  pending: number;
  approved: number;
  userCreated: number;
  rejected: number;
  total: number;
}

@Component({
  selector: 'z-agreements',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-full overflow-auto bg-gray-50 p-6 dark:bg-gray-900">
      <h1 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Gestión de Acuerdos</h1>

      <!-- Dashboard Widgets -->
      <!-- Data for these widgets (agreementStats, recentAgreements, etc.) needs to be provided -->
      <!-- either via new resources in the facade or calculated from agreementsResource.value() -->
      <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <!-- Agreement Status Summary Widget -->
        <div class="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800 dark:shadow-gray-900/30">
          <h2 class="mb-4 text-xl font-semibold text-gray-800 dark:text-white">Estado de Acuerdos (Mock)</h2>
          <div class="grid grid-cols-2 gap-4">
            <div class="rounded-lg bg-yellow-50 p-4 text-center dark:bg-yellow-900/20">
              <p class="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{{ localAgreementStats().pending }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-300">Pendientes</p>
            </div>
            <div class="rounded-lg bg-blue-50 p-4 text-center dark:bg-blue-900/20">
              <p class="text-3xl font-bold text-blue-600 dark:text-blue-400">{{ localAgreementStats().approved }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-300">Aprobados</p>
            </div>
            <div class="rounded-lg bg-green-50 p-4 text-center dark:bg-green-900/20">
              <p class="text-3xl font-bold text-green-600 dark:text-green-400">
                {{ localAgreementStats().userCreated }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-300">Usuarios Creados</p>
            </div>
            <div class="rounded-lg bg-red-50 p-4 text-center dark:bg-red-900/20">
              <p class="text-3xl font-bold text-red-600 dark:text-red-400">{{ localAgreementStats().rejected }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-300">Rechazados</p>
            </div>
          </div>
        </div>

        <!-- Agreements Requiring Action Widget (Placeholder) -->
        <div class="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800 dark:shadow-gray-900/30">
          <h2 class="mb-4 text-xl font-semibold text-gray-800 dark:text-white">Acuerdos que Requieren Acción</h2>
          <div class="max-h-60 space-y-3 overflow-auto pr-2">
            <p class="text-gray-500 dark:text-gray-400">Datos no disponibles temporalmente.</p>
          </div>
        </div>

        <!-- Recent Agreements Widget (Placeholder) -->
        <div class="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800 dark:shadow-gray-900/30">
          <h2 class="mb-4 text-xl font-semibold text-gray-800 dark:text-white">Acuerdos Recientes</h2>
          <div class="max-h-60 space-y-3 overflow-auto pr-2">
            <p class="text-gray-500 dark:text-gray-400">Datos no disponibles temporalmente.</p>
          </div>
        </div>
      </div>

      <!-- Detailed Statistics Section (Placeholder/Mock) -->
      <div class="mb-8 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800 dark:shadow-gray-900/30">
        <h2 class="mb-4 text-xl font-semibold text-gray-800 dark:text-white">Estadísticas Detalladas (Mock)</h2>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p class="font-medium text-gray-700 dark:text-gray-300">Tasa de Conversión: N/A</p>
          </div>
          <div>
            <p class="font-medium text-gray-700 dark:text-gray-300">Tasa de Finalización: N/A</p>
          </div>
          <div>
            <p class="font-medium text-gray-700 dark:text-gray-300">Tasa de Rechazo: N/A</p>
          </div>
          <div>
            <p class="font-medium text-gray-700 dark:text-gray-300">Tiempo Promedio Aprobación: N/A</p>
          </div>
        </div>
      </div>

      @if (agreementsService.agreementsResource.isLoading()) {
        <div class="loading">Loading agreements...</div>
      } @else if (agreementsService.agreementsResource.error()) {
        <div class="error">Error loading agreements: {{ agreementsService.agreementsResource.error() }}</div>
      } @else if (agreementsService.agreementsResource.hasValue()) {
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            @for (agreement of agreementsService.agreementsResource.value().data; track agreement.id) {
              <tr>
                <td>{{ agreement.name }} {{ agreement.last_name }}</td>
                <td>{{ agreement.email }}</td>
                <td>{{ agreement.status }}</td>
                <td>{{ agreement.role?.role_name }}</td>
              </tr>
            }
          </tbody>
        </table>

        <!-- Pagination -->
        <div class="pagination">
          @for (i of agreementsService.getPaginationRange(); track i) {
            <button [class.active]="i === agreementsService.page()" (click)="agreementsService.updatePage(i)">
              {{ i }}
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgreementsSmartComponent {
  protected agreementsService = inject(AgreementsService);

  public searchTerm = signal<string>('');

  public localAgreementStats = signal<AgreementStats>({
    pending: 0,
    approved: 0,
    userCreated: 0,
    rejected: 0,
    total: 0,
  });
}
