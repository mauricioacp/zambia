import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';
import { SectionHeaderUiComponent } from '@zambia/ui-components';
import { RouterLink } from '@angular/router';
import { ROLE } from '@zambia/util-roles-definitions';
import { HasRoleDirective } from '@zambia/util-roles-permissions';
import { TuiIcon } from '@taiga-ui/core';

@Component({
  selector: 'z-student-dashboard',
  standalone: true,
  imports: [TranslateModule, SectionHeaderUiComponent, RouterLink, HasRoleDirective, TuiIcon],
  template: `
    <!-- Organization Overview -->
    <div>
      <z-section-header [icon]="'@tui.globe'" [iconColor]="'purple'" [compact]="true" [showDescription]="false">
        <span title>{{ 'dashboard.student.home' | translate }}</span>
      </z-section-header>
      <section class="px-6 py-2 sm:px-8">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <!-- Profile Navigation Card -->
          <a
            routerLink="/dashboard/profile"
            class="group relative block overflow-hidden rounded-2xl border border-gray-200/50 bg-white/90 p-6 shadow-lg shadow-gray-900/5 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-purple-300/70 hover:shadow-xl hover:shadow-purple-500/20 dark:border-slate-700/50 dark:bg-slate-800/90 dark:shadow-slate-900/20 dark:hover:border-purple-600/70 dark:hover:shadow-purple-500/30"
            [attr.aria-label]="'profile.title' | translate"
          >
            <div class="relative z-10">
              <div class="mb-4 flex items-center gap-4">
                <div
                  class="rounded-xl bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 p-3 shadow-lg shadow-purple-500/25"
                >
                  <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    {{ 'profile.title' | translate }}
                  </h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ 'profile.subtitle' | translate }}
                  </p>
                </div>
              </div>
            </div>
            <div
              class="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            ></div>
          </a>
          <!-- Agreements Navigation Card -->
          <a
            *zHasRoleMin="this.ROLE.MANAGER_ASSISTANT"
            routerLink="/dashboard/agreements"
            class="group relative block overflow-hidden rounded-2xl border border-gray-200/50 bg-white/90 p-6 shadow-lg shadow-gray-900/5 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-indigo-300/70 hover:shadow-xl hover:shadow-indigo-500/20 dark:border-slate-700/50 dark:bg-slate-800/90 dark:shadow-slate-900/20 dark:hover:border-indigo-600/70 dark:hover:shadow-indigo-500/30"
            [attr.aria-label]="'agreement.title' | translate"
          >
            <div class="relative z-10">
              <div class="mb-4 flex items-center gap-4">
                <div
                  class="rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-700 p-3 shadow-lg shadow-indigo-500/25"
                >
                  <tui-icon [icon]="'@tui.handshake'" class="!h-6 !w-6 text-white" />
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    {{ 'agreement.title' | translate }}
                  </h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ 'agreement.subtitle' | translate }}
                  </p>
                </div>
              </div>
            </div>
            <div
              class="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            ></div>
          </a>
        </div>
      </section>
    </div>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentDashboardSmartComponent {
  protected ROLE = ROLE;
}
