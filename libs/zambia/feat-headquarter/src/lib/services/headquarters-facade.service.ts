import { computed, inject, Injectable, linkedSignal, resource, signal, WritableSignal } from '@angular/core';
import { SupabaseService } from '@zambia/data-access-supabase';
import { Database, Json } from '@zambia/types-supabase';

export type Headquarter = Database['public']['Tables']['headquarters']['Row'];
export type HeadquarterInsert = Database['public']['Tables']['headquarters']['Insert'];
export type HeadquarterUpdate = Database['public']['Tables']['headquarters']['Update'];
export type Country = Database['public']['Tables']['countries']['Row'];
export type ScheduledWorkshop = Database['public']['Tables']['scheduled_workshops']['Row'];
export type Season = Database['public']['Tables']['seasons']['Row'];
export type Agreement = Database['public']['Tables']['agreements']['Row'];
export type Role = Database['public']['Tables']['roles']['Row'];

export interface AgreementWithRole extends Agreement {
  role?: Pick<Role, 'name' | 'code'>;
}

export interface HeadquarterWithRelations extends Omit<Headquarter, 'contact_info'> {
  contact_info?: HeadquarterContactInfo | null;
  countries?: Pick<Country, 'name' | 'code'>;
  scheduled_workshops?: ScheduledWorkshop[];
  seasons?: Season[];
  agreements?: AgreementWithRole[];
}

export interface HeadquarterContactInfo {
  managerId?: string | null;
  managerName?: string | null;
  managerEmail?: string | null;
  managerPhone?: string | null;
  generalEmail?: string | null;
  generalPhone?: string | null;
  website?: string | null;
  socialMedia?: {
    facebook?: string | null;
    instagram?: string | null;
    twitter?: string | null;
    linkedin?: string | null;
  } | null;
  notes?: string | null;
}

export interface HeadquarterFormData {
  name: string;
  address?: string | null;
  contact_info?: HeadquarterContactInfo | null;
  country_id?: string | null;
  status: 'active' | 'inactive';
}

@Injectable({
  providedIn: 'root',
})
export class HeadquartersFacadeService {
  private supabase = inject(SupabaseService);
  headquarterId: WritableSignal<string> = signal('');
  headquartersResource = linkedSignal(() => this.headquarters.value() ?? []);
  headquarterByIdResource = linkedSignal(() => this.headquarterById.value() ?? null);

  headquarters = resource({
    loader: async () => {
      const { data, error } = await this.supabase
        .getClient()
        .from('headquarters')
        .select('id, name, address, status, countries(name, code)')
        .order('name');

      if (error) {
        console.error('Error fetching headquarters:', error);
        throw error;
      }

      return data as HeadquarterWithRelations[];
    },
  });

  headquarterById = resource({
    request: () => (this.headquarterId() ? { headquarterId: this.headquarterId() } : undefined),
    loader: async ({ request }) => {
      if (!request) return null;

      const { data: rawSupabaseData, error } = await this.supabase
        .getClient()
        .from('headquarters')
        .select(
          `
          *,
          countries(name, code),
          scheduled_workshops!scheduled_workshops_headquarter_id_fkey(*),
          seasons:seasons!seasons_headquarter_id_fkey(*)
        `
        )
        .eq('id', request.headquarterId)
        .single();

      if (error) {
        console.error(`Error fetching headquarter with ID ${request.headquarterId}:`, error);
        throw error;
      }

      if (!rawSupabaseData) {
        return null;
      }

      const headquarterData: HeadquarterWithRelations = {
        ...(rawSupabaseData as Headquarter),
        contact_info: this.parseContactInfo(rawSupabaseData.contact_info),
        countries: rawSupabaseData.countries || undefined,
        scheduled_workshops: (rawSupabaseData.scheduled_workshops as ScheduledWorkshop[]) || [],
        seasons: (rawSupabaseData.seasons as Season[]) || [],
        agreements: [],
      };

      if (headquarterData.agreements) {
        headquarterData.agreements.sort((a, b) => {
          const roleCodeA = (a.role?.code || '').toString();
          const roleCodeB = (b.role?.code || '').toString();
          return roleCodeA.localeCompare(roleCodeB);
        });
      }

      return headquarterData;
    },
  });

