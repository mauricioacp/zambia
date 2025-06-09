import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { TuiButton, TuiDataList, TuiDropdown, TuiFlagPipe } from '@taiga-ui/core';
import { TUI_COUNTRIES } from '@taiga-ui/kit';
import { LanguageService } from '../../layout/language.service';

@Component({
  selector: 'z-language-toggle',
  imports: [CommonModule, AsyncPipe, TuiButton, TuiDropdown, TuiDataList, TuiFlagPipe],
  template: `
    <div [tuiDropdown]="languageDropdown" [(tuiDropdownOpen)]="showDropdown">
      <button tuiButton type="button" appearance="flat" size="s" class="flex items-center gap-1 !px-2 !py-1">
        <img
          [alt]="(countriesNames$ | async)?.[currentLanguage().flag]"
          [src]="currentLanguage().flag | tuiFlag"
          [style.border-radius.%]="20"
          class="h-3 w-4"
        />
        {{ currentLanguage().code.toUpperCase() }}
      </button>
    </div>

    <ng-template #languageDropdown>
      <tui-data-list class="min-w-[120px]">
        @for (language of availableLanguages; track language.code) {
          <button
            tuiOption
            type="button"
            class="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
            [class.font-semibold]="language.code === currentLanguage().code"
            [class.text-blue-600]="language.code === currentLanguage().code"
            [class.dark:text-blue-400]="language.code === currentLanguage().code"
            (click)="changeLanguage(language.code)"
          >
            <img
              [alt]="(countriesNames$ | async)?.[language.flag]"
              [src]="language.flag | tuiFlag"
              [style.border-radius.%]="20"
              class="h-3 w-4"
            />
            <span>{{ language.name }}</span>
            @if (language.code === currentLanguage().code) {
              <svg class="ml-auto h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            }
          </button>
        }
      </tui-data-list>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageToggleComponent {
  private readonly languageService = inject(LanguageService);

  readonly countriesNames$ = inject(TUI_COUNTRIES);
  readonly availableLanguages = this.languageService.availableLanguages;
  readonly currentLanguage = this.languageService.getCurrentLanguageOption.bind(this.languageService);

  showDropdown = false;

  changeLanguage(language: 'es' | 'en'): void {
    this.languageService.changeLanguage(language);
    this.showDropdown = false;
  }
}
