import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'z-sidebar',
  imports: [CommonModule],
  template: `
    <aside
      id="page-sidebar"
      [class.-translate-x-full]="!isOpen()"
      [class.translate-x-0]="isOpen()"
      [class.lg:translate-x-0]="isOpen()"
      class="fixed top-0 bottom-0 left-0 z-50 flex h-full w-full -translate-x-full flex-col border-r border-gray-200 bg-gray-800 pl-14 duration-300 ease-in-out lg:w-72 lg:translate-x-0 dark:border-gray-800 dark:text-gray-200"
      aria-label="Main Sidebar Navigation"
    >
      <ng-content select="[sidebar-mini]" />

      <div class="h-screen overflow-y-auto bg-white dark:bg-gray-800">
        <ng-content select="[sidebar-header]"></ng-content>
        <ng-content select="[sidebar-nav]"></ng-content>
      </div>
    </aside>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarUiComponent {
  isOpen = input.required<boolean>();
}
