import { Component, input, output, signal, computed, ChangeDetectionStrategy, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { TuiButton, TuiIcon, TuiTextfield, TuiLabel, TuiDialogContext } from '@taiga-ui/core';
import { TuiRadioList } from '@taiga-ui/kit';
import { TuiAutoFocus } from '@taiga-ui/cdk';
import { TranslatePipe } from '@ngx-translate/core';
import { POLYMORPHEUS_CONTEXT } from '@taiga-ui/polymorpheus';
// Import role constants
const ROLES_CONSTANTS = {
  ROLES: {
    superadmin: { label: 'Super Admin' },
    general_director: { label: 'General Director' },
    executive_leader: { label: 'Executive Leader' },
    student: { label: 'Student' },
    facilitator: { label: 'Facilitator' },
    companion: { label: 'Companion' },
    manager: { label: 'Manager' },
    assistant: { label: 'Assistant' },
    coordinator: { label: 'Coordinator' },
    director: { label: 'Director' },
  },
};

export interface AgreementSearchCriteria {
  searchTerm: string;
  searchIn: 'all' | 'agreements' | 'headquarters' | 'countries';
  includeInactive?: boolean;
  roleFilters?: string[];
  countryFilters?: string[];
  headquarterFilters?: string[];
}

export interface AgreementSearchResult {
  totalCount: number;
  criteria: AgreementSearchCriteria;
}

@Component({
  selector: 'z-agreement-search-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, TuiButton, TuiIcon, TuiTextfield, TuiLabel, TuiRadioList, TuiAutoFocus, TranslatePipe],
  template: `
    <div class="p-6">
      <h2 class="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
        {{ 'Advanced Agreement Search' | translate }}
      </h2>

      <form (ngSubmit)="performSearch()">
        <!-- Search Term -->
        <div class="mb-6">
          <tui-textfield [iconStart]="'@tui.search'" [tuiTextfieldSize]="'l'" [tuiAutoFocus]="true">
            <input
              tuiTextfield
              type="text"
              [(ngModel)]="searchTerm"
              name="searchTerm"
              [placeholder]="'Enter search term...' | translate"
              (input)="validateSearch()"
            />
            <!-- eslint-disable-next-line @angular-eslint/template/label-has-associated-control -->
            <label tuiLabel>{{ 'Search Term' | translate }}</label>
          </tui-textfield>
          @if (searchError()) {
            <div class="mt-1 text-sm text-red-600 dark:text-red-400">{{ searchError() }}</div>
          }
        </div>

        <!-- Search Scope -->
        <div class="mb-6">
          <h3 class="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ 'Search In' | translate }}
          </h3>
          <tui-radio-list
            [(ngModel)]="searchScope"
            name="searchScope"
            [items]="searchScopeOptions"
            [itemContent]="scopeContent"
            orientation="vertical"
            size="m"
          />
        </div>

        <!-- Role Filters (shown only when searching in agreements or all) -->
        @if (showRoleFilters()) {
          <div class="mb-6">
            <h3 class="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ 'Filter by Roles' | translate }}
            </h3>
            <div class="max-h-48 space-y-2 overflow-y-auto rounded-lg border border-gray-200 p-3 dark:border-gray-700">
              @for (role of availableRoles; track role.value) {
                <label
                  class="flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-gray-50 dark:hover:bg-slate-700"
                  [for]="'role-checkbox-' + role.value"
                >
                  <input
                    type="checkbox"
                    [id]="'role-checkbox-' + role.value"
                    [(ngModel)]="role.selected"
                    [name]="'role-' + role.value"
                    class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <span class="text-sm text-gray-700 dark:text-gray-300">
                    {{ role.label }}
                  </span>
                </label>
              }
            </div>
            <div class="mt-2 flex gap-2">
              <button type="button" tuiButton appearance="secondary" size="xs" (click)="selectAllRoles()">
                {{ 'Select All' | translate }}
              </button>
              <button type="button" tuiButton appearance="secondary" size="xs" (click)="clearAllRoles()">
                {{ 'Clear All' | translate }}
              </button>
            </div>
          </div>
        }

        <!-- Country Filters (shown only when relevant) -->
        @if (showCountryFilters()) {
          <div class="mb-6">
            <h3 class="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ 'Filter by Countries' | translate }}
            </h3>
            <div class="max-h-48 space-y-2 overflow-y-auto rounded-lg border border-gray-200 p-3 dark:border-gray-700">
              @for (country of availableCountriesWithSelection(); track country.id) {
                <label
                  class="flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-gray-50 dark:hover:bg-slate-700"
                  [for]="'country-checkbox-' + country.id"
                >
                  <input
                    type="checkbox"
                    [id]="'country-checkbox-' + country.id"
                    [(ngModel)]="country.selected"
                    [name]="'country-' + country.id"
                    class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <span class="text-sm text-gray-700 dark:text-gray-300">
                    {{ country.name }}
                  </span>
                </label>
              }
            </div>
            <div class="mt-2 flex gap-2">
              <button type="button" tuiButton appearance="secondary" size="xs" (click)="selectAllCountries()">
                {{ 'Select All' | translate }}
              </button>
              <button type="button" tuiButton appearance="secondary" size="xs" (click)="clearAllCountries()">
                {{ 'Clear All' | translate }}
              </button>
            </div>
          </div>
        }

        <!-- Headquarter Filters (shown only when relevant) -->
        @if (showHeadquarterFilters()) {
          <div class="mb-6">
            <h3 class="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ 'Filter by Headquarters' | translate }}
            </h3>
            <div class="max-h-48 space-y-2 overflow-y-auto rounded-lg border border-gray-200 p-3 dark:border-gray-700">
              @for (hq of availableHeadquartersWithSelection(); track hq.id) {
                <label
                  class="flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-gray-50 dark:hover:bg-slate-700"
                  [for]="'hq-checkbox-' + hq.id"
                >
                  <input
                    type="checkbox"
                    [id]="'hq-checkbox-' + hq.id"
                    [(ngModel)]="hq.selected"
                    [name]="'hq-' + hq.id"
                    class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <span class="text-sm text-gray-700 dark:text-gray-300">
                    {{ hq.name }}
                  </span>
                </label>
              }
            </div>
            <div class="mt-2 flex gap-2">
              <button type="button" tuiButton appearance="secondary" size="xs" (click)="selectAllHeadquarters()">
                {{ 'Select All' | translate }}
              </button>
              <button type="button" tuiButton appearance="secondary" size="xs" (click)="clearAllHeadquarters()">
                {{ 'Clear All' | translate }}
              </button>
            </div>
          </div>
        }

        <!-- Additional Options -->
        <div class="mb-6">
          <label class="flex cursor-pointer items-center gap-2" for="include-inactive-checkbox">
            <input
              type="checkbox"
              id="include-inactive-checkbox"
              [(ngModel)]="includeInactive"
              name="includeInactive"
              class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
            />
            <span class="text-sm text-gray-700 dark:text-gray-300">
              {{ 'Include inactive agreements' | translate }}
            </span>
          </label>
        </div>

        <!-- Search Info -->
        @if (lastSearchResult()) {
          <div class="mb-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <p class="text-sm text-blue-700 dark:text-blue-300">
              {{ 'Last search found' | translate }}
              <strong>{{ lastSearchResult()!.totalCount }}</strong>
              {{ 'results' | translate }}
            </p>
          </div>
        }

        <!-- Actions -->
        <div class="flex justify-end gap-3">
          <button type="button" tuiButton appearance="secondary" size="m" (click)="handleCancel()">
            {{ 'Cancel' | translate }}
          </button>
          <button type="submit" tuiButton appearance="primary" size="m" [disabled]="!canSearch() || searching()">
            @if (!searching()) {
              <tui-icon icon="@tui.search" class="mr-2" />
            }
            {{ 'Search' | translate }}
          </button>
        </div>
      </form>
    </div>

    <!-- Scope content template -->
    <ng-template #scopeContent let-item>
      <div class="flex items-center gap-2">
        <tui-icon [icon]="getScopeIcon(item)" />
        <span>{{ getScopeLabel(item) | translate }}</span>
      </div>
    </ng-template>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class AgreementSearchModalComponent {
  // Support both dialog and standalone usage
  visible = input<boolean>(true);
  initialCriteria = input<AgreementSearchCriteria>();
  countries = input<Array<{ id: string; name: string }>>([]);
  headquarters = input<Array<{ id: string; name: string }>>([]);

  searchSubmit = output<AgreementSearchCriteria>();
  cancelClick = output<void>();

  // Inject dialog context if available
  private readonly dialogContext = inject<
    TuiDialogContext<
      AgreementSearchCriteria,
      {
        initialCriteria?: AgreementSearchCriteria;
        countries?: Array<{ id: string; name: string }>;
        headquarters?: Array<{ id: string; name: string }>;
      }
    >
  >(POLYMORPHEUS_CONTEXT, { optional: true });

  searchTerm = signal('');
  searchScope = signal<'all' | 'agreements' | 'headquarters' | 'countries'>('all');
  includeInactive = signal(false);
  searching = signal(false);
  searchError = signal<string | null>(null);
  lastSearchResult = signal<AgreementSearchResult | null>(null);

  searchScopeOptions: Array<'all' | 'agreements' | 'headquarters' | 'countries'> = [
    'all',
    'agreements',
    'headquarters',
    'countries',
  ];

  // Get all roles from ROLES_CONSTANTS
  availableRoles = Object.entries(ROLES_CONSTANTS.ROLES)
    .map(([key, config]) => ({
      value: key,
      label: config.label,
      selected: false,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  // Countries and headquarters with selection state
  availableCountriesArray: Array<{ id: string; name: string; selected: boolean }> = [];
  availableHeadquartersArray: Array<{ id: string; name: string; selected: boolean }> = [];

  availableCountriesWithSelection = computed(() => {
    const countries = this.dialogContext?.data?.countries || this.countries() || [];
    // Update the array if the source changes
    if (this.availableCountriesArray.length !== countries.length) {
      this.availableCountriesArray = countries.map((c) => ({
        ...c,
        selected: false,
      }));
    }
    return this.availableCountriesArray;
  });

  availableHeadquartersWithSelection = computed(() => {
    const headquarters = this.dialogContext?.data?.headquarters || this.headquarters() || [];
    // Update the array if the source changes
    if (this.availableHeadquartersArray.length !== headquarters.length) {
      this.availableHeadquartersArray = headquarters.map((hq) => ({
        ...hq,
        selected: false,
      }));
    }
    return this.availableHeadquartersArray;
  });

  showRoleFilters = computed(() => {
    const scope = this.searchScope();
    return scope === 'all' || scope === 'agreements';
  });

  showCountryFilters = computed(() => {
    const scope = this.searchScope();
    return scope === 'all' || scope === 'countries';
  });

  showHeadquarterFilters = computed(() => {
    const scope = this.searchScope();
    return scope === 'all' || scope === 'headquarters';
  });

  canSearch = computed(() => {
    const term = this.searchTerm().trim();
    return term.length >= 2 && !this.searchError() && !this.searching();
  });

  constructor() {
    // Initialize from initial criteria if provided
    const initial = this.dialogContext?.data?.initialCriteria || this.initialCriteria();
    if (initial) {
      this.searchTerm.set(initial.searchTerm);
      this.searchScope.set(initial.searchIn);
      this.includeInactive.set(initial.includeInactive || false);

      if (initial.roleFilters) {
        initial.roleFilters.forEach((role) => {
          const roleItem = this.availableRoles.find((r) => r.value === role);
          if (roleItem) {
            roleItem.selected = true;
          }
        });
      }

      // Country and headquarter filters will be set when the arrays are initialized in the computed properties
    }
  }

  validateSearch(): void {
    const term = this.searchTerm().trim();
    if (term.length === 0) {
      this.searchError.set(null);
    } else if (term.length < 2) {
      this.searchError.set('Search term must be at least 2 characters');
    } else {
      this.searchError.set(null);
    }
  }

  selectAllRoles(): void {
    this.availableRoles.forEach((role) => (role.selected = true));
  }

  clearAllRoles(): void {
    this.availableRoles.forEach((role) => (role.selected = false));
  }

  selectAllCountries(): void {
    this.availableCountriesArray.forEach((country) => (country.selected = true));
  }

  clearAllCountries(): void {
    this.availableCountriesArray.forEach((country) => (country.selected = false));
  }

  selectAllHeadquarters(): void {
    this.availableHeadquartersArray.forEach((hq) => (hq.selected = true));
  }

  clearAllHeadquarters(): void {
    this.availableHeadquartersArray.forEach((hq) => (hq.selected = false));
  }

  performSearch(): void {
    if (!this.canSearch()) return;

    const selectedRoles = this.availableRoles.filter((role) => role.selected).map((role) => role.value);

    const selectedCountries = this.availableCountriesArray
      .filter((country) => country.selected)
      .map((country) => country.id);

    const selectedHeadquarters = this.availableHeadquartersArray.filter((hq) => hq.selected).map((hq) => hq.id);

    const criteria: AgreementSearchCriteria = {
      searchTerm: this.searchTerm().trim(),
      searchIn: this.searchScope(),
      includeInactive: this.includeInactive(),
      roleFilters: selectedRoles.length > 0 ? selectedRoles : undefined,
      countryFilters: selectedCountries.length > 0 ? selectedCountries : undefined,
      headquarterFilters: selectedHeadquarters.length > 0 ? selectedHeadquarters : undefined,
    };

    // If in dialog mode, complete with criteria
    if (this.dialogContext) {
      this.dialogContext.completeWith(criteria);
    } else {
      this.searchSubmit.emit(criteria);
    }
  }

  handleCancel(): void {
    if (this.dialogContext) {
      this.dialogContext.completeWith(null as unknown as AgreementSearchCriteria);
    } else {
      this.cancelClick.emit();
    }
  }

  getScopeIcon(scope: string): string {
    switch (scope) {
      case 'all':
        return '@tui.layers';
      case 'agreements':
        return '@tui.file-text';
      case 'headquarters':
        return '@tui.building';
      case 'countries':
        return '@tui.globe';
      default:
        return '@tui.search';
    }
  }

  getScopeLabel(scope: string): string {
    switch (scope) {
      case 'all':
        return 'All Fields';
      case 'agreements':
        return 'Agreement Details';
      case 'headquarters':
        return 'Headquarters';
      case 'countries':
        return 'Countries';
      default:
        return scope;
    }
  }

  // Method to update search result count (called by parent)
  updateSearchResult(result: AgreementSearchResult): void {
    this.lastSearchResult.set(result);
    this.searching.set(false);
  }

  // Method to set searching state (called by parent)
  setSearching(isSearching: boolean): void {
    this.searching.set(isSearching);
  }
}
