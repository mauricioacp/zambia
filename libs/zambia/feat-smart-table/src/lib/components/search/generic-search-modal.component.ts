import { ChangeDetectionStrategy, Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { POLYMORPHEUS_CONTEXT } from '@taiga-ui/polymorpheus';
import { TuiDialogContext } from '@taiga-ui/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { TuiButton, TuiIcon, TuiTextfield, TuiLabel, TuiScrollbar, TuiLoader } from '@taiga-ui/core';
import { TuiAvatar, TuiChip, TuiItemsWithMore, TuiRadioList, TuiBlock } from '@taiga-ui/kit';
import { TuiAutoColorPipe, TuiInitialsPipe } from '@taiga-ui/core';

import { TableEmptyStateComponent } from '@zambia/ui-table-primitives';
import { SearchModalConfig, SearchModalResult } from '../../types/search.types';
import { getDisplayValue } from '../../utils/table.utils';

@Component({
  selector: 'z-generic-search-modal',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // TaigaUI
    TuiButton,
    TuiTextfield,
    TuiLabel,
    TuiScrollbar,
    TuiLoader,
    TuiAvatar,
    TuiChip,
    TuiItemsWithMore,
    TuiRadioList,
    TuiAutoColorPipe,
    TuiInitialsPipe,
    // Table primitives
    TableEmptyStateComponent,
  ],
  template: `
    <div class="search-modal">
      <!-- Header -->
      <div class="modal-header">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white">
          {{ config.title || 'Search' }}
        </h2>
        <button
          tuiButton
          appearance="flat"
          size="s"
          iconStart="@tui.x"
          (click)="cancel()"
          class="close-button"
        ></button>
      </div>

      <!-- Search Input -->
      <div class="search-section">
        <tui-textfield iconStart="@tui.search" tuiTextfieldSize="l">
          <input
            id="search-input"
            tuiTextfield
            [formControl]="searchControl"
            [placeholder]="config.searchConfig.placeholder || 'Type to search...'"
            class="search-input"
          />
          <label tuiLabel for="search-input">Search</label>
        </tui-textfield>
      </div>

      <!-- Results Section -->
      <div class="results-section">
        @if (isSearching()) {
          <div class="loading-state">
            <tui-loader size="l" />
            <p class="text-gray-500 dark:text-gray-400">Searching...</p>
          </div>
        } @else if (searchResults().length > 0) {
          <div class="results-header">
            <span class="text-sm text-gray-600 dark:text-gray-400">
              Found {{ searchResults().length }} result{{ searchResults().length === 1 ? '' : 's' }}
            </span>
          </div>

          <tui-scrollbar class="results-container">
            @if (config.multiple) {
              <!-- Multiple selection mode -->
              <div class="results-list">
                @for (result of searchResults(); track getItemId(result)) {
                  <label class="result-item" [class.selected]="isItemSelected(result)">
                    <input
                      type="checkbox"
                      [checked]="isItemSelected(result)"
                      (change)="toggleItemSelection(result)"
                      class="checkbox"
                    />
                    <div class="result-content">
                      @if (config.searchConfig.customFields) {
                        <ng-container *ngTemplateOutlet="customResultTemplate; context: { $implicit: result }" />
                      } @else {
                        <div class="result-text">
                          {{ getResultDisplay(result) }}
                        </div>
                      }
                    </div>
                  </label>
                }
              </div>
            } @else {
              <!-- Single selection mode -->
              <tui-radio-list class="results-list" [formControl]="selectionControl">
                @for (result of searchResults(); track getItemId(result)) {
                  <button tuiOption type="button" [value]="result" class="result-item single-select">
                    @if (config.searchConfig.customFields) {
                      <ng-container *ngTemplateOutlet="customResultTemplate; context: { $implicit: result }" />
                    } @else {
                      <div class="result-text">
                        {{ getResultDisplay(result) }}
                      </div>
                    }
                  </button>
                }
              </tui-radio-list>
            }
          </tui-scrollbar>
        } @else if (hasSearched() && !isSearching()) {
          <!-- Empty state -->
          <z-table-empty-state
            [config]="{
              title: 'No results found',
              description: 'Try adjusting your search criteria',
              icon: '@tui.search',
            }"
          />
        } @else if (config.showRecent && recentItems().length > 0) {
          <!-- Recent items -->
          <div class="recent-section">
            <h3 class="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Recent selections</h3>
            <div class="recent-items">
              @for (item of recentItems(); track getItemId(item); let i = $index) {
                @if (i < 5) {
                  <tui-chip size="s" class="recent-chip" (click)="selectRecentItem(item)">
                    {{ getResultDisplay(item) }}
                  </tui-chip>
                }
              }
            </div>
          </div>
        }
      </div>

      <!-- Footer -->
      <div class="modal-footer">
        <button tuiButton appearance="secondary" size="m" (click)="cancel()">Cancel</button>
        <button tuiButton appearance="primary" size="m" [disabled]="!hasSelection()" (click)="confirm()">
          {{ config.multiple ? 'Select (' + selectedItems().size + ')' : 'Select' }}
        </button>
      </div>
    </div>

    <!-- Custom result template -->
    <ng-template #customResultTemplate let-item>
      <div class="custom-result">
        <!-- Default custom template, can be overridden -->
        <div class="flex items-center gap-3">
          <tui-avatar
            [src]="getAvatarText(item) | tuiInitials"
            [style.background]="getAvatarText(item) | tuiAutoColor"
            size="s"
          />
          <div class="flex-1">
            <div class="font-medium">{{ getResultDisplay(item) }}</div>
            @if (getResultSubtitle(item); as subtitle) {
              <div class="text-sm text-gray-500">{{ subtitle }}</div>
            }
          </div>
        </div>
      </div>
    </ng-template>
  `,
  styles: `
    :host {
      display: block;
    }

    .search-modal {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 500px;
      max-height: 80vh;
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.5rem;
      border-bottom: 1px solid var(--tui-border-normal);
    }

    .search-section {
      padding: 1.5rem;
      border-bottom: 1px solid var(--tui-border-normal);
    }

    .results-section {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem;
      gap: 1rem;
    }

    .results-header {
      padding: 0.75rem 1.5rem;
      border-bottom: 1px solid var(--tui-border-normal);
    }

    .results-container {
      flex: 1;
      overflow-y: auto;
    }

    .results-list {
      padding: 0.5rem;
    }

    .result-item {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 0.75rem 1rem;
      margin: 0.25rem 0;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.2s ease;
      background: transparent;
      border: 1px solid transparent;
    }

    .result-item:hover {
      background: var(--tui-background-base-alt);
    }

    .result-item.selected,
    .result-item.single-select:checked {
      background: var(--tui-background-accent-1-pressed);
      border-color: var(--tui-border-focus);
    }

    .checkbox {
      margin-right: 0.75rem;
    }

    .result-content {
      flex: 1;
    }

    .result-text {
      font-size: 0.875rem;
    }

    .recent-section {
      padding: 1.5rem;
    }

    .recent-items {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .recent-chip {
      cursor: pointer;
    }

    .modal-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.75rem;
      padding: 1.5rem;
      border-top: 1px solid var(--tui-border-normal);
    }

    .custom-result {
      width: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenericSearchModalComponent<T extends Record<string, unknown>> {
  private readonly context =
    inject<TuiDialogContext<SearchModalResult<T>, { config: SearchModalConfig<T> }>>(POLYMORPHEUS_CONTEXT);

  // Configuration
  readonly config = this.context.data.config;

  // Form controls
  readonly searchControl = new FormControl('');
  readonly selectionControl = new FormControl<T | null>(null);

  // State
  readonly isSearching = signal(false);
  readonly searchResults = signal<T[]>([]);
  readonly hasSearched = signal(false);
  readonly selectedItems = signal<Set<string>>(new Set());
  readonly recentItems = signal<T[]>([]);

  // Debounced search term
  readonly searchTerm = toSignal(
    this.searchControl.valueChanges.pipe(
      debounceTime(this.config.searchConfig.debounceTime || 300),
      distinctUntilChanged()
    ),
    { initialValue: '' }
  );

  // Computed
  readonly hasSelection = computed(() => {
    if (this.config.multiple) {
      return this.selectedItems().size > 0;
    }
    return this.selectionControl.value !== null;
  });

  constructor() {
    // Load recent items if enabled
    if (this.config.showRecent && this.config.recentItemsKey) {
      this.loadRecentItems();
    }

    // Set up search effect
    effect(async () => {
      const term = this.searchTerm() || '';
      if (term && term.length >= (this.config.searchConfig.minLength || 0)) {
        await this.performSearch(term);
      } else if (term === '') {
        this.searchResults.set([]);
        this.hasSearched.set(false);
      }
    });
  }

  private async performSearch(term: string): Promise<void> {
    this.isSearching.set(true);
    this.hasSearched.set(true);

    try {
      let results: T[];

      if (this.config.searchService) {
        // Use provided search service
        const searchResults = await this.config.searchService.search(term, this.config.data);
        results = searchResults.map((r) => r.item);
      } else if (this.config.data) {
        // Simple client-side search
        results = this.filterData(this.config.data, term);
      } else {
        results = [];
      }

      this.searchResults.set(results);
    } catch (error) {
      console.error('Search error:', error);
      this.searchResults.set([]);
    } finally {
      this.isSearching.set(false);
    }
  }

  private filterData(data: T[], term: string): T[] {
    const lowerTerm = term.toLowerCase();
    const searchKeys = this.config.searchConfig.searchKeys || [];

    return data.filter((item) => {
      if (searchKeys.length === 0) {
        // Search all string properties
        return Object.values(item).some((value) => String(value).toLowerCase().includes(lowerTerm));
      }

      // Search specified keys
      return searchKeys.some((key) => {
        const value = this.getNestedValue(item, key);
        return String(value).toLowerCase().includes(lowerTerm);
      });
    });
  }

  private getNestedValue(obj: T, path: string): unknown {
    const keys = path.split('.');
    let value: unknown = obj;

    for (const key of keys) {
      value = (value as Record<string, unknown>)?.[key];
      if (value === undefined || value === null) {
        return '';
      }
    }

    return value;
  }

  getItemId(item: T): string {
    if ('id' in item) {
      return String(item['id']);
    }
    return JSON.stringify(item);
  }

  getResultDisplay(item: T): string {
    // Check for common display properties
    const displayKeys = ['name', 'title', 'label', 'display', 'email', 'code'];

    for (const key of displayKeys) {
      if (key in item) {
        return getDisplayValue(item[key]);
      }
    }

    // If custom fields defined, use the first one
    if (this.config.searchConfig.customFields?.length) {
      const firstField = this.config.searchConfig.customFields[0];
      return getDisplayValue(item[firstField.key]);
    }

    return JSON.stringify(item);
  }

  getResultSubtitle(item: T): string | null {
    // Common subtitle patterns
    if ('email' in item && 'name' in item) {
      return String(item['email']);
    }
    if ('code' in item && 'name' in item) {
      return `Code: ${item['code']}`;
    }
    if ('role' in item) {
      return getDisplayValue(item['role']);
    }
    return null;
  }

  getAvatarText(item: T): string {
    return this.getResultDisplay(item);
  }

  isItemSelected(item: T): boolean {
    const id = this.getItemId(item);
    return this.selectedItems().has(id);
  }

  toggleItemSelection(item: T): void {
    const id = this.getItemId(item);
    this.selectedItems.update((set) => {
      const newSet = new Set(set);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }

  selectRecentItem(item: T): void {
    if (this.config.multiple) {
      this.toggleItemSelection(item);
    } else {
      this.selectionControl.setValue(item);
      this.confirm();
    }
  }

  private loadRecentItems(): void {
    if (!this.config.recentItemsKey) return;

    try {
      const stored = localStorage.getItem(this.config.recentItemsKey);
      if (stored) {
        const items = JSON.parse(stored) as T[];
        this.recentItems.set(items.slice(0, this.config.maxRecentItems || 10));
      }
    } catch (error) {
      console.error('Failed to load recent items:', error);
    }
  }

  private saveRecentItem(item: T | T[]): void {
    if (!this.config.recentItemsKey || !this.config.showRecent) return;

    try {
      const items = Array.isArray(item) ? item : [item];
      const current = this.recentItems();
      const updated = [...items, ...current];

      // Remove duplicates and limit
      const unique = Array.from(new Map(updated.map((i) => [this.getItemId(i), i])).values()).slice(
        0,
        this.config.maxRecentItems || 10
      );

      localStorage.setItem(this.config.recentItemsKey, JSON.stringify(unique));
    } catch (error) {
      console.error('Failed to save recent items:', error);
    }
  }

  confirm(): void {
    let result: SearchModalResult<T>;

    if (this.config.multiple) {
      const selected = this.searchResults().filter((item) => this.isItemSelected(item));
      result = {
        selected: selected.length > 0 ? selected : null,
        searchTerm: this.searchControl.value || undefined,
      };
      if (selected.length > 0) {
        this.saveRecentItem(selected);
      }
    } else {
      const selected = this.selectionControl.value;
      result = {
        selected,
        searchTerm: this.searchControl.value || undefined,
      };
      if (selected) {
        this.saveRecentItem(selected);
      }
    }

    this.context.completeWith(result);
  }

  cancel(): void {
    this.context.completeWith({ selected: null });
  }
}
