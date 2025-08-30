import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiAutoColorPipe, TuiInitialsPipe, TuiTextfield, TuiLoader } from '@taiga-ui/core';
import { TuiAvatar } from '@taiga-ui/kit';
import { TranslateModule } from '@ngx-translate/core';

import { AgreementsFacadeService } from '../../services/agreements-facade.service';
import { SearchAgreementResult } from '../../types/search-agreements.types';
import { debouncedSignal } from '../../utils/debounced-signal';
import { Router } from '@angular/router';

@Component({
  selector: 'z-agreement-text-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    TuiTextfield,
    TuiAvatar,
    TuiAutoColorPipe,
    TuiInitialsPipe,
    TuiLoader,
  ],
  template: `
    <div class="relative">
      <tui-textfield>
        <input
          tuiTextfield
          [(ngModel)]="searchInputValue"
          placeholder="{{ 'search_by_name' | translate }}"
          iconStart="@tui.search"
        />
      </tui-textfield>

      @if (searchQuery() && searchQuery().length >= 2) {
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgreementTextSearchComponent {
  private agreementsFacade = inject(AgreementsFacadeService);
  private router = inject(Router);

  // Search state
  searchInputValue = signal('');
  isSearching = signal(false);
  searchResults = signal<SearchAgreementResult[]>([]);

  // Debounced search query
  searchQuery = debouncedSignal(this.searchInputValue, 500, '');

  constructor() {
    // React to debounced search query changes
    effect(() => {
      console.log('Search query changed:', this.searchQuery());
      this.searchAgreements(this.searchQuery());
    });
  }

  private async searchAgreements(query: string): Promise<void> {
    if (!query || query.length < 2) {
      this.searchResults.set([]);
      return;
    }

    this.isSearching.set(true);

    try {
      const results = await this.agreementsFacade.searchAgreementsByName(query);
      this.searchResults.set(results);
    } catch (error) {
      console.error('Search error:', error);
      this.searchResults.set([]);
    } finally {
      this.isSearching.set(false);
    }
  }

  selectAgreement(agreement: SearchAgreementResult): void {
    // Clear search
    this.searchInputValue.set('');
    this.searchResults.set([]);

    // Navigate to agreement
    this.router.navigate(['/dashboard/agreements', agreement.id]);
  }

  getAvatarText(agreement: SearchAgreementResult): string {
    const name = agreement.name || '';
    const lastName = agreement.last_name || '';
    return `${name} ${lastName}`.trim() || agreement.email || 'U';
  }
}
