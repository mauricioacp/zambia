import { ChangeDetectionStrategy, Component, effect, inject, input, signal, WritableSignal } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  WorkshopFormData,
  WorkshopsFacadeService,
  WorkshopWithRelations,
} from '../../services/workshops-facade.service';
import { TuiSkeleton } from '@taiga-ui/kit';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TuiIcon } from '@taiga-ui/core';
import { ICONS } from '@zambia/util-constants';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'z-workshop-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, TuiSkeleton, NgClass, TranslatePipe, TuiIcon, FormsModule, ReactiveFormsModule],
  template: `
    <div class="w-full bg-gray-50 p-6 dark:bg-gray-900">
      <div class="mb-4">
        <a
          routerLink="/dashboard/workshops"
          class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          &larr; {{ 'back.to.workshops' | translate }}
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
        <!-- Edit mode -->
        @if (isEditing()) {
          <div class="rounded-lg bg-white p-6 shadow-md dark:bg-slate-800">
            <div class="border-b border-gray-200 px-6 py-5 dark:border-gray-700">
              <h3 class="text-xl font-semibold text-gray-800 dark:text-white">
                {{ 'edit.workshop' | translate }}
              </h3>
            </div>
            <div class="p-6">
              @if (workshopsFacade.saveError()) {
                <div class="mb-4 border-l-4 border-red-400 bg-red-50 p-4 dark:border-red-500 dark:bg-red-900/30">
                  <p class="text-red-700 dark:text-red-300">{{ workshopsFacade.saveError() }}</p>
                </div>
              }

              @if (workshopsFacade.saveSuccess()) {
                <div
                  class="mb-4 border-l-4 border-green-400 bg-green-50 p-4 dark:border-green-500 dark:bg-green-900/30"
                >
                  <p class="text-green-700 dark:text-green-300">{{ 'workshop.saved.success' | translate }}</p>
                </div>
              }

              <form [formGroup]="workshopForm" (ngSubmit)="onSaveWorkshop()" class="space-y-6">
                <!-- Name -->
                <div>
                  <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ 'workshop.name' | translate }} *
                  </label>
                  <input
                    type="text"
                    id="name"
                    formControlName="local_name"
                    class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400"
                    required
                  />
                  @if (workshopForm.get('local_name')?.invalid && workshopForm.get('local_name')?.touched) {
                    <p class="mt-1 text-sm text-red-600 dark:text-red-400">{{ 'name.required' | translate }}</p>
                  }
                </div>

                <!-- Workshop Type -->
                <div>
                  <label for="type" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ 'workshop.type' | translate }} *
                  </label>
                  <select
                    id="type"
                    formControlName="master_workshop_type_id"
                    class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400"
                    required
                  >
                    <option value="">{{ 'select.workshop.type' | translate }}</option>
                    @for (type of workshopsFacade.workshopTypesResource(); track type.id) {
                      <option [value]="type.id">{{ type.master_name }}</option>
                    }
                  </select>
                  @if (
                    workshopForm.get('master_workshop_type_id')?.invalid &&
                    workshopForm.get('master_workshop_type_id')?.touched
                  ) {
                    <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                      {{ 'workshop.type.required' | translate }}
                    </p>
                  }
                </div>

                <!-- Headquarter -->
                <div>
                  <label for="headquarter" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ 'headquarter' | translate }} *
                  </label>
                  <select
                    id="headquarter"
                    formControlName="headquarter_id"
                    class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400"
                    required
                  >
                    <option value="">{{ 'select.headquarter' | translate }}</option>
                    @for (hq of workshopsFacade.headquartersResource(); track hq.id) {
                      <option [value]="hq.id">{{ hq.name }}</option>
                    }
                  </select>
                  @if (workshopForm.get('headquarter_id')?.invalid && workshopForm.get('headquarter_id')?.touched) {
                    <p class="mt-1 text-sm text-red-600 dark:text-red-400">{{ 'headquarter.required' | translate }}</p>
                  }
                </div>

                <!-- Season -->
                <div>
                  <label for="season" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ 'season' | translate }} *
                  </label>
                  <select
                    id="season"
                    formControlName="season_id"
                    class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400"
                    required
                  >
                    <option value="">{{ 'select.season' | translate }}</option>
                    @for (season of workshopsFacade.seasonsResource(); track season.id) {
                      <option [value]="season.id">{{ season.name }}</option>
                    }
                  </select>
                  @if (workshopForm.get('season_id')?.invalid && workshopForm.get('season_id')?.touched) {
                    <p class="mt-1 text-sm text-red-600 dark:text-red-400">{{ 'season.required' | translate }}</p>
                  }
                </div>

                <!-- Facilitator -->
                <div>
                  <label for="facilitator" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ 'facilitator' | translate }} *
                  </label>
                  <select
                    id="facilitator"
                    formControlName="facilitator_id"
                    class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400"
                    required
                  >
                    <option value="">{{ 'select.facilitator' | translate }}</option>
                    @for (facilitator of workshopsFacade.facilitatorsResource(); track facilitator.user_id) {
                      <option [value]="facilitator.user_id">{{ facilitator.user_id }}</option>
                    }
                  </select>
                  @if (workshopForm.get('facilitator_id')?.invalid && workshopForm.get('facilitator_id')?.touched) {
                    <p class="mt-1 text-sm text-red-600 dark:text-red-400">{{ 'facilitator.required' | translate }}</p>
                  }
                </div>

                <!-- Start Date/Time -->
                <div>
                  <label for="start_datetime" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ 'start.datetime' | translate }} *
                  </label>
                  <input
                    type="datetime-local"
                    id="start_datetime"
                    formControlName="start_datetime"
                    class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400"
                    required
                  />
                  @if (workshopForm.get('start_datetime')?.invalid && workshopForm.get('start_datetime')?.touched) {
                    <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                      {{ 'start.datetime.required' | translate }}
                    </p>
                  }
                </div>

                <!-- End Date/Time -->
                <div>
                  <label for="end_datetime" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ 'end.datetime' | translate }} *
                  </label>
                  <input
                    type="datetime-local"
                    id="end_datetime"
                    formControlName="end_datetime"
                    class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400"
                    required
                  />
                  @if (workshopForm.get('end_datetime')?.invalid && workshopForm.get('end_datetime')?.touched) {
                    <p class="mt-1 text-sm text-red-600 dark:text-red-400">{{ 'end.datetime.required' | translate }}</p>
                  }
                </div>

                <!-- Location Details -->
                <div>
                  <label for="location_details" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ 'location.details' | translate }}
                  </label>
                  <textarea
                    id="location_details"
                    formControlName="location_details"
                    rows="3"
                    class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400"
                  ></textarea>
                </div>

                <!-- Status -->
                <div>
                  <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ 'status' | translate }} *
                  </label>
                  <select
                    id="status"
                    formControlName="status"
                    class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400"
                    required
                  >
                    <option value="active">{{ 'active' | translate }}</option>
                    <option value="inactive">{{ 'inactive' | translate }}</option>
                    <option value="completed">{{ 'completed' | translate }}</option>
                    <option value="cancelled">{{ 'cancelled' | translate }}</option>
                  </select>
                  @if (workshopForm.get('status')?.invalid && workshopForm.get('status')?.touched) {
                    <p class="mt-1 text-sm text-red-600 dark:text-red-400">{{ 'status.required' | translate }}</p>
                  }
                </div>

                <!-- Form actions -->
                <div class="flex justify-end space-x-3">
                  <button
                    type="button"
                    (click)="cancelEdit()"
                    class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    {{ 'cancel' | translate }}
                  </button>
                  <button
                    type="submit"
                    [disabled]="workshopForm.invalid || workshopsFacade.isDetailLoading()"
                    class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:bg-blue-700 dark:hover:bg-blue-800 dark:focus:ring-blue-600"
                  >
                    {{ 'save' | translate }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        }

        <!-- View mode -->
        @else {
          <!-- Page Headings: With Details and Actions -->
          <div class="mb-8 flex flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left">
            <!-- Heading -->
            <div>
              <h2 class="mb-2 text-2xl font-extrabold md:text-3xl">
                {{ workshopData()!.local_name }}
              </h2>
              <ul
                class="inline-flex list-none flex-wrap items-center justify-center gap-3 text-sm font-medium text-gray-600 md:justify-start dark:text-gray-400"
              >
                <li class="inline-flex items-center gap-1.5">
                  <tui-icon [icon]="ICONS.WORKSHOPS" class="opacity-50"></tui-icon>
                  <span>{{ workshopData()!.master_workshop_types?.master_name }}</span>
                </li>
                @if (workshopData()!.headquarters?.name) {
                  <li class="inline-flex items-center gap-1.5">
                    <tui-icon [icon]="ICONS.HEADQUARTERS" class="opacity-50"></tui-icon>
                    <span>{{ workshopData()!.headquarters?.name }}</span>
                  </li>
                }
                <li class="inline-flex items-center gap-1.5">
                  <tui-icon [icon]="'tuiIconCalendarLarge'" class="opacity-50"></tui-icon>
                  <span>{{ workshopData()!.start_datetime | date: 'medium' }}</span>
                </li>
                <li class="inline-flex items-center gap-1.5">
                  <tui-icon [icon]="'tuiIconActivity'" class="opacity-50"></tui-icon>
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
                </li>
              </ul>
            </div>
            <!-- END Heading -->

            <!-- Actions -->
            <div class="flex flex-none flex-wrap items-center justify-center gap-2 sm:justify-end">
              <button
                type="button"
                (click)="startEdit()"
                class="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm leading-5 font-semibold text-gray-800 hover:border-gray-300 hover:text-gray-900 hover:shadow-xs focus:ring-3 focus:ring-gray-300/25 active:border-gray-200 active:shadow-none dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-200 dark:focus:ring-gray-600/40 dark:active:border-gray-700"
              >
                <tui-icon [icon]="'tuiIconEdit'" class="opacity-50"></tui-icon>
                <span>{{ 'edit' | translate }}</span>
              </button>
            </div>
            <!-- END Actions -->
          </div>
          <!-- END Page Headings: With Details and Actions -->

          <div class="overflow-hidden rounded-lg bg-white shadow-md dark:bg-slate-800">
            <div class="border-b border-gray-200 px-6 py-5 dark:border-gray-700">
              <h3 class="text-xl font-semibold text-gray-800 dark:text-white">{{ 'workshop.details' | translate }}</h3>
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
                {{ 'information.about' | translate }} {{ workshopData()!.local_name }}
              </p>
            </div>
            <div class="border-t border-gray-200 dark:border-gray-700">
              <dl>
                <div class="grid grid-cols-3 gap-4 bg-gray-50 px-6 py-5 dark:bg-gray-900">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-300">
                    {{ 'workshop.name' | translate }}
                  </dt>
                  <dd class="col-span-2 text-sm text-gray-900 dark:text-gray-100">
                    {{ workshopData()!.local_name }}
                  </dd>
                </div>
                <div class="grid grid-cols-3 gap-4 bg-white px-6 py-5 dark:bg-slate-800">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-300">
                    {{ 'workshop.type' | translate }}
                  </dt>
                  <dd class="col-span-2 text-sm text-gray-900 dark:text-gray-100">
                    {{ workshopData()!.master_workshop_types?.master_name }}
                  </dd>
                </div>
                <div class="grid grid-cols-3 gap-4 bg-gray-50 px-6 py-5 dark:bg-gray-900">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-300">{{ 'start.time' | translate }}</dt>
                  <dd class="col-span-2 text-sm text-gray-900 dark:text-gray-100">
                    {{ workshopData()!.start_datetime | date: 'medium' }}
                  </dd>
                </div>
                <div class="grid grid-cols-3 gap-4 bg-white px-6 py-5 dark:bg-slate-800">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-300">{{ 'end.time' | translate }}</dt>
                  <dd class="col-span-2 text-sm text-gray-900 dark:text-gray-100">
                    {{ workshopData()!.end_datetime | date: 'medium' }}
                  </dd>
                </div>

                <div class="grid grid-cols-3 gap-4 bg-gray-50 px-6 py-5 dark:bg-gray-900">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-300">{{ 'headquarter' | translate }}</dt>
                  <dd class="col-span-2 text-sm text-gray-900 dark:text-gray-100">
                    {{ workshopData()!.headquarters?.name }}
                  </dd>
                </div>
                <div class="grid grid-cols-3 gap-4 bg-white px-6 py-5 dark:bg-slate-800">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-300">{{ 'season' | translate }}</dt>
                  <dd class="col-span-2 text-sm text-gray-900 dark:text-gray-100">
                    {{ workshopData()!.seasons?.name }}
                  </dd>
                </div>
                <div class="grid grid-cols-3 gap-4 bg-gray-50 px-6 py-5 dark:bg-gray-900">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-300">
                    {{ 'location.details' | translate }}
                  </dt>
                  <dd class="col-span-2 text-sm text-gray-900 dark:text-gray-100">
                    {{ workshopData()!.location_details || ('no.location.details' | translate) }}
                  </dd>
                </div>
                <div class="grid grid-cols-3 gap-4 bg-white px-6 py-5 dark:bg-slate-800">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-300">{{ 'status' | translate }}</dt>
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
                <div class="grid grid-cols-3 gap-4 bg-gray-50 px-6 py-5 dark:bg-gray-900">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-300">{{ 'facilitator' | translate }}</dt>
                  <dd class="col-span-2 text-sm text-gray-900 dark:text-gray-100">
                    {{ workshopData()!.facilitator_id }}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        }
      } @else if (workshopsFacade.detailLoadingError()) {
        <div class="rounded border-l-4 border-red-400 bg-red-50 p-4 dark:border-red-500 dark:bg-red-900/30">
          <p class="text-red-700 dark:text-red-300">
            {{ 'failed.to.load.workshop' | translate }}: {{ workshopsFacade.detailLoadingError() }}
          </p>
        </div>
      } @else {
        <div class="rounded border-l-4 border-red-400 bg-red-50 p-4 dark:border-red-500 dark:bg-red-900/30">
          <p class="text-red-700 dark:text-red-300">{{ 'workshop.not.found' | translate }}</p>
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkshopDetailSmartComponent {
  workshopsFacade = inject(WorkshopsFacadeService);
  translate = inject(TranslateService);
  formBuilder = inject(FormBuilder);

  workshopId = input.required<string>();
  workshopData: WritableSignal<WorkshopWithRelations | null> = signal(null);
  ICONS = ICONS;
  isEditing = signal<boolean>(false);
  workshopForm: FormGroup;

  constructor() {
    // Initialize form
    this.workshopForm = this.formBuilder.group({
      id: [''],
      local_name: ['', Validators.required],
      master_workshop_type_id: ['', Validators.required],
      facilitator_id: ['', Validators.required],
      headquarter_id: ['', Validators.required],
      season_id: ['', Validators.required],
      start_datetime: ['', Validators.required],
      end_datetime: ['', Validators.required],
      location_details: [''],
      status: ['active', Validators.required],
    });

    // Load workshop data
    effect(() => {
      this.workshopsFacade.workshopId.set(this.workshopId());
      this.workshopsFacade.loadWorkshopById();
    });

    effect(() => {
      const workshop = this.workshopsFacade.workshopByIdResource();
      this.workshopData.set(workshop);

      // If we have workshop data and we're editing, update form
      if (workshop && this.isEditing()) {
        this.updateFormWithWorkshopData(workshop);
      }
    });

    // Load related data for editing
    this.workshopsFacade.loadWorkshopTypes();
    this.workshopsFacade.loadFacilitators();
    this.workshopsFacade.loadHeadquarters();
    this.workshopsFacade.loadSeasons();
  }

  startEdit() {
    const workshop = this.workshopData();
    if (workshop) {
      this.updateFormWithWorkshopData(workshop);
      this.isEditing.set(true);
    }
  }

  cancelEdit() {
    this.isEditing.set(false);
    this.workshopsFacade.saveError.set(null);
    this.workshopsFacade.saveSuccess.set(false);
  }

  updateFormWithWorkshopData(workshop: WorkshopWithRelations) {
    // Format dates for datetime-local input
    const startDate = new Date(workshop.start_datetime);
    const endDate = new Date(workshop.end_datetime);

    const formatDateForInput = (date: Date) => {
      return date.toISOString().slice(0, 16); // Format as YYYY-MM-DDTHH:MM
    };

    this.workshopForm.patchValue({
      id: workshop.id,
      local_name: workshop.local_name,
      master_workshop_type_id: workshop.master_workshop_type_id,
      facilitator_id: workshop.facilitator_id,
      headquarter_id: workshop.headquarter_id,
      season_id: workshop.season_id,
      start_datetime: formatDateForInput(startDate),
      end_datetime: formatDateForInput(endDate),
      location_details: workshop.location_details,
      status: workshop.status,
    });
  }

  async onSaveWorkshop() {
    if (this.workshopForm.invalid) {
      return;
    }

    const formData: WorkshopFormData = {
      ...this.workshopForm.value,
      // Convert local date-time strings to ISO strings
      start_datetime: new Date(this.workshopForm.value.start_datetime).toISOString(),
      end_datetime: new Date(this.workshopForm.value.end_datetime).toISOString(),
    };

    const result = await this.workshopsFacade.updateWorkshop(formData);

    if (result) {
      // Stay in edit mode so user can see success message
      // They can manually cancel to return to view mode
    }
  }
}
