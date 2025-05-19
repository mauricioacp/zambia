import { Injectable, inject, computed, signal, WritableSignal, linkedSignal } from '@angular/core';
import { SupabaseService } from '@zambia/data-access-supabase';
import { Database } from '@zambia/types-supabase';
import { resource } from '@angular/core';

export type Headquarter = Database['public']['Tables']['headquarters']['Row'];
export type Country = Database['public']['Tables']['countries']['Row'];
export type ScheduledWorkshop = Database['public']['Tables']['scheduled_workshops']['Row'];

export interface HeadquarterWithRelations extends Headquarter {
  countries?: Pick<Country, 'name' | 'code'>;
  scheduled_workshops?: ScheduledWorkshop[];
}

@Injectable({
  providedIn: 'root',
})
export class HeadquartersFacadeService {
  private supabase = inject(SupabaseService);
  headquarterId: WritableSignal<string> = signal('');
  headquartersResource = linkedSignal(() => this.headquarters.value() ?? []);
  headquarterByIdResource = linkedSignal(() => this.headquarterById.value() ?? null);

  // Resource for fetching all headquarters
  headquarters = resource({
    loader: async () => {
      const { data, error } = await this.supabase
        .getClient()
        .from('headquarters')
        .select('*, countries(name, code)')
        .order('name');

      if (error) {
        console.error('Error fetching headquarters:', error);
        throw error;
      }

      return data as HeadquarterWithRelations[];
    },
  });

  // Resource for fetching a single headquarter by ID
  headquarterById = resource({
    request: () => ({ headquarterId: this.headquarterId() }),
    loader: async ({ request }) => {
      const { data, error } = await this.supabase
        .getClient()
        .from('headquarters')
        .select(
          `
          *,
          countries(name, code),
          scheduled_workshops(
            id, 
            local_name, 
            start_datetime, 
            end_datetime, 
            status
          )
        `
        )
        .eq('id', request.headquarterId)
        .single();

      if (error) {
        console.error(`Error fetching headquarter with ID ${request.headquarterId}:`, error);
        throw error;
      }

      return data as HeadquarterWithRelations;
    },
  });

  loadHeadquarterById() {
    this.headquarterById.reload();
  }

  // Computed properties for loading and error states
  isLoading = computed(() => this.headquarters.isLoading());
  loadingError = computed(() => this.headquarters.error);

  isDetailLoading = computed(() => this.headquarterById.isLoading());
  detailLoadingError = computed(() => this.headquarterById.error);
}
