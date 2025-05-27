import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleService } from '@zambia/data-access-roles-permissions';
import { HomepageFacadeService, QuickActionData } from '../../services/homepage-facade.service';
import { KpiCardUiComponent, QuickActionCardUiComponent } from '@zambia/ui-components';
import { TranslateModule } from '@ngx-translate/core';
import { TuiSkeleton } from '@taiga-ui/kit';
import { Router } from '@angular/router';

@Component({
  selector: 'z-homepage',
  imports: [CommonModule, KpiCardUiComponent, QuickActionCardUiComponent, TranslateModule, TuiSkeleton],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-slate-900">
      <!-- Welcome Header -->
      <div class="relative overflow-hidden">
        <!-- Background Glow -->
        <div
          class="absolute inset-0 -inset-x-6 rounded-3xl bg-gradient-to-r from-blue-300 via-teal-500 to-blue-700 opacity-10 blur-2xl"
        ></div>

        <!-- Glass Header Container -->
        <div
          class="relative rounded-2xl bg-white/40 p-2.5 ring-1 ring-gray-200/50 backdrop-blur-sm dark:bg-gray-500/20 dark:ring-gray-700/60"
        >
          <div
            class="rounded-xl bg-white/95 p-6 shadow-xl shadow-gray-900/5 dark:bg-gray-950/95 dark:shadow-slate-900/20"
          >
            <div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 class="mb-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
                  {{ 'homepage.welcome' | translate }}
                </h1>
                <p class="text-lg text-gray-600 dark:text-gray-300">
                  {{ welcomeText() }}
                </p>
              </div>

              <!-- Status Indicator -->
              <div class="flex items-center gap-3">
                <div class="rounded-full bg-emerald-100 p-2 dark:bg-emerald-900/30">
                  <div class="h-2 w-2 rounded-full bg-emerald-500"></div>
                </div>
                <span class="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {{ 'homepage.systemActive' | translate }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- KPI Overview Section -->
      <section class="px-6 py-8 sm:px-8">
        <div class="mb-6">
          <h2 class="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            {{ 'homepage.keyMetrics' | translate }}
          </h2>
          <p class="text-gray-600 dark:text-gray-300">
            {{ isGlobalView() ? ('homepage.globalMetricsDesc' | translate) : ('homepage.hqMetricsDesc' | translate) }}
          </p>
        </div>

        @defer (on viewport; prefetch on idle) {
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            @for (kpi of homePageFacade.keyMetrics(); track kpi.id) {
              <z-kpi-card
                [kpiData]="kpi"
                [loading]="homePageFacade.isLoading()"
                (cardClicked)="navigateToEntity(kpi.route)"
              />
            }
          </div>
        } @placeholder {
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            @for (i of [1, 2, 3, 4]; track i) {
              <div class="h-32 w-full rounded-2xl bg-white/40 backdrop-blur-sm" [tuiSkeleton]="true"></div>
            }
          </div>
        } @loading {
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            @for (i of [1, 2, 3, 4]; track i) {
              <div
                class="h-32 w-full animate-pulse rounded-2xl bg-white/40 backdrop-blur-sm"
                [tuiSkeleton]="true"
              ></div>
            }
          </div>
        }
      </section>

      <!-- Quick Actions Section -->
      <section class="px-6 py-8 sm:px-8">
        <div class="mb-6">
          <h2 class="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            {{ 'homepage.quickActions' | translate }}
          </h2>
          <p class="text-gray-600 dark:text-gray-300">
            {{ 'homepage.quickActionsDesc' | translate }}
          </p>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          @for (action of quickActions(); track action.id) {
            <z-quick-action-card [actionData]="action" (actionClicked)="executeQuickAction(action)" />
          }
        </div>
      </section>

      <!-- Status Dashboard Section -->
      @if (isManagerLevel()) {
        <section class="px-6 py-8 sm:px-8">
          <div class="mb-6">
            <div class="flex items-center gap-3">
              <div
                class="rounded-xl bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 p-3 shadow-lg shadow-purple-500/25"
              >
                <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  ></path>
                </svg>
              </div>
              <div>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                  {{ 'homepage.statusDashboard' | translate }}
                </h2>
                <p class="text-gray-600 dark:text-gray-300">
                  {{ 'homepage.statusDashboardDesc' | translate }}
                </p>
              </div>
            </div>
          </div>

          @defer (on viewport; prefetch on idle) {
            <div class="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
              @for (status of homePageFacade.statusCards(); track status.id) {
                <button
                  class="group relative w-full overflow-hidden rounded-2xl border border-gray-200/50 bg-white/90 p-6 text-left shadow-lg shadow-gray-900/5 backdrop-blur-sm transition-all duration-300 hover:border-gray-300/70 hover:shadow-xl hover:shadow-gray-900/10 dark:border-slate-700/50 dark:bg-slate-800/90 dark:shadow-slate-900/20 dark:hover:border-slate-600/70 dark:hover:shadow-slate-900/40"
                  (click)="navigateToEntity(status.route)"
                  [attr.aria-label]="'Navigate to ' + status.title"
                >
                  <div class="relative z-10">
                    <div class="mb-4 flex items-center justify-between">
                      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ status.title }}</h3>
                      <div class="rounded-lg bg-gradient-to-r p-2" [ngClass]="status.iconBgClass">
                        <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            [attr.d]="status.iconPath"
                          ></path>
                        </svg>
                      </div>
                    </div>

                    <div class="space-y-3">
                      @for (metric of status.metrics; track metric.label) {
                        <div class="flex items-center justify-between">
                          <span class="text-sm text-gray-600 dark:text-gray-400">{{ metric.label }}</span>
                          <span class="font-semibold" [ngClass]="metric.colorClass">{{ metric.value }}</span>
                        </div>
                      }
                    </div>
                  </div>

                  <!-- Hover overlay -->
                  <div
                    class="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-slate-700/30"
                  ></div>
                </button>
              }
            </div>
          } @placeholder {
            <div class="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
              @for (i of [1, 2, 3]; track i) {
                <div class="h-40 w-full rounded-2xl bg-white/40 backdrop-blur-sm" [tuiSkeleton]="true"></div>
              }
            </div>
          }
        </section>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomepageSmartComponent {
  protected roleService = inject(RoleService);
  protected homePageFacade = inject(HomepageFacadeService);
  private router = inject(Router);

  protected welcomeText = computed(() => this.roleService.getWelcomeText());

  protected isGlobalView = computed(() => {
    const roleLevel = this.roleService.roleLevel();
    return roleLevel !== null && Number(roleLevel) >= 51;
  });

  protected isManagerLevel = computed(() => {
    const roleLevel = this.roleService.roleLevel();
    return roleLevel !== null && Number(roleLevel) >= 50;
  });

  protected quickActions = computed(() => this.homePageFacade.getQuickActionsForRole());

  protected navigateToEntity(route: string): void {
    if (route) {
      this.router.navigate([route]);
    }
  }

  protected executeQuickAction(action: QuickActionData): void {
    if (action.route) {
      this.router.navigate([action.route]);
    } else if (action.action) {
      action.action();
    }
  }
}
