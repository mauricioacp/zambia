import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
  WritableSignal,
  effect,
  computed,
  DestroyRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  HeadquartersFacadeService,
  HeadquarterWithRelations,
  ScheduledWorkshop,
  HeadquarterFormData,
  Season,
} from '../../services/headquarters-facade.service';
import { HeadquarterFormModalSmartComponent } from './headquarter-form-modal.smart-component';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { NotificationService } from '@zambia/data-access-generic';
import { AgreementsFacadeService, AgreementWithShallowRelations } from '@zambia/feat-agreements';
import { TuiBreadcrumbs, TuiDataListWrapper, TuiSelect, TuiChevron } from '@taiga-ui/kit';
import {
  TuiButton,
  TuiDialogService,
  TuiIcon,
  TuiLink,
  TuiNotification,
  TuiTextfieldComponent,
  TuiTextfieldDropdownDirective,
  TuiTextfieldOptionsDirective,
} from '@taiga-ui/core';
import { EnhancedTableUiComponent, type TableAction, type TableColumn } from '@zambia/ui-components';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ICONS } from '@zambia/util-constants';
import { TuiItem } from '@taiga-ui/cdk';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'z-headquarter-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TuiIcon,
    TuiButton,
    TuiLink,
    TuiBreadcrumbs,
    TuiNotification,
    TuiDataListWrapper,
    TuiSelect,
    TuiChevron,
    EnhancedTableUiComponent,
    TranslatePipe,
    TuiItem,
    TuiTextfieldComponent,
    TuiTextfieldDropdownDirective,
    TuiTextfieldOptionsDirective,
  ],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-slate-800">
      <!-- Header Section -->
      <div class="bg-white shadow-xl dark:bg-slate-900">
        <div class="container mx-auto px-6 py-4">
          <!-- Breadcrumbs -->
          <tui-breadcrumbs class="mb-6">
            <a *tuiItem routerLink="/dashboard" tuiLink iconStart="@tui.house">
              {{ 'dashboard' | translate }}
            </a>
            <a *tuiItem routerLink="/dashboard/headquarters" tuiLink>
              {{ 'headquarters' | translate }}
            </a>
            <span *tuiItem>
              {{ headquarterData()?.name || ('loading' | translate) }}
            </span>
          </tui-breadcrumbs>

          @if (headquarterData()) {
            <!-- Headquarter Header -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-4 shadow-lg">
                  <tui-icon [icon]="ICONS.HEADQUARTERS" class="text-3xl text-white"></tui-icon>
                </div>
                <div>
                  <h1 class="mb-1 text-3xl font-bold text-gray-900 dark:text-white">
                    {{ headquarterData()!.name }}
                  </h1>
                  <p class="text-gray-600 dark:text-slate-400">{{ 'headquarter_detail_subtitle' | translate }}</p>
                </div>
              </div>
              <button
                tuiButton
                appearance="primary"
                size="l"
                iconStart="@tui.pencil"
                (click)="onEdit()"
                [disabled]="isProcessing()"
                class="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                {{ 'edit' | translate }}
              </button>
            </div>
          }
        </div>
      </div>

      <div class="container mx-auto px-6 py-8">
        @if (headquartersFacade.isDetailLoading()) {
          <!-- Loading State -->
          <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-6">
            @for (i of [1, 2, 3, 4, 5, 6]; track i) {
              <div
                class="animate-pulse rounded-xl border border-gray-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900"
              >
                <div class="mb-3 h-4 w-24 rounded bg-gray-200 dark:bg-slate-700"></div>
                <div class="h-8 w-32 rounded bg-gray-200 dark:bg-slate-700"></div>
              </div>
            }
          </div>
          <div
            class="animate-pulse rounded-xl border border-gray-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900"
          >
            <div class="mb-4 h-6 w-48 rounded bg-gray-200 dark:bg-slate-700"></div>
            <div class="space-y-3">
              @for (i of [1, 2, 3]; track i) {
                <div class="h-12 rounded bg-gray-200 dark:bg-slate-700"></div>
              }
            </div>
          </div>
        } @else if (headquarterData()) {
          <!-- Enhanced Metrics Cards -->
          <div class="mb-8 grid grid-cols-1 items-stretch gap-6 md:grid-cols-3 lg:grid-cols-6">
            <!-- Country Card -->
            <div
              class="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-gray-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600"
            >
              <div class="flex h-8 items-center justify-between">
                <span class="text-sm font-medium tracking-wider text-gray-600 uppercase dark:text-slate-400">
                  {{ 'country' | translate }}
                </span>
                <tui-icon [icon]="ICONS.COUNTRIES" class="text-emerald-500"></tui-icon>
              </div>
              <div class="mt-3 flex flex-1 flex-col justify-end">
                <p class="text-xl font-bold text-gray-900 dark:text-white">
                  {{ headquarterData()!.countries?.name || ('no_country' | translate) }}
                </p>
                <div class="mt-1 h-6">
                  @if (headquarterData()!.countries?.code) {
                    <p class="font-mono text-sm text-gray-500 dark:text-slate-400">
                      {{ headquarterData()!.countries?.code }}
                    </p>
                  }
                </div>
              </div>
            </div>

            <!-- Status Card -->
            <div
              class="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-gray-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600"
            >
              <div class="flex h-8 items-center justify-between">
                <span class="text-sm font-medium tracking-wider text-gray-600 uppercase dark:text-slate-400">
                  {{ 'status' | translate }}
                </span>
                <tui-icon icon="@tui.activity" class="text-green-500"></tui-icon>
              </div>
              <div class="mt-3 flex flex-1 flex-col justify-end">
                <div
                  class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold"
                  [class]="
                    headquarterData()!.status === 'active'
                      ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                      : 'bg-red-500/20 text-red-600 dark:text-red-400'
                  "
                >
                  <tui-icon
                    [icon]="headquarterData()!.status === 'active' ? '@tui.check-circle' : '@tui.x-circle'"
                    class="text-xs"
                  ></tui-icon>
                  {{ headquarterData()!.status || '' | translate }}
                </div>
                <div class="mt-1 h-6"></div>
              </div>
            </div>

            <!-- Total Students Card -->
            <div
              class="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-gray-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600"
            >
              <div class="flex h-8 items-center justify-between">
                <span class="text-sm font-medium tracking-wider text-gray-600 uppercase dark:text-slate-400">
                  {{ 'total_students' | translate }}
                </span>
                <tui-icon icon="@tui.users" class="text-blue-500"></tui-icon>
              </div>
              <div class="mt-3 flex flex-1 flex-col justify-end">
                <p class="text-2xl font-bold text-gray-900 dark:text-white">
                  {{ studentMetrics().total }}
                </p>
                <div class="mt-1 h-6">
                  <p class="text-xs text-gray-500 dark:text-slate-400">
                    Current: {{ studentMetrics().currentEdition }} | Graduated: {{ studentMetrics().graduated }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Active Students Card -->
            <div
              class="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-gray-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600"
            >
              <div class="flex h-8 items-center justify-between">
                <span class="text-sm font-medium tracking-wider text-gray-600 uppercase dark:text-slate-400">
                  {{ 'active_students' | translate }}
                </span>
                <tui-icon icon="@tui.check-circle" class="text-green-500"></tui-icon>
              </div>
              <div class="mt-3 flex flex-1 flex-col justify-end">
                <p class="text-2xl font-bold text-gray-900 dark:text-white">
                  {{ studentMetrics().active }}
                </p>
                <div class="mt-1 h-6">
                  <p class="text-xs text-gray-500 dark:text-slate-400">
                    Prospects: {{ studentMetrics().prospects }} | Inactive: {{ studentMetrics().inactive }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Facilitators Card -->
            <div
              class="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-gray-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600"
            >
              <div class="flex h-8 items-center justify-between">
                <span class="text-sm font-medium tracking-wider text-gray-600 uppercase dark:text-slate-400">
                  {{ 'facilitators' | translate }}
                </span>
                <tui-icon icon="@tui.presentation" class="text-purple-500"></tui-icon>
              </div>
              <div class="mt-3 flex flex-1 flex-col justify-end">
                <p class="text-2xl font-bold text-gray-900 dark:text-white">
                  {{ collaboratorMetrics().facilitators }}
                </p>
                <div class="mt-1 h-6">
                  <p class="text-xs text-gray-500 dark:text-slate-400">
                    {{ 'teaching_staff' | translate }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Staff Overview Card -->
            <div
              class="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-gray-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600"
            >
              <div class="flex h-8 items-center justify-between">
                <span class="text-sm font-medium tracking-wider text-gray-600 uppercase dark:text-slate-400">
                  {{ 'staff_overview' | translate }}
                </span>
                <tui-icon icon="@tui.users" class="text-orange-500"></tui-icon>
              </div>
              <div class="mt-3 flex flex-1 flex-col justify-end">
                <div class="space-y-1">
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-500 dark:text-slate-400">{{ 'companions' | translate }}</span>
                    <span class="font-semibold text-gray-900 dark:text-white">{{
                      collaboratorMetrics().companions
                    }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-500 dark:text-slate-400">{{ 'managers' | translate }}</span>
                    <span class="font-semibold text-gray-900 dark:text-white">{{
                      collaboratorMetrics().managers
                    }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-500 dark:text-slate-400">{{ 'assistants' | translate }}</span>
                    <span class="font-semibold text-gray-900 dark:text-white">{{
                      collaboratorMetrics().assistants
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Enhanced Contact Information Section -->
          @if (managerInfo() || generalContactInfo()) {
            <div class="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <!-- Manager Information -->
              @if (managerInfo()) {
                <div
                  class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900"
                >
                  <div class="border-b border-gray-200 px-6 py-4 dark:border-slate-700">
                    <h3 class="flex items-center gap-3 text-lg font-bold text-gray-900 dark:text-white">
                      <tui-icon icon="@tui.user" class="text-blue-500"></tui-icon>
                      {{ 'headquarter_manager' | translate }}
                    </h3>
                  </div>
                  <div class="space-y-4 p-6">
                    <div class="flex items-center gap-3">
                      <tui-icon icon="@tui.user" class="text-gray-500 dark:text-slate-400"></tui-icon>
                      <div>
                        <p class="font-semibold text-gray-900 dark:text-white">{{ managerInfo()!.name }}</p>
                        <p class="text-sm text-gray-600 dark:text-slate-400">{{ 'manager' | translate }}</p>
                      </div>
                    </div>
                    @if (managerInfo()!.email) {
                      <div class="flex items-center gap-3">
                        <tui-icon icon="@tui.mail" class="text-gray-500 dark:text-slate-400"></tui-icon>
                        <a
                          href="mailto:{{ managerInfo()!.email }}"
                          class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          {{ managerInfo()!.email }}
                        </a>
                      </div>
                    }
                    @if (managerInfo()!.phone) {
                      <div class="flex items-center gap-3">
                        <tui-icon icon="@tui.phone" class="text-gray-500 dark:text-slate-400"></tui-icon>
                        <a
                          href="tel:{{ managerInfo()!.phone }}"
                          class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          {{ managerInfo()!.phone }}
                        </a>
                      </div>
                    }
                  </div>
                </div>
              }

              <!-- General Contact Information -->
              @if (generalContactInfo()) {
                <div
                  class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900"
                >
                  <div class="border-b border-gray-200 px-6 py-4 dark:border-slate-700">
                    <h3 class="flex items-center gap-3 text-lg font-bold text-gray-900 dark:text-white">
                      <tui-icon icon="@tui.phone" class="text-green-500"></tui-icon>
                      {{ 'general_contact' | translate }}
                    </h3>
                  </div>
                  <div class="space-y-4 p-6">
                    @if (generalContactInfo()!.generalEmail) {
                      <div class="flex items-center gap-3">
                        <tui-icon icon="@tui.mail" class="text-gray-500 dark:text-slate-400"></tui-icon>
                        <a
                          href="mailto:{{ generalContactInfo()!.generalEmail }}"
                          class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          {{ generalContactInfo()!.generalEmail }}
                        </a>
                      </div>
                    }
                    @if (generalContactInfo()!.generalPhone) {
                      <div class="flex items-center gap-3">
                        <tui-icon icon="@tui.phone" class="text-gray-500 dark:text-slate-400"></tui-icon>
                        <a
                          href="tel:{{ generalContactInfo()!.generalPhone }}"
                          class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          {{ generalContactInfo()!.generalPhone }}
                        </a>
                      </div>
                    }
                    @if (generalContactInfo()!.website) {
                      <div class="flex items-center gap-3">
                        <tui-icon icon="@tui.globe" class="text-gray-500 dark:text-slate-400"></tui-icon>
                        <a
                          href="{{ generalContactInfo()!.website }}"
                          target="_blank"
                          class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          {{ generalContactInfo()!.website }}
                        </a>
                      </div>
                    }
                    @if (
                      generalContactInfo()!.socialMedia &&
                      (generalContactInfo()!.socialMedia!.facebook ||
                        generalContactInfo()!.socialMedia!.instagram ||
                        generalContactInfo()!.socialMedia!.twitter)
                    ) {
                      <div class="border-t border-gray-200 pt-2 dark:border-slate-700">
                        <p class="mb-2 text-sm font-semibold text-gray-600 dark:text-slate-400">
                          {{ 'social_media' | translate }}
                        </p>
                        <div class="flex gap-3">
                          @if (generalContactInfo()!.socialMedia!.facebook) {
                            <a
                              href="{{ generalContactInfo()!.socialMedia!.facebook }}"
                              target="_blank"
                              class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              <tui-icon icon="@tui.facebook" class="text-lg"></tui-icon>
                            </a>
                          }
                          @if (generalContactInfo()!.socialMedia!.instagram) {
                            <a
                              href="{{ generalContactInfo()!.socialMedia!.instagram }}"
                              target="_blank"
                              class="text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300"
                            >
                              <tui-icon icon="@tui.instagram" class="text-lg"></tui-icon>
                            </a>
                          }
                          @if (generalContactInfo()!.socialMedia!.twitter) {
                            <a
                              href="{{ generalContactInfo()!.socialMedia!.twitter }}"
                              target="_blank"
                              class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              <tui-icon icon="@tui.twitter" class="text-lg"></tui-icon>
                            </a>
                          }
                        </div>
                      </div>
                    }
                    @if (generalContactInfo()!.notes) {
                      <div class="border-t border-gray-200 pt-2 dark:border-slate-700">
                        <p class="mb-2 text-sm font-semibold text-gray-600 dark:text-slate-400">
                          {{ 'notes' | translate }}
                        </p>
                        <p class="text-sm text-gray-700 dark:text-slate-300">{{ generalContactInfo()!.notes }}</p>
                      </div>
                    }
                  </div>
                </div>
              }
            </div>
          }

          <!-- Address Section -->
          @if (headquarterData()!.address) {
            <div
              class="mb-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900"
            >
              <div class="border-b border-gray-200 px-6 py-4 dark:border-slate-700">
                <h2 class="flex items-center gap-3 text-xl font-bold text-gray-900 dark:text-white">
                  <tui-icon icon="@tui.map-pin" class="text-red-500"></tui-icon>
                  {{ 'address' | translate }}
                </h2>
              </div>
              <div class="p-6">
                <p class="text-gray-700 dark:text-slate-300">{{ headquarterData()!.address }}</p>
              </div>
            </div>
          }

          <!-- Workshops Section -->
          @if (headquarterData()!.scheduled_workshops?.length) {
            <div
              class="mb-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900"
            >
              <div class="border-b border-gray-200 px-6 py-4 dark:border-slate-700">
                <h2 class="flex items-center gap-3 text-xl font-bold text-gray-900 dark:text-white">
                  <tui-icon icon="@tui.calendar" class="text-purple-500"></tui-icon>
                  {{ 'workshops.in' | translate }} {{ headquarterData()!.name }}
                </h2>
              </div>
              <z-enhanced-table
                [items]="headquarterData()!.scheduled_workshops || []"
                [columns]="workshopsColumns()"
                [actions]="workshopsActions()"
                [loading]="false"
                [enablePagination]="true"
                [enableFiltering]="true"
                [enableColumnVisibility]="true"
                [pageSize]="10"
                [searchableColumns]="['local_name']"
                [emptyStateTitle]="'no.workshops.found' | translate"
                [emptyStateDescription]="'no_workshops_description' | translate"
                [emptyStateIcon]="'@tui.calendar'"
                [showCreateButton]="false"
                (rowClick)="onWorkshopClick($event)"
              />
            </div>
          }

          <!-- All Agreements Section -->
          @if (headquarterData()?.agreements?.length) {
            <div
              class="mb-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900"
            >
              <div class="border-b border-gray-200 px-6 py-4 dark:border-slate-700">
                <div class="flex items-center justify-between">
                  <h2 class="flex items-center gap-3 text-xl font-bold text-gray-900 dark:text-white">
                    <tui-icon icon="@tui.file-text" class="text-green-500"></tui-icon>
                    {{ 'all_agreements' | translate }}
                  </h2>
                  <!-- Role Filter -->
                  <div class="w-48">
                    <label
                      for="roleFilterSelect"
                      class="mb-2 block text-sm font-medium text-gray-600 dark:text-slate-400"
                    >
                      {{ 'filter_by_role' | translate }}
                    </label>
                    <tui-textfield tuiChevron tuiTextfieldSize="m" class="w-full">
                      <input
                        id="roleFilterSelect"
                        tuiSelect
                        [formControl]="roleFilter"
                        [placeholder]="'all_roles' | translate"
                      />
                      <tui-data-list-wrapper *tuiTextfieldDropdown new [items]="roleFilterOptions()">
                      </tui-data-list-wrapper>
                    </tui-textfield>
                  </div>
                </div>
              </div>
              <z-enhanced-table
                [items]="filteredAgreements() || []"
                [columns]="agreementsColumns()"
                [actions]="agreementsActions()"
                [loading]="agreementsLoading()"
                [enablePagination]="true"
                [enableFiltering]="true"
                [enableColumnVisibility]="true"
                [pageSize]="15"
                [searchableColumns]="['name', 'last_name', 'email']"
                [emptyStateTitle]="'no.agreements.found' | translate"
                [emptyStateDescription]="'no_agreements_description' | translate"
                [emptyStateIcon]="'@tui.file-text'"
                [showCreateButton]="false"
              />
            </div>
          }

          <!-- Current Season Information and Seasons Table -->
          @if (headquarterData()?.seasons?.length) {
            <div class="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
              <!-- Current Season Card -->
              @if (currentSeason()) {
                <div
                  class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl lg:col-span-1 dark:border-slate-700 dark:bg-slate-900"
                >
                  <div class="border-b border-gray-200 px-6 py-4 dark:border-slate-700">
                    <h3 class="flex items-center gap-3 text-lg font-bold text-gray-900 dark:text-white">
                      <tui-icon icon="@tui.calendar" class="text-amber-500"></tui-icon>
                      {{ 'current_season' | translate }}
                    </h3>
                  </div>
                  <div class="space-y-4 p-6">
                    <div>
                      <p class="text-xl font-bold text-gray-900 dark:text-white">{{ currentSeason()!.name }}</p>
                      <div
                        class="mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold"
                        [class]="
                          currentSeason()!.status === 'active'
                            ? 'bg-green-500/20 text-green-400'
                            : currentSeason()!.status === 'completed'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-orange-500/20 text-orange-400'
                        "
                      >
                        <tui-icon
                          [icon]="
                            currentSeason()!.status === 'active'
                              ? '@tui.check-circle'
                              : currentSeason()!.status === 'completed'
                                ? '@tui.calendar-check'
                                : '@tui.clock'
                          "
                          class="text-xs"
                        ></tui-icon>
                        {{ currentSeason()!.status || '' | translate }}
                      </div>
                    </div>
                    @if (currentSeason()!.start_date || currentSeason()!.end_date) {
                      <div class="space-y-2 border-t border-gray-200 pt-3 dark:border-slate-700">
                        @if (currentSeason()!.start_date) {
                          <div class="flex items-center gap-2 text-sm">
                            <span class="text-gray-600 dark:text-slate-400">{{ 'start_date' | translate }}:</span>
                            <span class="font-medium text-gray-900 dark:text-white">{{
                              currentSeason()!.start_date
                            }}</span>
                          </div>
                        }
                        @if (currentSeason()!.end_date) {
                          <div class="flex items-center gap-2 text-sm">
                            <span class="text-gray-600 dark:text-slate-400">{{ 'end_date' | translate }}:</span>
                            <span class="font-medium text-gray-900 dark:text-white">{{
                              currentSeason()!.end_date
                            }}</span>
                          </div>
                        }
                      </div>
                    }
                  </div>
                </div>
              }

              <!-- All Seasons Table -->
              <div
                class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl lg:col-span-2 dark:border-slate-700 dark:bg-slate-900"
              >
                <div class="border-b border-gray-200 px-6 py-4 dark:border-slate-700">
                  <h2 class="flex items-center gap-3 text-xl font-bold text-gray-900 dark:text-white">
                    <tui-icon icon="@tui.calendar" class="text-purple-500"></tui-icon>
                    {{ 'seasons' | translate }}
                  </h2>
                </div>
                <z-enhanced-table
                  [items]="headquarterData()!.seasons || []"
                  [columns]="seasonsColumns()"
                  [actions]="seasonsActions()"
                  [loading]="false"
                  [enablePagination]="true"
                  [enableFiltering]="true"
                  [enableColumnVisibility]="true"
                  [pageSize]="10"
                  [searchableColumns]="['name']"
                  [emptyStateTitle]="'no.seasons.found' | translate"
                  [emptyStateDescription]="'no_seasons_description' | translate"
                  [emptyStateIcon]="'@tui.calendar'"
                  [showCreateButton]="false"
                  (rowClick)="onSeasonView($event)"
                />
              </div>
            </div>
          }

          <!-- Current Students Section -->
          @if (currentEditionStudents()?.length) {
            <div
              class="mb-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900"
            >
              <div class="border-b border-gray-200 px-6 py-4 dark:border-slate-700">
                <h2 class="flex items-center gap-3 text-xl font-bold text-gray-900 dark:text-white">
                  <tui-icon icon="@tui.users" class="text-blue-500"></tui-icon>
                  {{ 'current_students' | translate }}
                </h2>
              </div>
              <z-enhanced-table
                [items]="currentEditionStudents() || []"
                [columns]="studentsColumns()"
                [actions]="studentsActions()"
                [loading]="false"
                [enablePagination]="true"
                [enableFiltering]="true"
                [enableColumnVisibility]="true"
                [pageSize]="10"
                [searchableColumns]="['name', 'last_name', 'email']"
                [emptyStateTitle]="'no.students.found' | translate"
                [emptyStateDescription]="'no_students_description' | translate"
                [emptyStateIcon]="'@tui.users'"
                [showCreateButton]="false"
              />
            </div>
          }
        } @else if (headquartersFacade.detailLoadingError()) {
          <!-- Error State -->
          <div class="mx-auto max-w-md">
            <tui-notification status="error" class="border border-red-500/20 bg-red-50 dark:bg-red-500/10">
              <div class="py-8 text-center">
                <tui-icon icon="@tui.alert-triangle" class="mb-4 text-4xl text-red-500"></tui-icon>
                <h3 class="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                  {{ 'error_loading_headquarter' | translate }}
                </h3>
                <p class="mb-6 text-gray-600 dark:text-slate-400">{{ headquartersFacade.detailLoadingError() }}</p>
                <button tuiButton appearance="destructive" size="m" (click)="retry()">
                  {{ 'retry' | translate }}
                </button>
              </div>
            </tui-notification>
          </div>
        } @else if (!headquarterData() && !headquartersFacade.isDetailLoading()) {
          <!-- Not Found State -->
          <div class="mx-auto max-w-md">
            <tui-notification status="warning" class="border border-yellow-500/20 bg-yellow-50 dark:bg-yellow-500/10">
              <div class="py-8 text-center">
                <tui-icon icon="@tui.help-circle" class="mb-4 text-4xl text-yellow-500"></tui-icon>
                <h3 class="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                  {{ 'headquarter.not.found' | translate }}
                </h3>
                <p class="mb-6 text-gray-600 dark:text-slate-400">
                  {{ 'headquarter_not_found_description' | translate }}
                </p>
                <button tuiButton appearance="secondary" size="m" routerLink="/dashboard/headquarters">
                  {{ 'back.to.headquarters' | translate }}
                </button>
              </div>
            </tui-notification>
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeadquarterDetailSmartComponent {
  protected headquartersFacade = inject(HeadquartersFacadeService);
  protected agreementsFacade = inject(AgreementsFacadeService);
  private router = inject(Router);
  private translate = inject(TranslateService);
  private dialogService = inject(TuiDialogService);
  private notificationService = inject(NotificationService);
  private destroyRef = inject(DestroyRef);

  headquarterId = input.required<string>();
  headquarterData: WritableSignal<HeadquarterWithRelations | null> = signal(null);
  isProcessing = signal(false);
  roleFilter = new FormControl('');
  roleFilterValue = signal('');
  agreementsList = computed(() => {
    const result = this.agreementsFacade.agreements.value();
    return result?.data || [];
  });
  agreementsLoading = computed(() => this.agreementsFacade.isLoading());

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
    const agreements = this.agreementsList();
    if (!agreements) return [];
    return agreements.filter((agreement: AgreementWithShallowRelations) => agreement.status !== 'graduated');
  });

  previousStudents = computed(() => {
    const agreements = this.agreementsList();
    if (!agreements) return [];
    return agreements.filter((agreement: AgreementWithShallowRelations) => agreement.status === 'graduated');
  });

  studentMetrics = computed(() => {
    const agreements = this.agreementsList() || [];

    return {
      total: agreements.length,
      active: agreements.filter((a: AgreementWithShallowRelations) => a.status === 'active').length,
      prospects: agreements.filter((a: AgreementWithShallowRelations) => a.status === 'prospect').length,
      inactive: agreements.filter((a: AgreementWithShallowRelations) => a.status === 'inactive').length,
      graduated: agreements.filter((a: AgreementWithShallowRelations) => a.status === 'graduated').length,
      currentEdition: agreements.filter((a: AgreementWithShallowRelations) => a.status !== 'graduated').length,
    };
  });

  collaboratorMetrics = computed(() => {
    const agreements = this.agreementsList() || [];

    return {
      total: agreements.length,
      facilitators: agreements.filter((a: AgreementWithShallowRelations) =>
        a.role?.role_code?.toLowerCase().includes('facilitator')
      ).length,
      companions: agreements.filter((a: AgreementWithShallowRelations) =>
        a.role?.role_code?.toLowerCase().includes('companion')
      ).length,
      managers: agreements.filter((a: AgreementWithShallowRelations) =>
        a.role?.role_code?.toLowerCase().includes('manager')
      ).length,
      assistants: agreements.filter((a: AgreementWithShallowRelations) =>
        a.role?.role_code?.toLowerCase().includes('assistant')
      ).length,
      coordinators: agreements.filter((a: AgreementWithShallowRelations) =>
        a.role?.role_code?.toLowerCase().includes('coordinator')
      ).length,
      directors: agreements.filter((a: AgreementWithShallowRelations) =>
        a.role?.role_code?.toLowerCase().includes('director')
      ).length,
    };
  });

  // Manager information from contact_info
  managerInfo = computed(() => {
    const contactInfo = this.headquarterData()?.contact_info;
    if (!contactInfo || !contactInfo.managerId) {
      return null;
    }

    return {
      id: contactInfo.managerId,
      name: contactInfo.managerName,
      email: contactInfo.managerEmail,
      phone: contactInfo.managerPhone,
    };
  });

  // General contact information
  generalContactInfo = computed(() => {
    const contactInfo = this.headquarterData()?.contact_info;
    if (!contactInfo) {
      return null;
    }

    return {
      generalEmail: contactInfo.generalEmail,
      generalPhone: contactInfo.generalPhone,
      website: contactInfo.website,
      socialMedia: contactInfo.socialMedia,
      notes: contactInfo.notes,
    };
  });

  // Role filter options
  roleFilterOptions = computed(() => [
    this.translate.instant('all_roles'),
    this.translate.instant('students'),
    this.translate.instant('facilitators'),
    this.translate.instant('companions'),
    this.translate.instant('managers'),
    this.translate.instant('assistants'),
    this.translate.instant('coordinators'),
    this.translate.instant('directors'),
  ]);

  // Role filter values (will be initialized in constructor)
  private roleFilterMap: Record<string, string> = {};

  // Filtered agreements based on role filter
  filteredAgreements = computed(() => {
    const agreements = this.agreementsList() || [];
    const selectedDisplayText = this.roleFilterValue();

    // Map the display text to the filter value
    const filter = this.roleFilterMap[selectedDisplayText] || 'all';

    if (!filter || filter === 'all') {
      return agreements;
    }

    // Debug: Log first agreement's role structure
    if (agreements.length > 0 && agreements[0].role) {
      console.log('Role structure:', agreements[0].role);
    }

    return agreements.filter((agreement: AgreementWithShallowRelations) => {
      // Handle role structure from AgreementWithShallowRelations
      const role = agreement.role;
      if (!role) return false;

      // Use the correct property names from RoleInAgreement type
      const roleCode = (role.role_code || '')?.toLowerCase();
      const roleName = (role.role_name || '')?.toLowerCase();

      switch (filter) {
        case 'student':
          return (
            roleCode.includes('student') ||
            roleCode.includes('alumno') ||
            roleName.includes('student') ||
            roleName.includes('alumno')
          );
        case 'facilitator':
          return roleCode.includes('facilitator') || roleName.includes('facilitator');
        case 'companion':
          return (
            roleCode.includes('companion') ||
            roleName.includes('companion') ||
            roleCode.includes('companion') ||
            roleName.includes('acompañante')
          );
        case 'manager':
          return roleCode.includes('manager') || roleName.includes('manager');
        case 'assistant':
          return roleCode.includes('assistant') || roleName.includes('assistant');
        case 'coordinator':
          return roleCode.includes('coordinator') || roleName.includes('coordinator');
        case 'director':
          return roleCode.includes('director') || roleName.includes('director');
        default:
          return true;
      }
    });
  });

  workshopsColumns = computed((): TableColumn[] => [
    {
      key: 'local_name',
      label: this.translate.instant('name'),
      type: 'text',
      sortable: true,
      searchable: true,
    },
    {
      key: 'start_datetime',
      label: this.translate.instant('start_date'),
      type: 'date',
      sortable: true,
    },
    {
      key: 'end_datetime',
      label: this.translate.instant('end_date'),
      type: 'date',
      sortable: true,
    },
    {
      key: 'status',
      label: this.translate.instant('status'),
      type: 'status',
      sortable: true,
      width: 120,
    },
    {
      key: 'actions',
      label: this.translate.instant('actions'),
      type: 'actions',
      align: 'center',
      width: 150,
    },
  ]);

  workshopsActions = computed((): TableAction<ScheduledWorkshop>[] => [
    {
      label: this.translate.instant('view'),
      icon: '@tui.eye',
      color: 'primary',
      handler: (workshop) => this.onWorkshopView(workshop),
    },
  ]);

  studentsColumns = computed((): TableColumn[] => [
    {
      key: 'name',
      label: this.translate.instant('name'),
      type: 'text',
      sortable: true,
      searchable: true,
    },
    {
      key: 'last_name',
      label: this.translate.instant('last_name'),
      type: 'text',
      sortable: true,
      searchable: true,
    },
    {
      key: 'email',
      label: this.translate.instant('email'),
      type: 'text',
      sortable: true,
      searchable: true,
    },
    {
      key: 'status',
      label: this.translate.instant('status'),
      type: 'status',
      sortable: true,
      width: 120,
    },
    {
      key: 'created_at',
      label: this.translate.instant('created_at'),
      type: 'date',
      sortable: true,
      width: 150,
    },
  ]);

  studentsActions = computed((): TableAction<AgreementWithShallowRelations>[] => [
    {
      label: this.translate.instant('view'),
      icon: '@tui.eye',
      color: 'primary',
      handler: (student) => this.onStudentView(student),
    },
  ]);

  agreementsColumns = computed((): TableColumn[] => [
    {
      key: 'name',
      label: this.translate.instant('name'),
      type: 'text',
      sortable: true,
      searchable: true,
    },
    {
      key: 'last_name',
      label: this.translate.instant('last_name'),
      type: 'text',
      sortable: true,
      searchable: true,
    },
    {
      key: 'email',
      label: this.translate.instant('email'),
      type: 'text',
      sortable: true,
      searchable: true,
    },
    {
      key: 'role',
      label: this.translate.instant('role'),
      type: 'text',
      sortable: true,
    },
    {
      key: 'status',
      label: this.translate.instant('status'),
      type: 'status',
      sortable: true,
      width: 120,
    },
    {
      key: 'created_at',
      label: this.translate.instant('created_at'),
      type: 'date',
      sortable: true,
      width: 150,
    },
    {
      key: 'actions',
      label: this.translate.instant('actions'),
      type: 'actions',
      align: 'center',
      width: 150,
    },
  ]);

  agreementsActions = computed((): TableAction<AgreementWithShallowRelations>[] => [
    {
      label: this.translate.instant('view'),
      icon: '@tui.eye',
      color: 'primary',
      handler: (agreement) => this.onStudentView(agreement),
    },
  ]);

  seasonsColumns = computed((): TableColumn[] => [
    {
      key: 'name',
      label: this.translate.instant('name'),
      type: 'text',
      sortable: true,
      searchable: true,
    },
    {
      key: 'start_date',
      label: this.translate.instant('start_date'),
      type: 'text',
      sortable: true,
      width: 150,
    },
    {
      key: 'end_date',
      label: this.translate.instant('end_date'),
      type: 'text',
      sortable: true,
      width: 150,
    },
    {
      key: 'status',
      label: this.translate.instant('status'),
      type: 'status',
      sortable: true,
      width: 120,
    },
    {
      key: 'actions',
      label: this.translate.instant('actions'),
      type: 'actions',
      align: 'center',
      width: 150,
    },
  ]);

  seasonsActions = computed((): TableAction<Season>[] => [
    {
      label: this.translate.instant('view'),
      icon: '@tui.eye',
      color: 'primary',
      handler: (season) => this.onSeasonView(season),
    },
  ]);

  constructor() {
    this.roleFilterMap = {
      [this.translate.instant('all_roles')]: 'all',
      [this.translate.instant('students')]: 'student',
      [this.translate.instant('facilitators')]: 'facilitator',
      [this.translate.instant('companions')]: 'companion',
      [this.translate.instant('managers')]: 'manager',
      [this.translate.instant('assistants')]: 'assistant',
      [this.translate.instant('coordinators')]: 'coordinator',
      [this.translate.instant('directors')]: 'director',
    };

    this.roleFilter.setValue(this.translate.instant('all_roles'));
    this.roleFilterValue.set(this.translate.instant('all_roles'));

    this.roleFilter.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      this.roleFilterValue.set(value || '');
    });

    effect(() => {
      this.headquartersFacade.headquarterId.set(this.headquarterId());
      this.headquartersFacade.loadHeadquarterById();
    });

    effect(() => {
      this.headquarterData.set(this.headquartersFacade.headquarterByIdResource());
    });

    effect(() => {
      const hqId = this.headquarterId();
      if (hqId) {
        this.agreementsFacade.headquarterId.set(hqId);
        this.agreementsFacade.currentPage.set(1);
        this.agreementsFacade.agreements.reload();
      }
    });
  }

  onEdit(): void {
    const headquarter = this.headquarterData();
    if (!headquarter) return;

    const dialog = this.dialogService.open<HeadquarterFormData>(
      new PolymorpheusComponent(HeadquarterFormModalSmartComponent),
      {
        data: headquarter,
        dismissible: true,
        size: 'm',
      }
    );

    dialog.subscribe({
      next: async (result) => {
        if (result) {
          await this.handleUpdateHeadquarter(headquarter.id, result);
        }
      },
      error: (error) => {
        console.error('Edit headquarter dialog error:', error);
        this.notificationService.showError('dialog_error').subscribe();
      },
    });
  }

  private async handleUpdateHeadquarter(id: string, headquarterData: HeadquarterFormData): Promise<void> {
    this.isProcessing.set(true);

    try {
      await this.headquartersFacade.updateHeadquarter(id, headquarterData);
      this.notificationService
        .showSuccess('headquarter_updated_success', {
          translateParams: { name: headquarterData.name },
        })
        .subscribe();
      // Reload the data
      this.headquartersFacade.loadHeadquarterById();
    } catch (error) {
      console.error('Failed to update headquarter:', error);
      this.notificationService.showError('headquarter_update_error').subscribe();
    } finally {
      this.isProcessing.set(false);
    }
  }

  onWorkshopClick(workshop: ScheduledWorkshop): void {
    this.router.navigate(['/dashboard/workshops', workshop.id]);
  }

  onWorkshopView(workshop: ScheduledWorkshop): void {
    this.router.navigate(['/dashboard/workshops', workshop.id]);
  }

  onStudentView(student: AgreementWithShallowRelations): void {
    this.router.navigate(['/dashboard/agreements', student.id]);
  }

  onAgreementView(agreement: AgreementWithShallowRelations): void {
    this.router.navigate(['/dashboard/agreements', agreement.id]);
  }

  onSeasonView(season: Season): void {
    this.router.navigate(['/dashboard/seasons', season.id]);
  }

  retry(): void {
    this.headquartersFacade.loadHeadquarterById();
  }
}
