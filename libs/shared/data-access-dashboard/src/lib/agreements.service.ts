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
    request: () => this.agreementsParams(),
    loader: async ({ request: rpcParams }: ResourceLoaderParams<AgreementsRpcParams>): Promise<PaginatedAgreements> => {
      const { data, error } = await this.supabase.getClient().rpc('get_agreements_with_role_paginated', rpcParams);

      if (error) {
        console.error('Error fetching agreements:', error);
        throw error;
      }

      const rawResponse = data as unknown as {
        data: AgreementViewRow[];
        pagination: PaginationMetadata;
      };

      if (!rawResponse || !rawResponse.data || !rawResponse.pagination) {
        console.warn('Received unexpected data structure from get_agreements_with_role_paginated RPC.');
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

      const parsedData: AgreementWithRole[] = rawResponse.data.map((item) => {
        let parsedRole: RoleInAgreement | null = null;

        try {
          if (item.role && typeof item.role === 'object') {
            const roleObj = item.role as Record<string, unknown>;
            if ('role_id' in roleObj && 'role_name' in roleObj) {
              parsedRole = roleObj as unknown as RoleInAgreement;
            }
          }
        } catch (e) {
          console.warn('Error parsing role data:', e);
        }

        return {
          ...item,
          role: parsedRole,
        };
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
