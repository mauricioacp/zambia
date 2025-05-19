import { computed, inject, Injectable, linkedSignal, resource, signal, WritableSignal } from '@angular/core';
import { SupabaseService } from '@zambia/data-access-supabase';
import { Database } from '@zambia/types-supabase';

export type Workshop = Database['public']['Tables']['scheduled_workshops']['Row'];
export type WorkshopType = Database['public']['Tables']['master_workshop_types']['Row'];
export type Headquarter = Database['public']['Tables']['headquarters']['Row'];
export type Season = Database['public']['Tables']['seasons']['Row'];
export type Collaborator = Database['public']['Tables']['collaborators']['Row'];

export interface WorkshopWithRelations extends Workshop {
  master_workshop_types?: Pick<WorkshopType, 'master_name' | 'master_description'>;
  headquarters?: Pick<Headquarter, 'name' | 'address' | 'contact_info'>;
  seasons?: Pick<Season, 'name' | 'start_date' | 'end_date'>;
  facilitator_workshop_map?: Array<{
    facilitator_id: string;
    collaborators?: Pick<Collaborator, 'user_id'>;
  }>;
}

@Injectable({
  providedIn: 'root',
})
export class WorkshopsFacadeService {
  private supabase = inject(SupabaseService);
  workshopId: WritableSignal<string> = signal('');
  workshopsResource = linkedSignal(() => this.workshops.value() ?? []);
  workshopByIdResource = linkedSignal(() => this.workshopById.value() ?? null);
  workshopTypesResource = linkedSignal(() => this.workshopTypes.value() ?? []);

  workshops = resource({
    loader: async () => {
      const { data, error } = await this.supabase
        .getClient()
        .from('scheduled_workshops')
        .select(
          `
          *,
          master_workshop_types(master_name, master_description),
          headquarters(name),
          seasons(name)
        `
        )
        .order('start_datetime', { ascending: false });

      if (error) {
        console.error('Error fetching workshops:', error);
        throw error;
      }

      return data as WorkshopWithRelations[];
    },
  });

  workshopById = resource({
    request: () => ({ workshopId: this.workshopId() }),
    loader: async ({ request }) => {
      const { data, error } = await this.supabase
        .getClient()
        .from('scheduled_workshops')
        .select(
          `
          *,
          master_workshop_types(master_name, master_description),
          headquarters(name, address, contact_info),
          seasons(name, start_date, end_date),
          facilitator_workshop_map(
            facilitator_id,
            collaborators(user_id)
          )
        `
        )
        .eq('id', request.workshopId)
        .single();

      if (error) {
        console.error(`Error fetching workshop with ID ${request.workshopId}:`, error);
        throw error;
      }

      return data as WorkshopWithRelations;
    },
  });

  workshopTypes = resource({
    loader: async () => {
      const { data, error } = await this.supabase
        .getClient()
        .from('master_workshop_types')
        .select('*')
        .order('master_name');

      if (error) {
        console.error('Error fetching workshop types:', error);
        throw error;
      }

      return data as WorkshopType[];
    },
  });

  loadWorkshopById() {
    this.workshopById.reload();
  }

  isLoading = computed(() => this.workshops.isLoading());
  loadingError = computed(() => this.workshops.error);

  isDetailLoading = computed(() => this.workshopById.isLoading());
  detailLoadingError = computed(() => this.workshopById.error);

  isTypesLoading = computed(() => this.workshopTypes.isLoading());
  typesLoadingError = computed(() => this.workshopTypes.error);
}
