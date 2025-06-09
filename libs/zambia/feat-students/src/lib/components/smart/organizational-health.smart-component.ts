import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TuiBreadcrumbs, TuiSkeleton } from '@taiga-ui/kit';
import { RouterModule } from '@angular/router';
import { SupabaseService } from '@zambia/data-access-supabase';
import { RoleService } from '@zambia/data-access-roles-permissions';
import { KpiCardUiComponent, CardComponent } from '@zambia/ui-components';
import { resource } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';
import { TuiRingChart } from '@taiga-ui/addon-charts';

interface HealthMetrics {
  active_headquarters_percentage: number;
  active_countries_percentage: number;
  workshops_completion_rate: number;
  agreements_review_rate: number;

  student_participation_rate: number;
  collaborator_participation_rate: number;
  average_students_per_hq: number;
  average_collaborators_per_hq: number;

  student_growth_rate: number;
  collaborator_growth_rate: number;
  new_headquarters_last_quarter: number;

  facilitator_to_student_ratio: number;
  companion_to_student_ratio: number;
  average_workshop_attendance: number;
}

interface HealthScore {
  category: string;
  score: number;
  status: 'excellent' | 'good' | 'fair' | 'needs-improvement';
  trend: 'up' | 'down' | 'stable';
  metrics: HealthMetric[];
}

interface HealthMetric {
  name: string;
  value: number | string;
  target?: number | string;
  status: 'good' | 'warning' | 'critical';
}

