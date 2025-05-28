// Example usage of AkademyEdgeFunctionsService
// This file is for documentation purposes only
//
// The service now uses pure signals with Supabase client - no more RxJS!
// All responses are stored in signals for reactive UI updates

/*
import { inject, Component, effect } from '@angular/core';
import { AkademyEdgeFunctionsService } from '@zambia/data-access-generic';

@Component({
  template: `
    <!-- Loading state -->
    @if (edgeFunctionsService.loading()) {
      <div class="loading">Loading...</div>
    }

    <!-- Error state -->
    @if (edgeFunctionsService.error()) {
      <div class="error">{{ edgeFunctionsService.error() }}</div>
    }

    <!-- API Status Display -->
    @if (edgeFunctionsService.apiStatus(); as status) {
      <div class="api-status">
        <h3>API Status: {{ status.status }}</h3>
        <p>{{ status.message }}</p>
        <ul>
          @for (endpoint of status.endpoints; track endpoint) {
            <li>{{ endpoint }}</li>
          }
        </ul>
      </div>
    }

    <!-- User Creation Result -->
    @if (edgeFunctionsService.userCreation(); as user) {
      <div class="user-created">
        <h3>User Created Successfully!</h3>
        <p>Email: {{ user.email }}</p>
        <p>Password: {{ user.password }}</p>
        <p>Role: {{ user.role_name }}</p>
        <p>HQ: {{ user.headquarter_name }}</p>
      </div>
    }

    <!-- Migration Results -->
    @if (edgeFunctionsService.migration(); as migration) {
      <div class="migration-results">
        <h3>Migration Complete</h3>
        <p>Total from Strapi: {{ migration.statistics.strapiTotal }}</p>
        <p>Inserted: {{ migration.statistics.supabaseInserted }}</p>
        <p>Updated: {{ migration.statistics.supabaseUpdated }}</p>
        <p>Skipped: {{ migration.statistics.duplicatesSkipped }}</p>
      </div>
    }

    <!-- Actions -->
    <div class="actions">
      <button (click)="checkApiStatus()">Check API Status</button>
      <button (click)="checkHealth()">Health Check</button>
      <button (click)="createUser()">Create User</button>
      <button (click)="runMigration()">Run Migration</button>
      <button (click)="clearData()">Clear Data</button>
    </div>
  `
})
export class ExampleComponent {
  edgeFunctionsService = inject(AkademyEdgeFunctionsService);

  constructor() {
    // Use effects to react to signal changes
    effect(() => {
      const userCreation = this.edgeFunctionsService.userCreation();
      if (userCreation) {
        console.log('New user created:', userCreation);
        // Could show notification, update other signals, etc.
      }
    });

    effect(() => {
      const error = this.edgeFunctionsService.error();
      if (error) {
        console.error('Edge function error:', error);
        // Could show toast notification, log to service, etc.
      }
    });
  }

  async checkApiStatus() {
    await this.edgeFunctionsService.getApiStatus();
    // Result automatically available in edgeFunctionsService.apiStatus() signal
  }

  async checkHealth() {
    await this.edgeFunctionsService.getHealth();
    // Result automatically available in edgeFunctionsService.health() signal
  }

  async createUser() {
    await this.edgeFunctionsService.createUser({
      agreement_id: '123e4567-e89b-12d3-a456-426614174000'
    });
    // Result automatically available in edgeFunctionsService.userCreation() signal
  }

  async resetUserPassword() {
    await this.edgeFunctionsService.resetPassword({
      email: 'user@example.com',
      document_number: '12345678A',
      new_password: 'NewPassword123!',
      phone: '+34123456789',
      first_name: 'John',
      last_name: 'Doe'
    });
    // Result automatically available in edgeFunctionsService.passwordReset() signal
  }

  async deactivateUser() {
    await this.edgeFunctionsService.deactivateUser({
      user_id: '987fcdeb-51a2-43d1-9c67-123456789abc'
    });
    // Result automatically available in edgeFunctionsService.userDeactivation() signal
  }

  async runMigration() {
    await this.edgeFunctionsService.migrate('super-secret-password');
    // Result automatically available in edgeFunctionsService.migration() signal
  }

  clearData() {
    this.edgeFunctionsService.clearData();
    // Clears all response signals
  }

  clearError() {
    this.edgeFunctionsService.clearError();
    // Clears error signal only
  }
}

// Benefits of the signal-based approach:
// 1. ✅ No RxJS subscriptions to manage
// 2. ✅ Automatic cleanup (signals are garbage collected with component)
// 3. ✅ Reactive templates with @if conditions
// 4. ✅ Effects for side effects when signals change
// 5. ✅ Better performance (fine-grained reactivity)
// 6. ✅ Simpler mental model (just call method, read signal)
// 7. ✅ Multiple components can share the same service signals
// 8. ✅ Computed signals can derive from multiple signals
// 9. ✅ Perfect alignment with Angular 19 patterns

// Advanced pattern - computed signals from service data:
export class AdvancedExampleComponent {
  edgeFunctionsService = inject(AkademyEdgeFunctionsService);

  // Computed signal that combines multiple service signals
  migrationSummary = computed(() => {
    const migration = this.edgeFunctionsService.migration();
    const apiStatus = this.edgeFunctionsService.apiStatus();
    
    if (!migration || !apiStatus) return null;
    
    return {
      success: migration.statistics.supabaseInserted > 0,
      totalProcessed: migration.statistics.supabaseInserted + migration.statistics.supabaseUpdated,
      apiHealthy: apiStatus.status === 'ok'
    };
  });

  // Effect that reacts to computed signal changes
  constructor() {
    effect(() => {
      const summary = this.migrationSummary();
      if (summary?.success && summary.apiHealthy) {
        console.log('Migration successful and API healthy!');
      }
    });
  }
}
*/
