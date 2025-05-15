export interface EntityStatistics {
  total: number;
  active: number;
  inactive: number;
}

export interface DashboardStatistics {
  countries: EntityStatistics;
  headquarters: EntityStatistics;
  collaborators: EntityStatistics;
  students: EntityStatistics;
  konsejo_members: EntityStatistics;
  directors: EntityStatistics;
  facilitators: EntityStatistics;
  companions: EntityStatistics;
}

export interface StatBadge {
  label: string;
  value: number;
  icon: string;
  color: string;
  details?: {
    active?: number;
    inactive?: number;
    standby?: number;
  };
}
