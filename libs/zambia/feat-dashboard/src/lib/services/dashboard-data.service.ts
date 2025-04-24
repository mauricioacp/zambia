import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SupabaseService } from '@zambia/data-access-supabase';
import { AuthService } from '@zambia/data-access-auth';
import { RolesService } from '@zambia/data-access-roles-permissions';
import { Role } from '@zambia/util-roles-permissions';

export interface DashboardStat {
  label: string;
  value: number;
  icon: string;
  color: string;
}

export interface RecentActivity {
  id: string;
  title: string;
  date: Date;
  type: string;
}

export interface HeadquarterSummary {
  id: string;
  name: string;
  studentCount: number;
  facilitatorCount: number;
  companionCount: number;
}

/**
 * Service for fetching dashboard data from Supabase.
 * Uses RPC functions to fetch role-specific data with proper security enforcement.
 */
@Injectable({
  providedIn: 'root',
})
export class DashboardDataService {
  private supabaseService = inject(SupabaseService);
  private authService = inject(AuthService);
  private rolesService = inject(RolesService);

  /**
   * Fetches dashboard statistics based on the user's role.
   * Uses different RPC functions depending on the role to ensure proper data access.
   */
  public getDashboardStats(): Observable<DashboardStat[]> {
    const supabase = this.supabaseService.getClient();

    // In a real implementation, this would call different RPC functions based on the user's role
    // For demonstration purposes, we're returning mock data

    // Example of how the actual implementation would look:
    /*
    if (this.rolesService.hasRole(Role.SUPERADMIN) || this.rolesService.hasRole(Role.GENERAL_DIRECTOR)) {
      // Call RPC function for global stats
      return from(supabase.rpc('get_global_dashboard_stats')).pipe(
        map(response => this.supabaseService.handleResponse(response, 'Fetch Dashboard Stats')),
        map(data => this.mapToStatsList(data))
      );
    } else if (this.rolesService.hasRole(Role.HEADQUARTER_MANAGER)) {
      // Call RPC function for headquarter-specific stats
      return from(supabase.rpc('get_headquarter_dashboard_stats')).pipe(
        map(response => this.supabaseService.handleResponse(response, 'Fetch Dashboard Stats')),
        map(data => this.mapToStatsList(data))
      );
    } else {
      // Call RPC function for user-specific stats
      return from(supabase.rpc('get_user_dashboard_stats')).pipe(
        map(response => this.supabaseService.handleResponse(response, 'Fetch Dashboard Stats')),
        map(data => this.mapToStatsList(data))
      );
    }
    */

    // Mock implementation for demonstration
    if (this.rolesService.hasRole(Role.SUPERADMIN) || this.rolesService.hasRole(Role.GENERAL_DIRECTOR)) {
      return of([
        { label: 'Estudiantes', value: 1245, icon: 'school', color: 'bg-blue-500' },
        { label: 'Facilitadores', value: 78, icon: 'person', color: 'bg-green-500' },
        { label: 'Acompañantes', value: 42, icon: 'people', color: 'bg-purple-500' },
        { label: 'Sedes', value: 8, icon: 'location_on', color: 'bg-orange-500' },
      ]);
    } else if (this.rolesService.hasRole(Role.HEADQUARTER_MANAGER)) {
      return of([
        { label: 'Estudiantes', value: 156, icon: 'school', color: 'bg-blue-500' },
        { label: 'Facilitadores', value: 12, icon: 'person', color: 'bg-green-500' },
        { label: 'Acompañantes', value: 8, icon: 'people', color: 'bg-purple-500' },
        { label: 'Talleres', value: 24, icon: 'event', color: 'bg-orange-500' },
      ]);
    } else {
      return of([
        { label: 'Mis Estudiantes', value: 25, icon: 'school', color: 'bg-blue-500' },
        { label: 'Mis Talleres', value: 4, icon: 'event', color: 'bg-green-500' },
        { label: 'Tareas Pendientes', value: 7, icon: 'assignment', color: 'bg-red-500' },
        { label: 'Anuncios', value: 3, icon: 'announcement', color: 'bg-yellow-500' },
      ]);
    }
  }

