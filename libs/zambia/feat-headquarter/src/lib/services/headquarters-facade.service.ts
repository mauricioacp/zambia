import { computed, inject, Injectable, linkedSignal, resource, signal, WritableSignal } from '@angular/core';
import { SupabaseService } from '@zambia/data-access-supabase';
import { Database } from '@zambia/types-supabase';

export type Headquarter = Database['public']['Tables']['headquarters']['Row'];
export type Country = Database['public']['Tables']['countries']['Row'];
export type ScheduledWorkshop = Database['public']['Tables']['scheduled_workshops']['Row'];
export type Season = Database['public']['Tables']['seasons']['Row'];
export type Agreement = Database['public']['Tables']['agreements']['Row'];
export type Role = Database['public']['Tables']['roles']['Row'];

export interface AgreementWithRole extends Agreement {
  role?: Pick<Role, 'name' | 'code'>;
}
export interface HeadquarterWithRelations extends Headquarter {
  countries?: Pick<Country, 'name' | 'code'>;
  scheduled_workshops?: ScheduledWorkshop[];
  seasons?: Season[];
  agreements?: AgreementWithRole[];
}

@Injectable({
  providedIn: 'root',
})
export class HeadquartersFacadeService {
  private supabase = inject(SupabaseService);
  headquarterId: WritableSignal<string> = signal('');
  headquartersResourceValue = linkedSignal(() => this.headquarters.value() ?? []);
  headquarterByIdResource = linkedSignal(() => this.headquarterById.value() ?? null);

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

  headquarterById = resource({
    request: () => ({ headquarterId: this.headquarterId() }),
    loader: async ({ request }) => {
      const { data: rawSupabaseData, error } = await this.supabase
        .getClient()
        .from('headquarters')
        .select(
          `
          *,
          countries(name, code),
          scheduled_workshops:scheduled_workshops!scheduled_workshops_headquarter_id_fkey(*),
          seasons:seasons!seasons_headquarter_id_fkey(*),
          agreement_with_role(*)
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
        countries: rawSupabaseData.countries || undefined,
        scheduled_workshops: (rawSupabaseData.scheduled_workshops as ScheduledWorkshop[]) || [],
        seasons: (rawSupabaseData.seasons as Season[]) || [],
        agreements: (rawSupabaseData.agreement_with_role as unknown as AgreementWithRole[]) || [],
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
  loadingError = computed(() => this.headquarters.error);

  isDetailLoading = computed(() => this.headquarterById.isLoading());
  detailLoadingError = computed(() => this.headquarterById.error);
}
