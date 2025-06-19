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
            <!-- Leadership Dashboard (Tier 3): View all organization data -->
            @case (3) {
              <!-- Organization KPIs -->
              @if (organizationKpis()) {
                <z-kpi-widget [data]="organizationKpis()!" />
              }

              <!-- Quick Actions -->
              <div>
                <h2 class="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
                  {{ 'dashboard.home.quickActions' | translate }}
                </h2>
                <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  @for (action of leadershipQuickActions; track action.title) {
                    <z-quick-action-card [data]="action" (actionClicked)="handleQuickAction($event)" />
                  }
                </div>
              </div>

              <!-- Recent Agreements -->
              <div class="my-8">
                <z-recent-agreements-widget
                  [agreements]="recentAgreements()"
                  [loading]="loadingAgreements()"
                  (viewAgreement)="navigateToAgreement($event)"
                />
              </div>
              <!-- Recent Activities -->
              <z-activity-feed
                [activities]="recentActivities()"
                [loading]="loadingActivities()"
                [title]="'dashboard.home.systemActivities' | translate"
              />
            }

            <!-- Operational Staff Dashboard (Tier 2): Headquarter-specific operations -->
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
                <h2 class="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
                  {{ 'dashboard.home.quickActions' | translate }}
                </h2>
                <div class="grid grid-cols-1 gap-8 sm:grid-cols-2">
                  @for (action of operationalQuickActions; track action.title) {
                    <z-quick-action-card [data]="action" (actionClicked)="handleQuickAction($event)" />
                  }
                </div>
              </div>

              <!-- Recent Activities -->
              <z-activity-feed [activities]="recentActivities()" [loading]="loadingActivities()" />
            }

            <!-- Student Dashboard (Tier 1): Personal information and activities -->
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
                <h2 class="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
                  {{ 'dashboard.home.quickActions' | translate }}
                </h2>
                <div class="grid grid-cols-1 gap-8 sm:grid-cols-2">
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

  loadingAgreements = signal(false);
  loadingActivities = signal(false);
  loadingHqMetrics = signal(false);
  headquarterMetrics = signal<HeadquarterMetrics | null>(null);
  myAgreement = signal<AgreementSummary | null>(null);
  recentActivities = signal<ActivityItem[]>([]);
  recentAgreements = signal<RecentAgreement[]>([]);

  organizationKpis = computed<KpiWidgetData | null>(() => {
    const stats = this.homeFacade.dashboardStats();
    if (!stats || this.userTier() !== 3 || !stats.metrics) return null;

    const metrics = stats.metrics as OrganizationMetrics;
    return {
      title: 'dashboard.home.organizationOverview',
      kpis: [
        {
          title: 'dashboard.home.totalHeadquarters',
          value: metrics.total_headquarters,
          icon: 'building',
        },
        {
          title: 'dashboard.home.activeAgreements',
          value: metrics.total_active_agreements,
          icon: 'file-text',
        },
        {
          title: 'dashboard.home.totalStudents',
          value: metrics.total_students,
          icon: 'users',
        },
        {
          title: 'dashboard.home.systemHealth',
          value: metrics.system_health?.status || 'Unknown',
          changeType: metrics.system_health?.status === 'healthy' ? 'increase' : 'decrease',
        },
      ],
    };
  });

  leadershipQuickActions: QuickActionData[] = [
    {
      title: 'dashboard.home.viewAllHeadquarters',
      description: 'dashboard.home.viewAllHeadquartersDesc',
      icon: 'building',
      route: '/dashboard/headquarters',
      color: 'sky',
    },
    {
      title: 'dashboard.home.globalAgreements',
      description: 'dashboard.home.globalAgreementsDesc',
      icon: 'file-text',
      route: '/dashboard/agreements',
      color: 'emerald',
    },
    {
      title: 'dashboard.home.generateReports',
      description: 'dashboard.home.generateReportsDesc',
      icon: 'chart-bar',
      action: 'generate-reports',
      color: 'purple',
    },
  ];

  operationalQuickActions: QuickActionData[] = [
    {
      title: 'dashboard.home.newAgreement',
      description: 'dashboard.home.newAgreementDesc',
      icon: 'user-plus',
      route: '/dashboard/agreements/new',
      color: 'emerald',
    },
    {
      title: 'dashboard.home.manageStudents',
      description: 'dashboard.home.manageStudentsDesc',
      icon: 'users',
      route: '/dashboard/students',
      color: 'sky',
    },
  ];

  studentQuickActions: QuickActionData[] = [
    {
      title: 'dashboard.home.myProfile',
      description: 'dashboard.home.myProfileDesc',
      icon: 'user',
      route: '/dashboard/profile',
      color: 'sky',
    },
    {
      title: 'dashboard.home.myDocuments',
      description: 'dashboard.home.myDocumentsDesc',
      icon: 'file-text',
      action: 'view-documents',
      color: 'purple',
    },
  ];

  ngOnInit() {
    this.loadUserData();
  }

  private async loadUserData() {
    try {
      const session = this.authService.session();
      const user = session?.user;

      if (!user) {
        this.router.navigate(['/auth/login']);
        return;
      }

      this.userId.set(user.id);

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

      // Get agreement ID by querying the database with user ID
      const agreementId = await this.homeFacade.getAgreementIdByUserId(user.id);
      if (agreementId) {
        await this.homeFacade.loadDashboardStats(agreementId);
      } else {
        console.warn('No agreement found for user:', user.id);
      }

      // Load tier-specific data
      await this.loadTierSpecificData();
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  private async loadTierSpecificData() {
    const session = this.authService.session();
    const user = session?.user;
    if (!user) return;

    const roleLevelValue = this.roleService.roleLevel();
    const roleLevel = typeof roleLevelValue === 'string' ? parseInt(roleLevelValue, 10) : roleLevelValue || 0;

    // Get agreement ID by querying the database with user ID
    const agreementId = await this.homeFacade.getAgreementIdByUserId(user.id);
    if (!agreementId) {
      console.warn('No agreement found for user:', user.id);
      return;
    }

    // Load activities for all tiers
    this.loadingActivities.set(true);
    try {
      const activities = await this.homeFacade.loadRecentActivities(agreementId, roleLevel, 10);
      this.recentActivities.set(this.mapActivities(activities));
    } finally {
      this.loadingActivities.set(false);
    }

    // Load tier-specific data
    switch (this.userTier()) {
      case 1: {
        // Student - load their agreement summary
        const agreement = await this.homeFacade.loadMyAgreementSummary(agreementId);
        this.myAgreement.set(agreement);
        break;
      }

      case 2: // Operational Staff
        this.loadingHqMetrics.set(true);
        try {
          // Get headquarter ID from dashboard stats
          const dashboardStats = this.homeFacade.dashboardStats();
          if (dashboardStats?.headquarter_info) {
            const hqInfo = dashboardStats.headquarter_info as Record<string, unknown>;
            const hqId = hqInfo['id'];
            if (typeof hqId === 'string') {
              const hqMetrics = await this.homeFacade.loadHeadquarterQuickStats(hqId);
              this.headquarterMetrics.set(hqMetrics);
            }
          }
        } finally {
          this.loadingHqMetrics.set(false);
        }
        break;

      case 3: // Leadership
        this.loadingAgreements.set(true);
        try {
          // Get recent agreements from dashboard stats
          const dashboardStats = this.homeFacade.dashboardStats();
          if (dashboardStats?.recent_agreements && Array.isArray(dashboardStats.recent_agreements)) {
            const agreements = dashboardStats.recent_agreements.map((agreement: Record<string, unknown>) => ({
              id: String(agreement['id'] || ''),
              name: String(agreement['user_name'] || 'User'),
              email: String(agreement['user_email'] || ''),
              role: String(agreement['role_name'] || ''),
              status: agreement['status'] as 'active' | 'pending' | 'expired' | 'cancelled',
              createdAt: String(agreement['created_at'] || ''),
              headquarter: String(agreement['headquarter_name'] || ''),
            }));
            this.recentAgreements.set(agreements);
          }
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
