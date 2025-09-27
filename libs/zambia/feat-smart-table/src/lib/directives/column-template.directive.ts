import { Directive, Input, TemplateRef } from '@angular/core';

/**
 * Directive for defining custom column templates in the enhanced table
 * Usage: <ng-template zColumnTemplate="columnName" let-item>...</ng-template>
 */
@Directive({
  selector: '[zColumnTemplate]',
})
export class ColumnTemplateDirective<T = unknown> {
  @Input('zColumnTemplate') columnName!: string;
  public template: TemplateRef<{ $implicit: T; item: T }> | undefined;
}
