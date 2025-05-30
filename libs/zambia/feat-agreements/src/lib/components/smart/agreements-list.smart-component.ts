import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

// Services
import { AgreementsFacadeService, AgreementWithShallowRelations } from '../../services/agreements-facade.service';
import { RoleService } from '@zambia/data-access-roles-permissions';
import { NotificationService, ExportService } from '@zambia/data-access-generic';

// UI Components
import {
  EnhancedTableUiComponent,
  TableAction,
  TableColumn,
  ExportModalUiComponent,
  ExportOptions,
  injectCurrentTheme,
} from '@zambia/ui-components';

// TUI Components
import { TuiIcon, TuiButton, TuiDialogService, TuiLink } from '@taiga-ui/core';
import { TuiSkeleton, TuiBreadcrumbs } from '@taiga-ui/kit';
import { TuiItem } from '@taiga-ui/cdk';

// Guards and Directives
import { HasRoleDirective } from '@zambia/util-roles-permissions';
import { ICONS } from '@zambia/util-constants';

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
    TuiIcon,
    TuiButton,
    TuiSkeleton,
    TuiBreadcrumbs,
    TuiItem,
    TuiLink,
    HasRoleDirective,
  ],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-slate-800">
      <!-- Header Section -->
      <div class="border-b border-gray-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
        <div class="container mx-auto px-6 py-6">
          <!-- Breadcrumbs -->
          <tui-breadcrumbs class="mb-6">
            <a *tuiItem routerLink="/dashboard" tuiLink iconStart="@tui.house">
              {{ 'dashboard' | translate }}
            </a>
            <span *tuiItem>
              {{ 'agreements' | translate }}
            </span>
          </tui-breadcrumbs>

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 shadow-lg">
                <tui-icon [icon]="ICONS.AGREEMENTS" class="text-3xl text-white"></tui-icon>
              </div>
              <div>
                <h1 class="mb-1 text-3xl font-bold text-gray-800 dark:text-white">
                  {{ 'agreements' | translate }}
                </h1>
                <p class="text-gray-600 dark:text-slate-400">{{ 'agreements_description' | translate }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <button
                tuiButton
                appearance="secondary"
                size="l"
                iconStart="@tui.download"
                [attr.tuiTheme]="currentTheme()"
                (click)="onExportAgreements()"
                [disabled]="isProcessing() || !hasData()"
                class="border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
              >
                {{ 'export' | translate }}
              </button>
              <button
                *zHasRole="allowedRolesForAgreementCreation()"
                tuiButton
                appearance="primary"
                size="l"
                iconStart="@tui.plus"
                [attr.tuiTheme]="currentTheme()"
                (click)="onCreateAgreement()"
                [disabled]="isProcessing()"
                class="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
              >
                {{ 'create_agreement' | translate }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="container mx-auto px-6 py-8">
        <div class="mb-6">
          <h2 class="mb-2 text-2xl font-bold text-gray-900 dark:text-white">{{ 'agreements_summary' | translate }}</h2>
          <p class="text-gray-600 dark:text-gray-300">{{ 'agreements_summary_description' | translate }}</p>
        </div>

        @if (isLoading()) {
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            @for (i of [1, 2, 3, 4]; track i) {
              <div class="h-32 w-full rounded-xl bg-white shadow-sm dark:bg-slate-800" [tuiSkeleton]="true"></div>
            }
          </div>
        } @else {
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            @for (stat of statsCards(); track stat.id) {
              <div
                class="rounded-xl bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-lg hover:shadow-gray-900/5 dark:bg-slate-800 dark:shadow-slate-900/20 dark:hover:shadow-slate-900/40"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-300">{{ stat.title | translate }}</p>
                    <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stat.value }}</p>
                  </div>
                  <div
                    class="rounded-lg bg-gradient-to-r p-3"
                    [ngClass]="'from-' + stat.color + '-500 to-' + stat.color + '-600'"
                  >
                    <tui-icon [icon]="stat.icon" class="text-white" size="s"></tui-icon>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div>

      <!-- Agreements Table -->
      <div class="container mx-auto px-6 pb-8">
        <div class="mb-6">
          <h2 class="mb-2 text-2xl font-bold text-gray-900 dark:text-white">{{ 'agreements_list' | translate }}</h2>
          <p class="text-gray-600 dark:text-gray-300">{{ 'agreements_list_description' | translate }}</p>
        </div>

        @defer (on viewport; prefetch on idle) {
          <div class="overflow-hidden rounded-xl bg-white shadow-sm dark:bg-slate-800 dark:shadow-slate-900/20">
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
          </div>
        } @placeholder {
          <div class="rounded-xl bg-white p-8 shadow-sm dark:bg-slate-800 dark:shadow-slate-900/20">
            <div class="space-y-4">
              @for (i of [1, 2, 3, 4, 5]; track i) {
                <div class="h-12 w-full rounded-lg bg-gray-200/50 dark:bg-gray-700/50" [tuiSkeleton]="true"></div>
              }
            </div>
          </div>
        } @loading {
          <div class="rounded-xl bg-white p-8 shadow-sm dark:bg-slate-800 dark:shadow-slate-900/20">
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
          <div class="mt-6 rounded-xl border border-red-200/50 bg-red-50 p-6 dark:border-red-800/50 dark:bg-red-900/20">
            <div class="flex items-center gap-3">
              <tui-icon icon="@tui.alert-circle" class="text-xl text-red-600 dark:text-red-400"></tui-icon>
              <div>
                <h3 class="font-semibold text-red-800 dark:text-red-200">
                  {{ 'error_loading_agreements' | translate }}
                </h3>
                <p class="text-red-700 dark:text-red-300">{{ errorMessage() }}</p>
              </div>
            </div>
          </div>
        }
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

  // UI properties
  protected currentTheme = injectCurrentTheme();
  protected ICONS = ICONS;
  protected isProcessing = signal(false);

  // Loading states
  protected isLoading = computed(() => this.agreementsFacade.isAgreementsLoading());
  protected errorMessage = computed(() => this.agreementsFacade.loadingError());

  // Data
  protected agreementsData = computed(() => this.agreementsFacade.agreements.value()?.data || []);
  protected tableData = computed(() => this.transformAgreementsData(this.agreementsData()));
  protected hasData = computed(() => (this.agreementsData()?.length || 0) > 0);
  protected statsCards = computed(() => this.getStatsCards());

  // Pagination
  protected currentPage = this.agreementsFacade.currentPage;
  protected pageSize = this.agreementsFacade.pageSize;
  protected totalPages = this.agreementsFacade.totalPages;
  protected totalItems = this.agreementsFacade.totalItems;

  // Role-based permissions
  protected canCreate = computed(() =>
    this.roleService.isInAnyGroup(['ADMINISTRATION', 'TOP_MANAGEMENT', 'LEADERSHIP_TEAM'])
  );
  protected canEdit = computed(() =>
    this.roleService.isInAnyGroup(['ADMINISTRATION', 'TOP_MANAGEMENT', 'LEADERSHIP_TEAM'])
  );
  protected canDelete = computed(() => this.roleService.isInAnyGroup(['ADMINISTRATION', 'TOP_MANAGEMENT']));

  // Role-based access for UI
  protected allowedRolesForAgreementCreation = () => ['ADMINISTRATION', 'TOP_MANAGEMENT', 'LEADERSHIP_TEAM'];

  // Table configuration
  protected tableColumns: TableColumn[] = [
    {
      key: 'name',
      label: this.translate.instant('user_name'),
      type: 'avatar',
      sortable: true,
      searchable: true,
    },
    {
      key: 'email',
      label: this.translate.instant('user_email'),
      type: 'text',
      sortable: true,
      searchable: true,
    },
    {
      key: 'role',
      label: this.translate.instant('role'),
      type: 'text',
      sortable: true,
      searchable: true,
    },
    {
      key: 'headquarter',
      label: this.translate.instant('headquarter_name'),
      type: 'text',
      sortable: true,
      searchable: true,
    },
    {
      key: 'agreementType',
      label: this.translate.instant('agreement_type'),
      type: 'text',
      sortable: true,
    },
    {
      key: 'status',
      label: this.translate.instant('agreement_status'),
      type: 'status',
      sortable: true,
    },
    {
      key: 'createdAt',
      label: this.translate.instant('agreement_start_date'),
      type: 'date',
      sortable: true,
    },
  ];

  protected tableActions: TableAction[] = [
    {
      label: this.translate.instant('view_agreement'),
      icon: '@tui.eye',
      color: 'primary',
      handler: (item: AgreementListData) => this.onRowClick(item),
      visible: () => true,
    },
    {
      label: this.translate.instant('activate_agreement'),
      icon: '@tui.play',
      color: 'primary',
      handler: (item: AgreementListData) => this.onActivateAgreement(item),
      visible: (item: AgreementListData) => this.canEdit() && item.status !== 'active',
    },
    {
      label: this.translate.instant('deactivate_agreement'),
      icon: '@tui.pause',
      color: 'warning',
      handler: (item: AgreementListData) => this.onDeactivateAgreement(item),
      visible: (item: AgreementListData) => this.canEdit() && item.status === 'active',
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

  // Pagination methods
  protected onPageChange = (page: number): void => {
    this.agreementsFacade.onPageChange(page);
  };

  protected onPageSizeChange = (size: number): void => {
    this.agreementsFacade.onPageSizeChange(size);
  };

  private transformAgreementsData(agreements: AgreementWithShallowRelations[]): AgreementListData[] {
    return agreements.map((agreement) => ({
      id: agreement.id,
      name: agreement.name || this.translate.instant('no_name'),
      lastName: agreement.last_name || '',
      email: agreement.email || this.translate.instant('no_email'),
      role: agreement.role?.role_name || this.translate.instant('no_role'),
      status: this.mapStatus(agreement.status || 'pending'),
      headquarter: agreement.headquarter_name || this.translate.instant('no_headquarter'),
      createdAt: agreement.created_at || '',
      agreementType: this.translate.instant('not_specified'), // TODO: Add agreement_type to database
      verificationType: 'pending', // TODO: Add verification_status to database
    }));
  }

  private getStatsCards(): StatCard[] {
    const data = this.agreementsData();
    const total = this.totalItems() || data.length;
    const active = data.filter((item) => item.status === 'active').length;
    const pending = data.filter((item) => item.status === 'pending').length;
    const inactive = data.filter((item) => item.status === 'inactive').length;

    return [
      {
        id: 'total',
        title: 'total_agreements',
        value: total,
        icon: '@tui.file-text',
        trend: 0,
        color: 'blue',
      },
      {
        id: 'active',
        title: 'active_agreements',
        value: active,
        icon: '@tui.check-circle',
        trend: 0,
        color: 'emerald',
      },
      {
        id: 'pending',
        title: 'pending_agreements',
        value: pending,
        icon: '@tui.clock',
        trend: 0,
        color: 'yellow',
      },
      {
        id: 'inactive',
        title: 'inactive_agreements',
        value: inactive,
        icon: '@tui.x-circle',
        trend: 0,
        color: 'red',
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

  protected onCreateAgreement(): void {
    // TODO: Implement create modal
    console.log('Create agreement modal - to be implemented');
    this.notificationService.showInfo(this.translate.instant('feature_coming_soon'));
  }

  protected async onActivateAgreement(agreement: AgreementListData): Promise<void> {
    try {
      this.isProcessing.set(true);
      await this.agreementsFacade.activateAgreement(agreement.id);
      this.notificationService.showSuccess(
        this.translate.instant('agreement_activation_success', { name: `${agreement.name} ${agreement.lastName}` })
      );
    } catch (error) {
      console.error('Error activating agreement:', error);
      this.notificationService.showError(this.translate.instant('agreement_activation_error'));
    } finally {
      this.isProcessing.set(false);
    }
  }

  protected async onDeactivateAgreement(agreement: AgreementListData): Promise<void> {
    try {
      this.isProcessing.set(true);
      await this.agreementsFacade.deactivateAgreement(agreement.id);
      this.notificationService.showSuccess(
        this.translate.instant('agreement_deactivation_success', { name: `${agreement.name} ${agreement.lastName}` })
      );
    } catch (error) {
      console.error('Error deactivating agreement:', error);
      this.notificationService.showError(this.translate.instant('agreement_deactivation_error'));
    } finally {
      this.isProcessing.set(false);
    }
  }

  protected async onExportAgreements(): Promise<void> {
    try {
      this.isProcessing.set(true);

      // Get all agreements for export
      const agreements = await this.agreementsFacade.exportAgreements();

      if (!agreements || agreements.length === 0) {
        this.notificationService.showWarning(this.translate.instant('no_data_to_export'));
        return;
      }

      // Open export options modal
      const dialog = this.dialogs.open<ExportOptions>(new PolymorpheusComponent(ExportModalUiComponent), {
        dismissible: true,
        size: 'm',
      });

      dialog.subscribe({
        next: (options) => {
          if (options) {
            this.handleExport(agreements, options);
          }
        },
        error: (error) => {
          console.error('Export dialog error:', error);
          this.notificationService.showError(this.translate.instant('dialog_error'));
        },
      });
    } catch (error) {
      console.error('Export error:', error);
      this.notificationService.showError(this.translate.instant('export_error'));
    } finally {
      this.isProcessing.set(false);
    }
  }

  private handleExport(agreements: AgreementWithShallowRelations[], options: ExportOptions): void {
    // Transform agreements to export format
    const exportData = agreements.map((agreement) => ({
      name: agreement.name || '',
      lastName: agreement.last_name || '',
      email: agreement.email || '',
      role: agreement.role?.role_name || '',
      status: agreement.status || '',
      headquarter: agreement.headquarter_name || '',
      createdAt: agreement.created_at || '',
    }));

    // Create export columns
    const exportColumns = this.tableColumns
      .filter((col) => col.key !== 'actions')
      .map((col) => ({
        key: col.key,
        label: col.label,
      }));

    // Generate filename with current date
    const date = new Date().toISOString().split('T')[0];
    const filename = `agreements_${date}`;

    // Export based on selected format
    if (options.format === 'csv') {
      this.exportService.exportToCSV(exportData, exportColumns, filename);
    } else {
      this.exportService.exportToExcel(exportData, exportColumns, filename);
    }

    // Show success notification
    this.notificationService.showSuccess(
      this.translate.instant('export_success', {
        count: exportData.length,
        format: options.format.toUpperCase(),
      })
    );
  }
}
