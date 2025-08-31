import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
  DestroyRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AgreementsFacadeService } from '../../services/agreements-facade.service';
import { SearchAgreementResult } from '../../types/search-agreements.types';
import { RoleService } from '@zambia/data-access-roles-permissions';
import { ExportService, NotificationService, AkademyEdgeFunctionsService } from '@zambia/data-access-generic';
import { DirectMessageService } from '@zambia/shared/data-access-notifications';
import { DirectMessageDialogV2SmartComponent } from '@zambia/feat-notifications';

import {
  ContentPageContainerComponent,
  DataCardUiComponent,
  ExportModalUiComponent,
  ExportOptions,
  injectCurrentTheme,
  WindowService,
} from '@zambia/ui-components';
import { AgreementSmartTableComponent } from './agreement-smart-table.smart-component';
import { AgreementSearchCriteria } from '../ui/agreement-search-modal.ui-component';
import {
  AgreementAdvancedSearchComponent,
  FilterOption,
  AdvancedSearchData,
} from '../ui/agreement-advanced-search.ui-component';
import { AgreementTextSearchComponent } from '../ui/agreement-text-search.ui-component';
import { RoleFilterCheckboxComponent } from '../ui/role-filter-checkbox.ui-component';
import { HeadquarterFilterCheckboxComponent } from '../ui/headquarter-filter-checkbox.ui-component';

import { TuiButton, TuiDialogService, TuiIcon, TuiLink } from '@taiga-ui/core';
import { TuiBreadcrumbs, TuiSkeleton } from '@taiga-ui/kit';
import { TuiItem } from '@taiga-ui/cdk';

