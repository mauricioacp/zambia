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
  UTOPIK_FOUNDATION_USER: 'utopik_foundation_user',
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

export const ROLE_LEVELS: Record<RoleCode, number> = {
  [ROLE.SUPERADMIN]: 100,
  [ROLE.GENERAL_DIRECTOR]: 90,
  [ROLE.EXECUTIVE_LEADER]: 90,
  [ROLE.PEDAGOGICAL_LEADER]: 80,
  [ROLE.INNOVATION_LEADER]: 80,
  [ROLE.COMMUNICATION_LEADER]: 80,
  [ROLE.COMMUNITY_LEADER]: 80,
  [ROLE.COORDINATION_LEADER]: 80,
  [ROLE.LEGAL_ADVISOR]: 80,
  [ROLE.UTOPIK_FOUNDATION_USER]: 80,
  [ROLE.COORDINATOR]: 70,
  [ROLE.KONSEJO_MEMBER]: 70,
  [ROLE.HEADQUARTER_MANAGER]: 50,
  [ROLE.PEDAGOGICAL_MANAGER]: 40,
  [ROLE.COMMUNICATION_MANAGER]: 40,
  [ROLE.COMPANION_DIRECTOR]: 40,
  [ROLE.MANAGER_ASSISTANT]: 30,
  [ROLE.COMPANION]: 20,
  [ROLE.FACILITATOR]: 20,
  [ROLE.STUDENT]: 1,
};

export function getRoleLevel(role: RoleCode): number {
  return ROLE_LEVELS[role] ?? 0;
}

export function getRolesAtLeast(minRole: RoleCode): RoleCode[] {
  const min = getRoleLevel(minRole);
  return (Object.values(ROLE) as RoleCode[]).filter((r) => getRoleLevel(r) >= min);
}

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
  [ROLE.UTOPIK_FOUNDATION_USER, 'Usuario de fundación utópika'],
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

export const FILTER_ROLE_GROUP_WILL_DELETE_THIS = {
  LOCAL_MANAGEMENT_TEAM: [ROLE.PEDAGOGICAL_MANAGER, ROLE.COMMUNICATION_MANAGER, ROLE.COMPANION_DIRECTOR],
  ASSISTANTS: [ROLE.MANAGER_ASSISTANT],
  FIELD_STAFF: [ROLE.COMPANION, ROLE.FACILITATOR],
  STUDENTS: [ROLE.STUDENT],
};

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
  COORDINATION_TEAM: [ROLE.COORDINATOR, ROLE.KONSEJO_MEMBER, ROLE.UTOPIK_FOUNDATION_USER],
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

export function getRoleGroupNameByRoleCode(roleCode: RoleCode): string {
  const groupEntry = Object.entries(ROLE_GROUPS).find(([, rolesInGroup]) => {
    return rolesInGroup.includes(roleCode);
  });

  return groupEntry ? groupEntry[0] : '';
}
