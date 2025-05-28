import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

// Services
import { AgreementsFacadeService } from '../../services/agreements-facade.service';
import { RoleService } from '@zambia/data-access-roles-permissions';
import { NotificationService, ExportService, ExportColumn } from '@zambia/data-access-generic';

// UI Components
import {
  EnhancedTableUiComponent,
  PageContainerUiComponent,
  TableAction,
  TableColumn,
} from '@zambia/ui-components';

// TUI Components
import { TuiIcon, TuiButton, TuiDialogService } from '@taiga-ui/core';
import { TuiSkeleton } from '@taiga-ui/kit';

// Guards and Directives
import { HasRoleDirective } from '@zambia/util-roles-permissions';

interface AgreementListData {
  id: string;
  name: string;
  lastName: string;
  email: string;
  role: string;
  status: 'pending' | 'active' | 'inactive' | 'completed';
  headquarter: string;
  createdAt: string;
  agreementType: string;
  verificationType: 'verified' | 'pending' | 'rejected';
}

interface StatCard {
  id: string;
  title: string;
  value: number;
  icon: string;
  trend: number;
  color: string;
}

@Component({
  selector: 'z-agreements-list',
  imports: [
    CommonModule,
    TranslateModule,
    EnhancedTableUiComponent,
    PageContainerUiComponent,
    TuiIcon,
    TuiButton,
    TuiSkeleton,
    HasRoleDirective,
  ],
  template: `
    <z-page-container>
      <!-- Header Section -->
      <div class="relative overflow-hidden">
        <!-- Background Glow -->
        <div
          class="absolute inset-0 -inset-x-6 rounded-3xl bg-gradient-to-r from-emerald-300 via-blue-500 to-purple-700 opacity-10 blur-2xl"
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
                <!-- Breadcrumb -->
                <nav class="mb-2 flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>{{ 'nav.management' | translate }}</span>
                  <tui-icon icon="@tui.chevron-right" class="text-xs"></tui-icon>
                  <span class="font-medium text-gray-900 dark:text-white">{{ 'agreements' | translate }}</span>
                </nav>

                <div class="flex items-center gap-3">
                  <div
                    class="rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 p-3 shadow-lg shadow-emerald-500/25"
                  >
                    <tui-icon icon="@tui.file-text" class="text-xl text-white"></tui-icon>
                  </div>
                  <div>
                    <h1 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
                      {{ 'agreements' | translate }}
                    </h1>
                    <p class="text-lg text-gray-600 dark:text-gray-300">
                      Gestión integral de acuerdos organizacionales
                    </p>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex items-center gap-3">
                <button
                  tuiButton
                  appearance="secondary"
                  size="m"
                  (click)="openExportModal()"
                  [disabled]="!hasData()"
                  class="hidden sm:flex"
                >
                  <tui-icon icon="@tui.download" class="mr-2"></tui-icon>
                  {{ 'export' | translate }}
                </button>

                <button
                  tuiButton
                  appearance="primary"
                  size="m"
                  (click)="openCreateModal()"
                  *zHasRole="['ADMINISTRATION', 'TOP_MANAGEMENT', 'LEADERSHIP_TEAM']"
                >
                  <tui-icon icon="@tui.plus" class="mr-2"></tui-icon>
                  Crear Acuerdo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistics Cards -->
      <section class="px-6 py-8 sm:px-8">
        <div class="mb-6">
          <h2 class="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Resumen de Acuerdos</h2>
          <p class="text-gray-600 dark:text-gray-300">Estado actual de todos los acuerdos organizacionales</p>
        </div>

        @if (isLoading()) {
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            @for (i of [1, 2, 3, 4]; track i) {
              <div class="h-32 w-full rounded-2xl bg-white/40 backdrop-blur-sm" [tuiSkeleton]="true"></div>
            }
          </div>
        } @else {
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            @for (stat of statsCards(); track stat.id) {
              <div
                class="rounded-2xl border border-gray-200/50 bg-white/90 p-6 shadow-lg shadow-gray-900/5 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/90 dark:shadow-slate-900/20"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ stat.title }}</p>
                    <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stat.value }}</p>
                  </div>
                  <div
                    class="rounded-lg bg-gradient-to-r p-2"
                    [ngClass]="'from-' + stat.color + '-500 to-' + stat.color + '-600'"
                  >
                    <tui-icon [icon]="stat.icon" class="h-6 w-6 text-white"></tui-icon>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </section>

      <!-- Agreements Table -->
      <section class="px-6 pb-8 sm:px-8">
        <div class="mb-6">
          <h2 class="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Lista de Acuerdos</h2>
          <p class="text-gray-600 dark:text-gray-300">Gestión completa de acuerdos con funcionalidades avanzadas</p>
        </div>

        @defer (on viewport; prefetch on idle) {
          <z-enhanced-table
            [items]="tableData()"
            [columns]="tableColumns"
            [loading]="isLoading()"
            [actions]="tableActions"
            [title]="''"
            [description]="''"
            [enableFiltering]="true"
            [enableColumnVisibility]="true"
            [showCreateButton]="false"
          />
        } @placeholder {
          <div
            class="rounded-2xl border border-gray-200/50 bg-white/90 p-8 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/90"
          >
            <div class="space-y-4">
              @for (i of [1, 2, 3, 4, 5]; track i) {
                <div class="h-12 w-full rounded-lg bg-gray-200/50 dark:bg-gray-700/50" [tuiSkeleton]="true"></div>
              }
            </div>
          </div>
        } @loading {
          <div
            class="rounded-2xl border border-gray-200/50 bg-white/90 p-8 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/90"
          >
            <div class="space-y-4">
              @for (i of [1, 2, 3, 4, 5]; track i) {
                <div
                  class="h-12 w-full animate-pulse rounded-lg bg-gray-200/50 dark:bg-gray-700/50"
                  [tuiSkeleton]="true"
                ></div>
              }
            </div>
          </div>
        }

        @if (errorMessage()) {
          <div
            class="mt-6 rounded-2xl border border-red-200/50 bg-red-50/90 p-6 backdrop-blur-sm dark:border-red-800/50 dark:bg-red-900/20"
          >
            <div class="flex items-center gap-3">
              <tui-icon icon="@tui.alert-circle" class="text-xl text-red-600 dark:text-red-400"></tui-icon>
              <div>
                <h3 class="font-semibold text-red-800 dark:text-red-200">Error al cargar acuerdos</h3>
                <p class="text-red-700 dark:text-red-300">{{ errorMessage() }}</p>
              </div>
            </div>
          </div>
        }
      </section>
    </z-page-container>
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
export class AgreementsListSmartComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Services
  private agreementsFacade = inject(AgreementsFacadeService);
  private roleService = inject(RoleService);
  private router = inject(Router);
  private dialogs = inject(TuiDialogService);
  private notificationService = inject(NotificationService);
  private exportService = inject(ExportService);
  private translate = inject(TranslateService);

  // Loading states
  protected isLoading = computed(() => this.agreementsFacade.agreements.isLoading());
  protected errorMessage = computed(() => this.agreementsFacade.agreements.error());

  // Data
  protected tableData = computed(() => this.transformAgreementsData(this.agreementsFacade.agreements.value() || []));
  protected hasData = computed(() => (this.tableData()?.length || 0) > 0);
  protected statsCards = computed(() => this.getStatsCards());

  // Role-based permissions
  protected canCreate = computed(() =>
    this.roleService.isInAnyGroup(['ADMINISTRATION', 'TOP_MANAGEMENT', 'LEADERSHIP_TEAM'])
  );
  protected canEdit = computed(() =>
    this.roleService.isInAnyGroup(['ADMINISTRATION', 'TOP_MANAGEMENT', 'LEADERSHIP_TEAM'])
  );
  protected canDelete = computed(() => this.roleService.isInAnyGroup(['ADMINISTRATION', 'TOP_MANAGEMENT']));

  // Table configuration
  protected tableColumns: TableColumn[] = [
    {
      key: 'name',
      label: 'Nombre',
      type: 'avatar',
      sortable: true,
      searchable: true,
    },
    {
      key: 'email',
      label: 'Email',
      type: 'text',
      sortable: true,
      searchable: true,
    },
    {
      key: 'role',
      label: 'Rol',
      type: 'text',
      sortable: true,
      searchable: true,
    },
    {
      key: 'headquarter',
      label: 'Sede',
      type: 'text',
      sortable: true,
      searchable: true,
    },
    {
      key: 'agreementType',
      label: 'Tipo de Acuerdo',
      type: 'text',
      sortable: true,
    },
    {
      key: 'status',
      label: 'Estado',
      type: 'status',
      sortable: true,
    },
    {
      key: 'createdAt',
      label: 'Fecha Creación',
      type: 'date',
      sortable: true,
    },
  ];

  protected tableActions: TableAction[] = [
    {
      label: 'Ver',
      icon: '@tui.eye',
      color: 'primary',
      handler: (item: AgreementListData) => this.onRowClick(item),
      visible: () => true,
    },
    {
      label: 'Editar',
      icon: '@tui.edit',
      color: 'secondary',
      handler: (item: AgreementListData) => this.openEditModal(item),
      visible: () => this.canEdit(),
    },
    {
      label: 'Eliminar',
      icon: '@tui.trash',
      color: 'danger',
      handler: (item: AgreementListData) => this.openDeleteConfirmation(item),
      visible: () => this.canDelete(),
    },
  ];

  ngOnInit(): void {
    this.loadInitialData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadInitialData(): void {
    this.agreementsFacade.agreements.reload();
  }

  private transformAgreementsData(agreements: any[]): AgreementListData[] {
    return agreements.map((agreement) => ({
      id: agreement.id,
      name: agreement.name || 'Sin nombre',
      lastName: agreement.last_name || '',
      email: agreement.email || 'Sin email',
      role: agreement.roles?.name || agreement.role || 'Sin rol',
      status: this.mapStatus(agreement.status),
      headquarter: agreement.headquarters?.name || 'Sin sede',
      createdAt: agreement.created_at,
      agreementType: agreement.agreement_type || 'No especificado',
      verificationType: agreement.verification_status || 'pending',
    }));
  }

  private getStatsCards(): StatCard[] {
    const data = this.tableData();
    const total = data.length;
    const active = data.filter((item) => item.status === 'active').length;
    const pending = data.filter((item) => item.status === 'pending').length;
    const verified = data.filter((item) => item.verificationType === 'verified').length;

    return [
      {
        id: 'total',
        title: 'Total de Acuerdos',
        value: total,
        icon: '@tui.file-text',
        trend: 0,
        color: 'blue',
      },
      {
        id: 'active',
        title: 'Acuerdos Activos',
        value: active,
        icon: '@tui.check-circle',
        trend: 0,
        color: 'emerald',
      },
      {
        id: 'pending',
        title: 'Pendientes',
        value: pending,
        icon: '@tui.clock',
        trend: 0,
        color: 'yellow',
      },
      {
        id: 'verified',
        title: 'Verificados',
        value: verified,
        icon: '@tui.shield-check',
        trend: 0,
        color: 'purple',
      },
    ];
  }

  private mapStatus(status: string): 'pending' | 'active' | 'inactive' | 'completed' {
    const statusMap: Record<string, 'pending' | 'active' | 'inactive' | 'completed'> = {
      pending: 'pending',
      active: 'active',
      inactive: 'inactive',
      completed: 'completed',
      draft: 'pending',
      approved: 'active',
    };
    return statusMap[status] || 'pending';
  }

  protected onRowClick(agreement: AgreementListData): void {
    this.router.navigate(['/dashboard/agreements', agreement.id]);
  }

  protected openCreateModal(): void {
    // TODO: Implement create modal
    console.log('Create agreement modal - to be implemented');
    this.notificationService.showInfo('Funcionalidad de creación pendiente de implementar');
  }

  protected openEditModal(agreement: AgreementListData): void {
    // TODO: Implement edit modal
    console.log('Edit agreement modal - to be implemented', agreement);
    this.notificationService.showInfo('Funcionalidad de edición pendiente de implementar');
  }

  protected openDeleteConfirmation(agreement: AgreementListData): void {
    // TODO: Implement delete confirmation
    console.log('Delete agreement confirmation - to be implemented', agreement);
    this.notificationService.showInfo('Funcionalidad de eliminación pendiente de implementar');
  }

  protected openExportModal(): void {
    const columns = this.tableColumns
      .filter((col) => col.key !== 'actions')
      .map((col) => ({
        key: col.key,
        label: col.label,
      }));

    const data = this.tableData();
    const exportColumns: ExportColumn[] = columns.map((col) => ({
      key: col.key,
      label: col.label,
    }));

    // Export as CSV for now
    this.exportService.exportToCSV(data, exportColumns, 'acuerdos');
    this.notificationService.showSuccess(
      this.translate.instant('export_success', {
        count: data.length,
        format: 'CSV',
      })
    );
  }
}
