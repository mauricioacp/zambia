import { UserMetadata } from '@zambia/data-access-auth';
import { KpiWidgetData } from '../components/ui/kpi-widget/kpi-widget.ui-component';
import { ActivityItem } from '../components/ui/activity-feed/activity-feed.ui-component';
import { RecentAgreement } from '../components/ui/recent-agreements-widget/recent-agreements-widget.ui-component';
import { QuickActionData } from '../components/ui/quick-action-card/quick-action-card.ui-component';
import { HeadquarterMetrics, AgreementSummary } from '../services/home-facade.service';

export interface DashboardData {
  userMetadata: UserMetadata;
  userRole: string;
  userDisplayName: string;
  organizationKpis: KpiWidgetData | null;
  headquarterMetrics: HeadquarterMetrics | null;
  myAgreement: AgreementSummary | null;
  recentActivities: ActivityItem[];
  recentAgreements: RecentAgreement[];
  loadingAgreements: boolean;
  loadingActivities: boolean;
  loadingHqMetrics: boolean;
  quickActions: {
    leadership: QuickActionData[];
    operational: QuickActionData[];
    student: QuickActionData[];
  };
}
