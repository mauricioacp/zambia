import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tables } from '@zambia/types-supabase';

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

      <!-- Search Bar -->
      <div class="mb-6 rounded-lg bg-white p-4 shadow-md dark:bg-gray-800 dark:shadow-gray-900/30">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div class="relative flex-grow">
            <span class="material-icons absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 dark:text-gray-500"
              >search</span
            >
            <input
              type="text"
              placeholder="Buscar acuerdos por nombre, email o documento..."
              class="w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              [ngModel]="searchTerm()"
              (ngModelChange)="updateSearchTerm($event)"
            />
          </div>
          <button
            class="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            (click)="clearSearch()"
          >
            <span class="flex items-center">
              <span class="material-icons mr-1 text-sm">clear</span>
              Limpiar
            </span>
          </button>
        </div>
      </div>

      <!-- Dashboard Widgets -->
      <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
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
          <div class="max-h-60 space-y-3 overflow-auto pr-2">
            <!--            @if (agreementsRequiringAction().length === 0) {-->
            <!--              <p class="text-gray-500 dark:text-gray-400">No hay acuerdos que requieran acción en este momento.</p>-->
            <!--            } @else {-->
            <!--              @for (agreement of agreementsRequiringAction(); track agreement.id) {-->
            <!--                <div-->
            <!--                  class="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50"-->
            <!--                  (click)="scrollToAgreement(agreement.id)"-->
            <!--                  (keydown.enter)="scrollToAgreement(agreement.id)"-->
            <!--                  tabindex="0"-->
            <!--                  role="button"-->
            <!--                  aria-label="Scroll to agreement"-->
            <!--                >-->
            <!--                  <div>-->
            <!--                    <p class="font-medium text-gray-800 dark:text-white">-->
            <!--                      {{ agreement.name }} {{ agreement.last_name }}-->
            <!--                    </p>-->
            <!--                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ agreement.email }}</p>-->
            <!--                  </div>-->
            <!--                  <span-->
            <!--                    class="rounded-full px-3 py-1 text-xs"-->
            <!--                    [ngClass]="{-->
            <!--                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300':-->
            <!--                        agreement.status === 'pending',-->
            <!--                      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300':-->
            <!--                        agreement.status === 'approved',-->
            <!--                    }"-->
            <!--                  >-->
            <!--                    {{ agreement.status === 'pending' ? 'Pendiente' : 'Aprobado' }}-->
            <!--                  </span>-->
            <!--                </div>-->
            <!--              }-->
            <!--            }-->
          </div>
        </div>

        <!-- Recent Agreements Widget -->
        <div class="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800 dark:shadow-gray-900/30">
          <h2 class="mb-4 text-xl font-semibold text-gray-800 dark:text-white">Acuerdos Recientes</h2>
          <div class="max-h-60 space-y-3 overflow-auto pr-2">
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

      <!-- Detailed Statistics Section -->
      <div class="mb-8 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800 dark:shadow-gray-900/30">
        <h2 class="mb-4 text-xl font-semibold text-gray-800 dark:text-white">Estadísticas Detalladas</h2>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <!-- Conversion Rate -->
          <div>
            <div class="flex items-center justify-between">
              <p class="font-medium text-gray-700 dark:text-gray-300">Tasa de Conversión</p>
              <p class="font-bold text-gray-800 dark:text-white">{{ getConversionRate() }}%</p>
            </div>
            <div class="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div class="h-full rounded-full bg-blue-600 dark:bg-blue-500" [style.width.%]="getConversionRate()"></div>
            </div>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Acuerdos aprobados vs. total de acuerdos</p>
          </div>

          <!-- Completion Rate -->
          <div>
            <div class="flex items-center justify-between">
              <p class="font-medium text-gray-700 dark:text-gray-300">Tasa de Finalización</p>
              <p class="font-bold text-gray-800 dark:text-white">{{ getCompletionRate() }}%</p>
            </div>
            <div class="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                class="h-full rounded-full bg-green-600 dark:bg-green-500"
                [style.width.%]="getCompletionRate()"
              ></div>
            </div>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Usuarios creados vs. acuerdos aprobados</p>
          </div>

          <!-- Rejection Rate -->
          <div>
            <div class="flex items-center justify-between">
              <p class="font-medium text-gray-700 dark:text-gray-300">Tasa de Rechazo</p>
              <p class="font-bold text-gray-800 dark:text-white">{{ getRejectionRate() }}%</p>
            </div>
            <div class="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div class="h-full rounded-full bg-red-600 dark:bg-red-500" [style.width.%]="getRejectionRate()"></div>
            </div>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Acuerdos rechazados vs. total de acuerdos</p>
          </div>

          <!-- Pending Time -->
          <div>
            <div class="flex items-center justify-between">
              <p class="font-medium text-gray-700 dark:text-gray-300">Tiempo Promedio de Aprobación</p>
              <p class="font-bold text-gray-800 dark:text-white">{{ getAverageApprovalTime() }} días</p>
            </div>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Tiempo promedio desde creación hasta aprobación</p>
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
export class AgreementsSmartComponent implements OnInit {
  // Service injection
  // private agreementService = inject(AgreementService);

