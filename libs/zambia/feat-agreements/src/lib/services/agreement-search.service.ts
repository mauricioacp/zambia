import { Injectable, inject } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { SupabaseService } from '@zambia/data-access-supabase';
import { AgreementSearchCriteria } from '../components/ui/agreement-search-modal.ui-component';

export interface AgreementSearchServiceResult {
  agreements: Record<string, unknown>[];
  totalCount: number;
  searchTime: number;
}

@Injectable({
  providedIn: 'root',
})
export class AgreementSearchService {
  private supabaseService = inject(SupabaseService);

  searchAgreements(criteria: AgreementSearchCriteria): Observable<AgreementSearchServiceResult> {
    const startTime = Date.now();
    const client = this.supabaseService.getClient();

    // Build the query
    let query = client.from('agreements').select('*', { count: 'exact' });

    // Apply text search
    if (criteria.searchTerm) {
      const searchTerm = `%${criteria.searchTerm}%`;

      switch (criteria.searchIn) {
        case 'headquarters':
          // Search by headquarter name field
          query = query.ilike('headquarter_name', searchTerm);
          break;
        case 'countries':
          // Search agreements by country - would need to join with countries table
          // For now, we'll search in all fields
          query = query.or(
            [
              `name.ilike.${searchTerm}`,
              `last_name.ilike.${searchTerm}`,
              `email.ilike.${searchTerm}`,
              `document_number.ilike.${searchTerm}`,
              `phone.ilike.${searchTerm}`,
              `headquarter_name.ilike.${searchTerm}`,
            ].join(',')
          );
          break;
        case 'agreements':
          // Search in agreement-specific fields
          query = query.or(
            [
              `name.ilike.${searchTerm}`,
              `last_name.ilike.${searchTerm}`,
              `email.ilike.${searchTerm}`,
              `document_number.ilike.${searchTerm}`,
              `phone.ilike.${searchTerm}`,
            ].join(',')
          );
          break;
        default:
          // Search across all available fields
          query = query.or(
            [
              `name.ilike.${searchTerm}`,
              `last_name.ilike.${searchTerm}`,
              `email.ilike.${searchTerm}`,
              `document_number.ilike.${searchTerm}`,
              `phone.ilike.${searchTerm}`,
              `headquarter_name.ilike.${searchTerm}`,
            ].join(',')
          );
      }
    }

    // Apply role filters (roles are stored in a separate table, so we filter by role_id)
    if (criteria.roleFilters && criteria.roleFilters.length > 0) {
      query = query.in('role_id', criteria.roleFilters);
    }

    // Apply country filters
    if (criteria.countryFilters && criteria.countryFilters.length > 0) {
      query = query.in('country_id', criteria.countryFilters);
    }

    // Apply headquarter filters
    if (criteria.headquarterFilters && criteria.headquarterFilters.length > 0) {
      query = query.in('headquarter_id', criteria.headquarterFilters);
    }

    // Apply status filter
    if (!criteria.includeInactive) {
      query = query.neq('status', 'inactive');
    }

    // Order by created_at
    query = query.order('created_at', { ascending: false });

    // Limit results for performance
    query = query.limit(100);

    return from(query).pipe(
      switchMap(async ({ data, count, error }) => {
        if (error) {
          throw error;
        }

        // Enrich agreements with role information
        const enrichedAgreements = await this.enrichAgreementsWithRoles(data || []);
        const searchTime = Date.now() - startTime;

        return {
          agreements: enrichedAgreements,
          totalCount: count || 0,
          searchTime,
        };
      }),
      catchError((error) => {
        console.error('Agreement search error:', error);
        return of({
          agreements: [],
          totalCount: 0,
          searchTime: Date.now() - startTime,
        });
      })
    );
  }

  /**
   * Get role information for agreements
   * Since roles are in a separate table, we need to fetch them separately
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async enrichAgreementsWithRoles(agreements: any[]): Promise<any[]> {
    if (!agreements.length) return agreements;

    const roleIds = [...new Set(agreements.map((a) => a.role_id).filter(Boolean))];
    if (!roleIds.length) return agreements;

    const { data: roles } = await this.supabaseService
      .getClient()
      .from('roles')
      .select('id, name, code')
      .in('id', roleIds);

    const roleMap = new Map(roles?.map((r) => [r.id, r]) || []);

    return agreements.map((agreement) => ({
      ...agreement,
      role: roleMap.get(agreement.role_id) || null,
    }));
  }
}
