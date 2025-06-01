import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterOutlet } from '@angular/router';
import { AuthService } from '@zambia/data-access-auth';
import { AuthSmartComponent } from '@zambia/feat-auth';

@Component({
  selector: 'z-shell',
  imports: [CommonModule, AuthSmartComponent, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.Default,
  template: `
    <main
      class="bg-linear-to-r from-red-500 via-orange-400 to-yellow-400 dark:via-none dark:from-blue-500 dark:to-teal-400"
    >
      @if (authService.isAuthenticated()) {
        <router-outlet />
      } @else {
        <z-auth />
      }
    </main>
  `,
  styles: `
    main {
      height: 100vh;
      width: 100vw;
    }
  `,
})
export class ShellSmartComponent {
  authService = inject(AuthService);
}
