import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Agreement } from '@zambia/types-supabase';

/**
 * Interface for agreement statistics
 */
interface AgreementStats {
  pending: number;
  approved: number;
  userCreated: number;
  rejected: number;
  total: number;
}

/**
 * Smart component for managing agreements
 * Displays dashboard widgets and a smart table for agreements
 */
@Component({
  selector: 'z-agreements',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="h-full overflow-auto bg-gray-50 p-6 dark:bg-gray-900">
      <h1 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Gestión de Acuerdos</h1>

      <!-- Dashboard Widgets -->
      <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <!-- Agreement Status Summary Widget -->
        <div class="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800 dark:shadow-gray-900/30">
          <h2 class="mb-4 text-xl font-semibold text-gray-800 dark:text-white">Estado de Acuerdos</h2>
          <div class="grid grid-cols-2 gap-4 sm:grid-cols-2">
            <div class="rounded-lg bg-yellow-50 p-4 text-center dark:bg-yellow-900/20">
              <p class="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{{ agreementStats().pending }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-300">Pendientes</p>
            </div>
            <div class="rounded-lg bg-blue-50 p-4 text-center dark:bg-blue-900/20">
              <p class="text-3xl font-bold text-blue-600 dark:text-blue-400">{{ agreementStats().approved }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-300">Aprobados</p>
            </div>
            <div class="rounded-lg bg-green-50 p-4 text-center dark:bg-green-900/20">
              <p class="text-3xl font-bold text-green-600 dark:text-green-400">{{ agreementStats().userCreated }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-300">Usuarios Creados</p>
            </div>
            <div class="rounded-lg bg-red-50 p-4 text-center dark:bg-red-900/20">
              <p class="text-3xl font-bold text-red-600 dark:text-red-400">{{ agreementStats().rejected }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-300">Rechazados</p>
            </div>
          </div>
        </div>

        <!-- Agreements Requiring Action Widget -->
        <div class="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800 dark:shadow-gray-900/30">
          <h2 class="mb-4 text-xl font-semibold text-gray-800 dark:text-white">Acuerdos que Requieren Acción</h2>
          <div class="space-y-3">
            @if (agreementsRequiringAction().length === 0) {
              <p class="text-gray-500 dark:text-gray-400">No hay acuerdos que requieran acción en este momento.</p>
            } @else {
              @for (agreement of agreementsRequiringAction(); track agreement.id) {
                <div
                  class="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50"
                  (click)="scrollToAgreement(agreement.id)"
                >
                  <div>
                    <p class="font-medium text-gray-800 dark:text-white">
                      {{ agreement.name }} {{ agreement.last_name }}
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ agreement.email }}</p>
                  </div>
                  <span
                    class="rounded-full px-3 py-1 text-xs"
                    [ngClass]="{
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300':
                        agreement.status === 'pending',
                      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300':
                        agreement.status === 'approved',
                    }"
                  >
                    {{ agreement.status === 'pending' ? 'Pendiente' : 'Aprobado' }}
                  </span>
                </div>
              }
            }
          </div>
        </div>

        <!-- Recent Agreements Widget -->
        <div class="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800 dark:shadow-gray-900/30">
          <h2 class="mb-4 text-xl font-semibold text-gray-800 dark:text-white">Acuerdos Recientes</h2>
          <div class="space-y-3">
            @for (agreement of recentAgreements(); track agreement.id) {
              <div class="border-b border-gray-200 pb-2 dark:border-gray-700">
                <p class="font-medium text-gray-800 dark:text-white">{{ agreement.name }} {{ agreement.last_name }}</p>
                <div class="flex items-center justify-between">
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ formatDate(agreement.created_at) }}
                  </p>
                  <span
                    class="rounded-full px-2 py-1 text-xs"
                    [ngClass]="{
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300':
                        agreement.status === 'pending',
                      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300':
                        agreement.status === 'approved',
                      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300':
                        agreement.status === 'USER_CREATED',
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300': agreement.status === 'rejected',
                    }"
                  >
                    {{ getStatusLabel(agreement.status) }}
                  </span>
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Smart Table Section -->
      <div class="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800 dark:shadow-gray-900/30">
        <div class="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Administrar Acuerdos</h2>

          <div class="flex flex-col gap-2 sm:flex-row">
            <!-- Filter Dropdown -->
            <select
              class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              (change)="filterAgreements($event)"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="approved">Aprobados</option>
              <option value="USER_CREATED">Usuarios Creados</option>
              <option value="rejected">Rechazados</option>
            </select>

            <!-- Create New Agreement Button -->
            <button
              class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
              (click)="createNewAgreement()"
            >
              <span class="flex items-center">
                <span class="material-icons mr-1 text-sm">add</span>
                Nuevo Acuerdo
              </span>
            </button>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                >
                  Prospecto
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                >
                  Estado
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                >
                  Rol a Asignar
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                >
                  Fecha de Creación
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                >
                  Usuario Asignado
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
              @for (agreement of filteredAgreements(); track agreement.id) {
                <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ agreement.name }} {{ agreement.last_name }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ agreement.email }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="inline-flex rounded-full px-2 py-1 text-xs leading-5 font-semibold"
                      [ngClass]="{
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300':
                          agreement.status === 'pending',
                        'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300':
                          agreement.status === 'approved',
                        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300':
                          agreement.status === 'USER_CREATED',
                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300': agreement.status === 'rejected',
                      }"
                    >
                      {{ getStatusLabel(agreement.status) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                    {{ formatDate(agreement.created_at) }}
                  </td>
                  <td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                    {{ agreement.user_id || 'N/A' }}
                  </td>
                  <td class="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                    <div class="flex space-x-2">
                      <!-- View/Edit Button -->
                      <button
                        class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        (click)="viewEditAgreement(agreement.id)"
                        title="Ver/Editar"
                      >
                        <span class="material-icons">visibility</span>
                      </button>

                      <!-- Approve Button - Only visible for pending agreements -->
                      @if (agreement.status === 'pending') {
                        <button
                          class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          (click)="approveAgreement(agreement.id)"
                          title="Aprobar"
                        >
                          <span class="material-icons">check_circle</span>
                        </button>
                      }

                      <!-- Reject Button - Only visible for pending agreements -->
                      @if (agreement.status === 'pending') {
                        <button
                          class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          (click)="rejectAgreement(agreement.id)"
                          title="Rechazar"
                        >
                          <span class="material-icons">cancel</span>
                        </button>
                      }

                      <!-- Create User Button - Only visible for approved agreements without assigned user -->
                      @if (agreement.status === 'approved' && !agreement.user_id) {
                        <button
                          class="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                          (click)="createUser(agreement.id)"
                          title="Crear Usuario"
                        >
                          <span class="material-icons">person_add</span>
                        </button>
                      }
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
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
export class AgreementsSmartComponent {
  // Mock data for agreements
  private mockAgreements = signal<Agreement[]>([]);

  // Derived signals for the UI
  public filteredAgreements = signal<Agreement[]>([]);

  // Calculate agreement statistics
  public agreementStats = signal<AgreementStats>({
    pending: 0,
    approved: 0,
    userCreated: 0,
    rejected: 0,
    total: 0,
  });

  // Agreements requiring action (pending or approved without user)
  public agreementsRequiringAction = signal<Agreement[]>([]);

  // Recent agreements (5 most recent)
  public recentAgreements = signal<Agreement[]>([]);

  constructor() {
    this.initializeMockData();
    this.updateDerivedSignals();
  }

  /**
   * Initialize mock data for agreements
   */
  private initializeMockData(): void {
    const mockData: Agreement[] = [
      {
        id: '1',
        name: 'Juan',
        last_name: 'Pérez',
        email: 'juan.perez@example.com',
        phone: '+34612345678',
        document_number: '12345678A',
        address: 'Calle Principal 123, Madrid',
        status: 'pending',
        headquarter_id: '1',
        season_id: '2023',
        user_id: null,
        signature_data: null,
        age_verification: true,
        ethical_document_agreement: true,
        mailing_agreement: true,
        volunteering_agreement: true,
        created_at: '2023-06-15T10:30:00Z',
        updated_at: null,
      },
      {
        id: '2',
        name: 'María',
        last_name: 'García',
        email: 'maria.garcia@example.com',
        phone: '+34623456789',
        document_number: '23456789B',
        address: 'Avenida Secundaria 456, Barcelona',
        status: 'approved',
        headquarter_id: '2',
        season_id: '2023',
        user_id: null,
        signature_data: null,
        age_verification: true,
        ethical_document_agreement: true,
        mailing_agreement: true,
        volunteering_agreement: true,
        created_at: '2023-06-10T14:45:00Z',
        updated_at: '2023-06-12T09:15:00Z',
      },
      {
        id: '3',
        name: 'Carlos',
        last_name: 'Rodríguez',
        email: 'carlos.rodriguez@example.com',
        phone: '+34634567890',
        document_number: '34567890C',
        address: 'Plaza Mayor 789, Valencia',
        status: 'USER_CREATED',
        headquarter_id: '3',
        season_id: '2023',
        user_id: 'user123',
        signature_data: null,
        age_verification: true,
        ethical_document_agreement: true,
        mailing_agreement: false,
        volunteering_agreement: true,
        created_at: '2023-06-05T11:20:00Z',
        updated_at: '2023-06-08T16:30:00Z',
      },
      {
        id: '4',
        name: 'Ana',
        last_name: 'Martínez',
        email: 'ana.martinez@example.com',
        phone: '+34645678901',
        document_number: '45678901D',
        address: 'Calle Nueva 321, Sevilla',
        status: 'rejected',
        headquarter_id: '4',
        season_id: '2023',
        user_id: null,
        signature_data: null,
        age_verification: true,
        ethical_document_agreement: false,
        mailing_agreement: true,
        volunteering_agreement: false,
        created_at: '2023-06-01T09:00:00Z',
        updated_at: '2023-06-03T13:45:00Z',
      },
      {
        id: '5',
        name: 'Pedro',
        last_name: 'Sánchez',
        email: 'pedro.sanchez@example.com',
        phone: '+34656789012',
        document_number: '56789012E',
        address: 'Avenida Principal 654, Bilbao',
        status: 'pending',
        headquarter_id: '5',
        season_id: '2023',
        user_id: null,
        signature_data: null,
        age_verification: true,
        ethical_document_agreement: true,
        mailing_agreement: true,
        volunteering_agreement: true,
        created_at: '2023-05-28T15:10:00Z',
        updated_at: null,
      },
      {
        id: '6',
        name: 'Laura',
        last_name: 'Fernández',
        email: 'laura.fernandez@example.com',
        phone: '+34667890123',
        document_number: '67890123F',
        address: 'Calle Antigua 987, Málaga',
        status: 'approved',
        headquarter_id: '1',
        season_id: '2023',
        user_id: 'user456',
        signature_data: null,
        age_verification: true,
        ethical_document_agreement: true,
        mailing_agreement: false,
        volunteering_agreement: true,
        created_at: '2023-05-25T10:45:00Z',
        updated_at: '2023-05-27T14:30:00Z',
      },
      {
        id: '7',
        name: 'Javier',
        last_name: 'López',
        email: 'javier.lopez@example.com',
        phone: '+34678901234',
        document_number: '78901234G',
        address: 'Plaza Central 456, Zaragoza',
        status: 'USER_CREATED',
        headquarter_id: '2',
        season_id: '2023',
        user_id: 'user789',
        signature_data: null,
        age_verification: true,
        ethical_document_agreement: true,
        mailing_agreement: true,
        volunteering_agreement: true,
        created_at: '2023-05-20T13:15:00Z',
        updated_at: '2023-05-23T11:00:00Z',
      },
      {
        id: '8',
        name: 'Carmen',
        last_name: 'Gómez',
        email: 'carmen.gomez@example.com',
        phone: '+34689012345',
        document_number: '89012345H',
        address: 'Avenida del Mar 123, Alicante',
        status: 'pending',
        headquarter_id: '3',
        season_id: '2023',
        user_id: null,
        signature_data: null,
        age_verification: true,
        ethical_document_agreement: true,
        mailing_agreement: true,
        volunteering_agreement: false,
        created_at: '2023-05-18T09:30:00Z',
        updated_at: null,
      },
      {
        id: '9',
        name: 'Miguel',
        last_name: 'Torres',
        email: 'miguel.torres@example.com',
        phone: '+34690123456',
        document_number: '90123456I',
        address: 'Calle Mayor 789, Murcia',
        status: 'rejected',
        headquarter_id: '4',
        season_id: '2023',
        user_id: null,
        signature_data: null,
        age_verification: false,
        ethical_document_agreement: true,
        mailing_agreement: false,
        volunteering_agreement: true,
        created_at: '2023-05-15T16:45:00Z',
        updated_at: '2023-05-17T10:30:00Z',
      },
      {
        id: '10',
        name: 'Lucía',
        last_name: 'Díaz',
        email: 'lucia.diaz@example.com',
        phone: '+34601234567',
        document_number: '01234567J',
        address: 'Plaza España 321, Granada',
        status: 'approved',
        headquarter_id: '5',
        season_id: '2023',
        user_id: null,
        signature_data: null,
        age_verification: true,
        ethical_document_agreement: true,
        mailing_agreement: true,
        volunteering_agreement: true,
        created_at: '2023-05-12T11:00:00Z',
        updated_at: '2023-05-14T15:15:00Z',
      },
      {
        id: '11',
        name: 'Daniel',
        last_name: 'Ruiz',
        email: 'daniel.ruiz@example.com',
        phone: '+34612345670',
        document_number: '12345670K',
        address: 'Avenida Central 654, Valladolid',
        status: 'pending',
        headquarter_id: '1',
        season_id: '2023',
        user_id: null,
        signature_data: null,
        age_verification: true,
        ethical_document_agreement: true,
        mailing_agreement: false,
        volunteering_agreement: true,
        created_at: '2023-05-10T14:30:00Z',
        updated_at: null,
      },
      {
        id: '12',
        name: 'Elena',
        last_name: 'Moreno',
        email: 'elena.moreno@example.com',
        phone: '+34623456780',
        document_number: '23456780L',
        address: 'Calle del Sol 987, Córdoba',
        status: 'USER_CREATED',
        headquarter_id: '2',
        season_id: '2023',
        user_id: 'user012',
        signature_data: null,
        age_verification: true,
        ethical_document_agreement: true,
        mailing_agreement: true,
        volunteering_agreement: true,
        created_at: '2023-05-08T09:15:00Z',
        updated_at: '2023-05-11T13:45:00Z',
      },
      {
        id: '13',
        name: 'Pablo',
        last_name: 'Jiménez',
        email: 'pablo.jimenez@example.com',
        phone: '+34634567801',
        document_number: '34567801M',
        address: 'Plaza Mayor 456, Salamanca',
        status: 'approved',
        headquarter_id: '3',
        season_id: '2023',
        user_id: null,
        signature_data: null,
        age_verification: true,
        ethical_document_agreement: true,
        mailing_agreement: true,
        volunteering_agreement: false,
        created_at: '2023-05-05T10:00:00Z',
        updated_at: '2023-05-07T16:30:00Z',
      },
      {
        id: '14',
        name: 'Sofía',
        last_name: 'Navarro',
        email: 'sofia.navarro@example.com',
        phone: '+34645678012',
        document_number: '45678012N',
        address: 'Avenida del Parque 123, Pamplona',
        status: 'rejected',
        headquarter_id: '4',
        season_id: '2023',
        user_id: null,
        signature_data: null,
        age_verification: false,
        ethical_document_agreement: false,
        mailing_agreement: true,
        volunteering_agreement: true,
        created_at: '2023-05-03T15:45:00Z',
        updated_at: '2023-05-05T11:30:00Z',
      },
      {
        id: '15',
        name: 'Alejandro',
        last_name: 'Vázquez',
        email: 'alejandro.vazquez@example.com',
        phone: '+34656789123',
        document_number: '56789123O',
        address: 'Calle del Río 456, Santander',
        status: 'pending',
        headquarter_id: '5',
        season_id: '2023',
        user_id: null,
        signature_data: null,
        age_verification: true,
        ethical_document_agreement: true,
        mailing_agreement: true,
        volunteering_agreement: true,
        created_at: '2023-05-01T08:30:00Z',
        updated_at: null,
      },
    ];

    this.mockAgreements.set(mockData);
  }

  /**
   * Updates all derived signals based on the current agreements data
   */
  private updateDerivedSignals(): void {
    const agreements = this.mockAgreements();

    // Update statistics
    const stats: AgreementStats = {
      pending: agreements.filter((a) => a.status === 'pending').length,
      approved: agreements.filter((a) => a.status === 'approved').length,
      userCreated: agreements.filter((a) => a.status === 'USER_CREATED').length,
      rejected: agreements.filter((a) => a.status === 'rejected').length,
      total: agreements.length,
    };
    this.agreementStats.set(stats);

    // Update agreements requiring action
    const requireAction = agreements.filter((a) => a.status === 'pending' || (a.status === 'approved' && !a.user_id));
    this.agreementsRequiringAction.set(requireAction);

    // Update recent agreements (5 most recent)
    const recent = [...agreements]
      .sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())
      .slice(0, 5);
    this.recentAgreements.set(recent);

    // Update filtered agreements (initially all agreements)
    this.filteredAgreements.set(agreements);
  }

  /**
   * Format a date string to a more readable format
   */
  formatDate(dateString: string | null): string {
    if (!dateString) return 'N/A';

    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Get a human-readable label for an agreement status
   */
  getStatusLabel(status: string | null): string {
    if (!status) return 'Desconocido';

    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'approved':
        return 'Aprobado';
      case 'USER_CREATED':
        return 'Usuario Creado';
      case 'rejected':
        return 'Rechazado';
      default:
        return status;
    }
  }

  /**
   * Filter agreements based on status
   */
  filterAgreements(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const status = select.value;

    if (status === 'all') {
      this.filteredAgreements.set(this.mockAgreements());
    } else {
      const filtered = this.mockAgreements().filter((a) => a.status === status);
      this.filteredAgreements.set(filtered);
    }
  }

  /**
   * Scroll to a specific agreement in the table
   */
  scrollToAgreement(id: string): void {
    console.log(`Scrolling to agreement: ${id}`);
    // In a real implementation, this would scroll to the agreement in the table
  }

  /**
   * View or edit an agreement
   */
  viewEditAgreement(id: string): void {
    console.log(`View/Edit agreement: ${id}`);
    // In a real implementation, this would navigate to the agreement detail page
  }

  /**
   * Approve an agreement
   */
  approveAgreement(id: string): void {
    console.log(`Approve agreement: ${id}`);

    // Update the agreement status in the mock data
    const agreements = this.mockAgreements();
    const updatedAgreements = agreements.map((a) =>
      a.id === id ? { ...a, status: 'approved', updated_at: new Date().toISOString() } : a
    );

    this.mockAgreements.set(updatedAgreements);
    this.updateDerivedSignals();
  }

  /**
   * Reject an agreement
   */
  rejectAgreement(id: string): void {
    console.log(`Reject agreement: ${id}`);

    // Update the agreement status in the mock data
    const agreements = this.mockAgreements();
    const updatedAgreements = agreements.map((a) =>
      a.id === id ? { ...a, status: 'rejected', updated_at: new Date().toISOString() } : a
    );

    this.mockAgreements.set(updatedAgreements);
    this.updateDerivedSignals();
  }

  /**
   * Create a user for an approved agreement
   */
  createUser(id: string): void {
    console.log(`Create user for agreement: ${id}`);

    // Update the agreement status and assign a mock user ID
    const agreements = this.mockAgreements();
    const updatedAgreements = agreements.map((a) =>
      a.id === id
        ? {
            ...a,
            status: 'USER_CREATED',
            user_id: `user_${Math.floor(Math.random() * 1000)}`,
            updated_at: new Date().toISOString(),
          }
        : a
    );

    this.mockAgreements.set(updatedAgreements);
    this.updateDerivedSignals();
  }

  /**
   * Create a new agreement
   */
  createNewAgreement(): void {
    console.log('Create new agreement');
    // In a real implementation, this would navigate to the agreement creation page
  }
}
