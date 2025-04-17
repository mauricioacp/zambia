import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'z-sidebar-nav-item',
  imports: [CommonModule, RouterLink, MatIcon],
  template: ` <a
    routerLink="{{ route() }}"
    class="flex h-10 w-full items-center justify-center rounded-sm text-gray-300 hover:bg-gray-700 hover:text-gray-100 active:bg-gray-700/5"
    [attr.aria-label]="icon() || 'Navigation Item'"
  >
    <mat-icon>{{ icon() }}</mat-icon>
  </a>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarNavItemUiComponent {
  route = input.required<string>();
  icon = input.required<string>();
}
