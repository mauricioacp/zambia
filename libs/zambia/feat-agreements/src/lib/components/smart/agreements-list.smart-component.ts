import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AgreementsFacadeService } from '../../services/agreements-facade.service';
import { WelcomeMessageUiComponent } from '@zambia/ui-components';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TuiIcon } from '@taiga-ui/core';

@Component({
  selector: 'z-agreements-list',
  standalone: true,
  imports: [CommonModule, RouterModule, WelcomeMessageUiComponent, TranslatePipe, TuiIcon],
  template: `
    <div class="h-full w-full overflow-auto bg-gray-50 p-6 dark:bg-gray-900">
      <div class="mb-6 flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white">{{ 'agreements' | translate }}</h1>
        <button
          (click)="onCreateAgreement()"
          class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:bg-blue-700 dark:hover:bg-blue-800 dark:focus:ring-blue-600"
        >
          <tui-icon [icon]="'tuiIconPlusLarge'"></tui-icon>
          <span>{{ 'create.agreement' | translate }}</span>
        </button>
      </div>

      <z-welcome-message [welcomeText]="welcomeText()"></z-welcome-message>

      <!-- Error template -->
      <ng-template #errorTemplate>
        <div class="mt-4 border-l-4 border-red-400 bg-red-50 p-4 dark:border-red-500 dark:bg-red-900/30">
          <p class="text-red-700 dark:text-red-300">
            {{ 'failed.to.load' | translate }}: {{ agreementsFacade.loadingError() }}
          </p>
        </div>
      </ng-template>
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
export class AgreementsListSmartComponent {
  agreementsFacade = inject(AgreementsFacadeService);
  translate = inject(TranslateService);

  welcomeText = computed(() => this.translate.instant('welcome.agreements.list'));

  headerLabels = {
    name: this.translate.instant('name'),
    last_name: this.translate.instant('last.name'),
    email: this.translate.instant('email'),
    'headquarters.name': this.translate.instant('headquarter'),
    'roles.code': this.translate.instant('role'),
    status: this.translate.instant('status'),
    actions: this.translate.instant('actions'),
  };

  constructor() {
    this.agreementsFacade.agreements.reload();
  }

  onCreateAgreement() {
    // Navigate to create page
    window.location.href = '/dashboard/agreements/create';
  }
}
