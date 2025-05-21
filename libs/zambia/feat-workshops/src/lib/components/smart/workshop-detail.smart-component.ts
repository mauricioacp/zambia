import { ChangeDetectionStrategy, Component, inject, input, signal, WritableSignal, effect } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WorkshopsFacadeService, WorkshopWithRelations } from '../../services/workshops-facade.service';
import { TuiSkeleton } from '@taiga-ui/kit';

@Component({
  selector: 'z-workshop-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, TuiSkeleton, NgClass],
  template: `
    <div class="container mx-auto p-6">
      <div class="mb-4">
        <a
          routerLink="/dashboard/workshops"
          class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          &larr; Back to Workshops
        </a>
      </div>

      @if (workshopsFacade.isDetailLoading()) {
        <div class="rounded-lg bg-white p-6 shadow-md dark:bg-slate-800">
          <div class="space-y-4">
            <div [tuiSkeleton]="true" class="h-8 w-1/2"></div>
            <div [tuiSkeleton]="true" class="h-4 w-full"></div>
            <div [tuiSkeleton]="true" class="h-4 w-full"></div>
            <div [tuiSkeleton]="true" class="h-4 w-full"></div>
          </div>
        </div>
      } @else if (workshopData()) {
        <div class="overflow-hidden rounded-lg bg-white shadow-md dark:bg-slate-800">
          <div class="border-b border-gray-200 px-6 py-5 dark:border-gray-700">
            <h3 class="text-xl font-semibold text-gray-800 dark:text-white">Workshop Details</h3>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Information about {{ workshopData()!.local_name }}
            </p>
          </div>
          <div class="border-t border-gray-200 dark:border-gray-700">
            <dl>
              <div class="grid grid-cols-3 gap-4 bg-gray-50 px-6 py-5 dark:bg-gray-900">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-300">Workshop name</dt>
                <dd class="col-span-2 text-sm text-gray-900 dark:text-gray-100">
                  {{ workshopData()!.local_name }}
                </dd>
              </div>
              <div class="grid grid-cols-3 gap-4 bg-white px-6 py-5 dark:bg-slate-800">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-300">Workshop type</dt>
                <dd class="col-span-2 text-sm text-gray-900 dark:text-gray-100">
                  {{ workshopData()!.master_workshop_types?.master_name }}
                </dd>
              </div>
              <div class="grid grid-cols-3 gap-4 bg-gray-50 px-6 py-5 dark:bg-gray-900">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-300">Start time</dt>
                <dd class="col-span-2 text-sm text-gray-900 dark:text-gray-100">
                  {{ workshopData()!.start_datetime | date: 'medium' }}
                </dd>
              </div>
              <div class="grid grid-cols-3 gap-4 bg-white px-6 py-5 dark:bg-slate-800">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-300">End time</dt>
                <dd class="col-span-2 text-sm text-gray-900 dark:text-gray-100">
                  {{ workshopData()!.end_datetime | date: 'medium' }}
                </dd>
              </div>

              <div class="grid grid-cols-3 gap-4 bg-gray-50 px-6 py-5 dark:bg-gray-900">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-300">Headquarter</dt>
                <dd class="col-span-2 text-sm text-gray-900 dark:text-gray-100">
                  {{ workshopData()!.headquarters?.name }}
                </dd>
              </div>
              <div class="grid grid-cols-3 gap-4 bg-white px-6 py-5 dark:bg-slate-800">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-300">Season</dt>
                <dd class="col-span-2 text-sm text-gray-900 dark:text-gray-100">
                  {{ workshopData()!.seasons?.name }}
                </dd>
              </div>
              <div class="grid grid-cols-3 gap-4 bg-gray-50 px-6 py-5 dark:bg-gray-900">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-300">Location details</dt>
                <dd class="col-span-2 text-sm text-gray-900 dark:text-gray-100">
                  {{ workshopData()!.location_details || 'No location details provided' }}
                </dd>
              </div>
              <div class="grid grid-cols-3 gap-4 bg-white px-6 py-5 dark:bg-slate-800">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-300">Status</dt>
                <dd class="col-span-2 text-sm">
                  <span
                    class="inline-flex rounded-full px-2 text-xs leading-5 font-semibold"
                    [ngClass]="
                      workshopData()!.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                    "
                  >
                    {{ workshopData()!.status }}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      } @else if (workshopsFacade.detailLoadingError()) {
        <div class="rounded border-l-4 border-red-400 bg-red-50 p-4 dark:border-red-500 dark:bg-red-900/30">
          <p class="text-red-700 dark:text-red-300">
            Failed to load workshop: {{ workshopsFacade.detailLoadingError() }}
          </p>
        </div>
      } @else {
        <div class="rounded border-l-4 border-red-400 bg-red-50 p-4 dark:border-red-500 dark:bg-red-900/30">
          <p class="text-red-700 dark:text-red-300">Workshop not found.</p>
        </div>
      }
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkshopDetailSmartComponent {
  workshopsFacade = inject(WorkshopsFacadeService);
  workshopId = input.required<string>();
  workshopData: WritableSignal<WorkshopWithRelations | null> = signal(null);

  constructor() {
    effect(() => {
      this.workshopsFacade.workshopId.set(this.workshopId());
      this.workshopsFacade.loadWorkshopById();
    });

    effect(() => {
      this.workshopData.set(this.workshopsFacade.workshopByIdResource());
    });
  }
}
