import { ChangeDetectionStrategy, Component, inject, input, signal, WritableSignal, effect } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeadquartersFacadeService, HeadquarterWithRelations } from '../../services/headquarters-facade.service';
import { TuiSkeleton } from '@taiga-ui/kit';

@Component({
  selector: 'z-headquarter-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, TuiSkeleton, NgClass],
  template: `
    <div class="container mx-auto p-6">
      <div class="mb-4">
        <a
          routerLink="/dashboard/headquarters"
          class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          &larr; Back to Headquarters
        </a>
      </div>

      @if (headquartersFacade.isDetailLoading()) {
        <div class="rounded-lg bg-white p-6 shadow-md dark:bg-slate-800">
          <div class="space-y-4">
            <div [tuiSkeleton]="true" class="h-8 w-1/2"></div>
            <div [tuiSkeleton]="true" class="h-4 w-full"></div>
            <div [tuiSkeleton]="true" class="h-4 w-full"></div>
            <div [tuiSkeleton]="true" class="h-4 w-full"></div>
          </div>
        </div>
      } @else if (headquarterData()) {
        <div class="overflow-hidden rounded-lg bg-white shadow-md dark:bg-slate-800">
          <div class="border-b border-gray-200 px-6 py-5 dark:border-gray-700">
            <h3 class="text-xl font-semibold text-gray-800 dark:text-white">Headquarter Details</h3>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">Information about {{ headquarterData()!.name }}</p>
          </div>
          <div class="border-t border-gray-200 dark:border-gray-700">
            <dl>
              <div class="grid grid-cols-3 gap-4 bg-gray-50 px-6 py-5 dark:bg-gray-900">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-300">Name</dt>
                <dd class="col-span-2 text-sm text-gray-900 dark:text-gray-100">
                  {{ headquarterData()!.name }}
                </dd>
              </div>
              <div class="grid grid-cols-3 gap-4 bg-white px-6 py-5 dark:bg-slate-800">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-300">Country</dt>
                <dd class="col-span-2 text-sm text-gray-900 dark:text-gray-100">
                  {{ headquarterData()!.countries?.name }} ({{ headquarterData()!.countries?.code }})
                </dd>
              </div>
              <div class="grid grid-cols-3 gap-4 bg-gray-50 px-6 py-5 dark:bg-gray-900">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-300">Address</dt>
                <dd class="col-span-2 text-sm text-gray-900 dark:text-gray-100">
                  {{ headquarterData()!.address || 'N/A' }}
                </dd>
              </div>
              <div class="grid grid-cols-3 gap-4 bg-white px-6 py-5 dark:bg-slate-800">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-300">Status</dt>
                <dd class="col-span-2 text-sm text-gray-900 dark:text-gray-100">
                  <span
                    class="inline-flex rounded-full px-2 text-xs leading-5 font-semibold"
                    [ngClass]="
                      headquarterData()!.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                    "
                  >
                    {{ headquarterData()!.status }}
                  </span>
                </dd>
              </div>
              <div class="grid grid-cols-3 gap-4 bg-gray-50 px-6 py-5 dark:bg-gray-900">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-300">Contact Info</dt>
                <dd class="col-span-2 text-sm text-gray-900 dark:text-gray-100">
                  <pre class="whitespace-pre-wrap">{{ headquarterData()!.contact_info | json }}</pre>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        @if (headquarterData()!.scheduled_workshops?.length) {
          <div class="mt-6">
            <h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">
              Workshops in {{ headquarterData()!.name }}
            </h3>
            <div class="overflow-hidden rounded-lg bg-white shadow-md dark:bg-slate-800">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
                    >
                      Name
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
                    >
                      Start Date
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
                    >
                      End Date
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
                    >
                      Status
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-slate-800">
                  @for (workshop of headquarterData()!.scheduled_workshops; track workshop.id) {
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-white">
                        {{ workshop.local_name }}
                      </td>
                      <td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-300">
                        {{ workshop.start_datetime | date: 'medium' }}
                      </td>
                      <td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-300">
                        {{ workshop.end_datetime | date: 'medium' }}
                      </td>
                      <td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-300">
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
                      </td>
                      <td class="px-6 py-4 text-sm whitespace-nowrap">
                        <a
                          [routerLink]="['/dashboard/workshops', workshop.id]"
                          class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          View Details
                        </a>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }
      } @else if (headquartersFacade.detailLoadingError()) {
        <div class="rounded border-l-4 border-red-400 bg-red-50 p-4 dark:border-red-500 dark:bg-red-900/30">
          <p class="text-red-700 dark:text-red-300">
            Failed to load headquarter: {{ headquartersFacade.detailLoadingError() }}
          </p>
        </div>
      } @else {
        <div class="rounded border-l-4 border-red-400 bg-red-50 p-4 dark:border-red-500 dark:bg-red-900/30">
          <p class="text-red-700 dark:text-red-300">Headquarter not found.</p>
        </div>
      }
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeadquarterDetailSmartComponent {
  headquartersFacade = inject(HeadquartersFacadeService);
  headquarterId = input.required<string>();
  headquarterData: WritableSignal<HeadquarterWithRelations | null> = signal(null);

  constructor() {
    effect(() => {
      this.headquartersFacade.headquarterId.set(this.headquarterId());
      this.headquartersFacade.loadHeadquarterById();
    });

    effect(() => {
      this.headquarterData.set(this.headquartersFacade.headquarterByIdResource());
    });
  }
}
