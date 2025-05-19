import { computed, inject, Injectable, linkedSignal, resource, signal, Signal } from '@angular/core';
import { SupabaseService } from '@zambia/data-access-supabase';
import { Database } from '@zambia/types-supabase';

export type Agreement = Database['public']['Tables']['agreements']['Row'];

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
        .select('*, headquarters(name), countries(name)')
        .order('start_date', { ascending: false });

      if (error) {
        console.error('Error fetching agreements:', error);
        throw error;
      }

      return data as Agreement[];
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
          headquarters(id, name, address, status),
          countries(id, name, code)
        `
        )
        .eq('id', request.agreementId)
        .single();

      if (error) {
        console.error(`Error fetching agreement with ID ${request.agreementId}:`, error);
        throw error;
      }

      return data as Agreement;
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
