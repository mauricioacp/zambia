import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'z-form-field',
  standalone: true,
  imports: [TranslatePipe, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-1">
      <label [for]="id" class="inline-block text-sm font-medium">
        {{ label | translate }}
      </label>
      <input
        [type]="type"
        [id]="id"
        [formControl]="control"
        [placeholder]="placeholder"
        class="border-color bg-primary text-primary placeholder-secondary focus:border-focus focus:ring-focus/50 block w-full rounded-lg border px-5 py-3 leading-6 focus:ring-3 disabled:opacity-50"
        [class.border-red-500]="showError"
      />
      @if (showError) {
        <span class="mt-1 text-xs text-red-300">
          {{ errorMessage }}
        </span>
      }
    </div>
  `,
})
export class FormFieldComponent {
  @Input() control!: FormControl;
  @Input() label!: string;
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() errorMessage = '';
  @Input() id = crypto.randomUUID();

  get showError(): boolean {
    return this.control.touched && this.control.invalid;
  }
}
