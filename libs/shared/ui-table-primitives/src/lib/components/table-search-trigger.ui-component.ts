import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';

import { TuiButton } from '@taiga-ui/core';
import { TableSearchConfig } from '../types/table-primitives.types';

@Component({
  selector: 'z-table-search-trigger',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TuiButton],
  template: `
    <button
      tuiButton
      type="button"
      [appearance]="appearance()"
      [size]="size()"
      icon="@tui.search"
      (click)="searchClick.emit()"
      [attr.aria-label]="config().placeholder || 'Open search'"
    >
      @if (showLabel()) {
        {{ label() || 'Search' }}
      }
    </button>
  `,
  styles: [
    `
      :host {
        display: inline-block;
      }
    `,
  ],
})
export class TableSearchTriggerComponent {
  config = input.required<TableSearchConfig>();
  appearance = input<'primary' | 'secondary' | 'accent' | 'destructive' | 'flat' | 'outline'>('secondary');
  size = input<'xs' | 's' | 'm' | 'l'>('m');
  showLabel = input<boolean>(true);
  label = input<string>();

  searchClick = output<void>();
}
