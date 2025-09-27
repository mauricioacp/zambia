import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { TuiIcon } from '@taiga-ui/core';

@Component({
  selector: 'z-main-sidebar-nav-item',
  imports: [RouterLink, RouterLinkActive, TranslatePipe, TuiIcon],
  template: ` <a
    routerLink="{{ route() }}"
    class="group flex items-center gap-2 rounded-lg border border-transparent px-2.5 text-sm font-medium text-gray-800 hover:bg-blue-50 hover:text-gray-900 active:border-blue-100 dark:text-gray-200 dark:hover:bg-gray-700/75 dark:hover:text-white dark:active:border-gray-600"
    routerLinkActive="border-blue-100 bg-blue-50 text-gray-900 dark:border-transparent dark:bg-gray-700/75 dark:text-white"
    (click)="itemClicked.emit()"
  >
    <span
      class="flex flex-none items-center text-gray-400 group-hover:text-blue-500 dark:text-gray-500 dark:group-hover:text-gray-300"
      routerLinkActive="text-blue-500 dark:text-blue-300'"
    >
      <tui-icon [attr.aria-label]="icon() + ' icon'" [icon]="icon()" />
    </span>
    <span class="grow py-2">{{ text() | translate }}</span>
    @if (badgeNumber()) {
      <span
        class="inline-flex rounded-full border border-blue-200 bg-blue-100 px-1.5 py-0.5 text-xs leading-4 font-semibold text-blue-700 dark:border-blue-700 dark:bg-blue-700 dark:text-blue-50"
      >
        {{ badgeNumber() }}
      </span>
    }
  </a>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainSidebarNavItemUiComponent {
  icon = input.required<string>();
  text = input.required<string>();
  route = input.required<string>();
  badgeNumber = input<number>();
  itemClicked = output();
}
