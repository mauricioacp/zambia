import { computed, inject, Injectable } from '@angular/core';
import { AuthService } from '@zambia/data-access-auth';
import {
  ROLE,
  ROLE_GROUPS,
  RoleCode,
  ROLE_GROUP,
  NAVIGATION_CONFIG,
  NAVIGATION_SECTIONS,
  getRoleName,
  NavigationItemKey,
} from '@zambia/util-roles-definitions';
import { TranslateService } from '@ngx-translate/core';

export interface NavigationItem {
  key: NavigationItemKey;
  route: string;
  icon: string;
  translationKey: string;
  text: string;
  allowedGroups?: readonly ROLE_GROUP[];
}

export interface NavigationSection {
  headerKey?: string;
  items: NavigationItem[];
}

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private auth = inject(AuthService);
  private translate = inject(TranslateService);

  userRole = computed(() => this.auth.session()?.user.user_metadata?.['role'] as RoleCode | null);
  roleLevel = computed(() => this.auth.session()?.user.user_metadata?.['role_level'] as RoleCode | null);
  roleId = computed(() => this.auth.session()?.user.user_metadata?.['role_id'] as RoleCode | null);
  hqId = computed(() => this.auth.session()?.user.user_metadata?.['hq_id'] as RoleCode | null);
  seasonId = computed(() => this.auth.session()?.user.user_metadata?.['season_id'] as RoleCode | null);
  agreementId = computed(() => this.auth.session()?.user.user_metadata?.['agreement_id'] as RoleCode | null);

  hasRole(role: RoleCode): boolean {
    return this.userRole() === role;
  }

  hasAnyRole(roles: RoleCode[]): boolean {
    return roles.includes(this.userRole() as RoleCode);
  }

  isInGroup(group: ROLE_GROUP): boolean {
    const userRole = this.userRole();
    if (!userRole) return false;
    return ROLE_GROUPS[group].includes(userRole);
  }

  isInAnyGroup(groups: ROLE_GROUP[]): boolean {
    return groups.some((group) => this.isInGroup(group));
  }

  getWelcomeText(): string {
    const role = this.userRole();
    if (!role) return '';

    const roleName = getRoleName(role);
    let welcomeText = this.translate.instant('welcome.base', { roleName });

    let suffixKey = '';
    let suffixParams: object | undefined = undefined;

    if (this.isInAnyGroup(['ADMINISTRATION', 'TOP_MANAGEMENT', 'LEADERSHIP_TEAM', 'COORDINATION_TEAM'])) {
      suffixKey = 'welcome.suffix.allOrgData';
    } else if (this.isInAnyGroup(['HEADQUARTERS_MANAGEMENT']) || this.hasRole(ROLE.MANAGER_ASSISTANT)) {
      suffixKey = 'welcome.suffix.yourHQData';
    } else if (this.isInAnyGroup(['FIELD_STAFF'])) {
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

  getNavigationItems = computed((): NavigationSection[] => {
    const role = this.userRole();
    if (!role) return [];

    return NAVIGATION_SECTIONS.map((section) => ({
      headerKey: 'headerKey' in section ? section.headerKey : undefined,
      items: section.items
        .map((itemKey) => {
          const config = NAVIGATION_CONFIG[itemKey];
          const hasAccess =
            !('allowedGroups' in config) ||
            !config.allowedGroups ||
            this.isInAnyGroup([...config.allowedGroups] as ROLE_GROUP[]);

          return hasAccess
            ? ({
                ...config,
                key: itemKey,
                text: config.translationKey,
              } as NavigationItem)
            : null;
        })
        .filter((item): item is NavigationItem => item !== null),
    })).filter((section) => section.items.length > 0);
  });
}
