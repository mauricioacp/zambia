import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { RouterLink } from '@angular/router';

@Component({
  selector: 'z-page-footer',
  imports: [RouterLink],
  template: `
    <!-- Page Footer -->
    <footer id="page-footer" class="flex flex-none items-center bg-white dark:bg-gray-800/50">
      <div
        class="max-w-10xl mx-auto flex w-full flex-col px-2 text-center text-sm md:flex-row md:justify-between md:px-4 md:text-left lg:px-8"
      >
        <div class="inline-flex items-center justify-center py-2 md:pt-4 md:pb-4">
          <a
            routerLink="/help"
            class="cursor-pointer font-medium text-blue-600 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Ayuda
          </a>
        </div>

        <div
          class="cursor-default rounded-lg px-2 py-2 font-medium text-gray-700 transition-colors duration-200 select-none md:px-3 md:py-4 dark:text-gray-300"
        >
          {{ currentDateTime() }}
        </div>
      </div>
    </footer>
    <!-- END Page Footer -->
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageFooterUiComponent {
  private dateFormatter = new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  currentDateTime = signal<string>('');

  constructor() {
    this.updateDateTime();
    setInterval(() => this.updateDateTime(), 1000);
  }

  private updateDateTime(): void {
    this.currentDateTime.set(this.dateFormatter.format(new Date()));
  }
}
