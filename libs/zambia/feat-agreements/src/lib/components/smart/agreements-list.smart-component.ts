import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Agreement, AgreementsFacadeService } from '../../services/agreements-facade.service';
import { GenericTableUiComponent } from '@zambia/ui-components';

@Component({
  selector: 'z-agreements-list',
  standalone: true,
  imports: [CommonModule, RouterModule, GenericTableUiComponent],
  template: `
    <div class="container mx-auto p-6">
      <h2 class="mb-6 text-2xl font-bold text-gray-800 dark:text-white">Agreements</h2>
      <z-generic-table
        [items]="agreementsFacade.agreementsResource()"
        [loading]="agreementsFacade.agreements.isLoading()"
        (itemsSelectionChange)="onItemsSelectionChange($event)"
      ></z-generic-table>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgreementsListSmartComponent {
  agreementsFacade = inject(AgreementsFacadeService);

  onItemsSelectionChange($event: Agreement[]) {
    // todo
    console.log($event);
  }
}
