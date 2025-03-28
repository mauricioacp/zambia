import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthSmartComponent } from '@zambia/feat-auth';

@Component({
  selector: 'z-shell',
  imports: [CommonModule, AuthSmartComponent],
  template: `
    <main
      class="bg-linear-to-r from-red-500 via-orange-400 to-yellow-400 dark:via-none dark:from-blue-500 dark:to-teal-400">
      @if (session()) {
      } @else {
        <z-auth></z-auth>
      }
    </main>
  `,
  styles: `
    main {
      height: 100vh;
      width: 100vw;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellSmartComponent {
  session = signal(null);
}
