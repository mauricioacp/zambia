import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ThemeService } from '../../layout/theme.service';
import { TuiIcon } from '@taiga-ui/core';

@Component({
  selector: 'z-theme-toggle',
  standalone: true,
  imports: [TuiIcon],
  template: `
    <button (click)="toggleTheme()" [attr.aria-label]="ariaLabel">
      <tui-icon [attr.aria-label]="ariaLabel" [icon]="icon" />
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggleComponent {
  private themeService = inject(ThemeService);
  isDark = () => this.themeService.isDarkTheme();

  get icon(): string {
    return this.isDark() ? 'sun' : 'moon';
  }

  get ariaLabel(): string {
    return this.isDark() ? 'Switch to Light Mode' : 'Switch to Dark Mode';
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
