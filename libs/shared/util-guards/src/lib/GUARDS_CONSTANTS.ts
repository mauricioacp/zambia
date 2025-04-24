export const REQUIRED_ROLES = 'requiredRoles';

export const Role = {
  GENERAL_DIRECTOR: 'general_director',
  PEDAGOGICAL_LEADER: 'pedagogical_leader',
  INNOVATION_LEADER: 'innovation_leader',
  COMMUNICATION_LEADER: 'communication_leader',
  EXECUTIVE_LEADER: 'executive_leader',
  COMMUNITY_LEADER: 'community_leader',
  COORDINATION_LEADER: 'coordination_leader',
  COORDINATOR: 'coordinator',
  LEGAL_ADVISOR: 'legal_advisor',
  KONSEJO_MEMBER: 'konsejo_member',
  HEADQUARTER_MANAGER: 'headquarter_manager',
  PEDAGOGICAL_MANAGER: 'pedagogical_manager',
  COMMUNICATION_MANAGER: 'communication_manager',
  COMPANION_DIRECTOR: 'companion_director',
  MANAGER_ASSISTANT: 'manager_assistant',
  SUPERADMIN: 'superadmin',
  COMPANION: 'companion',
  FACILITATOR: 'facilitator',
  STUDENT: 'student',
} as const;

export type RoleCode = (typeof Role)[keyof typeof Role];

export const ROLES_NAMES = new Map<RoleCode, string>([
  [Role.GENERAL_DIRECTOR, 'Director General'],
  [Role.PEDAGOGICAL_LEADER, 'Líder Pedagógico'],
  [Role.INNOVATION_LEADER, 'Líder de Innovación'],
  [Role.COMMUNICATION_LEADER, 'Líder de Comunicación'],
  [Role.EXECUTIVE_LEADER, 'Líder Ejecutivo'],
  [Role.COMMUNITY_LEADER, 'Líder de Komunidad'],
  [Role.COORDINATION_LEADER, 'Líder de Koordinación'],
  [Role.COORDINATOR, 'Koordinador'],
  [Role.LEGAL_ADVISOR, 'Asesor Legal'],
  [Role.KONSEJO_MEMBER, 'Miembro del Konsejo de Dirección'],
  [Role.HEADQUARTER_MANAGER, 'Director/a Local'],
  [Role.PEDAGOGICAL_MANAGER, 'Director/a Pedagógico Local'],
  [Role.COMMUNICATION_MANAGER, 'Director/a de Comunicación Local'],
  [Role.COMPANION_DIRECTOR, 'Director/a de Acompañantes Local'],
  [Role.MANAGER_ASSISTANT, 'Asistente a la dirección'],
  [Role.SUPERADMIN, 'Super administrador'],
  [Role.COMPANION, 'Acompañante'],
  [Role.FACILITATOR, 'Facilitador'],
  [Role.STUDENT, 'Alumno'],
]);

export function getRoleName(roleCode: RoleCode): string {
  return ROLES_NAMES.get(roleCode) || roleCode;
}
