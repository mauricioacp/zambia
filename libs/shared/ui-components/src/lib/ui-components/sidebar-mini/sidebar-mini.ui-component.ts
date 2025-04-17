import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconRegistry } from '@angular/material/icon';
import { logoSvg } from '../../assets/logo-svg';
import { DomSanitizer } from '@angular/platform-browser';
import { BrandUiComponent } from '../brand/brand.ui-component';

@Component({
  selector: 'z-sidebar-mini',
  imports: [CommonModule, BrandUiComponent],
  template: `
    <!-- Sidebar Mini -->
    <div class="absolute top-0 bottom-0 left-0 z-10 flex w-14 flex-col border-r border-transparent bg-gray-900/50">
      <div class="flex-none">
        <z-brand></z-brand>
      </div>
      <nav class="grow space-y-2 px-2 py-4">
        <ng-content select="[main-nav]"></ng-content>
      </nav>
      <nav class="flex-none space-y-2 px-2 py-4">
        <ng-content select="[user-nav]"></ng-content>
      </nav>
    </div>
    <!-- END Sidebar Mini -->
  `,
  styles: `
    .logo-icon {
      width: 44px;
      height: 44px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarMiniUiComponent {
  private readonly iconRegistry = inject(MatIconRegistry);
  private readonly domSanitizer = inject(DomSanitizer);

  constructor() {
    this.iconRegistry.addSvgIconLiteral('logo', this.domSanitizer.bypassSecurityTrustHtml(logoSvg));
  }
}
