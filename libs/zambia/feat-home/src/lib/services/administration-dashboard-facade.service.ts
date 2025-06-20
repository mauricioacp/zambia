import { computed, inject, Injectable, resource, signal } from '@angular/core';
import { SupabaseService } from '@zambia/data-access-supabase';
import { NotificationService } from '@zambia/data-access-generic';

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
  operations: {
    totalWorkshops: number;
    totalEvents: number;
    avgDaysProspectToActive: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AdministrationDashboardFacadeService {
  private supabase = inject(SupabaseService);
  private notificationService = inject(NotificationService);

  globalStats = computed(() => this.globalDashboardStats.value());
  hasError = computed(() => this.globalDashboardStats.error() !== null);
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
}
