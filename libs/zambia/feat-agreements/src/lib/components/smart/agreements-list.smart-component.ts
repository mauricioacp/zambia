import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AgreementsFacadeService } from '../../services/agreements-facade.service';
import { ColumnTemplateDirective, GenericTableUiComponent, WelcomeMessageUiComponent } from '@zambia/ui-components';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TuiIcon } from '@taiga-ui/core';

@Component({
  selector: 'z-agreements-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    GenericTableUiComponent,
    WelcomeMessageUiComponent,
    TranslatePipe,
    ColumnTemplateDirective,
    TuiIcon,
  ],
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

      <z-generic-table
        [headers]="['name', 'last_name', 'email', 'headquarters.name', 'roles.code', 'status','actions']"
        [headerLabels]="headerLabels"
        [items]="agreementsFacade.agreementsResource()"
        [loading]="agreementsFacade.isLoading()"
        [emptyMessage]="'no.agreements.found' | translate"
      >
        <!-- Error message -->
        @if (agreementsFacade.loadingError()) {
          <ng-container *ngTemplateOutlet="errorTemplate"></ng-container>
        }

        <!-- Column templates -->
        <ng-template zColumnTemplate="headquarters.name" let-agreement>
          {{ agreement.headquarters?.name || '-' }}
          @if (agreement.headquarters?.countries) {
            ({{ agreement.headquarters?.countries?.name }})
          }
        </ng-template>

        <ng-template zColumnTemplate="roles.code" let-agreement>
          {{ agreement.roles?.code || '-' }}
        </ng-template>

        <ng-template zColumnTemplate="status" let-agreement>
          <span
            class="inline-flex rounded-full px-2 text-xs leading-5 font-semibold"
            [ngClass]="
              agreement.status === 'active'
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                : agreement.status === 'graduated'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
            "
          >
            {{ agreement.status }}
          </span>
        </ng-template>

        <!-- Actions column -->
        <ng-template zColumnTemplate="actions" let-agreement>
          <a
            [routerLink]="['/dashboard/agreements', agreement.id]"
            class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {{ 'view' | translate }}
          </a>
        </ng-template>
      </z-generic-table>

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
