import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { Router, RouterModule } from '@angular/router';
import {
  HeadquartersFacadeService,
  Headquarter,
  HeadquarterFormData,
} from '../../services/headquarters-facade.service';
import { HeadquarterFormModalSmartComponent } from './headquarter-form-modal.smart-component';
import { Json } from '@zambia/types-supabase';
import { SupabaseService } from '@zambia/data-access-supabase';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TuiButton, TuiDialogService, TuiIcon, TuiLink } from '@taiga-ui/core';
import { TuiBreadcrumbs, TuiSkeleton } from '@taiga-ui/kit';
import { TuiItem } from '@taiga-ui/cdk';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import {
  ExportModalUiComponent,
  ExportOptions,
  ConfirmationModalUiComponent,
  ConfirmationData,
} from '@zambia/ui-components';
import {
  tryCatch,
  NotificationService,
  isDatabaseConstraintError,
  parseConstraintError,
  ExportService,
} from '@zambia/data-access-generic';
import { EnhancedTableUiComponent, type TableColumn, type TableAction } from '@zambia/ui-components';
import { ICONS } from '@zambia/util-constants';
import { injectCurrentTheme, WindowService } from '@zambia/ui-components';
import { HasRoleDirective } from '@zambia/util-roles-permissions';
import { ROLE, ROLE_GROUPS } from '@zambia/util-roles-definitions';
import { RoleService } from '@zambia/data-access-roles-permissions';

