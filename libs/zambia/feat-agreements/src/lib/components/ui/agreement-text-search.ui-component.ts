import { ChangeDetectionStrategy, Component, computed, effect, inject, resource, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiAutoColorPipe, TuiInitialsPipe, TuiTextfield, TuiLoader, TuiIcon } from '@taiga-ui/core';
import { TuiAvatar, TuiTooltip } from '@taiga-ui/kit';
import { TranslateModule } from '@ngx-translate/core';

import { AgreementsFacadeService } from '../../services/agreements-facade.service';
import { SearchAgreementResult } from '../../types/search-agreements.types';
import { debouncedSignal } from '../../utils/debounced-signal';
import { Router } from '@angular/router';

@Component({
  selector: 'z-agreement-text-search',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    TuiTextfield,
    TuiAvatar,
    TuiAutoColorPipe,
    TuiInitialsPipe,
    TuiLoader,
    TuiTooltip,
    TuiIcon,
  ],
  template: `
    <div class="relative">
      <label for="tSearch" class="mb-2 block text-sm font-medium text-gray-700 sm:text-base dark:text-slate-300">
        {{ 'search_by_name_label' | translate }}
      </label>
      <tui-textfield iconStart="@tui.search">
        <input placeholder="{{ 'search_by_name' | translate }}" tuiTextfield [(ngModel)]="searchInputValue" />
        <tui-icon tuiTooltip="Escribe el nombre de un colaborador o alumno..." />
      </tui-textfield>

      @if (searchQuery() && searchQuery().length >= 2) {
        <!--  todo convert to taiga ui combo box component?      -->

        <div
          class="absolute top-full right-0 left-0 z-50 mt-1 max-h-96 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800"
        >
          @if (isSearching()) {
            <div class="flex items-center justify-center p-4">
              <tui-loader size="m" />
            </div>
          } @else if (searchResults().length === 0) {
            <div class="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
              {{ 'no_results_found' | translate }}
            </div>
          } @else {
            <div class="p-2">
              @for (agreement of searchResults(); track agreement.id) {
                <button
                  type="button"
                  class="flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-gray-100 dark:hover:bg-slate-700"
                  (click)="selectAgreement(agreement)"
                >
                  <tui-avatar
                    size="s"
                    [src]="getAvatarText(agreement) | tuiInitials"
                    [style.background]="getAvatarText(agreement) | tuiAutoColor"
                  />
                  <div class="flex-1 overflow-hidden">
                    <div class="font-medium text-gray-900 dark:text-white">
                      {{ agreement.name }} {{ agreement.last_name }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">{{ agreement.email }}</div>
                  </div>
                  @if (agreement.role?.role_name) {
                    <span class="text-xs text-gray-600 dark:text-gray-300">{{ agreement.role?.role_name }}</span>
                  }
                </button>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        position: relative;
      }
    `,
  ],
  host: {
    class: 'min-w-[180px]',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgreementTextSearchComponent {
  private agreementsFacade = inject(AgreementsFacadeService);
  private router = inject(Router);
  searchInputValue = signal('');
  searchQuery = debouncedSignal(this.searchInputValue, 500, '');

  private resultsResource = resource({
    params: () => this.searchQuery(),
    loader: async ({ params }) => {
      const query = params;
      if (!query || query.length < 2) {
        return [] as SearchAgreementResult[];
      }
      try {
        return await this.agreementsFacade.searchAgreementsByName(query);
      } catch (error) {
        console.error('Search error:', error);
        return [] as SearchAgreementResult[];
      }
    },
  });

  isSearching = computed(() => this.resultsResource.isLoading());
  searchResults = computed<SearchAgreementResult[]>(() => this.resultsResource.value() ?? []);

  selectAgreement(agreement: SearchAgreementResult): void {
    this.searchInputValue.set('');
    this.router.navigate(['/dashboard/agreements', agreement.id]);
  }

  getAvatarText(agreement: SearchAgreementResult): string {
    const name = agreement.name || '';
    const lastName = agreement.last_name || '';
    return `${name} ${lastName}`.trim() || agreement.email || 'U';
  }
}
