export const ROLE = {
  /* level 100 */
  SUPERADMIN: 'superadmin',
  /* level 90 */
  GENERAL_DIRECTOR: 'general_director',
  EXECUTIVE_LEADER: 'executive_leader',
  /* level 80 */
  PEDAGOGICAL_LEADER: 'pedagogical_leader',
  INNOVATION_LEADER: 'innovation_leader',
  COMMUNICATION_LEADER: 'communication_leader',
  COMMUNITY_LEADER: 'community_leader',
  COORDINATION_LEADER: 'coordination_leader',
  LEGAL_ADVISOR: 'legal_advisor',
  /* level 70 */
  COORDINATOR: 'coordinator',
  KONSEJO_MEMBER: 'konsejo_member',
  /* level 50 */
  HEADQUARTER_MANAGER: 'headquarter_manager',
  /* level 40 */
  PEDAGOGICAL_MANAGER: 'pedagogical_manager',
  COMMUNICATION_MANAGER: 'communication_manager',
  COMPANION_DIRECTOR: 'companion_director',
  /* level 30 */
  MANAGER_ASSISTANT: 'manager_assistant',
  /* level 20 */
  COMPANION: 'companion',
  FACILITATOR: 'facilitator',
  /* level 1 */
  STUDENT: 'student',
};

export type RoleCode = (typeof ROLE)[keyof typeof ROLE];

export const ROLES_NAMES = new Map<RoleCode, string>([
  [ROLE.GENERAL_DIRECTOR, 'Director General'],
  [ROLE.PEDAGOGICAL_LEADER, 'Líder Pedagógico'],
  [ROLE.INNOVATION_LEADER, 'Líder de Innovación'],
  [ROLE.COMMUNICATION_LEADER, 'Líder de Comunicación'],
  [ROLE.EXECUTIVE_LEADER, 'Líder Ejecutivo'],
  [ROLE.COMMUNITY_LEADER, 'Líder de Komunidad'],
  [ROLE.COORDINATION_LEADER, 'Líder de Koordinación'],
  [ROLE.COORDINATOR, 'Koordinador'],
  [ROLE.LEGAL_ADVISOR, 'Asesor Legal'],
  [ROLE.KONSEJO_MEMBER, 'Miembro del Konsejo de Dirección'],
  [ROLE.HEADQUARTER_MANAGER, 'Director/a Local'],
  [ROLE.PEDAGOGICAL_MANAGER, 'Director/a Pedagógico Local'],
  [ROLE.COMMUNICATION_MANAGER, 'Director/a de Comunicación Local'],
  [ROLE.COMPANION_DIRECTOR, 'Director/a de Acompañantes Local'],
  [ROLE.MANAGER_ASSISTANT, 'Asistente a la dirección'],
  [ROLE.SUPERADMIN, 'Super administrador'],
  [ROLE.COMPANION, 'Acompañante'],
  [ROLE.FACILITATOR, 'Facilitador'],
  [ROLE.STUDENT, 'Alumno'],
]);

export type ROLE_GROUP = keyof typeof ROLE_GROUPS;

export const ROLE_GROUPS = {
  ADMINISTRATION: [ROLE.SUPERADMIN],
  TOP_MANAGEMENT: [ROLE.GENERAL_DIRECTOR, ROLE.EXECUTIVE_LEADER],
  LEADERSHIP_TEAM: [
    ROLE.PEDAGOGICAL_LEADER,
    ROLE.INNOVATION_LEADER,
    ROLE.COMMUNICATION_LEADER,
    ROLE.COMMUNITY_LEADER,
    ROLE.COORDINATION_LEADER,
    ROLE.LEGAL_ADVISOR,
  ],
  COORDINATION_TEAM: [ROLE.COORDINATOR, ROLE.KONSEJO_MEMBER],
  HEADQUARTERS_MANAGEMENT: [
    ROLE.HEADQUARTER_MANAGER,
    ROLE.PEDAGOGICAL_MANAGER,
    ROLE.COMMUNICATION_MANAGER,
    ROLE.COMPANION_DIRECTOR,
    ROLE.MANAGER_ASSISTANT,
  ],
  LOCAL_MANAGEMENT_TEAM: [ROLE.PEDAGOGICAL_MANAGER, ROLE.COMMUNICATION_MANAGER, ROLE.COMPANION_DIRECTOR],
  ASSISTANTS: [ROLE.MANAGER_ASSISTANT],
  FIELD_STAFF: [ROLE.COMPANION, ROLE.FACILITATOR],
  STUDENTS: [ROLE.STUDENT],
};

export function getRoleName(roleCode: RoleCode): string {
  return ROLES_NAMES.get(roleCode) || roleCode;
}

export function filterRoleGroups<T extends ROLE_GROUP[]>(
  ...excludeGroups: T
): Record<Exclude<ROLE_GROUP, T[number]>, RoleCode[]> {
  const result = { ...ROLE_GROUPS };

  excludeGroups.forEach((group) => {
    delete result[group];
  });

  return result as Record<Exclude<ROLE_GROUP, T[number]>, RoleCode[]>;
}

export const NAVIGATION_CONFIG = {
  panel: {
    route: '/dashboard/panel',
    icon: 'newspaper',
    translationKey: 'nav.main_panel',
    // No allowedGroups means all authenticated users
  },
  countries: {
    route: '/dashboard/countries',
    icon: 'globe',
    translationKey: 'nav.countries',
    allowedGroups: ['ADMINISTRATION', 'TOP_MANAGEMENT', 'LEADERSHIP_TEAM', 'HEADQUARTERS_MANAGEMENT'] as const,
  },
  headquarters: {
    route: '/dashboard/headquarters',
    icon: 'building',
    translationKey: 'nav.headquarters',
    allowedGroups: ['ADMINISTRATION', 'TOP_MANAGEMENT', 'LEADERSHIP_TEAM', 'HEADQUARTERS_MANAGEMENT'] as const,
  },
  workshops: {
    route: '/dashboard/workshops',
    icon: 'academic-cap',
    translationKey: 'nav.workshops',
    allowedGroups: ['ADMINISTRATION', 'TOP_MANAGEMENT', 'LEADERSHIP_TEAM', 'HEADQUARTERS_MANAGEMENT'] as const,
  },
  agreements: {
    route: '/dashboard/agreements',
    icon: 'document-text',
    translationKey: 'nav.agreements',
    allowedGroups: ['ADMINISTRATION', 'TOP_MANAGEMENT', 'LEADERSHIP_TEAM', 'HEADQUARTERS_MANAGEMENT'] as const,
  },
} as const;

export const NAVIGATION_SECTIONS = [
  {
    items: ['panel'] as const,
  },
  {
    headerKey: 'nav.management' as const,
    items: ['countries', 'headquarters', 'workshops', 'agreements'] as const,
  },
] as const;

export type NavigationItemKey = keyof typeof NAVIGATION_CONFIG;
export type NavigationConfig = (typeof NAVIGATION_CONFIG)[NavigationItemKey];
