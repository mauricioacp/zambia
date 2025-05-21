import { ChangeDetectionStrategy, Component, EventEmitter, inject, input, Output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import {
  WorkshopFormData,
  WorkshopsFacadeService,
  WorkshopWithRelations,
} from '../../services/workshops-facade.service';

@Component({
  selector: 'z-workshop-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslatePipe],
  template: `
    <div class="p-6">
      @if (saveError()) {
        <div class="mb-4 border-l-4 border-red-400 bg-red-50 p-4 dark:border-red-500 dark:bg-red-900/30">
          <p class="text-red-700 dark:text-red-300">{{ saveError() }}</p>
        </div>
      }

      @if (saveSuccess()) {
        <div class="mb-4 border-l-4 border-green-400 bg-green-50 p-4 dark:border-green-500 dark:bg-green-900/30">
          <p class="text-green-700 dark:text-green-300">{{ 'workshop.saved.success' | translate }}</p>
        </div>
      }

      <form [formGroup]="workshopForm" (ngSubmit)="onSubmit()" class="space-y-6">
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
            workshopForm.get('master_workshop_type_id')?.invalid && workshopForm.get('master_workshop_type_id')?.touched
          ) {
            <p class="mt-1 text-sm text-red-600 dark:text-red-400">{{ 'workshop.type.required' | translate }}</p>
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
            <p class="mt-1 text-sm text-red-600 dark:text-red-400">{{ 'start.datetime.required' | translate }}</p>
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
            (click)="onCancel()"
            class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {{ 'cancel' | translate }}
          </button>
          <button
            type="submit"
            [disabled]="workshopForm.invalid || isSubmitting()"
            class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:bg-blue-700 dark:hover:bg-blue-800 dark:focus:ring-blue-600"
          >
            {{ 'save' | translate }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkshopFormSmartComponent {
  workshopsFacade = inject(WorkshopsFacadeService);
  translate = inject(TranslateService);
  formBuilder = inject(FormBuilder);

  // Inputs
  isEditMode = input<boolean>(false);
  workshop = input<WorkshopWithRelations | null>(null);
  saveError = input<string | null>(null);
  saveSuccess = input<boolean>(false);
  isSubmitting = input<boolean>(false);

  // Outputs
  @Output() formSubmit = new EventEmitter<WorkshopFormData>();
  @Output() cancelForm = new EventEmitter<void>();

  // Form
  workshopForm: FormGroup = this.formBuilder.group({
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

  constructor() {
    // Initialize form with workshop data if in edit mode
    const updateForm = computed(() => {
      const workshopData = this.workshop();
      if (workshopData) {
        this.updateFormWithWorkshopData(workshopData);
      }
    });

    // Load reference data for dropdowns
    this.workshopsFacade.loadWorkshopTypes();
    this.workshopsFacade.loadFacilitators();
    this.workshopsFacade.loadHeadquarters();
    this.workshopsFacade.loadSeasons();
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

  onSubmit() {
    if (this.workshopForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.workshopForm.controls).forEach((key) => {
        const control = this.workshopForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    const formData: WorkshopFormData = {
      ...this.workshopForm.value,
      // Convert local date-time strings to ISO strings
      start_datetime: new Date(this.workshopForm.value.start_datetime).toISOString(),
      end_datetime: new Date(this.workshopForm.value.end_datetime).toISOString(),
    };

    this.formSubmit.emit(formData);
  }

  onCancel() {
    this.cancelForm.emit();
  }
}
