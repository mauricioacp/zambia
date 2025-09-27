import { ChangeDetectionStrategy, Component, effect, inject, signal, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { TuiAutoColorPipe, TuiButton, TuiInitialsPipe, TuiTextfield, TuiIcon, TuiDialogService } from '@taiga-ui/core';
import { TuiAvatar } from '@taiga-ui/kit';
import { TranslateModule } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { POLYMORPHEUS_CONTEXT } from '@taiga-ui/polymorpheus';
import { TuiDialogContext } from '@taiga-ui/core';

import { AgreementsFacadeService } from '../../services/agreements-facade.service';
import { SearchAgreementResult } from '../../types/search-agreements.types';

@Component({
  selector: 'z-agreement-simple-search',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, TuiButton],
  template: `
    <button tuiButton appearance="secondary" size="m" iconStart="@tui.search" (click)="openSearchDialog()">
      {{ 'advanced_search' | translate }}
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgreementSimpleSearchComponent {
  private agreementsFacade = inject(AgreementsFacadeService);
  private dialogService = inject(TuiDialogService);

  // Output
  agreementSelected = output<SearchAgreementResult>();

  openSearchDialog(): void {
    this.dialogService
      .open<SearchAgreementResult | null>(new PolymorpheusComponent(AgreementSearchDialogContentComponent), {
        dismissible: true,
        size: 'l',
        label: 'Search Agreements',
      })
      .subscribe({
        next: (result) => {
          if (result) {
            this.agreementSelected.emit(result);
          }
        },
      });
  }
}

@Component({
  selector: 'z-agreement-search-dialog-content',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, TuiTextfield, TuiIcon, TuiAvatar, TuiAutoColorPipe, TuiInitialsPipe],
  template: `
    <div class="search-dialog">
      <div class="mb-4">
        <tui-textfield iconStart="@tui.search" size="l">
          <input
            tuiTextfield
            [formControl]="searchControl"
            placeholder="{{ 'search_by_name_email' | translate }}"
            class="w-full"
          />
        </tui-textfield>
      </div>

      <div class="search-results">
        @if (isSearching()) {
          <div class="flex items-center justify-center py-8">
            <div class="text-center">
              <tui-icon icon="@tui.loader-2" class="mb-2 animate-spin text-4xl text-gray-400"></tui-icon>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ 'searching' | translate }}...</p>
            </div>
          </div>
        } @else if (searchResults().length === 0 && searchControl.value) {
          <div class="flex items-center justify-center py-8">
            <div class="text-center">
              <tui-icon icon="@tui.search-x" class="mb-2 text-4xl text-gray-400"></tui-icon>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ 'no_results_found_for_search' | translate: { term: searchControl.value } }}
              </p>
            </div>
          </div>
        } @else if (searchResults().length > 0) {
          <div class="max-h-[400px] space-y-2 overflow-y-auto">
            @for (agreement of searchResults(); track agreement.id) {
              <button
                type="button"
                class="flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 text-left transition-colors hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
                (click)="selectAgreement(agreement)"
              >
                <tui-avatar
                  size="m"
                  [src]="getAvatarText(agreement) | tuiInitials"
                  [style.background]="getAvatarText(agreement) | tuiAutoColor"
                />
                <div class="flex-1 overflow-hidden">
                  <div class="font-medium text-gray-900 dark:text-white">
                    {{ agreement.name }} {{ agreement.last_name }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">{{ agreement.email }}</div>
                  <div class="flex items-center gap-2 text-xs">
                    @if (agreement.role && agreement.role.role_name) {
                      <span class="text-gray-600 dark:text-gray-300">{{ agreement.role.role_name }}</span>
                    }
                    @if (agreement.headquarter && agreement.headquarter.headquarter_name) {
                      <span class="text-gray-500">•</span>
                      <span class="text-gray-600 dark:text-gray-300">{{ agreement.headquarter.headquarter_name }}</span>
                    }
                  </div>
                </div>
                <tui-icon icon="@tui.chevron-right" class="text-gray-400"></tui-icon>
              </button>
            }
          </div>
        } @else {
          <div class="flex items-center justify-center py-8">
            <div class="text-center">
              <tui-icon icon="@tui.search" class="mb-2 text-4xl text-gray-400"></tui-icon>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ 'start_typing_to_search' | translate }}
              </p>
            </div>
          </div>
        }
      </div>

      <div class="mt-4 border-t border-gray-200 pt-4 dark:border-slate-700">
        <div class="text-center text-xs text-gray-500 dark:text-gray-400">
          @if (searchResults().length > 0) {
            {{ 'showing_results' | translate: { count: searchResults().length } }}
          } @else {
            {{ 'search_tip' | translate }}
          }
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .search-dialog {
        min-height: 300px;
      }

      .search-results {
        min-height: 200px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgreementSearchDialogContentComponent {
  private agreementsFacade = inject(AgreementsFacadeService);
  private readonly context = inject<TuiDialogContext<SearchAgreementResult | null>>(POLYMORPHEUS_CONTEXT);

  // State
  isSearching = signal(false);
  searchResults = signal<SearchAgreementResult[]>([]);

  // Form control
  searchControl = new FormControl('');

  // Convert form control to signal with debounce
  private searchTermSignal = toSignal(this.searchControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged()), {
    initialValue: '',
  });

  constructor() {
    // React to search term changes
    effect(() => {
      const term = this.searchTermSignal();
      if (term && typeof term === 'string' && term.length >= 2) {
        this.performSearch(term);
      } else {
        this.searchResults.set([]);
      }
    });
  }

  private async performSearch(searchTerm: string): Promise<void> {
    this.isSearching.set(true);

    try {
      // Use the facade service to search agreements
      const criteria = {
        searchTerm,
        searchIn: 'all' as const,
        roleFilters: [],
        countryFilters: [],
        headquarterFilters: [],
        includeInactive: false,
      };

      const result = await this.agreementsFacade.searchAgreements(criteria);

      // Extract agreements from search results
      // The search service returns any[], so we need to cast through unknown first
      const agreements = (result.agreements as unknown as SearchAgreementResult[]) || [];
      this.searchResults.set(agreements);
    } catch (error) {
      console.error('Search error:', error);
      this.searchResults.set([]);
    } finally {
      this.isSearching.set(false);
    }
  }

  selectAgreement(agreement: SearchAgreementResult): void {
    // Close dialog with the selected agreement
    this.context.completeWith(agreement);
  }

  getAvatarText(agreement: SearchAgreementResult): string {
    const name = agreement.name || '';
    const lastName = agreement.last_name || '';
    return `${name} ${lastName}`.trim() || agreement.email || 'U';
  }
}
