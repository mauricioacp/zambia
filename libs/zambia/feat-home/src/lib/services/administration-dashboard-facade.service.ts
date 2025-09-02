import { computed, inject, Injectable, resource, signal } from '@angular/core';
import { SupabaseService } from '@zambia/data-access-supabase';
import { NotificationService } from '@zambia/data-access-generic';
import { TranslateService } from '@ngx-translate/core';
import { Database } from '@zambia/types-supabase';
import { KpiData } from '@zambia/ui-components';

export type TableNames = keyof Database['public']['Tables'];
export type EntityRecord<T extends TableNames> = Database['public']['Tables'][T]['Row'];

interface EntityStatistics {
  total: number;
  active: number;
  inactive: number;
}

interface DashboardStatistics {
  countries: EntityStatistics;
  headquarters: EntityStatistics;
  agreements: EntityStatistics;
  profiles: EntityStatistics;
}

@Injectable({
  providedIn: 'root',
})
export class AdministrationDashboardFacadeService {
  private supabase = inject(SupabaseService);
  private notificationService = inject(NotificationService);
  private translate = inject(TranslateService);

  private _isRefreshing = signal(false);
  private _errorMessage = signal<string | null>(null);
  private _lastRefresh = signal<Date | null>(null);

  createEntityResource = <T extends TableNames>(
    tableName: T,
    options: {
      orderBy?: string;
      select?: string;
      errorContext?: string;
    } = {}
  ) => {
    const { orderBy = 'name', select = '*', errorContext = tableName } = options;

    return resource({
      loader: async (): Promise<EntityRecord<T>[]> => {
        try {
          const { data, error } = await this.supabase.getClient().from(tableName).select(select).order(orderBy);

          if (error) {
            console.error(`Error fetching ${errorContext}:`, error);
            this._errorMessage.set(`Failed to load ${errorContext} data`);
            return [];
          }

          this._errorMessage.set(null);
          return (data as unknown as EntityRecord<T>[]) || [];
        } catch (error) {
          console.error(`Error fetching ${errorContext}:`, error);
          const message = `Failed to load ${errorContext} data`;
          this._errorMessage.set(message);
          this.notificationService.showError(message);
          return [];
        }
      },
    });
  };

  private countriesResource = this.createEntityResource('countries', {
    errorContext: 'countries',
  });

  private headquartersResource = this.createEntityResource('headquarters', {
    errorContext: 'headquarters',
  });

  private agreementsResource = this.createEntityResource('agreements', {
    errorContext: 'agreements',
    orderBy: 'created_at',
  });

  private collaboratorsResource = this.createEntityResource('collaborators', {
    errorContext: 'collaborators',
    orderBy: 'created_at',
  });

  isLoading = computed(
    () =>
      this.countriesResource.isLoading() ||
      this.headquartersResource.isLoading() ||
      this.agreementsResource.isLoading() ||
      this.collaboratorsResource.isLoading() ||
      this._isRefreshing()
  );

  hasError = computed(() => this._errorMessage() !== null);
  errorMessage = computed(() => this._errorMessage());

  private computeEntityStats = (
    entities: Record<string, unknown>[],
    statusField = 'is_active',
    activeValue: unknown = true
  ): EntityStatistics => {
    const total = entities.length;
    const active = entities.filter((e) => e[statusField] === activeValue).length;
    const inactive = total - active;

    return { total, active, inactive };
  };

  statistics = computed<DashboardStatistics>(() => {
    const countries = this.countriesResource.hasValue() ? this.countriesResource.value() : [];
    const headquarters = this.headquartersResource.hasValue() ? this.headquartersResource.value() : [];
    const agreements = this.agreementsResource.hasValue() ? this.agreementsResource.value() : [];
    const collaborators = this.collaboratorsResource.hasValue() ? this.collaboratorsResource.value() : [];

    return {
      countries: this.computeEntityStats(countries, 'status', 'active'),
      headquarters: this.computeEntityStats(headquarters, 'status', 'active'),
      agreements: this.computeEntityStats(agreements, 'status', 'active'),
      profiles: this.computeEntityStats(collaborators, 'is_active', true),
    };
  });

  // Refresh functionality
  refreshDashboard = async (): Promise<void> => {
    this._isRefreshing.set(true);
    this._errorMessage.set(null);

    try {
      // Reload all resources
      this.countriesResource.reload();
      this.headquartersResource.reload();
      this.agreementsResource.reload();
      this.collaboratorsResource.reload();

      this._lastRefresh.set(new Date());
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
      this._errorMessage.set('Failed to refresh dashboard data');
    } finally {
      this._isRefreshing.set(false);
    }
  };

