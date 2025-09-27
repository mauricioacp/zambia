/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { computed, inject, Injectable, resource, ResourceLoaderParams, signal } from '@angular/core';
import { SupabaseService } from '@zambia/data-access-supabase';
import { Tables } from '@zambia/types-supabase';

export interface RoleInAgreement {
  role_id: string;
  role_name: string;
  role_description: string | null;
  role_code: string;
  role_level: number;
}

export type AgreementViewRow = Tables<'agreement_with_role'>;

export interface AgreementWithRole extends Omit<AgreementViewRow, 'role'> {
  role: RoleInAgreement | null;
}

export interface PaginationMetadata {
  total: number;
  limit: number;
  offset: number;
  page: number;
  pages: number;
}

export interface PaginatedAgreements {
  data: AgreementWithRole[];
  pagination: PaginationMetadata;
}

export interface AgreementsRpcParams {
  p_limit: number;
  p_offset: number;
  p_status?: string;
  p_headquarter_id?: string;
  p_season_id?: string;
  p_search?: string;
  p_role_id?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AgreementsService {
  private supabase = inject(SupabaseService);

  limit = signal(10);
  page = signal(1);
  status = signal<string | null>(null);
  headquarterId = signal<string | null>(null);
  seasonId = signal<string | null>(null);
  search = signal<string | null>(null);
  roleId = signal<string | null>(null);

  private offset = computed(() => (this.page() - 1) * this.limit());

  private agreementsParams = computed<AgreementsRpcParams>(() => {
    return {
      p_limit: this.limit(),
      p_offset: this.offset(),
      ...(this.status() !== null && { p_status: this.status()! }),
      ...(this.headquarterId() !== null && { p_headquarter_id: this.headquarterId()! }),
      ...(this.seasonId() !== null && { p_season_id: this.seasonId()! }),
      ...(this.search() !== null && { p_search: this.search()! }),
      ...(this.roleId() !== null && { p_role_id: this.roleId()! }),
    };
  });

  agreementsResource = resource<PaginatedAgreements, AgreementsRpcParams>({
    params: () => this.agreementsParams(),
    loader: async ({ params: rpcParams }: ResourceLoaderParams<AgreementsRpcParams>): Promise<PaginatedAgreements> => {
      const { data, error } = await this.supabase.getClient().rpc('search_agreements', {
        p_limit: rpcParams.p_limit,
        p_offset: rpcParams.p_offset,
        p_status: rpcParams.p_status,
        p_headquarter_id: rpcParams.p_headquarter_id,
        p_season_id: rpcParams.p_season_id,
        p_search_query: rpcParams.p_search,
        p_role_id: rpcParams.p_role_id,
      });

      if (error) {
        console.error('Error fetching agreements:', error);
        throw error;
      }

      // The new search_agreements RPC returns a different structure
      const rawResponse = data as unknown as {
        data: Array<{
          id: string;
          name: string | null;
          last_name: string | null;
          email: string;
          phone: string | null;
          document_number: string | null;
          birth_date: string | null;
          gender: string | null;
          address: string | null;
          status: string | null;
          ethical_document_agreement: boolean | null;
          mailing_agreement: boolean | null;
          volunteering_agreement: boolean | null;
          age_verification: boolean | null;
          created_at: string | null;
          updated_at: string | null;
          user_id: string | null;
          season_id: string;
          season_name: string;
          role: {
            role_id: string;
            role_name: string;
            role_description: string;
            role_code: string;
            role_level: number;
          };
          headquarter: {
            headquarter_id: string;
            headquarter_name: string;
            headquarter_address: string | null;
            country_id: string;
            country_name: string;
          };
        }>;
        pagination: PaginationMetadata;
        filters: unknown;
      };

      if (!rawResponse || !rawResponse.data || !rawResponse.pagination) {
        console.warn('Received unexpected data structure from search_agreements RPC.');
        return {
          data: [],
          pagination: {
            total: 0,
            limit: rpcParams.p_limit ?? 10,
            offset: rpcParams.p_offset ?? 0,
            page: Math.floor((rpcParams.p_offset ?? 0) / (rpcParams.p_limit ?? 10)) + 1,
            pages: 0,
          },
        };
      }

      // Map the new response structure to AgreementWithRole format
      const parsedData: AgreementWithRole[] = rawResponse.data.map((item) => {
        const role: RoleInAgreement | null = item.role
          ? {
              role_id: item.role.role_id,
              role_name: item.role.role_name,
              role_description: item.role.role_description,
              role_code: item.role.role_code,
              role_level: item.role.role_level,
            }
          : null;

        // Map to the old structure expected by AgreementWithRole
        return {
          id: item.id,
          name: item.name,
          last_name: item.last_name,
          email: item.email,
          phone: item.phone,
          document_number: item.document_number,
          address: item.address,
          status: item.status,
          headquarter_id: item.headquarter.headquarter_id,
          season_id: item.season_id,
          ethical_document_agreement: item.ethical_document_agreement,
          mailing_agreement: item.mailing_agreement,
          volunteering_agreement: item.volunteering_agreement,
          age_verification: item.age_verification,
          signature_data: null,
          created_at: item.created_at,
          updated_at: item.updated_at,
          user_id: item.user_id,
          fts_name_lastname: null,
          role: role,
        } as AgreementWithRole;
      });

      return {
        data: parsedData,
        pagination: rawResponse.pagination,
      };
    },
  });

  updatePage(page: number): void {
    this.page.set(page);
  }

  updateFilters(
    filters: Partial<{
      p_status: string | null;
      p_headquarter_id: string | null;
      p_season_id: string | null;
      p_search: string | null;
      p_role_id: string | null;
    }>
  ): void {
    if (filters.p_status !== undefined) this.status.set(filters.p_status);
    if (filters.p_headquarter_id !== undefined) this.headquarterId.set(filters.p_headquarter_id);
    if (filters.p_season_id !== undefined) this.seasonId.set(filters.p_season_id);
    if (filters.p_search !== undefined) this.search.set(filters.p_search);
    if (filters.p_role_id !== undefined) this.roleId.set(filters.p_role_id);

    this.page.set(1);
  }

  refresh(): void {
    this.agreementsResource.reload();
  }

  totalPages = computed(() => {
    if (!this.agreementsResource.hasValue()) return 0;
    return this.agreementsResource.value().pagination.pages;
  });

  getPaginationRange(): number[] {
    if (!this.agreementsResource.hasValue()) return [];

    const totalPages = this.totalPages();
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
}
