import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'z-page-footer',
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Page Footer -->
    <footer id="page-footer" class="flex flex-none items-center bg-white dark:bg-gray-800/50">
      <div
        class="mx-auto flex w-full max-w-10xl flex-col px-4 text-center text-sm
        md:flex-row md:justify-between md:text-left lg:px-8">
        <div class="inline-flex items-center justify-center pt-1 pb-4 md:pt-4">
          <a
            routerLink="/help"
            class="font-medium text-blue-600 hover:text-blue-400 cursor-pointer
            dark:text-blue-400 dark:hover:text-blue-300">
            Ayuda
          </a>
        </div>

        <div
          class="pt-4 pb-1 md:pb-4 font-medium text-gray-700 dark:text-gray-300
            rounded-lg px-3 transition-colors duration-200
            cursor-default select-none">
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
