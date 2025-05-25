import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgreementsService } from '@zambia/data-access-dashboard';

interface AgreementStats {
  pending: number;
  approved: number;
  userCreated: number;
  rejected: number;
  total: number;
}

@Component({
  selector: 'z-agreements',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-full overflow-auto bg-gray-50 p-6 dark:bg-gray-900">
      <h2 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Gestión de Acuerdos</h2>

      @if (agreementsService.agreementsResource.isLoading()) {
        <div class="loading">Loading agreements...</div>
      } @else if (agreementsService.agreementsResource.error()) {
        <div class="error">Error loading agreements: {{ agreementsService.agreementsResource.error() }}</div>
      } @else {
        @let value = agreementsService.agreementsResource?.value();

        <pre>{{ value | json }}</pre>

        <!-- Pagination -->
        <div class="pagination">
          @for (i of agreementsService.getPaginationRange(); track i) {
            <button [class.active]="i === agreementsService.page()" (click)="agreementsService.updatePage(i)">
              {{ i }}
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgreementsSmartComponent {
  protected agreementsService = inject(AgreementsService);

  public searchTerm = signal<string>('');

  public localAgreementStats = signal<AgreementStats>({
    pending: 0,
    approved: 0,
    userCreated: 0,
    rejected: 0,
    total: 0,
  });
}
