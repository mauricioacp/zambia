import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from '@zambia/data-access-supabase';
import { AuthService } from '@zambia/data-access-auth';

export interface OrganizationMetrics {
  total_headquarters: number;
  total_active_agreements: number;
  total_students: number;
  system_health?: {
    status: 'healthy' | 'warning' | 'critical';
    message?: string;
  };
}

export interface HeadquarterMetrics {
  active_agreements_count: number;
  facilitators_count: number;
  companions_count: number;
  students: {
    active: number;
    inactive: number;
    prospects: number;
  };
}

export interface AgreementSummary {
  id: string;
  status: string;
  role: string;
  headquarter_id: string;
  headquarter_name: string;
}

export interface DashboardStats {
  tier: number;
  metrics?: OrganizationMetrics | HeadquarterMetrics;
  agreement?: AgreementSummary;
  headquarter_info?: Record<string, unknown>;
  recent_activities?: Array<Record<string, unknown>>;
  recent_agreements?: Array<Record<string, unknown>>;
}

@Injectable({
  providedIn: 'root',
})
export class HomepageFacadeService {
  private supabaseService = inject(SupabaseService);
  private authService = inject(AuthService);
  private supabase = this.supabaseService.getClient();

  dashboardStats = signal<DashboardStats | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);

  async loadDashboardStats(userId: string, roleLevel: number): Promise<DashboardStats | null> {
    try {
      this.isLoading.set(true);
      this.error.set(null);

      // TODO: Implement actual RPC call when database functions are created
      // const { data, error } = await this.supabase
      //   .rpc('get_home_dashboard_stats', {
      //     p_user_id: userId,
      //     p_role_level: roleLevel,
      //   });

      // Mock data for now
      const mockData: DashboardStats = {
        tier: roleLevel >= 51 ? 3 : roleLevel >= 20 ? 2 : 1,
        metrics:
          roleLevel >= 51
            ? {
                total_headquarters: 10,
                total_active_agreements: 150,
                total_students: 1200,
                system_health: { status: 'healthy' },
              }
            : {
                active_agreements_count: 25,
                facilitators_count: 5,
                companions_count: 8,
                students: { active: 120, inactive: 10, prospects: 15 },
              },
      };

      this.dashboardStats.set(mockData);
      return mockData;
    } catch (error) {
      console.error('Error in loadDashboardStats:', error);
      this.error.set('Failed to load dashboard data');
      return null;
    } finally {
      this.isLoading.set(false);
    }
  }

  async loadMyAgreementSummary(userId: string): Promise<AgreementSummary | null> {
    try {
      // TODO: Implement actual RPC call when database functions are created
      // const { data, error } = await this.supabase
      //   .rpc('get_my_agreement_summary', {
      //     p_user_id: userId,
      //   });

      // Mock data for now
      return {
        id: '123',
        status: 'active',
        role: 'student',
        headquarter_id: '456',
        headquarter_name: 'Madrid HQ',
      };
    } catch (error) {
      console.error('Error in loadMyAgreementSummary:', error);
      return null;
    }
  }

  async loadRecentActivities(userId: string, roleLevel: number, limit = 10): Promise<Array<Record<string, unknown>>> {
    try {
      // TODO: Implement actual RPC call when database functions are created
      // const { data, error } = await this.supabase
      //   .rpc('get_recent_activities', {
      //     p_user_id: userId,
      //     p_role_level: roleLevel,
      //     p_limit: limit,
      //   });

      // Mock data for now
      return [
        { id: '1', type: 'agreement_created', timestamp: new Date().toISOString() },
        { id: '2', type: 'workshop_scheduled', timestamp: new Date().toISOString() },
      ];
    } catch (error) {
      console.error('Error in loadRecentActivities:', error);
      return [];
    }
  }

  async loadHeadquarterQuickStats(headquarterId: string): Promise<HeadquarterMetrics | null> {
    try {
      // TODO: Implement actual RPC call when database functions are created
      // const { data, error } = await this.supabase
      //   .rpc('get_headquarter_quick_stats', {
      //     p_headquarter_id: headquarterId,
      //   });

      // Mock data for now
      return {
        active_agreements_count: 25,
        facilitators_count: 5,
        companions_count: 8,
        students: {
          active: 120,
          inactive: 10,
          prospects: 15,
        },
      };
    } catch (error) {
      console.error('Error in loadHeadquarterQuickStats:', error);
      return null;
    }
  }

  async loadOrganizationOverview(): Promise<OrganizationMetrics | null> {
    try {
      // TODO: Implement actual RPC call when database functions are created
      // const { data, error } = await this.supabase
      //   .rpc('get_organization_overview');

      // Mock data for now
      return {
        total_headquarters: 10,
        total_active_agreements: 150,
        total_students: 1200,
        system_health: {
          status: 'healthy',
          message: 'All systems operational',
        },
      };
    } catch (error) {
      console.error('Error in loadOrganizationOverview:', error);
      return null;
    }
  }
}
