import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatMiniFabButton } from '@angular/material/button';
import { LayoutService } from '../../layout/layout.service';

@Component({
  selector: 'z-sidebar-toggle',
  standalone: true,
  imports: [CommonModule, MatIcon, MatMiniFabButton],
  template: `
    <div class="hidden lg:block">
      <button (click)="layoutService.toggleSidebar()" mat-mini-fab aria-label="Abrir/Cerrar menu">
        <mat-icon>menu</mat-icon>
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarToggleComponent {
  readonly layoutService = inject(LayoutService);
}
