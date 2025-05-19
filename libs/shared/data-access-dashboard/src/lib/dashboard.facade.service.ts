import { computed, inject, Injectable, resource } from '@angular/core';
import { SupabaseService } from '@zambia/data-access-supabase';
import {
  AgreementReviewStatistics,
  DashboardStatistics,
  ReviewStat,
  ReviewStatRecord,
  StatBadge,
} from './dashboard-data.models';
import { RolesAccessService } from '@zambia/util-roles-definitions';

@Injectable({ providedIn: 'root' })
export class DashboardFacadeService {
  private supabase = inject(SupabaseService);
  private roleAccess = inject(RolesAccessService);

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
    overall: 'bg-sky-500',
  };

  private readonly textColorMap = {
    countries: 'text-blue-400',
    headquarters: 'text-purple-400',
    collaborators: 'text-indigo-400',
    students: 'text-green-400',
    konsejo_members: 'text-amber-400',
    directors: 'text-pink-400',
    facilitators: 'text-teal-400',
    companions: 'text-orange-400',
    overall: 'text-sky-400',
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

  private rawAgreementsReviewStatistics = resource({
    request: () => ({}),
    loader: async () => {
      const { data, error } = await this.supabase.getClient().rpc('get_dashboard_agreement_review_statistics');
      console.log(data);

      if (error) {
        console.error('Error fetching dashboard statistics:', error);
        throw error;
      }

      return data as unknown as AgreementReviewStatistics;
    },
  });

  reviewStatsLoading = computed(() => this.rawAgreementsReviewStatistics.isLoading());

  globalDataLoading = computed(() => this.rawStats.isLoading());

  allStats = computed<StatBadge[]>(() => {
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

  private limitedStats = computed<StatBadge[]>(() => {
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
    ];
  });

  dashboardStats = computed<StatBadge[]>(() => {
    return this.roleAccess.hasFullDashboardAccess() ? this.allStats() : this.limitedStats();
  });

  agreementReviewStats = computed(() => {
    if (!this.rawAgreementsReviewStatistics.hasValue()) {
      return null;
    }

    const data = this.rawAgreementsReviewStatistics.value();
    const titleMap: Record<string, string> = {
      students: 'Estudiantes',
      collaborators: 'Colaboradores',
      konsejo_members: 'Miembros del Konsejo',
      directors: 'Directores',
      facilitators: 'Facilitadores',
      companions: 'Acompañantes',
      overall: 'General',
    };

    return Object.entries(data).reduce((acc, [key, value]) => {
      acc[key] = {
        id: key,
        title: titleMap[key] || key,
        pending: value.pending,
        reviewed: value.reviewed,
        total: value.total,
        percentage_reviewed: value.percentage_reviewed,
        color: this.colorMap[key as keyof typeof this.colorMap] || 'bg-gray-500',
        textColor: this.textColorMap[key as keyof typeof this.textColorMap] || 'text-gray-400',
        iconSvg: this.getIconSvg(key as keyof typeof this.iconMap),
      };
      return acc;
    }, {} as ReviewStatRecord);
  });

  overallStat = computed(() => {
    if (!this.agreementReviewStats()) return null;
    return this.agreementReviewStats()?.['overall'];
  });

  otherStats = computed(() => {
    const stats = this.agreementReviewStats();
    if (!stats) return [];

    const displayOrder = ['students', 'collaborators', 'konsejo_members', 'directors', 'facilitators', 'companions'];
    return displayOrder.map((key) => stats[key]).filter((stat): stat is ReviewStat => !!stat);
  });

  private getIconSvg(key: string): string {
    const lucideIconMap: Record<string, string> = {
      students: 'user',
      collaborators: 'users',
      konsejo_members: 'star',
      directors: 'briefcase',
      facilitators: 'book-open',
      companions: 'heart',
      overall: 'pie-chart',
    };

    return lucideIconMap[key] || 'circle';
  }
}
