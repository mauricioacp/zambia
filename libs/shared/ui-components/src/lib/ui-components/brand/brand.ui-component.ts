import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { logoSvg } from '../../assets/logo-svg';

@Component({
  selector: 'z-brand',
  imports: [CommonModule, MatIcon],
  template: `
    <button
      class="flex h-16 w-full items-center justify-center text-lg font-bold tracking-wide text-blue-400 hover:bg-gray-900 hover:text-blue-300 active:bg-gray-900/50"
      aria-label="Brand Logo"
    >
      <mat-icon class="logo-icon inline-block" svgIcon="logo"></mat-icon>
    </button>
  `,
  styles: `
    .logo-icon {
      width: 44px;
      height: 44px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandUiComponent {
  private readonly iconRegistry = inject(MatIconRegistry);
  private readonly domSanitizer = inject(DomSanitizer);

  constructor() {
    this.iconRegistry.addSvgIconLiteral('logo', this.domSanitizer.bypassSecurityTrustHtml(logoSvg));
  }
}
