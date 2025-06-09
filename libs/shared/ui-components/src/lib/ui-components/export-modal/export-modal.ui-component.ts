import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TuiButton, TuiDialogContext } from '@taiga-ui/core';
import { TranslatePipe } from '@ngx-translate/core';
import { POLYMORPHEUS_CONTEXT } from '@taiga-ui/polymorpheus';

export interface ExportOptions {
  format: 'csv' | 'excel';
  includeHeaders: boolean;
}

@Component({
  selector: 'z-export-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TuiButton, TranslatePipe],
  template: `
    <div class="p-6">
      <h3 class="mb-4 text-xl font-bold text-gray-800 dark:text-white">
        {{ 'export_data' | translate }}
      </h3>

      <div class="mb-6 space-y-4">
        <!-- Format Selection -->
        <div>
          <span class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ 'export_format' | translate }}
          </span>
          <div class="space-y-2">
            <label tuiRadio class="flex items-center" for="format-csv">
              <input type="radio" [formControl]="formatControl" value="csv" name="format" id="format-csv" />
              <span class="ml-2">CSV ({{ 'comma_separated_values' | translate }})</span>
            </label>
            <label tuiRadio class="flex items-center" for="format-excel">
              <input type="radio" [formControl]="formatControl" value="excel" name="format" id="format-excel" />
              <span class="ml-2">Excel (XLSX)</span>
            </label>
          </div>
        </div>

        <!-- Include Headers Option -->
        <div>
          <label class="flex items-center" for="include-headers">
            <input
              type="checkbox"
              [formControl]="includeHeadersControl"
              class="mr-2 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              id="include-headers"
            />
            <span class="text-sm text-gray-700 dark:text-gray-300">
              {{ 'include_column_headers' | translate }}
            </span>
          </label>
        </div>
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

  formatControl = new FormControl<'csv' | 'excel'>('csv', { nonNullable: true });
  includeHeadersControl = new FormControl(true, { nonNullable: true });

  onCancel(): void {
    this.context.completeWith(undefined);
  }

  onExport(): void {
    const options: ExportOptions = {
      format: this.formatControl.value,
      includeHeaders: this.includeHeadersControl.value,
    };
    this.context.completeWith(options);
  }
}
