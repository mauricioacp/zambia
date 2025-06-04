import { inject } from '@angular/core';
import { AkademyEdgeFunctionsService } from './akademy-edge-functions.service';
import { NotificationService } from './notification.service';

// Example usage in a component or service

export class ExampleUsageComponent {
  private edgeFunctions = inject(AkademyEdgeFunctionsService);
  private notification = inject(NotificationService);

  // Example 1: Migrate from Strapi (requires role level 95+)
  async migrateFromStrapi() {
    const response = await this.edgeFunctions.migrate();

    if (response.error) {
      this.notification.error(`Migration failed: ${response.error}`);
      return;
    }

    if (response.data) {
      const { statistics } = response.data;
      this.notification.success(
        `Migration completed: ${statistics.supabaseInserted} inserted, ${statistics.supabaseSkippedDuplicates} skipped`
      );
    }
  }

  // Example 2: Create user from agreement (requires role level 30+)
  async createUserFromAgreement(agreementId: string) {
    const response = await this.edgeFunctions.createUser({ agreement_id: agreementId });

    if (response.error) {
      this.notification.error(`User creation failed: ${response.error}`);
      return;
    }

    if (response.data) {
      const userData = response.data;
      this.notification.success(`User created successfully! Email: ${userData.email}, Password: ${userData.password}`);
      // IMPORTANT: Securely communicate the password to the user
      console.log('Generated password:', userData.password);
    }
  }

  // Example 3: Reset user password (requires role level 1+)
  async resetUserPassword() {
    const resetData = {
      email: 'user@example.com',
      document_number: '12345678',
      new_password: 'NewSecurePassword123!',
      phone: '+1234567890',
      first_name: 'John',
      last_name: 'Doe',
    };

    const response = await this.edgeFunctions.resetPassword(resetData);

    if (response.error) {
      this.notification.error(`Password reset failed: ${response.error}`);
      return;
    }

    if (response.data) {
      this.notification.success(response.data.message);
    }
  }

  // Example 4: Deactivate user (requires role level 50+)
  async deactivateUser(userId: string) {
    const response = await this.edgeFunctions.deactivateUser({ user_id: userId });

    if (response.error) {
      this.notification.error(`User deactivation failed: ${response.error}`);
      return;
    }

    if (response.data) {
      this.notification.success(response.data.message);
    }
  }

  // Example 5: Using signals to track loading state
  get isLoading() {
    return this.edgeFunctions.loading();
  }

  get lastError() {
    return this.edgeFunctions.error();
  }

  // Example 6: Clear error state
  clearError() {
    this.edgeFunctions.clearError();
  }
}
