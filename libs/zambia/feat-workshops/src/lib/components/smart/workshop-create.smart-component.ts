import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WorkshopFormSmartComponent } from './workshop-form.smart-component';
import { WorkshopFormData, WorkshopsFacadeService } from '../../services/workshops-facade.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'z-workshop-create',
  standalone: true,
  imports: [CommonModule, RouterModule, WorkshopFormSmartComponent, TranslatePipe],
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

      <div class="rounded-lg bg-white shadow-md dark:bg-slate-800">
        <div class="border-b border-gray-200 px-6 py-5 dark:border-gray-700">
          <h3 class="text-xl font-semibold text-gray-800 dark:text-white">
            {{ 'create.new.workshop' | translate }}
          </h3>
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
            {{ 'create.workshop.description' | translate }}
          </p>
        </div>

        <z-workshop-form
          [saveError]="workshopsFacade.saveError()"
          [saveSuccess]="workshopsFacade.saveSuccess()"
          [isSubmitting]="isSubmitting"
          (formSubmit)="onCreateWorkshop($event)"
          (cancelForm)="onCancel()"
        ></z-workshop-form>
      </div>
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
export class WorkshopCreateSmartComponent {
  workshopsFacade = inject(WorkshopsFacadeService);
  translate = inject(TranslateService);
  router = inject(Router);

  isSubmitting = false;

  async onCreateWorkshop(formData: WorkshopFormData) {
    this.isSubmitting = true;

    try {
      const result = await this.workshopsFacade.createWorkshop(formData);

      if (result) {
        // Navigate to the new workshop after a short delay to show the success message
        setTimeout(() => {
          this.router.navigate(['/dashboard/workshops', result.id]);
        }, 1500);
      }
    } finally {
      this.isSubmitting = false;
    }
  }

  onCancel() {
    this.router.navigate(['/dashboard/workshops']);
  }
}
