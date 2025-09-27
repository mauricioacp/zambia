import { computed, inject, Injectable, resource, signal } from '@angular/core';
import { SupabaseService } from '@zambia/data-access-supabase';
import { RoleService } from '@zambia/data-access-roles-permissions';
import { DashboardFacadeService } from '@zambia/data-access-dashboard';
import { ROLE } from '@zambia/util-roles-definitions';

export interface KpiData {
  id: string;
  title: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  icon: string;
  iconBgClass: string;
  route: string;
  subtitle?: string;
}

export interface QuickActionData {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconBgClass: string;
  route?: string;
  action?: () => void;
}

export interface StatusCard {
  id: string;
  title: string;
  iconPath: string;
  iconBgClass: string;
  route: string;
  metrics: StatusMetric[];
}

export interface StatusMetric {
  label: string;
  value: string | number;
  colorClass: string;
}

export interface HomepageStatistics {
  total_students: number;
  active_students: number;
  total_collaborators: number;
  active_collaborators: number;
  total_workshops: number;
  completed_workshops: number;
  pending_agreements: number;
  total_agreements: number;
  total_headquarters?: number;
  active_headquarters?: number;
  total_countries?: number;
  active_countries?: number;
}

@Injectable({ providedIn: 'root' })
export class HomepageFacadeService {
  private supabase = inject(SupabaseService);
  private roleService = inject(RoleService);
  private dashboardFacade = inject(DashboardFacadeService);

  private readonly isLoadingSignal = signal(false);

  private homePageStats = resource({
    loader: async () => {
      this.isLoadingSignal.set(true);
      try {
        const isGlobalView = this.roleService.roleLevel() !== null && Number(this.roleService.roleLevel()) >= 51;
        const mockStats: HomepageStatistics = {
          total_students: isGlobalView ? 1250 : 85,
          active_students: isGlobalView ? 1180 : 78,
          total_collaborators: isGlobalView ? 156 : 12,
          active_collaborators: isGlobalView ? 145 : 11,
          total_workshops: isGlobalView ? 89 : 8,
          completed_workshops: isGlobalView ? 67 : 6,
          pending_agreements: isGlobalView ? 23 : 2,
          total_agreements: isGlobalView ? 890 : 65,
          ...(isGlobalView && {
            total_headquarters: 18,
            active_headquarters: 16,
            total_countries: 4,
            active_countries: 4,
          }),
        };

        return mockStats;

        /* TODO: Uncomment when RPC functions are created in Supabase
        let rpcFunction = 'get_homepage_statistics';
        let params = {};

        if (!isGlobalView) {
          rpcFunction = 'get_homepage_statistics_hq';
          params = {
            p_hq_id: this.roleService.hqId(),
            p_season_id: this.roleService.seasonId()
          };
        }

        const { data, error } = await this.supabase.getClient().rpc(rpcFunction as any, params);

        if (error) {
          console.error('Error fetching homepage statistics:', error);
          throw error;
        }

        return data as unknown as HomepageStatistics;
        */
      } finally {
        this.isLoadingSignal.set(false);
      }
    },
  });

