import { computed, inject, Injectable, linkedSignal, resource, signal, WritableSignal } from '@angular/core';
import { SupabaseService } from '@zambia/data-access-supabase';
import { Database } from '@zambia/types-supabase';

export type Country = Database['public']['Tables']['countries']['Row'];
export type CountryInsert = Database['public']['Tables']['countries']['Insert'];
export type CountryUpdate = Database['public']['Tables']['countries']['Update'];
export type Headquarter = Database['public']['Tables']['headquarters']['Row'];

export interface CountryWithHeadquarters extends Country {
  headquarters: Headquarter[];
}

export interface CountryFormData {
  name: string;
  code: string;
  status: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class CountriesFacadeService {
  private supabase = inject(SupabaseService);
  countryId: WritableSignal<string> = signal('');
  countriesResource = linkedSignal(() => this.countries.value() ?? []);
  countryByIdResource = linkedSignal(() => this.countryById.value() ?? null);

  countries = resource({
    loader: async () => {
      const { data, error } = await this.supabase
        .getClient()
        .from('countries')
        .select('id, name, code, status')
        .order('name');

      if (error) {
        console.error('Error fetching countries:', error);
        throw error;
      }

      return data as Country[];
    },
  });

  countryById = resource({
    params: () => (this.countryId() ? { countryId: this.countryId() } : undefined),
    loader: async ({ params }) => {
      if (!params) return null;

      const { data, error } = await this.supabase
        .getClient()
        .from('countries')
        .select(
          `
          *,
          headquarters(*)
        `
        )
        .eq('id', params.countryId)
        .single();

      if (error) {
        console.error(`Error fetching country with ID ${params.countryId}:`, error);
        throw error;
      }

      return data as CountryWithHeadquarters;
    },
  });

  loadCountryById() {
    this.countryById.reload();
  }

  isLoading = computed(() => this.countries.isLoading());
  countriesLoadingError = computed(() => this.countries.error());

  isDetailLoading = computed(() => this.countryById.isLoading());
  detailLoadingError = computed(() => this.countryById.error());

  async createCountry(countryData: CountryFormData): Promise<Country> {
    const { data, error } = await this.supabase
      .getClient()
      .from('countries')
      .insert({
        name: countryData.name,
        code: countryData.code,
        status: countryData.status,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating country:', error);
      throw error;
    }

    this.countries.reload();
    return data as Country;
  }

  async updateCountry(id: string, countryData: Partial<CountryFormData>): Promise<Country> {
    const { data, error } = await this.supabase
      .getClient()
      .from('countries')
      .update(countryData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating country:', error);
      throw error;
    }

    this.countries.reload();
    if (this.countryId() === id) {
      this.countryById.reload();
    }
    return data as Country;
  }

  async deleteCountry(id: string): Promise<void> {
    const { error } = await this.supabase.getClient().from('countries').delete().eq('id', id);

    if (error) {
      console.error('Error deleting country:', error);
      throw error;
    }

    this.countries.reload();
  }
}
