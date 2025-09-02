import { ROLE_GROUP } from './ROLES_CONSTANTS';

export interface NavigationItem {
  key: string;
  route: string;
  icon: string;
  translationKey: string;
  allowedGroups?: readonly ROLE_GROUP[];
  section?: 'main' | 'management' | 'analytics';
}

export interface NavigationSection {
  section: 'main' | 'management' | 'analytics';
  headerKey?: string;
  items: NavigationItem[];
}

export const NAVIGATION_ITEMS: readonly NavigationItem[] = [
  // Main section - available to all authenticated users
  {
    key: 'homepage',
    route: '/dashboard/homepage',
    icon: 'home',
    translationKey: 'nav.homepage',
    section: 'main',
  },
  {
    key: 'countries',
    route: '/dashboard/countries',
    icon: 'globe',
    translationKey: 'nav.countries',
    section: 'management',
    allowedGroups: ['ADMINISTRATION', 'TOP_MANAGEMENT', 'LEADERSHIP_TEAM', 'COORDINATION_TEAM'],
  },
  {
    key: 'headquarters',
    route: '/dashboard/headquarters',
    icon: 'building',
    translationKey: 'nav.headquarters',
    section: 'management',
    allowedGroups: ['ADMINISTRATION', 'TOP_MANAGEMENT', 'LEADERSHIP_TEAM', 'COORDINATION_TEAM'],
  },
  {
    key: 'agreements',
    route: '/dashboard/agreements',
    icon: 'handshake',
    translationKey: 'nav.agreements',
    section: 'management',
    allowedGroups: [
      'ADMINISTRATION',
      'TOP_MANAGEMENT',
      'LEADERSHIP_TEAM',
      'COORDINATION_TEAM',
      'HEADQUARTERS_MANAGEMENT',
    ],
  },
  // {
  //   key: 'home',
  //   route: '/dashboard/home',
  //   icon: 'layout-dashboard',
  //   translationKey: 'nav.home',
  //   section: 'main'
  // },
  // {
  //   key: 'panel',
  //   route: '/dashboard/panel',
  //   icon: 'newspaper',
  //   translationKey: 'nav.main_panel',
  //   section: 'main',
  //   allowedGroups: ['ADMINISTRATION', 'TOP_MANAGEMENT', 'LEADERSHIP_TEAM']
  // },

  // Management section - restricted access

  // {
  //   key: 'workshops',
  //   route: '/dashboard/workshops',
  //   icon: 'graduation-cap',
  //   translationKey: 'nav.workshops',
  //   section: 'management',
  //   allowedGroups: ['ADMINISTRATION', 'TOP_MANAGEMENT', 'LEADERSHIP_TEAM', 'HEADQUARTERS_MANAGEMENT']
  // },
  // {
  //   key: 'students',
  //   route: '/dashboard/students',
  //   icon: 'users',
  //   translationKey: 'nav.students',
  //   section: 'management',
  //   allowedGroups: ['ADMINISTRATION', 'TOP_MANAGEMENT', 'LEADERSHIP_TEAM']
  // },
  // {
  //   key: 'collaborators',
  //   route: '/dashboard/collaborators',
  //   icon: 'user-check',
  //   translationKey: 'nav.collaborators',
  //   section: 'management',
  //   allowedGroups: ['ADMINISTRATION', 'TOP_MANAGEMENT', 'LEADERSHIP_TEAM']
  // },

  // Analytics section
  // {
  //   key: 'organizational-health',
  //   route: '/dashboard/organizational-health',
  //   icon: 'activity',
  //   translationKey: 'nav.organizational_health',
  //   section: 'analytics',
  //   allowedGroups: ['ADMINISTRATION', 'TOP_MANAGEMENT', 'LEADERSHIP_TEAM']
  // }
] as const;

/**
 * Navigation sections configuration
 */
export const NAVIGATION_SECTIONS: readonly NavigationSection[] = [
  {
    section: 'main',
    items: NAVIGATION_ITEMS.filter((item) => item.section === 'main'),
  },
  {
    section: 'management',
    headerKey: 'nav.management',
    items: NAVIGATION_ITEMS.filter((item) => item.section === 'management'),
  },
  {
    section: 'analytics',
    headerKey: 'nav.analytics',
    items: NAVIGATION_ITEMS.filter((item) => item.section === 'analytics'),
  },
] as const;

/**
 * Helper function to get navigation item by key
 */
export function getNavigationItem(key: string): NavigationItem | undefined {
  return NAVIGATION_ITEMS.find((item) => item.key === key);
}

/**
 * Helper function to get all navigation items for a specific section
 */
export function getNavigationItemsBySection(section: 'main' | 'management' | 'analytics'): NavigationItem[] {
  return NAVIGATION_ITEMS.filter((item) => item.section === section);
}

export type NavigationItemKey = (typeof NAVIGATION_ITEMS)[number]['key'];
