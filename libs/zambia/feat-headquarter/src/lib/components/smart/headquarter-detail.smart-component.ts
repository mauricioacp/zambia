import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
  WritableSignal,
  effect,
  computed,
} from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeadquartersFacadeService, HeadquarterWithRelations } from '../../services/headquarters-facade.service';
import { TuiSkeleton } from '@taiga-ui/kit';
import { GenericTableUiComponent, ColumnTemplateDirective } from '@zambia/ui-components';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TuiIcon } from '@taiga-ui/core';
import { ICONS } from '@zambia/util-constants';

@Component({
  selector: 'z-headquarter-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TuiSkeleton,
    NgClass,
    GenericTableUiComponent,
    ColumnTemplateDirective,
    TranslatePipe,
    TuiIcon,
  ],
  template: `
    <div class="w-full bg-gray-50 p-6 dark:bg-gray-900">
      <div class="mb-4">
        <a
          routerLink="/dashboard/headquarters"
          class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          &larr; {{ 'back.to.headquarters' | translate }}
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
        <!-- Page Headings: With Details and Actions -->
        <div class="mb-8 flex flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left">
          <!-- Heading -->
          <div>
            <h2 class="mb-2 text-2xl font-extrabold md:text-3xl">
              {{ headquarterData()!.name }}
            </h2>
            <ul
              class="inline-flex list-none flex-wrap items-center justify-center gap-3 text-sm font-medium text-gray-600 md:justify-start dark:text-gray-400"
            >
              <li class="inline-flex items-center gap-1.5">
                <tui-icon [icon]="ICONS.HEADQUARTERS" class="opacity-50"></tui-icon>
                <span>{{ 'headquarter' | translate }}</span>
              </li>
              @if (headquarterData()!.countries?.name) {
                <li class="inline-flex items-center gap-1.5">
                  <tui-icon [icon]="ICONS.COUNTRIES" class="opacity-50"></tui-icon>
                  <span>{{ headquarterData()!.countries?.name }} ({{ headquarterData()!.countries?.code }})</span>
                </li>
              }
              <li class="inline-flex items-center gap-1.5">
                <tui-icon [icon]="'tuiIconMapPin'" class="opacity-50"></tui-icon>
                <span>{{ headquarterData()!.address || ('N/A' | translate) }}</span>
              </li>
              <li class="inline-flex items-center gap-1.5">
                <tui-icon [icon]="'tuiIconActivity'" class="opacity-50"></tui-icon>
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
              </li>
              @if (currentSeason()) {
                <li class="inline-flex items-center gap-1.5">
                  <tui-icon [icon]="'tuiIconCalendar'" class="opacity-50"></tui-icon>
                  <span>{{ 'current.season' | translate }}: {{ currentSeason()!.name }}</span>
                </li>
              }
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

        <!-- Contact Info -->
        <div class="mb-6 overflow-hidden rounded-lg bg-white shadow-md dark:bg-slate-800">
          <div class="border-b border-gray-200 px-6 py-5 dark:border-gray-700">
            <h3 class="text-xl font-semibold text-gray-800 dark:text-white">{{ 'contact.information' | translate }}</h3>
          </div>
          <div class="border-t border-gray-200 p-6 dark:border-gray-700">
            <pre class="whitespace-pre-wrap">{{ headquarterData()!.contact_info | json }}</pre>
          </div>
        </div>

        @if (headquarterData()!.scheduled_workshops?.length) {
          <div class="mt-6">
            <h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">
              {{ 'workshops.in' | translate }} {{ headquarterData()!.name }}
            </h3>
            <z-generic-table
              [loading]="false"
              [items]="headquarterData()!.scheduled_workshops!"
              [headers]="['local_name', 'start_datetime', 'end_datetime', 'status', 'actions']"
              [headerLabels]="{
                local_name: ('name' | translate),
                start_datetime: ('start.date' | translate),
                end_datetime: ('end.date' | translate),
                status: ('status' | translate),
                actions: ('actions' | translate),
              }"
              [emptyMessage]="'no.workshops.found' | translate"
            >
              <ng-template [zColumnTemplate]="'start_datetime'" let-item>
                {{ item.start_datetime | date: 'medium' }}
              </ng-template>
              <ng-template [zColumnTemplate]="'end_datetime'" let-item>
                {{ item.end_datetime | date: 'medium' }}
              </ng-template>
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
              <ng-template [zColumnTemplate]="'actions'" let-item>
                <a
                  [routerLink]="['/dashboard/workshops', item.id]"
                  class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {{ 'view.details' | translate }}
                </a>
              </ng-template>
            </z-generic-table>
          </div>
        }

        @if (headquarterData()!.seasons?.length) {
          <div class="mt-6">
            <h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">
              {{ 'seasons.in' | translate }} {{ headquarterData()!.name }}
            </h3>
            <z-generic-table
              [loading]="false"
              [items]="headquarterData()!.seasons!"
              [headers]="['name', 'start_date', 'end_date', 'status']"
              [headerLabels]="{
                name: ('name' | translate),
                start_date: ('start.date' | translate),
                end_date: ('end.date' | translate),
                status: ('status' | translate),
              }"
              [emptyMessage]="'no.seasons.found' | translate"
            >
              <ng-template [zColumnTemplate]="'start_date'" let-item>
                {{ item.start_date | date: 'mediumDate' }}
              </ng-template>
              <ng-template [zColumnTemplate]="'end_date'" let-item>
                {{ item.end_date | date: 'mediumDate' }}
              </ng-template>
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

        @if (headquarterData()!.agreements?.length) {
          <!-- Alumnos de la actual edición -->
          @if (currentEditionStudents()?.length) {
            <div class="mt-6">
              <h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                {{ 'headquarter.students.current_edition' | translate }} {{ headquarterData()!.name }}
              </h3>
              <z-generic-table
                [loading]="false"
                [items]="currentEditionStudents()!"
                [headers]="['name', 'last_name', 'email', 'phone', 'document_number', 'status', 'created_at']"
                [headerLabels]="{
                  name: ('name' | translate),
                  last_name: ('last.name' | translate),
                  email: ('email' | translate),
                  phone: ('phone' | translate),
                  document_number: ('document.number' | translate),
                  status: ('status' | translate),
                  created_at: ('created.at' | translate),
                }"
                [emptyMessage]="'no.agreements.found' | translate"
              >
                <ng-template [zColumnTemplate]="'status'" let-item>
                  <span
                    class="inline-flex rounded-full px-2 text-xs leading-5 font-semibold"
                    [ngClass]="
                      item.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : item.status === 'graduated'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                    "
                  >
                    {{ item.status | translate }}
                  </span>
                </ng-template>
                <ng-template [zColumnTemplate]="'created_at'" let-item>
                  {{ item.created_at | date: 'mediumDate' }}
                </ng-template>
              </z-generic-table>
            </div>
          }

          <!-- Anteriores alumnos -->
          @if (previousStudents()?.length) {
            <div class="mt-6">
              <h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                {{ 'headquarter.students.previous' | translate }} {{ headquarterData()!.name }}
              </h3>
              <z-generic-table
                [loading]="false"
                [items]="previousStudents()!"
                [headers]="['name', 'last_name', 'email', 'phone', 'document_number', 'status', 'created_at']"
                [headerLabels]="{
                  name: ('name' | translate),
                  last_name: ('last.name' | translate),
                  email: ('email' | translate),
                  phone: ('phone' | translate),
                  document_number: ('document.number' | translate),
                  status: ('status' | translate),
                  created_at: ('created.at' | translate),
                }"
                [emptyMessage]="'no.previous.students.found' | translate"
              >
                <ng-template [zColumnTemplate]="'status'" let-item>
                  <span
                    class="inline-flex rounded-full px-2 text-xs leading-5 font-semibold"
                    [ngClass]="
                      item.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : item.status === 'graduated'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                    "
                  >
                    {{ item.status | translate }}
                  </span>
                </ng-template>
                <ng-template [zColumnTemplate]="'created_at'" let-item>
                  {{ item.created_at | date: 'mediumDate' }}
                </ng-template>
              </z-generic-table>
            </div>
          }
        }
      } @else if (headquartersFacade.detailLoadingError()) {
        <div class="rounded border-l-4 border-red-400 bg-red-50 p-4 dark:border-red-500 dark:bg-red-900/30">
          <p class="text-red-700 dark:text-red-300">
            {{ 'failed.to.load.headquarter' | translate }}: {{ headquartersFacade.detailLoadingError() }}
          </p>
        </div>
      } @else {
        <div class="rounded border-l-4 border-red-400 bg-red-50 p-4 dark:border-red-500 dark:bg-red-900/30">
          <p class="text-red-700 dark:text-red-300">{{ 'headquarter.not.found' | translate }}</p>
        </div>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeadquarterDetailSmartComponent {
  headquartersFacade = inject(HeadquartersFacadeService);
  translate = inject(TranslateService);
  headquarterId = input.required<string>();
  headquarterData: WritableSignal<HeadquarterWithRelations | null> = signal(null);
  ICONS = ICONS;

  currentSeason = computed(() => {
    const hqData = this.headquarterData();
    if (!hqData || !hqData.seasons || hqData.seasons.length === 0) {
      return null;
    }
    const today = new Date().toISOString().split('T')[0];
    return (
      hqData.seasons.find((season) => {
        const startDate = season.start_date;
        const endDate = season.end_date;
        return startDate && endDate && startDate <= today && today <= endDate && season.status === 'active';
      }) ||
      hqData.seasons.find((season) => season.status === 'active') ||
      hqData.seasons[0]
    );
  });

  currentEditionStudents = computed(() => {
    const agreements = this.headquarterData()?.agreements;
    if (!agreements) return [];
    return agreements.filter((agreement) => agreement.status !== 'graduated');
  });

  previousStudents = computed(() => {
    const agreements = this.headquarterData()?.agreements;
    if (!agreements) return [];
    return agreements.filter((agreement) => agreement.status === 'graduated');
  });

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
