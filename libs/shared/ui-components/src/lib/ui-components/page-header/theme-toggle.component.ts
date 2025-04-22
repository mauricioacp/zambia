import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { ThemeService } from '../../layout/theme.service';

@Component({
  selector: 'z-theme-toggle',
  standalone: true,
  imports: [CommonModule, MatIcon, MatIconButton],
  template: `
    <button
      mat-icon-button
      (click)="toggleTheme()"
      [attr.aria-label]="isDark() ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
    >
      <mat-icon>{{ isDark() ? 'light_mode' : 'dark_mode' }}</mat-icon>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggleComponent {
  private themeService = inject(ThemeService);
  isDark = () => this.themeService.isDarkTheme();

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
