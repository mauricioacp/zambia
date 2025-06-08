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

// Role information from the view
export interface RoleInAgreement {
  role_id: string;
  role_name: string;
  role_description: string | null;
  role_code: string;
  role_level: number;
}

// For the list of agreements from agreement_with_role view
export interface AgreementWithShallowRelations {
  id: string;
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
  created_at: string | null;
  updated_at: string | null;
  user_id: string | null;
  role: RoleInAgreement | null;
  // These are flattened from joins in the view
  headquarter_name?: string;
  country_name?: string;
  season_name?: string;
}

// For a single agreement by ID
export interface AgreementDetails extends Agreement {
  headquarters?: Pick<Headquarter, 'id' | 'name' | 'address' | 'status'> & {
    countries?: Pick<Country, 'id' | 'name' | 'code'>;
  };
  roles?: Pick<Role, 'id' | 'name' | 'code' | 'level'>;
  seasons?: Pick<Season, 'id' | 'name' | 'start_date' | 'end_date'>;
}

export interface PaginationMetadata {
  total: number;
  limit: number;
  offset: number;
  page: number;
  pages: number;
}

export interface PaginatedAgreements {
  data: AgreementWithShallowRelations[];
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
export class AgreementsFacadeService {
  private supabase = inject(SupabaseService);
  private roleService = inject(RoleService);
  private akademyEdgeFunctionsService = inject(AkademyEdgeFunctionsService);
  private notificationService = inject(NotificationService);

  agreementId: WritableSignal<string> = signal('');
  agreementsResource = linkedSignal(() => this.agreements.value() ?? []);
  agreementByIdResource = linkedSignal(() => this.agreementById.value() ?? null);

  currentPage = signal(1);
  pageSize = signal(1000); // Fetch all records for client-side pagination
  totalItems = signal(0);
  isLoading = signal(false);
  status = signal<string | null>(null);
  headquarterId = signal<string | null>(null);
  seasonId = signal<string | null>(null);
  search = signal<string | null>(null);

  totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));
  hasNextPage = computed(() => this.currentPage() < this.totalPages());
  hasPrevPage = computed(() => this.currentPage() > 1);

  isEditing = signal<boolean>(false);
  formData = signal<AgreementFormData | null>(null);
  saveError = signal<string | null>(null);
  saveSuccess = signal<boolean>(false);

  private agreementsParams = computed<AgreementsRpcParams>(() => {
    const params: AgreementsRpcParams = {
      p_limit: this.pageSize(),
      p_offset: (this.currentPage() - 1) * this.pageSize(),
    };

    const status = this.status();
    if (status) params.p_status = status;

    const headquarterId = this.headquarterId();
    if (headquarterId) params.p_headquarter_id = headquarterId;

    const seasonId = this.seasonId();
    if (seasonId) params.p_season_id = seasonId;

    const search = this.search();
    if (search) params.p_search = search;

    // TODO: Get current user role ID from auth context
    // if (roleId) params.p_role_id = roleId;

    return params;
  });

  agreements = resource<PaginatedAgreements, AgreementsRpcParams>({
    request: () => this.agreementsParams(),
    loader: async ({ request }: ResourceLoaderParams<AgreementsRpcParams>): Promise<PaginatedAgreements> => {
      this.isLoading.set(true);
      try {
        // Fetch agreements
        const { data, error } = await this.supabase.getClient().rpc('get_agreements_with_role_paginated', request);

        if (error) {
          console.error('Error fetching agreements:', error);
          throw error;
        }

        const response = data as unknown as { data: AgreementWithShallowRelations[]; pagination: PaginationMetadata };

        if (!response || !response.data || !response.pagination) {
          console.warn('Received unexpected data structure from get_agreements_with_role_paginated RPC.');
          return {
            data: [],
            pagination: {
              total: 0,
              limit: request.p_limit,
              offset: request.p_offset,
              page: Math.floor(request.p_offset / request.p_limit) + 1,
              pages: 0,
            },
          };
        }

        // Fetch headquarters to map names
        const { data: headquartersData, error: hqError } = await this.supabase
          .getClient()
          .from('headquarters')
          .select('id, name');

        if (hqError) {
          console.error('Error fetching headquarters:', hqError);
        }

        // Create a map of headquarter IDs to names
        const headquarterMap = new Map<string, string>();
        if (headquartersData) {
          headquartersData.forEach((hq) => {
            headquarterMap.set(hq.id, hq.name);
          });
        }

        // Map agreements with headquarter names
        const mappedData = response.data.map((agreement: AgreementWithShallowRelations) => ({
          ...agreement,
          headquarter_name: headquarterMap.get(agreement.headquarter_id) || 'Unknown Headquarter',
          country_name: agreement.country_name,
          season_name: agreement.season_name,
        }));

        console.log('Fetched agreements:', mappedData.length, 'total:', response.pagination.total);

        // Log a sample agreement to verify headquarter_name is included
        if (mappedData.length > 0) {
          console.log('Sample agreement data:', {
            id: mappedData[0].id,
            name: mappedData[0].name,
            headquarter_name: mappedData[0].headquarter_name,
            headquarter_id: mappedData[0].headquarter_id,
          });
        }

        this.totalItems.set(response.pagination.total);
        return {
          data: mappedData,
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
      const { data, error } = await this.supabase.getClient().from('headquarters').select('id, name, status');

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

  loadAgreementById() {
    this.agreementById.reload();
  }

  loadAgreements() {
    this.agreements.reload();
  }

  loadHeadquarters() {
    this.headquarters.reload();
  }

  loadRoles() {
    this.roles.reload();
  }

  loadSeasons() {
    this.seasons.reload();
  }

  initCreateForm() {
    this.isEditing.set(false);
    this.saveError.set(null);
    this.saveSuccess.set(false);
    this.formData.set({
      name: '',
      last_name: '',
      email: '',
      phone: '',
      document_number: '',
      birth_date: null,
      gender: null,
      address: '',
      headquarter_id: '',
      role_id: '',
      season_id: '',
      status: 'active',
      ethical_document_agreement: false,
      mailing_agreement: false,
      volunteering_agreement: false,
      age_verification: false,
    });
  }

  initEditForm(agreement: AgreementDetails) {
    this.isEditing.set(true);
    this.saveError.set(null);
    this.saveSuccess.set(false);
    this.formData.set({
      id: agreement.id,
      name: agreement.name,
      last_name: agreement.last_name,
      email: agreement.email,
      phone: agreement.phone,
      document_number: agreement.document_number,
      birth_date: agreement.birth_date,
      gender: agreement.gender,
      address: agreement.address,
      headquarter_id: agreement.headquarter_id,
      role_id: agreement.role_id,
      season_id: agreement.season_id,
      status: agreement.status,
      ethical_document_agreement: agreement.ethical_document_agreement,
      mailing_agreement: agreement.mailing_agreement,
      volunteering_agreement: agreement.volunteering_agreement,
      age_verification: agreement.age_verification,
    });
  }

  async activateAgreement(agreementId: string): Promise<void> {
    try {
      this.isLoading.set(true);

      // TODO: Implement agreement activation via edge function
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
      seasonId: string | null;
      search: string | null;
    }>
  ): void {
    if (filters.status !== undefined) this.status.set(filters.status);
    if (filters.headquarterId !== undefined) this.headquarterId.set(filters.headquarterId);
    if (filters.seasonId !== undefined) this.seasonId.set(filters.seasonId);
    if (filters.search !== undefined) this.search.set(filters.search);

    this.currentPage.set(1);
  }

  async exportAgreements(): Promise<AgreementWithShallowRelations[]> {
    const exportParams: AgreementsRpcParams = {
      p_limit: this.totalItems() || 1000, // Export all or max 1000
      p_offset: 0,
    };

    const status = this.status();
    if (status) exportParams.p_status = status;

    const headquarterId = this.headquarterId();
    if (headquarterId) exportParams.p_headquarter_id = headquarterId;

    const seasonId = this.seasonId();
    if (seasonId) exportParams.p_season_id = seasonId;

    const search = this.search();
    if (search) exportParams.p_search = search;

    // TODO: Get current user role ID from auth context
    // if (roleId) exportParams.p_role_id = roleId;

    const { data, error } = await this.supabase.getClient().rpc('get_agreements_with_role_paginated', exportParams);

    if (error) {
      console.error('Error exporting agreements:', error);
      throw error;
    }

    const typedData = data as unknown as { data: AgreementWithShallowRelations[] };
    const agreements = typedData?.data || [];

    // Fetch headquarters to map names
    const { data: headquartersData, error: hqError } = await this.supabase
      .getClient()
      .from('headquarters')
      .select('id, name');

    if (hqError) {
      console.error('Error fetching headquarters for export:', hqError);
    }

    // Create a map of headquarter IDs to names
    const headquarterMap = new Map<string, string>();
    if (headquartersData) {
      headquartersData.forEach((hq) => {
        headquarterMap.set(hq.id, hq.name);
      });
    }

    // Map agreements with headquarter names
    return agreements.map((agreement) => ({
      ...agreement,
      headquarter_name: headquarterMap.get(agreement.headquarter_id) || 'Unknown Headquarter',
    }));
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
}