import { ROLE } from '@zambia/util-roles-definitions';
import { ICONS } from '@zambia/util-constants';
import { UserCreationSuccessModalComponent } from './user-creation-success-modal.component';
import { PasswordResetModalComponent } from './password-reset-modal.component';
import { HasRoleDirective } from '@zambia/util-roles-permissions';
import { CountriesFacadeService } from '@zambia/feat-countries';

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
    ReactiveFormsModule,
    AgreementSmartTableComponent,
    AgreementTextSearchComponent,
    RoleFilterCheckboxComponent,
    HeadquarterFilterCheckboxComponent,
    TuiIcon,
    TuiButton,
    TuiSkeleton,
    TuiBreadcrumbs,
    TuiItem,
    TuiLink,
    RouterLink,
    HasRoleDirective,
    DataCardUiComponent,
    ContentPageContainerComponent,
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
              {{ 'agreements' | translate }}
            </span>
          </tui-breadcrumbs>

          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
              <div class="mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 shadow-lg sm:mx-0">
                <tui-icon [icon]="ICONS.AGREEMENTS" class="text-3xl text-white"></tui-icon>
              </div>
              <div>
                <h1 class="mb-1 text-2xl font-bold text-gray-800 sm:text-3xl dark:text-white">
                  {{ 'agreements' | translate }}
                </h1>
                <p class="text-sm text-gray-600 sm:text-base dark:text-slate-400">
                  {{ 'agreements_description' | translate }}
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
                (click)="onExportAgreements()"
                [disabled]="isProcessing() || !hasData()"
                class="w-full border-emerald-500 text-emerald-600 hover:bg-emerald-50 sm:w-auto dark:hover:bg-emerald-900/20"
              >
                {{ 'export' | translate }}
              </button>
              <button
                *zHasRole="[ROLE.SUPERADMIN]"
                tuiButton
                appearance="secondary"
                [size]="buttonSize()"
                iconStart="@tui.database"
                [attr.tuiTheme]="currentTheme()"
                (click)="onMigrateFromStrapi()"
                [disabled]="isProcessing()"
                class="w-full border-purple-500 text-purple-600 hover:bg-purple-50 sm:w-auto dark:hover:bg-purple-900/20"
              >
                {{ 'migrate_from_strapi' | translate }}
              </button>
              <button
                *zHasRole="allowedRolesForAgreementCreation()"
                tuiButton
                appearance="primary"
                [size]="buttonSize()"
                iconStart="@tui.plus"
                [attr.tuiTheme]="currentTheme()"
                (click)="onCreateAgreement()"
                [disabled]="isProcessing()"
                class="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 sm:w-auto"
              >
                {{ 'create_agreement' | translate }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistics Cards -->
      <section z-content-page-container>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          @for (stat of statsCards(); track stat.id) {
            <z-data-card [loading]="isLoading()" [stat]="stat"></z-data-card>
          }
        </div>

        <!-- Filters Section -->
        <div class="flex flex-wrap items-end gap-4 py-6">
          <!-- Text Search -->
          <div class="max-w-md flex-1">
            <z-agreement-text-search />
          </div>

          <!-- Role Filter -->
          <div>
            <z-role-filter-checkbox
              [(selectedRoles)]="selectedRoleFilters"
              (rolesChanged)="onRoleFiltersChange($event)"
            />
          </div>

          <!-- Headquarter Filter -->
          <div>
            <z-headquarter-filter-checkbox
              [(selectedHeadquarters)]="selectedHeadquarterFilters"
              (headquartersChanged)="onHeadquarterFiltersChange($event)"
            />
          </div>

          <!-- Clear All Filters -->
          @if (hasActiveFilters()) {
            <button tuiButton appearance="secondary" size="m" iconStart="@tui.filter-x" (click)="clearAllFilters()">
              {{ 'clear_filters' | translate }}
            </button>
          }
        </div>

        <!-- Agreements Table -->
        <div class="container mx-auto px-4 pb-6 sm:px-6 sm:pb-8">
          <!-- Agreements Table -->

          @if (errorMessage()) {
            <div
              class="mt-6 rounded-xl border border-red-200/50 bg-red-50 p-6 dark:border-red-800/50 dark:bg-red-900/20"
            >
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
          } @else {
            <div
              class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900"
            >
              <z-agreement-smart-table
                [agreements]="agreementsData()"
                [loading]="isLoading()"
                [emptyStateTitle]="'No agreements found'"
                [emptyStateDescription]="'There are no agreements to display.'"
                [enablePagination]="true"
                [enableFiltering]="true"
                [enableColumnVisibility]="true"
                [enableAdvancedSearch]="true"
                [pageSize]="25"
                [pageSizeOptions]="[10, 25, 50, 100]"
                (createClick)="onCreateAgreement()"
                (editClick)="onEditAgreement($event)"
                (deleteClick)="onDeleteAgreement($event)"
                (downloadClick)="onDownloadAgreement($event)"
                (advancedSearch)="onAdvancedSearchCriteria($event)"
                (createUserClick)="onCreateUserFromAgreement($event)"
                (deactivateUserClick)="onDeactivateUser($event)"
                (resetPasswordClick)="onResetPassword($event)"
                (sendMessageClick)="onSendMessage($event)"
                (deactivateAgreementClick)="onDeactivateAgreement($event)"
              />
            </div>
          }
        </div>
      </section>
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
  private countriesFacade = inject(CountriesFacadeService);
  private roleService = inject(RoleService);
  private router = inject(Router);
  private dialogs = inject(TuiDialogService);
  private exportService = inject(ExportService);
  private translate = inject(TranslateService);
  private edgeFunctions = inject(AkademyEdgeFunctionsService);
  private directMessageService = inject(DirectMessageService);
  private destroyRef = inject(DestroyRef);
  private windowService = inject(WindowService);
  private notificationService = inject(NotificationService);

  protected currentTheme = injectCurrentTheme();
  protected buttonSize = computed(() => (this.windowService.isMobile() ? 'm' : 'l'));
  protected ICONS = ICONS;
  protected ROLE = ROLE;
  protected isProcessing = signal(false);

  protected isLoading = computed(() => this.agreementsFacade.isAgreementsLoading());
  protected errorMessage = computed(() => this.agreementsFacade.loadingError());

  protected agreementsData = computed(() => this.agreementsFacade.agreements.value()?.data || []);
  protected hasData = computed(() => (this.agreementsData()?.length || 0) > 0);
  protected statsCards = computed(() => this.getStatsCards());

  protected roleFilter = new FormControl('');
  protected roleFilterValue = signal('');

  protected selectedRoleFilters = signal<string[]>([]);
  protected selectedHeadquarterFilters = signal<string[]>([]);

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

  protected roleFilterOptions = computed(() => [
    this.translate.instant('all_roles'),
    this.translate.instant('students'),
    this.translate.instant('facilitators'),
    this.translate.instant('companions'),
    this.translate.instant('managers'),
    this.translate.instant('assistants'),
    this.translate.instant('coordinators'),
    this.translate.instant('directors'),
  ]);

  private roleFilterMap: Record<string, string> = {};

  ngOnInit(): void {
    this.initializeRoleFilter();
  }

  private initializeRoleFilter(): void {
    this.roleFilterMap = {
      [this.translate.instant('all_roles')]: 'all',
      [this.translate.instant('students')]: 'student',
      [this.translate.instant('facilitators')]: 'facilitator',
      [this.translate.instant('companions')]: 'companion',
      [this.translate.instant('managers')]: 'manager',
      [this.translate.instant('assistants')]: 'assistant',
      [this.translate.instant('coordinators')]: 'coordinator',
      [this.translate.instant('directors')]: 'director',
    };

    this.roleFilter.setValue(this.translate.instant('all_roles'));
    this.roleFilterValue.set(this.translate.instant('all_roles'));

    this.roleFilter.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      this.roleFilterValue.set(value || '');
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected onPageChange = (page: number): void => {
    this.agreementsFacade.onPageChange(page);
  };

  protected onPageSizeChange = (size: number): void => {
    this.agreementsFacade.onPageSizeChange(size);
  };

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

  protected onCreateAgreement(): void {
    console.log('Create agreement modal - to be implemented');
    this.notificationService.showInfo(this.translate.instant('feature_coming_soon'));
  }

  protected async onDeactivateAgreement(agreement: SearchAgreementResult): Promise<void> {
    try {
      this.isProcessing.set(true);
      await this.agreementsFacade.deactivateAgreement(agreement.id);
      this.notificationService.showSuccess(
        this.translate.instant('agreement_deactivation_success', { name: `${agreement.name} ${agreement.last_name}` })
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

  private handleExport(agreements: SearchAgreementResult[], options: ExportOptions): void {
    const exportData = agreements.map((agreement) => ({
      name: agreement.name || '',
      lastName: agreement.last_name || '',
      email: agreement.email || '',
      role: agreement.role?.role_name || '',
      status: agreement.status || '',
      headquarter: agreement.headquarter?.headquarter_name || '',
      createdAt: agreement.created_at || '',
    }));

    const exportColumns = [
      { key: 'name', label: this.translate.instant('user_name') },
      { key: 'email', label: this.translate.instant('user_email') },
      { key: 'role', label: this.translate.instant('role') },
      { key: 'headquarter', label: this.translate.instant('headquarter_name') },
      { key: 'status', label: this.translate.instant('agreement_status') },
      { key: 'createdAt', label: this.translate.instant('agreement_start_date') },
    ];

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

  protected async onCreateUserFromAgreement(agreement: SearchAgreementResult): Promise<void> {
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
            last_name: agreement.last_name || '',
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

  protected async onDeactivateUser(agreement: SearchAgreementResult): Promise<void> {
    if (!agreement.user_id) {
      this.notificationService.showError(this.translate.instant('no_user_id_found'));
      return;
    }

    try {
      this.isProcessing.set(true);
      const response = await this.edgeFunctions.deactivateUser({ user_id: agreement.user_id });

      if (response.error) {
        this.notificationService.showError(
          this.translate.instant('user_deactivation_failed', { error: response.error })
        );
        return;
      }

      if (response.data) {
        this.notificationService.showSuccess(
          this.translate.instant('user_deactivation_success', {
            name: `${agreement.name} ${agreement.last_name || ''}`,
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

  protected async onResetPassword(agreement: SearchAgreementResult): Promise<void> {
    if (!agreement.user_id) {
      this.notificationService.showError(this.translate.instant('no_user_id_found'));
      return;
    }

    this.dialogs
      .open<{ newPassword: string } | null>(new PolymorpheusComponent(PasswordResetModalComponent), {
        dismissible: true,
        size: 'm',
        data: {
          name: agreement.name,
          lastName: agreement.last_name || '',
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

  protected async onSendMessage(agreement: SearchAgreementResult): Promise<void> {
    if (!agreement.user_id) {
      this.notificationService.showError(this.translate.instant('no_user_id_found'));
      return;
    }

    const sent = await this.directMessageService.openSendMessageDialog(
      new PolymorpheusComponent(DirectMessageDialogV2SmartComponent),
      agreement.user_id
    );

    if (sent) {
      this.notificationService.showSuccess(this.translate.instant('message_sent_success'));
    }
  }

  private async performPasswordReset(
    agreement: SearchAgreementResult,
    formData: { newPassword: string }
  ): Promise<void> {
    try {
      this.isProcessing.set(true);
      const response = await this.edgeFunctions.resetPassword({
        email: agreement.email,
        document_number: agreement.document_number || '',
        new_password: formData.newPassword,
        phone: agreement.phone || '',
        first_name: agreement.name || '',
        last_name: agreement.last_name || '',
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

  protected lastSearchCriteria = signal<AgreementSearchCriteria | null>(null);

  // Computed data for search
  protected countries = computed(() => {
    const countriesData = this.countriesFacade.countriesResource();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return countriesData?.map((c: any) => ({ id: c.id, name: c.name })) || [];
  });

  protected headquarters = computed(() => {
    const hqData = this.agreementsFacade.headquartersResource();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return hqData?.map((hq: any) => ({ id: hq.id, name: hq.name })) || [];
  });

  protected async onSearchAgreements(): Promise<void> {
    const searchData: AdvancedSearchData = {
      roles: this.getRoleOptions(),
      countries: this.countries(),
      headquarters: this.headquarters(),
      initialCriteria: this.lastSearchCriteria(),
    };

    const dialog = this.dialogs.open<AgreementSearchCriteria | null>(
      new PolymorpheusComponent(AgreementAdvancedSearchComponent),
      {
        data: searchData,
        dismissible: true,
        size: 'l',
      }
    );

    dialog.subscribe((criteria) => {
      if (criteria) {
        this.lastSearchCriteria.set(criteria);
        this.onAdvancedSearchCriteria(criteria);
      }
    });
  }

  private getRoleOptions(): FilterOption[] {
    // Get unique roles from agreements
    const roles = new Map<string, string>();
    this.agreementsData().forEach((agreement) => {
      if (agreement.role?.role_id && agreement.role?.role_name) {
        roles.set(agreement.role.role_id, agreement.role.role_name);
      }
    });

    return Array.from(roles.entries()).map(([id, name]) => ({ id, name }));
  }

  // Methods for the new refactored table
  protected onEditAgreement(agreement: SearchAgreementResult): void {
    this.router.navigate(['/dashboard/agreements', agreement.id, 'edit']);
  }

  protected onDeleteAgreement(agreement: SearchAgreementResult): void {
    // Similar to deactivate for now
    this.onDeactivateAgreement(agreement);
  }

  protected async onDownloadAgreement(agreement: SearchAgreementResult): Promise<void> {
    // Download single agreement as PDF or document
    this.notificationService.showInfo(`Download functionality coming soon for agreement: ${agreement.name}`);
  }

  protected async onAdvancedSearchCriteria(criteria: AgreementSearchCriteria): Promise<void> {
    try {
      this.isProcessing.set(true);

      // Perform the search
      const searchResult = await this.agreementsFacade.searchAgreements(criteria);

      if (searchResult.totalCount === 0) {
        this.notificationService.showWarning(
          this.translate.instant('no_results_found_for_search', {
            term: criteria.searchTerm,
          })
        );
      } else {
        this.notificationService.showSuccess(
          this.translate.instant('search_completed', {
            count: searchResult.totalCount,
            time: (searchResult.searchTime / 1000).toFixed(2),
          })
        );

        // Update the search parameters in the facade to trigger a reload
        this.agreementsFacade.search.set(criteria.searchTerm);

        // Optionally, you could also apply role filters
        if (criteria.roleFilters && criteria.roleFilters.length > 0) {
          // Apply role filter logic here
          console.log('Applying role filters:', criteria.roleFilters);
        }
      }
    } catch (error) {
      console.error('Search error:', error);
      this.notificationService.showError(this.translate.instant('search_error'));
    } finally {
      this.isProcessing.set(false);
    }
  }

  // New methods for refactored table actions

  protected onEmptyRowClick(/* agreement: SearchAgreementResult */): void {
    // Do nothing - navigation is handled by the View action only
  }

  // Filter methods
  protected hasActiveFilters = computed(() => {
    return this.selectedRoleFilters().length > 0 || this.selectedHeadquarterFilters().length > 0;
  });

  protected onRoleFiltersChange(roles: string[]): void {
    if (roles.length === 0) {
      this.agreementsFacade.updateFilters({ roleIds: [] });
    } else {
      // Convert role codes to role IDs
      const allRoles = this.agreementsFacade.roles.value() || [];
      const roleIds: string[] = [];

      for (const roleCode of roles) {
        const role = allRoles.find((r) => r.code === roleCode);
        if (role) {
          roleIds.push(role.id);
        } else {
          console.warn(`Role with code ${roleCode} not found`);
        }
      }

      this.agreementsFacade.updateFilters({ roleIds });
    }
  }

  protected onHeadquarterFiltersChange(headquarters: string[]): void {
    // Update the facade with the new headquarter filters
    this.agreementsFacade.updateFilters({ headquarterIds: headquarters });
  }

  protected clearAllFilters(): void {
    this.selectedRoleFilters.set([]);
    this.selectedHeadquarterFilters.set([]);
    this.agreementsFacade.updateFilters({
      search: null,
      headquarterIds: [],
      seasonId: null,
      status: null,
      roleIds: [],
    });
  }

  protected onAgreementSelected(agreement: SearchAgreementResult): void {
    // Navigate to the selected agreement
    this.router.navigate(['/dashboard/agreements', agreement.id]);
  }
}
