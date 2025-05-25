import { computed, inject, Injectable, linkedSignal, resource, signal, WritableSignal } from '@angular/core';
import { SupabaseService } from '@zambia/data-access-supabase';
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

// For the list of agreements
export interface AgreementWithShallowRelations extends Agreement {
  headquarters?: Pick<Headquarter, 'name'> & {
    // headquarter is expected to be present
    countries?: Pick<Country, 'name'>; // country is expected to be present within headquarter
  };
  roles?: Pick<Role, 'name' | 'code'>;
  seasons?: Pick<Season, 'name'>;
}

// For a single agreement by ID
export interface AgreementDetails extends Agreement {
  headquarters?: Pick<Headquarter, 'id' | 'name' | 'address' | 'status'> & {
    countries?: Pick<Country, 'id' | 'name' | 'code'>;
  };
  roles?: Pick<Role, 'id' | 'name' | 'code' | 'level'>;
  seasons?: Pick<Season, 'id' | 'name' | 'start_date' | 'end_date'>;
}

@Injectable({
  providedIn: 'root',
})
export class AgreementsFacadeService {
  private supabase = inject(SupabaseService);
  agreementId: WritableSignal<string> = signal('');
  agreementsResource = linkedSignal(() => this.agreements.value() ?? []);
  agreementByIdResource = linkedSignal(() => this.agreementById.value() ?? null);

  // Form state management
  isEditing = signal<boolean>(false);
  formData = signal<AgreementFormData | null>(null);
  saveError = signal<string | null>(null);
  saveSuccess = signal<boolean>(false);

  agreements = resource({
    loader: async () => {
      const { data, error } = await this.supabase
        .getClient()
        .from('agreements')
        // Fetch countries through headquarters: headquarters!inner(name, countries!inner(name))
        // The !inner ensures that headquarters and countries within them must exist.
        .select('*, headquarters!inner(name, countries!inner(name)), roles(name, code), seasons(name)')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching agreements:', error);
        throw error;
      }
      return data as AgreementWithShallowRelations[];
    },
  });

  agreementById = resource({
    request: () => ({ agreementId: this.agreementId() }),
    loader: async ({ request }) => {
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

  // Resource for loading headquarters
  headquarters = resource({
    loader: async () => {
      const { data, error } = await this.supabase
        .getClient()
        .from('headquarters')
        .select('id, name, status')
        .eq('status', 'active');

      if (error) {
        console.error('Error fetching headquarters:', error);
        throw error;
      }

      return data as Headquarter[];
    },
  });

  // Resource for loading roles
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

  // Resource for loading seasons
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

  // Initialize form for creating a new agreement
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

  // Initialize form for editing an existing agreement
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

  // Create a new agreement
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

  // Update an existing agreement
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

  isLoading = computed(() => this.agreements.isLoading());
  loadingError = computed(() => this.agreements.error);

  isDetailLoading = computed(() => this.agreementById.isLoading());
  detailLoadingError = computed(() => this.agreementById.error);

  isHeadquartersLoading = computed(() => this.headquarters.isLoading());
  isRolesLoading = computed(() => this.roles.isLoading());
  isSeasonsLoading = computed(() => this.seasons.isLoading());

  headquartersResource = linkedSignal(() => this.headquarters.value() ?? []);
  rolesResource = linkedSignal(() => this.roles.value() ?? []);
  seasonsResource = linkedSignal(() => this.seasons.value() ?? []);
}