  /**
   * Fetches recent activities based on the user's role.
   * Uses different RPC functions depending on the role to ensure proper data access.
   */
  public getRecentActivities(): Observable<RecentActivity[]> {
    const supabase = this.supabaseService.getClient();

    // In a real implementation, this would call different RPC functions based on the user's role
    // For demonstration purposes, we're returning mock data

    // Example of how the actual implementation would look:
    /*
    return from(supabase.rpc('get_recent_activities_for_user')).pipe(
      map(response => this.supabaseService.handleResponse(response, 'Fetch Recent Activities')),
      map(data => data.map(item => ({
        id: item.id,
        title: item.title,
        date: new Date(item.created_at),
        type: item.activity_type
      })))
    );
    */

    // Mock implementation for demonstration
    return of([
      {
        id: '1',
        title: 'Nuevo estudiante registrado',
        date: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        type: 'success',
      },
      {
        id: '2',
        title: 'Actualización de perfil de facilitador',
        date: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
        type: 'info',
      },
      {
        id: '3',
        title: 'Problema con la sincronización de datos',
        date: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        type: 'error',
      },
      {
        id: '4',
        title: 'Nuevo acuerdo pendiente de revisión',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        type: 'warning',
      },
    ]);
  }

  /**
   * Fetches headquarter summaries for directors and admins.
   * Only available to users with appropriate roles.
   */
  public getHeadquarterSummaries(): Observable<HeadquarterSummary[]> {
    const supabase = this.supabaseService.getClient();

    // In a real implementation, this would call an RPC function
    // For demonstration purposes, we're returning mock data or an empty array based on role

    // Example of how the actual implementation would look:
    /*
    if (this.rolesService.hasRoleLevelOrHigher(Role.GENERAL_DIRECTOR)) {
      return from(supabase.rpc('get_headquarter_summaries')).pipe(
        map(response => this.supabaseService.handleResponse(response, 'Fetch Headquarter Summaries')),
        map(data => data.map(item => ({
          id: item.id,
          name: item.name,
          studentCount: item.student_count,
          facilitatorCount: item.facilitator_count,
          companionCount: item.companion_count
        })))
      );
    } else {
      return of([]);
    }
    */

    // Mock implementation for demonstration
    if (this.rolesService.hasRoleLevelOrHigher(Role.GENERAL_DIRECTOR)) {
      return of([
        { id: '1', name: 'Sede Madrid', studentCount: 245, facilitatorCount: 15, companionCount: 8 },
        { id: '2', name: 'Sede Barcelona', studentCount: 198, facilitatorCount: 12, companionCount: 6 },
        { id: '3', name: 'Sede Valencia', studentCount: 156, facilitatorCount: 10, companionCount: 5 },
        { id: '4', name: 'Sede Sevilla', studentCount: 132, facilitatorCount: 8, companionCount: 4 },
      ]);
    } else {
      return of([]);
    }
  }

  /**
   * Fetches pending agreements for superadmins.
   * Only available to users with SUPERADMIN role.
   */
  public getPendingAgreements(): Observable<number> {
    const supabase = this.supabaseService.getClient();

    // In a real implementation, this would call an RPC function
    // For demonstration purposes, we're returning mock data or 0 based on role

    // Example of how the actual implementation would look:
    /*
    if (this.rolesService.hasRole(Role.SUPERADMIN)) {
      return from(supabase.rpc('get_pending_agreements_count')).pipe(
        map(response => this.supabaseService.handleResponse(response, 'Fetch Pending Agreements Count')),
        map(data => data.count)
      );
    } else {
      return of(0);
    }
    */

    // Mock implementation for demonstration
    if (this.rolesService.hasRole(Role.SUPERADMIN)) {
      return of(5);
    } else {
      return of(0);
    }
  }

  /**
   * Fetches new users count for the current week for superadmins.
   * Only available to users with SUPERADMIN role.
   */
  public getNewUsersThisWeek(): Observable<number> {
    const supabase = this.supabaseService.getClient();

    // In a real implementation, this would call an RPC function
    // For demonstration purposes, we're returning mock data or 0 based on role

    // Example of how the actual implementation would look:
    /*
    if (this.rolesService.hasRole(Role.SUPERADMIN)) {
      return from(supabase.rpc('get_new_users_this_week')).pipe(
        map(response => this.supabaseService.handleResponse(response, 'Fetch New Users Count')),
        map(data => data.count)
      );
    } else {
      return of(0);
    }
    */

    // Mock implementation for demonstration
    if (this.rolesService.hasRole(Role.SUPERADMIN)) {
      return of(12);
    } else {
      return of(0);
    }
  }
}
