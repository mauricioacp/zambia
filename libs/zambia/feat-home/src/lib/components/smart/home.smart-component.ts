import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { TuiLoader } from '@taiga-ui/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { getRoleGroupNameByRoleCode } from '@zambia/util-roles-definitions';

import { AdministrationDashboardSmartComponent } from './administration-dashboard/administration-dashboard.smart-component';
import { LeadershipDashboardSmartComponent } from './leadership-dashboard/leadership-dashboard.smart-component';
import { HeadquartersDashboardSmartComponent } from './headquarters-dashboard/headquarters-dashboard.smart-component';
import { FieldStaffDashboardSmartComponent } from './field-staff-dashboard/field-staff-dashboard.smart-component';
import { StudentDashboardSmartComponent } from './student-home.smart-component';
import { TuiSkeleton } from '@taiga-ui/kit';
import { WelcomeHeaderUiComponent } from '@zambia/ui-components';
import { UserMetadataService } from '@zambia/data-access-auth';

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
        @defer (prefetch on idle) {
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
export class HomeSmartComponent {
  private userMetadataService = inject(UserMetadataService);
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
  userDisplayName = computed(() => this.userMetadataService.userDisplayName());

  welcomeHeaderData = computed(() => ({
    title: this.translateService.instant('panel.title'),
    beforeTitleText: `${this.translateService.instant('dashboard.home.welcome')}, ${this.userDisplayName()}`,
    showStatus: true,
    subtitle: `${this.translateService.instant('associated_rol')}: ${this.userRole()}`,
  }));

  dashboardComponent = computed(() => {
    const roleGroup = this.userRoleGroup();
    return this.roleComponentMap[roleGroup as keyof typeof this.roleComponentMap] || StudentDashboardSmartComponent;
  });
}
