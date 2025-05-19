import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { logoSvg } from '../../assets/logo-svg';

@Component({
  selector: 'z-brand-logo',
  standalone: true,
  imports: [CommonModule],
  template: `<span class="logo text-gray-300 dark:text-white" [innerHTML]="safeLogoSvg"></span> `,
  styles: `
    .logo {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandLogoComponent {
  private readonly domSanitizer = inject(DomSanitizer);
  safeLogoSvg: SafeHtml;

  constructor() {
    this.safeLogoSvg = this.domSanitizer.bypassSecurityTrustHtml(logoSvg);
  }
}
