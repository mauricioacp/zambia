import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WorkshopsFacadeService } from '../../services/workshops-facade.service';
import { WelcomeMessageUiComponent } from '@zambia/ui-components';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TuiIcon } from '@taiga-ui/core';
import { TuiSkeleton } from '@taiga-ui/kit';

@Component({
  selector: 'z-workshops-list',
  standalone: true,
  imports: [CommonModule, RouterModule, WelcomeMessageUiComponent, TranslatePipe, TuiIcon, TuiSkeleton],
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

      @defer (on viewport; prefetch on idle) {
        <z-welcome-message [welcomeText]="welcomeText()"></z-welcome-message>
      } @placeholder {
        <div [tuiSkeleton]="true" class="mb-6 h-16 w-full rounded-lg"></div>
      }

      @defer (on viewport; prefetch on hover) {
      } @placeholder {
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div [tuiSkeleton]="true" class="h-8 w-32 rounded"></div>
            <div [tuiSkeleton]="true" class="h-10 w-24 rounded"></div>
          </div>
          <div [tuiSkeleton]="true" class="h-10 w-64 rounded"></div>
          <div class="space-y-3">
            @for (i of [1, 2, 3, 4, 5]; track i) {
              <div [tuiSkeleton]="true" class="h-12 w-full rounded"></div>
            }
          </div>
        </div>
      } @loading {
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div [tuiSkeleton]="true" class="h-8 w-32 animate-pulse rounded"></div>
            <div [tuiSkeleton]="true" class="h-10 w-24 animate-pulse rounded"></div>
          </div>
          <div [tuiSkeleton]="true" class="h-10 w-64 animate-pulse rounded"></div>
          <div class="space-y-3">
            @for (i of [1, 2, 3, 4, 5]; track i) {
              <div [tuiSkeleton]="true" class="h-12 w-full animate-pulse rounded"></div>
            }
          </div>
        </div>
      }

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
