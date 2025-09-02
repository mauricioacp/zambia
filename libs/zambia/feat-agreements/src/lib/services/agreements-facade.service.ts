import {
  computed,
  inject,
  Injectable,
  linkedSignal,
  resource,
  ResourceLoaderParams,
  signal,
  WritableSignal,
} from '@angular/core';
import { SupabaseService } from '@zambia/data-access-supabase';
import { RoleService } from '@zambia/data-access-roles-permissions';
import { AkademyEdgeFunctionsService, NotificationService } from '@zambia/data-access-generic';
import { Database } from '@zambia/types-supabase';
import { AgreementSearchService, AgreementSearchServiceResult } from './agreement-search.service';
import { AgreementSearchCriteria } from '../components/ui/agreement-search-modal.ui-component';
import {
  SearchAgreementsParams,
  SearchAgreementsResponse,
  SearchAgreementResult,
  SearchAgreementsPagination,
} from '../types/search-agreements.types';

export type Agreement = Database['public']['Tables']['agreements']['Row'];
export type Headquarter = Database['public']['Tables']['headquarters']['Row'];
export type Country = Database['public']['Tables']['countries']['Row'];
export type Role = Database['public']['Tables']['roles']['Row'];
export type Season = Database['public']['Tables']['seasons']['Row'];

export interface AgreementFormData {
  id?: string;
  name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  document_number: string | null;
  birth_date: string | null;
  gender: string | null;
  address: string | null;
  headquarter_id: string;
  role_id: string;
  season_id: string;
  status: string | null;
  ethical_document_agreement: boolean | null;
  mailing_agreement: boolean | null;
  volunteering_agreement: boolean | null;
  age_verification: boolean | null;
}

export interface AgreementDetails extends Agreement {
  headquarters?: Pick<Headquarter, 'id' | 'name' | 'address' | 'status'> & {
    countries?: Pick<Country, 'id' | 'name' | 'code'>;
  };
  roles?: Pick<Role, 'id' | 'name' | 'code' | 'level'>;
  seasons?: Pick<Season, 'id' | 'name' | 'start_date' | 'end_date'>;
}

export interface PaginatedAgreements {
  data: SearchAgreementResult[];
  pagination: SearchAgreementsPagination;
}

@Injectable({
  providedIn: 'root',
})
export class AgreementsFacadeService {
  private supabase = inject(SupabaseService);
  private roleService = inject(RoleService);
  private akademyEdgeFunctionsService = inject(AkademyEdgeFunctionsService);
  private notificationService = inject(NotificationService);
  private agreementSearchService = inject(AgreementSearchService);

  agreementId: WritableSignal<string> = signal('');
  agreementsResource = linkedSignal(() => this.agreements.value() ?? []);
  agreementByIdResource = linkedSignal(() => this.agreementById.value() ?? null);

  currentPage = signal(1);
  pageSize = signal(1000);
  totalItems = signal(0);
  isLoading = signal(false);
  status = signal<string | null>(null);
  headquarterId = signal<string | null>(null);
  headquarterIds = signal<string[]>([]);
  seasonId = signal<string | null>(null);
  search = signal<string | null>(null);
  roleId = signal<string | null>(null);
  roleIds = signal<string[]>([]);

  totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));
  hasNextPage = computed(() => this.currentPage() < this.totalPages());
  hasPrevPage = computed(() => this.currentPage() > 1);

  isEditing = signal<boolean>(false);
  formData = signal<AgreementFormData | null>(null);
  saveError = signal<string | null>(null);
  saveSuccess = signal<boolean>(false);

  private agreementsParams = computed<SearchAgreementsParams>(() => {
    const params: SearchAgreementsParams = {
      p_limit: this.pageSize(),
      p_offset: (this.currentPage() - 1) * this.pageSize(),
    };

    const status = this.status();
    if (status) params.p_status = status;

    // Handle single or multiple headquarters
    const headquarterIds = this.headquarterIds();
    if (headquarterIds.length === 1) {
      params.p_headquarter_id = headquarterIds[0];
    }
    // For multiple headquarters, we'll handle it in the loader

    const seasonId = this.seasonId();
    if (seasonId) params.p_season_id = seasonId;

    const search = this.search();
    if (search) params.p_search_query = search;

    // Handle single or multiple roles
    const roleIds = this.roleIds();
    if (roleIds.length === 1) {
      params.p_role_id = roleIds[0];
    }
    // For multiple roles, we'll handle it in the loader

    return params;
  });

  agreements = resource<PaginatedAgreements, SearchAgreementsParams>({
    request: () => this.agreementsParams(),
    loader: async ({ request }: ResourceLoaderParams<SearchAgreementsParams>): Promise<PaginatedAgreements> => {
      this.isLoading.set(true);
      try {
        console.log(request);
        const { data, error } = await this.supabase.getClient().rpc('search_agreements', request);

        if (error) {
          console.error('Error fetching agreements:', error);
          throw error;
        }

        const response = data as unknown as SearchAgreementsResponse;

        if (!response || !response.data || !response.pagination) {
          console.warn('Received unexpected data structure from search_agreements RPC.');
          return {
            data: [],
            pagination: {
              total: 0,
              limit: request.p_limit || 10,
              offset: request.p_offset || 0,
              page: Math.floor((request.p_offset || 0) / (request.p_limit || 10)) + 1,
              pages: 0,
            },
          };
        }

        this.totalItems.set(response.pagination.total);
        return {
          data: response.data,
          pagination: response.pagination,
        };
      } finally {
        this.isLoading.set(false);
      }
    },
  });

  agreementById = resource({
    request: () => ({ agreementId: this.agreementId() }),
    loader: async ({ request }) => {
      if (!request.agreementId) {
        return null;
      }

      const { data, error } = await this.supabase
        .getClient()
        .from('agreements')
        .select(
          `
          *,
          headquarters!inner(
            id, name, address, status,
            countries!inner(id, name, code)
          ),
          roles(id, name, code, level),
          seasons(id, name, start_date, end_date)
        `
        )
        .eq('id', request.agreementId)
        .single();

      if (error) {
        console.error(`Error fetching agreement with ID ${request.agreementId}:`, error);
        throw error;
      }
      return data as AgreementDetails;
    },
  });

  headquarters = resource({
    loader: async () => {
      const { data, error } = await this.supabase
        .getClient()
        .from('headquarters')
        .select('id, name, status')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching headquarters:', error);
        throw error;
      }

      return data as Headquarter[];
    },
  });

  roles = resource({
    loader: async () => {
      const { data, error } = await this.supabase
        .getClient()
        .from('roles')
        .select('id, name, code, level')
        .order('level', { ascending: true });

      if (error) {
        console.error('Error fetching roles:', error);
        throw error;
      }

      return data as Role[];
    },
  });

  seasons = resource({
    loader: async () => {
      const { data, error } = await this.supabase
        .getClient()
        .from('seasons')
        .select('id, name, headquarter_id, status')
        .eq('status', 'active');

      if (error) {
        console.error('Error fetching seasons:', error);
        throw error;
      }

      return data as Season[];
    },
  });

  async activateAgreement(agreementId: string): Promise<void> {
    try {
      this.isLoading.set(true);

      const { error } = await this.supabase
        .getClient()
        .from('agreements')
        .update({ status: 'active' })
        .eq('id', agreementId);

      const result = { success: !error, error: error?.message };

      if (result.success) {
        this.notificationService.showSuccess('Agreement activated successfully');

        this.agreements.reload();
        if (this.agreementId() === agreementId) {
          this.agreementById.reload();
        }
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      this.notificationService.showError('Failed to activate agreement');
      throw error;
    } finally {
      this.isLoading.set(false);
    }
  }

  async deactivateAgreement(agreementId: string): Promise<void> {
    try {
      this.isLoading.set(true);

      const { error } = await this.supabase
        .getClient()
        .from('agreements')
        .update({ status: 'inactive' })
        .eq('id', agreementId);

      const result = { success: !error, error: error?.message };

      if (result.success) {
        this.notificationService.showSuccess('Agreement deactivated successfully');

        this.agreements.reload();
        if (this.agreementId() === agreementId) {
          this.agreementById.reload();
        }
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      this.notificationService.showError('Failed to deactivate agreement');
      throw error;
    } finally {
      this.isLoading.set(false);
    }
  }

  async createAgreement(formData: AgreementFormData) {
    try {
      this.saveError.set(null);
      this.saveSuccess.set(false);

      const { data, error } = await this.supabase
        .getClient()
        .from('agreements')
        .insert([
          {
            name: formData.name,
            last_name: formData.last_name,
            email: formData.email,
            phone: formData.phone,
            document_number: formData.document_number,
            birth_date: formData.birth_date,
            gender: formData.gender,
            address: formData.address,
            headquarter_id: formData.headquarter_id,
            role_id: formData.role_id,
            season_id: formData.season_id,
            status: formData.status,
            ethical_document_agreement: formData.ethical_document_agreement,
            mailing_agreement: formData.mailing_agreement,
            volunteering_agreement: formData.volunteering_agreement,
            age_verification: formData.age_verification,
          },
        ])
        .select()
        .single();

      if (error) {
        this.saveError.set(error.message);
        return null;
      }

      this.agreements.reload();
      this.saveSuccess.set(true);
      return data;
    } catch (error) {
      console.error('Error creating agreement:', error);
      this.saveError.set(error instanceof Error ? error.message : 'Unknown error occurred');
      return null;
    }
  }

  async updateAgreement(formData: AgreementFormData) {
    try {
      this.saveError.set(null);
      this.saveSuccess.set(false);

      if (!formData.id) {
        this.saveError.set('Agreement ID is missing');
        return null;
      }

      const { data, error } = await this.supabase
        .getClient()
        .from('agreements')
        .update({
          name: formData.name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          document_number: formData.document_number,
          birth_date: formData.birth_date,
          gender: formData.gender,
          address: formData.address,
          headquarter_id: formData.headquarter_id,
          role_id: formData.role_id,
          season_id: formData.season_id,
          status: formData.status,
          ethical_document_agreement: formData.ethical_document_agreement,
          mailing_agreement: formData.mailing_agreement,
          volunteering_agreement: formData.volunteering_agreement,
          age_verification: formData.age_verification,
        })
        .eq('id', formData.id)
        .select()
        .single();

      if (error) {
        this.saveError.set(error.message);
        return null;
      }

      this.agreementById.reload();
      this.agreements.reload();
      this.saveSuccess.set(true);
      return data;
    } catch (error) {
      console.error('Error updating agreement:', error);
      this.saveError.set(error instanceof Error ? error.message : 'Unknown error occurred');
      return null;
    }
  }

  onPageChange = (page: number) => {
    this.currentPage.set(page);
  };

  onPageSizeChange = (size: number) => {
    this.pageSize.set(size);
    this.currentPage.set(1);
  };

  updateFilters(
    filters: Partial<{
      status: string | null;
      headquarterId: string | null;
      headquarterIds: string[];
      seasonId: string | null;
      search: string | null;
      roleId: string | null;
      roleIds: string[];
    }>
  ): void {
    if (filters.status !== undefined) this.status.set(filters.status);
    if (filters.headquarterId !== undefined) this.headquarterId.set(filters.headquarterId);
    if (filters.headquarterIds !== undefined) this.headquarterIds.set(filters.headquarterIds);
    if (filters.seasonId !== undefined) this.seasonId.set(filters.seasonId);
    if (filters.search !== undefined) this.search.set(filters.search);
    if (filters.roleId !== undefined) this.roleId.set(filters.roleId);
    if (filters.roleIds !== undefined) this.roleIds.set(filters.roleIds);

    this.currentPage.set(1);
  }

  async exportAgreements(): Promise<SearchAgreementResult[]> {
    const exportParams: SearchAgreementsParams = {
      p_limit: this.totalItems() || 1000, // Export all or max 1000
      p_offset: 0,
    };

    const status = this.status();
    if (status) exportParams.p_status = status;

    const headquarterIds = this.headquarterIds();
    if (headquarterIds.length === 1) {
      exportParams.p_headquarter_id = headquarterIds[0];
    }

    const seasonId = this.seasonId();
    if (seasonId) exportParams.p_season_id = seasonId;

    const search = this.search();
    if (search) exportParams.p_search_query = search;

    const roleIds = this.roleIds();
    if (roleIds.length === 1) {
      exportParams.p_role_id = roleIds[0];
    }

    const { data, error } = await this.supabase.getClient().rpc('search_agreements', exportParams);

    if (error) {
      console.error('Error exporting agreements:', error);
      throw error;
    }

    const response = data as unknown as SearchAgreementsResponse;
    return response?.data || [];
  }

  isAgreementsLoading = computed(() => this.agreements.isLoading() || this.isLoading());
  loadingError = computed(() => this.agreements.error());

  isDetailLoading = computed(() => this.agreementById.isLoading());
  detailLoadingError = computed(() => this.agreementById.error());

  isHeadquartersLoading = computed(() => this.headquarters.isLoading());
  isRolesLoading = computed(() => this.roles.isLoading());
  isSeasonsLoading = computed(() => this.seasons.isLoading());

  headquartersResource = linkedSignal(() => this.headquarters.value() ?? []);
  rolesResource = linkedSignal(() => this.roles.value() ?? []);
  seasonsResource = linkedSignal(() => this.seasons.value() ?? []);

  searchAgreements(criteria: AgreementSearchCriteria): Promise<AgreementSearchServiceResult> {
    return this.agreementSearchService
      .searchAgreements(criteria)
      .toPromise()
      .then(
        (result: AgreementSearchServiceResult | undefined) => result || { agreements: [], totalCount: 0, searchTime: 0 }
      );
  }

  // Text search implementation using the new search_agreements RPC
  async searchAgreementsByName(query: string): Promise<SearchAgreementResult[]> {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const params: SearchAgreementsParams = {
      p_search_query: query,
      p_limit: 100,
      p_offset: 0,
    };

    const { data, error } = await this.supabase.getClient().rpc('search_agreements', params);

    if (error) {
      console.error('Search error:', error);
      return [];
    }

    const response = data as unknown as SearchAgreementsResponse;
    return response?.data || [];
  }
}
