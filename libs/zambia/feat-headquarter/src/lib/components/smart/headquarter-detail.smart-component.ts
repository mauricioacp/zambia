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
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  HeadquartersFacadeService,
  HeadquarterWithRelations,
  ScheduledWorkshop,
  AgreementWithRole,
  HeadquarterFormData,
  Season,
} from '../../services/headquarters-facade.service';
import { HeadquarterFormModalSmartComponent } from './headquarter-form-modal.smart-component';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { NotificationService } from '@zambia/data-access-generic';
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
    <div class="min-h-screen bg-slate-800">
      <!-- Header Section -->
      <div class="bg-slate-900 shadow-xl">
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
                  <h1 class="mb-1 text-3xl font-bold text-white">
                    {{ headquarterData()!.name }}
                  </h1>
                  <p class="text-slate-400">{{ 'headquarter_detail_subtitle' | translate }}</p>
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
          <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
            @for (i of [1, 2, 3, 4]; track i) {
              <div class="animate-pulse rounded-xl bg-slate-900 p-6">
                <div class="mb-3 h-4 w-24 rounded bg-slate-700"></div>
                <div class="h-8 w-32 rounded bg-slate-700"></div>
              </div>
            }
          </div>
          <div class="animate-pulse rounded-xl bg-slate-900 p-6">
            <div class="mb-4 h-6 w-48 rounded bg-slate-700"></div>
            <div class="space-y-3">
              @for (i of [1, 2, 3]; track i) {
                <div class="h-12 rounded bg-slate-700"></div>
              }
            </div>
          </div>
        } @else if (headquarterData()) {
          <!-- Enhanced Metrics Cards -->
          <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-6">
            <!-- Country Card -->
            <div
              class="rounded-xl border border-slate-700 bg-slate-900 p-6 transition-all duration-300 hover:border-slate-600 hover:shadow-lg"
            >
              <div class="mb-3 flex items-center justify-between">
                <span class="text-sm font-medium tracking-wider text-slate-400 uppercase">
                  {{ 'country' | translate }}
                </span>
                <tui-icon [icon]="ICONS.COUNTRIES" class="text-emerald-500"></tui-icon>
              </div>
              <p class="text-xl font-bold text-white">
                {{ headquarterData()!.countries?.name || ('no_country' | translate) }}
              </p>
              @if (headquarterData()!.countries?.code) {
                <p class="font-mono text-sm text-slate-400">
                  {{ headquarterData()!.countries?.code }}
                </p>
              }
            </div>

            <!-- Status Card -->
            <div
              class="rounded-xl border border-slate-700 bg-slate-900 p-6 transition-all duration-300 hover:border-slate-600 hover:shadow-lg"
            >
              <div class="mb-3 flex items-center justify-between">
                <span class="text-sm font-medium tracking-wider text-slate-400 uppercase">
                  {{ 'status' | translate }}
                </span>
                <tui-icon icon="@tui.activity" class="text-green-500"></tui-icon>
              </div>
              <div
                class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold"
                [class]="
                  headquarterData()!.status === 'active'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                "
              >
                <tui-icon
                  [icon]="headquarterData()!.status === 'active' ? '@tui.check-circle' : '@tui.x-circle'"
                  class="text-xs"
                ></tui-icon>
                {{ headquarterData()!.status || '' | translate }}
              </div>
            </div>

            <!-- Total Students Card -->
            <div
              class="rounded-xl border border-slate-700 bg-slate-900 p-6 transition-all duration-300 hover:border-slate-600 hover:shadow-lg"
            >
              <div class="mb-3 flex items-center justify-between">
                <span class="text-sm font-medium tracking-wider text-slate-400 uppercase">
                  {{ 'total_students' | translate }}
                </span>
                <tui-icon icon="@tui.users" class="text-blue-500"></tui-icon>
              </div>
              <p class="text-2xl font-bold text-white">
                {{ studentMetrics().total }}
              </p>
              <p class="text-xs text-slate-400">
                Current: {{ studentMetrics().currentEdition }} | Graduated: {{ studentMetrics().graduated }}
              </p>
            </div>

            <!-- Active Students Card -->
            <div
              class="rounded-xl border border-slate-700 bg-slate-900 p-6 transition-all duration-300 hover:border-slate-600 hover:shadow-lg"
            >
              <div class="mb-3 flex items-center justify-between">
                <span class="text-sm font-medium tracking-wider text-slate-400 uppercase">
                  {{ 'active_students' | translate }}
                </span>
                <tui-icon icon="@tui.check-circle" class="text-green-500"></tui-icon>
              </div>
              <p class="text-2xl font-bold text-white">
                {{ studentMetrics().active }}
              </p>
              <p class="text-xs text-slate-400">
                Prospects: {{ studentMetrics().prospects }} | Inactive: {{ studentMetrics().inactive }}
              </p>
            </div>

            <!-- Facilitators Card -->
            <div
              class="rounded-xl border border-slate-700 bg-slate-900 p-6 transition-all duration-300 hover:border-slate-600 hover:shadow-lg"
            >
              <div class="mb-3 flex items-center justify-between">
                <span class="text-sm font-medium tracking-wider text-slate-400 uppercase">
                  {{ 'facilitators' | translate }}
                </span>
                <tui-icon icon="@tui.presentation" class="text-purple-500"></tui-icon>
              </div>
              <p class="text-2xl font-bold text-white">
                {{ collaboratorMetrics().facilitators }}
              </p>
              <p class="text-xs text-slate-400">
                {{ 'teaching_staff' | translate }}
              </p>
            </div>

            <!-- Staff Overview Card -->
            <div
              class="rounded-xl border border-slate-700 bg-slate-900 p-6 transition-all duration-300 hover:border-slate-600 hover:shadow-lg"
            >
              <div class="mb-3 flex items-center justify-between">
                <span class="text-sm font-medium tracking-wider text-slate-400 uppercase">
                  {{ 'staff_overview' | translate }}
                </span>
                <tui-icon icon="@tui.users" class="text-orange-500"></tui-icon>
              </div>
              <div class="space-y-1">
                <div class="flex justify-between text-sm">
                  <span class="text-slate-400">{{ 'companions' | translate }}</span>
                  <span class="font-semibold text-white">{{ collaboratorMetrics().companions }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-slate-400">{{ 'managers' | translate }}</span>
                  <span class="font-semibold text-white">{{ collaboratorMetrics().managers }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-slate-400">{{ 'assistants' | translate }}</span>
                  <span class="font-semibold text-white">{{ collaboratorMetrics().assistants }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Enhanced Contact Information Section -->
          @if (managerInfo() || generalContactInfo()) {
            <div class="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <!-- Manager Information -->
              @if (managerInfo()) {
                <div class="overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-xl">
                  <div class="border-b border-slate-700 px-6 py-4">
                    <h3 class="flex items-center gap-3 text-lg font-bold text-white">
                      <tui-icon icon="@tui.user" class="text-blue-500"></tui-icon>
                      {{ 'headquarter_manager' | translate }}
                    </h3>
                  </div>
                  <div class="space-y-4 p-6">
                    <div class="flex items-center gap-3">
                      <tui-icon icon="@tui.user" class="text-slate-400"></tui-icon>
                      <div>
                        <p class="font-semibold text-white">{{ managerInfo()!.name }}</p>
                        <p class="text-sm text-slate-400">{{ 'manager' | translate }}</p>
                      </div>
                    </div>
                    @if (managerInfo()!.email) {
                      <div class="flex items-center gap-3">
                        <tui-icon icon="@tui.mail" class="text-slate-400"></tui-icon>
                        <a href="mailto:{{ managerInfo()!.email }}" class="text-blue-400 hover:text-blue-300">
                          {{ managerInfo()!.email }}
                        </a>
                      </div>
                    }
                    @if (managerInfo()!.phone) {
                      <div class="flex items-center gap-3">
                        <tui-icon icon="@tui.phone" class="text-slate-400"></tui-icon>
                        <a href="tel:{{ managerInfo()!.phone }}" class="text-blue-400 hover:text-blue-300">
                          {{ managerInfo()!.phone }}
                        </a>
                      </div>
                    }
                  </div>
                </div>
              }

              <!-- General Contact Information -->
              @if (generalContactInfo()) {
                <div class="overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-xl">
                  <div class="border-b border-slate-700 px-6 py-4">
                    <h3 class="flex items-center gap-3 text-lg font-bold text-white">
                      <tui-icon icon="@tui.phone" class="text-green-500"></tui-icon>
                      {{ 'general_contact' | translate }}
                    </h3>
                  </div>
                  <div class="space-y-4 p-6">
                    @if (generalContactInfo()!.generalEmail) {
                      <div class="flex items-center gap-3">
                        <tui-icon icon="@tui.mail" class="text-slate-400"></tui-icon>
                        <a
                          href="mailto:{{ generalContactInfo()!.generalEmail }}"
                          class="text-blue-400 hover:text-blue-300"
                        >
                          {{ generalContactInfo()!.generalEmail }}
                        </a>
                      </div>
                    }
                    @if (generalContactInfo()!.generalPhone) {
                      <div class="flex items-center gap-3">
                        <tui-icon icon="@tui.phone" class="text-slate-400"></tui-icon>
                        <a
                          href="tel:{{ generalContactInfo()!.generalPhone }}"
                          class="text-blue-400 hover:text-blue-300"
                        >
                          {{ generalContactInfo()!.generalPhone }}
                        </a>
                      </div>
                    }
                    @if (generalContactInfo()!.website) {
                      <div class="flex items-center gap-3">
                        <tui-icon icon="@tui.globe" class="text-slate-400"></tui-icon>
                        <a
                          href="{{ generalContactInfo()!.website }}"
                          target="_blank"
                          class="text-blue-400 hover:text-blue-300"
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
                      <div class="border-t border-slate-700 pt-2">
                        <p class="mb-2 text-sm font-semibold text-slate-400">{{ 'social_media' | translate }}</p>
                        <div class="flex gap-3">
                          @if (generalContactInfo()!.socialMedia!.facebook) {
                            <a
                              href="{{ generalContactInfo()!.socialMedia!.facebook }}"
                              target="_blank"
                              class="text-blue-400 hover:text-blue-300"
                            >
                              <tui-icon icon="@tui.facebook" class="text-lg"></tui-icon>
                            </a>
                          }
                          @if (generalContactInfo()!.socialMedia!.instagram) {
                            <a
                              href="{{ generalContactInfo()!.socialMedia!.instagram }}"
                              target="_blank"
                              class="text-pink-400 hover:text-pink-300"
                            >
                              <tui-icon icon="@tui.instagram" class="text-lg"></tui-icon>
                            </a>
                          }
                          @if (generalContactInfo()!.socialMedia!.twitter) {
                            <a
                              href="{{ generalContactInfo()!.socialMedia!.twitter }}"
                              target="_blank"
                              class="text-blue-400 hover:text-blue-300"
                            >
                              <tui-icon icon="@tui.twitter" class="text-lg"></tui-icon>
                            </a>
                          }
                        </div>
                      </div>
                    }
                    @if (generalContactInfo()!.notes) {
                      <div class="border-t border-slate-700 pt-2">
                        <p class="mb-2 text-sm font-semibold text-slate-400">{{ 'notes' | translate }}</p>
                        <p class="text-sm text-slate-300">{{ generalContactInfo()!.notes }}</p>
                      </div>
                    }
                  </div>
                </div>
              }
            </div>
          }

          <!-- Address Section -->
          @if (headquarterData()!.address) {
            <div class="mb-8 overflow-hidden rounded-xl bg-slate-900 shadow-xl">
              <div class="border-b border-slate-700 px-6 py-4">
                <h2 class="flex items-center gap-3 text-xl font-bold text-white">
                  <tui-icon icon="@tui.map-pin" class="text-red-500"></tui-icon>
                  {{ 'address' | translate }}
                </h2>
              </div>
              <div class="p-6">
                <p class="text-slate-300">{{ headquarterData()!.address }}</p>
              </div>
            </div>
          }

          <!-- Workshops Section -->
          @if (headquarterData()!.scheduled_workshops?.length) {
            <div class="mb-8 overflow-hidden rounded-xl bg-slate-900 shadow-xl">
              <div class="border-b border-slate-700 px-6 py-4">
                <h2 class="flex items-center gap-3 text-xl font-bold text-white">
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
            <div class="mb-8 overflow-hidden rounded-xl bg-slate-900 shadow-xl">
              <div class="border-b border-slate-700 px-6 py-4">
                <div class="flex items-center justify-between">
                  <h2 class="flex items-center gap-3 text-xl font-bold text-white">
                    <tui-icon icon="@tui.file-text" class="text-green-500"></tui-icon>
                    {{ 'all_agreements' | translate }}
                  </h2>
                  <!-- Role Filter -->
                  <div class="w-48">
                    <label for="roleFilterSelect" class="mb-2 block text-sm font-medium text-slate-400">
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
                [loading]="false"
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
                <div class="overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-xl lg:col-span-1">
                  <div class="border-b border-slate-700 px-6 py-4">
                    <h3 class="flex items-center gap-3 text-lg font-bold text-white">
                      <tui-icon icon="@tui.calendar" class="text-amber-500"></tui-icon>
                      {{ 'current_season' | translate }}
                    </h3>
                  </div>
                  <div class="space-y-4 p-6">
                    <div>
                      <p class="text-xl font-bold text-white">{{ currentSeason()!.name }}</p>
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
                      <div class="space-y-2 border-t border-slate-700 pt-3">
                        @if (currentSeason()!.start_date) {
                          <div class="flex items-center gap-2 text-sm">
                            <span class="text-slate-400">{{ 'start_date' | translate }}:</span>
                            <span class="font-medium text-white">{{ currentSeason()!.start_date }}</span>
                          </div>
                        }
                        @if (currentSeason()!.end_date) {
                          <div class="flex items-center gap-2 text-sm">
                            <span class="text-slate-400">{{ 'end_date' | translate }}:</span>
                            <span class="font-medium text-white">{{ currentSeason()!.end_date }}</span>
                          </div>
                        }
                      </div>
                    }
                  </div>
                </div>
              }

              <!-- All Seasons Table -->
              <div class="overflow-hidden rounded-xl bg-slate-900 shadow-xl lg:col-span-2">
                <div class="border-b border-slate-700 px-6 py-4">
                  <h2 class="flex items-center gap-3 text-xl font-bold text-white">
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
            <div class="mb-8 overflow-hidden rounded-xl bg-slate-900 shadow-xl">
              <div class="border-b border-slate-700 px-6 py-4">
                <h2 class="flex items-center gap-3 text-xl font-bold text-white">
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
            <tui-notification status="error" class="border border-red-500/20 bg-red-500/10">
              <div class="py-8 text-center">
                <tui-icon icon="@tui.alert-triangle" class="mb-4 text-4xl text-red-500"></tui-icon>
                <h3 class="mb-2 text-xl font-bold text-white">{{ 'error_loading_headquarter' | translate }}</h3>
                <p class="mb-6 text-slate-400">{{ headquartersFacade.detailLoadingError() }}</p>
                <button tuiButton appearance="destructive" size="m" (click)="retry()">
                  {{ 'retry' | translate }}
                </button>
              </div>
            </tui-notification>
          </div>
        } @else if (!headquarterData() && !headquartersFacade.isDetailLoading()) {
          <!-- Not Found State -->
          <div class="mx-auto max-w-md">
            <tui-notification status="warning" class="border border-yellow-500/20 bg-yellow-500/10">
              <div class="py-8 text-center">
                <tui-icon icon="@tui.help-circle" class="mb-4 text-4xl text-yellow-500"></tui-icon>
                <h3 class="mb-2 text-xl font-bold text-white">{{ 'headquarter.not.found' | translate }}</h3>
                <p class="mb-6 text-slate-400">{{ 'headquarter_not_found_description' | translate }}</p>
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
  private router = inject(Router);
  private translate = inject(TranslateService);
  private dialogService = inject(TuiDialogService);
  private notificationService = inject(NotificationService);

  headquarterId = input.required<string>();
  headquarterData: WritableSignal<HeadquarterWithRelations | null> = signal(null);
  isProcessing = signal(false);
  roleFilter = new FormControl('');

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


  studentMetrics = computed(() => {
    const agreements = this.headquarterData()?.agreements || [];

    return {
      total: agreements.length,
      active: agreements.filter((a) => a.status === 'active').length,
      prospects: agreements.filter((a) => a.status === 'prospect').length,
      inactive: agreements.filter((a) => a.status === 'inactive').length,
      graduated: agreements.filter((a) => a.status === 'graduated').length,
      currentEdition: agreements.filter((a) => a.status !== 'graduated').length,
    };
  });

  // Enhanced collaborator metrics (based on role types)
  collaboratorMetrics = computed(() => {
    const agreements = this.headquarterData()?.agreements || [];

    return {
      total: agreements.length,
      facilitators: agreements.filter((a) => a.role?.code?.toLowerCase().includes('facilitator')).length,
      companions: agreements.filter((a) => a.role?.code?.toLowerCase().includes('companion')).length,
      managers: agreements.filter((a) => a.role?.code?.toLowerCase().includes('manager')).length,
      assistants: agreements.filter((a) => a.role?.code?.toLowerCase().includes('assistant')).length,
      coordinators: agreements.filter((a) => a.role?.code?.toLowerCase().includes('coordinator')).length,
      directors: agreements.filter((a) => a.role?.code?.toLowerCase().includes('director')).length,
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
    const agreements = this.headquarterData()?.agreements || [];
    const selectedDisplayText = this.roleFilter.value || '';

    // Map the display text to the filter value
    const filter = this.roleFilterMap[selectedDisplayText] || 'all';

    if (!filter || filter === 'all') {
      return agreements;
    }

    return agreements.filter((agreement) => {
      const roleCode = agreement.role?.code?.toLowerCase() || '';

      switch (filter) {
        case 'student':
          return roleCode.includes('student') || roleCode.includes('alumno');
        case 'facilitator':
          return roleCode.includes('facilitator');
        case 'companion':
          return roleCode.includes('companion');
        case 'manager':
          return roleCode.includes('manager');
        case 'assistant':
          return roleCode.includes('assistant');
        case 'coordinator':
          return roleCode.includes('coordinator');
        case 'director':
          return roleCode.includes('director');
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
      type: 'text',
      sortable: true,
    },
    {
      key: 'end_datetime',
      label: this.translate.instant('end_date'),
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
      type: 'text',
      sortable: true,
      width: 150,
    },
  ]);

  studentsActions = computed((): TableAction<AgreementWithRole>[] => [
    {
      label: this.translate.instant('view'),
      icon: '@tui.eye',
      color: 'primary',
      handler: (student) => this.onStudentView(student),
    },
  ]);

  // Agreements table columns
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
      type: 'text',
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

  // Agreements table actions
  agreementsActions = computed((): TableAction<AgreementWithRole>[] => [
    {
      label: this.translate.instant('view'),
      icon: '@tui.eye',
      color: 'primary',
      handler: (agreement) => this.onAgreementView(agreement),
    },
  ]);

  // Seasons table columns
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

  // Seasons table actions
  seasonsActions = computed((): TableAction<Season>[] => [
    {
      label: this.translate.instant('view'),
      icon: '@tui.eye',
      color: 'primary',
      handler: (season) => this.onSeasonView(season),
    },
  ]);

  constructor() {
    // Initialize role filter map and default value
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

    // Set default value for role filter
    this.roleFilter.setValue(this.translate.instant('all_roles'));

    effect(() => {
      this.headquartersFacade.headquarterId.set(this.headquarterId());
      this.headquartersFacade.loadHeadquarterById();
    });

    effect(() => {
      this.headquarterData.set(this.headquartersFacade.headquarterByIdResource());
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

  onStudentView(student: AgreementWithRole): void {
    this.router.navigate(['/dashboard/agreements', student.id]);
  }

  onAgreementView(agreement: AgreementWithRole): void {
    this.router.navigate(['/dashboard/agreements', agreement.id]);
  }

  onSeasonView(season: Season): void {
    this.router.navigate(['/dashboard/seasons', season.id]);
  }

  retry(): void {
    this.headquartersFacade.loadHeadquarterById();
  }
}
