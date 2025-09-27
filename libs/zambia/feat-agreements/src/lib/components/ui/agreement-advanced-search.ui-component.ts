import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TuiButton, TuiIcon, TuiTextfield, TuiDialogContext } from '@taiga-ui/core';
import { TuiChip, TuiSelect, TuiDataListWrapper } from '@taiga-ui/kit';
import { TranslateModule } from '@ngx-translate/core';
import { POLYMORPHEUS_CONTEXT } from '@taiga-ui/polymorpheus';
import { AgreementSearchCriteria } from './agreement-search-modal.ui-component';

export interface FilterOption {
  id: string;
  name: string;
}

export interface AdvancedSearchData {
  roles: FilterOption[];
  countries: FilterOption[];
  headquarters: FilterOption[];
  initialCriteria: AgreementSearchCriteria | null;
}

@Component({
  selector: 'z-agreement-advanced-search',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    TuiButton,
    TuiIcon,
    TuiTextfield,
    TuiChip,
    TuiSelect,
    TuiDataListWrapper,
  ],
  template: `
    <div class="flex h-full flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-slate-700">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white">
          {{ 'advanced_search' | translate }}
        </h2>
        <button tuiButton appearance="secondary" size="s" iconStart="@tui.x" (click)="cancel()">
          {{ 'close' | translate }}
        </button>
      </div>

      <!-- Body -->
      <div class="flex-1 overflow-y-auto px-6 py-4">
        <form [formGroup]="searchForm" class="space-y-6">
          <!-- Search Term -->
          <div>
            <label for="search-term" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ 'search_term' | translate }}
            </label>
            <tui-textfield size="m">
              <input
                id="search-term"
                tuiTextfield
                formControlName="searchTerm"
                placeholder="{{ 'enter_search_term' | translate }}"
              />
            </tui-textfield>
          </div>

          <!-- Search Scope -->
          <div>
            <label for="search-scope" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ 'search_in' | translate }}
            </label>
            <tui-select formControlName="searchIn">
              <input id="search-scope" tuiTextfield [value]="currentScopeLabel() | translate" />
              <tui-data-list-wrapper
                *tuiTextfieldDropdown
                [items]="searchScopes"
                [itemContent]="scopeContent"
              ></tui-data-list-wrapper>
            </tui-select>

            <ng-template #scopeContent let-item>
              <div class="flex items-center gap-2">
                <tui-icon [icon]="item.icon" class="text-gray-500"></tui-icon>
                <span>{{ item.label | translate }}</span>
              </div>
            </ng-template>
          </div>

          <!-- Role Filters -->
          <div>
            <h3 class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ 'filter_by_roles' | translate }}
            </h3>
            <div class="space-y-2 rounded-lg border border-gray-200 p-3 dark:border-slate-700">
              @for (role of data.roles; track role) {
                <div class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    [id]="'role-' + role.id"
                    class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    [checked]="isRoleSelected(role.id)"
                    (change)="toggleRole(role.id)"
                  />
                  <label [for]="'role-' + role.id" class="cursor-pointer text-sm">{{ role.name }}</label>
                </div>
              }
            </div>
          </div>

          <!-- Country Filters -->
          <div>
            <h3 class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ 'filter_by_countries' | translate }}
            </h3>
            <div class="space-y-2 rounded-lg border border-gray-200 p-3 dark:border-slate-700">
              @for (country of data.countries; track country) {
                <div class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    [id]="'country-' + country.id"
                    class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    [checked]="isCountrySelected(country.id)"
                    (change)="toggleCountry(country.id)"
                  />
                  <label [for]="'country-' + country.id" class="cursor-pointer text-sm">{{ country.name }}</label>
                </div>
              }
            </div>
          </div>

          <!-- Headquarter Filters -->
          <div>
            <h3 class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ 'filter_by_headquarters' | translate }}
            </h3>
            <div class="space-y-2 rounded-lg border border-gray-200 p-3 dark:border-slate-700">
              @for (hq of data.headquarters; track hq) {
                <div class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    [id]="'hq-' + hq.id"
                    class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    [checked]="isHeadquarterSelected(hq.id)"
                    (change)="toggleHeadquarter(hq.id)"
                  />
                  <label [for]="'hq-' + hq.id" class="cursor-pointer text-sm">{{ hq.name }}</label>
                </div>
              }
            </div>
          </div>

          <!-- Include Inactive -->
          <div class="flex items-center gap-3 rounded-lg bg-gray-50 p-4 dark:bg-slate-800">
            <input
              type="checkbox"
              id="include-inactive"
              class="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              formControlName="includeInactive"
            />
            <label for="include-inactive" class="cursor-pointer">{{ 'include_inactive_agreements' | translate }}</label>
          </div>

          <!-- Active Filters Summary -->
          @if (hasFilters()) {
            <div class="space-y-2">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ 'active_filters' | translate }}:</p>
              <div class="flex flex-wrap gap-2">
                @for (filter of getActiveFilters(); track filter) {
                  <tui-chip size="s" class="cursor-pointer" (click)="removeFilter(filter)">
                    <tui-icon [icon]="filter.icon" class="mr-1"></tui-icon>
                    {{ filter.label }}
                    <tui-icon icon="@tui.x" class="ml-1"></tui-icon>
                  </tui-chip>
                }
              </div>
            </div>
          }
        </form>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between border-t border-gray-200 px-6 py-4 dark:border-slate-700">
        <button
          tuiButton
          appearance="secondary"
          size="m"
          iconStart="@tui.rotate-ccw"
          (click)="clearAll()"
          [disabled]="!hasSearchCriteria()"
        >
          {{ 'clear_all' | translate }}
        </button>
        <div class="flex gap-3">
          <button tuiButton appearance="secondary" size="m" (click)="cancel()">
            {{ 'cancel' | translate }}
          </button>
          <button
            tuiButton
            appearance="primary"
            size="m"
            iconStart="@tui.search"
            (click)="applySearch()"
            [disabled]="!hasSearchCriteria()"
          >
            {{ 'search' | translate }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgreementAdvancedSearchComponent {
  private readonly context =
    inject<TuiDialogContext<AgreementSearchCriteria | null, AdvancedSearchData>>(POLYMORPHEUS_CONTEXT);

  protected data = this.context.data;

  // Form
  protected searchForm = new FormGroup({
    searchTerm: new FormControl(''),
    searchIn: new FormControl<'all' | 'agreements' | 'headquarters' | 'countries'>('all'),
    includeInactive: new FormControl(false),
  });

  // State
  protected selectedRoles = signal<Set<string>>(new Set());
  protected selectedCountries = signal<Set<string>>(new Set());
  protected selectedHeadquarters = signal<Set<string>>(new Set());

  // Search scopes
  protected searchScopes = [
    { value: 'all', label: 'all_fields', icon: '@tui.file-text' },
    { value: 'agreements', label: 'agreements', icon: '@tui.users' },
    { value: 'headquarters', label: 'headquarters', icon: '@tui.building' },
    { value: 'countries', label: 'countries', icon: '@tui.globe' },
  ];

  constructor() {
    // Load initial criteria if provided
    if (this.data.initialCriteria) {
      this.loadInitialCriteria(this.data.initialCriteria);
    }
  }

  private loadInitialCriteria(criteria: AgreementSearchCriteria): void {
    this.searchForm.patchValue({
      searchTerm: criteria.searchTerm,
      searchIn: criteria.searchIn,
      includeInactive: criteria.includeInactive,
    });

    this.selectedRoles.set(new Set(criteria.roleFilters));
    this.selectedCountries.set(new Set(criteria.countryFilters));
    this.selectedHeadquarters.set(new Set(criteria.headquarterFilters));
  }

  protected stringifyScope = (scope: string): string => {
    const found = this.searchScopes.find((s) => s.value === scope);
    return found ? found.label : scope;
  };

  protected currentScopeLabel = computed(() => {
    const value = this.searchForm.get('searchIn')?.value || 'all';
    const scope = this.searchScopes.find((s) => s.value === value);
    return scope?.label || 'all_fields';
  });

  protected isRoleSelected(id: string): boolean {
    return this.selectedRoles().has(id);
  }

  protected toggleRole(id: string): void {
    const roles = new Set(this.selectedRoles());
    if (roles.has(id)) {
      roles.delete(id);
    } else {
      roles.add(id);
    }
    this.selectedRoles.set(roles);
  }

  protected isCountrySelected(id: string): boolean {
    return this.selectedCountries().has(id);
  }

  protected toggleCountry(id: string): void {
    const countries = new Set(this.selectedCountries());
    if (countries.has(id)) {
      countries.delete(id);
    } else {
      countries.add(id);
    }
    this.selectedCountries.set(countries);
  }

  protected isHeadquarterSelected(id: string): boolean {
    return this.selectedHeadquarters().has(id);
  }

  protected toggleHeadquarter(id: string): void {
    const headquarters = new Set(this.selectedHeadquarters());
    if (headquarters.has(id)) {
      headquarters.delete(id);
    } else {
      headquarters.add(id);
    }
    this.selectedHeadquarters.set(headquarters);
  }

  protected hasSearchCriteria(): boolean {
    const value = this.searchForm.value;
    return !!(
      value.searchTerm ||
      this.selectedRoles().size > 0 ||
      this.selectedCountries().size > 0 ||
      this.selectedHeadquarters().size > 0
    );
  }

  protected hasFilters(): boolean {
    return this.selectedRoles().size > 0 || this.selectedCountries().size > 0 || this.selectedHeadquarters().size > 0;
  }

  protected getActiveFilters(): { type: string; label: string; icon: string }[] {
    const filters: { type: string; label: string; icon: string }[] = [];

    this.selectedRoles().forEach((id) => {
      const role = this.data.roles.find((r) => r.id === id);
      if (role) {
        filters.push({
          type: 'role',
          label: role.name,
          icon: '@tui.user',
        });
      }
    });

    this.selectedCountries().forEach((id) => {
      const country = this.data.countries.find((c) => c.id === id);
      if (country) {
        filters.push({
          type: 'country',
          label: country.name,
          icon: '@tui.globe',
        });
      }
    });

    this.selectedHeadquarters().forEach((id) => {
      const hq = this.data.headquarters.find((h) => h.id === id);
      if (hq) {
        filters.push({
          type: 'headquarter',
          label: hq.name,
          icon: '@tui.building',
        });
      }
    });

    return filters;
  }

  protected removeFilter(filter: { type: string; label: string; icon: string }): void {
    switch (filter.type) {
      case 'role': {
        const role = this.data.roles.find((r) => r.name === filter.label);
        if (role) this.toggleRole(role.id);
        break;
      }
      case 'country': {
        const country = this.data.countries.find((c) => c.name === filter.label);
        if (country) this.toggleCountry(country.id);
        break;
      }
      case 'headquarter': {
        const hq = this.data.headquarters.find((h) => h.name === filter.label);
        if (hq) this.toggleHeadquarter(hq.id);
        break;
      }
    }
  }

  protected clearAll(): void {
    this.searchForm.reset({
      searchTerm: '',
      searchIn: 'all',
      includeInactive: false,
    });
    this.selectedRoles.set(new Set());
    this.selectedCountries.set(new Set());
    this.selectedHeadquarters.set(new Set());
  }

  protected cancel(): void {
    this.context.completeWith(null);
  }

  protected applySearch(): void {
    const value = this.searchForm.value;
    const criteria: AgreementSearchCriteria = {
      searchTerm: value.searchTerm || '',
      searchIn: value.searchIn || 'all',
      roleFilters: Array.from(this.selectedRoles()),
      countryFilters: Array.from(this.selectedCountries()),
      headquarterFilters: Array.from(this.selectedHeadquarters()),
      includeInactive: value.includeInactive || false,
    };

    this.context.completeWith(criteria);
  }
}
