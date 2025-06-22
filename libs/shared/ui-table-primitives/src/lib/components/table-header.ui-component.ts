import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TABLE_STYLES, tableClass } from '../constants/table-styles.constants';

@Component({
  selector: 'z-table-header',
  imports: [CommonModule],
  template: `
    <div [class]="headerClass()">
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <h2 [class]="TABLE_STYLES.header.title">{{ title() }}</h2>
          @if (description()) {
            <p [class]="TABLE_STYLES.header.description">{{ description() }}</p>
          }
        </div>
        @if (showActions()) {
          <div class="flex items-center gap-2">
            <ng-content></ng-content>
          </div>
        }
      </div>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableHeaderComponent {
  readonly title = input.required<string>();
  readonly description = input<string>();
  readonly showActions = input<boolean>(true);
  readonly useGlassEffect = input<boolean>(false);

  protected readonly TABLE_STYLES = TABLE_STYLES;

  protected headerClass() {
    return tableClass(this.useGlassEffect() ? TABLE_STYLES.header.glass : TABLE_STYLES.header.base);
  }
}
