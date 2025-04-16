import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'z-sidebar-mini',
  imports: [CommonModule, MatIcon],
  template: `
    <!-- Sidebar Mini -->
    <div class="absolute top-0 bottom-0 left-0 z-10 flex w-14 flex-col border-r border-transparent bg-gray-900/50">
      <!-- Brand -->
      <div class="flex-none">
        <a
          href="javascript:void(0)"
          class="flex h-16 w-full items-center justify-center text-lg font-bold tracking-wide text-blue-400 hover:bg-gray-900 hover:text-blue-300 active:bg-gray-900/50">
          <mat-icon class="logo-icon inline-block" svgIcon="logo"></mat-icon>
        </a>
      </div>
      <!-- END Brand -->

      <!-- Main Navigation -->
      <nav class="grow space-y-2 px-2 py-4">
        <a
          href="javascript:void(0)"
          class="flex h-10 w-full items-center justify-center rounded-sm text-gray-300 hover:bg-gray-700 hover:text-gray-100 active:bg-gray-700/5">
          <mat-icon>dashboard</mat-icon>
        </a>
      </nav>
      <!-- END Main Navigation -->

      <!-- User Navigation -->
      <nav class="flex-none space-y-2 px-2 py-4">
        <a
          href="javascript:void(0)"
          class="flex h-10 w-full items-center justify-center rounded-sm text-gray-300 hover:bg-gray-700 hover:text-gray-100 active:bg-gray-700/5">
          <mat-icon>settings</mat-icon>
        </a>
        <a
          href="javascript:void(0)"
          class="flex h-10 w-full items-center justify-center rounded-sm text-gray-300 hover:bg-gray-700 hover:text-gray-100 active:bg-gray-700/5">
          <mat-icon>logout</mat-icon>
        </a>
      </nav>
      <!-- END User Navigation -->
    </div>
    <!-- END Sidebar Mini -->
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarMiniUiComponent {}
