import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WorkshopsFacadeService } from '../../services/workshops-facade.service';
import { ColumnTemplateDirective, GenericTableUiComponent, WelcomeMessageUiComponent } from '@zambia/ui-components';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TuiIcon } from '@taiga-ui/core';

@Component({
  selector: 'z-workshops-list',
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
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white">{{ 'workshops' | translate }}</h1>
        <button
          (click)="onCreateWorkshop()"
          class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:bg-blue-700 dark:hover:bg-blue-800 dark:focus:ring-blue-600"
        >
          <tui-icon [icon]="'tuiIconPlusLarge'"></tui-icon>
          <span>{{ 'create.workshop' | translate }}</span>
        </button>
      </div>

      <z-welcome-message [welcomeText]="welcomeText()"></z-welcome-message>

      <z-generic-table
        [headers]="['local_name', 'master_workshop_types.master_name', 'headquarters.name', 'start_datetime', 'status']"
        [headerLabels]="headerLabels"
        [actions]="['actions']"
        [items]="workshopsFacade.workshopsResource()"
        [loading]="workshopsFacade.isLoading()"
        [emptyMessage]="'no.workshops.found' | translate"
      >
        <!-- Error message -->
        @if (workshopsFacade.loadingError()) {
          <ng-container *ngTemplateOutlet="errorTemplate"></ng-container>
        }

        <!-- Column templates -->
        <ng-template zColumnTemplate="master_workshop_types.master_name" let-workshop>
          {{ workshop.master_workshop_types?.master_name || '-' }}
        </ng-template>

        <ng-template zColumnTemplate="headquarters.name" let-workshop>
          {{ workshop.headquarters?.name || '-' }}
        </ng-template>

        <ng-template zColumnTemplate="start_datetime" let-workshop>
          {{ workshop.start_datetime | date: 'medium' }}
        </ng-template>

        <ng-template zColumnTemplate="status" let-workshop>
          <span
            class="inline-flex rounded-full px-2 text-xs leading-5 font-semibold"
            [ngClass]="
              workshop.status === 'active'
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
            "
          >
            {{ workshop.status }}
          </span>
        </ng-template>

        <!-- Actions column -->
        <ng-template zColumnTemplate="actions" let-workshop>
          <a
            [routerLink]="['/dashboard/workshops', workshop.id]"
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
            {{ 'failed.to.load' | translate }}: {{ workshopsFacade.loadingError() }}
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
export class WorkshopsListSmartComponent {
  workshopsFacade = inject(WorkshopsFacadeService);
  translate = inject(TranslateService);

  welcomeText = computed(() => this.translate.instant('welcome.workshops.list'));

  headerLabels = {
    local_name: this.translate.instant('name'),
    'master_workshop_types.master_name': this.translate.instant('workshop.type'),
    'headquarters.name': this.translate.instant('headquarter'),
    start_datetime: this.translate.instant('start.date'),
    status: this.translate.instant('status'),
    actions: this.translate.instant('actions'),
  };

  constructor() {
    this.workshopsFacade.workshops.reload();
  }

  onCreateWorkshop() {
    // Navigate to create page or open modal
    // For now, let's consider this will navigate to a route
    window.location.href = '/dashboard/workshops/create';
  }
}
