import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiDialogContext, TuiError, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@taiga-ui/polymorpheus';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  TuiButtonLoading,
  TuiChevron,
  TuiComboBox,
  TuiDataListWrapper,
  TuiFilterByInputPipe,
  TuiSkeleton,
  TuiStringifyContentPipe,
  TuiTooltip,
} from '@taiga-ui/kit';
import { AkademyEdgeFunctionsService, NotificationService } from '@zambia/data-access-generic';
import { AkRole, RoleService } from '@zambia/data-access-roles-permissions';
import { NgClass } from '@angular/common';

interface RoleChangeModalData {
  agreementId: string;
  agreementName: string;
  currentRole: {
    id: string;
    name: string;
    code: string;
    level: number;
  };
}

@Component({
  selector: 'z-role-change-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    TuiIcon,
    TuiError,
    TuiTextfield,
    TuiDataListWrapper,
    TuiTooltip,
    FormsModule,
    TuiComboBox,
    TuiChevron,
    TuiFilterByInputPipe,
    TuiSkeleton,
    TuiButton,
    TuiStringifyContentPipe,
    TuiButtonLoading,
    NgClass,
  ],
  template: `
    <div class="p-5">
      <div class="mb-6">
        <h3 class="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
          {{ 'change_role_for' | translate }}: <strong>{{ modalData.agreementName }}</strong>
        </h3>
      </div>

      <!-- Current Role Display -->
      <div class="mb-6 rounded-xl bg-blue-50 p-4 dark:bg-blue-900/20">
        <div class="flex items-center gap-3">
          <tui-icon icon="@tui.user" class="text-blue-600" size="s" />
          <div>
            <p class="text-sm font-medium text-blue-900 dark:text-blue-100">
              {{ 'current_role' | translate }}
            </p>
            <p class="text-sm text-blue-700 dark:text-blue-300">
              {{ modalData.currentRole.name }}
            </p>
          </div>
        </div>
      </div>

      <!-- Role Selection -->
      <div class="mb-6">
        <label for="roleSelect" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {{ 'new_role' | translate }} <span class="text-red-500">*</span>
        </label>

        @let roles = rolesService.rolesResource;

        @if (roles.error()) {
          <div class="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
            <div class="flex items-center gap-2">
              <tui-icon icon="@tui.alert-circle" class="text-red-600" size="xs"></tui-icon>
              <span class="text-sm text-red-700 dark:text-red-300">{{ 'generic_error' | translate }}</span>
            </div>
          </div>
        }

        <tui-textfield
          iconStart="@tui.search"
          tuiChevron
          [tuiSkeleton]="roles.isLoading() || !!roles.error()"
          tuiTextfieldSize="m"
          [stringify]="stringify"
          [tuiTextfieldCleaner]="true"
        >
          <input placeholder="Escribe o selecciona un rol" tuiComboBox [formControl]="roleControl" />

          <tui-data-list-wrapper
            *tuiTextfieldDropdown
            new
            [itemContent]="stringify | tuiStringifyContent"
            [items]="roles.value() | tuiFilterByInput"
          />

          @if (roleControl.valid) {
            <tui-icon icon="@tui.check" style="color: var(--tui-status-positive); pointer-events: none" />
          }
          <tui-icon tuiTooltip="{{ 'ifRoleNotAvailable' | translate }}" />
        </tui-textfield>

        @if (roleControl.touched && roleControl.errors?.['required']) {
          <tui-error [error]="'role_required' | translate" class="mt-1"></tui-error>
        }

        @let selected = roleControl.value;
        @if (selected && selected.level !== modalData.currentRole.level) {
          @let greaterLevel = selected.level < modalData.currentRole.level;
          @let lowerLevel = selected.level > modalData.currentRole.level;
          <div
            class="mt-2 rounded-lg p-3"
            [ngClass]="{
              'bg-amber-50 dark:bg-amber-900/20': greaterLevel,
              'bg-blue-50 dark:bg-blue-900/20': lowerLevel,
            }"
          >
            <div class="mt-1 flex items-center gap-2">
              <tui-icon
                [icon]="greaterLevel ? '@tui.circle-alert' : '@tui.arrow-up'"
                [ngClass]="{ 'text-amber-600': greaterLevel, 'text-blue-600': lowerLevel }"
                size="xs"
              ></tui-icon>
              <span
                class="text-sm"
                [ngClass]="{
                  'text-amber-700 dark:text-amber-300': greaterLevel,
                  'text-green-700 dark:text-blue-300': lowerLevel,
                }"
              >
                {{ (greaterLevel ? 'role_level_demotion_warning' : 'role_level_promotion_warning') | translate }}
              </span>
            </div>
          </div>
        }

        <div class="mt-2 flex justify-end gap-3">
          <button tuiButton appearance="secondary" size="m" type="button" (click)="cancel()">
            {{ 'cancel' | translate }}
          </button>
          <button
            tuiButton
            appearance="primary"
            size="m"
            type="button"
            [loading]="act()"
            (click)="confirmRoleChange()"
            [disabled]="!roleControl.valid || act()"
          >
            {{ act() ? 'changing_role' : ('change_role' | translate) }}
          </button>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleChangeModalSmartComponent {
  private readonly context = inject<TuiDialogContext<boolean | null, RoleChangeModalData>>(POLYMORPHEUS_CONTEXT);
  private edgeFunctions = inject(AkademyEdgeFunctionsService);
  private translate = inject(TranslateService);
  private notificationService = inject(NotificationService);
  protected rolesService = inject(RoleService);
  protected act = computed(() => this.edgeFunctions.loading());
  protected roleControl = new FormControl<AkRole | null>(null, [Validators.required]);
  protected readonly stringify = (item: AkRole): string => `${item.name}`;

  get modalData(): RoleChangeModalData {
    return this.context.data;
  }

  protected async confirmRoleChange(): Promise<void> {
    const selectedRole = this.roleControl.value as AkRole;

    const { data, error } = await this.edgeFunctions.changeRole({
      agreement_id: this.modalData.agreementId,
      new_role_id: selectedRole.id,
    });

    if (data) {
      this.notificationService
        .showSuccess(
          this.translate.instant('role_changed_successfully', {
            oldRole: this.modalData.currentRole.name,
            newRole: selectedRole.name,
          }),
          {
            translate: false,
          }
        )
        .subscribe();

      this.context.completeWith(!!data?.new_role?.id);
    }

    if (error) this.notificationService.showError('generic_error').subscribe();
  }

  protected cancel(): void {
    this.context.completeWith(null);
  }
}
