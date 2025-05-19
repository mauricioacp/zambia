import { computed, inject, Injectable } from '@angular/core';
import { AuthService } from '@zambia/data-access-auth';
import { getRoleName, ROLE, ROLE_GROUPS, RoleCode, RolesAccessService } from '@zambia/util-roles-definitions';
import { TranslateService } from '@ngx-translate/core';
import { ICONS } from '@zambia/util-constants';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private authService = inject(AuthService);
  private translate = inject(TranslateService);
  private roleAccess = inject(RolesAccessService);

  userRole = computed(() => this.authService.session()?.user.user_metadata['role']);

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

  hasRole(role: string) {
    return this.roleAccess.hasRole(role);
  }

  hasAnyRole(roles: string[]) {
    return this.roleAccess.hasAnyRole(roles);
  }

  allowedNavigationsByRole() {
    const baseNavigation = this.roleAccess.getNavigationForRole(this.userRole());
    return this.addIconsToNavigation(baseNavigation);
  }

  private addIconsToNavigation(navigation: any[]): any[] {
    const enrichedNavigation = JSON.parse(JSON.stringify(navigation));

    const iconMapping: Record<string, string> = {
      main_panel: ICONS.NEWSPAPER,
      board: ICONS.USER_ROUND_CHECK,
      students: ICONS.CIRCLE_USER_ROUND,
      facilitators: ICONS.USER_ROUND,
      companions: ICONS.USERS,
      reports: ICONS.CHART_AREA,
      documents: ICONS.PAPERCLIP,
      countries: ICONS.COUNTRIES,
      headquarters: ICONS.HEADQUARTERS,
      workshops: ICONS.BOOK,
      agreements: ICONS.PAPERCLIP,
    };

    for (const section of enrichedNavigation) {
      if (section.items) {
        for (const item of section.items) {
          if (item.text && iconMapping[item.text]) {
            item.icon = iconMapping[item.text];
          } else if (item.route && iconMapping[item.route]) {
            item.icon = iconMapping[item.route];
          }
        }
      }
    }

    return enrichedNavigation;
  }
}
