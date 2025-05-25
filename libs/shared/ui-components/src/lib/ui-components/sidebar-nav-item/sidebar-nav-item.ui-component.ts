import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TuiIcon } from '@taiga-ui/core';
import { TuiTooltip } from '@taiga-ui/kit';

@Component({
  selector: 'z-sidebar-nav-item',
  imports: [CommonModule, RouterLink, TuiIcon, TuiTooltip],
  template: `
    <a
      [attr.href]="route() === voidRoute ? voidRoute : null"
      [routerLink]="route() === voidRoute ? null : route()"
      class="flex h-10 w-full items-center justify-center rounded-sm text-gray-300 hover:bg-gray-700 hover:text-gray-100 active:bg-gray-700/5"
      [attr.aria-label]="icon() || 'Navigation Item'"
    >
      <tui-icon
        tuiTheme="dark"
        [attr.aria-label]="icon() + ' icon'"
        [icon]="icon()"
        [tuiTooltip]="label()"
        [style.font-size.rem]="2"
      />
    </a>
  `,
  host: {
    '(click)': 'clicked.emit()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarNavItemUiComponent {
  protected readonly voidRoute = 'javascript:void(0)';
  route = input<string>(this.voidRoute);
  icon = input.required<string>();
  label = input.required<string>();
  clicked = output();
}
