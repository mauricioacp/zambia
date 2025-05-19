import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiIcon } from '@taiga-ui/core';

@Component({
  selector: 'z-sidebar-toggle',
  standalone: true,
  imports: [CommonModule, TuiIcon],
  template: `
    <button
      type="button"
      (click)="clicked.emit()"
      class="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-500 bg-blue-500 px-2 py-1 text-sm leading-5 font-semibold text-white hover:border-blue-600 hover:bg-blue-600 hover:text-white focus:ring-3 focus:ring-blue-400/50 active:border-blue-700 active:bg-blue-700 dark:focus:ring-blue-400/90"
    >
      <tui-icon [attr.aria-label]="icon() + ' icon'" [icon]="icon()" />
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarToggleComponent {
  clicked = output<void>();
  icon = input.required<string>();
  tailwindClass = input<string>('hidden lg:block');
}
