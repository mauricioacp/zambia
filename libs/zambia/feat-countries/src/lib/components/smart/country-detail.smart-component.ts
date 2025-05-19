import { ChangeDetectionStrategy, Component, effect, inject, input, signal, WritableSignal } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CountriesFacadeService, CountryWithHeadquarters } from '../../services/countries-facade.service';
import { TuiSkeleton } from '@taiga-ui/kit';
import { TuiIcon } from '@taiga-ui/core';
import { GenericTableUiComponent } from '@zambia/ui-components';
import { TranslatePipe } from '@ngx-translate/core';
import { ICONS } from '@zambia/util-constants';
import { ColumnTemplateDirective } from '@zambia/ui-components';

@Component({
  selector: 'z-country-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TuiSkeleton,
    NgClass,
    TuiIcon,
    GenericTableUiComponent,
    TranslatePipe,
    ColumnTemplateDirective,
  ],
  template: `
    <div class="h-full w-full overflow-auto bg-gray-50 p-6 dark:bg-gray-900">
      <div class="mb-4">
        <a
          routerLink="/dashboard/countries"
          class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          &larr; {{ 'back.to.countries' | translate }}
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
        <!-- Page Headings: With Details and Actions -->
        <div class="mb-8 flex flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left">
          <!-- Heading -->
          <div>
            <h2 class="mb-2 text-2xl font-extrabold md:text-3xl">
              {{ countryData()!.name }}
            </h2>
            <ul
              class="inline-flex list-none flex-wrap items-center justify-center gap-3 text-sm font-medium text-gray-600 md:justify-start dark:text-gray-400"
            >
              <li class="inline-flex items-center gap-1.5">
                <tui-icon [icon]="ICONS.COUNTRIES" class="opacity-50"></tui-icon>
                <span>{{ 'country' | translate }}</span>
              </li>
              <li class="inline-flex items-center gap-1.5">
                <tui-icon [icon]="'code'" class="opacity-50"></tui-icon>
                <span>{{ countryData()!.code }}</span>
              </li>
              <li class="inline-flex items-center gap-1.5">
                <tui-icon [icon]="'activity'" class="opacity-50"></tui-icon>
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
              </li>
            </ul>
          </div>
          <!-- END Heading -->

          <!-- Actions -->
          <div class="flex flex-none flex-wrap items-center justify-center gap-2 sm:justify-end">
            <button
              type="button"
              class="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm leading-5 font-semibold text-gray-800 hover:border-gray-300 hover:text-gray-900 hover:shadow-xs focus:ring-3 focus:ring-gray-300/25 active:border-gray-200 active:shadow-none dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-200 dark:focus:ring-gray-600/40 dark:active:border-gray-700"
            >
              <tui-icon [icon]="'pencil'" class="opacity-50"></tui-icon>
              <span>{{ 'edit' | translate }}</span>
            </button>
          </div>
          <!-- END Actions -->
        </div>
        <!-- END Page Headings: With Details and Actions -->

        @if (countryData()!.headquarters?.length) {
          <div class="mt-6">
            <h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">
              {{ 'headquarters.in' | translate }} {{ countryData()!.name }}
            </h3>

            <z-generic-table
              [loading]="false"
              [items]="countryData()!.headquarters"
              [headers]="['name', 'address', 'status']"
              [headerLabels]="{
                name: 'name' | translate,
                address: 'address' | translate,
                status: 'status' | translate,
              }"
              [emptyMessage]="'no.headquarters.found' | translate"
            >
              <ng-template [zColumnTemplate]="'status'" let-item>
                <span
                  class="inline-flex rounded-full px-2 text-xs leading-5 font-semibold"
                  [ngClass]="
                    item.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                  "
                >
                  {{ item.status }}
                </span>
              </ng-template>
            </z-generic-table>
          </div>
        }
      } @else if (countriesFacade.detailLoadingError()) {
        <div class="rounded border-l-4 border-red-400 bg-red-50 p-4 dark:border-red-500 dark:bg-red-900/30">
          <p class="text-red-700 dark:text-red-300">
            {{ 'failed.to.load' | translate }}: {{ countriesFacade.detailLoadingError() }}
          </p>
        </div>
      } @else {
        <div class="rounded border-l-4 border-red-400 bg-red-50 p-4 dark:border-red-500 dark:bg-red-900/30">
          <p class="text-red-700 dark:text-red-300">{{ 'country.not.found' | translate }}</p>
        </div>
      }
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
export class CountryDetailSmartComponent {
  countriesFacade = inject(CountriesFacadeService);
  countryId = input.required<string>();
  countryData: WritableSignal<CountryWithHeadquarters | null> = signal(null);
  ICONS = ICONS;

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
