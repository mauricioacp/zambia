import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TuiBreadcrumbs, TuiSkeleton } from '@taiga-ui/kit';
import { RouterModule } from '@angular/router';
import { SupabaseService } from '@zambia/data-access-supabase';
import { RoleService } from '@zambia/data-access-roles-permissions';
import { EnhancedTableUiComponent, KpiCardUiComponent } from '@zambia/ui-components';
import { resource } from '@angular/core';
import { TuiButton, TuiIcon, TuiLink } from '@taiga-ui/core';
import { TuiItem } from '@taiga-ui/cdk';

interface HeadquarterStudentData {
  id: string;
  name: string;
  country: string;
  total_students: number;
  active_students: number;
  percentage_active: number;
  city?: string;
}

interface CountryStudentSummary {
  country: string;
  total_headquarters: number;
  total_students: number;
  active_students: number;
  percentage_active: number;
}

@Component({
  selector: 'z-student-progress',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    TuiBreadcrumbs,
    TuiSkeleton,
    RouterModule,
    KpiCardUiComponent,
    TuiLink,
    TuiItem,
    TuiButton,
    TuiIcon,
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-slate-900">
      <!-- Header Section -->
      <div class="relative overflow-hidden">
        <!-- Background Glow -->
        <div
          class="absolute inset-0 -inset-x-6 rounded-3xl bg-gradient-to-r from-emerald-300 via-teal-500 to-green-700 opacity-10 blur-2xl"
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
              <span *tuiItem>{{ 'student_progress.title' | translate }}</span>
            </tui-breadcrumbs>

            <div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 class="mb-2 text-3xl font-bold tracking-tight text-gray-800 sm:text-4xl dark:text-white">
                  {{ 'student_progress.title' | translate }}
                </h1>
                <p class="text-lg text-gray-600 dark:text-gray-300">
                  {{ 'student_progress.subtitle' | translate }}
                </p>
              </div>

              <!-- View Toggle -->
              <div class="flex items-center gap-3">
                <button
                  tuiButton
                  [appearance]="viewMode() === 'country' ? 'primary' : 'secondary'"
                  size="m"
                  (click)="setViewMode('country')"
                >
                  {{ 'student_progress.by_country' | translate }}
                </button>
                <button
                  tuiButton
                  [appearance]="viewMode() === 'headquarter' ? 'primary' : 'secondary'"
                  size="m"
                  (click)="setViewMode('headquarter')"
                >
                  {{ 'student_progress.by_headquarter' | translate }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- KPI Overview Section -->
      <section class="px-6 py-8 sm:px-8">
        <div class="mb-6">
          <h2 class="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            {{ 'student_progress.key_metrics' | translate }}
          </h2>
          <p class="text-gray-600 dark:text-gray-300">
            {{ 'student_progress.metrics_desc' | translate }}
          </p>
        </div>

        @defer (on viewport; prefetch on idle) {
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            @for (kpi of keyMetrics(); track kpi.id) {
              <z-kpi-card [kpiData]="kpi" [loading]="isLoading()" />
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
            @if (viewMode() === 'country') {
              {{ 'student_progress.distribution_by_country' | translate }}
            } @else {
              {{ 'student_progress.distribution_by_headquarter' | translate }}
            }
          </h2>
          <p class="text-gray-600 dark:text-gray-300">
            @if (viewMode() === 'country') {
              {{ 'student_progress.country_view_desc' | translate }}
            } @else {
              {{ 'student_progress.headquarter_view_desc' | translate }}
            }
          </p>
        </div>

        <!-- Country View Cards -->
        @if (viewMode() === 'country') {
          @defer (on viewport; prefetch on idle) {
            <div class="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
              @for (country of countryData(); track country.country) {
                <div
                  class="group relative overflow-hidden rounded-2xl border border-gray-200/50 bg-white/90 p-6 shadow-lg shadow-gray-900/5 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-emerald-300/70 hover:shadow-xl hover:shadow-emerald-500/20 dark:border-slate-700/50 dark:bg-slate-800/90 dark:shadow-slate-900/20 dark:hover:border-emerald-600/70 dark:hover:shadow-emerald-400/20"
                >
                  <div class="relative z-10">
                    <div class="mb-4 flex items-center justify-between">
                      <h3 class="text-xl font-semibold text-gray-900 dark:text-white">{{ country.country }}</h3>
                      <div class="rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 p-2">
                        <tui-icon icon="@tui.globe" class="text-white" />
                      </div>
                    </div>

                    <div class="space-y-3">
                      <div class="flex items-center justify-between">
                        <span class="text-sm text-gray-600 dark:text-gray-400">{{
                          'student_progress.headquarters' | translate
                        }}</span>
                        <span class="font-semibold text-gray-900 dark:text-white">{{
                          country.total_headquarters
                        }}</span>
                      </div>
                      <div class="flex items-center justify-between">
                        <span class="text-sm text-gray-600 dark:text-gray-400">{{
                          'student_progress.total_students' | translate
                        }}</span>
                        <span class="text-lg font-bold text-emerald-600 dark:text-emerald-400">{{
                          country.total_students
                        }}</span>
                      </div>
                      <div class="flex items-center justify-between">
                        <span class="text-sm text-gray-600 dark:text-gray-400">{{
                          'student_progress.active_students' | translate
                        }}</span>
                        <span class="font-semibold text-teal-600 dark:text-teal-400">{{
                          country.active_students
                        }}</span>
                      </div>
                      <div class="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                        <div class="flex items-center justify-between">
                          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{
                            'student_progress.activity_rate' | translate
                          }}</span>
                          <span
                            class="text-lg font-bold"
                            [ngClass]="{
                              'text-emerald-600 dark:text-emerald-400': country.percentage_active >= 80,
                              'text-orange-600 dark:text-orange-400':
                                country.percentage_active >= 60 && country.percentage_active < 80,
                              'text-red-600 dark:text-red-400': country.percentage_active < 60,
                            }"
                          >
                            {{ country.percentage_active }}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Hover overlay -->
                  <div
                    class="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-600/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
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
        <!--@if (viewMode() === 'headquarter') {
          <z-enhanced-table
            [items]="headquarterData()"
            [columns]="tableColumns"
            [loading]="isLoading()"
            [emptyStateTitle]="'student_progress.no_data' | translate"
            [emptyStateDescription]="'student_progress.no_data_desc' | translate"
            [emptyStateIcon]="'@tui.users'"
            [enablePagination]="true"
            [enableFiltering]="true"
            [enableColumnVisibility]="true"
            [pageSize]="25"
            [searchableColumns]="['name', 'country', 'city']"
          />
        }-->
      </section>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentProgressSmartComponent {
  private supabase = inject(SupabaseService);
  private roleService = inject(RoleService);

  viewMode = signal<'country' | 'headquarter'>('country');
  isLoadingSignal = signal(false);

  studentData = resource({
    loader: async () => {
      this.isLoadingSignal.set(true);
      try {
        const mockHeadquarterData: HeadquarterStudentData[] = [
          {
            id: '1',
            name: 'Sede Buenos Aires',
            country: 'Argentina',
            city: 'Buenos Aires',
            total_students: 250,
            active_students: 235,
            percentage_active: 94,
          },
          {
            id: '2',
            name: 'Sede Córdoba',
            country: 'Argentina',
            city: 'Córdoba',
            total_students: 180,
            active_students: 165,
            percentage_active: 92,
          },
          {
            id: '3',
            name: 'Sede Ciudad de México',
            country: 'México',
            city: 'Ciudad de México',
            total_students: 320,
            active_students: 280,
            percentage_active: 88,
          },
          {
            id: '4',
            name: 'Sede Guadalajara',
            country: 'México',
            city: 'Guadalajara',
            total_students: 150,
            active_students: 125,
            percentage_active: 83,
          },
          {
            id: '5',
            name: 'Sede Santiago',
            country: 'Chile',
            city: 'Santiago',
            total_students: 200,
            active_students: 175,
            percentage_active: 88,
          },
          {
            id: '6',
            name: 'Sede Madrid',
            country: 'España',
            city: 'Madrid',
            total_students: 150,
            active_students: 130,
            percentage_active: 87,
          },
        ];

        await new Promise((resolve) => setTimeout(resolve, 800));
        return mockHeadquarterData;

        /* TODO: Replace with actual Supabase call
        const { data, error } = await this.supabase
          .getClient()
          .rpc('get_student_distribution_by_headquarters');

        if (error) throw error;
        return data as HeadquarterStudentData[];
        */
      } finally {
        this.isLoadingSignal.set(false);
      }
    },
  });

  countryData = computed<CountryStudentSummary[]>(() => {
    const data = this.studentData.value() || [];
    const countryMap = new Map<string, CountryStudentSummary>();

    data.forEach((hq) => {
      const existing = countryMap.get(hq.country) || {
        country: hq.country,
        total_headquarters: 0,
        total_students: 0,
        active_students: 0,
        percentage_active: 0,
      };

      existing.total_headquarters += 1;
      existing.total_students += hq.total_students;
      existing.active_students += hq.active_students;

      countryMap.set(hq.country, existing);
    });

    const countries = Array.from(countryMap.values());
    countries.forEach((country) => {
      country.percentage_active = Math.round((country.active_students / country.total_students) * 100);
    });

    return countries.sort((a, b) => b.total_students - a.total_students);
  });

  headquarterData = computed(() => {
    return (this.studentData.value() || []).sort((a, b) => b.total_students - a.total_students);
  });

  keyMetrics = computed(() => {
    const data = this.studentData.value() || [];
    const totalStudents = data.reduce((sum, hq) => sum + hq.total_students, 0);
    const activeStudents = data.reduce((sum, hq) => sum + hq.active_students, 0);
    const totalHeadquarters = data.length;
    const averagePerHq = totalHeadquarters > 0 ? Math.round(totalStudents / totalHeadquarters) : 0;

    return [
      {
        id: 'total-students',
        title: 'Total de Estudiantes',
        value: totalStudents,
        trend: 'up' as const,
        trendPercentage: 5,
        icon: '@tui.users',
        iconBgClass: 'bg-gradient-to-br from-emerald-500 to-teal-600',
        route: '',
      },
      {
        id: 'active-students',
        title: 'Estudiantes Activos',
        value: activeStudents,
        trend: 'up' as const,
        trendPercentage: Math.round((activeStudents / totalStudents) * 100),
        icon: '@tui.user-check',
        iconBgClass: 'bg-gradient-to-br from-green-500 to-emerald-600',
        route: '',
      },
      {
        id: 'total-headquarters',
        title: 'Sedes con Estudiantes',
        value: totalHeadquarters,
        trend: 'stable' as const,
        trendPercentage: 0,
        icon: '@tui.landmark',
        iconBgClass: 'bg-gradient-to-br from-blue-500 to-indigo-600',
        route: '',
      },
      {
        id: 'average-per-hq',
        title: 'Promedio por Sede',
        value: averagePerHq,
        trend: 'up' as const,
        trendPercentage: 3,
        icon: '@tui.pie-chart',
        iconBgClass: 'bg-gradient-to-br from-purple-500 to-pink-600',
        route: '',
      },
    ];
  });

  isLoading = computed(() => this.isLoadingSignal() || this.studentData.isLoading());

  tableColumns = [
    {
      key: 'name',
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
      key: 'total_students',
      label: 'Total Estudiantes',
      type: 'number' as const,
      sortable: true,
    },
    {
      key: 'active_students',
      label: 'Estudiantes Activos',
      type: 'number' as const,
      sortable: true,
    },
    {
      key: 'percentage_active',
      label: 'Tasa de Actividad',
      type: 'percentage' as const,
      sortable: true,
    },
  ];

  setViewMode(mode: 'country' | 'headquarter'): void {
    this.viewMode.set(mode);
  }
}