  // Helper method to build KPI subtitle with active/inactive counts
  private buildSubtitle = (stats: EntityStatistics, showInactive = true): string => {
    const active = this.translate.instant('dashboard.administration.active');
    const inactive = this.translate.instant('dashboard.administration.inactive');

    if (showInactive) {
      return `${active}: ${stats.active} | ${inactive}: ${stats.inactive}`;
    }
    return `${active}: ${stats.active}`;
  };

  organizationKpis = computed<KpiData[]>(() => {
    const stats = this.statistics();

    return [
      {
        icon: '@tui.flag',
        title: this.translate.instant('dashboard.administration.countries'),
        value: stats.countries.total,
        iconBgClass: 'bg-blue-500',
        subtitle: this.buildSubtitle(stats.countries),
        route: '/administration/countries',
      },
      {
        icon: '@tui.building',
        title: this.translate.instant('dashboard.administration.headquarters'),
        value: stats.headquarters.total,
        iconBgClass: 'bg-sky-500',
        subtitle: this.buildSubtitle(stats.headquarters),
        route: '/administration/headquarters',
      },
      {
        icon: '@tui.file-text',
        title: this.translate.instant('dashboard.administration.agreements'),
        value: stats.agreements.total,
        iconBgClass: 'bg-purple-500',
        subtitle: this.buildSubtitle(stats.agreements),
        route: '/administration/agreements',
      },
    ];
  });

  leadershipKpis = computed<KpiData[]>(() => {
    const stats = this.statistics();

    return [
      {
        icon: '@tui.crown',
        title: this.translate.instant('dashboard.administration.leadership'),
        value: stats.profiles.active, // Assuming active profiles are leadership
        iconBgClass: 'bg-amber-500',
        subtitle: this.translate.instant('dashboard.administration.leadershipSubtitle'),
        route: '/administration/users?filter=leadership',
      },
      {
        icon: '@tui.briefcase',
        title: this.translate.instant('dashboard.administration.generalDirector'),
        value: 1, // This would need role-specific logic
        iconBgClass: 'bg-purple-600',
        subtitle: this.buildSubtitle({ total: 1, active: 1, inactive: 0 }),
        route: '/administration/users?filter=general_director',
      },
      {
        icon: '@tui.users',
        title: this.translate.instant('dashboard.administration.executiveLeader'),
        value: 2, // This would need role-specific logic
        iconBgClass: 'bg-indigo-600',
        subtitle: this.buildSubtitle({ total: 2, active: 2, inactive: 0 }),
        route: '/administration/users?filter=executive_leader',
      },
    ];
  });

  operationsKpis = computed<KpiData[]>(() => {
    const stats = this.statistics();

    return [
      {
        icon: '@tui.building-2',
        title: this.translate.instant('dashboard.administration.headquarterManagers'),
        value: stats.headquarters.active, // Assuming each active HQ has a manager
        iconBgClass: 'bg-blue-600',
        subtitle: this.buildSubtitle({
          total: stats.headquarters.active,
          active: stats.headquarters.active,
          inactive: 0,
        }),
        route: '/administration/users?filter=managers',
      },
      {
        icon: '@tui.presentation',
        title: this.translate.instant('dashboard.administration.facilitators'),
        value: Math.floor(stats.profiles.active * 0.3), // Example calculation
        iconBgClass: 'bg-teal-500',
        subtitle: this.buildSubtitle({
          total: Math.floor(stats.profiles.total * 0.3),
          active: Math.floor(stats.profiles.active * 0.3),
          inactive: Math.floor(stats.profiles.inactive * 0.3),
        }),
        route: '/administration/users?filter=facilitators',
      },
      {
        icon: '@tui.heart-handshake',
        title: this.translate.instant('dashboard.administration.companions'),
        value: Math.floor(stats.profiles.active * 0.2),
        iconBgClass: 'bg-rose-500',
        subtitle: this.buildSubtitle({
          total: Math.floor(stats.profiles.total * 0.2),
          active: Math.floor(stats.profiles.active * 0.2),
          inactive: Math.floor(stats.profiles.inactive * 0.2),
        }),
        route: '/administration/users?filter=companions',
      },
      {
        icon: '@tui.graduation-cap',
        title: this.translate.instant('dashboard.administration.students'),
        value: Math.floor(stats.profiles.active * 0.5),
        iconBgClass: 'bg-violet-500',
        subtitle: this.buildSubtitle({
          total: Math.floor(stats.profiles.total * 0.5),
          active: Math.floor(stats.profiles.active * 0.5),
          inactive: Math.floor(stats.profiles.inactive * 0.5),
        }),
        route: '/administration/users?filter=students',
      },
    ];
  });
}
