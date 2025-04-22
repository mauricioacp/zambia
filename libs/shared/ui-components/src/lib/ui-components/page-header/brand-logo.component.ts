import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { logoSvg } from '../../assets/logo-svg';

@Component({
  selector: 'z-brand-logo',
  standalone: true,
  imports: [CommonModule, MatIcon],
  template: `
    <button
      class="group inline-flex items-center gap-2 text-lg font-bold tracking-wide text-gray-900 hover:text-gray-600 dark:text-gray-100 dark:hover:text-gray-300"
    >
      <mat-icon class="logo fill-blue-700 dark:fill-blue-50" svgIcon="logo"></mat-icon>
    </button>
  `,
  styles: `
    .logo {
      margin-top: 5px;
      width: 48px;
      height: 48px;
    }
  `,

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandLogoComponent {
  private readonly iconRegistry = inject(MatIconRegistry);
  private readonly domSanitizer = inject(DomSanitizer);

  constructor() {
    this.iconRegistry.addSvgIconLiteral('logo', this.domSanitizer.bypassSecurityTrustHtml(logoSvg));
  }
}
