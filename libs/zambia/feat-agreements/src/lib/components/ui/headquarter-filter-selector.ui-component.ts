import { ChangeDetectionStrategy, Component, computed, effect, inject, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiButton } from '@taiga-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { AgreementsFacadeService } from '../../services/agreements-facade.service';

export interface HeadquarterOption {
  value: string | 'all';
  label: string;
  address?: string;
  status?: string;
}

@Component({
  selector: 'z-headquarter-filter-selector',
  standalone: true,
  imports: [FormsModule, TranslateModule, TuiButton],
  template: `
    <div class="headquarter-filter-selector">
      <label for="headquarter-select" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {{ 'filter_by_headquarter' | translate }}
      </label>

      <select
        id="headquarter-select"
        [(ngModel)]="selectedHeadquarter"
        class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:border-sky-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
      >
        <option value="all">{{ 'all_headquarters' | translate }}</option>
        @for (hq of headquarterOptions(); track hq.id) {
          <option [value]="hq.id">{{ hq.name }}</option>
        }
      </select>

      @if (showClearButton()) {
        <button tuiButton appearance="secondary" size="xs" iconStart="@tui.x" class="mt-2" (click)="clearSelection()">
          {{ 'clear_filter' | translate }}
        </button>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .headquarter-filter-selector {
        position: relative;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeadquarterFilterSelectorComponent {
  private agreementsFacade = inject(AgreementsFacadeService);

  selectedHeadquarter = model<string | 'all'>('all');
  headquarterChanged = output<string | 'all'>();

  private headquarters = computed(() => {
    return this.agreementsFacade.headquartersResource() || [];
  });

  protected headquarterOptions = computed(() => {
    return this.headquarters();
  });

  protected headquarterValues = computed(() => {
    const values: Array<string | 'all'> = ['all'];

    this.headquarters().forEach((hq) => {
      if (hq.id) {
        values.push(hq.id);
      }
    });

    return values;
  });

  protected selectedHeadquarterLabel = computed(() => {
    const selected = this.selectedHeadquarter();
    if (selected === 'all') {
      return 'all_headquarters';
    }

    const hq = this.headquarters().find((h) => h.id === selected);
    return hq?.name || selected;
  });

  protected showClearButton = computed(() => this.selectedHeadquarter() !== 'all');

  constructor() {
    this.agreementsFacade.headquarters.reload();

    effect(() => {
      const headquarter = this.selectedHeadquarter();
      this.headquarterChanged.emit(headquarter);
    });
  }

  protected clearSelection(): void {
    this.selectedHeadquarter.set('all');
  }

  protected getHeadquarterLabel = (value: string | 'all'): string => {
    if (value === 'all') {
      return 'All Headquarters';
    }

    const hq = this.headquarters().find((h) => h.id === value);
    return hq?.name || value;
  };

  protected getHeadquarterAddress(value: string | 'all'): string | undefined {
    if (value === 'all') {
      return undefined;
    }

    const hq = this.headquarters().find((h) => h.id === value);
    return hq?.address || undefined;
  }

  protected getHeadquarterStatus(value: string | 'all'): string | undefined {
    if (value === 'all') {
      return undefined;
    }

    const hq = this.headquarters().find((h) => h.id === value);
    return hq?.status || undefined;
  }
}
