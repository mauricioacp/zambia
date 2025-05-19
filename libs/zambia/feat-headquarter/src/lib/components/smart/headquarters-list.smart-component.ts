import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeadquartersFacadeService } from '../../services/headquarters-facade.service';
import { TuiSkeleton } from '@taiga-ui/kit';

@Component({
  selector: 'z-headquarters-list',
  standalone: true,
  imports: [CommonModule, RouterModule, TuiSkeleton, NgClass],
  template: `
    <div class="container mx-auto p-6">
      <h1 class="mb-6 text-2xl font-bold text-gray-800 dark:text-white">Headquarters</h1>

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
                Country
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
              >
                Address
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
            @if (headquartersFacade.isLoading()) {
              @for (i of [1, 2, 3, 4, 5]; track i) {
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap" [tuiSkeleton]="true"></td>
                  <td class="px-6 py-4 whitespace-nowrap" [tuiSkeleton]="true"></td>
                  <td class="px-6 py-4 whitespace-nowrap" [tuiSkeleton]="true"></td>
                  <td class="px-6 py-4 whitespace-nowrap" [tuiSkeleton]="true"></td>
                  <td class="px-6 py-4 whitespace-nowrap" [tuiSkeleton]="true"></td>
                </tr>
              }
            } @else if (headquartersFacade.headquartersResource()?.length) {
              @for (hq of headquartersFacade.headquartersResource(); track hq.id) {
                <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td class="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    {{ hq.name }}
                  </td>
                  <td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-300">
                    {{ hq.countries?.name }} ({{ hq.countries?.code }})
                  </td>
                  <td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-300">
                    {{ hq.address || 'N/A' }}
                  </td>
                  <td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-300">
                    <span
                      class="inline-flex rounded-full px-2 text-xs leading-5 font-semibold"
                      [ngClass]="
                        hq.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                      "
                    >
                      {{ hq.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm whitespace-nowrap">
                    <a
                      [routerLink]="['/dashboard/headquarters', hq.id]"
                      class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      View Details
                    </a>
                  </td>
                </tr>
              }
            } @else if (headquartersFacade.loadingError()) {
              <tr>
                <td colspan="5" class="px-6 py-4">
                  <div class="border-l-4 border-red-400 bg-red-50 p-4 dark:border-red-500 dark:bg-red-900/30">
                    <p class="text-red-700 dark:text-red-300">
                      Failed to load headquarters: {{ headquartersFacade.loadingError() }}
                    </p>
                  </div>
                </td>
              </tr>
            } @else {
              <tr>
                <td colspan="5" class="px-6 py-4">
                  <div
                    class="border-l-4 border-yellow-400 bg-yellow-50 p-4 dark:border-yellow-500 dark:bg-yellow-900/30"
                  >
                    <p class="text-yellow-700 dark:text-yellow-300">No headquarters found.</p>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeadquartersListSmartComponent {
  headquartersFacade = inject(HeadquartersFacadeService);

  constructor() {
    this.headquartersFacade.headquarters.reload();
  }
}
