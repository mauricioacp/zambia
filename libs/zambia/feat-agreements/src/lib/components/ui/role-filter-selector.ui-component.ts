import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiButton } from '@taiga-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { ROLE, ROLE_GROUPS, ROLES_NAMES, RoleCode, ROLE_GROUP } from '@zambia/util-roles-definitions';

export interface RoleOption {
  value: RoleCode | 'all';
  label: string;
  group?: ROLE_GROUP;
}

@Component({
  selector: 'z-role-filter-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, TuiButton],
  template: `
    <div class="role-filter-selector">
      <label for="role-select" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {{ 'filter_by_role' | translate }}
      </label>

      <select
        id="role-select"
        [(ngModel)]="selectedRole"
        class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:border-sky-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
      >
        <option value="all">{{ 'all_roles' | translate }}</option>
        @for (role of roleOptions(); track role.value) {
          <option [value]="role.value">{{ role.name }}</option>
        }
      </select>

      @if (showClearButton()) {
        <button tuiButton appearance="secondary" size="xs" iconStart="@tui.x" class="mt-2" (click)="clearSelection()">
          {{ 'clear_filter' | translate }}
        </button>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .role-filter-selector {
        position: relative;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleFilterSelectorComponent {
  // Two-way binding for selected role
  selectedRole = model<RoleCode | 'all'>('all');

  // Output for role changes
  roleChanged = output<RoleCode | 'all'>();

  // Computed value for role options
  protected roleOptions = computed(() => {
    return Object.values(ROLE).map((roleCode) => ({
      value: roleCode,
      name: ROLES_NAMES.get(roleCode) || roleCode,
    }));
  });

  // Computed value for selected role label
  protected selectedRoleLabel = computed(() => {
    const selected = this.selectedRole();
    if (selected === 'all') {
      return 'all_roles';
    }
    return ROLES_NAMES.get(selected) || selected;
  });

  // Show clear button when a specific role is selected
  protected showClearButton = computed(() => this.selectedRole() !== 'all');

  constructor() {
    // Emit changes when model changes
    effect(() => {
      const role = this.selectedRole();
      this.roleChanged.emit(role);
    });
  }

  protected clearSelection(): void {
    this.selectedRole.set('all');
  }

  protected getRoleLabel = (value: RoleCode | 'all'): string => {
    if (value === 'all') {
      return 'All Roles';
    }
    return ROLES_NAMES.get(value) || value;
  };

  protected getRoleGroup(value: RoleCode | 'all'): ROLE_GROUP | undefined {
    if (value === 'all') {
      return undefined;
    }
    return this.findRoleGroup(value);
  }

  private findRoleGroup(roleCode: RoleCode): ROLE_GROUP | undefined {
    for (const [groupName, roleIds] of Object.entries(ROLE_GROUPS)) {
      if (roleIds.includes(roleCode)) {
        return groupName as ROLE_GROUP;
      }
    }
    return undefined;
  }
}
