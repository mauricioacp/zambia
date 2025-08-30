import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@zambia/data-access-auth';
import { RoleService } from '@zambia/data-access-roles-permissions';
import { TuiLoader } from '@taiga-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  HomepageFacadeService,
  OrganizationMetrics,
  HeadquarterMetrics,
  AgreementSummary,
} from '../../../services/home-facade.service';
import { KpiWidgetComponent, KpiWidgetData } from '../../ui/kpi-widget/kpi-widget.ui-component';
import { QuickActionCardComponent, QuickActionData } from '../../ui/quick-action-card/quick-action-card.ui-component';
import { ActivityFeedComponent, ActivityItem } from '../../ui/activity-feed/activity-feed.ui-component';
import {
  RecentAgreementsWidgetComponent,
  RecentAgreement,
} from '../../ui/recent-agreements-widget/recent-agreements-widget.ui-component';
import { HeadquarterMetricsWidgetComponent } from '../../ui/headquarter-metrics-widget/headquarter-metrics-widget.ui-component';

export type UserTier = 1 | 2 | 3; // 1: Student, 2: Operational Staff, 3: Leadership

@Component({
  selector: 'z-home',
  standalone: true,
  imports: [
    CommonModule,

    TuiLoader,
    TranslateModule,
    KpiWidgetComponent,
    QuickActionCardComponent,
    ActivityFeedComponent,
    RecentAgreementsWidgetComponent,
    HeadquarterMetricsWidgetComponent,
  ],
  template: `
    <div class="container mx-auto px-6 py-8 sm:px-8">
      @if (isLoading()) {
        <div class="flex h-64 items-center justify-center">
          <tui-loader size="l" />
        </div>
      } @else {
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
            {{ 'dashboard.home.welcome' | translate }}, {{ userDisplayName() || 'User' }}
          </h1>
          <p class="mt-2 text-gray-600 dark:text-gray-300">
            {{ getUserTierTranslationKey() | translate }}
          </p>
        </div>

        <!-- Tier-specific dashboard content -->
        <div class="space-y-8">
          @switch (userTier()) {
            <!-- Leadership Dashboard (Tier 3) -->
            @case (3) {
              <!-- Organization KPIs -->
              @if (organizationKpis()) {
                <z-kpi-widget [data]="organizationKpis()!" />
              }

              <!-- Quick Actions -->
              <div>
                <h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                  {{ 'dashboard.home.quickActions' | translate }}
                </h2>
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  @for (action of leadershipQuickActions; track action.title) {
                    <z-quick-action-card [data]="action" (actionClicked)="handleQuickAction($event)" />
                  }
                </div>
              </div>

              <!-- Recent Agreements -->
              <z-recent-agreements-widget
                [agreements]="recentAgreements()"
                [loading]="loadingAgreements()"
                (viewAgreement)="navigateToAgreement($event)"
              />

              <!-- Recent Activities -->
              <z-activity-feed
                [activities]="recentActivities()"
                [loading]="loadingActivities()"
                [title]="'dashboard.home.systemActivities' | translate"
              />
            }

            <!-- Operational Staff Dashboard (Tier 2) -->
            @case (2) {
              <!-- Headquarter Metrics -->
              @if (headquarterMetrics()) {
                <z-headquarter-metrics-widget
                  [metrics]="headquarterMetrics()"
                  [loading]="loadingHqMetrics()"
                  [title]="'dashboard.home.myHeadquarterPerformance' | translate"
                />
              }

              <!-- Quick Actions -->
              <div>
                <h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                  {{ 'dashboard.home.quickActions' | translate }}
                </h2>
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  @for (action of operationalQuickActions; track action.title) {
                    <z-quick-action-card [data]="action" (actionClicked)="handleQuickAction($event)" />
                  }
                </div>
              </div>

              <!-- Recent Activities -->
              <z-activity-feed [activities]="recentActivities()" [loading]="loadingActivities()" />
            }

            <!-- Student Dashboard (Tier 1) -->
            @default {
              <!-- Student Agreement Info -->
              @if (myAgreement()) {
                <div
                  class="rounded-2xl border border-gray-200/50 bg-white/90 p-6 shadow-lg shadow-gray-900/5 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/90 dark:shadow-slate-900/20"
                >
                  <h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                    {{ 'dashboard.home.myAgreement' | translate }}
                  </h2>
                  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <p class="text-sm text-gray-600 dark:text-gray-400">{{ 'dashboard.home.role' | translate }}</p>
                      <p class="mt-1 font-medium text-gray-900 dark:text-white">
                        {{ myAgreement()!.role }}
                      </p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-600 dark:text-gray-400">{{ 'dashboard.home.status' | translate }}</p>
                      <p class="mt-1 font-medium text-gray-900 dark:text-white">
                        {{ myAgreement()!.status }}
                      </p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                        {{ 'dashboard.home.headquarter' | translate }}
                      </p>
                      <p class="mt-1 font-medium text-gray-900 dark:text-white">
                        {{ myAgreement()!.headquarter_name }}
                      </p>
                    </div>
                  </div>
                </div>
              }

              <!-- Student Quick Actions -->
              <div>
                <h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                  {{ 'dashboard.home.quickActions' | translate }}
                </h2>
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  @for (action of studentQuickActions; track action.title) {
                    <z-quick-action-card [data]="action" (actionClicked)="handleQuickAction($event)" />
                  }
                </div>
              </div>

              <!-- Recent Activities -->
              <z-activity-feed
                [activities]="recentActivities()"
                [loading]="loadingActivities()"
                [title]="'dashboard.home.myRecentActivities' | translate"
              />
            }
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeSmartComponent implements OnInit {
  private authService = inject(AuthService);
  private roleService = inject(RoleService);
  private router = inject(Router);
  private homeFacade = inject(HomepageFacadeService);

  isLoading = signal(true);
  userRole = signal<string>('');
  userTier = signal<UserTier>(1);
  userDisplayName = signal<string>('');
  userId = signal<string>('');

  // Data signals
  loadingAgreements = signal(false);
  loadingActivities = signal(false);
  loadingHqMetrics = signal(false);
  headquarterMetrics = signal<HeadquarterMetrics | null>(null);
  myAgreement = signal<AgreementSummary | null>(null);
  recentActivities = signal<ActivityItem[]>([]);
  recentAgreements = signal<RecentAgreement[]>([]);

  // Computed KPI data
  organizationKpis = computed<KpiWidgetData | null>(() => {
    const stats = this.homeFacade.dashboardStats();
    if (!stats || this.userTier() !== 3 || !stats.metrics) return null;

    const metrics = stats.metrics as OrganizationMetrics;
    return {
      title: 'Organization Overview',
      kpis: [
        {
          title: 'Total Headquarters',
          value: metrics.total_headquarters,
          icon: 'M3.75 21h16.5M4.5 3h15M5.25 7.5h13.5m-13.5 4.5h13.5M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21',
        },
        {
          title: 'Active Agreements',
          value: metrics.total_active_agreements,
          icon: 'M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08',
        },
        {
          title: 'Total Students',
          value: metrics.total_students,
          icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766',
        },
        {
          title: 'System Health',
          value: metrics.system_health?.status || 'Unknown',
          changeType: metrics.system_health?.status === 'healthy' ? 'increase' : 'decrease',
        },
      ],
    };
  });

  // Quick Actions
  leadershipQuickActions: QuickActionData[] = [
    {
      title: 'View All Headquarters',
      description: 'Manage headquarters across regions',
      icon: 'M3.75 21h16.5M4.5 3h15M5.25 7.5h13.5m-13.5 4.5h13.5',
      route: '/dashboard/headquarters',
      color: 'sky',
    },
    {
      title: 'Global Agreements',
      description: 'Review all active agreements',
      icon: 'M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108',
      route: '/dashboard/agreements',
      color: 'emerald',
    },
    {
      title: 'Generate Reports',
      description: 'Create custom analytics reports',
      icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75z',
      action: 'generate-reports',
      color: 'purple',
    },
  ];

  operationalQuickActions: QuickActionData[] = [
    {
      title: 'New Agreement',
      description: 'Register a new student or staff',
      icon: 'M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z',
      route: '/dashboard/agreements/new',
      color: 'emerald',
    },
    {
      title: 'Manage Students',
      description: 'View and update student records',
      icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952',
      route: '/dashboard/students',
      color: 'sky',
    },
  ];

  studentQuickActions: QuickActionData[] = [
    {
      title: 'My Profile',
      description: 'View and update your information',
      icon: 'M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0',
      route: '/dashboard/profile',
      color: 'sky',
    },
    {
      title: 'My Documents',
      description: 'Access your agreement documents',
      icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5',
      action: 'view-documents',
      color: 'purple',
    },
  ];

  ngOnInit() {
    this.loadUserData();
  }

  private async loadUserData() {
    try {
      // Get current session
      const session = this.authService.session();
      const user = session?.user;

      if (!user) {
        this.router.navigate(['/auth/login']);
        return;
      }

      this.userId.set(user.id);

      // Get user metadata
      const metadata = user.user_metadata || {};
      const role = metadata['role'] || '';
      const roleLevel = metadata['role_level'] || 0;
      const firstName = metadata['first_name'] || user.email?.split('@')[0] || 'User';

      this.userRole.set(role);
      this.userDisplayName.set(firstName);

      // Determine user tier based on role level
      if (roleLevel >= 51) {
        this.userTier.set(3); // Leadership tier
      } else if (roleLevel >= 20) {
        this.userTier.set(2); // Operational tier
      } else {
        this.userTier.set(1); // Student tier
      }

      // Load dashboard data
      await this.homeFacade.loadDashboardStats(user.id, roleLevel);

      // Load tier-specific data
      await this.loadTierSpecificData();
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  private async loadTierSpecificData() {
    const userId = this.userId();
    const roleLevelValue = this.roleService.roleLevel();
    const roleLevel = typeof roleLevelValue === 'string' ? parseInt(roleLevelValue, 10) : roleLevelValue || 0;

    // Load activities for all tiers
    this.loadingActivities.set(true);
    try {
      const activities = await this.homeFacade.loadRecentActivities(userId, roleLevel, 10);
      this.recentActivities.set(this.mapActivities(activities));
    } finally {
      this.loadingActivities.set(false);
    }

    // Load tier-specific data
    switch (this.userTier()) {
      case 1: {
        // Student
        const agreement = await this.homeFacade.loadMyAgreementSummary(userId);
        this.myAgreement.set(agreement);
        break;
      }

      case 2: // Operational Staff
        this.loadingHqMetrics.set(true);
        try {
          // TODO: Get headquarter ID from user's agreement
          const hqMetrics = await this.homeFacade.loadHeadquarterQuickStats('mock-hq-id');
          this.headquarterMetrics.set(hqMetrics);
        } finally {
          this.loadingHqMetrics.set(false);
        }
        break;

      case 3: // Leadership
        this.loadingAgreements.set(true);
        try {
          // TODO: Load recent agreements from facade
          this.recentAgreements.set([]);
        } finally {
          this.loadingAgreements.set(false);
        }
        break;
    }
  }

  private mapActivities(activities: Array<Record<string, unknown>>): ActivityItem[] {
    return activities.map((activity, index) => ({
      id: (activity['id'] as string) || `activity-${index}`,
      title: (activity['title'] as string) || 'Activity',
      description: (activity['description'] as string) || '',
      timestamp: (activity['created_at'] as string) || new Date().toISOString(),
      type: (activity['type'] as ActivityItem['type']) || 'info',
      icon: activity['icon'] as string,
    }));
  }

  getUserTierTranslationKey(): string {
    switch (this.userTier()) {
      case 3:
        return 'dashboard.home.leadershipDashboard';
      case 2:
        return 'dashboard.home.operationalDashboard';
      default:
        return 'dashboard.home.studentDashboard';
    }
  }

  handleQuickAction(action: string) {
    console.log('Quick action clicked:', action);
    // TODO: Implement action handlers
  }

  navigateToAgreement(agreementId: string) {
    this.router.navigate(['/dashboard/agreements', agreementId]);
  }
}
