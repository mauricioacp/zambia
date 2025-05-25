import { computed, inject, Injectable, linkedSignal, resource, signal, WritableSignal } from '@angular/core';
import { SupabaseService } from '@zambia/data-access-supabase';
import { Database } from '@zambia/types-supabase';

export type Workshop = Database['public']['Tables']['scheduled_workshops']['Row'];
export type WorkshopType = Database['public']['Tables']['master_workshop_types']['Row'];
export type Headquarter = Database['public']['Tables']['headquarters']['Row'];
export type Season = Database['public']['Tables']['seasons']['Row'];
export type Collaborator = Database['public']['Tables']['collaborators']['Row'];

export interface WorkshopFormData {
  id?: string;
  local_name: string;
  master_workshop_type_id: number;
  facilitator_id: string;
  headquarter_id: string;
  season_id: string;
  start_datetime: string;
  end_datetime: string;
  location_details?: string | null;
  status: string;
}

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

  // Form state management
  isEditing = signal<boolean>(false);
  formData = signal<WorkshopFormData | null>(null);
  saveError = signal<string | null>(null);
  saveSuccess = signal<boolean>(false);

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

  // Resource for loading facilitators (collaborators)
  facilitators = resource({
    loader: async () => {
      const { data, error } = await this.supabase
        .getClient()
        .from('collaborators')
        .select('user_id, role_id, headquarter_id, status')
        .eq('status', 'active');

      if (error) {
        console.error('Error fetching facilitators:', error);
        throw error;
      }

      return data as Collaborator[];
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

  loadWorkshopById() {
    this.workshopById.reload();
  }

  loadWorkshops() {
    this.workshops.reload();
  }

  loadWorkshopTypes() {
    this.workshopTypes.reload();
  }

  loadFacilitators() {
    this.facilitators.reload();
  }

  loadHeadquarters() {
    this.headquarters.reload();
  }

  loadSeasons() {
    this.seasons.reload();
  }

  // Initialize form for creating a new workshop
  initCreateForm() {
    this.isEditing.set(false);
    this.saveError.set(null);
    this.saveSuccess.set(false);
    this.formData.set({
      local_name: '',
      master_workshop_type_id: 0,
      facilitator_id: '',
      headquarter_id: '',
      season_id: '',
      start_datetime: new Date().toISOString(),
      end_datetime: new Date().toISOString(),
      location_details: '',
      status: 'active',
    });
  }

  // Initialize form for editing an existing workshop
  initEditForm(workshop: WorkshopWithRelations) {
    this.isEditing.set(true);
    this.saveError.set(null);
    this.saveSuccess.set(false);
    this.formData.set({
      id: workshop.id,
      local_name: workshop.local_name,
      master_workshop_type_id: workshop.master_workshop_type_id,
      facilitator_id: workshop.facilitator_id,
      headquarter_id: workshop.headquarter_id,
      season_id: workshop.season_id,
      start_datetime: workshop.start_datetime,
      end_datetime: workshop.end_datetime,
      location_details: workshop.location_details,
      status: workshop.status,
    });
  }

  // Create a new workshop
  async createWorkshop(formData: WorkshopFormData) {
    try {
      this.saveError.set(null);
      this.saveSuccess.set(false);

      const { data, error } = await this.supabase
        .getClient()
        .from('scheduled_workshops')
        .insert([
          {
            local_name: formData.local_name,
            master_workshop_type_id: formData.master_workshop_type_id,
            facilitator_id: formData.facilitator_id,
            headquarter_id: formData.headquarter_id,
            season_id: formData.season_id,
            start_datetime: formData.start_datetime,
            end_datetime: formData.end_datetime,
            location_details: formData.location_details,
            status: formData.status,
          },
        ])
        .select()
        .single();

      if (error) {
        this.saveError.set(error.message);
        return null;
      }

      // Also create entry in facilitator_workshop_map
      await this.supabase
        .getClient()
        .from('facilitator_workshop_map')
        .insert([
          {
            facilitator_id: formData.facilitator_id,
            workshop_id: data.id,
            headquarter_id: formData.headquarter_id,
            season_id: formData.season_id,
          },
        ]);

      this.workshops.reload();
      this.saveSuccess.set(true);
      return data;
    } catch (error) {
      console.error('Error creating workshop:', error);
      this.saveError.set(error instanceof Error ? error.message : 'Unknown error occurred');
      return null;
    }
  }

  // Update an existing workshop
  async updateWorkshop(formData: WorkshopFormData) {
    try {
      this.saveError.set(null);
      this.saveSuccess.set(false);

      if (!formData.id) {
        this.saveError.set('Workshop ID is missing');
        return null;
      }

      const { data, error } = await this.supabase
        .getClient()
        .from('scheduled_workshops')
        .update({
          local_name: formData.local_name,
          master_workshop_type_id: formData.master_workshop_type_id,
          facilitator_id: formData.facilitator_id,
          headquarter_id: formData.headquarter_id,
          season_id: formData.season_id,
          start_datetime: formData.start_datetime,
          end_datetime: formData.end_datetime,
          location_details: formData.location_details,
          status: formData.status,
        })
        .eq('id', formData.id)
        .select()
        .single();

      if (error) {
        this.saveError.set(error.message);
        return null;
      }

      // Also update entry in facilitator_workshop_map if facilitator changed
      await this.supabase
        .getClient()
        .from('facilitator_workshop_map')
        .update({
          facilitator_id: formData.facilitator_id,
          headquarter_id: formData.headquarter_id,
          season_id: formData.season_id,
        })
        .eq('workshop_id', formData.id);

      this.workshopById.reload();
      this.workshops.reload();
      this.saveSuccess.set(true);
      return data;
    } catch (error) {
      console.error('Error updating workshop:', error);
      this.saveError.set(error instanceof Error ? error.message : 'Unknown error occurred');
      return null;
    }
  }

  isLoading = computed(() => this.workshops.isLoading());
  loadingError = computed(() => this.workshops.error);

  isDetailLoading = computed(() => this.workshopById.isLoading());
  detailLoadingError = computed(() => this.workshopById.error);

  isTypesLoading = computed(() => this.workshopTypes.isLoading());
  typesLoadingError = computed(() => this.workshopTypes.error);

  isFacilitatorsLoading = computed(() => this.facilitators.isLoading());
  isHeadquartersLoading = computed(() => this.headquarters.isLoading());
  isSeasonsLoading = computed(() => this.seasons.isLoading());

  facilitatorsResource = linkedSignal(() => this.facilitators.value() ?? []);
  headquartersResource = linkedSignal(() => this.headquarters.value() ?? []);
  seasonsResource = linkedSignal(() => this.seasons.value() ?? []);
}
