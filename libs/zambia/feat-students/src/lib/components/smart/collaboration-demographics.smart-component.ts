import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TuiBreadcrumbs, TuiSkeleton, TuiSegmented } from '@taiga-ui/kit';
import { RouterModule } from '@angular/router';
import { SupabaseService } from '@zambia/data-access-supabase';
import { RoleService } from '@zambia/data-access-roles-permissions';
import { EnhancedTableUiComponent, KpiCardUiComponent, QuickActionCardUiComponent } from '@zambia/ui-components';
import { resource } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiIcon } from '@taiga-ui/core';

interface CollaboratorDemographics {
  headquarter_id: string;
  headquarter_name: string;
  country: string;
  city?: string;
  directors: number;
  facilitators: number;
  companions: number;
  total_collaborators: number;
}

interface CountryCollaboratorSummary {
  country: string;
  total_headquarters: number;
  directors: number;
  facilitators: number;
  companions: number;
  total_collaborators: number;
}

@Component({
  selector: 'z-collaboration-demographics',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    TuiBreadcrumbs,
    TuiSkeleton,
    TuiSegmented,
    RouterModule,
    FormsModule,
    EnhancedTableUiComponent,
    KpiCardUiComponent,
    TuiIcon,
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-slate-900">
      <!-- Header Section -->
      <div class="relative overflow-hidden">
        <!-- Background Glow -->
        <div
          class="absolute inset-0 -inset-x-6 rounded-3xl bg-gradient-to-r from-purple-300 via-indigo-500 to-blue-700 opacity-10 blur-2xl"
        ></div>

        <!-- Glass Header Container -->
        <div
          class="relative rounded-2xl bg-white/40 p-2.5 ring-1 ring-gray-200/50 backdrop-blur-sm dark:bg-gray-500/20 dark:ring-gray-700/60"
        >
          <div
            class="rounded-xl bg-white/95 p-6 shadow-xl shadow-gray-900/5 dark:bg-gray-950/95 dark:shadow-slate-900/20"
          >
            <!-- Breadcrumbs -->
            <tui-breadcrumbs class="mb-6">
              <a *tuiItem routerLink="/dashboard" tuiLink iconStart="@tui.house">
                {{ 'dashboard' | translate }}
              </a>
              <a *tuiItem routerLink="/dashboard/homepage" tuiLink>
                {{ 'nav.homepage' | translate }}
              </a>
              <span *tuiItem>{{ 'collaboration.title' | translate }}</span>
            </tui-breadcrumbs>

            <div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 class="mb-2 text-3xl font-bold tracking-tight text-gray-800 sm:text-4xl dark:text-white">
                  {{ 'collaboration.title' | translate }}
                </h1>
                <p class="text-lg text-gray-600 dark:text-gray-300">
                  {{ 'collaboration.subtitle' | translate }}
                </p>
              </div>

              <!-- View Mode Selector -->
              <div class="flex items-center gap-3">
                <tui-segmented size="m" [(ngModel)]="viewMode">
                  <button tuiButton type="button" value="global">
                    {{ 'collaboration.global_view' | translate }}
                  </button>
                  <button tuiButton type="button" value="country">
                    {{ 'collaboration.by_country' | translate }}
                  </button>
                  <button tuiButton type="button" value="headquarter">
                    {{ 'collaboration.by_headquarter' | translate }}
                  </button>
                </tui-segmented>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- KPI Overview Section -->
      <section class="px-6 py-8 sm:px-8">
        <div class="mb-6">
          <h2 class="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            {{ 'collaboration.key_metrics' | translate }}
          </h2>
          <p class="text-gray-600 dark:text-gray-300">
            {{ 'collaboration.metrics_desc' | translate }}
          </p>
        </div>

        @defer (on viewport; prefetch on idle) {
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            @for (kpi of keyMetrics(); track kpi.id) {
              <z-kpi-card [kpiData]="kpi" [loading]="isLoading()" (cardClicked)="navigateToRole(kpi.id)" />
            }
          </div>
        } @placeholder {
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            @for (i of [1, 2, 3, 4]; track i) {
              <div class="h-32 w-full rounded-2xl bg-white/40 backdrop-blur-sm" [tuiSkeleton]="true"></div>
            }
          </div>
        }
      </section>

      <!-- Data View Section -->
      <section class="px-6 py-8 sm:px-8">
        <div class="mb-6">
          <h2 class="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            @switch (viewMode) {
              @case ('global') {
                {{ 'collaboration.global_distribution' | translate }}
              }
              @case ('country') {
                {{ 'collaboration.distribution_by_country' | translate }}
              }
              @case ('headquarter') {
                {{ 'collaboration.distribution_by_headquarter' | translate }}
              }
            }
          </h2>
          <p class="text-gray-600 dark:text-gray-300">
            @switch (viewMode) {
              @case ('global') {
                {{ 'collaboration.global_view_desc' | translate }}
              }
              @case ('country') {
                {{ 'collaboration.country_view_desc' | translate }}
              }
              @case ('headquarter') {
                {{ 'collaboration.headquarter_view_desc' | translate }}
              }
            }
          </p>
        </div>

        <!-- Global View -->
        @if (viewMode === 'global') {
          @defer (on viewport; prefetch on idle) {
            <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
              @for (role of globalRoleCards(); track role.id) {
                <div
                  class="group relative overflow-hidden rounded-2xl border border-gray-200/50 bg-white/90 p-6 shadow-lg shadow-gray-900/5 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] dark:border-slate-700/50 dark:bg-slate-800/90 dark:shadow-slate-900/20"
                  [ngClass]="getRoleHoverClass(role.id)"
                >
                  <div class="relative z-10">
                    <div class="mb-4 flex items-center justify-between">
                      <h3 class="text-xl font-semibold text-gray-900 dark:text-white">{{ role.title }}</h3>
                      <div class="rounded-lg p-2" [ngClass]="role.iconBgClass">
                        <tui-icon [icon]="role.icon" class="text-white" />
                      </div>
                    </div>

                    <div class="py-4 text-center">
                      <p class="text-4xl font-bold" [ngClass]="role.textColorClass">{{ role.count }}</p>
                      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {{ 'collaboration.total_active' | translate }}
                      </p>
                    </div>

                    <div class="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                      <div class="flex items-center justify-between text-sm">
                        <span class="text-gray-600 dark:text-gray-400">{{
                          'collaboration.percentage_of_total' | translate
                        }}</span>
                        <span class="font-semibold" [ngClass]="role.textColorClass">{{ role.percentage }}%</span>
                      </div>
                    </div>
                  </div>

                  <!-- Hover overlay -->
                  <div
                    class="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    [ngClass]="role.gradientClass"
                  ></div>
                </div>
              }
            </div>
          } @placeholder {
            <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
              @for (i of [1, 2, 3]; track i) {
                <div class="h-64 w-full rounded-2xl bg-white/40 backdrop-blur-sm" [tuiSkeleton]="true"></div>
              }
            </div>
          }
        }

        <!-- Country View Cards -->
        @if (viewMode === 'country') {
          @defer (on viewport; prefetch on idle) {
            <div class="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
              @for (country of countryData(); track country.country) {
                <div
                  class="group relative overflow-hidden rounded-2xl border border-gray-200/50 bg-white/90 p-6 shadow-lg shadow-gray-900/5 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-purple-300/70 hover:shadow-xl hover:shadow-purple-500/20 dark:border-slate-700/50 dark:bg-slate-800/90 dark:shadow-slate-900/20 dark:hover:border-purple-600/70 dark:hover:shadow-purple-400/20"
                >
                  <div class="relative z-10">
                    <div class="mb-4 flex items-center justify-between">
                      <h3 class="text-xl font-semibold text-gray-900 dark:text-white">{{ country.country }}</h3>
                      <div class="rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 p-2">
                        <tui-icon icon="@tui.globe" class="text-white" />
                      </div>
                    </div>

                    <div class="space-y-3">
                      <div class="flex items-center justify-between">
                        <span class="text-sm text-gray-600 dark:text-gray-400">{{ 'directors' | translate }}</span>
                        <span class="font-semibold text-pink-600 dark:text-pink-400">{{ country.directors }}</span>
                      </div>
                      <div class="flex items-center justify-between">
                        <span class="text-sm text-gray-600 dark:text-gray-400">{{ 'facilitators' | translate }}</span>
                        <span class="font-semibold text-teal-600 dark:text-teal-400">{{ country.facilitators }}</span>
                      </div>
                      <div class="flex items-center justify-between">
                        <span class="text-sm text-gray-600 dark:text-gray-400">{{ 'companions' | translate }}</span>
                        <span class="font-semibold text-orange-600 dark:text-orange-400">{{ country.companions }}</span>
                      </div>
                      <div class="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                        <div class="flex items-center justify-between">
                          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{
                            'collaboration.total_collaborators' | translate
                          }}</span>
                          <span class="text-lg font-bold text-purple-600 dark:text-purple-400">{{
                            country.total_collaborators
                          }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Hover overlay -->
                  <div
                    class="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-indigo-600/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  ></div>
                </div>
              }
            </div>
          } @placeholder {
            <div class="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
              @for (i of [1, 2, 3]; track i) {
                <div class="h-64 w-full rounded-2xl bg-white/40 backdrop-blur-sm" [tuiSkeleton]="true"></div>
              }
            </div>
          }
        }

        <!-- Headquarter View Table -->
        @if (viewMode === 'headquarter') {
          <z-enhanced-table
            [items]="headquarterData()"
            [columns]="tableColumns"
            [loading]="isLoading()"
            [emptyStateTitle]="'collaboration.no_data' | translate"
            [emptyStateDescription]="'collaboration.no_data_desc' | translate"
            [emptyStateIcon]="'@tui.users'"
            [enablePagination]="true"
            [enableFiltering]="true"
            [enableColumnVisibility]="true"
            [pageSize]="25"
            [searchableColumns]="['headquarter_name', 'country', 'city']"
          />
        }
      </section>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollaborationDemographicsSmartComponent {
  private supabase = inject(SupabaseService);
  private roleService = inject(RoleService);

  viewMode = 'global';
  isLoadingSignal = signal(false);

  // Resource for fetching collaboration data
  collaborationData = resource({
    request: () => ({}),
    loader: async () => {
      this.isLoadingSignal.set(true);
      try {
        // Mock data for now - replace with actual Supabase RPC call
        const mockData: CollaboratorDemographics[] = [
          {
            headquarter_id: '1',
            headquarter_name: 'Sede Buenos Aires',
            country: 'Argentina',
            city: 'Buenos Aires',
            directors: 3,
            facilitators: 12,
            companions: 8,
            total_collaborators: 23,
          },
          {
            headquarter_id: '2',
            headquarter_name: 'Sede Córdoba',
            country: 'Argentina',
            city: 'Córdoba',
            directors: 2,
            facilitators: 8,
            companions: 5,
            total_collaborators: 15,
          },
          {
            headquarter_id: '3',
            headquarter_name: 'Sede Ciudad de México',
            country: 'México',
            city: 'Ciudad de México',
            directors: 4,
            facilitators: 15,
            companions: 10,
            total_collaborators: 29,
          },
          {
            headquarter_id: '4',
            headquarter_name: 'Sede Guadalajara',
            country: 'México',
            city: 'Guadalajara',
            directors: 2,
            facilitators: 10,
            companions: 6,
            total_collaborators: 18,
          },
          {
            headquarter_id: '5',
            headquarter_name: 'Sede Santiago',
            country: 'Chile',
            city: 'Santiago',
            directors: 3,
            facilitators: 11,
            companions: 7,
            total_collaborators: 21,
          },
          {
            headquarter_id: '6',
            headquarter_name: 'Sede Madrid',
            country: 'España',
            city: 'Madrid',
            directors: 2,
            facilitators: 9,
            companions: 5,
            total_collaborators: 16,
          },
        ];

        await new Promise((resolve) => setTimeout(resolve, 800));
        return mockData;

        /* TODO: Replace with actual Supabase call
        const { data, error } = await this.supabase
          .getClient()
          .rpc('get_collaborator_demographics');

        if (error) throw error;
        return data as CollaboratorDemographics[];
        */
      } finally {
        this.isLoadingSignal.set(false);
      }
    },
  });

  // Computed global statistics
  globalStats = computed(() => {
    const data = this.collaborationData.value() || [];
    const totalDirectors = data.reduce((sum, hq) => sum + hq.directors, 0);
    const totalFacilitators = data.reduce((sum, hq) => sum + hq.facilitators, 0);
    const totalCompanions = data.reduce((sum, hq) => sum + hq.companions, 0);
    const totalCollaborators = totalDirectors + totalFacilitators + totalCompanions;

    return {
      directors: totalDirectors,
      facilitators: totalFacilitators,
      companions: totalCompanions,
      total: totalCollaborators,
    };
  });

  // Global role cards
  globalRoleCards = computed(() => {
    const stats = this.globalStats();
    const total = stats.total || 1; // Avoid division by zero

    return [
      {
        id: 'directors',
        title: 'Directores',
        count: stats.directors,
        percentage: Math.round((stats.directors / total) * 100),
        icon: '@tui.briefcase',
        iconBgClass: 'bg-gradient-to-r from-pink-500 to-rose-600',
        textColorClass: 'text-pink-600 dark:text-pink-400',
        gradientClass: 'bg-gradient-to-br from-pink-500/10 via-transparent to-rose-600/5',
      },
      {
        id: 'facilitators',
        title: 'Facilitadores',
        count: stats.facilitators,
        percentage: Math.round((stats.facilitators / total) * 100),
        icon: '@tui.book-open',
        iconBgClass: 'bg-gradient-to-r from-teal-500 to-emerald-600',
        textColorClass: 'text-teal-600 dark:text-teal-400',
        gradientClass: 'bg-gradient-to-br from-teal-500/10 via-transparent to-emerald-600/5',
      },
      {
        id: 'companions',
        title: 'Acompañantes',
        count: stats.companions,
        percentage: Math.round((stats.companions / total) * 100),
        icon: '@tui.heart',
        iconBgClass: 'bg-gradient-to-r from-orange-500 to-amber-600',
        textColorClass: 'text-orange-600 dark:text-orange-400',
        gradientClass: 'bg-gradient-to-br from-orange-500/10 via-transparent to-amber-600/5',
      },
    ];
  });

  // Computed data by country
  countryData = computed<CountryCollaboratorSummary[]>(() => {
    const data = this.collaborationData.value() || [];
    const countryMap = new Map<string, CountryCollaboratorSummary>();

    data.forEach((hq) => {
      const existing = countryMap.get(hq.country) || {
        country: hq.country,
        total_headquarters: 0,
        directors: 0,
        facilitators: 0,
        companions: 0,
        total_collaborators: 0,
      };

      existing.total_headquarters += 1;
      existing.directors += hq.directors;
      existing.facilitators += hq.facilitators;
      existing.companions += hq.companions;
      existing.total_collaborators += hq.total_collaborators;

      countryMap.set(hq.country, existing);
    });

    return Array.from(countryMap.values()).sort((a, b) => b.total_collaborators - a.total_collaborators);
  });

  // Computed data for headquarters view
  headquarterData = computed(() => {
    return (this.collaborationData.value() || []).sort((a, b) => b.total_collaborators - a.total_collaborators);
  });

  // Key metrics
  keyMetrics = computed(() => {
    const stats = this.globalStats();
    const data = this.collaborationData.value() || [];
    const totalHeadquarters = data.length;

    return [
      {
        id: 'total-collaborators',
        title: 'Total Colaboradores',
        value: stats.total,
        trend: 'up' as const,
        trendPercentage: 8,
        icon: '@tui.users',
        iconBgClass: 'bg-gradient-to-br from-purple-500 to-indigo-600',
        route: '/dashboard/agreements?role=collaborator',
      },
      {
        id: 'directors',
        title: 'Directores',
        value: stats.directors,
        trend: 'stable' as const,
        trendPercentage: 0,
        icon: '@tui.briefcase',
        iconBgClass: 'bg-gradient-to-br from-pink-500 to-rose-600',
        route: '/dashboard/agreements?role=director',
      },
      {
        id: 'facilitators',
        title: 'Facilitadores',
        value: stats.facilitators,
        trend: 'up' as const,
        trendPercentage: 5,
        icon: '@tui.book-open',
        iconBgClass: 'bg-gradient-to-br from-teal-500 to-emerald-600',
        route: '/dashboard/agreements?role=facilitator',
      },
      {
        id: 'companions',
        title: 'Acompañantes',
        value: stats.companions,
        trend: 'up' as const,
        trendPercentage: 3,
        icon: '@tui.heart',
        iconBgClass: 'bg-gradient-to-br from-orange-500 to-amber-600',
        route: '/dashboard/agreements?role=companion',
      },
    ];
  });

  isLoading = computed(() => this.isLoadingSignal() || this.collaborationData.isLoading());

  // Table columns for headquarter view
  tableColumns = [
    {
      key: 'headquarter_name',
      label: 'Sede',
      type: 'text' as const,
      sortable: true,
      searchable: true,
    },
    {
      key: 'country',
      label: 'País',
      type: 'text' as const,
      sortable: true,
      searchable: true,
    },
    {
      key: 'city',
      label: 'Ciudad',
      type: 'text' as const,
      sortable: true,
      searchable: true,
    },
    {
      key: 'directors',
      label: 'Directores',
      type: 'number' as const,
      sortable: true,
    },
    {
      key: 'facilitators',
      label: 'Facilitadores',
      type: 'number' as const,
      sortable: true,
    },
    {
      key: 'companions',
      label: 'Acompañantes',
      type: 'number' as const,
      sortable: true,
    },
    {
      key: 'total_collaborators',
      label: 'Total Colaboradores',
      type: 'number' as const,
      sortable: true,
    },
  ];

  getRoleHoverClass(roleId: string): string {
    switch (roleId) {
      case 'directors':
        return 'hover:border-pink-300/70 hover:shadow-pink-500/20 dark:hover:border-pink-600/70 dark:hover:shadow-pink-400/20';
      case 'facilitators':
        return 'hover:border-teal-300/70 hover:shadow-teal-500/20 dark:hover:border-teal-600/70 dark:hover:shadow-teal-400/20';
      case 'companions':
        return 'hover:border-orange-300/70 hover:shadow-orange-500/20 dark:hover:border-orange-600/70 dark:hover:shadow-orange-400/20';
      default:
        return 'hover:border-gray-300/70 hover:shadow-gray-900/10 dark:hover:border-slate-600/70 dark:hover:shadow-slate-900/40';
    }
  }

  navigateToRole(roleId: string): void {
    // Navigation is handled via routerLink on the KPI cards
  }
}