  keyMetrics = computed<KpiData[]>(() => {
    const agreementStats = this.dashboardFacade.agreementReviewStats();
    const isGlobalView = this.roleService.roleLevel() !== null && Number(this.roleService.roleLevel()) >= 51;

    const baseMetrics: KpiData[] = [];

    if (agreementStats) {
      const students = agreementStats['students'];
      if (students) {
        baseMetrics.push({
          id: 'students',
          title: 'Estudiantes',
          value: students.total,
          trend: students.percentage_reviewed > 80 ? 'up' : 'down',
          trendPercentage: students.percentage_reviewed,
          icon: 'user',
          iconBgClass: 'bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700',
          route: '/dashboard/agreements?role=student',
          subtitle: `${students.reviewed} revisados`,
        });
      }

      const collaborators = agreementStats['collaborators'];
      if (collaborators) {
        baseMetrics.push({
          id: 'collaborators',
          title: 'Colaboradores',
          value: collaborators.total,
          trend: collaborators.percentage_reviewed > 80 ? 'up' : 'down',
          trendPercentage: collaborators.percentage_reviewed,
          icon: 'users',
          iconBgClass: 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700',
          route: '/dashboard/agreements?role=collaborator',
          subtitle: `${collaborators.reviewed} revisados`,
        });
      }

      const facilitators = agreementStats['facilitators'];
      if (facilitators) {
        baseMetrics.push({
          id: 'facilitators',
          title: 'Facilitadores',
          value: facilitators.total,
          trend: facilitators.percentage_reviewed > 80 ? 'up' : 'down',
          trendPercentage: facilitators.percentage_reviewed,
          icon: 'book-open',
          iconBgClass: 'bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700',
          route: '/dashboard/agreements?role=facilitator',
          subtitle: `${facilitators.reviewed} revisados`,
        });
      }

      const companions = agreementStats['companions'];
      if (companions) {
        baseMetrics.push({
          id: 'companions',
          title: 'Acompañantes',
          value: companions.total,
          trend: companions.percentage_reviewed > 80 ? 'up' : 'down',
          trendPercentage: companions.percentage_reviewed,
          icon: 'heart',
          iconBgClass: 'bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700',
          route: '/dashboard/agreements?role=companion',
          subtitle: `${companions.reviewed} revisados`,
        });
      }

      const konsejoMembers = agreementStats['konsejo_members'];
      if (isGlobalView && konsejoMembers) {
        baseMetrics.push({
          id: 'konsejo_members',
          title: 'Miembros del Konsejo',
          value: konsejoMembers.total,
          trend: konsejoMembers.percentage_reviewed > 80 ? 'up' : 'down',
          trendPercentage: konsejoMembers.percentage_reviewed,
          icon: 'star',
          iconBgClass: 'bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700',
          route: '/dashboard/agreements?role=konsejo_member',
          subtitle: `${konsejoMembers.reviewed} revisados`,
        });
      }

      const directors = agreementStats['directors'];
      if (isGlobalView && directors) {
        baseMetrics.push({
          id: 'directors',
          title: 'Directores',
          value: directors.total,
          trend: directors.percentage_reviewed > 80 ? 'up' : 'down',
          trendPercentage: directors.percentage_reviewed,
          icon: 'briefcase',
          iconBgClass: 'bg-gradient-to-br from-pink-500 via-pink-600 to-pink-700',
          route: '/dashboard/agreements?role=director',
          subtitle: `${directors.reviewed} revisados`,
        });
      }
    }

    if (this.homePageStats.hasValue()) {
      const stats = this.homePageStats.value();

      if (isGlobalView && stats.total_headquarters !== undefined) {
        baseMetrics.push({
          id: 'headquarters',
          title: 'Sedes',
          value: stats.total_headquarters,
          trend: (stats.active_headquarters || 0) > stats.total_headquarters * 0.9 ? 'up' : 'stable',
          trendPercentage: Math.round(((stats.active_headquarters || 0) / stats.total_headquarters) * 100),
          icon: 'landmark',
          iconBgClass: 'bg-gradient-to-br from-cyan-500 via-cyan-600 to-cyan-700',
          route: '/dashboard/headquarters',
          subtitle: `${stats.active_headquarters || 0} activas`,
        });
      }

      if (isGlobalView && stats.total_countries !== undefined) {
        baseMetrics.push({
          id: 'countries',
          title: 'Países',
          value: stats.total_countries,
          trend: (stats.active_countries || 0) > stats.total_countries * 0.8 ? 'up' : 'stable',
          trendPercentage: Math.round(((stats.active_countries || 0) / stats.total_countries) * 100),
          icon: 'globe',
          iconBgClass: 'bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-700',
          route: '/dashboard/countries',
          subtitle: `${stats.active_countries || 0} activos`,
        });
      }
    }

    return baseMetrics.slice(0, 8);
  });

