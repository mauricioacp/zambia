import { ChangeDetectionStrategy, Component, computed, effect, model, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiButton, TuiDropdown, TuiDataList } from '@taiga-ui/core';
import { TuiBadge } from '@taiga-ui/kit';
import { TranslateModule } from '@ngx-translate/core';
import { ROLE_GROUPS, ROLES_NAMES, RoleCode, FILTER_ROLE_GROUP_WILL_DELETE_THIS } from '@zambia/util-roles-definitions';

@Component({
  selector: 'z-role-filter-checkbox',
  standalone: true,
  imports: [FormsModule, TranslateModule, TuiButton, TuiDropdown, TuiDataList, TuiBadge],
  template: `
    <div class="relative">
      <button
        tuiButton
        appearance="secondary"
        size="m"
        iconStart="@tui.users"
        [tuiDropdown]="dropdown"
        [tuiDropdownOpen]="dropdownOpen()"
        (tuiDropdownOpenChange)="dropdownOpen.set($event)"
      >
        {{ 'role_filter' | translate }}
        @if (selectedCount() > 0) {
          <tui-badge class="ml-2" size="s" status="info">
            {{ selectedCount() }}
          </tui-badge>
        }
      </button>

      <ng-template #dropdown>
        <tui-data-list>
          <div class="p-4" (click)="$event.stopPropagation()" role="none">
            <div class="mb-3 flex items-center justify-between">
              <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {{ 'filter_by_roles' | translate }}
              </h4>
              @if (selectedCount() > 0) {
                <button tuiButton appearance="flat" size="xs" (click)="clearAll()">
                  {{ 'clear_all' | translate }}
                </button>
              }
            </div>

            <div class="max-h-80 overflow-y-auto">
              @for (group of roleGroups(); track group.name) {
                <div class="mb-3">
                  <div class="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                    {{ group.name }}
                  </div>
                  @for (role of group.roles; track role.code) {
                    <div
                      class="flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-gray-50 dark:hover:bg-slate-700"
                    >
                      <input
                        type="checkbox"
                        [id]="'role-' + role.code"
                        class="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                        [checked]="isRoleSelected(role.code)"
                        (change)="toggleRole(role.code)"
                      />
                      <label [for]="'role-' + role.code" class="cursor-pointer text-sm">{{ role.name }}</label>
                    </div>
                  }
                </div>
              }
            </div>

            <div class="mt-3 flex justify-end gap-2 border-t border-gray-200 pt-3 dark:border-slate-700">
              <button tuiButton appearance="secondary" size="s" (click)="dropdownOpen.set(false)">
                {{ 'close' | translate }}
              </button>
              <button tuiButton appearance="primary" size="s" (click)="applyFilters()">
                {{ 'apply_filters' | translate }}
              </button>
            </div>
          </div>
        </tui-data-list>
      </ng-template>
    </div>
  `,
  styles: [
    `
      :host {
        display: inline-block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleFilterCheckboxComponent {
  // Two-way binding for selected roles
  selectedRoles = model<RoleCode[]>([]);

  // Output for role changes
  rolesChanged = output<RoleCode[]>();

  // Dropdown state
  dropdownOpen = signal(false);

  // Computed values
  selectedCount = computed(() => this.selectedRoles().length);

  // Group roles by their category
  roleGroups = computed(() => {
    const groups: Array<{ name: string; roles: Array<{ code: RoleCode; name: string }> }> = [];

    for (const [groupName, roleIds] of Object.entries(FILTER_ROLE_GROUP_WILL_DELETE_THIS)) {
      const roles = roleIds.map((roleCode) => ({
        code: roleCode,
        name: ROLES_NAMES.get(roleCode) || roleCode,
      }));

      groups.push({
        name: groupName.replace(/_/g, ' '),
        roles,
      });
    }

    return groups;
  });

  constructor() {
    // Emit changes when model changes
    effect(() => {
      const roles = this.selectedRoles();
      this.rolesChanged.emit(roles);
    });
  }

  isRoleSelected(roleCode: RoleCode): boolean {
    return this.selectedRoles().includes(roleCode);
  }

  toggleRole(roleCode: RoleCode): void {
    const currentRoles = [...this.selectedRoles()];
    const index = currentRoles.indexOf(roleCode);

    if (index > -1) {
      currentRoles.splice(index, 1);
    } else {
      currentRoles.push(roleCode);
    }

    this.selectedRoles.set(currentRoles);
  }

  clearAll(): void {
    this.selectedRoles.set([]);
  }

  applyFilters(): void {
    this.dropdownOpen.set(false);
    // The effect will automatically emit the changes
  }
}
