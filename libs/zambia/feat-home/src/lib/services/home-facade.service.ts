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
  role_name: string;
  headquarter_id: string;
  headquarter_name: string;
  start_date?: string;
  end_date?: string;
  season_name?: string;
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

  // Helper to convert Json to typed interface
  private parseJsonResponse<T>(data: unknown): T | null {
    if (!data) return null;
    return data as T;
  }

  async loadDashboardStats(agreementId: string): Promise<DashboardStats | null> {
    try {
      this.isLoading.set(true);
      this.error.set(null);

      const { data, error } = await this.supabase.rpc('get_home_dashboard_stats', {
        p_agreement_id: agreementId,
      });

      if (error) {
        console.error('Error calling get_home_dashboard_stats:', error);
        this.error.set(error.message);
        return null;
      }

      const parsedData = this.parseJsonResponse<DashboardStats>(data);
      this.dashboardStats.set(parsedData);
      return parsedData;
    } catch (error) {
      console.error('Error in loadDashboardStats:', error);
      this.error.set('Failed to load dashboard data');
      return null;
    } finally {
      this.isLoading.set(false);
    }
  }

  async loadMyAgreementSummary(agreementId: string): Promise<AgreementSummary | null> {
    try {
      const { data, error } = await this.supabase.rpc('get_my_agreement_summary', {
        p_agreement_id: agreementId,
      });

      if (error) {
        console.error('Error calling get_my_agreement_summary:', error);
        return null;
      }

      return this.parseJsonResponse<AgreementSummary>(data);
    } catch (error) {
      console.error('Error in loadMyAgreementSummary:', error);
      return null;
    }
  }

  async loadRecentActivities(
    agreementId: string,
    roleLevel: number,
    limit = 10
  ): Promise<Array<Record<string, unknown>>> {
    try {
      const { data, error } = await this.supabase.rpc('get_recent_activities', {
        p_agreement_id: agreementId,
        p_role_level: roleLevel,
        p_limit: limit,
      });

      if (error) {
        console.error('Error calling get_recent_activities:', error);
        return [];
      }

      return this.parseJsonResponse<Array<Record<string, unknown>>>(data) || [];
    } catch (error) {
      console.error('Error in loadRecentActivities:', error);
      return [];
    }
  }

  async loadHeadquarterQuickStats(headquarterId: string): Promise<HeadquarterMetrics | null> {
    try {
      const { data, error } = await this.supabase.rpc('get_headquarter_quick_stats', {
        p_headquarter_id: headquarterId,
      });

      if (error) {
        console.error('Error calling get_headquarter_quick_stats:', error);
        return null;
      }

      return this.parseJsonResponse<HeadquarterMetrics>(data);
    } catch (error) {
      console.error('Error in loadHeadquarterQuickStats:', error);
      return null;
    }
  }

  async loadOrganizationOverview(): Promise<OrganizationMetrics | null> {
    try {
      const { data, error } = await this.supabase.rpc('get_organization_overview');

      if (error) {
        console.error('Error calling get_organization_overview:', error);
        return null;
      }

      return this.parseJsonResponse<OrganizationMetrics>(data);
    } catch (error) {
      console.error('Error in loadOrganizationOverview:', error);
      return null;
    }
  }

  async getAgreementIdByUserId(userId: string): Promise<string | null> {
    try {
      const { data, error } = await this.supabase.from('agreements').select('id').eq('user_id', userId).single();

      if (error) {
        console.error('Error getting agreement by user ID:', error);
        return null;
      }

      return data?.id || null;
    } catch (error) {
      console.error('Error in getAgreementIdByUserId:', error);
      return null;
    }
  }
}
