import { computed, inject, Injectable, linkedSignal, resource, signal, WritableSignal } from '@angular/core';
import { SupabaseService } from '@zambia/data-access-supabase';
import { Database } from '@zambia/types-supabase';

export type Country = Database['public']['Tables']['countries']['Row'];
export type Headquarter = Database['public']['Tables']['headquarters']['Row'];

export interface CountryWithHeadquarters extends Country {
  headquarters: Headquarter[];
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
    request: () => ({ countryId: this.countryId() }),
    loader: async ({ request }) => {
      const { data, error } = await this.supabase
        .getClient()
        .from('countries')
        .select(
          `
          *,
          headquarters(*)
        `
        )
        .eq('id', request.countryId)
        .single();

      if (error) {
        console.error(`Error fetching country with ID ${request.countryId}:`, error);
        throw error;
      }

      return data as CountryWithHeadquarters;
    },
  });

  loadCountryById() {
    this.countryById.reload();
  }

  isLoading = computed(() => this.countries.isLoading());
  countriesLoadingError = computed(() => this.countries.error);

  isDetailLoading = computed(() => this.countryById.isLoading());
  detailLoadingError = computed(() => this.countryById.error);
}
