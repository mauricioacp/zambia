import { computed, inject, Injectable, resource, signal } from '@angular/core';
import { SupabaseService } from '@zambia/data-access-supabase';
import { RoleService } from '@zambia/data-access-roles-permissions';
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

  private readonly isLoadingSignal = signal(false);

  private homePageStats = resource({
    request: () => ({}),
    loader: async () => {
      this.isLoadingSignal.set(true);
      try {
        const isGlobalView = this.roleService.roleLevel() !== null && Number(this.roleService.roleLevel()) >= 51;

        // For now, return mock data until the RPC functions are created in Supabase
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

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));

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
    if (!this.homePageStats.hasValue()) {
      return [];
    }

    const stats = this.homePageStats.value();
    const isGlobalView = this.roleService.roleLevel() !== null && Number(this.roleService.roleLevel()) >= 51;

    const baseMetrics: KpiData[] = [
      {
        id: 'students',
        title: 'Estudiantes',
        value: stats.total_students,
        trend: stats.active_students > stats.total_students * 0.8 ? 'up' : 'stable',
        trendPercentage: Math.round((stats.active_students / stats.total_students) * 100),
        icon: 'user',
        iconBgClass: 'bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700',
        route: '/dashboard/students',
        subtitle: `${stats.active_students} activos`,
      },
      {
        id: 'collaborators',
        title: 'Colaboradores',
        value: stats.total_collaborators,
        trend: stats.active_collaborators > stats.total_collaborators * 0.9 ? 'up' : 'stable',
        trendPercentage: Math.round((stats.active_collaborators / stats.total_collaborators) * 100),
        icon: 'users',
        iconBgClass: 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700',
        route: '/dashboard/collaborators',
        subtitle: `${stats.active_collaborators} activos`,
      },
      {
        id: 'workshops',
        title: 'Talleres',
        value: stats.total_workshops,
        trend: stats.completed_workshops > stats.total_workshops * 0.7 ? 'up' : 'down',
        trendPercentage: Math.round((stats.completed_workshops / stats.total_workshops) * 100),
        icon: 'book-open',
        iconBgClass: 'bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700',
        route: '/dashboard/workshops',
        subtitle: `${stats.completed_workshops} completados`,
      },
      {
        id: 'agreements',
        title: 'Acuerdos',
        value: stats.total_agreements,
        trend: stats.pending_agreements < stats.total_agreements * 0.2 ? 'up' : 'down',
        trendPercentage: Math.round(
          ((stats.total_agreements - stats.pending_agreements) / stats.total_agreements) * 100
        ),
        icon: 'file-text',
        iconBgClass: 'bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700',
        route: '/dashboard/agreements',
        subtitle: `${stats.pending_agreements} pendientes`,
      },
    ];

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

    return baseMetrics;
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
        route: '/dashboard/students',
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
        id: 'workshop-status',
        title: 'Estado de Talleres',
        iconPath:
          'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
        iconBgClass: 'from-purple-500 to-indigo-500',
        route: '/dashboard/workshops',
        metrics: [
          {
            label: 'Talleres Completados',
            value: stats.completed_workshops,
            colorClass: 'text-purple-600 dark:text-purple-400',
          },
          {
            label: 'Tasa de Finalización',
            value: `${Math.round((stats.completed_workshops / stats.total_workshops) * 100)}%`,
            colorClass:
              stats.completed_workshops / stats.total_workshops > 0.7
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
        route: '/dashboard/panel',
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
          route: '/dashboard/reports',
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

    return baseActions.slice(0, 8); // Limit to 8 actions
  });

  isLoading = computed(() => this.isLoadingSignal() || this.homePageStats.isLoading());
}
