import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, UserMetadataService } from '@zambia/data-access-auth';
import { RoleService } from '@zambia/data-access-roles-permissions';
import { TuiLoader } from '@taiga-ui/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  AgreementSummary,
  HeadquarterMetrics,
  HomepageFacadeService,
  OrganizationMetrics,
} from '../../services/home-facade.service';
import { KpiWidgetData } from '../ui/kpi-widget/kpi-widget.ui-component';
import { QuickActionData } from '../ui/quick-action-card/quick-action-card.ui-component';
import { ActivityItem } from '../ui/activity-feed/activity-feed.ui-component';
import { RecentAgreement } from '../ui/recent-agreements-widget/recent-agreements-widget.ui-component';
import { getRoleGroupNameByRoleCode } from '@zambia/util-roles-definitions';
import { DashboardData } from '../../types/dashboard-data.interface';
import { AdministrationDashboardSmartComponent } from './administration-dashboard/administration-dashboard.smart-component';
import { LeadershipDashboardSmartComponent } from './leadership-dashboard/leadership-dashboard.smart-component';
import { HeadquartersDashboardSmartComponent } from './headquarters-dashboard/headquarters-dashboard.smart-component';
import { FieldStaffDashboardSmartComponent } from './field-staff-dashboard/field-staff-dashboard.smart-component';
import { StudentDashboardSmartComponent } from './student-home.smart-component';
import { TuiSkeleton } from '@taiga-ui/kit';
import { WelcomeHeaderUiComponent } from '@zambia/ui-components';

@Component({
  selector: 'z-home',
  standalone: true,
  imports: [CommonModule, NgComponentOutlet, TuiLoader, TranslateModule, TuiSkeleton, WelcomeHeaderUiComponent],
  template: `
    <div class="container mx-auto px-6 py-8 sm:px-8">
      <z-welcome-header [data]="welcomeHeaderData()" />

      <ng-template #dashboardSkeleton>
        <div class="space-y-4">
          <div [tuiSkeleton]="true" class="h-32 rounded-2xl"></div>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            @for (i of [1, 2, 3, 4]; track i) {
              <div [tuiSkeleton]="true" class="h-24 rounded-xl"></div>
            }
          </div>
          <div [tuiSkeleton]="true" class="h-32 rounded-2xl"></div>
        </div>
      </ng-template>

      <ng-template #simpleLoader>
        <div class="flex h-64 items-center justify-center">
          <tui-loader size="l" />
        </div>
      </ng-template>

      <!-- Role-based Dashboard Content -->
      <div class="mt-8">
        @defer (when !isLoading(); prefetch on idle) {
          <ng-container [ngComponentOutlet]="dashboardComponent()" />
        } @placeholder {
          <ng-container [ngTemplateOutlet]="dashboardSkeleton"></ng-container>
        } @loading (after 100ms; minimum 1s) {
          <ng-container [ngTemplateOutlet]="dashboardSkeleton"></ng-container>
        }
      </div>
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
  private userMetadataService = inject(UserMetadataService);
  private roleService = inject(RoleService);
  private router = inject(Router);
  private homeFacade = inject(HomepageFacadeService);
  private translateService = inject(TranslateService);

  isLoading = signal(true);

  private readonly roleComponentMap = {
    ADMINISTRATION: AdministrationDashboardSmartComponent,
    TOP_MANAGEMENT: LeadershipDashboardSmartComponent,
    LEADERSHIP_TEAM: LeadershipDashboardSmartComponent,
    COORDINATION_TEAM: LeadershipDashboardSmartComponent,
    HEADQUARTERS_MANAGEMENT: HeadquartersDashboardSmartComponent,
    LOCAL_MANAGEMENT_TEAM: HeadquartersDashboardSmartComponent,
    ASSISTANTS: HeadquartersDashboardSmartComponent,
    FIELD_STAFF: FieldStaffDashboardSmartComponent,
    STUDENTS: StudentDashboardSmartComponent,
    NONE: StudentDashboardSmartComponent,
  };

  userRole = computed(() => this.userMetadataService.userMetadata().role || '');
  userRoleGroup = computed(() => getRoleGroupNameByRoleCode(this.userRole()));
  userLevel = computed(() => this.roleService.roleLevel());
  userDisplayName = computed(() => {
    const metadata = this.userMetadataService.userMetadata();
    return metadata.firstName && metadata.lastName
      ? `${metadata.firstName} ${metadata.lastName}`.trim()
      : metadata.email || 'User';
  });

  welcomeHeaderData = computed(() => ({
    title: this.translateService.instant('panel.title'),
    beforeTitleText: `${this.translateService.instant('dashboard.home.welcome')}, ${this.userDisplayName()}`,
    showStatus: true,
  }));

  loadingAgreements = signal(false);
  loadingActivities = signal(false);
  loadingHqMetrics = signal(false);
  headquarterMetrics = signal<HeadquarterMetrics | null>(null);
  myAgreement = signal<AgreementSummary | null>(null);
  recentActivities = signal<ActivityItem[]>([]);
  recentAgreements = signal<RecentAgreement[]>([]);

  organizationKpis = computed<KpiWidgetData | null>(() => {
    const stats = this.homeFacade.dashboardStats();
    if (!stats || this.userLevel() !== 3 || !stats.metrics) return null;

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

  // Computed dashboard component based on role
  dashboardComponent = computed(() => {
    const roleGroup = this.userRoleGroup();
    return this.roleComponentMap[roleGroup as keyof typeof this.roleComponentMap] || StudentDashboardSmartComponent;
  });

  // Computed inputs for the dynamic component
  dashboardInputs = computed(() => ({
    data: this.dashboardData(),
  }));

  // Computed dashboard data for all role components
  dashboardData = computed<DashboardData>(() => ({
    userMetadata: this.userMetadataService.userMetadata(),
    userRole: this.userRole(),
    userDisplayName: this.userDisplayName(),
    organizationKpis: this.organizationKpis(),
    headquarterMetrics: this.headquarterMetrics(),
    myAgreement: this.myAgreement(),
    recentActivities: this.recentActivities(),
    recentAgreements: this.recentAgreements(),
    loadingAgreements: this.loadingAgreements(),
    loadingActivities: this.loadingActivities(),
    loadingHqMetrics: this.loadingHqMetrics(),
    quickActions: {
      leadership: this.leadershipQuickActions,
      operational: this.operationalQuickActions,
      student: this.studentQuickActions,
    },
  }));

  ngOnInit() {
    this.loadUserData();
  }

  private async loadUserData() {
    try {
      const userMetadata = this.userMetadataService.userMetadata();

      if (!userMetadata.userId) {
        this.router.navigate(['/auth/login']);
        return;
      }

      // Get agreement ID by querying the database with user ID
      const agreementId = await this.homeFacade.getAgreementIdByUserId(userMetadata.userId || '');
      if (agreementId) {
        await this.homeFacade.loadDashboardStats(agreementId);
      } else {
        console.warn('No agreement found for user:', userMetadata.userId);
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
    switch (this.userLevel()) {
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
    switch (this.userLevel()) {
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
