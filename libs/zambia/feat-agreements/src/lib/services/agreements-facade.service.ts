import { computed, inject, Injectable, linkedSignal, resource, signal, Signal } from '@angular/core';
import { SupabaseService } from '@zambia/data-access-supabase';
import { Database } from '@zambia/types-supabase';

export type Agreement = Database['public']['Tables']['agreements']['Row'];
export type Headquarter = Database['public']['Tables']['headquarters']['Row'];
export type Country = Database['public']['Tables']['countries']['Row'];

// For the list of agreements
export interface AgreementWithShallowRelations extends Agreement {
  headquarters?: Pick<Headquarter, 'name'> & {
    // headquarter is expected to be present
    countries?: Pick<Country, 'name'>; // country is expected to be present within headquarter
  };
}

// For a single agreement by ID
export interface AgreementDetails extends Agreement {
  headquarters?: Pick<Headquarter, 'id' | 'name' | 'address' | 'status'> & {
    countries?: Pick<Country, 'id' | 'name' | 'code'>;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AgreementsFacadeService {
  private supabase = inject(SupabaseService);
  agreementId: Signal<string> = signal('');
  agreementsResource = linkedSignal(() => this.agreements.value() ?? []);
  agreementByIdResource = linkedSignal(() => this.agreementById.value() ?? null);

  agreements = resource({
    loader: async () => {
      const { data, error } = await this.supabase
        .getClient()
        .from('agreements')
        // Fetch countries through headquarters: headquarters!inner(name, countries!inner(name))
        // The !inner ensures that headquarters and countries within them must exist.
        .select('*, headquarters!inner(name, countries!inner(name))')
        .order('start_date', { ascending: false });

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
          )
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

  loadAgreementById() {
    this.agreementById.reload();
  }

  isLoading = computed(() => this.agreements.isLoading());
  loadingError = computed(() => this.agreements.error);

  isDetailLoading = computed(() => this.agreementById.isLoading());
  detailLoadingError = computed(() => this.agreementById.error);
}