@Component({
  selector: 'z-organizational-health',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    TuiBreadcrumbs,
    TuiSkeleton,
    RouterModule,
    KpiCardUiComponent,
    CardComponent,
    TuiIcon,
    TuiRingChart,
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-slate-900">
      <!-- Header Section -->
      <div class="relative overflow-hidden">
        <!-- Background Glow -->
        <div
          class="absolute inset-0 -inset-x-6 rounded-3xl bg-gradient-to-r from-blue-300 via-cyan-500 to-teal-700 opacity-10 blur-2xl"
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
              <span *tuiItem>{{ 'health.title' | translate }}</span>
            </tui-breadcrumbs>

            <div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 class="mb-2 text-3xl font-bold tracking-tight text-gray-800 sm:text-4xl dark:text-white">
                  {{ 'health.title' | translate }}
                </h1>
                <p class="text-lg text-gray-600 dark:text-gray-300">
                  {{ 'health.subtitle' | translate }}
                </p>
              </div>

              <!-- Overall Health Score -->
              <div class="flex items-center gap-4">
                <div class="text-center">
                  <p class="mb-1 text-sm text-gray-600 dark:text-gray-400">{{ 'health.overall_score' | translate }}</p>
                  <div class="flex items-center gap-2">
                    <span
                      class="text-4xl font-bold"
                      [ngClass]="{
                        'text-emerald-600 dark:text-emerald-400': overallScore() >= 80,
                        'text-blue-600 dark:text-blue-400': overallScore() >= 60 && overallScore() < 80,
                        'text-orange-600 dark:text-orange-400': overallScore() >= 40 && overallScore() < 60,
                        'text-red-600 dark:text-red-400': overallScore() < 40,
                      }"
                      >{{ overallScore() }}%</span
                    >
                    <div
                      class="rounded-full p-2"
                      [ngClass]="{
                        'bg-emerald-100 dark:bg-emerald-900/30': overallScore() >= 80,
                        'bg-blue-100 dark:bg-blue-900/30': overallScore() >= 60 && overallScore() < 80,
                        'bg-orange-100 dark:bg-orange-900/30': overallScore() >= 40 && overallScore() < 60,
                        'bg-red-100 dark:bg-red-900/30': overallScore() < 40,
                      }"
                    >
                      <tui-icon
                        [icon]="getHealthIcon()"
                        [ngClass]="{
                          'text-emerald-600 dark:text-emerald-400': overallScore() >= 80,
                          'text-blue-600 dark:text-blue-400': overallScore() >= 60 && overallScore() < 80,
                          'text-orange-600 dark:text-orange-400': overallScore() >= 40 && overallScore() < 60,
                          'text-red-600 dark:text-red-400': overallScore() < 40,
                        }"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Key Health Indicators -->
      <section class="px-6 py-8 sm:px-8">
        <div class="mb-6">
          <h2 class="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            {{ 'health.key_indicators' | translate }}
          </h2>
          <p class="text-gray-600 dark:text-gray-300">
            {{ 'health.indicators_desc' | translate }}
          </p>
        </div>

        @defer (on viewport; prefetch on idle) {
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            @for (kpi of keyIndicators(); track kpi.id) {
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

      <!-- Health Categories -->
      <section class="px-6 py-8 sm:px-8">
        <div class="mb-6">
          <h2 class="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            {{ 'health.category_breakdown' | translate }}
          </h2>
          <p class="text-gray-600 dark:text-gray-300">
            {{ 'health.category_desc' | translate }}
          </p>
        </div>

        @defer (on viewport; prefetch on idle) {
          <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
            @for (category of healthCategories(); track category.category) {
              <div
                class="group relative overflow-hidden rounded-2xl border border-gray-200/50 bg-white/90 p-6 shadow-lg shadow-gray-900/5 backdrop-blur-sm transition-all duration-300 hover:scale-[1.01] hover:shadow-xl dark:border-slate-700/50 dark:bg-slate-800/90 dark:shadow-slate-900/20"
                [ngClass]="getCategoryHoverClass(category.status)"
              >
                <div class="relative z-10">
                  <!-- Category Header -->
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white">{{ category.category }}</h3>
                    <div class="flex items-center gap-3">
                      <span class="text-2xl font-bold" [ngClass]="getScoreColorClass(category.score)"
                        >{{ category.score }}%</span
                      >
                      <div class="rounded-lg p-2" [ngClass]="getStatusBgClass(category.status)">
                        <tui-icon [icon]="getTrendIcon(category.trend)" class="text-white" />
                      </div>
                    </div>
                  </div>

                  <!-- Metrics List -->
                  <div class="space-y-3">
                    @for (metric of category.metrics; track metric.name) {
                      <div class="flex items-center justify-between rounded-lg bg-gray-50 p-2 dark:bg-gray-900/50">
                        <div class="flex items-center gap-2">
                          <div
                            class="h-2 w-2 rounded-full"
                            [ngClass]="{
                              'bg-emerald-500': metric.status === 'good',
                              'bg-orange-500': metric.status === 'warning',
                              'bg-red-500': metric.status === 'critical',
                            }"
                          ></div>
                          <span class="text-sm text-gray-700 dark:text-gray-300">{{ metric.name }}</span>
                        </div>
                        <div class="flex items-center gap-2">
                          <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ metric.value }}</span>
                          @if (metric.target) {
                            <span class="text-xs text-gray-500 dark:text-gray-400">/ {{ metric.target }}</span>
                          }
                        </div>
                      </div>
                    }
                  </div>
                </div>

                <!-- Hover overlay -->
                <div
                  class="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  [ngClass]="getCategoryGradientClass(category.status)"
                ></div>
              </div>
            }
          </div>
        } @placeholder {
          <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
            @for (i of [1, 2, 3, 4]; track i) {
              <div class="h-64 w-full rounded-2xl bg-white/40 backdrop-blur-sm" [tuiSkeleton]="true"></div>
            }
          </div>
        }
      </section>

      <!-- Visual Analytics -->
      <section class="px-6 py-8 sm:px-8">
        <div class="mb-6">
          <h2 class="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            {{ 'health.visual_analytics' | translate }}
          </h2>
          <p class="text-gray-600 dark:text-gray-300">
            {{ 'health.analytics_desc' | translate }}
          </p>
        </div>

        @defer (on viewport; prefetch on idle) {
          <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <!-- Health Score Distribution -->
            <z-card
              [mainTitle]="'health.score_distribution' | translate"
              [mainSubtitle]="'health.score_distribution_desc' | translate"
              [progressPercentage]="overallScore()"
              [progressBarColor]="'bg-gradient-to-r from-blue-500 to-cyan-500'"
              [progressTextColor]="'text-blue-600 dark:text-blue-400'"
              [staticBorderColor]="'ring-blue-500/20'"
              [applyAnimatedBorder]="true"
              [icon]="'@tui.pie-chart'"
            >
              <div class="p-4">
                <tui-ring-chart [value]="chartData()" [size]="'l'" [activeItemIndex]="0"></tui-ring-chart>
              </div>
            </z-card>

            <!-- Trend Analysis -->
            <z-card
              [mainTitle]="'health.trend_analysis' | translate"
              [mainSubtitle]="'health.trend_desc' | translate"
              [staticBorderColor]="'ring-cyan-500/20'"
              [applyAnimatedBorder]="true"
              [icon]="'@tui.bar-chart-3'"
            >
              <div class="p-4">
                <div class="space-y-4">
                  @for (trend of trendData(); track trend.name) {
                    <div>
                      <div class="mb-2 flex items-center justify-between">
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ trend.name }}</span>
                        <span class="text-sm font-semibold" [ngClass]="trend.colorClass">{{ trend.change }}</span>
                      </div>
                      <div class="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          class="h-2 rounded-full transition-all duration-500"
                          [ngClass]="trend.bgClass"
                          [style.width.%]="trend.percentage"
                        ></div>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </z-card>
          </div>
        } @placeholder {
          <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
            @for (i of [1, 2]; track i) {
              <div class="h-80 w-full rounded-2xl bg-white/40 backdrop-blur-sm" [tuiSkeleton]="true"></div>
            }
          </div>
        }
      </section>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationalHealthSmartComponent {
  private supabase = inject(SupabaseService);
  private roleService = inject(RoleService);

  isLoadingSignal = signal(false);

  healthMetrics = resource({
    request: () => ({}),
    loader: async () => {
      this.isLoadingSignal.set(true);
      try {
        const mockMetrics: HealthMetrics = {
          active_headquarters_percentage: 89,
          active_countries_percentage: 100,
          workshops_completion_rate: 75,
          agreements_review_rate: 82,
          student_participation_rate: 88,
          collaborator_participation_rate: 92,
          average_students_per_hq: 69,
          average_collaborators_per_hq: 19,
          student_growth_rate: 15,
          collaborator_growth_rate: 8,
          new_headquarters_last_quarter: 2,
          facilitator_to_student_ratio: 0.12,
          companion_to_student_ratio: 0.08,
          average_workshop_attendance: 78,
        };

        await new Promise((resolve) => setTimeout(resolve, 800));
        return mockMetrics;

        /* TODO: Replace with actual Supabase call
        const { data, error } = await this.supabase
          .getClient()
          .rpc('get_organizational_health_metrics');

        if (error) throw error;
        return data as HealthMetrics;
        */
      } finally {
        this.isLoadingSignal.set(false);
      }
    },
  });

  overallScore = computed(() => {
    const metrics = this.healthMetrics.value();
    if (!metrics) return 0;

    const weights = {
      activity: 0.25,
      participation: 0.3,
      growth: 0.2,
      quality: 0.25,
    };

    const activityScore =
      (metrics.active_headquarters_percentage +
        metrics.active_countries_percentage +
        metrics.workshops_completion_rate +
        metrics.agreements_review_rate) /
      4;

    const participationScore = (metrics.student_participation_rate + metrics.collaborator_participation_rate) / 2;

    const growthScore = Math.min(100, (metrics.student_growth_rate + metrics.collaborator_growth_rate) * 3);

    const qualityScore = Math.min(
      100,
      (metrics.facilitator_to_student_ratio * 500 +
        metrics.companion_to_student_ratio * 500 +
        metrics.average_workshop_attendance) /
        3
    );

    const overall =
      activityScore * weights.activity +
      participationScore * weights.participation +
      growthScore * weights.growth +
      qualityScore * weights.quality;

    return Math.round(overall);
  });

  // Key indicators
  keyIndicators = computed(() => {
    const metrics = this.healthMetrics.value();
    if (!metrics) return [];

    return [
      {
        id: 'participation',
        title: 'Tasa de Participación',
        value: Math.round((metrics.student_participation_rate + metrics.collaborator_participation_rate) / 2),
        trend: 'up' as const,
        trendPercentage: 5,
        icon: '@tui.users',
        iconBgClass: 'bg-gradient-to-br from-emerald-500 to-teal-600',
        route: '',
        subtitle: 'Estudiantes y Colaboradores',
      },
      {
        id: 'growth',
        title: 'Crecimiento Trimestral',
        value: Math.round((metrics.student_growth_rate + metrics.collaborator_growth_rate) / 2),
        trend: 'up' as const,
        trendPercentage: metrics.student_growth_rate,
        icon: '@tui.trending-up',
        iconBgClass: 'bg-gradient-to-br from-blue-500 to-indigo-600',
        route: '',
        subtitle: '% vs trimestre anterior',
      },
      {
        id: 'completion',
        title: 'Finalización de Talleres',
        value: metrics.workshops_completion_rate,
        trend: metrics.workshops_completion_rate > 70 ? ('up' as const) : ('down' as const),
        trendPercentage: metrics.workshops_completion_rate,
        icon: '@tui.book-open',
        iconBgClass: 'bg-gradient-to-br from-purple-500 to-pink-600',
        route: '',
        subtitle: '% talleres completados',
      },
      {
        id: 'coverage',
        title: 'Cobertura Global',
        value: metrics.active_headquarters_percentage,
        trend: 'stable' as const,
        trendPercentage: 0,
        icon: '@tui.globe',
        iconBgClass: 'bg-gradient-to-br from-cyan-500 to-blue-600',
        route: '',
        subtitle: '% sedes activas',
      },
    ];
  });

  healthCategories = computed<HealthScore[]>(() => {
    const metrics = this.healthMetrics.value();
    if (!metrics) return [];

    return [
      {
        category: 'Actividad Organizacional',
        score: Math.round(
          (metrics.active_headquarters_percentage +
            metrics.active_countries_percentage +
            metrics.workshops_completion_rate +
            metrics.agreements_review_rate) /
            4
        ),
        status: this.getStatus(
          (metrics.active_headquarters_percentage +
            metrics.active_countries_percentage +
            metrics.workshops_completion_rate +
            metrics.agreements_review_rate) /
            4
        ),
        trend: 'up',
        metrics: [
          {
            name: 'Sedes Activas',
            value: `${metrics.active_headquarters_percentage}%`,
            target: '90%',
            status:
              metrics.active_headquarters_percentage >= 90
                ? 'good'
                : metrics.active_headquarters_percentage >= 75
                  ? 'warning'
                  : 'critical',
          },
          {
            name: 'Países Activos',
            value: `${metrics.active_countries_percentage}%`,
            target: '100%',
            status:
              metrics.active_countries_percentage === 100
                ? 'good'
                : metrics.active_countries_percentage >= 80
                  ? 'warning'
                  : 'critical',
          },
          {
            name: 'Talleres Completados',
            value: `${metrics.workshops_completion_rate}%`,
            target: '80%',
            status:
              metrics.workshops_completion_rate >= 80
                ? 'good'
                : metrics.workshops_completion_rate >= 60
                  ? 'warning'
                  : 'critical',
          },
          {
            name: 'Acuerdos Revisados',
            value: `${metrics.agreements_review_rate}%`,
            target: '85%',
            status:
              metrics.agreements_review_rate >= 85
                ? 'good'
                : metrics.agreements_review_rate >= 70
                  ? 'warning'
                  : 'critical',
          },
        ],
      },
      {
        category: 'Participación y Compromiso',
        score: Math.round((metrics.student_participation_rate + metrics.collaborator_participation_rate) / 2),
        status: this.getStatus((metrics.student_participation_rate + metrics.collaborator_participation_rate) / 2),
        trend: 'up',
        metrics: [
          {
            name: 'Participación Estudiantil',
            value: `${metrics.student_participation_rate}%`,
            target: '90%',
            status:
              metrics.student_participation_rate >= 90
                ? 'good'
                : metrics.student_participation_rate >= 75
                  ? 'warning'
                  : 'critical',
          },
          {
            name: 'Participación de Colaboradores',
            value: `${metrics.collaborator_participation_rate}%`,
            target: '95%',
            status:
              metrics.collaborator_participation_rate >= 95
                ? 'good'
                : metrics.collaborator_participation_rate >= 85
                  ? 'warning'
                  : 'critical',
          },
          {
            name: 'Asistencia a Talleres',
            value: `${metrics.average_workshop_attendance}%`,
            target: '85%',
            status:
              metrics.average_workshop_attendance >= 85
                ? 'good'
                : metrics.average_workshop_attendance >= 70
                  ? 'warning'
                  : 'critical',
          },
        ],
      },
      {
        category: 'Crecimiento y Expansión',
        score: Math.min(100, Math.round((metrics.student_growth_rate + metrics.collaborator_growth_rate) * 3)),
        status: this.getStatus(Math.min(100, (metrics.student_growth_rate + metrics.collaborator_growth_rate) * 3)),
        trend: metrics.student_growth_rate > 10 ? 'up' : 'stable',
        metrics: [
          {
            name: 'Crecimiento de Estudiantes',
            value: `+${metrics.student_growth_rate}%`,
            target: '+10%',
            status:
              metrics.student_growth_rate >= 10 ? 'good' : metrics.student_growth_rate >= 5 ? 'warning' : 'critical',
          },
          {
            name: 'Crecimiento de Colaboradores',
            value: `+${metrics.collaborator_growth_rate}%`,
            target: '+5%',
            status:
              metrics.collaborator_growth_rate >= 5
                ? 'good'
                : metrics.collaborator_growth_rate >= 2
                  ? 'warning'
                  : 'critical',
          },
          {
            name: 'Nuevas Sedes',
            value: `${metrics.new_headquarters_last_quarter}`,
            target: '1',
            status: metrics.new_headquarters_last_quarter >= 1 ? 'good' : 'warning',
          },
        ],
      },
      {
        category: 'Calidad y Recursos',
        score: Math.min(
          100,
          Math.round(
            (metrics.facilitator_to_student_ratio * 500 +
              metrics.companion_to_student_ratio * 500 +
              metrics.average_workshop_attendance) /
              3
          )
        ),
        status: this.getStatus(
          Math.min(
            100,
            (metrics.facilitator_to_student_ratio * 500 +
              metrics.companion_to_student_ratio * 500 +
              metrics.average_workshop_attendance) /
              3
          )
        ),
        trend: 'stable',
        metrics: [
          {
            name: 'Ratio Facilitador/Estudiante',
            value: `1:${Math.round(1 / metrics.facilitator_to_student_ratio)}`,
            target: '1:10',
            status:
              metrics.facilitator_to_student_ratio >= 0.1
                ? 'good'
                : metrics.facilitator_to_student_ratio >= 0.07
                  ? 'warning'
                  : 'critical',
          },
          {
            name: 'Ratio Acompañante/Estudiante',
            value: `1:${Math.round(1 / metrics.companion_to_student_ratio)}`,
            target: '1:15',
            status:
              metrics.companion_to_student_ratio >= 0.067
                ? 'good'
                : metrics.companion_to_student_ratio >= 0.05
                  ? 'warning'
                  : 'critical',
          },
          {
            name: 'Promedio por Sede',
            value: `${metrics.average_students_per_hq}`,
            target: '60+',
            status:
              metrics.average_students_per_hq >= 60
                ? 'good'
                : metrics.average_students_per_hq >= 40
                  ? 'warning'
                  : 'critical',
          },
        ],
      },
    ];
  });

  // Chart data
  chartData = computed(() => {
    const categories = this.healthCategories();
    if (!categories.length) return [];

    return categories.map((cat) => ({
      value: cat.score,
      name: cat.category,
      color: this.getChartColor(cat.status),
    }));
  });

  // Trend data
  trendData = computed(() => {
    const metrics = this.healthMetrics.value();
    if (!metrics) return [];

    return [
      {
        name: 'Crecimiento Estudiantil',
        percentage: Math.min(100, metrics.student_growth_rate * 5),
        change: `+${metrics.student_growth_rate}%`,
        colorClass: 'text-emerald-600 dark:text-emerald-400',
        bgClass: 'bg-emerald-500',
      },
      {
        name: 'Crecimiento de Colaboradores',
        percentage: Math.min(100, metrics.collaborator_growth_rate * 10),
        change: `+${metrics.collaborator_growth_rate}%`,
        colorClass: 'text-blue-600 dark:text-blue-400',
        bgClass: 'bg-blue-500',
      },
      {
        name: 'Participación General',
        percentage: Math.round((metrics.student_participation_rate + metrics.collaborator_participation_rate) / 2),
        change: `${Math.round((metrics.student_participation_rate + metrics.collaborator_participation_rate) / 2)}%`,
        colorClass: 'text-purple-600 dark:text-purple-400',
        bgClass: 'bg-purple-500',
      },
      {
        name: 'Actividad Organizacional',
        percentage: Math.round((metrics.active_headquarters_percentage + metrics.workshops_completion_rate) / 2),
        change: `${Math.round((metrics.active_headquarters_percentage + metrics.workshops_completion_rate) / 2)}%`,
        colorClass: 'text-cyan-600 dark:text-cyan-400',
        bgClass: 'bg-cyan-500',
      },
    ];
  });

  isLoading = computed(() => this.isLoadingSignal() || this.healthMetrics.isLoading());

  // Helper methods
  getStatus(score: number): 'excellent' | 'good' | 'fair' | 'needs-improvement' {
    if (score >= 85) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'fair';
    return 'needs-improvement';
  }

  getHealthIcon(): string {
    const score = this.overallScore();
    if (score >= 80) return '@tui.circle-check';
    if (score >= 60) return '@tui.alert-circle';
    if (score >= 40) return '@tui.alert-triangle';
    return '@tui.x-circle';
  }

  getTrendIcon(trend: string): string {
    switch (trend) {
      case 'up':
        return '@tui.trending-up';
      case 'down':
        return '@tui.trending-down';
      default:
        return '@tui.minus';
    }
  }

  getScoreColorClass(score: number): string {
    if (score >= 85) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 70) return 'text-blue-600 dark:text-blue-400';
    if (score >= 50) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  }

  getStatusBgClass(status: string): string {
    switch (status) {
      case 'excellent':
        return 'bg-gradient-to-r from-emerald-500 to-teal-600';
      case 'good':
        return 'bg-gradient-to-r from-blue-500 to-cyan-600';
      case 'fair':
        return 'bg-gradient-to-r from-orange-500 to-amber-600';
      default:
        return 'bg-gradient-to-r from-red-500 to-rose-600';
    }
  }

  getCategoryHoverClass(status: string): string {
    switch (status) {
      case 'excellent':
        return 'hover:border-emerald-300/70 hover:shadow-emerald-500/20 dark:hover:border-emerald-600/70 dark:hover:shadow-emerald-400/20';
      case 'good':
        return 'hover:border-blue-300/70 hover:shadow-blue-500/20 dark:hover:border-blue-600/70 dark:hover:shadow-blue-400/20';
      case 'fair':
        return 'hover:border-orange-300/70 hover:shadow-orange-500/20 dark:hover:border-orange-600/70 dark:hover:shadow-orange-400/20';
      default:
        return 'hover:border-red-300/70 hover:shadow-red-500/20 dark:hover:border-red-600/70 dark:hover:shadow-red-400/20';
    }
  }

  getCategoryGradientClass(status: string): string {
    switch (status) {
      case 'excellent':
        return 'bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-600/5';
      case 'good':
        return 'bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-600/5';
      case 'fair':
        return 'bg-gradient-to-br from-orange-500/10 via-transparent to-amber-600/5';
      default:
        return 'bg-gradient-to-br from-red-500/10 via-transparent to-rose-600/5';
    }
  }

  getChartColor(status: string): string {
    switch (status) {
      case 'excellent':
        return 'var(--tui-status-positive)';
      case 'good':
        return 'var(--tui-status-info)';
      case 'fair':
        return 'var(--tui-status-warning)';
      default:
        return 'var(--tui-status-negative)';
    }
  }
}
