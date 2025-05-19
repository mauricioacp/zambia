import { ChangeDetectionStrategy, Component, effect, inject, input, signal, WritableSignal } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CountriesFacadeService, CountryWithHeadquarters } from '../../services/countries-facade.service';
import { TuiSkeleton } from '@taiga-ui/kit';

@Component({
  selector: 'z-country-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, TuiSkeleton, NgClass],
  template: `
    <div class="container mx-auto p-6">
      <div class="mb-4">
        <a
          routerLink="/dashboard/countries"
          class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          &larr; Back to Countries
        </a>
      </div>

      @if (countriesFacade.isDetailLoading()) {
        <div class="rounded-lg bg-white p-6 shadow-md dark:bg-slate-800">
          <div class="space-y-4">
            <div [tuiSkeleton]="true" class="h-8 w-1/2"></div>
            <div [tuiSkeleton]="true" class="h-4 w-full"></div>
            <div [tuiSkeleton]="true" class="h-4 w-full"></div>
            <div [tuiSkeleton]="true" class="h-4 w-full"></div>
          </div>
        </div>
      } @else if (countryData()) {
        <div class="overflow-hidden rounded-lg bg-white shadow-md dark:bg-slate-800">
          <div class="border-b border-gray-200 px-6 py-5 dark:border-gray-700">
            <h3 class="text-xl font-semibold text-gray-800 dark:text-white">Country Details</h3>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">Information about {{ countryData()!.name }}</p>
          </div>
          <div class="border-t border-gray-200 dark:border-gray-700">
            <dl>
              <div class="grid grid-cols-3 gap-4 bg-gray-50 px-6 py-5 dark:bg-gray-900">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-300">Country name</dt>
                <dd class="col-span-2 text-sm text-gray-900 dark:text-gray-100">{{ countryData()!.name }}</dd>
              </div>
              <div class="grid grid-cols-3 gap-4 bg-white px-6 py-5 dark:bg-slate-800">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-300">Country code</dt>
                <dd class="col-span-2 text-sm text-gray-900 dark:text-gray-100">{{ countryData()!.code }}</dd>
              </div>
              <div class="grid grid-cols-3 gap-4 bg-gray-50 px-6 py-5 dark:bg-gray-900">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-300">Status</dt>
                <dd class="col-span-2 text-sm text-gray-900 dark:text-gray-100">
                  <span
                    class="inline-flex rounded-full px-2 text-xs leading-5 font-semibold"
                    [ngClass]="
                      countryData()!.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                    "
                  >
                    {{ countryData()!.status }}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        @if (countryData()!.headquarters?.length) {
          <div class="mt-6">
            <h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">
              Headquarters in {{ countryData()!.name }}
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
                      Address
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-slate-800">
                  @for (hq of countryData()!.headquarters; track hq.id) {
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-white">
                        {{ hq.name }}
                      </td>
                      <td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-300">
                        {{ hq.address }}
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
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }
      } @else if (countriesFacade.detailLoadingError()) {
        <div class="rounded border-l-4 border-red-400 bg-red-50 p-4 dark:border-red-500 dark:bg-red-900/30">
          <p class="text-red-700 dark:text-red-300">
            Failed to load country: {{ countriesFacade.detailLoadingError() }}
          </p>
        </div>
      } @else {
        <div class="rounded border-l-4 border-red-400 bg-red-50 p-4 dark:border-red-500 dark:bg-red-900/30">
          <p class="text-red-700 dark:text-red-300">Country not found.</p>
        </div>
      }
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryDetailSmartComponent {
  countriesFacade = inject(CountriesFacadeService);
  countryId = input.required<string>();
  countryData: WritableSignal<CountryWithHeadquarters | null> = signal(null);

  constructor() {
    effect(() => {
      this.countriesFacade.countryId.set(this.countryId());
      this.countriesFacade.loadCountryById();
    });

    effect(() => {
      this.countryData.set(this.countriesFacade.countryByIdResource());
    });
  }
}
