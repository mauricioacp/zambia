import { computed, inject, Injectable, resource } from '@angular/core';
import { UserMetadataService } from '@zambia/data-access-auth';
import {
  ROLE,
  ROLE_GROUPS,
  RoleCode,
  ROLE_GROUP,
  getRoleName,
  NAVIGATION_SECTIONS,
  NavigationSection,
} from '@zambia/util-roles-definitions';
import { TranslateService } from '@ngx-translate/core';
import { Database } from '@zambia/types-supabase';
import { SupabaseService } from '@zambia/data-access-supabase';

export type AkRole = Database['public']['Tables']['roles']['Row'];

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private userMetadataService = inject(UserMetadataService);
  private translate = inject(TranslateService);
  private supabaseService = inject(SupabaseService);

  userRole = computed(() => this.userMetadataService.userMetadata().role as RoleCode | null);
  roleLevel = computed(() => this.userMetadataService.userMetadata().roleLevel);

  rolesResource = resource({
    params: () => this.roleLevel() ?? 0,
    loader: async () => {
      const userLevel = this.roleLevel() ?? 0;

      const { data, error } = await this.supabaseService
        .getClient()
        .from('roles')
        .select('id, name, code, level, status')
        .eq('status', 'active')
        .lt('level', userLevel)
        .order('level', { ascending: true });

      if (error) throw error;
      return (data ?? []) as AkRole[];
    },
    defaultValue: [],
  });

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
      ...section,
      items: section.items.filter((item) => {
        if (!item.allowedGroups || item.allowedGroups.length === 0) {
          return true;
        }

        return this.isInAnyGroup([...item.allowedGroups] as ROLE_GROUP[]);
      }),
    })).filter((section) => section.items.length > 0);
  });
}
