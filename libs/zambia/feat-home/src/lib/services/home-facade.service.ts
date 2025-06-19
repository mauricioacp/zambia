import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from '@zambia/data-access-supabase';
import { AuthService } from '@zambia/data-access-auth';

// Define custom RPC function types
// These types define the signatures for our custom Supabase functions
// that are not yet included in the auto-generated types
type CustomRpcFunctions = {
  get_home_dashboard_stats: {
    Args: { p_user_id: string; p_role_level: number };
    Returns: DashboardStats;
  };
  get_my_agreement_summary: {
    Args: { p_user_id: string };
    Returns: AgreementSummary;
  };
  get_recent_activities: {
    Args: { p_user_id: string; p_role_level: number; p_limit: number };
    Returns: Array<Record<string, unknown>>;
  };
  get_headquarter_quick_stats: {
    Args: { p_headquarter_id: string };
    Returns: HeadquarterMetrics;
  };
  get_organization_overview: {
    Args: Record<PropertyKey, never>;
    Returns: OrganizationMetrics;
  };
};

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

  // Type-safe wrapper for custom RPC functions
  private async callRpc<K extends keyof CustomRpcFunctions>(
    functionName: K,
    args: CustomRpcFunctions[K]['Args']
  ): Promise<{ data: CustomRpcFunctions[K]['Returns'] | null; error: { message: string } | null }> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await this.supabase.rpc(functionName as any, args);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return result as any;
  }

  async loadDashboardStats(userId: string, roleLevel: number): Promise<DashboardStats | null> {
    try {
      this.isLoading.set(true);
      this.error.set(null);

      const { data, error } = await this.callRpc('get_home_dashboard_stats', {
        p_user_id: userId,
        p_role_level: roleLevel,
      });

      if (error) {
        console.error('Error calling get_home_dashboard_stats:', error);
        this.error.set(error.message);
        return null;
      }

      this.dashboardStats.set(data);
      return data;
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
      const { data, error } = await this.callRpc('get_my_agreement_summary', {
        p_user_id: userId,
      });

      if (error) {
        console.error('Error calling get_my_agreement_summary:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in loadMyAgreementSummary:', error);
      return null;
    }
  }

  async loadRecentActivities(userId: string, roleLevel: number, limit = 10): Promise<Array<Record<string, unknown>>> {
    try {
      const { data, error } = await this.callRpc('get_recent_activities', {
        p_user_id: userId,
        p_role_level: roleLevel,
        p_limit: limit,
      });

      if (error) {
        console.error('Error calling get_recent_activities:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in loadRecentActivities:', error);
      return [];
    }
  }

  async loadHeadquarterQuickStats(headquarterId: string): Promise<HeadquarterMetrics | null> {
    try {
      const { data, error } = await this.callRpc('get_headquarter_quick_stats', {
        p_headquarter_id: headquarterId,
      });

      if (error) {
        console.error('Error calling get_headquarter_quick_stats:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in loadHeadquarterQuickStats:', error);
      return null;
    }
  }

  async loadOrganizationOverview(): Promise<OrganizationMetrics | null> {
    try {
      const { data, error } = await this.callRpc('get_organization_overview', {});

      if (error) {
        console.error('Error calling get_organization_overview:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in loadOrganizationOverview:', error);
      return null;
    }
  }
}
