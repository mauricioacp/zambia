import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@taiga-ui/polymorpheus';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TuiButton, TuiError, TuiIcon, TuiLoader, TuiDataList, TuiTextfield } from '@taiga-ui/core';
import { TuiDataListWrapper } from '@taiga-ui/kit';
import { SupabaseService } from '@zambia/data-access-supabase';
import { AkademyEdgeFunctionsService, NotificationService } from '@zambia/data-access-generic';
import { RoleService } from '@zambia/data-access-roles-permissions';
import { Database } from '@zambia/types-supabase';

type Role = Database['public']['Tables']['roles']['Row'];

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
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    TuiButton,
    TuiIcon,
    TuiLoader,
    TuiError,
    TuiTextfield,
    TuiDataList,
    TuiDataListWrapper,
  ],
  template: `
    <div class="p-6">
      <div class="mb-6">
        <h3 class="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
          {{ 'change_role' | translate }}
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{ 'change_role_for' | translate }}: <strong>{{ modalData.agreementName }}</strong>
        </p>
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
              <span class="text-xs">({{ 'level' | translate }}: {{ modalData.currentRole.level }})</span>
            </p>
          </div>
        </div>
      </div>

      <!-- Role Selection -->
      <div class="mb-6">
        <label for="roleSelect" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {{ 'select_new_role' | translate }} <span class="text-red-500">*</span>
        </label>

        @if (isLoadingRoles()) {
          <div class="flex items-center justify-center rounded-lg border border-gray-300 p-4">
            <tui-loader size="m"></tui-loader>
            <span class="ml-2 text-sm text-gray-600">{{ 'loading_roles' | translate }}</span>
          </div>
        } @else if (rolesError()) {
          <div class="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
            <div class="flex items-center gap-2">
              <tui-icon icon="@tui.alert-circle" class="text-red-600" size="xs"></tui-icon>
              <span class="text-sm text-red-700 dark:text-red-300">{{ rolesError() }}</span>
            </div>
          </div>
        } @else {
          <div class="relative">
            <button
              type="button"
              class="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-slate-800 dark:text-white"
              (click)="toggleDropdown()"
            >
              @if (selectedRole()) {
                <span>{{ stringifyRole(selectedRole()) }}</span>
              } @else {
                <span class="text-gray-500">{{ 'select_role_placeholder' | translate }}</span>
              }
              <tui-icon
                icon="@tui.chevron-down"
                size="xs"
                [style.transform]="showDropdown() ? 'rotate(180deg)' : 'none'"
              ></tui-icon>
            </button>

            @if (showDropdown()) {
              <div
                class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-slate-800"
              >
                <tui-data-list>
                  @for (role of availableRoles(); track role.id) {
                    <button
                      tuiOption
                      type="button"
                      (click)="selectRole(role)"
                      class="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-slate-700"
                    >
                      <span>{{ roleItemContent(role) }}</span>
                    </button>
                  }
                </tui-data-list>
              </div>
            }
          </div>

          @if (roleControl.touched && roleControl.errors?.['required']) {
            <tui-error [error]="'role_required' | translate" class="mt-1"></tui-error>
          }
        }

        <!-- Role Level Warning -->
        @if (selectedRole() && selectedRole()!.level > modalData.currentRole.level) {
          <div class="mt-2 rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
            <div class="flex items-center gap-2">
              <tui-icon icon="@tui.alert-triangle" class="text-amber-600" size="xs"></tui-icon>
              <span class="text-sm text-amber-700 dark:text-amber-300">
                {{ 'role_level_promotion_warning' | translate }}
              </span>
            </div>
          </div>
        }
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end gap-3">
        <button tuiButton appearance="secondary" size="m" type="button" (click)="cancel()">
          {{ 'cancel' | translate }}
        </button>
        <button
          tuiButton
          appearance="primary"
          size="m"
          type="button"
          (click)="confirmRoleChange()"
          [disabled]="!roleControl.valid || isProcessing() || selectedRole()?.id === modalData.currentRole.id"
        >
          @if (isProcessing()) {
            <tui-icon icon="@tui.loader" class="animate-spin"></tui-icon>
            {{ 'changing_role' | translate }}...
          } @else {
            {{ 'change_role' | translate }}
          }
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        min-width: 400px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleChangeModalSmartComponent {
  private readonly context = inject<TuiDialogContext<boolean | null, RoleChangeModalData>>(POLYMORPHEUS_CONTEXT);
  private supabaseService = inject(SupabaseService);
  private edgeFunctions = inject(AkademyEdgeFunctionsService);
  private roleService = inject(RoleService);
  private translate = inject(TranslateService);
  private notificationService = inject(NotificationService);

  protected roleControl = new FormControl<Role | null>(null, [Validators.required]);

  protected isLoadingRoles = signal(false);
  protected rolesError = signal<string | null>(null);
  protected allRoles = signal<Role[]>([]);
  protected isProcessing = signal(false);
  protected showDropdown = signal(false);

  protected selectedRole = signal<Role | null>(null);

  constructor() {
    this.loadRoles();

    // Watch role control changes
    this.roleControl.valueChanges.subscribe((role) => {
      this.selectedRole.set(role);
    });
  }

  get modalData(): RoleChangeModalData {
    return this.context.data;
  }

  // Get roles that user can assign (at or below their level)
  protected availableRoles = computed(() => {
    const userLevel = this.roleService.roleLevel();
    const currentUserLevel = userLevel || 0;

    return this.allRoles().filter(
      (role) => role.level <= currentUserLevel && role.id !== this.modalData.currentRole.id && role.status === 'active'
    );
  });

  protected stringifyRole = (role: Role | null): string => {
    return role ? `${role.name} (Level ${role.level})` : '';
  };

  protected roleItemContent = (role: Role): string => {
    return `${role.name} (Level ${role.level})`;
  };

  protected toggleDropdown(): void {
    this.showDropdown.set(!this.showDropdown());
  }

  protected selectRole(role: Role): void {
    this.selectedRole.set(role);
    this.roleControl.setValue(role);
    this.roleControl.markAsTouched();
    this.showDropdown.set(false);
  }

  private async loadRoles(): Promise<void> {
    this.isLoadingRoles.set(true);
    this.rolesError.set(null);

    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('roles')
        .select('id, name, code, level, status')
        .eq('status', 'active')
        .order('level', { ascending: true });

      if (error) {
        console.error('Error fetching roles:', error);
        this.rolesError.set(this.translate.instant('failed_to_load_roles'));
        return;
      }

      this.allRoles.set(data as Role[]);
    } catch (error) {
      console.error('Unexpected error loading roles:', error);
      this.rolesError.set(this.translate.instant('unexpected_error'));
    } finally {
      this.isLoadingRoles.set(false);
    }
  }

  protected async confirmRoleChange(): Promise<void> {
    const selectedRole = this.selectedRole();
    if (!selectedRole || this.isProcessing()) {
      return;
    }

    this.isProcessing.set(true);

    try {
      const response = await this.edgeFunctions.changeRole({
        agreement_id: this.modalData.agreementId,
        new_role_id: selectedRole.id,
      });

      if (response.error) {
        this.notificationService.showError(this.translate.instant('role_change_failed', { error: response.error }));
        return;
      }

      this.notificationService.showSuccess(
        this.translate.instant('role_changed_successfully', {
          oldRole: this.modalData.currentRole.name,
          newRole: selectedRole.name,
        })
      );

      this.context.completeWith(true);
    } catch (error) {
      console.error('Failed to change role:', error);
      this.notificationService.showError(this.translate.instant('role_change_unexpected_error'));
    } finally {
      this.isProcessing.set(false);
    }
  }

  protected cancel(): void {
    this.context.completeWith(null);
  }
}
