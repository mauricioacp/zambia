import { computed, inject, Injectable, resource } from '@angular/core';
import { SupabaseService } from '@zambia/data-access-supabase';
import { DashboardStatistics, StatBadge } from './dashboard-data.models';

@Injectable({ providedIn: 'root' })
export class DashboardFacadeService {
  private supabase = inject(SupabaseService);

  private readonly iconMap = {
    countries: 'globe',
    headquarters: 'landmark',
    directors: 'user-round-check',
    facilitators: 'users',
    students: 'user-round',
    konsejo_members: 'sparkle',
    collaborators: 'circle-user-round',
    companions: 'users',
  };

  private readonly colorMap = {
    countries: 'bg-blue-500',
    headquarters: 'bg-purple-500',
    collaborators: 'bg-indigo-500',
    students: 'bg-green-500',
    konsejo_members: 'bg-amber-500',
    directors: 'bg-pink-500',
    facilitators: 'bg-teal-500',
    companions: 'bg-orange-500',
  };

  private rawStats = resource({
    request: () => ({}),
    loader: async () => {
      const { data, error } = await this.supabase.getClient().rpc('get_dashboard_statistics');
      console.log(data);

      if (error) {
        console.error('Error fetching dashboard statistics:', error);
        throw error;
      }

      return data as unknown as DashboardStatistics;
    },
  });

  globalDataLoading = computed(() => this.rawStats.isLoading());

  dashboardStats = computed<StatBadge[]>(() => {
    if (!this.rawStats.hasValue()) {
      return [];
    }

    const stats = this.rawStats.value();
    return [
      {
        label: 'Países',
        value: stats.countries.total,
        icon: this.iconMap.countries,
        color: this.colorMap.countries,
        details: {
          active: stats.countries.active,
          inactive: stats.countries.inactive,
        },
      },
      {
        label: 'Sedes',
        value: stats.headquarters.total,
        icon: this.iconMap.headquarters,
        color: this.colorMap.headquarters,
        details: {
          active: stats.headquarters.active,
          inactive: stats.headquarters.inactive,
        },
      },
      {
        label: 'Colaboradores',
        value: stats.collaborators.total,
        icon: this.iconMap.collaborators,
        color: this.colorMap.collaborators,
        details: {
          active: stats.collaborators.active,
          inactive: stats.collaborators.inactive,
        },
      },
      {
        label: 'Estudiantes',
        value: stats.students.total,
        icon: this.iconMap.students,
        color: this.colorMap.students,
        details: {
          active: stats.students.active,
          inactive: stats.students.inactive,
        },
      },
      {
        label: 'Miembros del Konsejo',
        value: stats.konsejo_members.total,
        icon: this.iconMap.konsejo_members,
        color: this.colorMap.konsejo_members,
        details: {
          active: stats.konsejo_members.active,
          inactive: stats.konsejo_members.inactive,
        },
      },
      {
        label: 'Directores',
        value: stats.directors.total,
        icon: this.iconMap.directors,
        color: this.colorMap.directors,
        details: {
          active: stats.directors.active,
          inactive: stats.directors.inactive,
        },
      },
      {
        label: 'Facilitadores',
        value: stats.facilitators.total,
        icon: this.iconMap.facilitators,
        color: this.colorMap.facilitators,
        details: {
          active: stats.facilitators.active,
          inactive: stats.facilitators.inactive,
        },
      },
      {
        label: 'Acompañantes',
        value: stats.companions.total,
        icon: this.iconMap.companions,
        color: this.colorMap.companions,
        details: {
          active: stats.companions.active,
          inactive: stats.companions.inactive,
        },
      },
    ];
  });

  refreshStats(): void {
    this.rawStats.reload();
  }
}
