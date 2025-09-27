import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnChanges, inject } from '@angular/core';
import { TableAction } from '@zambia/ui-table-primitives';

@Directive({
  selector: '[zTableActionVisible]',
  standalone: true,
})
export class TableActionVisibleDirective<T = any> implements OnInit, OnChanges {
  @Input('zTableActionVisible') action!: TableAction<T>;
  @Input('zTableActionVisibleRow') row!: T;

  private hasView = false;
  private templateRef = inject(TemplateRef);
  private viewContainer = inject(ViewContainerRef);

  ngOnInit(): void {
    this.updateView();
  }

  ngOnChanges(): void {
    this.updateView();
  }

  private updateView(): void {
    const shouldShow = this.shouldShowAction();

    if (shouldShow && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!shouldShow && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }

  private shouldShowAction(): boolean {
    if (!this.action) return false;

    // If no visible function, always show
    if (!this.action.visible) return true;

    // Otherwise, use the visible function
    return this.action.visible(this.row);
  }
}
