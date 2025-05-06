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
} as const;

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

export function getRoleName(roleCode: RoleCode): string {
  return ROLES_NAMES.get(roleCode) || roleCode;
}
