import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

import { AgreementsFacadeService, AgreementWithShallowRelations } from '../../services/agreements-facade.service';
import { RoleService } from '@zambia/data-access-roles-permissions';
import { ExportService, NotificationService, AkademyEdgeFunctionsService } from '@zambia/data-access-generic';
import { DirectMessageService } from '@zambia/shared/data-access-notifications';
import { DirectMessageDialogV2SmartComponent } from '@zambia/feat-notifications';

import {
  EnhancedTableUiComponent,
  ExportModalUiComponent,
  ExportOptions,
  injectCurrentTheme,
  TableAction,
  TableColumn,
} from '@zambia/ui-components';

import { TuiButton, TuiDialogService, TuiIcon, TuiLink } from '@taiga-ui/core';
import { TuiBreadcrumbs, TuiSkeleton } from '@taiga-ui/kit';
import { TuiItem } from '@taiga-ui/cdk';

import { ROLE } from '@zambia/util-roles-definitions';
import { ICONS } from '@zambia/util-constants';
import { UserCreationSuccessModalComponent } from './user-creation-success-modal.component';
import { PasswordResetModalComponent } from './password-reset-modal.component';
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
  verificationType: 'verified' | 'pending' | 'rejected';
  userId?: string;
  phone?: string;
  documentNumber?: string;
}

interface StatCard {
  id: string;
  title: string;
  value: number;
  icon: string;
  color: string;
  gradient: string;
  cardClass: string;
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
    RouterLink,
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
                *zHasRole="[ROLE.SUPERADMIN]"
                tuiButton
                appearance="secondary"
                size="l"
                iconStart="@tui.database"
                [attr.tuiTheme]="currentTheme()"
                (click)="onMigrateFromStrapi()"
                [disabled]="isProcessing()"
                class="border-purple-500 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
              >
                {{ 'migrate_from_strapi' | translate }}
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
        @if (isLoading()) {
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            @for (i of [1, 2, 3, 4]; track i) {
              <div class="h-32 w-full rounded-xl bg-white shadow-sm dark:bg-slate-800" [tuiSkeleton]="true"></div>
            }
          </div>
        } @else {
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            @for (stat of statsCards(); track stat.id) {
              <div [class]="stat.cardClass">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-300">{{ stat.title | translate }}</p>
                    <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stat.value }}</p>
                  </div>
                  <div class="rounded-lg p-3" [class]="stat.gradient">
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
              [pageSize]="25"
              [pageSizeOptions]="[10, 25, 50, 100]"
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

  private agreementsFacade = inject(AgreementsFacadeService);
  private roleService = inject(RoleService);
  private router = inject(Router);
  private dialogs = inject(TuiDialogService);
  private notificationService = inject(NotificationService);
  private exportService = inject(ExportService);
  private translate = inject(TranslateService);
  private edgeFunctions = inject(AkademyEdgeFunctionsService);
  private directMessageService = inject(DirectMessageService);

  protected currentTheme = injectCurrentTheme();
  protected ICONS = ICONS;
  protected ROLE = ROLE;
  protected isProcessing = signal(false);

  protected isLoading = computed(() => this.agreementsFacade.isAgreementsLoading());
  protected errorMessage = computed(() => this.agreementsFacade.loadingError());

  protected agreementsData = computed(() => this.agreementsFacade.agreements.value()?.data || []);
  protected tableData = computed(() => this.transformAgreementsData(this.agreementsData()));
  protected hasData = computed(() => (this.agreementsData()?.length || 0) > 0);
  protected statsCards = computed(() => this.getStatsCards());

  protected currentPage = this.agreementsFacade.currentPage;
  protected pageSize = this.agreementsFacade.pageSize;
  protected totalPages = this.agreementsFacade.totalPages;
  protected totalItems = this.agreementsFacade.totalItems;

  protected canCreate = computed(() =>
    this.roleService.isInAnyGroup(['ADMINISTRATION', 'TOP_MANAGEMENT', 'LEADERSHIP_TEAM'])
  );
  protected canEdit = computed(() =>
    this.roleService.isInAnyGroup(['ADMINISTRATION', 'TOP_MANAGEMENT', 'LEADERSHIP_TEAM'])
  );
  protected canDelete = computed(() => this.roleService.isInAnyGroup(['ADMINISTRATION']));

  protected allowedRolesForAgreementCreation = () => ['ADMINISTRATION', 'TOP_MANAGEMENT', 'LEADERSHIP_TEAM'];