  statusCards = computed<StatusCard[]>(() => {
    if (!this.homePageStats.hasValue()) {
      return [];
    }

    const stats = this.homePageStats.value();
    const isGlobalView = this.roleService.roleLevel() !== null && Number(this.roleService.roleLevel()) >= 51;

    const cards: StatusCard[] = [
      {
        id: 'student-progress',
        title: 'Progreso Estudiantil',
        iconPath:
          'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z',
        iconBgClass: 'from-emerald-500 to-teal-500',
        route: '/dashboard/students/progress',
        metrics: [
          {
            label: 'Estudiantes Activos',
            value: stats.active_students,
            colorClass: 'text-emerald-600 dark:text-emerald-400',
          },
          {
            label: 'Tasa de Participación',
            value: `${Math.round((stats.active_students / stats.total_students) * 100)}%`,
            colorClass:
              stats.active_students / stats.total_students > 0.8
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-orange-600 dark:text-orange-400',
          },
        ],
      },
      {
        id: 'collaboration-status',
        title: 'Estado de la Colaboración',
        iconPath:
          'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
        iconBgClass: 'from-purple-500 to-indigo-500',
        route: '/dashboard/collaborators/demographics',
        metrics: [
          {
            label: 'Colaboradores Activos',
            value: stats.active_collaborators,
            colorClass: 'text-purple-600 dark:text-purple-400',
          },
          {
            label: 'Tasa de Participación',
            value: `${Math.round((stats.active_collaborators / stats.total_collaborators) * 100)}%`,
            colorClass:
              stats.active_collaborators / stats.total_collaborators > 0.8
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-orange-600 dark:text-orange-400',
          },
        ],
      },
    ];

    if (isGlobalView) {
      cards.push({
        id: 'organizational-health',
        title: 'Salud Organizacional',
        iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
        iconBgClass: 'from-blue-500 to-cyan-500',
        route: '/dashboard/organizational-health',
        metrics: [
          {
            label: 'Sedes Activas',
            value: stats.active_headquarters || 0,
            colorClass: 'text-blue-600 dark:text-blue-400',
          },
          {
            label: 'Países Operativos',
            value: stats.active_countries || 0,
            colorClass: 'text-cyan-600 dark:text-cyan-400',
          },
        ],
      });
    }

    return cards;
  });

  getQuickActionsForRole = computed<QuickActionData[]>(() => {
    const role = this.roleService.userRole();
    const isGlobalView = this.roleService.roleLevel() !== null && Number(this.roleService.roleLevel()) >= 51;

    const baseActions: QuickActionData[] = [
      {
        id: 'my-profile',
        title: 'Mi Perfil',
        description: 'Ver y editar información personal',
        icon: 'user',
        iconBgClass: 'bg-gradient-to-r from-blue-500 to-blue-600',
        route: '/dashboard/profile',
      },
    ];

    if (isGlobalView) {
      baseActions.unshift(
        {
          id: 'global-reports',
          title: 'Reportes Globales',
          description: 'Análisis y métricas organizacionales',
          icon: 'bar-chart-3',
          iconBgClass: 'bg-gradient-to-r from-purple-500 to-pink-500',
          route: '/dashboard/panel',
        },
        {
          id: 'manage-countries',
          title: 'Gestionar Países',
          description: 'Administrar países y regiones',
          icon: 'globe',
          iconBgClass: 'bg-gradient-to-r from-indigo-500 to-purple-500',
          route: '/dashboard/countries',
        },
        {
          id: 'manage-headquarters',
          title: 'Gestionar Sedes',
          description: 'Supervisar sedes organizacionales',
          icon: 'landmark',
          iconBgClass: 'bg-gradient-to-r from-cyan-500 to-blue-500',
          route: '/dashboard/headquarters',
        }
      );
    }

    if (this.roleService.isInAnyGroup(['HEADQUARTERS_MANAGEMENT'])) {
      baseActions.unshift(
        {
          id: 'my-headquarters',
          title: 'Mi Sede',
          description: 'Gestionar tu sede y equipo',
          icon: 'landmark',
          iconBgClass: 'bg-gradient-to-r from-emerald-500 to-teal-500',
          route: '/dashboard/my-headquarters',
        },
        {
          id: 'season-management',
          title: 'Gestión de Temporada',
          description: 'Administrar temporada actual',
          icon: 'calendar',
          iconBgClass: 'bg-gradient-to-r from-orange-500 to-red-500',
          route: '/dashboard/seasons',
        }
      );
    }

    if (this.roleService.isInAnyGroup(['FIELD_STAFF'])) {
      if (role === ROLE.FACILITATOR) {
        baseActions.unshift({
          id: 'my-workshops',
          title: 'Mis Talleres',
          description: 'Ver y gestionar tus talleres',
          icon: 'book-open',
          iconBgClass: 'bg-gradient-to-r from-teal-500 to-green-500',
          route: '/dashboard/workshops/my-workshops',
        });
      }

      baseActions.unshift({
        id: 'my-agreements',
        title: 'Mis Acuerdos',
        description: 'Revisar acuerdos asignados',
        icon: 'file-text',
        iconBgClass: 'bg-gradient-to-r from-amber-500 to-orange-500',
        route: '/dashboard/agreements/my-agreements',
      });
    }

    return baseActions.slice(0, 8);
  });

  isLoading = computed(
    () => this.isLoadingSignal() || this.homePageStats.isLoading() || this.dashboardFacade.reviewStatsLoading()
  );
}
