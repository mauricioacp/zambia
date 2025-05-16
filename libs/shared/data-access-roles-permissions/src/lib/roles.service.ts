import { computed, inject, Injectable } from '@angular/core';
import { AuthService } from '@zambia/data-access-auth';
import { filterRoleGroups, getRoleName, ROLE, ROLE_GROUPS, RoleCode } from '@zambia/util-roles-definitions';
import { TranslateService } from '@ngx-translate/core';
import { ICONS } from '@zambia/ui-components';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private authService = inject(AuthService);
  private translate = inject(TranslateService);
  userRole = computed(() => this.authService.session()?.user.user_metadata['role']);

  public hasRole(role: RoleCode): boolean {
    return this.userRole() === role;
  }

  getWelcomeText() {
    const role = this.userRole() as unknown as RoleCode;
    const roleName = getRoleName(role);

    let welcomeText = this.translate.instant('welcome.base', { roleName });

    let suffixKey = '';
    let suffixParams: object | undefined = undefined;

    if (
      this.hasAnyRole([
        ...ROLE_GROUPS.ADMINISTRATION,
        ...ROLE_GROUPS.TOP_MANAGEMENT,
        ...ROLE_GROUPS.LEADERSHIP_TEAM,
        ...ROLE_GROUPS.COORDINATION_TEAM,
      ])
    ) {
      suffixKey = 'welcome.suffix.allOrgData';
    } else if (this.hasAnyRole([...ROLE_GROUPS.HEADQUARTERS_MANAGEMENT, ROLE.MANAGER_ASSISTANT])) {
      suffixKey = 'welcome.suffix.yourHQData';
    } else if (this.hasAnyRole([...ROLE_GROUPS.FIELD_STAFF])) {
      suffixKey = 'welcome.suffix.ownDataAndActivity';
      let activityTypeKey = 'welcome.activityType.accompanimentSessions';
      if (role === ROLE.FACILITATOR) {
        activityTypeKey = 'welcome.activityType.workshops';
      }
      suffixParams = { activityType: this.translate.instant(activityTypeKey) };
    } else if (this.hasRole(ROLE.STUDENT)) {
      suffixKey = 'welcome.suffix.student';
    }

    if (suffixKey) {
      welcomeText += this.translate.instant(suffixKey, suffixParams);
    }

    return welcomeText;
  }

  hasAnyRole(roles: string[]) {
    return roles.some((role) => this.hasRole(role as RoleCode));
  }

  allowedNavigationsByRole() {
    return [
      {
        items: [{ icon: ICONS.NEWSPAPER, text: 'main_panel', route: '' }],
      },
      {
        header: 'members',
        roles: [...Object.values(filterRoleGroups('STUDENTS')).flat()],
        items: [
          {
            icon: ICONS.USER_ROUND_CHECK,
            text: 'board',
            route: 'board',
            roles: [
              ...ROLE_GROUPS.ADMINISTRATION,
              ...ROLE_GROUPS.TOP_MANAGEMENT,
              ...ROLE_GROUPS.LEADERSHIP_TEAM,
              ...ROLE_GROUPS.COORDINATION_TEAM,
            ],
          },
          {
            icon: ICONS.CIRCLE_USER_ROUND,
            text: 'students',
            route: 'students',
            roles: [...Object.values(filterRoleGroups('STUDENTS')).flat()],
          },
          {
            icon: ICONS.USER_ROUND,
            text: 'facilitators',
            route: 'facilitators',
            roles: [...Object.values(filterRoleGroups('STUDENTS')).flat()],
          },
          {
            icon: ICONS.USERS,
            text: 'Acompañantes',
            route: 'companions',
            roles: [...Object.values(filterRoleGroups('STUDENTS')).flat()],
          },
        ],
      },
      {
        header: 'reports',
        items: [
          {
            icon: ICONS.CHART_AREA,
            text: 'reports',
            route: 'reports',
            roles: [
              ...ROLE_GROUPS.ADMINISTRATION,
              ...ROLE_GROUPS.TOP_MANAGEMENT,
              ...ROLE_GROUPS.LEADERSHIP_TEAM,
              ...ROLE_GROUPS.COORDINATION_TEAM,
              ...ROLE_GROUPS.HEADQUARTERS_MANAGEMENT,
            ],
          },
        ],
      },
      {
        header: 'my_akademy',
        items: [
          {
            icon: ICONS.PAPERCLIP,
            text: 'documents',
            route: 'documents',
            roles: [...Object.values(ROLE_GROUPS).flat()],
          },
        ],
      },
    ];
  }
}
