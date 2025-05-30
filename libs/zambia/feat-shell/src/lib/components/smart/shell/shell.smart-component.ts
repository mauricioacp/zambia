import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterOutlet } from '@angular/router';
import { AuthService } from '@zambia/data-access-auth';
import { AuthSmartComponent } from '@zambia/feat-auth';
import { TuiSkeleton } from '@taiga-ui/kit';

@Component({
  selector: 'z-shell',
  imports: [CommonModule, AuthSmartComponent, RouterOutlet, TuiSkeleton],
  template: `
    <main
      class="bg-linear-to-r from-red-500 via-orange-400 to-yellow-400 dark:via-none dark:from-blue-500 dark:to-teal-400"
    >
      @if (authService.loading()) {
        <!-- Mostrar un loading mientras verifica la sesión -->
        <div class="flex h-screen items-center justify-center">
          <div class="text-center">
            <div
              class="mx-auto mb-4 h-24 w-24 rounded-2xl bg-white/30 shadow-2xl backdrop-blur-sm"
              [tuiSkeleton]="true"
            ></div>
            <div class="mx-auto h-4 w-32 rounded bg-white/20 backdrop-blur-sm" [tuiSkeleton]="true"></div>
          </div>
        </div>
      } @else if (authService.isAuthenticated()) {
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