  // Signals for data management
  private agreements = signal<Tables<'agreements'>[]>([]);
  public filteredAgreements = signal<Tables<'agreements'>[]>([]);
  public searchTerm = signal<string>('');
  public isLoading = signal<boolean>(false);

  // Calculate agreement statistics
  public agreementStats = signal<AgreementStats>({
    pending: 0,
    approved: 0,
    userCreated: 0,
    rejected: 0,
    total: 0,
  });

  // Agreements requiring action (pending or approved without user)
  // public agreementsRequiringAction = signal < Tables<'agreements'[]>([]);

  // Recent agreements (5 most recent)
  public recentAgreements = signal<Tables<'agreements'>[]>([]);

  mockAgreements: Tables<'agreements'>[] = [];

  ngOnInit(): void {
    this.loadAgreements();
  }

  /**
   * Load agreements from the service
   */
  private loadAgreements(): void {
    this.isLoading.set(true);

    // For development, we'll still use mock data initially
    // In production, this would be replaced with a service call
    this.initializeMockData();

    // Simulate a service call
    setTimeout(() => {
      // In a real implementation, this would be:
      // this.agreementService.getAgreements().subscribe(agreements => {
      //   this.agreements.set(agreements);
      //   this.updateDerivedSignals();
      //   this.isLoading.set(false);
      // });

      this.isLoading.set(false);
    }, 1000);
  }

  /**
   * Initialize mock data for agreements
   */
  private initializeMockData(): void {
    // Set the agreements signal with mock data
    // const mockData: Partial<Tables<'agreements'>[]> = [
    //   {
    //     id: '1',
    //     name: 'Juan',
    //     last_name: 'Pérez',
    //     email: 'juan.perez@example.com',
    //     phone: '+34612345678',
    //     document_number: '12345678A',
    //     address: 'Calle Principal 123, Madrid',
    //     status: 'pending',
    //     headquarter_id: '1',
    //     season_id: '2023',
    //     user_id: null,
    //     signature_data: null,
    //     age_verification: true,
    //     ethical_document_agreement: true,
    //     mailing_agreement: true,
    //     volunteering_agreement: true,
    //     created_at: '2023-06-15T10:30:00Z',
    //     updated_at: null,
    //     activation_date: null,
    //     birth_date: null,
    //     fts_name_lastname: undefined,
    //     gender: null,
    //     role_id: '',
    //   },
    // ];

    // this.mockAgreements = mockData;
    // this.agreements.set(mockData);
    this.updateDerivedSignals();
  }

  /**
   * Updates all derived signals based on the current agreements data
   */
  private updateDerivedSignals(): void {
    const agreements = this.agreements();
    const searchTerm = this.searchTerm().toLowerCase().trim();

    // Apply search filter if there's a search term
    let filtered = agreements;
    if (searchTerm) {
      filtered = agreements.filter(
        (a) =>
          a.name?.toLowerCase().includes(searchTerm) ||
          '' ||
          a.last_name?.toLowerCase().includes(searchTerm) ||
          '' ||
          a.email?.toLowerCase().includes(searchTerm) ||
          '' ||
          a.document_number?.toLowerCase().includes(searchTerm) ||
          ''
      );
    }

    // Update statistics (based on all agreements, not just filtered ones)
    const stats: AgreementStats = {
      pending: agreements.filter((a) => a.status === 'pending').length,
      approved: agreements.filter((a) => a.status === 'approved').length,
      userCreated: agreements.filter((a) => a.status === 'USER_CREATED').length,
      rejected: agreements.filter((a) => a.status === 'rejected').length,
      total: agreements.length,
    };
    this.agreementStats.set(stats);

    // Update agreements requiring action
    // const requireAction = agreements.filter((a) => a.status === 'pending' || (a.status === 'approved' && !a.user_id));
    // this.agreementsRequiringAction.set(requireAction);

    // Update recent agreements (5 most recent)
    const recent = [...agreements]
      .sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())
      .slice(0, 5);
    this.recentAgreements.set(recent);

