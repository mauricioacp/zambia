import { computed, inject, Injectable, resource } from '@angular/core';
import { SupabaseService } from '@zambia/data-access-supabase';
import { NotificationService } from '@zambia/data-access-generic';
import { Database } from '@zambia/types-supabase';

export interface GlobalDashboardStatsResponse {
  total_headquarters: number;
  total_collaborators: number;
  total_students: number;
  total_agreements_all_time: number;
  total_agreements_prospect: number;
  total_agreements_active: number;
  total_agreements_inactive: number;
  total_agreements_graduated: number;
  total_agreements_this_year: number;
  percentage_agreements_active: number;
  percentage_agreements_prospect: number;
  percentage_agreements_graduated: number;
  total_active_seasons: number;
  total_workshops_active_seasons: number;
  total_events_active_seasons: number;
  avg_days_prospect_to_active: number;
}

export interface AgreementRoleStatistics {
  [roleName: string]: {
    total: number;
    active: number;
    inactive: number;
    graduated: number;
    prospect: number;
  };
}

export interface GlobalDashboardStats {
  organization: {
    totalHeadquarters: number;
    totalActiveSeasons: number;
  };
  users: {
    totalCollaborators: number;
    totalStudents: number;
    totalUsers: number;
  };
  agreements: {
    total: number;
    prospect: number;
    active: number;
    inactive: number;
    graduated: number;
    thisYear: number;
    percentages: {
      active: number;
      prospect: number;
      graduated: number;
    };
  };
  agreementsByRole?: AgreementRoleStatistics;
  operations: {
    totalWorkshops: number;
    totalEvents: number;
    avgDaysProspectToActive: number;
  };
}

// Type for the agreement with role data returned from get_agreements_with_role RPC
type AgreementWithRole = Database['public']['Functions']['get_agreements_with_role']['Returns'][0];

// Type for the role JSON structure
interface RoleData {
  role_id?: string;
  role_name?: string;
  role_description?: string;
  role_code?: string;
  role_level?: number;
}

@Injectable({
  providedIn: 'root',
})
export class AdministrationDashboardFacadeService {
  private supabase = inject(SupabaseService);
  private notificationService = inject(NotificationService);

  globalStats = computed(() => this.globalDashboardStats.value());
  hasError = computed(() => this.globalDashboardStats.error());
  errorMessage = computed(() => this.globalDashboardStats.error());
  isLoading = computed(() => this.globalDashboardStats.isLoading());

  globalDashboardStats = resource({
    loader: async (): Promise<GlobalDashboardStats> => {
      try {
        const { data, error } = await this.supabase.getClient().rpc('get_global_dashboard_stats');

        if (error) {
          console.error('Error fetching global dashboard stats:', error);
          throw new Error(error.message || 'Failed to fetch dashboard statistics');
        }

        const stats = data as unknown as GlobalDashboardStatsResponse;

        if (!stats) {
          throw new Error('No data returned from dashboard statistics');
        }

        return this.transformGlobalStats(stats);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        this.notificationService.showError(`Failed to load dashboard: ${errorMessage}`);
        throw error;
      }
    },
  });

  refreshDashboard(): void {
    this.globalDashboardStats.reload();
  }

  safeGlobalStats = computed(() => {
    const stats = this.globalDashboardStats.value();
    if (!stats) {
      return {
        organization: { totalHeadquarters: 0, totalActiveSeasons: 0 },
        users: { totalCollaborators: 0, totalStudents: 0, totalUsers: 0 },
        agreements: {
          total: 0,
          prospect: 0,
          active: 0,
          inactive: 0,
          graduated: 0,
          thisYear: 0,
          percentages: { active: 0, prospect: 0, graduated: 0 },
        },
        operations: { totalWorkshops: 0, totalEvents: 0, avgDaysProspectToActive: 0 },
      };
    }
    return stats;
  });

  private transformGlobalStats(raw: GlobalDashboardStatsResponse): GlobalDashboardStats {
    return {
      organization: {
        totalHeadquarters: raw.total_headquarters,
        totalActiveSeasons: raw.total_active_seasons,
      },
      users: {
        totalCollaborators: raw.total_collaborators,
        totalStudents: raw.total_students,
        totalUsers: raw.total_collaborators + raw.total_students,
      },
      agreements: {
        total: raw.total_agreements_all_time,
        prospect: raw.total_agreements_prospect,
        active: raw.total_agreements_active,
        inactive: raw.total_agreements_inactive,
        graduated: raw.total_agreements_graduated,
        thisYear: raw.total_agreements_this_year,
        percentages: {
          active: raw.percentage_agreements_active,
          prospect: raw.percentage_agreements_prospect,
          graduated: raw.percentage_agreements_graduated,
        },
      },
      operations: {
        totalWorkshops: raw.total_workshops_active_seasons,
        totalEvents: raw.total_events_active_seasons,
        avgDaysProspectToActive: raw.avg_days_prospect_to_active,
      },
    };
  }

  agreementsByRoleStats = resource({
    loader: async (): Promise<AgreementRoleStatistics> => {
      try {
        const { data, error } = await this.supabase.getClient().rpc('get_agreements_with_role');

        if (error) {
          console.error('Error fetching agreements by role:', error);
          throw new Error(error.message || 'Failed to fetch agreement statistics');
        }

        if (!data || !Array.isArray(data)) {
          throw new Error('No data returned from agreement statistics');
        }

        const roleStats: AgreementRoleStatistics = {};

        // Type assertion for the data array
        const agreements = data as AgreementWithRole[];

        agreements.forEach((agreement) => {
          // Parse the role JSON data
          const roleData = agreement.role as RoleData | null;
          const roleName = roleData?.role_name || 'Unknown';
          const status = agreement.status || 'unknown';

          if (!roleStats[roleName]) {
            roleStats[roleName] = {
              total: 0,
              active: 0,
              inactive: 0,
              graduated: 0,
              prospect: 0,
            };
          }

          roleStats[roleName].total++;

          switch (status.toLowerCase()) {
            case 'active':
              roleStats[roleName].active++;
              break;
            case 'inactive':
              roleStats[roleName].inactive++;
              break;
            case 'graduated':
              roleStats[roleName].graduated++;
              break;
            case 'prospect':
              roleStats[roleName].prospect++;
              break;
          }
        });

        return roleStats;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        this.notificationService.showError(`Failed to load agreement statistics: ${errorMessage}`);
        throw error;
      }
    },
  });

  agreementsByRole = computed(() => (this.agreementsByRoleStats.hasValue() ? this.agreementsByRoleStats.value() : {}));
  agreementsByRoleLoading = computed(() => this.agreementsByRoleStats.isLoading());
  agreementsByRoleError = computed(() => this.agreementsByRoleStats.error());

  refreshAllDashboardData(): void {
    this.refreshDashboard();
    this.agreementsByRoleStats.reload();
  }
}