  protected tableColumns: TableColumn[] = [
    {
      key: 'name',
      label: this.translate.instant('user_name'),
      type: 'avatar',
      sortable: true,
      searchable: true,
      width: 250,
    },
    {
      key: 'email',
      label: this.translate.instant('user_email'),
      type: 'text',
      sortable: true,
      searchable: true,
      width: 250,
    },
    {
      key: 'role',
      label: this.translate.instant('role'),
      type: 'text',
      sortable: true,
      searchable: true,
      width: 150,
    },
    {
      key: 'headquarter',
      label: this.translate.instant('headquarter_name'),
      type: 'text',
      sortable: true,
      searchable: true,
      width: 180,
    },
    {
      key: 'status',
      label: this.translate.instant('agreement_status'),
      type: 'status',
      sortable: true,
      width: 120,
    },
    {
      key: 'createdAt',
      label: this.translate.instant('agreement_start_date'),
      type: 'date',
      sortable: true,
      width: 150,
    },
    {
      key: 'actions',
      label: this.translate.instant('actions'),
      type: 'actions',
      sortable: false,
      width: 200,
    },
  ];

  protected tableActions: TableAction<AgreementListData>[] = [
    {
      label: this.translate.instant('view_agreement'),
      icon: '@tui.eye',
      color: 'primary',
      handler: (item: AgreementListData) => this.onRowClick(item),
      visible: () => true,
    },
    {
      label: this.translate.instant('create_user'),
      icon: '@tui.user-plus',
      color: 'primary',
      handler: (item: AgreementListData) => this.onCreateUserFromAgreement(item),
      visible: (item: AgreementListData) => {
        const roleLevel = Number(this.roleService.roleLevel() || 0);
        const hasValidStatus = item.status === 'pending' || item.status === 'inactive';
        const hasNoUser = !item.userId;
        return roleLevel >= 30 && hasValidStatus && hasNoUser;
      },
    },
    {
      label: this.translate.instant('deactivate_user'),
      icon: '@tui.user-x',
      color: 'warning',
      handler: (item: AgreementListData) => this.onDeactivateUser(item),
      visible: (item: AgreementListData) =>
        Number(this.roleService.roleLevel() || 0) >= 50 && item.status === 'active' && item.userId !== undefined,
    },
    {
      label: this.translate.instant('reset_password'),
      icon: '@tui.key',
      color: 'secondary',
      handler: (item: AgreementListData) => this.onResetPassword(item),
      visible: (item: AgreementListData) =>
        Number(this.roleService.roleLevel() || 0) >= 1 && item.status === 'active' && item.userId !== undefined,
    },
    {
      label: this.translate.instant('send_message'),
      icon: '@tui.message-circle',
      color: 'primary',
      handler: (item: AgreementListData) => this.onSendMessage(item),
      visible: (item: AgreementListData) => item.status === 'active' && item.userId !== undefined,
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
    console.log('Current user role:', this.roleService.userRole());
    console.log('Current role level:', this.roleService.roleLevel());
    console.log('Is superadmin:', this.roleService.hasRole(ROLE.SUPERADMIN));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadInitialData(): void {
    this.agreementsFacade.agreements.reload();
  }

  protected onPageChange = (page: number): void => {
    this.agreementsFacade.onPageChange(page);
  };

  protected onPageSizeChange = (size: number): void => {
    this.agreementsFacade.onPageSizeChange(size);
  };

  private transformAgreementsData(agreements: AgreementWithShallowRelations[]): AgreementListData[] {
    const transformed = agreements.map((agreement) => ({
      id: agreement.id,
      name: agreement.name || this.translate.instant('no_name'),
      lastName: agreement.last_name || '',
      email: agreement.email || this.translate.instant('no_email'),
      role: agreement.role?.role_name || this.translate.instant('no_role'),
      status: this.mapStatus(agreement.status || 'pending'),
      headquarter: agreement.headquarter_name || this.translate.instant('no_headquarter'),
      createdAt: agreement.created_at || '',
      verificationType: 'pending' as 'pending' | 'verified' | 'rejected', // TODO: Add verification_status to database
      userId: agreement.user_id || undefined,
      phone: agreement.phone || undefined,
      documentNumber: agreement.document_number || undefined,
    }));

    // Debug: Log first item to see available actions
    if (transformed.length > 0) {
      const firstItem = transformed[0];
      console.log('First agreement:', firstItem);
      console.log(
        'Available actions for first item:',
        this.tableActions.map((action) => ({
          label: action.label,
          visible: action.visible ? action.visible(firstItem) : true,
        }))
      );
    }

    return transformed;
  }

  private getStatsCards(): StatCard[] {
    const data = this.agreementsData();
    const total = this.totalItems() || data.length;
    const active = data.filter((item) => item.status === 'active').length;
    const pending = data.filter((item) => item.status === 'prospect').length;
    const inactive = data.filter((item) => item.status === 'inactive').length;

    return [
      {
        id: 'total',
        title: 'total_agreements',
        value: total,
        icon: '@tui.file-text',
        color: 'blue',
        gradient: 'bg-gradient-to-r from-blue-500 to-blue-600',
        cardClass:
          'group relative block overflow-hidden rounded-2xl border border-gray-200/50 bg-white/90 p-6 shadow-lg shadow-gray-900/5 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-blue-300/70 hover:shadow-xl hover:shadow-blue-500/20 dark:border-slate-700/50 dark:bg-slate-900 dark:shadow-slate-900/20 dark:hover:border-blue-600/70 dark:hover:shadow-blue-500/30',
      },
      {
        id: 'active',
        title: 'active_agreements',
        value: active,
        icon: '@tui.circle-check',
        color: 'emerald',
        gradient: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
        cardClass:
          'group relative block overflow-hidden rounded-2xl border border-gray-200/50 bg-white/90 p-6 shadow-lg shadow-gray-900/5 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-emerald-300/70 hover:shadow-xl hover:shadow-emerald-500/20 dark:border-slate-700/50 dark:bg-slate-900 dark:shadow-slate-900/20 dark:hover:border-emerald-600/70 dark:hover:shadow-emerald-500/30',
      },
      {
        id: 'pending',
        title: 'pending_agreements',
        value: pending,
        icon: '@tui.clock',
        color: 'yellow',
        gradient: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
        cardClass:
          'group relative block overflow-hidden rounded-2xl border border-gray-200/50 bg-white/90 p-6 shadow-lg shadow-gray-900/5 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-yellow-300/70 hover:shadow-xl hover:shadow-yellow-500/20 dark:border-slate-700/50 dark:bg-slate-900 dark:shadow-slate-900/20 dark:hover:border-yellow-600/70 dark:hover:shadow-yellow-500/30',
      },
      {
        id: 'inactive',
        title: 'inactive_agreements',
        value: inactive,
        icon: '@tui.circle-alert',
        color: 'red',
        gradient: 'bg-gradient-to-r from-red-500 to-red-600',
        cardClass:
          'group relative block overflow-hidden rounded-2xl border border-gray-200/50 bg-white/90 p-6 shadow-lg shadow-gray-900/5 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-red-300/70 hover:shadow-xl hover:shadow-red-500/20 dark:border-slate-700/50 dark:bg-slate-900 dark:shadow-slate-900/20 dark:hover:border-red-600/70 dark:hover:shadow-red-500/30',
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
      prospect: 'pending', // Map prospect to pending for UI consistency
    };
    return statusMap[status] || 'pending';
  }

  protected onRowClick(agreement: AgreementListData): void {
    this.router.navigate(['/dashboard/agreements', agreement.id]);
  }

  protected onCreateAgreement(): void {
    console.log('Create agreement modal - to be implemented');
    this.notificationService.showInfo(this.translate.instant('feature_coming_soon'));
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

      const agreements = await this.agreementsFacade.exportAgreements();

      if (!agreements || agreements.length === 0) {
        this.notificationService.showWarning(this.translate.instant('no_data_to_export'));
        return;
      }

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
    const exportData = agreements.map((agreement) => ({
      name: agreement.name || '',
      lastName: agreement.last_name || '',
      email: agreement.email || '',
      role: agreement.role?.role_name || '',
      status: agreement.status || '',
      headquarter: agreement.headquarter_name || '',
      createdAt: agreement.created_at || '',
    }));

    const exportColumns = this.tableColumns
      .filter((col) => col.key !== 'actions')
      .map((col) => ({
        key: col.key,
        label: col.label,
      }));

    const date = new Date().toISOString().split('T')[0];
    const filename = `agreements_${date}`;

    if (options.format === 'csv') {
      this.exportService.exportToCSV(exportData, exportColumns, filename);
    } else {
      this.exportService.exportToExcel(exportData, exportColumns, filename);
    }

    this.notificationService.showSuccess(
      this.translate.instant('export_success', {
        count: exportData.length,
        format: options.format.toUpperCase(),
      })
    );
  }

  protected async onMigrateFromStrapi(): Promise<void> {
    try {
      this.isProcessing.set(true);
      const response = await this.edgeFunctions.migrate();

      if (response.error) {
        this.notificationService.showError(this.translate.instant('migration_failed', { error: response.error }));
        return;
      }

      if (response.data) {
        const { statistics } = response.data;
        this.notificationService.showSuccess(
          this.translate.instant('migration_success', {
            inserted: statistics.supabaseInserted,
            skipped: statistics.supabaseSkippedDuplicates,
          })
        );

        this.agreementsFacade.agreements.reload();
      }
    } catch (error) {
      console.error('Migration error:', error);
      this.notificationService.showError(this.translate.instant('migration_error'));
    } finally {
      this.isProcessing.set(false);
    }
  }

  protected async onCreateUserFromAgreement(agreement: AgreementListData): Promise<void> {
    try {
      this.isProcessing.set(true);
      const response = await this.edgeFunctions.createUser({ agreement_id: agreement.id });

      if (response.error) {
        this.notificationService.showError(this.translate.instant('user_creation_failed', { error: response.error }));
        return;
      }

      if (response.data) {
        const userData = {
          email: response.data.email,
          password: response.data.password,
          role: response.data.role_name,
          user_metadata: {
            first_name: agreement.name || '',
            last_name: agreement.lastName || '',
            phone: response.data.phone,
          },
        };

        this.dialogs
          .open<void>(new PolymorpheusComponent(UserCreationSuccessModalComponent), {
            dismissible: true,
            size: 'm',
            data: userData,
            label: this.translate.instant('user_created_successfully'),
          })
          .subscribe();

        this.agreementsFacade.agreements.reload();
      }
    } catch (error) {
      console.error('User creation error:', error);
      this.notificationService.showError(this.translate.instant('user_creation_error'));
    } finally {
      this.isProcessing.set(false);
    }
  }

  protected async onDeactivateUser(agreement: AgreementListData): Promise<void> {
    if (!agreement.userId) {
      this.notificationService.showError(this.translate.instant('no_user_id_found'));
      return;
    }

    try {
      this.isProcessing.set(true);
      const response = await this.edgeFunctions.deactivateUser({ user_id: agreement.userId });

      if (response.error) {
        this.notificationService.showError(
          this.translate.instant('user_deactivation_failed', { error: response.error })
        );
        return;
      }

      if (response.data) {
        this.notificationService.showSuccess(
          this.translate.instant('user_deactivation_success', {
            name: `${agreement.name} ${agreement.lastName}`,
          })
        );
        this.agreementsFacade.agreements.reload();
      }
    } catch (error) {
      console.error('User deactivation error:', error);
      this.notificationService.showError(this.translate.instant('user_deactivation_error'));
    } finally {
      this.isProcessing.set(false);
    }
  }

  protected async onResetPassword(agreement: AgreementListData): Promise<void> {
    if (!agreement.userId) {
      this.notificationService.showError(this.translate.instant('no_user_id_found'));
      return;
    }

    this.dialogs
      .open<{ newPassword: string } | null>(new PolymorpheusComponent(PasswordResetModalComponent), {
        dismissible: true,
        size: 'm',
        data: {
          name: agreement.name,
          lastName: agreement.lastName,
          email: agreement.email,
        },
        label: this.translate.instant('reset_password'),
      })
      .subscribe(async (formData) => {
        if (formData) {
          await this.performPasswordReset(agreement, formData);
        }
      });
  }

  protected async onSendMessage(agreement: AgreementListData): Promise<void> {
    if (!agreement.userId) {
      this.notificationService.showError(this.translate.instant('no_user_id_found'));
      return;
    }

    const sent = await this.directMessageService.openSendMessageDialog(
      new PolymorpheusComponent(DirectMessageDialogV2SmartComponent),
      agreement.userId
    );

    if (sent) {
      this.notificationService.showSuccess(this.translate.instant('message_sent_success'));
    }
  }

  private async performPasswordReset(agreement: AgreementListData, formData: { newPassword: string }): Promise<void> {
    try {
      this.isProcessing.set(true);
      const response = await this.edgeFunctions.resetPassword({
        email: agreement.email,
        document_number: agreement.documentNumber || '',
        new_password: formData.newPassword,
        phone: agreement.phone || '',
        first_name: agreement.name,
        last_name: agreement.lastName,
      });

      if (response.error) {
        this.notificationService.showError(this.translate.instant('password_reset_failed', { error: response.error }));
        return;
      }

      if (response.data) {
        this.notificationService.showSuccess(response.data.message);
      }
    } catch (error) {
      console.error('Password reset error:', error);
      this.notificationService.showError(this.translate.instant('password_reset_error'));
    } finally {
      this.isProcessing.set(false);
    }
  }
}