    // Update filtered agreements
    this.filteredAgreements.set(filtered);
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
      this.filteredAgreements.set(this.mockAgreements);
    } else {
      const filtered = this.mockAgreements.filter((a) => a.status === status);
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

    // In a real implementation, this would call the service:
    // this.agreementService.updateAgreementStatus(id, 'approved').subscribe(() => {
    //   this.loadAgreements();
    // });

    // For now, update the agreement status in the local data
    const agreements = this.agreements();
    const updatedAgreements = agreements.map((a) =>
      a.id === id ? { ...a, status: 'approved', updated_at: new Date().toISOString() } : a
    );

    this.agreements.set(updatedAgreements);
    this.updateDerivedSignals();
  }

  /**
   * Reject an agreement
   */
  rejectAgreement(id: string): void {
    console.log(`Reject agreement: ${id}`);

    // In a real implementation, this would call the service:
    // this.agreementService.updateAgreementStatus(id, 'rejected').subscribe(() => {
    //   this.loadAgreements();
    // });

    // For now, update the agreement status in the local data
    const agreements = this.agreements();
    const updatedAgreements = agreements.map((a) =>
      a.id === id ? { ...a, status: 'rejected', updated_at: new Date().toISOString() } : a
    );

    this.agreements.set(updatedAgreements);
    this.updateDerivedSignals();
  }

  /**
   * Create a user for an approved agreement
   */
  createUser(id: string): void {
    console.log(`Create user for agreement: ${id}`);

    // In a real implementation, this would call the service:
    // this.agreementService.createUserForAgreement(id).subscribe(() => {
    //   this.loadAgreements();
    // });

    // For now, update the agreement status and assign a mock user ID
    const agreements = this.agreements();
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

    this.agreements.set(updatedAgreements);
    this.updateDerivedSignals();
  }

  /**
   * Create a new agreement
   */
  createNewAgreement(): void {
    console.log('Create new agreement');
    // In a real implementation, this would navigate to the agreement creation page
  }

  /**
   * Update the search term and filter agreements
   */
  updateSearchTerm(term: string): void {
    this.searchTerm.set(term);
    this.updateDerivedSignals();
  }

  /**
   * Clear the search term
   */
  clearSearch(): void {
    this.searchTerm.set('');
    this.updateDerivedSignals();
  }

  /**
   * Calculate the conversion rate (approved / total)
   */
  getConversionRate(): number {
    const stats = this.agreementStats();
    if (stats.total === 0) return 0;
    return Math.round(((stats.approved + stats.userCreated) / stats.total) * 100);
  }

  /**
   * Calculate the completion rate (users created / approved)
   */
  getCompletionRate(): number {
    const stats = this.agreementStats();
    if (stats.approved === 0) return 0;
    return Math.round((stats.userCreated / (stats.approved + stats.userCreated)) * 100);
  }

  /**
   * Calculate the rejection rate (rejected / total)
   */
  getRejectionRate(): number {
    const stats = this.agreementStats();
    if (stats.total === 0) return 0;
    return Math.round((stats.rejected / stats.total) * 100);
  }

  /**
   * Calculate the average approval time in days
   */
  getAverageApprovalTime(): number {
    const agreements = this.agreements();
    const approvedAgreements = agreements.filter((a) => a.status === 'approved' || a.status === 'USER_CREATED');

    if (approvedAgreements.length === 0) return 0;

    let totalDays = 0;
    for (const agreement of approvedAgreements) {
      if (agreement.created_at && agreement.updated_at) {
        const createdDate = new Date(agreement.created_at);
        const updatedDate = new Date(agreement.updated_at);
        const diffTime = Math.abs(updatedDate.getTime() - createdDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        totalDays += diffDays;
      }
    }

    return Math.round(totalDays / approvedAgreements.length);
  }
}
