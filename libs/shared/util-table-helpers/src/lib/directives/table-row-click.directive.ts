import { Directive, HostListener, input, output } from '@angular/core';

@Directive({
  selector: '[zTableRowClick]',
  standalone: true,
})
export class TableRowClickDirective<T = any> {
  rowData = input.required<T>({ alias: 'zTableRowClick' });
  clickable = input(true);
  rowClick = output<T>();

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    if (!this.clickable()) return;

    // Prevent click if it's from an action button or interactive element
    const target = event.target as HTMLElement;
    const isInteractive = target.closest('button, a, input, select, textarea, [role="button"]');

    if (!isInteractive) {
      event.stopPropagation();
      this.rowClick.emit(this.rowData());
    }
  }

  @HostListener('keydown.enter', ['$event'])
  @HostListener('keydown.space', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!this.clickable()) return;

    // Prevent if it's from an interactive element
    const target = event.target as HTMLElement;
    const isInteractive = target.closest('button, a, input, select, textarea, [role="button"]');

    if (!isInteractive) {
      event.preventDefault();
      this.rowClick.emit(this.rowData());
    }
  }
}