@Component({
  selector: 'z-headquarters-list',
  standalone: true,
  imports: [
    RouterModule,
    TranslatePipe,
    EnhancedTableUiComponent,
    TuiIcon,
    TuiButton,
    TuiLink,
    TuiBreadcrumbs,
    TuiItem,
    TuiSkeleton,
    HasRoleDirective,
  ],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-slate-800">
      <!-- Header Section -->
      <div class="border-b border-gray-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
        <div class="container mx-auto px-4 py-4 sm:px-6 sm:py-6">
          <!-- Breadcrumbs -->
          <tui-breadcrumbs class="mb-6">
            <a *tuiItem routerLink="/dashboard" tuiLink iconStart="@tui.house">
              {{ 'dashboard' | translate }}
            </a>
            <span *tuiItem>
              {{ 'headquarters' | translate }}
            </span>
          </tui-breadcrumbs>

          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
              <div class="mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-4 shadow-lg sm:mx-0">
                <tui-icon [icon]="ICONS.HEADQUARTERS" class="text-3xl text-white"></tui-icon>
              </div>
              <div>
                <h1 class="mb-1 text-2xl font-bold text-gray-800 sm:text-3xl dark:text-white">
                  {{ 'headquarters' | translate }}
                </h1>
                <p class="text-sm text-gray-600 sm:text-base dark:text-slate-400">
                  {{ 'headquarters_description' | translate }}
                </p>
              </div>
            </div>
            <div class="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
              <button
                tuiButton
                appearance="secondary"
                [size]="buttonSize()"
                iconStart="@tui.download"
                [attr.tuiTheme]="currentTheme()"
                (click)="onExportHeadquarters()"
                [disabled]="isProcessing() || !statsData()?.total"
                class="w-full border-blue-500 text-blue-600 hover:bg-blue-50 sm:w-auto dark:hover:bg-blue-900/20"
              >
                {{ 'export' | translate }}
              </button>
              <button
                *zHasRole="allowedRolesForHeadquarterCreation()"
                tuiButton
                appearance="primary"
                [size]="buttonSize()"
                iconStart="@tui.plus"
                [attr.tuiTheme]="currentTheme()"
                (click)="onCreateHeadquarter()"
                [disabled]="isProcessing()"
                class="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 sm:w-auto"
              >
                {{ 'create_headquarter' | translate }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
        @defer (on viewport; prefetch on idle) {
          @if (statsData()) {
            <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
              <!-- Total Headquarters -->
              <div
                class="rounded-xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-gray-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600"
              >
                <div class="mb-3 flex items-center justify-between">
                  <span class="text-sm font-medium tracking-wider text-gray-500 uppercase dark:text-slate-400">
                    {{ 'total_headquarters' | translate }}
                  </span>
                  <tui-icon [icon]="ICONS.HEADQUARTERS" class="text-blue-500"></tui-icon>
                </div>
                <p class="text-2xl font-bold text-gray-800 dark:text-white">
                  {{ statsData()!.total }}
                </p>
              </div>

              <!-- Active Headquarters -->
              <div
                class="rounded-xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-gray-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600"
              >
                <div class="mb-3 flex items-center justify-between">
                  <span class="text-sm font-medium tracking-wider text-gray-500 uppercase dark:text-slate-400">
                    {{ 'active_headquarters' | translate }}
                  </span>
                  <tui-icon icon="@tui.check" class="text-green-500"></tui-icon>
                </div>
                <p class="text-2xl font-bold text-gray-800 dark:text-white">
                  {{ statsData()!.active }}
                </p>
              </div>

              <!-- Inactive Headquarters -->
              <div
                class="rounded-xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-gray-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600"
              >
                <div class="mb-3 flex items-center justify-between">
                  <span class="text-sm font-medium tracking-wider text-gray-500 uppercase dark:text-slate-400">
                    {{ 'inactive_headquarters' | translate }}
                  </span>
                  <tui-icon icon="@tui.x" class="text-red-500"></tui-icon>
                </div>
                <p class="text-2xl font-bold text-gray-800 dark:text-white">
                  {{ statsData()!.inactive }}
                </p>
              </div>

              <!-- With Manager -->
              <div
                class="rounded-xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-gray-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600"
              >
                <div class="mb-3 flex items-center justify-between">
                  <span class="text-sm font-medium tracking-wider text-gray-500 uppercase dark:text-slate-400">
                    {{ 'with_manager' | translate }}
                  </span>
                  <tui-icon icon="@tui.user-check" class="text-purple-500"></tui-icon>
                </div>
                <p class="text-2xl font-bold text-gray-800 dark:text-white">
                  {{ statsData()!.withManager }}
                </p>
              </div>
            </div>
          }
        } @placeholder {
          <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
            @for (i of [1, 2, 3, 4]; track i) {
              <div [tuiSkeleton]="true" class="h-24 w-full rounded-xl"></div>
            }
          </div>
        } @loading {
          <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
            @for (i of [1, 2, 3, 4]; track i) {
              <div [tuiSkeleton]="true" class="h-24 w-full animate-pulse rounded-xl"></div>
            }
          </div>
        }

        <!-- Headquarters Table -->
        @defer (on viewport; prefetch on hover) {
          <div
            class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900"
          >
            <z-enhanced-table
              [attr.tuiTheme]="currentTheme()"
              [items]="transformedHeadquarters()"
              [columns]="tableColumns()"
              [actions]="tableActions()"
              [loading]="headquartersFacade.isLoading() || isProcessing()"
              [emptyStateTitle]="'no_headquarters_found' | translate"
              [emptyStateDescription]="'no_headquarters_description' | translate"
              [emptyStateIcon]="'@tui.building'"
              [loadingText]="'loading' | translate"
              [enablePagination]="shouldEnablePagination()"
              [enableFiltering]="true"
              [enableColumnVisibility]="true"
              [pageSize]="getOptimalPageSize()"
              [searchableColumns]="searchableColumns()"
              (rowClick)="onRowClick($event)"
            />
          </div>
        } @placeholder {
          <div
            class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900"
          >
            <div class="p-6">
              <div class="mb-4 flex items-center justify-between">
                <div [tuiSkeleton]="true" class="h-8 w-32 rounded"></div>
                <div [tuiSkeleton]="true" class="h-10 w-24 rounded"></div>
              </div>
              <div [tuiSkeleton]="true" class="mb-4 h-10 w-64 rounded"></div>
              <div class="space-y-3">
                @for (i of [1, 2, 3, 4, 5]; track i) {
                  <div [tuiSkeleton]="true" class="h-12 w-full rounded"></div>
                }
              </div>
            </div>
          </div>
        } @loading {
          <div
            class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900"
          >
            <div class="p-6">
              <div class="mb-4 flex items-center justify-between">
                <div [tuiSkeleton]="true" class="h-8 w-32 animate-pulse rounded"></div>
                <div [tuiSkeleton]="true" class="h-10 w-24 animate-pulse rounded"></div>
              </div>
              <div [tuiSkeleton]="true" class="mb-4 h-10 w-64 animate-pulse rounded"></div>
              <div class="space-y-3">
                @for (i of [1, 2, 3, 4, 5]; track i) {
                  <div [tuiSkeleton]="true" class="h-12 w-full animate-pulse rounded"></div>
                }
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
export class HeadquartersListSmartComponent {
  protected headquartersFacade = inject(HeadquartersFacadeService);
  private translate = inject(TranslateService);
  private dialogService = inject(TuiDialogService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private supabaseService = inject(SupabaseService);
  private exportService = inject(ExportService);
  private roleService = inject(RoleService);
  private windowService = inject(WindowService);

  isProcessing = signal(false);
  currentTheme = injectCurrentTheme();
  buttonSize = computed(() => (this.windowService.isMobile() ? 'm' : 'l'));

  ICONS = ICONS;

  transformedHeadquarters = computed(() => {
    const headquarters = this.headquartersFacade.headquartersResource();
    if (!headquarters) return [];

    return headquarters.map((hq) => ({
      ...hq,
      country_name: hq.countries ? `${hq.countries.name} (${hq.countries.code})` : this.translate.instant('no_country'),
      address_display: hq.address || this.translate.instant('no_address'),
    }));
  });

  statsData = computed(() => {
    const headquarters = this.headquartersFacade.headquartersResource();
    if (!headquarters || headquarters.length === 0) return null;

    return {
      total: headquarters.length,
      active: headquarters.filter((h) => h.status === 'active').length,
      inactive: headquarters.filter((h) => h.status === 'inactive').length,
      withManager: headquarters.filter((h) => {
        try {
          const contactInfo = h.contact_info as { managerId?: string } | null;
          return contactInfo && contactInfo.managerId;
        } catch {
          return false;
        }
      }).length,
    };
  });

  tableColumns = computed((): TableColumn[] => [
    {
      key: 'name',
      label: this.translate.instant('name'),
      type: 'avatar',
      sortable: true,
      searchable: true,
    },
    {
      key: 'country_name',
      label: this.translate.instant('country'),
      type: 'text',
      sortable: false,
      searchable: false,
    },
    {
      key: 'address_display',
      label: this.translate.instant('address'),
      type: 'text',
      sortable: false,
      searchable: false,
    },
    {
      key: 'status',
      label: this.translate.instant('status'),
      type: 'status',
      sortable: true,
    },
    {
      key: 'actions',
      label: this.translate.instant('actions'),
      type: 'actions',
      align: 'center',
    },
  ]);

  tableActions = computed((): TableAction<Headquarter>[] => [
    {
      label: this.translate.instant('view'),
      icon: '@tui.eye',
      color: 'primary',
      handler: (headquarter: Headquarter) => this.onViewHeadquarter(headquarter),
    },
    // {
    //   label: this.translate.instant('edit'),
    //   icon: '@tui.pencil',
    //   color: 'warning',
    //   handler: (headquarter: Headquarter) => this.onEditHeadquarter(headquarter),
    //   disabled: () => this.isProcessing(),
    //   visible: () => this.hasManagementAccess(),
    // },
    // {
    //   label: this.translate.instant('delete'),
    //   icon: '@tui.trash',
    //   color: 'danger',
    //   handler: (headquarter: Headquarter) => this.onDeleteHeadquarter(headquarter),
    //   disabled: () => this.isProcessing(),
    //   visible: () => this.hasTopManagementAccess(),
    // },
  ]);

  searchableColumns = computed(() => ['name', 'address']);

  shouldEnablePagination = computed(() => {
    const items = this.headquartersFacade.headquartersResource();
    return items && items.length > 25;
  });

  getOptimalPageSize = computed(() => 25);

  allowedRolesForHeadquarterCreation = computed(() => [
    ROLE.SUPERADMIN,
    ...ROLE_GROUPS.TOP_MANAGEMENT,
    ...ROLE_GROUPS.LEADERSHIP_TEAM,
  ]);

  hasManagementAccess = computed(() =>
    this.roleService.hasAnyRole([ROLE.SUPERADMIN, ...ROLE_GROUPS.TOP_MANAGEMENT, ...ROLE_GROUPS.LEADERSHIP_TEAM])
  );

  hasTopManagementAccess = computed(() =>
    this.roleService.hasAnyRole([ROLE.SUPERADMIN, ...ROLE_GROUPS.TOP_MANAGEMENT])
  );

  constructor() {
    this.headquartersFacade.headquarters.reload();
  }

  onRowClick(headquarter: Headquarter): void {
    this.onViewHeadquarter(headquarter);
  }

  onViewHeadquarter(headquarter: Headquarter): void {
    this.router.navigate(['/dashboard/headquarters', headquarter.id]);
  }

  onExportHeadquarters(): void {
    const headquarters = this.headquartersFacade.headquartersResource();
    if (!headquarters || headquarters.length === 0) {
      this.notificationService.showWarning('no_data_to_export').subscribe();
      return;
    }

    const dialog = this.dialogService.open<ExportOptions>(new PolymorpheusComponent(ExportModalUiComponent), {
      dismissible: true,
      size: 'm',
    });

    dialog.subscribe({
      next: (options) => {
        if (options) {
          this.handleExport(options);
        }
      },
      error: (error) => {
        console.error('Export dialog error:', error);
        this.notificationService.showError('dialog_error').subscribe();
      },
    });
  }

  private handleExport(format: ExportOptions): void {
    const transformedData = this.transformedHeadquarters();

    const exportData = transformedData.map((hq) => ({
      ...hq,
      contact_info: hq.contact_info as Json,
    }));

    const exportColumns = this.exportService.createExportColumns(this.tableColumns());

    const date = new Date().toISOString().split('T')[0];
    const filename = `headquarters_${date}`;

    if (format === 'csv') {
      this.exportService.exportToCSV(exportData, exportColumns, filename);
    } else {
      this.exportService.exportToExcel(exportData, exportColumns, filename);
    }

    this.notificationService
      .showSuccess('export_success', {
        translateParams: {
          count: transformedData.length,
          format: format.toUpperCase(),
        },
      })
      .subscribe();
  }

  onCreateHeadquarter(): void {
    const dialog = this.dialogService.open<HeadquarterFormData>(
      new PolymorpheusComponent(HeadquarterFormModalSmartComponent),
      {
        data: null,
        dismissible: true,
        size: 'm',
      }
    );

    dialog.subscribe({
      next: async (result) => {
        if (result) {
          await this.handleCreateHeadquarter(result);
        }
      },
      error: (error) => {
        console.error('Create headquarter dialog error:', error);
        this.notificationService.showError('dialog_error').subscribe();
      },
    });
  }

  onEditHeadquarter(headquarter: Headquarter): void {
    const dialog = this.dialogService.open<HeadquarterFormData>(
      new PolymorpheusComponent(HeadquarterFormModalSmartComponent),
      {
        data: headquarter,
        dismissible: true,
        size: 'm',
      }
    );

    dialog.subscribe({
      next: async (result) => {
        if (result) {
          await this.handleUpdateHeadquarter(headquarter.id, result);
        }
      },
      error: (error) => {
        console.error('Edit headquarter dialog error:', error);
        this.notificationService.showError('dialog_error').subscribe();
      },
    });
  }

  onDeleteHeadquarter(headquarter: Headquarter): void {
    const confirmationData: ConfirmationData = {
      title: this.translate.instant('delete_headquarter'),
      message: this.translate.instant('delete_headquarter_confirmation', { name: headquarter.name }),
      confirmText: this.translate.instant('delete'),
      danger: true,
    };

    const dialog = this.dialogService.open<boolean>(new PolymorpheusComponent(ConfirmationModalUiComponent), {
      data: confirmationData,
      dismissible: true,
      size: 'm',
    });

    dialog.subscribe({
      next: async (confirmed) => {
        if (confirmed) {
          await this.handleDeleteHeadquarter(headquarter);
        }
      },
      error: (error) => {
        console.error('Delete confirmation dialog error:', error);
        this.notificationService.showError('dialog_error').subscribe();
      },
    });
  }

  private async handleCreateHeadquarter(headquarterData: HeadquarterFormData): Promise<void> {
    this.isProcessing.set(true);

    const { error } = await tryCatch(() => this.headquartersFacade.createHeadquarter(headquarterData));

    if (error) {
      console.error('Failed to create headquarter:', error);
      this.notificationService.showError('headquarter_create_error').subscribe();
    } else {
      this.notificationService
        .showSuccess('headquarter_created_success', {
          translateParams: { name: headquarterData.name },
        })
        .subscribe();
      this.headquartersFacade.headquarters.reload();
    }

    this.isProcessing.set(false);
  }

  private async handleUpdateHeadquarter(id: string, headquarterData: HeadquarterFormData): Promise<void> {
    this.isProcessing.set(true);

    const { error } = await tryCatch(() => this.headquartersFacade.updateHeadquarter(id, headquarterData));

    if (error) {
      console.error('Failed to update headquarter:', error);
      this.notificationService.showError('headquarter_update_error').subscribe();
    } else {
      this.notificationService
        .showSuccess('headquarter_updated_success', {
          translateParams: { name: headquarterData.name },
        })
        .subscribe();
      this.headquartersFacade.headquarters.reload();
    }

    this.isProcessing.set(false);
  }

  private async handleDeleteHeadquarter(headquarter: Headquarter): Promise<void> {
    this.isProcessing.set(true);

    const { error } = await tryCatch(() => this.headquartersFacade.deleteHeadquarter(headquarter.id));

    if (error) {
      console.error('Failed to delete headquarter:', error);

      if (isDatabaseConstraintError(error)) {
        const constraintInfo = parseConstraintError(error);

        if (constraintInfo.type === 'foreign_key') {
          this.getRelatedDataCount(headquarter.id)
            .then((count) => {
              this.notificationService
                .showWarning('headquarter_delete_has_related_data', {
                  translateParams: {
                    name: headquarter.name,
                    count: count || 'some',
                  },
                })
                .subscribe();
            })
            .catch(() => {
              this.notificationService
                .showWarning('headquarter_delete_has_related_data', {
                  translateParams: {
                    name: headquarter.name,
                    count: 'some',
                  },
                })
                .subscribe();
            });
        } else {
          this.notificationService.showError('headquarter_delete_error').subscribe();
        }
      } else {
        this.notificationService.showError('headquarter_delete_error').subscribe();
      }
    } else {
      this.notificationService
        .showSuccess('headquarter_deleted_success', {
          translateParams: { name: headquarter.name },
        })
        .subscribe();
      this.headquartersFacade.headquarters.reload();
    }

    this.isProcessing.set(false);
  }

  private async getRelatedDataCount(headquarterId: string): Promise<number> {
    const { count: seasonsCount } = await this.supabaseService
      .getClient()
      .from('seasons')
      .select('*', { count: 'exact', head: true })
      .eq('headquarter_id', headquarterId);

    const { count: workshopsCount } = await this.supabaseService
      .getClient()
      .from('scheduled_workshops')
      .select('*', { count: 'exact', head: true })
      .eq('headquarter_id', headquarterId);

    const { count: agreementsCount } = await this.supabaseService
      .getClient()
      .from('agreements')
      .select('*', { count: 'exact', head: true })
      .eq('headquarter_id', headquarterId);

    return (seasonsCount || 0) + (workshopsCount || 0) + (agreementsCount || 0);
  }
}
