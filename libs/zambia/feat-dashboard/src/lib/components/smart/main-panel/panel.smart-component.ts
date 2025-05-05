import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@zambia/data-access-auth';
import { RolesService } from '@zambia/data-access-roles-permissions';
import { WelcomeMessageUiComponent } from '@zambia/ui-components';

@Component({
  selector: 'z-panel',
  standalone: true,
  imports: [CommonModule, WelcomeMessageUiComponent],
  template: `
    <div class="h-full overflow-auto bg-gray-50 p-6 dark:bg-gray-900">
      <h1 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Panel de Control</h1>

      <z-welcome-message [userName]="userName" [welcomeText]="welcomeText()" />
    </div>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
      min-height: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelSmartComponent {
  private authService = inject(AuthService);
  protected rolesService = inject(RolesService);
  protected welcomeText = computed(() => this.rolesService.getWelcomeText());
  protected userName = this.authService.userName();
}
