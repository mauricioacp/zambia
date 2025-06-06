import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'z-sidebar-nav',
  imports: [CommonModule],
  template: ` <div class="overflow-y-auto">
    <div class="w-full p-4">
      <nav class="space-y-1" aria-label="Sidebar Navigation">
        <ng-content></ng-content>
      </nav>
    </div>
  </div>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarNavUiComponent {}
