import { computed, inject, Injectable, resource } from '@angular/core';
import { SupabaseService } from '@zambia/data-access-supabase';
import { NotificationService } from '@zambia/data-access-generic';
import { Database, Tables } from '@zambia/types-supabase';
import { AgreementWithRole } from '@zambia/data-access-dashboard';

// Type aliases for better readability
type Country = Tables<'countries'>;
type Headquarter = Tables<'headquarters'>;

// Status enums
const AgreementStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  GRADUATED: 'graduated',
  PROSPECT: 'prospect',
} as const;

const EntityStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

// Role codes for leadership positions
const LEADERSHIP_ROLES = [
  'superadmin',
  'general_director',
  'executive_leader',
  'pedagogical_leader',
  'innovation_leader',
  'communication_leader',
  'community_leader',
  'coordination_leader',
  'legal_advisor',
  'utopik_foundation_user',
  'coordinator',
  'konsejo_member',
] as const;

const COLLABORATOR_ROLES = [
  'headquarter_manager',
  'manager_assistant',
  'facilitator',
  'companion',
  'collaborator',
] as const;

export interface AgreementRoleStatistics {
  [roleName: string]: {
    total: number;
    active: number;
    inactive: number;
    graduated: number;
    prospect: number;
  };
}

export interface DashboardStatistics {
  countries: {
    total: number;
    active: number;
    inactive: number;
  };
  headquarters: {
    total: number;
    active: number;
    inactive: number;
    byCountry: Record<string, number>;
  };
  agreements: AgreementRoleStatistics;
  users: {
    totalCollaborators: number;
    totalStudents: number;
    totalLeadership: number;
  };
}

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
  // private supabase = inject(SupabaseService);
  // private notificationService = inject(NotificationService);
  //
  // private countriesResource = resource({
  //   loader: async (): Promise<Country[]> => {
  //     try {
  //       const { data, error } = await this.supabase.getClient().from('countries').select('*').order('name');
  //
  //       if (error) throw error;
  //       return data || [];
  //     } catch (error) {
  //       console.error('Error fetching countries:', error);
  //       this.notificationService.showError('Failed to load countries data');
  //       throw error;
  //     }
  //   },
  // });
  //
  // private headquartersResource = resource({
  //   loader: async (): Promise<Headquarter[]> => {
  //     try {
  //       const { data, error } = await this.supabase.getClient().from('headquarters').select('*').order('name');
  //
  //       if (error) throw error;
  //       return data || [];
  //     } catch (error) {
  //       console.error('Error fetching headquarters:', error);
  //       this.notificationService.showError('Failed to load headquarters data');
  //       throw error;
  //     }
  //   },
  // });
  //
  // private agreementsResource = resource({
  //   loader: async (): Promise<AgreementRoleStatistics> => {
  //     try {
  //       const allAgreements = await this.fetchAllAgreements();
  //       return this.processAgreementsByRole(allAgreements);
  //     } catch (error) {
  //       console.error('Error fetching agreements by role:', error);
  //       this.notificationService.showError('Failed to load agreement statistics');
  //       throw error;
  //     }
  //   },
  // });
  //
  // private async fetchAllAgreements(): Promise<AgreementWithRole[]> {
  //   const allAgreements: AgreementWithRole[] = [];
  //   const batchSize = 1000;
  //   let offset = 0;
  //   let hasMore = true;
  //
  //   while (hasMore) {
  //     const { data, error } = await this.supabase.getClient().rpc('search_agreements', {
  //       p_limit: batchSize,
  //       p_offset: offset,
  //       p_status: undefined,
  //       p_headquarter_id: undefined,
  //       p_season_id: undefined,
  //       p_search: undefined,
  //       p_role_id: undefined,
  //     });
  //
  //     if (error) throw error;
  //
  //     if (!data || typeof data !== 'object') {
  //       throw new Error('Invalid data format returned from paginated agreements');
  //     }
  //
  //     if (!paginatedData.data || !Array.isArray(paginatedData.data)) {
  //       throw new Error('No data array returned from paginated agreements');
  //     }
  //
  //     allAgreements.push(...paginatedData.data);
  //
  //     const fetchedCount = offset + paginatedData.data.length;
  //     hasMore = fetchedCount < paginatedData.pagination.total && paginatedData.data.length === batchSize;
  //     offset += batchSize;
  //
  //     if (offset > 100000) {
  //       console.warn('Breaking pagination loop as safety measure at 100k records');
  //       break;
  //     }
  //   }
  //
  //   console.log(`Fetched ${allAgreements.length} total agreements`);
  //   return allAgreements;
  // }
  //
  // private processAgreementsByRole(agreements: AgreementWithRole[]): AgreementRoleStatistics {
  //   const roleStats: AgreementRoleStatistics = {};
  //
  //   agreements.forEach((agreement) => {
  //     const roleData = agreement.role as RoleData | null;
  //     const roleCode = roleData?.role_code || 'unknown';
  //     const status = agreement.status || 'unknown';
  //
  //     if (!roleStats[roleCode]) {
  //       roleStats[roleCode] = {
  //         total: 0,
  //         active: 0,
  //         inactive: 0,
  //         graduated: 0,
  //         prospect: 0,
  //       };
  //     }
  //
  //     roleStats[roleCode].total++;
  //
  //     switch (status) {
  //       case AgreementStatus.ACTIVE:
  //         roleStats[roleCode].active++;
  //         break;
  //       case AgreementStatus.INACTIVE:
  //         roleStats[roleCode].inactive++;
  //         break;
  //       case AgreementStatus.GRADUATED:
  //         roleStats[roleCode].graduated++;
  //         break;
  //       case AgreementStatus.PROSPECT:
  //         roleStats[roleCode].prospect++;
  //         break;
  //     }
  //   });
  //
  //   return roleStats;
  // }
  //
  // countries = computed(() => this.countriesResource.value() || []);
  // countriesLoading = computed(() => this.countriesResource.isLoading());
  // countriesError = computed(() => this.countriesResource.error());
  //
  // headquarters = computed(() => this.headquartersResource.value() || []);
  // headquartersLoading = computed(() => this.headquartersResource.isLoading());
  // headquartersError = computed(() => this.headquartersResource.error());
  //
  // agreementsByRole = computed(() => this.agreementsResource.value() || {});
  // agreementsLoading = computed(() => this.agreementsResource.isLoading());
  // agreementsError = computed(() => this.agreementsResource.error());
  //
  // statistics = computed<DashboardStatistics>(() => {
  //   const countries = this.countries();
  //   const headquarters = this.headquarters();
  //   const agreements = this.agreementsByRole();
  //
  //   const countryStats = {
  //     total: countries.length,
  //     active: countries.filter((c) => c.status === EntityStatus.ACTIVE).length,
  //     inactive: countries.filter((c) => c.status === EntityStatus.INACTIVE).length,
  //   };
  //
  //   const headquarterStats = {
  //     total: headquarters.length,
  //     active: headquarters.filter((h) => h.status === EntityStatus.ACTIVE).length,
  //     inactive: headquarters.filter((h) => h.status === EntityStatus.INACTIVE).length,
  //     byCountry: headquarters.reduce(
  //       (acc, hq) => {
  //         const countryId = hq.country_id || 'unknown';
  //         acc[countryId] = (acc[countryId] || 0) + 1;
  //         return acc;
  //       },
  //       {} as Record<string, number>
  //     ),
  //   };
  //
  //   let totalCollaborators = 0;
  //   let totalStudents = 0;
  //   let totalLeadership = 0;
  //
  //   Object.entries(agreements).forEach(([roleCode, stats]) => {
  //     if (roleCode === 'student') {
  //       totalStudents += stats.total;
  //     } else if (LEADERSHIP_ROLES.includes(roleCode as (typeof LEADERSHIP_ROLES)[number])) {
  //       totalLeadership += stats.total;
  //       totalCollaborators += stats.total; // Leadership are also collaborators
  //     } else if (COLLABORATOR_ROLES.includes(roleCode as (typeof COLLABORATOR_ROLES)[number])) {
  //       totalCollaborators += stats.total;
  //     } else if (roleCode !== 'unknown') {
  //       // Any other role is considered a collaborator
  //       totalCollaborators += stats.total;
  //     }
  //   });
  //
  //   return {
  //     countries: countryStats,
  //     headquarters: headquarterStats,
  //     agreements: agreements,
  //     users: {
  //       totalCollaborators,
  //       totalStudents,
  //       totalLeadership,
  //     },
  //   };
  // });
  //
  // isLoading = computed(() => this.countriesLoading() || this.headquartersLoading() || this.agreementsLoading());
  //
  // hasError = computed(() => !!(this.countriesError() || this.headquartersError() || this.agreementsError()));
  //
  // errorMessage = computed(() => {
  //   if (this.countriesError()) return 'Failed to load countries data';
  //   if (this.headquartersError()) return 'Failed to load headquarters data';
  //   if (this.agreementsError()) return 'Failed to load agreements data';
  //   return 'An error occurred while loading dashboard data';
  // });
  //
  // refreshDashboard(): void {
  //   this.countriesResource.reload();
  //   this.headquartersResource.reload();
  //   this.agreementsResource.reload();
  // }
  //
  // getRoleStats(roleCode: string) {
  //   const agreements = this.agreementsByRole();
  //   return (
  //     agreements[roleCode] || {
  //       total: 0,
  //       active: 0,
  //       inactive: 0,
  //       graduated: 0,
  //       prospect: 0,
  //     }
  //   );
  // }
  //
  // getTotalAgreements() {
  //   const agreements = this.agreementsByRole();
  //   return Object.values(agreements).reduce((total, roleStats) => total + roleStats.total, 0);
  // }
  //
  // getAgreementsByStatus(status: string) {
  //   const agreements = this.agreementsByRole();
  //   return Object.values(agreements).reduce((total, roleStats) => {
  //     switch (status) {
  //       case AgreementStatus.ACTIVE:
  //         return total + roleStats.active;
  //       case AgreementStatus.INACTIVE:
  //         return total + roleStats.inactive;
  //       case AgreementStatus.GRADUATED:
  //         return total + roleStats.graduated;
  //       case AgreementStatus.PROSPECT:
  //         return total + roleStats.prospect;
  //       default:
  //         return total;
  //     }
  //   }, 0);
  // }
}
