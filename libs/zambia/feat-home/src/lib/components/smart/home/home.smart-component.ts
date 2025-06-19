import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@zambia/data-access-auth';
import { RoleService } from '@zambia/data-access-roles-permissions';
import { Router } from '@angular/router';
import { TuiLoader } from '@taiga-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { HomepageFacadeService } from '../../../services/home-facade.service';

type UserTier = 1 | 2 | 3;

@Component({
  selector: 'z-home',
  standalone: true,
  imports: [CommonModule, TuiLoader, TranslateModule],
  template: `
    <div class="container mx-auto px-6 py-8">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ 'dashboard.home.title' | translate }}
        </h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          {{ 'dashboard.home.subtitle' | translate }}
        </p>
      </div>

      @if (isLoading()) {
        <div class="flex h-64 items-center justify-center">
          <tui-loader size="l"></tui-loader>
        </div>
      } @else {
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <!-- Role-based widgets will be added here -->
          <div
            class="rounded-2xl border border-gray-200/50 bg-white/90 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl dark:border-slate-700/50 dark:bg-slate-800/90"
          >
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Welcome {{ userDisplayName() }}!</h2>
            <p class="mt-2 text-gray-600 dark:text-gray-400">Your role: {{ userRole() }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-500">Tier {{ userTier() }} Dashboard</p>
          </div>
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

  ngOnInit(): void {
    this.initializeUserData();
  }

  private async initializeUserData(): Promise<void> {
    try {
      this.isLoading.set(true);

      const session = this.authService.session();
      if (!session || !session.user) {
        await this.router.navigate(['/auth/login']);
        return;
      }

      const user = session.user;
      const role = user.user_metadata?.['role'] || '';
      const roleLevel = user.user_metadata?.['role_level'] || 0;
      const firstName = user.user_metadata?.['first_name'] || user.email?.split('@')[0] || 'User';

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

      // Load dashboard data based on tier
      await this.loadDashboardData();
    } catch (error) {
      console.error('Error initializing home page:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  private async loadDashboardData(): Promise<void> {
    // This will be implemented to load tier-specific data
    // TODO: Load data based on tier using homeFacade service
  }
}
