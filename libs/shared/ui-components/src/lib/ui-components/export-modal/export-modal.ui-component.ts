import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiDialogContext, TuiTitle } from '@taiga-ui/core';
import { TranslatePipe } from '@ngx-translate/core';
import { POLYMORPHEUS_CONTEXT } from '@taiga-ui/polymorpheus';
import { TuiRadioList } from '@taiga-ui/kit';

export type ExportOptions = 'csv' | 'excel';

@Component({
  selector: 'z-export-modal',
  standalone: true,
  imports: [ReactiveFormsModule, TuiButton, TranslatePipe, TuiRadioList, FormsModule, TuiTitle],
  template: `
    <div class="p-6">
      <h3 class="mb-4 text-xl font-bold text-gray-800 dark:text-white">
        {{ 'export_format' | translate }}
      </h3>

      <div class="mb-6 space-y-4">
        <form [formGroup]="form">
          <tui-radio-list formControlName="format" [itemContent]="content" [items]="exportOptions" />
          <ng-template #content let-data>
            <span tuiTitle>
              {{ data }}
            </span>
          </ng-template>
        </form>
      </div>

      <!-- Actions -->
      <div class="flex justify-end space-x-3">
        <button tuiButton appearance="secondary" size="m" (click)="onCancel()">
          {{ 'cancel' | translate }}
        </button>
        <button
          tuiButton
          appearance="primary"
          size="m"
          (click)="onExport()"
          class="bg-emerald-600 hover:bg-emerald-700"
        >
          {{ 'export' | translate }}
        </button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExportModalUiComponent {
  private readonly context = inject<TuiDialogContext<ExportOptions | undefined>>(POLYMORPHEUS_CONTEXT);
  protected readonly exportOptions = ['csv', 'excel'] as const;

  protected readonly form = new FormGroup({
    format: new FormControl(this.exportOptions[0], Validators.required),
  });

  onCancel(): void {
    this.context.completeWith(undefined);
  }

  onExport(): void {
    const format = this.form.value.format;
    if (format) {
      this.context.completeWith(format);
    }
  }
}
