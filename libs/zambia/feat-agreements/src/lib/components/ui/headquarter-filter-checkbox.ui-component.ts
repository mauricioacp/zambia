import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, model, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiButton, TuiDropdown, TuiDataList } from '@taiga-ui/core';
import { TuiBadge } from '@taiga-ui/kit';
import { TranslateModule } from '@ngx-translate/core';
import { AgreementsFacadeService } from '../../services/agreements-facade.service';

@Component({
  selector: 'z-headquarter-filter-checkbox',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, TuiButton, TuiDropdown, TuiDataList, TuiBadge],
  template: `
    <div class="relative">
      <button
        tuiButton
        appearance="secondary"
        size="m"
        iconStart="@tui.building"
        [tuiDropdown]="dropdown"
        [tuiDropdownOpen]="dropdownOpen()"
        (tuiDropdownOpenChange)="dropdownOpen.set($event)"
      >
        {{ 'headquarter_filter' | translate }}
        @if (selectedCount() > 0) {
          <tui-badge class="ml-2" size="s" status="info">
            {{ selectedCount() }}
          </tui-badge>
        }
      </button>

      <ng-template #dropdown>
        <tui-data-list>
          <div class="p-4" (click)="$event.stopPropagation()" role="none">
            <div class="mb-3 flex items-center justify-between">
              <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {{ 'filter_by_headquarters' | translate }}
              </h4>
              @if (selectedCount() > 0) {
                <button tuiButton appearance="flat" size="xs" (click)="clearAll()">
                  {{ 'clear_all' | translate }}
                </button>
              }
            </div>

            <div class="max-h-80 overflow-y-auto">
              @if (headquarters().length === 0) {
                <div class="py-4 text-center text-sm text-gray-500">{{ 'loading' | translate }}...</div>
              } @else {
                @for (hq of headquarters(); track hq.id) {
                  <div
                    class="flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-gray-50 dark:hover:bg-slate-700"
                  >
                    <input
                      type="checkbox"
                      [id]="'hq-' + hq.id"
                      class="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                      [checked]="isHeadquarterSelected(hq.id)"
                      (change)="toggleHeadquarter(hq.id)"
                    />
                    <label [for]="'hq-' + hq.id" class="flex-1 cursor-pointer">
                      <div class="text-sm font-medium">{{ hq.name }}</div>
                      @if (hq.address) {
                        <div class="text-xs text-gray-500">{{ hq.address }}</div>
                      }
                    </label>
                    @if (hq.status) {
                      <span
                        class="text-xs"
                        [class.text-green-600]="hq.status === 'active'"
                        [class.text-gray-400]="hq.status === 'inactive'"
                      >
                        {{ hq.status }}
                      </span>
                    }
                  </div>
                }
              }
            </div>

            <div class="mt-3 flex justify-end gap-2 border-t border-gray-200 pt-3 dark:border-slate-700">
              <button tuiButton appearance="secondary" size="s" (click)="dropdownOpen.set(false)">
                {{ 'close' | translate }}
              </button>
              <button tuiButton appearance="primary" size="s" (click)="applyFilters()">
                {{ 'apply_filters' | translate }}
              </button>
            </div>
          </div>
        </tui-data-list>
      </ng-template>
    </div>
  `,
  styles: [
    `
      :host {
        display: inline-block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeadquarterFilterCheckboxComponent {
  private agreementsFacade = inject(AgreementsFacadeService);
  selectedHeadquarters = model<string[]>([]);
  headquartersChanged = output<string[]>();
  dropdownOpen = signal(false);

  headquarters = computed(() => {
    return this.agreementsFacade.headquartersResource() || [];
  });

  selectedCount = computed(() => this.selectedHeadquarters().length);

  constructor() {
    this.agreementsFacade.headquarters.reload();
    effect(() => {
      const headquarters = this.selectedHeadquarters();
      this.headquartersChanged.emit(headquarters);
    });
  }

  isHeadquarterSelected(headquarterId: string): boolean {
    return this.selectedHeadquarters().includes(headquarterId);
  }

  toggleHeadquarter(headquarterId: string): void {
    const currentHeadquarters = [...this.selectedHeadquarters()];
    const index = currentHeadquarters.indexOf(headquarterId);

    if (index > -1) {
      currentHeadquarters.splice(index, 1);
    } else {
      currentHeadquarters.push(headquarterId);
    }

    this.selectedHeadquarters.set(currentHeadquarters);
  }

  clearAll(): void {
    this.selectedHeadquarters.set([]);
  }

  applyFilters(): void {
    this.dropdownOpen.set(false);
    // The effect will automatically emit the changes
  }
}
