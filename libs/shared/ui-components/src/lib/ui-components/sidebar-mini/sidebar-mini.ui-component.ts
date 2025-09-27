import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BrandLogoComponent } from '../brand/brand-logo.component';

@Component({
  selector: 'z-sidebar-mini',
  imports: [BrandLogoComponent],
  template: `
    <div class="absolute top-0 bottom-0 left-0 z-10 flex w-14 flex-col border-r border-transparent bg-gray-900/50">
      <div class="flex h-16 flex-none items-center justify-center">
        <z-brand-logo />
      </div>
      <nav class="grow space-y-2 px-2 py-4">
        <ng-content select="[main-nav]"></ng-content>
      </nav>
      <nav class="flex-none space-y-2 px-2 py-4">
        <ng-content select="[user-nav]"></ng-content>
      </nav>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarMiniUiComponent {}
