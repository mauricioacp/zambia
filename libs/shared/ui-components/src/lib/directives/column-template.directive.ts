import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[zColumnTemplate]',
  standalone: true,
})
export class ColumnTemplateDirective<T> {
  @Input('zColumnTemplate') columnName!: string;

  constructor(public template: TemplateRef<T>) {}
}
