import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'z-content-page-container,[z-content-page-container]',
  imports: [CommonModule],
  template: `<ng-content />`,
  styles: ``,
  host: {
    class: 'container mx-auto px-4 py-6 sm:px-6 sm:py-8',
  },
})
export class ContentPageContainerComponent {}
