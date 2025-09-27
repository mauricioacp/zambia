import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { TuiIcon } from '@taiga-ui/core';

@Component({
  selector: 'z-sidebar-header',
  imports: [TuiIcon],
  template: `
    <div
      class="flex h-16 w-full flex-none items-center justify-between px-4 shadow-xs lg:justify-center dark:bg-gray-600/25"
    >
      <h2 class="grow text-sm font-semibold">{{ title() }}</h2>
      <div class="flex-none lg:hidden">
        <button
          (click)="closeClicked.emit()"
          type="button"
          class="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-300 hover:border-gray-500 hover:text-gray-100 focus:ring-2 focus:ring-gray-500 focus:outline-none active:border-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-200 dark:focus:ring-gray-600/40 dark:active:border-gray-700"
          aria-label="Close sidebar"
        >
          <tui-icon [attr.aria-label]="'Close sidebar icon'" [icon]="icon()" />
        </button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarHeaderUiComponent {
  title = input<string>('');
  icon = input<string>('x');
  closeClicked = output();
}