  loadHeadquarterById() {
    this.headquarterById.reload();
  }

  isLoading = computed(() => this.headquarters.isLoading());
  headquartersLoadingError = computed(() => this.headquarters.error());

  isDetailLoading = computed(() => this.headquarterById.isLoading());
  detailLoadingError = computed(() => this.headquarterById.error());

  private parseContactInfo(contactInfo: Json | null): HeadquarterContactInfo | null {
    if (!contactInfo || typeof contactInfo !== 'object') {
      return null;
    }

    try {
      return contactInfo as HeadquarterContactInfo;
    } catch (error) {
      console.warn('Failed to parse contact_info:', error);
      return null;
    }
  }

  createDefaultContactInfo(): HeadquarterContactInfo {
    return {
      managerId: null,
      managerName: null,
      managerEmail: null,
      managerPhone: null,
      generalEmail: null,
      generalPhone: null,
      website: null,
      socialMedia: {
        facebook: null,
        instagram: null,
        twitter: null,
        linkedin: null,
      },
      notes: null,
    };
  }

  async updateManagerInfo(
    headquarterId: string,
    managerId: string,
    managerName: string,
    managerEmail?: string,
    managerPhone?: string
  ): Promise<void> {
    const currentHeadquarter = this.headquarterByIdResource();
    if (!currentHeadquarter || currentHeadquarter.id !== headquarterId) {
      throw new Error('Headquarter not found or not loaded');
    }

    const currentContactInfo = currentHeadquarter.contact_info || this.createDefaultContactInfo();
    const updatedContactInfo: HeadquarterContactInfo = {
      ...currentContactInfo,
      managerId,
      managerName,
      managerEmail: managerEmail || currentContactInfo.managerEmail,
      managerPhone: managerPhone || currentContactInfo.managerPhone,
    };

    await this.updateHeadquarter(headquarterId, {
      contact_info: updatedContactInfo,
    });
  }

  async clearManagerInfo(headquarterId: string): Promise<void> {
    const currentHeadquarter = this.headquarterByIdResource();
    if (!currentHeadquarter || currentHeadquarter.id !== headquarterId) {
      throw new Error('Headquarter not found or not loaded');
    }

    const currentContactInfo = currentHeadquarter.contact_info || this.createDefaultContactInfo();
    const updatedContactInfo: HeadquarterContactInfo = {
      ...currentContactInfo,
      managerId: null,
      managerName: null,
      managerEmail: null,
      managerPhone: null,
    };

    await this.updateHeadquarter(headquarterId, {
      contact_info: updatedContactInfo,
    });
  }

  async createHeadquarter(headquarterData: HeadquarterFormData): Promise<Headquarter> {
    const { data, error } = await this.supabase
      .getClient()
      .from('headquarters')
      .insert({
        name: headquarterData.name,
        address: headquarterData.address || null,
        contact_info: (headquarterData.contact_info as Json) || null,
        country_id: headquarterData.country_id || null,
        status: headquarterData.status,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating headquarter:', error);
      throw error;
    }

    this.headquarters.reload();
    return data as Headquarter;
  }

  async updateHeadquarter(id: string, headquarterData: Partial<HeadquarterFormData>): Promise<Headquarter> {
    const { data, error } = await this.supabase
      .getClient()
      .from('headquarters')
      .update({
        name: headquarterData.name,
        address: headquarterData.address || null,
        contact_info: (headquarterData.contact_info as Json) || null,
        country_id: headquarterData.country_id || null,
        status: headquarterData.status,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating headquarter:', error);
      throw error;
    }

    this.headquarters.reload();
    if (this.headquarterId() === id) {
      this.headquarterById.reload();
    }
    return data as Headquarter;
  }

  async deleteHeadquarter(id: string): Promise<void> {
    const { error } = await this.supabase.getClient().from('headquarters').delete().eq('id', id);

    if (error) {
      console.error('Error deleting headquarter:', error);
      throw error;
    }

    this.headquarters.reload();
  }
}
