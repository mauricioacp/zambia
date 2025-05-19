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

export interface AgreementReviewStatistic {
  pending: number;
  reviewed: number;
  total: number;
  percentage_reviewed: number;
}

export interface AgreementReviewStatistics {
  students: AgreementReviewStatistic;
  collaborators: AgreementReviewStatistic;
  konsejo_members: AgreementReviewStatistic;
  directors: AgreementReviewStatistic;
  facilitators: AgreementReviewStatistic;
  companions: AgreementReviewStatistic;
  overall: AgreementReviewStatistic;
}

export interface ReviewStat {
  id: string;
  title: string;
  pending: number;
  reviewed: number;
  total: number;
  percentage_reviewed: number;
  color: string;
  textColor: string;
  iconSvg: string;
}

export interface ReviewStatRecord {
  [key: string]: ReviewStat;
}
