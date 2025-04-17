import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'z-sidebar-nav-section-header',
  imports: [CommonModule],
  template: `<div
    class="px-3 pt-5 pb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase dark:text-gray-500"
  >
    {{ text() }}
  </div>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarNavSectionHeaderUiComponent {
  text = input.required<string>();
}
