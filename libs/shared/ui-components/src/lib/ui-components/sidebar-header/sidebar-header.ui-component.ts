import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIcon, MatIconRegistry } from '@angular/material/icon';

const xMarkSvg = `<svg
            class="hi-mini hi-x-mark -mx-0.5 inline-block size-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
            />
          </svg>`;

@Component({
  selector: 'z-sidebar-header',
  imports: [CommonModule, MatIcon],
  template: `
    <div
      class="flex h-16 w-full flex-none items-center justify-between px-4 shadow-sm lg:justify-center dark:bg-gray-700/50"
    >
      <h2 class="grow text-sm font-semibold text-gray-100 dark:text-gray-200">{{ title() }}</h2>

      <div class="flex-none lg:hidden">
        <button
          (click)="closeClicked.emit()"
          type="button"
          class="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-300 hover:border-gray-500 hover:text-gray-100 focus:ring-2 focus:ring-gray-500 focus:outline-none active:border-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-200 dark:focus:ring-gray-600/40 dark:active:border-gray-700"
          aria-label="Close sidebar"
        >
          <mat-icon svgIcon="x-mark" aria-hidden="false" aria-label="Close sidebar"></mat-icon>
        </button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarHeaderUiComponent {
  title = input<string>('');
  closeClicked = output();

  constructor() {
    const iconRegistry = inject(MatIconRegistry);
    const sanitizer = inject(DomSanitizer);

    iconRegistry.addSvgIconLiteral('x-mark', sanitizer.bypassSecurityTrustHtml(xMarkSvg));
  }
}
