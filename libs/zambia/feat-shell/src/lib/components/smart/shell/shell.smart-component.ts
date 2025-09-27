import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'z-shell',
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.Default,
  template: `
    <main
      class="bg-linear-to-r from-red-500 via-orange-400 to-yellow-400 dark:via-none dark:from-blue-500 dark:to-teal-400"
    >
      <router-outlet />
    </main>
  `,
  styles: `
    main {
      height: 100vh;
      width: 100vw;
    }
  `,
})
export class ShellSmartComponent {}
