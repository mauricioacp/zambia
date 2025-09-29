import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
  WritableSignal,
} from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AgreementDetails, AgreementsFacadeService } from '../../services/agreements-facade.service';
import { TuiSkeleton, TuiBreadcrumbs, TuiComment } from '@taiga-ui/kit';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TuiIcon, TuiButton, TuiLink, TuiDialogService } from '@taiga-ui/core';
import { TuiItem } from '@taiga-ui/cdk';
import { ICONS } from '@zambia/util-constants';
import { ConfirmationModalUiComponent, ConfirmationData, injectCurrentTheme } from '@zambia/ui-components';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { NotificationService, AkademyEdgeFunctionsService } from '@zambia/data-access-generic';
import { RoleService } from '@zambia/data-access-roles-permissions';
import { RoleChangeModalSmartComponent } from './role-change-modal.smart-component';

interface TableRow {
  key: string;
  value: string | number | boolean | null | undefined;
  translationKey: string;
}

@Component({
  selector: 'z-agreement-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TuiSkeleton,
    NgClass,
    TranslatePipe,
    TuiIcon,
    TuiButton,
    TuiLink,
    TuiBreadcrumbs,
    TuiItem,
    TuiComment,
  ],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-slate-800">
      @if (agreementsFacade.isDetailLoading()) {
        <!-- Loading State -->
        <div class="container mx-auto px-6 py-8">
          <div
            class="rounded-2xl border border-gray-200/50 bg-white/90 p-8 shadow-lg shadow-gray-900/5 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/90 dark:shadow-slate-900/20"
          >
            <div class="space-y-6">
              <div [tuiSkeleton]="true" class="h-8 w-1/3"></div>
              <div [tuiSkeleton]="true" class="h-12 w-2/3"></div>
              <div class="grid gap-4 md:grid-cols-2">
                <div [tuiSkeleton]="true" class="h-32"></div>
                <div [tuiSkeleton]="true" class="h-32"></div>
              </div>
            </div>
          </div>
        </div>
      } @else if (agreementData()) {
        <!-- Breadcrumb Navigation -->
        <div class="border-b border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div class="container mx-auto px-6 py-4">
            <tui-breadcrumbs>
              <a *tuiItem routerLink="/dashboard" tuiLink iconStart="@tui.house">
                {{ 'dashboard' | translate }}
              </a>
              <a *tuiItem routerLink="/dashboard/agreements" tuiLink>
                {{ 'agreements' | translate }}
              </a>
              <span *tuiItem> {{ agreementData()?.name }} {{ agreementData()?.last_name }} </span>
            </tui-breadcrumbs>
          </div>
        </div>

        <!-- Enhanced Header with Status Indicators -->

        <div class="container mx-auto px-6 py-8">
          <div tuiComment="bottom" style="background: var(--tui-background-base-alt)">
            Próximamente podrás cambiar datos de acuerdos y "desactivar" aquellos que ya no son parte de la sede
          </div>
          <div
            class="mb-8 rounded-2xl border border-gray-200/50 bg-white/90 p-8 shadow-lg shadow-gray-900/5 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/90 dark:shadow-slate-900/20"
          >
            <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <!-- User Identity & Primary Info -->
              <div class="flex items-center gap-6">
                <!-- Avatar/Initial Circle -->
                <div
                  class="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-2xl font-bold text-white shadow-lg shadow-emerald-500/25"
                >
                  {{ getInitials(agreementData()?.name, agreementData()?.last_name) }}
                </div>

                <!-- Primary Information -->
                <div>
                  <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                    {{ agreementData()?.name }} {{ agreementData()?.last_name }}
                  </h1>
                  <div class="mt-2 flex flex-wrap items-center gap-4">
                    <!-- Role Badge -->
                    <span
                      class="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                    >
                      <tui-icon [icon]="ICONS.LEADER" size="xs" />
                      {{ agreementData()?.roles?.name }}
                    </span>

                    <!-- Status Badge -->
                    <span
                      class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-sm font-medium"
                      [ngClass]="getStatusBadgeClasses(agreementData()?.status)"
                    >
                      <div class="h-2 w-2 rounded-full bg-current"></div>
                      {{ agreementData()?.status | translate }}
                    </span>

                    <!-- Location Badge -->
                    <span
                      class="inline-flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    >
                      <tui-icon [icon]="ICONS.HEADQUARTERS" size="xs" />
                      {{ agreementData()?.headquarters?.name }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->

              <div class="flex gap-3">
                <!-- Edit Agreement -->
                @if (canEditAgreement()) {
                  <button
                    tuiButton
                    appearance="secondary"
                    size="m"
                    iconStart="@tui.pencil"
                    [attr.tuiTheme]="currentTheme()"
                    (click)="onEditAgreement()"
                    class="border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    {{ 'edit_agreement' | translate }}
                  </button>
                }
                <!-- Resend credentials -->
                <button
                  tuiButton
                  appearance="outline"
                  size="m"
                  iconStart="@tui.mail"
                  [attr.tuiTheme]="currentTheme()"
                  (click)="onResendCredentials()"
                  class="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800/40"
                >
                  {{ 'resend_credentials' | translate }}
                </button>

                <!-- Activate/Deactivate -->
                <button
                  tuiButton
                  [appearance]="agreementData()?.status === 'active' ? 'destructive' : 'primary'"
                  size="m"
                  [iconStart]="getActionIcon(agreementData()?.status)"
                  [attr.tuiTheme]="currentTheme()"
                  (click)="onToggleAgreementStatus()"
                  [disabled]="isProcessing()"
                  [ngClass]="getActionButtonClasses(agreementData()?.status)"
                >
                  {{ getActionText(agreementData()?.status) | translate }}
                </button>
              </div>
            </div>
          </div>

          <!-- Information Dashboard Grid -->
          <div class="grid gap-8 lg:grid-cols-3">
            <!-- Personal Information Card -->
            <div class="lg:col-span-2">
              <div
                class="rounded-2xl border border-gray-200/50 bg-white/90 p-6 shadow-lg shadow-gray-900/5 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/90 dark:shadow-slate-900/20"
              >
                <h2 class="mb-6 flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white">
                  <tui-icon [icon]="ICONS.USERS" class="text-blue-600" size="s" />
                  {{ 'personal_information' | translate }}
                </h2>

                <div class="grid gap-6 sm:grid-cols-2">
                  @for (item of personalInformation(); track item.key) {
                    <div class="space-y-1">
                      <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {{ item.translationKey | translate }}
                      </dt>
                      <dd class="text-sm text-gray-900 dark:text-white">
                        {{ item.value || ('N/A' | translate) }}
                      </dd>
                    </div>
                  }
                </div>
              </div>
            </div>

            <!-- Quick Stats Sidebar -->
            <div class="space-y-6">
              <!-- Agreement Status Overview -->
              <div
                class="rounded-2xl border border-gray-200/50 bg-white/90 p-6 shadow-lg shadow-gray-900/5 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/90 dark:shadow-slate-900/20"
              >
                <h3 class="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                  <tui-icon [icon]="ICONS.AGREEMENTS" class="text-emerald-600" size="s" />
                  {{ 'agreement_status' | translate }}
                </h3>

                <div class="space-y-4">
                  @for (item of agreementStatusItems(); track item.key) {
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-gray-600 dark:text-gray-300">{{ item.label | translate }}</span>
                      <span
                        class="inline-flex items-center gap-1 text-sm font-medium"
                        [ngClass]="item.value ? 'text-emerald-600' : 'text-red-600'"
                      >
                        <tui-icon [icon]="item.value ? '@tui.circle-check' : '@tui.x'" size="xs" />
                        {{ (item.value ? 'yes' : 'no') | translate }}
                      </span>
                    </div>
                  }
                </div>
              </div>

              <!-- Timeline Card -->
              <div
                class="rounded-2xl border border-gray-200/50 bg-white/90 p-6 shadow-lg shadow-gray-900/5 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/90 dark:shadow-slate-900/20"
              >
                <h3 class="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                  <tui-icon icon="@tui.clock" class="text-purple-600" size="s" />
                  {{ 'timeline' | translate }}
                </h3>

                <div class="space-y-3">
                  <div class="flex items-center gap-3">
                    <div class="h-2 w-2 rounded-full bg-blue-500"></div>
                    <div>
                      <p class="text-sm font-medium text-gray-900 dark:text-white">{{ 'created' | translate }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        {{ agreementData()?.created_at | date: 'mediumDate' }}
                      </p>
                    </div>
                  </div>

                  @if (agreementData()?.seasons?.start_date) {
                    <div class="flex items-center gap-3">
                      <div class="h-2 w-2 rounded-full bg-emerald-500"></div>
                      <div>
                        <p class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ 'season_start' | translate }}
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                          {{ agreementData()?.seasons?.start_date | date: 'mediumDate' }}
                        </p>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>

          <!-- Location & Context Information -->
          <div
            class="mt-8 rounded-2xl border border-gray-200/50 bg-white/90 p-6 shadow-lg shadow-gray-900/5 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/90 dark:shadow-slate-900/20"
          >
            <h2 class="mb-6 flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white">
              <tui-icon icon="@tui.map" class="text-cyan-600" size="s" />
              {{ 'location_context' | translate }}
            </h2>

            <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <!-- Headquarter Info -->
              <div class="rounded-xl bg-cyan-50 p-4 dark:bg-cyan-900/20">
                <div class="flex items-center gap-3">
                  <tui-icon [icon]="ICONS.HEADQUARTERS" class="text-cyan-600" size="s" />
                  <div>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">{{ 'headquarter' | translate }}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-300">{{ agreementData()?.headquarters?.name }}</p>
                  </div>
                </div>
              </div>

              <!-- Country Info -->
              <div class="rounded-xl bg-blue-50 p-4 dark:bg-blue-900/20">
                <div class="flex items-center gap-3">
                  <tui-icon [icon]="ICONS.COUNTRIES" class="text-blue-600" size="s" />
                  <div>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">{{ 'country' | translate }}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-300">
                      {{ agreementData()?.headquarters?.countries?.name }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Season Info -->
              <div class="rounded-xl bg-purple-50 p-4 dark:bg-purple-900/20">
                <div class="flex items-center gap-3">
                  <tui-icon icon="@tui.calendar" class="text-purple-600" size="s" />
                  <div>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">{{ 'season' | translate }}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-300">{{ agreementData()?.seasons?.name }}</p>
                  </div>
                </div>
              </div>

              <!-- Role Info -->
              <div class="rounded-xl bg-emerald-50 p-4 dark:bg-emerald-900/20">
                <div class="flex items-center gap-3">
                  <tui-icon [icon]="ICONS.LEADER" class="text-emerald-600" size="s" />
                  <div>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">{{ 'role' | translate }}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-300">{{ agreementData()?.roles?.name }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      } @else if (agreementsFacade.detailLoadingError()) {
        <div class="container mx-auto px-6 py-8">
          <div class="rounded-xl border border-red-200/50 bg-red-50 p-6 dark:border-red-800/50 dark:bg-red-900/20">
            <div class="flex items-center gap-3">
              <tui-icon icon="@tui.alert-circle" class="text-xl text-red-600 dark:text-red-400"></tui-icon>
              <div>
                <h3 class="font-semibold text-red-800 dark:text-red-200">
                  {{ 'failed.to.load.agreement' | translate }}
                </h3>
                <p class="text-red-700 dark:text-red-300">{{ agreementsFacade.detailLoadingError() }}</p>
              </div>
            </div>
          </div>
        </div>
      } @else {
        <div class="container mx-auto px-6 py-8">
          <div class="rounded-xl border border-red-200/50 bg-red-50 p-6 dark:border-red-800/50 dark:bg-red-900/20">
            <div class="flex items-center gap-3">
              <tui-icon icon="@tui.alert-circle" class="text-xl text-red-600 dark:text-red-400"></tui-icon>
              <div>
                <h3 class="font-semibold text-red-800 dark:text-red-200">{{ 'agreement.not.found' | translate }}</h3>
                <p class="text-red-700 dark:text-red-300">{{ 'agreement.not.found' | translate }}</p>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgreementDetailSmartComponent {
  agreementsFacade = inject(AgreementsFacadeService);
  private edgeFunctions = inject(AkademyEdgeFunctionsService);
  private roleService = inject(RoleService);
  translate = inject(TranslateService);
  dialogs = inject(TuiDialogService);
  notificationService = inject(NotificationService);

  agreementId = input.required<string>();
  agreementData: WritableSignal<AgreementDetails | null> = signal(null);
  isProcessing = signal(false);

  currentTheme = injectCurrentTheme();
  ICONS = ICONS;

  canEditAgreement = computed(() => {
    const agreement = this.agreementData();
    const userLevel = this.roleService.roleLevel();

    if (!agreement || !userLevel) return false;

    const agreementRoleLevel = agreement.roles?.level || 0;
    return userLevel > agreementRoleLevel;
  });

  constructor() {
    effect(() => {
      this.agreementsFacade.agreementId.set(this.agreementId());
    });

    effect(() => {
      this.agreementData.set(this.agreementsFacade.agreementByIdResource());
    });
  }

  maskDni = (dni: string): string => (dni.length < 4 ? dni : `****${dni.slice(4)}`);

  personalInformation = computed<TableRow[]>(() => {
    const data = this.agreementData();
    if (!data) return [];

    return [
      { key: 'email', value: data.email, translationKey: 'email' },
      { key: 'phone', value: data.phone, translationKey: 'phone' },
      { key: 'document_number', value: this.maskDni(data.document_number || ''), translationKey: 'document.number' },
      { key: 'birth_date', value: data.birth_date, translationKey: 'birth.date' },
      { key: 'gender', value: data.gender, translationKey: 'gender' },
      { key: 'address', value: data.address, translationKey: 'address' },
    ];
  });

  agreementInformation = computed<TableRow[]>(() => {
    const data = this.agreementData();
    if (!data) return [];

    return [
      { key: 'ethical_document_agreement', value: data.ethical_document_agreement, translationKey: 'ethical.document' },
      { key: 'mailing_agreement', value: data.mailing_agreement, translationKey: 'mailing.agreement' },
      { key: 'volunteering_agreement', value: data.volunteering_agreement, translationKey: 'volunteering.agreement' },
      { key: 'age_verification', value: data.age_verification, translationKey: 'age.verification' },
      { key: 'created_at', value: data.created_at, translationKey: 'created.at' },
    ];
  });

  getInitials(firstName: string | undefined, lastName: string | undefined): string {
    if (!firstName || !lastName) return '??';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  }

  getStatusBadgeClasses(status: string | undefined): string {
    switch (status) {
      case 'active':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300';
      case 'graduated':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'inactive':
        return 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-50 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
    }
  }

  getActionButtonClasses(status: string | undefined): string {
    const isActive = status === 'active';
    return isActive
      ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-800'
      : 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 dark:bg-emerald-700 dark:hover:bg-emerald-800';
  }

  getActionIcon(status: string | undefined): string {
    return status === 'active' ? '@tui.pause' : '@tui.play';
  }

  getActionText(status: string | undefined): string {
    return status === 'active' ? 'deactivate_agreement' : 'activate_agreement';
  }

  agreementStatusItems = computed(() => {
    const data = this.agreementData();
    if (!data) return [];

    return [
      { key: 'ethical_document', label: 'ethical_document_agreement', value: data.ethical_document_agreement },
      { key: 'mailing', label: 'mailing_agreement', value: data.mailing_agreement },
      { key: 'volunteering', label: 'volunteering_agreement', value: data.volunteering_agreement },
      { key: 'age_verification', label: 'age_verification', value: data.age_verification },
    ];
  });

  onEditAgreement(): void {
    const agreement = this.agreementData();
    if (!agreement) return;

    const dialogRef = this.dialogs.open<boolean>(new PolymorpheusComponent(RoleChangeModalSmartComponent), {
      data: {
        agreementId: agreement.id,
        agreementName: `${agreement.name} ${agreement.last_name}`,
        currentRole: {
          id: agreement.role_id,
          name: agreement.roles?.name || 'Unknown',
          code: agreement.roles?.code || 'unknown',
          level: agreement.roles?.level || 0,
        },
      },
      size: 'm',
      closeable: true,
      dismissible: false,
    });

    dialogRef.subscribe((result) => {
      if (result) {
        this.agreementsFacade.agreementById.reload();
      }
    });
  }

  async onResendCredentials(): Promise<void> {
    const agreement = this.agreementData();
    if (!agreement) return;

    const confirmed = await this.showConfirmationModal('resend_credentials_confirmation', {
      name: `${agreement.name} ${agreement.last_name}`,
      email: agreement.email,
    });

    if (confirmed) {
      try {
        this.isProcessing.set(true);

        const response = await this.edgeFunctions.resendCredentials(agreement.id);

        if (response.error) {
          this.notificationService
            .showError(this.translate.instant('resend_credentials_failed', { error: response.error }))
            .subscribe();
        } else {
          this.notificationService.showSuccess(this.translate.instant('resend_credentials_success')).subscribe();
        }
      } catch (error) {
        console.error('Failed to resend credentials:', error);
        this.notificationService
          .showError(this.translate.instant('resend_credentials_failed', { error: 'Unexpected error occurred' }))
          .subscribe();
      } finally {
        this.isProcessing.set(false);
      }
    }
  }

  async onToggleAgreementStatus(): Promise<void> {
    const agreement = this.agreementData();
    if (!agreement) return;

    const isCurrentlyActive = agreement.status === 'active';
    const action = isCurrentlyActive ? 'deactivate' : 'activate';

    const confirmed = await this.showConfirmationModal(`${action}_agreement_confirmation`, {
      name: `${agreement.name} ${agreement.last_name}`,
    });

    if (confirmed) {
      try {
        this.isProcessing.set(true);
        if (!isCurrentlyActive) {
          const response = await this.edgeFunctions.createUser({ agreement_id: agreement.id });

          if (response.error) {
            this.notificationService
              .showError(this.translate.instant('user_creation_failed', { error: response.error }))
              .subscribe();
          }
        } else {
          this.notificationService.showError('Próximamente').subscribe();
          this.isProcessing.set(false);
          return;
        }
        this.agreementsFacade.agreementById.reload();
      } catch (error) {
        console.error(`Failed to ${action} agreement:`, error);
      } finally {
        this.isProcessing.set(false);
      }
    }
  }

  private async showConfirmationModal(messageKey: string, params: Record<string, string>): Promise<boolean> {
    return new Promise((resolve) => {
      const dialogRef = this.dialogs.open<boolean>(new PolymorpheusComponent(ConfirmationModalUiComponent), {
        data: {
          title: this.translate.instant('confirm'),
          message: this.translate.instant(messageKey, params),
          confirmText: this.translate.instant('confirm'),
          cancelText: this.translate.instant('cancel'),
        } as ConfirmationData,
        size: 'm',
      });

      dialogRef.subscribe((result) => {
        resolve(result);
      });
    });
  }

  locationInformation = computed<TableRow[]>(() => {
    const data = this.agreementData();
    if (!data) return [];

    return [
      { key: 'headquarter', value: data.headquarters?.name, translationKey: 'headquarter' },
      { key: 'country', value: data.headquarters?.countries?.name, translationKey: 'country' },
      { key: 'role', value: data.roles?.name, translationKey: 'role' },
      { key: 'season', value: data.seasons?.name, translationKey: 'season' },
    ];
  });
}
